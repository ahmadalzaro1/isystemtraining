-- Fix ambiguous column reference by using qualified column names throughout
CREATE OR REPLACE FUNCTION public.create_guest_registration(p_workshop_id uuid, p_email text, p_name text DEFAULT NULL::text, p_phone text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, confirmation_code text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_id uuid;
  v_code text;
  v_spots int;
begin
  -- Lock the workshop row to avoid race conditions
  select workshops.spots_remaining into v_spots
  from public.workshops
  where workshops.id = p_workshop_id
  for update;

  if v_spots is null then
    raise exception 'workshop not found';
  end if;

  if v_spots <= 0 then
    raise exception 'workshop is full';
  end if;

  insert into public.workshop_registrations (workshop_id, guest_email, guest_name, guest_phone, status)
  values (p_workshop_id, lower(p_email), p_name, p_phone, 'confirmed')
  returning workshop_registrations.id, workshop_registrations.confirmation_code into v_id, v_code;

  update public.workshops
  set spots_remaining = spots_remaining - 1
  where workshops.id = p_workshop_id;

  return query select v_id, v_code;
end;
$function$