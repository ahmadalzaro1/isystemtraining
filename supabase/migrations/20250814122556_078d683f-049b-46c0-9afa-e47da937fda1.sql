-- Fix infinite recursion in course_content RLS policy
DROP POLICY IF EXISTS "Enrolled users can view course content" ON public.course_content;

-- Create corrected policy without recursion
CREATE POLICY "Enrolled users can view course content" 
ON public.course_content 
FOR SELECT 
USING (
  is_free = true OR 
  EXISTS (
    SELECT 1 
    FROM public.enrollments 
    WHERE enrollments.user_id = auth.uid() 
    AND enrollments.course_id = course_content.course_id
  )
);

-- Enhance guest data protection with automated anonymization trigger
CREATE OR REPLACE FUNCTION public.anonymize_old_guest_registrations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleanup_count integer := 0;
  retention_days integer := 90; -- Default 3 months for guest data
BEGIN
  -- Get retention policy for guest registrations
  SELECT drp.retention_days INTO retention_days
  FROM public.data_retention_policies drp
  WHERE drp.table_name = 'guest_registrations' AND drp.is_active = true;
  
  IF retention_days IS NULL THEN
    retention_days := 90; -- Default to 3 months for guest data
  END IF;
  
  -- Anonymize old guest registrations (keep record but remove PII)
  UPDATE public.workshop_registrations
  SET 
    guest_email = 'anonymized_' || id::text || '@guest.local',
    guest_name = 'Anonymous Guest',
    guest_phone = NULL
  WHERE 
    user_id IS NULL -- Guest registrations only
    AND guest_email IS NOT NULL
    AND guest_email NOT LIKE 'anonymized_%@guest.local' -- Don't re-anonymize
    AND registration_date < (now() - interval '1 day' * retention_days);
    
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  -- Log the cleanup operation
  IF cleanup_count > 0 THEN
    PERFORM public.log_security_event(
      'guest_data_anonymization',
      jsonb_build_object(
        'records_anonymized', cleanup_count,
        'retention_days', retention_days
      ),
      'medium'
    );
  END IF;
  
  RETURN cleanup_count;
END;
$$;

-- Fix database function security - update search_path for all security-critical functions
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_admin_status boolean := false;
BEGIN
  SELECT is_admin INTO user_admin_status
  FROM public.user_profiles 
  WHERE user_id = auth.uid() 
  AND is_admin = true;
  
  RETURN COALESCE(user_admin_status, false);
END;
$$;

-- Update the guest registration function to use secure search_path
CREATE OR REPLACE FUNCTION public.create_guest_registration(
  p_workshop_id uuid, 
  p_email text, 
  p_name text DEFAULT NULL::text, 
  p_phone text DEFAULT NULL::text
)
RETURNS TABLE(id uuid, confirmation_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_id uuid;
  v_code text;
  v_spots int;
BEGIN
  -- Validate and sanitize inputs
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  
  -- Validate email format
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Lock the workshop row to avoid race conditions
  SELECT workshops.spots_remaining INTO v_spots
  FROM public.workshops
  WHERE workshops.id = p_workshop_id
  FOR UPDATE;

  IF v_spots IS NULL THEN
    RAISE EXCEPTION 'Workshop not found';
  END IF;

  IF v_spots <= 0 THEN
    RAISE EXCEPTION 'Workshop is full';
  END IF;

  -- Insert with sanitized data
  INSERT INTO public.workshop_registrations (
    workshop_id, 
    guest_email, 
    guest_name, 
    guest_phone, 
    status
  )
  VALUES (
    p_workshop_id, 
    lower(trim(p_email)), 
    public.sanitize_text_input(p_name), 
    public.sanitize_text_input(p_phone), 
    'confirmed'
  )
  RETURNING workshop_registrations.id, workshop_registrations.confirmation_code 
  INTO v_id, v_code;

  -- Update spots
  UPDATE public.workshops
  SET spots_remaining = spots_remaining - 1
  WHERE workshops.id = p_workshop_id;
  
  -- Log guest registration for monitoring
  PERFORM public.log_security_event(
    'guest_registration_created',
    jsonb_build_object(
      'workshop_id', p_workshop_id,
      'registration_id', v_id
    ),
    'low'
  );

  RETURN QUERY SELECT v_id, v_code;
END;
$$;

-- Harden workshop registration RLS policies
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.workshop_registrations;

CREATE POLICY "Users can view their own registrations" 
ON public.workshop_registrations 
FOR SELECT 
USING (
  -- Authenticated users can see their own registrations
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
);

-- Create separate policy for guest access via confirmation code only
CREATE POLICY "Guest access via confirmation code only"
ON public.workshop_registrations
FOR SELECT
USING (
  -- Allow access only for specific guest email operations via RPC functions
  user_id IS NULL 
  AND guest_email IS NOT NULL
  AND current_setting('app.guest_access_allowed', true) = 'true'
);

-- Add data retention policy for guest registrations if not exists
INSERT INTO public.data_retention_policies (table_name, retention_days, is_active)
VALUES ('guest_registrations', 90, true)
ON CONFLICT (table_name) DO NOTHING;

-- Create admin session monitoring
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_start timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now(),
  ip_address inet,
  user_agent text,
  is_active boolean NOT NULL DEFAULT true,
  ended_at timestamp with time zone
);

-- Enable RLS on admin sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policy for admin session management
CREATE POLICY "Admins can manage own sessions"
ON public.admin_sessions
FOR ALL
USING (user_id = auth.uid() OR public.is_current_user_admin());

-- Function to track admin sessions
CREATE OR REPLACE FUNCTION public.track_admin_session(
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  session_id uuid;
  is_admin boolean := false;
BEGIN
  -- Check if user is admin
  SELECT public.is_current_user_admin() INTO is_admin;
  
  IF NOT is_admin THEN
    RETURN NULL;
  END IF;
  
  -- End any existing active sessions for this user
  UPDATE public.admin_sessions
  SET is_active = false, ended_at = now()
  WHERE user_id = auth.uid() AND is_active = true;
  
  -- Create new session
  INSERT INTO public.admin_sessions (
    user_id, 
    ip_address, 
    user_agent
  )
  VALUES (
    auth.uid(),
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$;