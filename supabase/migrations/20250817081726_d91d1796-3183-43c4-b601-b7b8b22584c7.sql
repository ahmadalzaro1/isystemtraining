-- Continue with remaining security function fixes
-- Update remaining functions to have secure search paths

-- Update get_registration_by_code function
CREATE OR REPLACE FUNCTION public.get_registration_by_code(p_code text)
RETURNS SETOF workshop_registrations
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  select *
  from public.workshop_registrations
  where confirmation_code = p_code
  limit 1;
$$;

-- Update sanitize_text_input function  
CREATE OR REPLACE FUNCTION public.sanitize_text_input(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove HTML tags, trim, and limit length
  RETURN substring(
    trim(
      regexp_replace(input_text, '<[^>]*>', '', 'gi')
    ),
    1, 500
  );
END;
$$;

-- Update anonymize_user_data function
CREATE OR REPLACE FUNCTION public.anonymize_user_data(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update log_sensitive_data_access function
CREATE OR REPLACE FUNCTION public.log_sensitive_data_access(p_table_name text, p_operation text, p_record_id uuid DEFAULT NULL::uuid, p_user_agent text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update log_security_event function  
CREATE OR REPLACE FUNCTION public.log_security_event(p_event_type text, p_event_details jsonb DEFAULT '{}'::jsonb, p_severity text DEFAULT 'medium'::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.analytics_events (
    event_name,
    user_id,
    event_data,
    ip_address,
    user_agent
  ) VALUES (
    'security_event',
    auth.uid(),
    jsonb_build_object(
      'event_type', p_event_type,
      'severity', p_severity,
      'details', p_event_details,
      'timestamp', now()
    ),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$;

-- Update get_workshops_week function
CREATE OR REPLACE FUNCTION public.get_workshops_week(p_start date, p_end date, p_levels text[] DEFAULT NULL::text[], p_categories text[] DEFAULT NULL::text[], p_query text DEFAULT NULL::text)
RETURNS TABLE(id uuid, name text, instructor text, date date, time_text text, skill_level text, category text, spots_remaining integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    w.id,
    w.name,
    w.instructor,
    w.date,
    w.time AS time_text,
    w.skill_level,
    w.category,
    w.spots_remaining
  FROM public.workshops w
  WHERE w.date >= p_start
    AND w.date <= p_end
    AND (p_levels IS NULL OR w.skill_level = ANY(p_levels))
    AND (p_categories IS NULL OR w.category = ANY(p_categories))
    AND (
      p_query IS NULL OR p_query = '' OR
      w.name ILIKE '%' || p_query || '%' OR
      COALESCE(w.description, '') ILIKE '%' || p_query || '%' OR
      w.instructor ILIKE '%' || p_query || '%'
    )
  ORDER BY w.date ASC, w.time ASC;
$$;

-- Run immediate guest data anonymization to protect existing data
SELECT public.anonymize_guest_data_enhanced();

-- Create data retention policy for guest data if not exists
INSERT INTO public.data_retention_policies (table_name, retention_days, is_active)
VALUES ('guest_registrations', 30, true)
ON CONFLICT (table_name) DO UPDATE SET
  retention_days = 30,
  is_active = true;

-- Log security enhancement deployment
PERFORM public.log_security_event(
  'security_enhancement_deployed',
  jsonb_build_object(
    'enhancements', ARRAY[
      'admin_privilege_escalation_prevention',
      'guest_data_anonymization',
      'enhanced_rate_limiting',
      'secure_function_search_paths',
      'strengthened_rls_policies'
    ],
    'deployment_time', now()
  ),
  'low'
);