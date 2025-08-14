-- Add enhanced security constraints and validation

-- Email format validation constraint
ALTER TABLE user_profiles 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Phone number format validation for Jordanian numbers
ALTER TABLE user_profiles 
ADD CONSTRAINT valid_jordanian_phone 
CHECK (phone IS NULL OR phone ~* '^(\+962|00962|0)?[79]\d{8}$');

-- Name length and character validation
ALTER TABLE user_profiles 
ADD CONSTRAINT valid_first_name 
CHECK (first_name IS NULL OR (length(trim(first_name)) >= 2 AND length(trim(first_name)) <= 50 AND first_name ~* '^[A-Za-z\s\-'']+$'));

ALTER TABLE user_profiles 
ADD CONSTRAINT valid_last_name 
CHECK (last_name IS NULL OR (length(trim(last_name)) >= 2 AND length(trim(last_name)) <= 50 AND last_name ~* '^[A-Za-z\s\-'']+$'));

-- Prevent XSS in company and position fields
ALTER TABLE user_profiles 
ADD CONSTRAINT no_html_in_company 
CHECK (company IS NULL OR company !~* '<[^>]*>');

ALTER TABLE user_profiles 
ADD CONSTRAINT no_html_in_position 
CHECK (position IS NULL OR position !~* '<[^>]*>');

-- Guest email validation for workshop registrations
ALTER TABLE workshop_registrations 
ADD CONSTRAINT valid_guest_email_format 
CHECK (guest_email IS NULL OR guest_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Guest name validation
ALTER TABLE workshop_registrations 
ADD CONSTRAINT valid_guest_name 
CHECK (guest_name IS NULL OR (length(trim(guest_name)) >= 2 AND length(trim(guest_name)) <= 100 AND guest_name ~* '^[A-Za-z\s\-'']+$'));

-- Enhanced audit logging function for sensitive operations
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_event_details jsonb DEFAULT '{}'::jsonb,
  p_severity text DEFAULT 'medium'
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Function to validate and sanitize user input
CREATE OR REPLACE FUNCTION public.sanitize_text_input(input_text text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
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

-- Trigger to sanitize user profile data on insert/update
CREATE OR REPLACE FUNCTION public.sanitize_user_profile_data()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Sanitize text fields
  NEW.first_name := public.sanitize_text_input(NEW.first_name);
  NEW.last_name := public.sanitize_text_input(NEW.last_name);
  NEW.company := public.sanitize_text_input(NEW.company);
  NEW.position := public.sanitize_text_input(NEW.position);
  
  -- Normalize email to lowercase
  IF NEW.email IS NOT NULL THEN
    NEW.email := lower(trim(NEW.email));
  END IF;
  
  -- Clean phone number (remove non-digits for storage)
  IF NEW.phone IS NOT NULL THEN
    NEW.phone := regexp_replace(NEW.phone, '[^\d+]', '', 'g');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for user profile sanitization
DROP TRIGGER IF EXISTS trigger_sanitize_user_profile ON user_profiles;
CREATE TRIGGER trigger_sanitize_user_profile
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_user_profile_data();

-- Enhanced data retention cleanup with better security
CREATE OR REPLACE FUNCTION public.cleanup_expired_analytics_data()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cleanup_count integer := 0;
  retention_days integer;
BEGIN
  -- Only allow admins to run this function
  IF NOT public.is_current_user_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can perform data cleanup';
  END IF;
  
  -- Get retention policy
  SELECT drp.retention_days INTO retention_days
  FROM public.data_retention_policies drp
  WHERE drp.table_name = 'analytics_events' AND drp.is_active = true;
  
  IF retention_days IS NULL THEN
    retention_days := 365; -- Default to 1 year
  END IF;
  
  -- Anonymize old analytics data instead of deleting
  UPDATE public.analytics_events
  SET 
    ip_address = NULL,
    user_agent = 'anonymized',
    page_url = regexp_replace(coalesce(page_url, ''), '(\?|&)[^&]*', '', 'g'),
    event_data = jsonb_build_object(
      'anonymized', true,
      'original_timestamp', event_data->>'timestamp'
    )
  WHERE 
    created_at < (now() - interval '1 day' * retention_days)
    AND event_data->>'anonymized' IS NULL;
    
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  -- Log the cleanup operation
  PERFORM public.log_security_event(
    'data_retention_cleanup',
    jsonb_build_object(
      'table_name', 'analytics_events',
      'records_anonymized', cleanup_count,
      'retention_days', retention_days
    ),
    'low'
  );
  
  RETURN cleanup_count;
END;
$$;