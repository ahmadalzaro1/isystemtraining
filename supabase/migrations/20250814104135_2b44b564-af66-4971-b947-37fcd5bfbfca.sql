-- Fix critical database recursion issue in course_content RLS policy
-- Create security definer function to check enrollment without self-reference
CREATE OR REPLACE FUNCTION public.check_user_course_enrollment(p_content_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
DECLARE
  user_enrolled boolean := false;
  content_course_id uuid;
  content_is_free boolean;
BEGIN
  -- Get the course_id and is_free status for this content
  SELECT course_id, is_free INTO content_course_id, content_is_free
  FROM course_content 
  WHERE id = p_content_id;
  
  -- If content is free, allow access
  IF content_is_free = true THEN
    RETURN true;
  END IF;
  
  -- If no user is authenticated, deny access to paid content
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if user is enrolled in the course
  SELECT EXISTS (
    SELECT 1 
    FROM enrollments 
    WHERE user_id = auth.uid() 
    AND course_id = content_course_id
  ) INTO user_enrolled;
  
  RETURN user_enrolled;
END;
$$;

-- Drop and recreate the problematic RLS policy
DROP POLICY IF EXISTS "Enrolled users can view course content" ON public.course_content;

CREATE POLICY "Enrolled users can view course content" 
ON public.course_content 
FOR SELECT 
USING (
  public.check_user_course_enrollment(id) OR
  (EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND is_admin = true))
);

-- Add input validation constraints for security
ALTER TABLE public.workshop_registrations 
ADD CONSTRAINT check_guest_email_format 
CHECK (guest_email IS NULL OR guest_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.user_profiles 
ADD CONSTRAINT check_email_format 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone number validation
ALTER TABLE public.workshop_registrations 
ADD CONSTRAINT check_guest_phone_format 
CHECK (guest_phone IS NULL OR guest_phone ~* '^\+?[1-9]\d{1,14}$');

ALTER TABLE public.user_profiles 
ADD CONSTRAINT check_phone_format 
CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');

-- Enhance data retention and cleanup
CREATE OR REPLACE FUNCTION public.sanitize_guest_data()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleanup_count integer := 0;
BEGIN
  -- Sanitize old guest registrations (older than 30 days)
  UPDATE public.workshop_registrations
  SET 
    guest_email = 'sanitized_' || id::text || '@guest.local',
    guest_name = 'Guest User',
    guest_phone = NULL
  WHERE 
    guest_email IS NOT NULL 
    AND user_id IS NULL
    AND status = 'canceled'
    AND updated_at < (now() - interval '30 days');
    
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  RETURN cleanup_count;
END;
$$;

-- Create function to validate workshop registration data
CREATE OR REPLACE FUNCTION public.validate_workshop_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate email format if provided
  IF NEW.guest_email IS NOT NULL AND NEW.guest_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Ensure either user_id or guest_email is provided
  IF NEW.user_id IS NULL AND NEW.guest_email IS NULL THEN
    RAISE EXCEPTION 'Either user_id or guest_email must be provided';
  END IF;
  
  -- Validate workshop_id is a valid UUID
  IF NEW.workshop_id IS NULL THEN
    RAISE EXCEPTION 'Workshop ID is required';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for workshop registration validation
CREATE TRIGGER validate_workshop_registration_trigger
  BEFORE INSERT OR UPDATE ON public.workshop_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_workshop_registration();

-- Add indexes for performance on security-critical queries
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON public.user_profiles(user_id) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_security ON public.workshop_registrations(user_id, guest_email, status);

-- Log this security enhancement
INSERT INTO public.admin_audit_log (
  admin_user_id,
  action,
  details
) VALUES (
  NULL, -- System operation
  'SECURITY_ENHANCEMENT',
  jsonb_build_object(
    'enhancement', 'Fixed RLS recursion and added input validation',
    'timestamp', now(),
    'components', array['RLS_POLICIES', 'INPUT_VALIDATION', 'DATA_SANITIZATION']
  )
);