import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean);
const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : 'https://example.invalid',
  'Vary': 'Origin',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json'
});

interface ManageLinkRequest {
  email: string;
  code: string;
  siteUrl?: string;
}

serve(async (req: Request) => {
  const origin = req.headers.get('Origin');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  try {
    const { email, code, siteUrl }: ManageLinkRequest = await req.json();

    if (!email || !code) {
      return new Response(JSON.stringify({ error: 'missing_fields' }), { status: 400, headers: corsHeaders(origin) });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('[send-manage-link] Missing Supabase env, returning noop');
      return new Response(JSON.stringify({ status: 'accepted', id: `noop-${Date.now()}` }), { status: 200, headers: corsHeaders(origin) });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Validate the code and email belong together
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_registration_by_code', { p_code: code });
    if (rpcError) {
      console.error('[send-manage-link] RPC error:', rpcError);
      return new Response(JSON.stringify({ error: 'invalid_code' }), { status: 400, headers: corsHeaders(origin) });
    }
    const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
    if (!row) {
      return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: corsHeaders(origin) });
    }

    const regEmail = (row.guest_email || '').toLowerCase();
    if (!regEmail || regEmail !== email.toLowerCase()) {
      // Do not leak whether code exists for a different email
      return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: corsHeaders(origin) });
    }

    const baseUrl = siteUrl && /^https?:\/\//.test(siteUrl) ? siteUrl : Deno.env.get('SITE_URL') || '';
    const manageUrl = `${baseUrl || ''}/my-registrations?code=${encodeURIComponent(code)}`;

    const provider = (Deno.env.get('EMAIL_PROVIDER') || '').toLowerCase();
    const apiKey = Deno.env.get('EMAIL_API_KEY') || '';
    const from = Deno.env.get('EMAIL_FROM') || 'iSystem Training <onboarding@resend.dev>';

    if (!provider || !apiKey) {
      console.log('[send-manage-link] Email provider not configured; returning 200 (noop).');
      return new Response(JSON.stringify({ id: `noop-${Date.now()}`, status: 'accepted' }), { status: 200, headers: corsHeaders(origin) });
    }

    if (provider === 'resend') {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from,
        to: [email],
        subject: 'Your iSystem registration manage link',
        html: `
          <div>
            <p>Hello ${row.guest_name || ''},</p>
            <p>You can manage or cancel your workshop registration here:</p>
            <p><a href="${manageUrl}">Manage my registration</a></p>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      });
      return new Response(JSON.stringify(result), { status: 202, headers: corsHeaders(origin) });
    }

    return new Response(JSON.stringify({ error: 'unsupported_provider' }), { status: 400, headers: corsHeaders(origin) });
  } catch (error: any) {
    console.error('[send-manage-link] Error:', error?.message || error);
    return new Response(JSON.stringify({ status: 'error' }), { status: 200, headers: corsHeaders(req.headers.get('Origin')) });
  }
});
