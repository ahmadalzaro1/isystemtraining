-- Strengthen RLS on user_profiles to prevent privilege escalation and circular policy risks
BEGIN;

-- Guard: only admins may modify is_admin; non-admins cannot set or change it
CREATE OR REPLACE FUNCTION public.enforce_user_profiles_admin_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- If caller is not an admin, enforce restrictions on is_admin
  IF NOT public.is_current_user_admin() THEN
    IF TG_OP = 'INSERT' THEN
      -- Force is_admin to false on insert by non-admins
      NEW.is_admin := false;
    ELSIF TG_OP = 'UPDATE' THEN
      -- Disallow changing is_admin by non-admins
      IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
        RAISE EXCEPTION 'Only admins can modify is_admin flag';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_user_profiles_admin_guard ON public.user_profiles;
CREATE TRIGGER trg_enforce_user_profiles_admin_guard
BEFORE INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_user_profiles_admin_guard();

-- Tighten RLS policies for user-controlled writes
-- Users can insert their own profile but cannot set is_admin unless they are admins
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (is_admin = false OR public.is_current_user_admin())
);

-- Users can update their own profile but cannot set is_admin unless they are admins
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND (is_admin = false OR public.is_current_user_admin())
);

COMMIT;