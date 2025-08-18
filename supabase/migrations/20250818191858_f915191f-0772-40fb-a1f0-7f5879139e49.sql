-- Add DELETE policy for admins on workshop_registrations if not exists
DO $$
BEGIN
  -- Check if DELETE policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'workshop_registrations' 
    AND policyname = 'Admins can delete registrations'
  ) THEN
    -- Create DELETE policy for admins
    CREATE POLICY "Admins can delete registrations" 
    ON public.workshop_registrations 
    FOR DELETE 
    USING (is_current_user_admin());
  END IF;
END
$$;