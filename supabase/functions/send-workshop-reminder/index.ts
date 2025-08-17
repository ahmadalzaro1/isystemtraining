import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@4.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

interface ReminderEmailData {
  workshopName: string;
  workshopDate: string;
  workshopTime: string;
  participantName: string;
  confirmationCode: string;
  hoursUntil: number;
  joinLink?: string;
}

const generateReminderEmailHTML = (data: ReminderEmailData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Workshop Reminder - Starting Soon!</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
      
      <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #FF6B35; padding-bottom: 20px;">
        <div style="font-size: 32px; font-weight: bold; color: #007AFF; margin-bottom: 10px;">iSystem</div>
        <h1 style="font-size: 24px; font-weight: 600; color: #1d1d1f; margin-bottom: 10px;">Workshop Reminder</h1>
        <p style="font-size: 18px; color: #FF6B35; font-weight: 600; margin-bottom: 10px;">
          Starting in ${data.hoursUntil} ${data.hoursUntil === 1 ? 'hour' : 'hours'}!
        </p>
        <p style="font-size: 16px; color: #6e6e73;">
          Don't forget about your upcoming workshop, ${data.participantName}!
        </p>
      </div>

      <div style="background-color: #fff5f0; border: 2px solid #FF6B35; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0 0 10px 0; font-weight: 600; color: #1d1d1f;">
          Your Confirmation Code
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #FF6B35; font-family: Monaco, monospace; letter-spacing: 2px;">${data.confirmationCode}</div>
      </div>

      <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
        <h2 style="margin: 0 0 20px 0; color: #1d1d1f;">Workshop Details</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Workshop:</span>
          <span style="color: #6e6e73;">${data.workshopName}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Date:</span>
          <span style="color: #6e6e73;">${data.workshopDate}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e7;">
          <span style="font-weight: 600; color: #1d1d1f;">Time:</span>
          <span style="color: #6e6e73;">${data.workshopTime}</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; border-bottom: none;">
          <span style="font-weight: 600; color: #1d1d1f;">Join Link:</span>
          <span style="color: #6e6e73;">${data.joinLink || 'Check your email 1 hour before the session'}</span>
        </div>
      </div>

      ${data.joinLink ? `
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${data.joinLink}" style="background-color: #007AFF; color: white; padding: 15px 25px; border-radius: 8px; display: inline-block; font-weight: 600; text-decoration: none;">
          Join Workshop Now
        </a>
      </div>
      ` : ''}

      <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e5e7; color: #6e6e73; font-size: 14px;">
        <p>Need help? Contact us at support@isystem.com</p>
        <p>© 2024 iSystem Training. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting workshop reminder check...');

    // Calculate the time range for reminders (workshops starting in 24 hours ± 30 minutes)
    const now = new Date();
    const reminderTimeStart = new Date(now.getTime() + 23.5 * 60 * 60 * 1000); // 23.5 hours from now
    const reminderTimeEnd = new Date(now.getTime() + 24.5 * 60 * 60 * 1000);   // 24.5 hours from now

    console.log(`Looking for workshops between ${reminderTimeStart.toISOString()} and ${reminderTimeEnd.toISOString()}`);

    // Get workshops that are happening within the reminder window
    const { data: workshops, error: workshopsError } = await supabase
      .from('workshops')
      .select(`
        id,
        name,
        date,
        time,
        instructor,
        workshop_registrations (
          id,
          user_id,
          guest_email,
          guest_name,
          confirmation_code,
          status
        )
      `)
      .gte('date', reminderTimeStart.toISOString().split('T')[0])
      .lte('date', reminderTimeEnd.toISOString().split('T')[0])
      .eq('workshop_registrations.status', 'confirmed');

    if (workshopsError) {
      console.error('Error fetching workshops:', workshopsError);
      throw workshopsError;
    }

    console.log(`Found ${workshops?.length || 0} workshops in reminder window`);

    if (!workshops || workshops.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No workshops found in reminder window',
        remindersSent: 0 
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    let totalRemindersSent = 0;

    // Process each workshop
    for (const workshop of workshops) {
      const registrations = workshop.workshop_registrations || [];
      console.log(`Processing workshop "${workshop.name}" with ${registrations.length} registrations`);

      // Calculate exact hours until workshop
      const workshopDateTime = new Date(`${workshop.date}T${workshop.time}`);
      const hoursUntil = Math.round((workshopDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));

      // Only send reminder if it's within 20-28 hours (24 ± 4 hours buffer)
      if (hoursUntil < 20 || hoursUntil > 28) {
        console.log(`Skipping workshop "${workshop.name}" - ${hoursUntil} hours until start (outside reminder window)`);
        continue;
      }

      for (const registration of registrations) {
        try {
          // Determine email and name
          let email: string;
          let name: string;

          if (registration.user_id) {
            // Authenticated user - get profile data
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('email, first_name, last_name')
              .eq('user_id', registration.user_id)
              .single();

            if (!profile?.email) {
              console.log(`Skipping registration ${registration.id} - no email found for user`);
              continue;
            }

            email = profile.email;
            name = profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : 'Workshop Participant';
          } else {
            // Guest user
            if (!registration.guest_email) {
              console.log(`Skipping registration ${registration.id} - no guest email`);
              continue;
            }

            email = registration.guest_email;
            name = registration.guest_name || 'Workshop Participant';
          }

          // Check if reminder already sent for this registration
          const { data: existingReminder } = await supabase
            .from('analytics_events')
            .select('id')
            .eq('event_name', 'reminder_email_sent')
            .eq('event_data->>registration_id', registration.id)
            .single();

          if (existingReminder) {
            console.log(`Reminder already sent for registration ${registration.id}`);
            continue;
          }

          // Send reminder email if Resend is configured
          if (resend) {
            const emailData: ReminderEmailData = {
              workshopName: workshop.name,
              workshopDate: new Date(workshop.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              workshopTime: workshop.time,
              participantName: name,
              confirmationCode: registration.confirmation_code,
              hoursUntil,
              joinLink: undefined // Will be provided later
            };

            const emailHTML = generateReminderEmailHTML(emailData);

            const emailResult = await resend.emails.send({
              from: 'iSystem Training <notifications@resend.dev>',
              to: [email],
              subject: `Reminder: ${workshop.name} starts in ${hoursUntil} hours!`,
              html: emailHTML
            });

            if (emailResult.error) {
              console.error(`Failed to send reminder to ${email}:`, emailResult.error);
              continue;
            }

            console.log(`Reminder sent to ${email} for workshop "${workshop.name}"`);
            totalRemindersSent++;
          } else {
            console.log(`Resend not configured - would send reminder to ${email} for workshop "${workshop.name}"`);
          }

          // Log the reminder in analytics
          await supabase
            .from('analytics_events')
            .insert({
              event_name: 'reminder_email_sent',
              user_id: registration.user_id,
              event_data: {
                registration_id: registration.id,
                workshop_id: workshop.id,
                workshop_name: workshop.name,
                hours_until: hoursUntil,
                email_sent: !!resend
              }
            });

        } catch (error) {
          console.error(`Error processing registration ${registration.id}:`, error);
        }
      }
    }

    console.log(`Reminder check complete. Sent ${totalRemindersSent} reminders.`);

    return new Response(JSON.stringify({ 
      success: true, 
      remindersSent: totalRemindersSent,
      workshopsProcessed: workshops.length
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error: any) {
    console.error('Error in send-workshop-reminder function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});