import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Optional providers (only used if configured)
import { Resend } from "npm:resend@4.0.0";

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean);
const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : 'https://example.invalid',
  'Vary': 'Origin',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json'
});

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('Origin');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  try {
    // Enhanced debugging: Log all environment variables (safely)
    console.log('[send-confirmation-email] Starting email send process...');
    console.log('[send-confirmation-email] Request origin:', origin);
    
    // Debug environment variables (safely)
    const allEnvKeys = Object.keys(Deno.env.toObject());
    console.log('[send-confirmation-email] Available env keys:', allEnvKeys);
    
    const apiKey = Deno.env.get('RESEND_API_KEY');
    console.log('[send-confirmation-email] RESEND_API_KEY exists:', !!apiKey);
    console.log('[send-confirmation-email] RESEND_API_KEY length:', apiKey ? apiKey.length : 0);
    console.log('[send-confirmation-email] RESEND_API_KEY starts with re_:', apiKey ? apiKey.startsWith('re_') : false);

    const { to, subject, html }: EmailRequest = await req.json();
    console.log('[send-confirmation-email] Email request - to:', to, 'subject:', subject);

    if (!to || !subject || !html) {
      console.error('[send-confirmation-email] Missing required fields:', { to: !!to, subject: !!subject, html: !!html });
      return new Response(JSON.stringify({ error: 'missing_fields' }), { status: 400, headers: corsHeaders(origin) });
    }

    const provider = 'resend'; // Always use Resend
    const from = 'iSystem Training <noreply@isystemwoskhop.com>';

    // Enhanced error messaging for missing API key
    if (!apiKey || apiKey.trim() === '') {
      const errorMsg = 'RESEND_API_KEY is missing or empty';
      console.error(`[send-confirmation-email] ${errorMsg}`);
      console.error('[send-confirmation-email] This will prevent emails from being sent');
      return new Response(JSON.stringify({ 
        error: 'api_key_missing', 
        message: errorMsg,
        debug: {
          keyExists: !!apiKey,
          keyLength: apiKey ? apiKey.length : 0,
          envKeysAvailable: allEnvKeys.length
        }
      }), { status: 500, headers: corsHeaders(origin) });
    }

    if (provider === 'resend') {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({ from, to: [to], subject, html });
      return new Response(JSON.stringify(result), { status: 202, headers: corsHeaders(origin) });
    }

    // Fallback unsupported provider
    return new Response(JSON.stringify({ error: 'unsupported_provider' }), { status: 400, headers: corsHeaders(origin) });
  } catch (error: any) {
    console.error('[send-confirmation-email] Error:', error?.message || error);
    // Return 200 to avoid breaking UX if email fails, but include error marker
    return new Response(JSON.stringify({ status: 'error', reason: 'email_failed' }), { status: 200, headers: corsHeaders(req.headers.get('Origin')) });
  }
});
