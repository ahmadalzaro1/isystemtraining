
-- Fix the infinite recursion in user_profiles RLS policy
-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a new admin policy using the security definer function
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
FOR ALL USING (public.is_current_user_admin());

-- Update your user profile to have admin privileges
UPDATE public.user_profiles 
SET is_admin = true 
WHERE email = 'ahmadalzaro99@gmail.com';
