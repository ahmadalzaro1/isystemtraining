-- Fix the remaining functions and security enhancements
-- Continue with remaining security function fixes
-- Update remaining functions to have secure search paths

-- Update cancel_registration_by_code function
CREATE OR REPLACE FUNCTION public.cancel_registration_by_code(p_code text)
RETURNS workshop_registrations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
declare
  v_row public.workshop_registrations;
begin
  update public.workshop_registrations
  set status = 'canceled'
  where id = (
    select id from public.workshop_registrations
    where confirmation_code = p_code and status <> 'canceled'
    limit 1
  )
  returning * into v_row;

  if not found then
    raise exception 'registration not found or already canceled';
  end if;

  -- free the spot
  update public.workshops
  set spots_remaining = spots_remaining + 1
  where id = v_row.workshop_id;

  return v_row;
end;
$$;

-- Update link_guest_regs_to_user function
CREATE OR REPLACE FUNCTION public.link_guest_regs_to_user(p_email text)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  with updated as (
    update public.workshop_registrations
    set user_id = coalesce(user_id, auth.uid())
    where user_id is null and lower(guest_email) = lower(p_email)
    returning 1
  )
  select count(*)::int from updated;
$$;

-- Update get_admin_audit_logs function
CREATE OR REPLACE FUNCTION public.get_admin_audit_logs(limit_count integer DEFAULT 100, offset_count integer DEFAULT 0)
RETURNS TABLE(id uuid, admin_email text, target_email text, action text, details jsonb, ip_address inet, user_agent text, created_at timestamp with time zone)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Update update_user_admin_status function
CREATE OR REPLACE FUNCTION public.update_user_admin_status(target_user_id uuid, new_admin_status boolean, requester_ip inet DEFAULT NULL::inet, requester_user_agent text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;

-- Create data retention policy for guest data if not exists
INSERT INTO public.data_retention_policies (table_name, retention_days, is_active)
VALUES ('guest_registrations', 30, true)
ON CONFLICT (table_name) DO UPDATE SET
  retention_days = 30,
  is_active = true;