-- Security Enhancement Migration
-- Fix 1: Enhanced data protection for user_profiles table
-- Add data anonymization and stronger access controls

-- Create function to anonymize sensitive user data for expired accounts
CREATE OR REPLACE FUNCTION public.anonymize_user_data(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow admins to anonymize data
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can anonymize user data';
  END IF;
  
  UPDATE public.user_profiles 
  SET 
    email = 'anonymized_' || id::text || '@deleted.local',
    phone = NULL,
    first_name = 'Deleted',
    last_name = 'User',
    company = NULL,
    position = NULL
  WHERE user_id = target_user_id;
  
  RETURN true;
END;
$$;

-- Fix 2: Enhanced audit logging for sensitive operations
-- Create function to log data access attempts
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(
  p_table_name text,
  p_operation text,
  p_record_id uuid DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    details,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    'SENSITIVE_DATA_ACCESS',
    jsonb_build_object(
      'table_name', p_table_name,
      'operation', p_operation,
      'record_id', p_record_id,
      'timestamp', now()
    ),
    inet_client_addr(),
    p_user_agent
  );
END;
$$;

-- Fix 3: Data retention policies
-- Create table for data retention configuration
CREATE TABLE IF NOT EXISTS public.data_retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL UNIQUE,
  retention_days integer NOT NULL,
  last_cleanup_at timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on data retention policies
ALTER TABLE public.data_retention_policies ENABLE ROW LEVEL SECURITY;

-- Only admins can manage retention policies
CREATE POLICY "Admins can manage retention policies"
ON public.data_retention_policies
FOR ALL
USING (public.is_current_user_admin());

-- Insert default retention policies
INSERT INTO public.data_retention_policies (table_name, retention_days) VALUES
('analytics_events', 365),  -- 1 year for analytics
('admin_audit_log', 2555),  -- 7 years for audit logs (compliance)
('workshop_registrations', 1095) -- 3 years for registration data
ON CONFLICT (table_name) DO NOTHING;

-- Fix 4: Enhanced workshop registration security
-- Create function for secure guest registration cleanup
CREATE OR REPLACE FUNCTION public.cleanup_expired_guest_registrations()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleanup_count integer := 0;
  retention_days integer;
BEGIN
  -- Get retention policy for workshop registrations
  SELECT drp.retention_days INTO retention_days
  FROM public.data_retention_policies drp
  WHERE drp.table_name = 'workshop_registrations' AND drp.is_active = true;
  
  IF retention_days IS NULL THEN
    retention_days := 1095; -- Default to 3 years
  END IF;
  
  -- Anonymize old guest registrations (keep for analytics but remove PII)
  UPDATE public.workshop_registrations
  SET 
    guest_email = 'deleted_' || id::text || '@guest.local',
    guest_name = 'Deleted Guest',
    guest_phone = NULL
  WHERE 
    guest_email IS NOT NULL 
    AND user_id IS NULL
    AND registration_date < (now() - interval '1 day' * retention_days);
    
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  -- Log the cleanup operation
  INSERT INTO public.admin_audit_log (
    admin_user_id,
    action,
    details
  ) VALUES (
    NULL, -- System operation
    'DATA_RETENTION_CLEANUP',
    jsonb_build_object(
      'table_name', 'workshop_registrations',
      'records_anonymized', cleanup_count,
      'retention_days', retention_days
    )
  );
  
  RETURN cleanup_count;
END;
$$;

-- Fix 5: Enhanced access logging trigger for user_profiles
CREATE OR REPLACE FUNCTION public.log_user_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log when admin accesses other users' profiles
  IF TG_OP = 'SELECT' AND auth.uid() != COALESCE(NEW.user_id, OLD.user_id) THEN
    PERFORM public.log_sensitive_data_access(
      'user_profiles',
      TG_OP,
      COALESCE(NEW.user_id, OLD.user_id)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Fix 6: Enhanced security for analytics events
-- Add data anonymization for analytics after retention period
CREATE OR REPLACE FUNCTION public.anonymize_expired_analytics()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleanup_count integer := 0;
  retention_days integer;
BEGIN
  -- Get retention policy for analytics
  SELECT drp.retention_days INTO retention_days
  FROM public.data_retention_policies drp
  WHERE drp.table_name = 'analytics_events' AND drp.is_active = true;
  
  IF retention_days IS NULL THEN
    retention_days := 365; -- Default to 1 year
  END IF;
  
  -- Anonymize old analytics data
  UPDATE public.analytics_events
  SET 
    ip_address = NULL,
    user_agent = 'anonymized',
    referrer = NULL,
    page_url = regexp_replace(page_url, '(\?|&)[^&]*', '', 'g') -- Remove query params
  WHERE 
    created_at < (now() - interval '1 day' * retention_days)
    AND ip_address IS NOT NULL;
    
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  RETURN cleanup_count;
END;
$$;