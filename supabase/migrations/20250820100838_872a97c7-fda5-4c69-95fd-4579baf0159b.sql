-- Fix RLS policy for registration_responses to allow guest registrations
DROP POLICY IF EXISTS "Users can create own responses" ON public.registration_responses;

CREATE POLICY "Users can create own responses" 
ON public.registration_responses 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (auth.uid() IS NULL AND user_id IS NULL)
);