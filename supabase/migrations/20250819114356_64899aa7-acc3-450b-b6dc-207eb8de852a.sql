-- Fix database function search paths for all functions without explicit search_path
-- This prevents potential schema-based attacks

-- Fix get_registration_by_code function
CREATE OR REPLACE FUNCTION public.get_registration_by_code(p_code text)
 RETURNS SETOF workshop_registrations
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select *
  from public.workshop_registrations
  where confirmation_code = p_code
  limit 1;
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix sanitize_text_input function
CREATE OR REPLACE FUNCTION public.sanitize_text_input(input_text text)
 RETURNS text
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix sanitize_user_profile_data function
CREATE OR REPLACE FUNCTION public.sanitize_user_profile_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix cancel_registration_by_code function
CREATE OR REPLACE FUNCTION public.cancel_registration_by_code(p_code text)
 RETURNS workshop_registrations
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix link_guest_regs_to_user function
CREATE OR REPLACE FUNCTION public.link_guest_regs_to_user(p_email text)
 RETURNS integer
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  with updated as (
    update public.workshop_registrations
    set user_id = coalesce(user_id, auth.uid())
    where user_id is null and lower(guest_email) = lower(p_email)
    returning 1
  )
  select count(*)::int from updated;
$function$;

-- Fix get_admin_audit_logs function
CREATE OR REPLACE FUNCTION public.get_admin_audit_logs(limit_count integer DEFAULT 100, offset_count integer DEFAULT 0)
 RETURNS TABLE(id uuid, admin_email text, target_email text, action text, details jsonb, ip_address inet, user_agent text, created_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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