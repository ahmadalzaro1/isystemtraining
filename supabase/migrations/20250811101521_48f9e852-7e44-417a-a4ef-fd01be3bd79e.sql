
-- 1) Performance indexes (idempotent)

-- Fast lookup by confirmation code (used for one-time code lookups)
create index if not exists idx_workshop_regs_confirmation_code
  on public.workshop_registrations(confirmation_code);

-- Fast lookup by guest email (normalized)
create index if not exists idx_workshop_regs_guest_email_lower
  on public.workshop_registrations (lower(guest_email));

-- Efficient status scans per workshop
create index if not exists idx_workshop_regs_workshop_status
  on public.workshop_registrations (workshop_id, status);

-- Speed up common ordering/filtering by date/time
create index if not exists idx_workshops_date
  on public.workshops (date);

create index if not exists idx_workshops_date_time
  on public.workshops (date, time);


-- 2) Ensure RPCs exist (create or replace with your current secure definitions)

create or replace function public.get_registration_by_code(p_code text)
returns setof workshop_registrations
language sql
stable
security definer
set search_path to 'public'
as $function$
  select *
  from public.workshop_registrations
  where confirmation_code = p_code
  limit 1;
$function$;

create or replace function public.create_guest_registration(
  p_workshop_id uuid,
  p_email text,
  p_name text default null,
  p_phone text default null
)
returns table(id uuid, confirmation_code text)
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_id uuid;
  v_code text;
  v_spots int;
begin
  -- Lock the workshop row to avoid race conditions
  select spots_remaining into v_spots
  from public.workshops
  where id = p_workshop_id
  for update;

  if v_spots is null then
    raise exception 'workshop not found';
  end if;

  if v_spots <= 0 then
    raise exception 'workshop is full';
  end if;

  insert into public.workshop_registrations (workshop_id, guest_email, guest_name, guest_phone, status)
  values (p_workshop_id, lower(p_email), p_name, p_phone, 'confirmed')
  returning id, confirmation_code into v_id, v_code;

  update public.workshops
  set spots_remaining = spots_remaining - 1
  where id = p_workshop_id;

  return query select v_id, v_code;
end;
$function$;

create or replace function public.cancel_registration_by_code(p_code text)
returns workshop_registrations
language plpgsql
security definer
set search_path to 'public'
as $function$
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

create or replace function public.link_guest_regs_to_user(p_email text)
returns integer
language sql
security definer
set search_path to 'public'
as $function$
  with updated as (
    update public.workshop_registrations
    set user_id = coalesce(user_id, auth.uid())
    where user_id is null and lower(guest_email) = lower(p_email)
    returning 1
  )
  select count(*)::int from updated;
$function$;
