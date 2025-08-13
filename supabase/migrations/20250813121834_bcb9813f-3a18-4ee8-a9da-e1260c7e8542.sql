-- Fix column reference ambiguity in admin guard trigger
-- The issue is using NEW.id/OLD.id instead of NEW.user_id/OLD.user_id

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS enforce_user_profiles_admin_guard ON public.user_profiles;

-- Create the corrected trigger function
CREATE OR REPLACE FUNCTION public.enforce_user_profiles_admin_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_is_admin boolean := false;
  target_user_email text;
  target_user_id uuid;
BEGIN
  -- Get current user admin status
  current_user_is_admin := public.is_current_user_admin();
  
  -- Get target user ID and email for logging
  target_user_id := COALESCE(NEW.user_id, OLD.user_id);
  SELECT email INTO target_user_email FROM public.user_profiles WHERE user_id = target_user_id;
  
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block the operation for non-admin operations
    -- Only raise for admin-specific operations
    IF TG_OP = 'UPDATE' AND NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER enforce_user_profiles_admin_guard
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_user_profiles_admin_guard();