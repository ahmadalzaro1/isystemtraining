-- Create workshop_registrations table
CREATE TABLE public.workshop_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id TEXT NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'confirmed',
  confirmation_code TEXT NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  guest_email TEXT,
  guest_name TEXT,
  guest_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure either user_id or guest_email is provided
  CONSTRAINT registration_user_or_guest CHECK (
    (user_id IS NOT NULL) OR (guest_email IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
ON public.workshop_registrations
FOR SELECT
USING (
  auth.uid() = user_id OR 
  auth.email() = guest_email
);

-- Users can create their own registrations
CREATE POLICY "Users can create registrations"
ON public.workshop_registrations
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NULL AND guest_email IS NOT NULL)
);

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.workshop_registrations
FOR ALL
USING (public.is_current_user_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_workshop_registrations_updated_at
BEFORE UPDATE ON public.workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_workshop_registrations_user_id ON public.workshop_registrations(user_id);
CREATE INDEX idx_workshop_registrations_guest_email ON public.workshop_registrations(guest_email);
CREATE INDEX idx_workshop_registrations_workshop_id ON public.workshop_registrations(workshop_id);
CREATE INDEX idx_workshop_registrations_confirmation_code ON public.workshop_registrations(confirmation_code);