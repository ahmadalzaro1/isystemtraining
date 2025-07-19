
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/registration";
import { Workshop } from "@/types/workshop";

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
    const registrationData = {
      workshop_id,
      user_id: user_id || null,
      guest_email: !user_id ? formData.email : null,
      guest_name: !user_id ? formData.name : null,
      guest_phone: !user_id ? formData.phone : null,
    };

    const { data, error } = await supabase
      .from('workshop_registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register for workshop');
    }

    return data;
  }

  static async getUserRegistrations(userId: string) {
    console.log('getUserRegistrations - Querying for user ID:', userId);
    
    const { data, error } = await supabase
      .from('workshop_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('registration_date', { ascending: false });

    console.log('getUserRegistrations - Query result:', { data, error });

    if (error) {
      console.error('Error fetching registrations:', error);
      throw new Error('Failed to fetch registrations');
    }

    console.log('getUserRegistrations - Returning data:', data);
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
