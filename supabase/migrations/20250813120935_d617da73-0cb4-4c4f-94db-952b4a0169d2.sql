-- Security Enhancement Migration
-- Fix admin privilege escalation vulnerabilities and add security logging

-- 1. Create admin audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  target_user_id uuid,
  action text NOT NULL,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  )
);

-- System can insert audit logs (for triggers)
CREATE POLICY "System can insert audit logs" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (true);

-- 2. Enhanced admin guard function with better validation
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_admin_status boolean := false;
BEGIN
  -- Check if user exists and has admin privileges
  SELECT is_admin INTO user_admin_status
  FROM public.user_profiles 
  WHERE user_id = auth.uid() 
  AND is_admin = true;
  
  RETURN COALESCE(user_admin_status, false);
END;
$function$;

-- 3. Enhanced admin guard trigger with audit logging
CREATE OR REPLACE FUNCTION public.enforce_user_profiles_admin_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_is_admin boolean := false;
  target_user_email text;
BEGIN
  -- Get current user admin status
  current_user_is_admin := public.is_current_user_admin();
  
  -- Get target user email for logging
  SELECT email INTO target_user_email FROM public.user_profiles WHERE id = COALESCE(NEW.id, OLD.id);
  
  IF TG_OP = 'INSERT' THEN
    -- Force is_admin to false on insert by non-admins
    IF NOT current_user_is_admin THEN
      NEW.is_admin := false;
    END IF;
    
    -- Log admin creation
    IF NEW.is_admin = true AND current_user_is_admin THEN
      INSERT INTO public.admin_audit_log (admin_user_id, target_user_id, action, details)
      VALUES (
        auth.uid(),
        NEW.user_id,
        'ADMIN_GRANTED',
        jsonb_build_object('target_email', target_user_email, 'method', 'INSERT')
      );
    END IF;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Prevent non-admins from modifying admin status
    IF NOT current_user_is_admin AND NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'Only admins can modify admin privileges. Unauthorized attempt logged.';
    END IF;
    
    -- Prevent self-demotion (enhanced check)
    IF current_user_is_admin AND OLD.is_admin = true AND NEW.is_admin = false AND OLD.user_id = auth.uid() THEN
      RAISE EXCEPTION 'Admins cannot remove their own admin privileges. Use another admin account.';
    END IF;
    
    -- Log admin privilege changes
    IF current_user_is_admin AND NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      INSERT INTO public.admin_audit_log (admin_user_id, target_user_id, action, details)
      VALUES (
        auth.uid(),
        NEW.user_id,
        CASE WHEN NEW.is_admin THEN 'ADMIN_GRANTED' ELSE 'ADMIN_REVOKED' END,
        jsonb_build_object(
          'target_email', target_user_email,
          'previous_status', OLD.is_admin,
          'new_status', NEW.is_admin,
          'method', 'UPDATE'
        )
      );
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Log admin deletion attempts
    IF OLD.is_admin = true THEN
      INSERT INTO public.admin_audit_log (admin_user_id, target_user_id, action, details)
      VALUES (
        auth.uid(),
        OLD.user_id,
        'ADMIN_USER_DELETED',
        jsonb_build_object('target_email', target_user_email)
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS enforce_admin_guard ON public.user_profiles;
CREATE TRIGGER enforce_admin_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_user_profiles_admin_guard();

-- 4. Function to safely update user admin status (with validation)
CREATE OR REPLACE FUNCTION public.update_user_admin_status(
  target_user_id uuid,
  new_admin_status boolean,
  requester_ip inet DEFAULT NULL,
  requester_user_agent text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_admin boolean := false;
  target_user_record record;
  result boolean := false;
BEGIN
  -- Verify current user is admin
  current_user_admin := public.is_current_user_admin();
  
  IF NOT current_user_admin THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can modify user admin status';
  END IF;
  
  -- Get target user details
  SELECT * INTO target_user_record 
  FROM public.user_profiles 
  WHERE user_id = target_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Prevent self-demotion
  IF target_user_id = auth.uid() AND target_user_record.is_admin = true AND new_admin_status = false THEN
    RAISE EXCEPTION 'Cannot remove your own admin privileges';
  END IF;
  
  -- Update admin status
  UPDATE public.user_profiles 
  SET is_admin = new_admin_status 
  WHERE user_id = target_user_id;
  
  -- Log the action with additional context
  INSERT INTO public.admin_audit_log (
    admin_user_id, 
    target_user_id, 
    action, 
    details, 
    ip_address, 
    user_agent
  )
  VALUES (
    auth.uid(),
    target_user_id,
    CASE WHEN new_admin_status THEN 'ADMIN_GRANTED_SECURE' ELSE 'ADMIN_REVOKED_SECURE' END,
    jsonb_build_object(
      'target_email', target_user_record.email,
      'previous_status', target_user_record.is_admin,
      'new_status', new_admin_status,
      'method', 'SECURE_FUNCTION'
    ),
    requester_ip,
    requester_user_agent
  );
  
  result := true;
  RETURN result;
END;
$function$;

-- 5. Create indexes for performance and security monitoring
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user_id ON public.admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user_id ON public.admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- 6. Function to get admin audit logs (for security monitoring)
CREATE OR REPLACE FUNCTION public.get_admin_audit_logs(
  limit_count integer DEFAULT 100,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  admin_email text,
  target_email text,
  action text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Only allow admins to view audit logs
  SELECT 
    al.id,
    admin_profile.email as admin_email,
    target_profile.email as target_email,
    al.action,
    al.details,
    al.ip_address,
    al.user_agent,
    al.created_at
  FROM public.admin_audit_log al
  LEFT JOIN public.user_profiles admin_profile ON admin_profile.user_id = al.admin_user_id
  LEFT JOIN public.user_profiles target_profile ON target_profile.user_id = al.target_user_id
  WHERE public.is_current_user_admin()
  ORDER BY al.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
$function$;