
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  registrationData?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, registrationData }: EmailRequest = await req.json();

    console.log('Email send request received:', { to, subject });
    console.log('Registration data:', registrationData);

    // TODO: Integrate with Resend when API key is provided
    // For now, just log the email details
    console.log('Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('HTML content length:', html.length);

    // Simulate successful email sending
    const mockResponse = {
      id: `mock-email-${Date.now()}`,
      status: 'sent',
      to,
      subject,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in send-confirmation-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Email sending foundation is ready, but Resend integration pending'
      }),
      {
        status: 200, // Return 200 so registration still works
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
