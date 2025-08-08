-- RBAC & data hardening migration
-- 1) Secure SELECT policy for workshop_registrations
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.workshop_registrations;
CREATE POLICY "Users can view their own registrations"
ON public.workshop_registrations
FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (guest_email IS NOT NULL AND auth.email() = guest_email)
);

-- 2) Security definer function for code-based retrieval (optional usage)
CREATE OR REPLACE FUNCTION public.get_registration_by_code(p_code text)
RETURNS SETOF public.workshop_registrations
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT *
  FROM public.workshop_registrations
  WHERE confirmation_code = p_code
  LIMIT 1;
$$;

-- 3) Align workshop_id to UUID and add FK to workshops(id)
DO $$
BEGIN
  -- Add temporary column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='workshop_registrations' AND column_name='workshop_id_tmp'
  ) THEN
    ALTER TABLE public.workshop_registrations ADD COLUMN workshop_id_tmp uuid;
  END IF;

  -- Backfill from workshop_uuid if present
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='workshop_registrations' AND column_name='workshop_uuid'
  ) THEN
    UPDATE public.workshop_registrations
    SET workshop_id_tmp = workshop_uuid
    WHERE workshop_id_tmp IS NULL AND workshop_uuid IS NOT NULL;
  END IF;

  -- Backfill from workshop_id (text) if it looks like a UUID
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='workshop_registrations' AND column_name='workshop_id'
      AND data_type='text'
  ) THEN
    UPDATE public.workshop_registrations
    SET workshop_id_tmp = workshop_id::uuid
    WHERE workshop_id_tmp IS NULL 
      AND workshop_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
  END IF;

  -- Drop old columns if exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='workshop_registrations' AND column_name='workshop_id'
  ) THEN
    ALTER TABLE public.workshop_registrations DROP COLUMN workshop_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='workshop_registrations' AND column_name='workshop_uuid'
  ) THEN
    ALTER TABLE public.workshop_registrations DROP COLUMN workshop_uuid;
  END IF;

  -- Rename temp column to workshop_id
  ALTER TABLE public.workshop_registrations RENAME COLUMN workshop_id_tmp TO workshop_id;

  -- Add FK if not existing yet
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema='public' AND tc.table_name='workshop_registrations' AND tc.constraint_type='FOREIGN KEY'
  ) THEN
    ALTER TABLE public.workshop_registrations
    ADD CONSTRAINT workshop_registrations_workshop_id_fkey
    FOREIGN KEY (workshop_id) REFERENCES public.workshops(id) ON DELETE CASCADE;
  END IF;
END $$;