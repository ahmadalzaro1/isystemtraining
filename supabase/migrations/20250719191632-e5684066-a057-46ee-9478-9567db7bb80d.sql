
-- Fix the RLS policy for workshop_registrations to properly handle authenticated users
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.workshop_registrations;

CREATE POLICY "Users can view their own registrations" 
ON public.workshop_registrations 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND guest_email IS NOT NULL AND auth.email() = guest_email)
);

-- Also ensure the insert policy is correct
DROP POLICY IF EXISTS "Users can create registrations" ON public.workshop_registrations;

CREATE POLICY "Users can create registrations" 
ON public.workshop_registrations 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND guest_email IS NOT NULL)
);
