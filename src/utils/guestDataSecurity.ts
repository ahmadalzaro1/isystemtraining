import { supabase } from '@/integrations/supabase/client';

// SECURE guest registration access - only via confirmation code
export const getRegistrationByCode = async (confirmationCode: string, guestEmail?: string) => {
  try {
    const { data, error } = await supabase.rpc('get_guest_registration_secure', {
      p_confirmation_code: confirmationCode,
      p_guest_email: guestEmail || null
    });

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
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

// Trigger enhanced guest data anonymization
export const anonymizeOldGuestData = async () => {
  try {
    const { data, error } = await supabase.rpc('anonymize_guest_data_enhanced');
    
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

// Enhanced rate limiting check for guest access
export const checkGuestAccessRateLimit = async () => {
  try {
    const { data, error } = await supabase.rpc('check_guest_access_rate_limit_enhanced');
    
    if (error) throw error;
    
    return {
      allowed: data === true,
      blocked: data === false
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return {
      allowed: false,
      blocked: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};