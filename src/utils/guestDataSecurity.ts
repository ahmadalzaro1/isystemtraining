import { supabase } from '@/integrations/supabase/client';

// Secure helper for guest registration access  
export const getRegistrationByCode = async (confirmationCode: string) => {
  try {
    // Use the existing secure RPC function
    const { data, error } = await supabase.rpc('get_registration_by_code', {
      p_code: confirmationCode
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching guest registration:', error);
    throw error;
  }
};

// Mask sensitive guest data for admin views
export const maskGuestData = (email: string, name?: string, phone?: string) => {
  if (!email) return { email: '', name: '', phone: '' };
  
  // Check if already anonymized
  if (email.includes('anonymized_') || email.includes('@guest.local')) {
    return {
      email: 'Anonymized Guest',
      name: 'Anonymized Guest', 
      phone: 'Hidden'
    };
  }

  // Mask real data for privacy
  const [localPart, domain] = email.split('@');
  const maskedEmail = localPart.substring(0, 2) + '***@' + domain;
  
  return {
    email: maskedEmail,
    name: name ? name.substring(0, 2) + '***' : 'Guest',
    phone: phone ? '***-***-' + phone.slice(-4) : 'Hidden'
  };
};

// Trigger guest data anonymization
export const anonymizeOldGuestData = async () => {
  try {
    const { data, error } = await supabase.rpc('anonymize_old_guest_registrations');
    
    if (error) throw error;
    
    return {
      success: true,
      recordsAnonymized: data || 0
    };
  } catch (error) {
    console.error('Error anonymizing guest data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};