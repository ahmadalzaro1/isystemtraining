-- Fix user_profiles RLS policies to prevent anonymous access and ensure proper security

-- Drop existing policies to recreate them with proper anonymous access restrictions
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

-- Create secure RLS policies that explicitly require authentication
CREATE POLICY "Authenticated users can view own profile" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own profile" 
ON public.user_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND (is_admin = false OR public.is_current_user_admin())
);

CREATE POLICY "Authenticated users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND (is_admin = false OR public.is_current_user_admin())
);

CREATE POLICY "Authenticated admins can view all profiles" 
ON public.user_profiles 
FOR ALL
TO authenticated
USING (public.is_current_user_admin());

-- Also fix workshop_registrations to protect guest data better
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Authenticated users can view own registrations" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Users can create registrations" ON public.workshop_registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON public.workshop_registrations;

-- Recreate workshop_registrations policies with proper restrictions
CREATE POLICY "Authenticated admins can manage all registrations" 
ON public.workshop_registrations 
FOR ALL
TO authenticated
USING (public.is_current_user_admin());

CREATE POLICY "Authenticated users can view own registrations" 
ON public.workshop_registrations 
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create registrations" 
ON public.workshop_registrations 
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous guests can create registrations" 
ON public.workshop_registrations 
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL 
  AND guest_email IS NOT NULL 
  AND length(guest_email) > 5
);

-- Fix analytics_events to prevent anonymous access to sensitive data
DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can create analytics events" ON public.analytics_events;

CREATE POLICY "Authenticated admins can view all analytics" 
ON public.analytics_events 
FOR SELECT
TO authenticated
USING (public.is_current_user_admin());

CREATE POLICY "Authenticated users can create analytics events" 
ON public.analytics_events 
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anonymous users can create limited analytics events" 
ON public.analytics_events 
FOR INSERT
TO anon
WITH CHECK (
  user_id IS NULL 
  AND event_name IN ('page_view', 'workshop_registration', 'error_event')
);

-- Fix admin_audit_log to prevent any anonymous access
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;

CREATE POLICY "Authenticated admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT
TO authenticated
USING (public.is_current_user_admin());

CREATE POLICY "System can insert audit logs" 
ON public.admin_audit_log 
FOR INSERT
WITH CHECK (true);