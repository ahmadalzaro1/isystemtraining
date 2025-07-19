import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/registration";

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
    console.log('Creating registration with:', { workshop_id, user_id, hasFormData: !!formData });
    
    // Get current auth state to ensure we have the latest user info
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    console.log('Current authenticated user:', currentUser?.id);
    
    // Use current user if available, otherwise fall back to provided user_id
    const authenticatedUserId = currentUser?.id || user_id;
    
    const registrationData = {
      workshop_id,
      user_id: authenticatedUserId || null,
      guest_email: !authenticatedUserId ? formData.email : null,
      guest_name: !authenticatedUserId ? formData.name : null,
      guest_phone: !authenticatedUserId ? formData.phone : null,
    };

    console.log('Registration data being inserted:', registrationData);

    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      console.error('Registration error details:', {
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

    console.log('Registration created successfully:', data);
    return data;
  }

  static async getUserRegistrations(userId: string) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('registration_date', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
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
      console.error('Error fetching guest registrations:', error);
      throw new Error('Failed to fetch registrations');
    }

    return data;
  }

  static async getRegistrationByConfirmationCode(confirmationCode: string) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('confirmation_code', confirmationCode)
      .single();

    if (error) {
      console.error('Error fetching registration:', error);
      return null;
    }

    return data;
  }

  static async updateRegistrationStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('workshop_registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating registration:', error);
      throw new Error('Failed to update registration');
    }

    return data;
  }
}
