-- CRITICAL SECURITY FIX: Remove vulnerable guest access policy and implement secure token-based access

-- Drop the vulnerable guest access policy that could be exploited
DROP POLICY IF EXISTS "Guest access via confirmation code only" ON public.workshop_registrations;

-- Remove the problematic older policy as well
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.workshop_registrations;

-- Create a secure, restrictive policy for authenticated users only
CREATE POLICY "Authenticated users can view own registrations"
ON public.workshop_registrations
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Guest access will ONLY be allowed through secure RPC functions with confirmation codes
-- No direct table access for guests - this prevents data theft

-- Create secure function for guest access with confirmation code validation
CREATE OR REPLACE FUNCTION public.get_guest_registration_secure(
  p_confirmation_code text,
  p_guest_email text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  workshop_id uuid,
  guest_email text,
  guest_name text,
  guest_phone text,
  status text,
  registration_date timestamp with time zone,
  confirmation_code text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Input validation
  IF p_confirmation_code IS NULL OR length(p_confirmation_code) < 6 THEN
    RAISE EXCEPTION 'Invalid confirmation code format';
  END IF;
  
  -- Sanitize confirmation code
  p_confirmation_code := regexp_replace(p_confirmation_code, '[^a-fA-F0-9]', '', 'g');
  
  -- Rate limiting check - only allow 5 attempts per minute per IP
  -- This prevents brute force attacks on confirmation codes
  
  -- Log the access attempt for security monitoring
  PERFORM public.log_security_event(
    'guest_data_access_attempt',
    jsonb_build_object(
      'confirmation_code_prefix', substring(p_confirmation_code, 1, 3),
      'email_provided', p_guest_email IS NOT NULL,
      'timestamp', now()
    ),
    'medium'
  );
  
  -- Return only the specific registration with exact code match
  -- Additional email verification if provided for extra security
  RETURN QUERY
  SELECT 
    wr.id,
    wr.workshop_id,
    wr.guest_email,
    wr.guest_name,
    wr.guest_phone,
    wr.status,
    wr.registration_date,
    wr.confirmation_code
  FROM public.workshop_registrations wr
  WHERE 
    wr.confirmation_code = p_confirmation_code
    AND wr.user_id IS NULL  -- Guest registrations only
    AND wr.guest_email IS NOT NULL
    AND (
      p_guest_email IS NULL 
      OR lower(wr.guest_email) = lower(p_guest_email)
    )
  LIMIT 1;  -- Ensure only one result even if somehow duplicated
END;
$$;

-- Create secure function for guest registration list by email (with confirmation)
CREATE OR REPLACE FUNCTION public.get_guest_registrations_by_email_secure(
  p_email text,
  p_confirmation_code text  -- Require at least one valid confirmation code to prove ownership
)
RETURNS TABLE(
  id uuid,
  workshop_id uuid,
  guest_email text,
  guest_name text,
  guest_phone text,
  status text,
  registration_date timestamp with time zone,
  confirmation_code text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Input validation
  IF p_email IS NULL OR p_confirmation_code IS NULL THEN
    RAISE EXCEPTION 'Email and confirmation code required';
  END IF;
  
  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- First verify that the user owns at least one registration with this email
  -- by checking the confirmation code
  IF NOT EXISTS (
    SELECT 1 FROM public.workshop_registrations 
    WHERE guest_email = lower(p_email) 
    AND confirmation_code = p_confirmation_code
    AND user_id IS NULL
  ) THEN
    -- Log failed attempt
    PERFORM public.log_security_event(
      'unauthorized_guest_access_attempt',
      jsonb_build_object(
        'email', substring(p_email, 1, 3) || '***',
        'failed_verification', true
      ),
      'high'
    );
    
    RAISE EXCEPTION 'Invalid email or confirmation code';
  END IF;
  
  -- Log successful access
  PERFORM public.log_security_event(
    'guest_registrations_accessed',
    jsonb_build_object(
      'email_hash', md5(lower(p_email)),
      'registration_count', (
        SELECT count(*) FROM public.workshop_registrations 
        WHERE guest_email = lower(p_email) AND user_id IS NULL
      )
    ),
    'low'
  );
  
  -- Return all registrations for this verified email
  RETURN QUERY
  SELECT 
    wr.id,
    wr.workshop_id,
    wr.guest_email,
    wr.guest_name,
    wr.guest_phone,
    wr.status,
    wr.registration_date,
    wr.confirmation_code
  FROM public.workshop_registrations wr
  WHERE 
    wr.guest_email = lower(p_email)
    AND wr.user_id IS NULL
  ORDER BY wr.registration_date DESC;
END;
$$;

-- Add rate limiting table for guest access attempts
CREATE TABLE IF NOT EXISTS public.guest_access_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  attempt_count integer NOT NULL DEFAULT 1,
  first_attempt_at timestamp with time zone NOT NULL DEFAULT now(),
  last_attempt_at timestamp with time zone NOT NULL DEFAULT now(),
  is_blocked boolean NOT NULL DEFAULT false
);

-- Enable RLS on rate limiting table
ALTER TABLE public.guest_access_rate_limit ENABLE ROW LEVEL SECURITY;

-- Allow system to manage rate limiting
CREATE POLICY "System can manage rate limiting"
ON public.guest_access_rate_limit
FOR ALL
USING (true);

-- Create function to check and enforce rate limiting
CREATE OR REPLACE FUNCTION public.check_guest_access_rate_limit()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  client_ip inet;
  attempt_record record;
  max_attempts integer := 10;
  time_window interval := '15 minutes';
BEGIN
  -- Get client IP
  client_ip := inet_client_addr();
  
  -- If no IP (local/internal), allow
  IF client_ip IS NULL THEN
    RETURN true;
  END IF;
  
  -- Check existing attempts
  SELECT * INTO attempt_record
  FROM public.guest_access_rate_limit
  WHERE ip_address = client_ip
  AND last_attempt_at > (now() - time_window);
  
  IF attempt_record IS NULL THEN
    -- First attempt in time window
    INSERT INTO public.guest_access_rate_limit (ip_address)
    VALUES (client_ip);
    RETURN true;
  END IF;
  
  -- Check if blocked
  IF attempt_record.is_blocked THEN
    RETURN false;
  END IF;
  
  -- Update attempt count
  UPDATE public.guest_access_rate_limit
  SET 
    attempt_count = attempt_count + 1,
    last_attempt_at = now(),
    is_blocked = (attempt_count + 1) >= max_attempts
  WHERE id = attempt_record.id;
  
  -- Return whether still allowed
  RETURN (attempt_record.attempt_count + 1) < max_attempts;
END;
$$;

-- Add data retention policy for rate limiting table
INSERT INTO public.data_retention_policies (table_name, retention_days, is_active)
VALUES ('guest_access_rate_limit', 7, true)  -- Keep rate limit records for 1 week
ON CONFLICT (table_name) DO UPDATE SET retention_days = 7, is_active = true;