
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/registration";
import { log, error as logError } from "@/utils/logger";
import { z } from "zod";
import { isUUID } from "@/utils/uuid";

export interface WorkshopRegistration {
  id: string;
  workshop_id: string;
  user_id?: string;
  guest_email?: string;
  guest_name?: string;
  guest_phone?: string;
  registration_date: string;
  status: string;
  confirmation_code: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRegistrationData {
  workshop_id: string;
  formData: FormData;
  user_id?: string;
}

export class RegistrationService {
  static async createRegistration({ workshop_id, formData, user_id }: CreateRegistrationData) {
    log('Creating registration with', { workshop_id, hasUser: !!user_id, hasFormData: !!formData });
    
    // Validate workshop_id is a proper UUID to prevent DB errors
    try {
      z.string().uuid().parse(workshop_id);
    } catch {
      throw new Error('Invalid workshop identifier. Please re-select the workshop and try again.');
    }
    
    // Get current auth state to ensure we have the latest user info
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    log('Current authenticated user', { id: currentUser?.id });
    // Use current user if available, otherwise fall back to provided user_id
    const authenticatedUserId = currentUser?.id || user_id;

    // Guest flow: use secure RPC to handle capacity and race-conditions
    if (!authenticatedUserId) {
      log('No authenticated user detected — using RPC create_guest_registration');
      
      // Final runtime guard to fail closed before DB call
      if (!isUUID(workshop_id)) {
        throw new Error('Invalid workshop selection');
      }

      const { data: rpcData, error: rpcError } = await supabase.rpc('create_guest_registration', {
        p_workshop_id: workshop_id,
        p_email: formData.email,
        p_name: formData.name,
        p_phone: formData.phone,
      });

      if (rpcError) {
        logError('Guest registration RPC error:', {
          message: rpcError.message,
          code: rpcError.code,
          details: rpcError.details,
          hint: rpcError.hint,
        });

        const msg = rpcError.message?.toLowerCase() || '';
        if (msg.includes('workshop not found')) {
          throw new Error('Workshop not found. Please refresh and try again.');
        }
        if (msg.includes('workshop is full')) {
          throw new Error('This workshop is full. Please pick another time.');
        }
        throw new Error(`Registration failed: ${rpcError.message}`);
      }

      const confirmation_code = Array.isArray(rpcData) ? rpcData[0]?.confirmation_code : (rpcData as any)?.confirmation_code;
      if (!confirmation_code) {
        throw new Error('Registration created but no confirmation code was returned. Please contact support.');
      }

      // Fetch full row via security definer RPC to avoid RLS issues for guests
      const fullRow = await RegistrationService.getRegistrationByConfirmationCode(confirmation_code);
      if (!fullRow) {
        throw new Error('Could not retrieve registration details after creation. Please contact support.');
      }

      log('Guest registration created', { id: fullRow.id });
      return fullRow;
    }
    
    // Authenticated user flow: direct insert (RLS will allow with matching user_id)
    const registrationData = {
      workshop_id,
      user_id: authenticatedUserId,
      guest_email: null,
      guest_name: null,
      guest_phone: null,
    };

    log('Registration insert prepared for authenticated user');

    // Final runtime guard to fail closed before DB call
    if (!isUUID(registrationData.workshop_id)) {
      throw new Error('Invalid workshop selection');
    }

    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      logError('Registration error details:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      });
      
      // Provide more specific error messages
      if (error.message.includes('row-level security')) {
        throw new Error('Authentication required. Please sign in to register for workshops.');
      } else if (error.message.includes('violates check constraint')) {
        throw new Error('Please provide either a valid user account or guest information.');
      } else {
        throw new Error(`Registration failed: ${error.message}`);
      }
    }

    log('Registration created', { id: data?.id });
    return data;
  }

  static async getUserRegistrations(userId: string) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('registration_date', { ascending: false });

    if (error) {
      logError('Error fetching registrations:', error);
      throw new Error('Failed to fetch registrations');
    }

    return data;
  }

  static async getGuestRegistrations(email: string) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('guest_email', email)
      .order('registration_date', { ascending: false });

    if (error) {
      logError('Error fetching guest registrations:', error);
      throw new Error('Failed to fetch registrations');
    }

    return data;
  }

  static async getRegistrationByConfirmationCode(confirmationCode: string) {
    // Use security definer RPC so guests can look up without auth and without violating RLS
    const { data, error } = await supabase.rpc('get_registration_by_code', {
      p_code: confirmationCode
    });

    if (error) {
      logError('Error fetching registration via RPC:', error);
      return null;
    }

    // Function returns SETOF with limit 1; normalize to single row
    const row = Array.isArray(data) ? data[0] : data;
    return row || null;
  }

  static async updateRegistrationStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logError('Error updating registration:', error);
      throw new Error('Failed to update registration');
    }

    return data;
  }
}
