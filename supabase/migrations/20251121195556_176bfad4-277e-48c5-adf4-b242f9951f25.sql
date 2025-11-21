-- Fix Critical Security Issues: Prevent Anonymous Access to Sensitive Data

-- 1. Fix user_profiles: Ensure no anonymous access to user data
-- Drop existing policies and recreate with explicit authentication checks
DROP POLICY IF EXISTS "Authenticated users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated admins can view all profiles" ON public.user_profiles;

-- Recreate policies with explicit authentication requirements
CREATE POLICY "Authenticated users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (is_current_user_admin());

-- 2. Fix workshop_registrations: Prevent anonymous access to guest data
-- Drop and recreate SELECT policies with explicit authentication
DROP POLICY IF EXISTS "Authenticated users can view own registrations" ON public.workshop_registrations;

CREATE POLICY "Authenticated users can view own registrations"
ON public.workshop_registrations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add explicit policy for guests to ONLY view their own registration with confirmation code
-- This is handled by the RPC function get_guest_registration_secure, so no direct SELECT for anonymous

-- 3. Fix analytics_events: Restrict SELECT to admins only
-- Drop existing SELECT policy and recreate with stricter requirements
DROP POLICY IF EXISTS "Authenticated admins can view all analytics" ON public.analytics_events;

CREATE POLICY "Authenticated admins can view all analytics"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (is_current_user_admin());

-- 4. Fix registration_responses: Ensure proper access control
DROP POLICY IF EXISTS "Users can view own responses" ON public.registration_responses;

CREATE POLICY "Authenticated users can view own responses"
ON public.registration_responses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add logging for security improvements
SELECT public.log_security_event(
  'security_policies_hardened',
  jsonb_build_object(
    'tables_updated', ARRAY['user_profiles', 'workshop_registrations', 'analytics_events', 'registration_responses'],
    'improvement', 'Added explicit authentication requirements to prevent anonymous access'
  ),
  'high'
);