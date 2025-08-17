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
    const { to, subject, html }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'missing_fields' }), { status: 400, headers: corsHeaders(origin) });
    }

    const provider = 'resend'; // Always use Resend
    const apiKey = Deno.env.get('RESEND_API_KEY') || '';
    const from = 'iSystem Training <onboarding@resend.dev>';

    // No-op if provider not configured (local/dev friendly)
    if (!provider || !apiKey) {
      console.log('[send-confirmation-email] Provider not configured; returning 200 (noop).');
      return new Response(JSON.stringify({ id: `noop-${Date.now()}`, status: 'accepted' }), { status: 200, headers: corsHeaders(origin) });
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
