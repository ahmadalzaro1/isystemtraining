-- CRITICAL SECURITY FIXES

-- 1. Fix function search path security (addresses WARN 1 & 2)
-- Update all functions to have secure search path

-- 2. Fix admin privilege escalation vulnerability 
-- Add stronger validation to prevent self-promotion to admin
CREATE OR REPLACE FUNCTION public.prevent_admin_self_promotion()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent users from setting themselves as admin during profile creation
  IF TG_OP = 'INSERT' AND NEW.is_admin = true THEN
    -- Only allow if current user is already an admin
    IF NOT public.is_current_user_admin() THEN
      NEW.is_admin := false;
      
      -- Log the attempted privilege escalation
      PERFORM public.log_security_event(
        'attempted_privilege_escalation',
        jsonb_build_object(
          'user_id', NEW.user_id,
          'attempted_action', 'self_admin_promotion_on_insert'
        ),
        'critical'
      );
    END IF;
  END IF;
  
  -- Prevent users from promoting themselves to admin via update
  IF TG_OP = 'UPDATE' AND OLD.is_admin = false AND NEW.is_admin = true THEN
    IF NEW.user_id = auth.uid() AND NOT public.is_current_user_admin() THEN
      -- Block the self-promotion
      RAISE EXCEPTION 'Security violation: Users cannot promote themselves to admin status';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create trigger to prevent admin self-promotion
DROP TRIGGER IF EXISTS prevent_admin_self_promotion_trigger ON public.user_profiles;
CREATE TRIGGER prevent_admin_self_promotion_trigger
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_self_promotion();

-- 3. Enhanced guest data anonymization (addresses data privacy)
CREATE OR REPLACE FUNCTION public.anonymize_guest_data_enhanced()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  cleanup_count integer := 0;
  retention_days integer := 30; -- Shorter retention for guest data
BEGIN
  -- Get retention policy for guest registrations
  SELECT drp.retention_days INTO retention_days
  FROM public.data_retention_policies drp
  WHERE drp.table_name = 'guest_registrations' AND drp.is_active = true;
  
  IF retention_days IS NULL THEN
    retention_days := 30; -- Default to 30 days for guest data
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
  
  -- Log the cleanup operation with more detail
  IF cleanup_count > 0 THEN
    PERFORM public.log_security_event(
      'guest_data_anonymization',
      jsonb_build_object(
        'records_anonymized', cleanup_count,
        'retention_days', retention_days,
        'anonymization_type', 'automatic_privacy_protection'
      ),
      'medium'
    );
  END IF;
  
  RETURN cleanup_count;
END;
$$;

-- 4. Strengthen RLS policies to require authentication for admin operations
-- Update admin audit log policy to be more restrictive
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_log
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND public.is_current_user_admin()
);

-- Update data retention policies to require authenticated admin
DROP POLICY IF EXISTS "Admins can manage retention policies" ON public.data_retention_policies;
CREATE POLICY "Admins can manage retention policies"
ON public.data_retention_policies
FOR ALL
USING (
  auth.uid() IS NOT NULL 
  AND public.is_current_user_admin()
);

-- 5. Add rate limiting enhancement for guest access
CREATE OR REPLACE FUNCTION public.check_guest_access_rate_limit_enhanced()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  client_ip inet;
  attempt_record record;
  max_attempts integer := 5; -- Reduced from 10
  time_window interval := '10 minutes'; -- Reduced from 15 minutes
  block_duration interval := '1 hour'; -- How long to block after hitting limit
BEGIN
  -- Get client IP
  client_ip := inet_client_addr();
  
  -- If no IP (local/internal), allow but log
  IF client_ip IS NULL THEN
    PERFORM public.log_security_event(
      'guest_access_no_ip',
      jsonb_build_object('warning', 'Guest access without detectable IP'),
      'medium'
    );
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
    VALUES (client_ip)
    ON CONFLICT (ip_address) DO UPDATE SET
      attempt_count = 1,
      first_attempt_at = now(),
      last_attempt_at = now(),
      is_blocked = false;
    RETURN true;
  END IF;
  
  -- Check if currently blocked
  IF attempt_record.is_blocked 
     AND attempt_record.last_attempt_at > (now() - block_duration) THEN
    -- Log blocked attempt
    PERFORM public.log_security_event(
      'guest_access_blocked',
      jsonb_build_object(
        'ip_address', host(client_ip),
        'attempts', attempt_record.attempt_count,
        'blocked_duration_minutes', extract(epoch from block_duration) / 60
      ),
      'high'
    );
    RETURN false;
  END IF;
  
  -- Reset if block duration has passed
  IF attempt_record.is_blocked 
     AND attempt_record.last_attempt_at <= (now() - block_duration) THEN
    UPDATE public.guest_access_rate_limit
    SET 
      attempt_count = 1,
      first_attempt_at = now(),
      last_attempt_at = now(),
      is_blocked = false
    WHERE id = attempt_record.id;
    RETURN true;
  END IF;
  
  -- Update attempt count
  UPDATE public.guest_access_rate_limit
  SET 
    attempt_count = attempt_count + 1,
    last_attempt_at = now(),
    is_blocked = (attempt_count + 1) >= max_attempts
  WHERE id = attempt_record.id;
  
  -- Log if approaching limit
  IF (attempt_record.attempt_count + 1) >= (max_attempts - 1) THEN
    PERFORM public.log_security_event(
      'guest_access_approaching_limit',
      jsonb_build_object(
        'ip_address', host(client_ip),
        'attempts', attempt_record.attempt_count + 1,
        'max_attempts', max_attempts
      ),
      'medium'
    );
  END IF;
  
  -- Return whether still allowed
  RETURN (attempt_record.attempt_count + 1) < max_attempts;
END;
$$;

-- 6. Update all existing functions to have secure search paths
-- This addresses the linter warnings about mutable search paths

-- Update is_current_user_admin function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
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

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;