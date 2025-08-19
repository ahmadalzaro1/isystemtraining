import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean);
const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : 'https://example.invalid',
  'Vary': 'Origin',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Content-Type': 'application/json'
});

interface VerifyRequest { 
  token?: string;
  provider?: 'turnstile' | 'hcaptcha';
}

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

interface HCaptchaResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders(req.headers.get('Origin')) });
  
  try {
    const origin = req.headers.get('Origin');
    const { token, provider = 'turnstile' }: VerifyRequest = await req.json();

    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: 'token_required' }), { 
        status: 400, 
        headers: corsHeaders(origin) 
      });
    }

    // Get the appropriate secret based on provider
    const secret = provider === 'turnstile' 
      ? Deno.env.get('TURNSTILE_SECRET_KEY')
      : Deno.env.get('HCAPTCHA_SECRET_KEY');

    if (!secret) {
      console.error(`Missing secret for ${provider} provider`);
      return new Response(JSON.stringify({ ok: false, error: 'server_configuration_error' }), { 
        status: 500, 
        headers: corsHeaders(origin) 
      });
    }

    // Verify with the appropriate provider
    let verificationUrl: string;
    if (provider === 'turnstile') {
      verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    } else {
      verificationUrl = 'https://hcaptcha.com/siteverify';
    }

    const verifyResponse = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secret,
        response: token,
      }),
    });

    const verifyResult: TurnstileResponse | HCaptchaResponse = await verifyResponse.json();
    
    // Log verification attempt for security monitoring
    console.log(`CAPTCHA verification ${provider}:`, {
      success: verifyResult.success,
      errorCodes: verifyResult['error-codes'],
      hostname: verifyResult.hostname,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ 
      ok: verifyResult.success,
      provider: provider,
      ...(verifyResult['error-codes'] && { errors: verifyResult['error-codes'] })
    }), { 
      status: verifyResult.success ? 200 : 400, 
      headers: corsHeaders(origin) 
    });

  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: 'verification_failed' 
    }), { 
      status: 500, 
      headers: corsHeaders(req.headers.get('Origin')) 
    });
  }
});
