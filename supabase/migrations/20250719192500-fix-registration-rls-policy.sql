
-- Improve RLS policy for workshop_registrations to handle edge cases better
DROP POLICY IF EXISTS "Users can create registrations" ON public.workshop_registrations;

CREATE POLICY "Users can create registrations" 
ON public.workshop_registrations 
FOR INSERT 
WITH CHECK (
  -- Case 1: Authenticated user registering
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  -- Case 2: Guest registration (no authentication required)
  (auth.uid() IS NULL AND guest_email IS NOT NULL AND user_id IS NULL) OR
  -- Case 3: Edge case - authenticated user doing guest registration
  (auth.uid() IS NOT NULL AND user_id IS NULL AND guest_email IS NOT NULL)
);

-- Also update the SELECT policy to be more permissive for authenticated users
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.workshop_registrations;

CREATE POLICY "Users can view their own registrations" 
ON public.workshop_registrations 
FOR SELECT 
USING (
  -- Authenticated users can see their registrations
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
  -- Guest users can see registrations by email match
  (guest_email IS NOT NULL AND auth.email() = guest_email) OR
  -- Anonymous access for guest registrations (when searching by confirmation code)
  (auth.uid() IS NULL AND guest_email IS NOT NULL)
);
