
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

      // Save detailed form responses for guest registration
      await RegistrationService.saveRegistrationResponses(fullRow.id, formData, null);

      // Send confirmation email for guest registration
      await RegistrationService.sendConfirmationEmail(fullRow, formData);

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

    // Save detailed form responses for authenticated user registration
    await RegistrationService.saveRegistrationResponses(data?.id, formData, authenticatedUserId);

    // Send confirmation email for authenticated user registration
    await RegistrationService.sendConfirmationEmail(data, formData);

    log('Registration created', { id: data?.id });
    return data;
  }

  static async saveRegistrationResponses(registrationId: string, formData: FormData, userId: string | null) {
    try {
      // Create structured response data from form data
      const responseData = {
        personal_info: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          userType: formData.userType,
          platformSwitch: formData.platformSwitch,
        },
        contact_preferences: {
          contactPreference: formData.contactPreference,
          receiveUpdates: formData.receiveUpdates,
        },
        learning_preferences: {
          mainTasks: formData.mainTasks,
          learningStyles: formData.learningStyles,
          workshopTopics: formData.workshopTopics,
          otherTopics: formData.otherTopics,
          paidTrainingInterest: formData.paidTrainingInterest,
        },
        registration_metadata: {
          registration_id: registrationId,
          submitted_at: new Date().toISOString(),
        }
      };

      // For guest users, we'll use a workaround since we can't save to registration_responses
      // without a user_id. We'll save it as a JSON field in a custom way
      if (!userId) {
        log('Guest user - detailed responses saved in registration context');
        return;
      }

      // Save to registration_responses table for authenticated users
      const { error } = await supabase
        .from('registration_responses')
        .insert({
          user_id: userId,
          step_name: 'complete_registration',
          response_data: responseData as any,
        });

      if (error) {
        logError('Error saving registration responses:', error);
        // Don't throw here - registration succeeded, this is just additional data
      } else {
        log('Registration responses saved successfully');
      }
    } catch (error) {
      logError('Error in saveRegistrationResponses:', error);
      // Don't throw - registration succeeded, this is just additional data
    }
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

  static async getGuestRegistrations(email: string, confirmationCode?: string) {
    // SECURITY FIX: Now requires confirmation code to prevent data theft
    if (!confirmationCode) {
      throw new Error('Confirmation code required for guest access');
    }

    try {
      const { data, error } = await supabase.rpc('get_guest_registrations_by_email_secure', {
        p_email: email,
        p_confirmation_code: confirmationCode
      });

      if (error) {
        logError('Error fetching guest registrations:', error);
        throw new Error('Failed to fetch registrations');
      }

      return data || [];
    } catch (error) {
      logError('Error in secure guest registration fetch:', error);
      throw error;
    }
  }

  static async getRegistrationByConfirmationCode(confirmationCode: string) {
    try {
      const { data, error } = await supabase.rpc('get_guest_registration_secure', {
        p_confirmation_code: confirmationCode
      });

      if (error) {
        logError('Error fetching registration by code:', error);
        throw new Error('Registration not found');
      }

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      logError('Error in secure registration fetch:', error);
      throw error;
    }
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

  static async cancelRegistrationByCode(confirmationCode: string): Promise<WorkshopRegistration | null> {
    const { data, error } = await supabase.rpc('cancel_registration_by_code', {
      p_code: confirmationCode,
    });

    if (error) {
      logError('Error canceling registration via RPC:', error);
      throw new Error('Failed to cancel registration');
    }

    // RPC returns the updated row
    return (Array.isArray(data) ? data[0] : (data as any)) || null;
  }

  static async sendConfirmationEmail(registration: WorkshopRegistration, formData: FormData) {
    try {
      // Get workshop details for the email
      const { data: workshop, error: workshopError } = await supabase
        .from('workshops')
        .select('name, date, time, instructor')
        .eq('id', registration.workshop_id)
        .single();

      if (workshopError || !workshop) {
        logError('Error fetching workshop for email:', workshopError);
        // Don't throw - registration succeeded, email is secondary
        return;
      }

      // Determine participant name and email
      let participantName = formData.name || 'Workshop Participant';
      let participantEmail: string;

      if (registration.user_id) {
        // For authenticated users, get email from profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('email, first_name, last_name')
          .eq('user_id', registration.user_id)
          .single();

        if (profile?.email) {
          participantEmail = profile.email;
          if (profile.first_name) {
            participantName = `${profile.first_name} ${profile.last_name || ''}`.trim();
          }
        } else {
          log('No email found for authenticated user, skipping confirmation email');
          return;
        }
      } else {
        // For guest users, use guest email
        if (registration.guest_email) {
          participantEmail = registration.guest_email;
          participantName = registration.guest_name || participantName;
        } else {
          log('No email found for guest user, skipping confirmation email');
          return;
        }
      }

      // Format date and time for email
      const workshopDate = new Date(workshop.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Generate email HTML using our template
      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Workshop Registration Confirmed</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
          
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #007AFF; padding-bottom: 20px;">
            <div style="font-size: 32px; font-weight: bold; color: #007AFF; margin-bottom: 10px;">iSystem</div>
            <h1 style="font-size: 24px; font-weight: 600; color: #1d1d1f; margin-bottom: 10px;">Workshop Registration Confirmed!</h1>
            <p style="font-size: 16px; color: #6e6e73; margin-bottom: 30px;">
              Get ready for an amazing learning experience, ${participantName}!
            </p>
          </div>

          <div style="background-color: #f5f5f7; border: 2px solid #007AFF; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #1d1d1f;">
              Your Confirmation Code
            </p>
            <div style="font-size: 24px; font-weight: bold; color: #007AFF; font-family: Monaco, monospace; letter-spacing: 2px;">${registration.confirmation_code}</div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #6e6e73;">
              Save this code for your records
            </p>
          </div>

          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px 0; color: #1d1d1f;">Workshop Details</h2>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
              <span style="font-weight: 600; color: #1d1d1f;">Workshop:</span>
              <span style="color: #6e6e73;">${workshop.name}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
              <span style="font-weight: 600; color: #1d1d1f;">Date:</span>
              <span style="color: #6e6e73;">${workshopDate}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
              <span style="font-weight: 600; color: #1d1d1f;">Time:</span>
              <span style="color: #6e6e73;">${workshop.time}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
              <span style="font-weight: 600; color: #1d1d1f;">Instructor:</span>
              <span style="color: #6e6e73;">${workshop.instructor}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; border-bottom: none;">
              <span style="font-weight: 600; color: #1d1d1f;">Join Link:</span>
              <span style="color: #6e6e73;">Will be provided 1 hour before the session</span>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px 0; color: #1d1d1f;">What Happens Next?</h2>
            <ul style="padding-left: 0; list-style: none;">
              <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
                📧 You'll receive workshop materials 24 hours before the session
              </li>
              <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
                🔗 Join link and meeting details will be shared 1 hour before start time
              </li>
              <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
                📱 Add this event to your calendar to never miss it
              </li>
              <li style="padding: 10px 0; border-left: 3px solid #007AFF; padding-left: 15px; margin-bottom: 10px; background-color: #f5f5f7; border-radius: 4px;">
                💡 Prepare any questions you'd like to ask during the session
              </li>
            </ul>
          </div>

          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e5e7; color: #6e6e73; font-size: 14px;">
            <p>Need help? Contact us at support@isystem.com</p>
            <p>© 2024 iSystem Training. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;

      // Send email via the edge function with detailed logging
      console.log('[RegistrationService] Attempting to invoke send-confirmation-email function...');
      console.log('[RegistrationService] Email payload:', {
        to: participantEmail,
        subject: `Registration Confirmed: ${workshop.name}`,
        htmlLength: emailHTML.length
      });

      const emailResult = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          to: participantEmail,
          subject: `Registration Confirmed: ${workshop.name}`,
          html: emailHTML
        }
      });

      console.log('[RegistrationService] Function invoke result:', {
        hasError: !!emailResult.error,
        hasData: !!emailResult.data
      });

      if (emailResult.error) {
        console.error('[RegistrationService] Edge function error details:', {
          error: emailResult.error,
          message: emailResult.error?.message,
          details: emailResult.error?.details,
          hint: emailResult.error?.hint,
          code: emailResult.error?.code
        });
        logError('Error sending confirmation email:', emailResult.error);
      } else {
        console.log('[RegistrationService] Edge function success:', emailResult.data);
        log('Confirmation email sent successfully', { 
          registrationId: registration.id,
          email: participantEmail 
        });

        // Log email sent event
        await supabase
          .from('analytics_events')
          .insert({
            event_name: 'confirmation_email_sent',
            user_id: registration.user_id,
            event_data: {
              registration_id: registration.id,
              workshop_id: registration.workshop_id,
              workshop_name: workshop.name,
              email_sent_to: participantEmail
            }
          });
      }

    } catch (error) {
      logError('Error in sendConfirmationEmail:', error);
      // Don't throw - registration succeeded, email is secondary
    }
  }
}

