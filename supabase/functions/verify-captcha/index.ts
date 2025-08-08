import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean);
const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : 'https://example.invalid',
  'Vary': 'Origin',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json'
});

interface VerifyRequest { token?: string }

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(req.headers.get('Origin')) });
  try {
    const origin = req.headers.get('Origin');
    const { token }: VerifyRequest = await req.json();

    // Provider-agnostic placeholder: require presence of token and secret
    const secret = Deno.env.get('TURNSTILE_SECRET_KEY') || Deno.env.get('HCAPTCHA_SECRET_KEY');
    const ok = Boolean(token && secret);

    // TODO: Implement actual provider verification HTTP call when secret is configured
    return new Response(JSON.stringify({ ok }), { status: ok ? 200 : 400, headers: corsHeaders(origin) });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_request' }), { status: 400, headers: corsHeaders(req.headers.get('Origin')) });
  }
});
