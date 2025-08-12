-- Security hardening for user_profiles PII
-- 1) Ensure RLS is enabled (idempotent)
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2) Add trigger to prevent non-admins from modifying is_admin flag
-- (enforces defense-in-depth beyond RLS policies)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'user_profiles_admin_guard'
  ) THEN
    CREATE TRIGGER user_profiles_admin_guard
    BEFORE INSERT OR UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_user_profiles_admin_guard();
  END IF;
END $$;

-- 3) Keep updated_at in sync automatically
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'user_profiles_set_updated_at'
  ) THEN
    CREATE TRIGGER user_profiles_set_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;