-- Create waitlist table
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  notified_at timestamptz,
  status text DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'converted', 'expired')),
  CONSTRAINT unique_workshop_email UNIQUE(workshop_id, email)
);

-- Create index for faster lookups
CREATE INDEX idx_waitlist_workshop_id ON public.waitlist(workshop_id);
CREATE INDEX idx_waitlist_email ON public.waitlist(lower(email));
CREATE INDEX idx_waitlist_status ON public.waitlist(status);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view own waitlist entries" 
ON public.waitlist
FOR SELECT 
USING (
  lower(email) = lower(COALESCE(
    (SELECT email FROM public.user_profiles WHERE user_id = auth.uid()),
    current_setting('request.jwt.claims', true)::json->>'email'
  ))
);

CREATE POLICY "Admins can manage all waitlist entries" 
ON public.waitlist
FOR ALL 
USING (public.is_current_user_admin());

-- Create RPC function for adding to waitlist with position calculation
CREATE OR REPLACE FUNCTION public.add_to_waitlist(
  p_workshop_id uuid,
  p_email text,
  p_name text DEFAULT NULL,
  p_phone text DEFAULT NULL
)
RETURNS TABLE(id uuid, queue_position integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_id uuid;
  v_position integer;
BEGIN
  -- Validate email format
  IF p_email IS NULL OR p_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;
  
  IF p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Sanitize inputs
  p_email := lower(trim(p_email));
  p_name := public.sanitize_text_input(p_name);
  p_phone := public.sanitize_text_input(p_phone);
  
  -- Insert or update existing entry
  INSERT INTO public.waitlist (workshop_id, email, name, phone)
  VALUES (p_workshop_id, p_email, p_name, p_phone)
  ON CONFLICT (workshop_id, email) 
  DO UPDATE SET 
    name = COALESCE(EXCLUDED.name, waitlist.name),
    phone = COALESCE(EXCLUDED.phone, waitlist.phone),
    status = 'waiting',
    created_at = now()
  RETURNING waitlist.id INTO v_id;
  
  -- Calculate position in waitlist
  SELECT COUNT(*) INTO v_position
  FROM public.waitlist w
  WHERE w.workshop_id = p_workshop_id
    AND w.status = 'waiting'
    AND w.created_at <= (SELECT created_at FROM public.waitlist WHERE waitlist.id = v_id);
  
  -- Log waitlist addition for security monitoring
  PERFORM public.log_security_event(
    'waitlist_added',
    jsonb_build_object(
      'workshop_id', p_workshop_id,
      'waitlist_id', v_id,
      'queue_position', v_position
    ),
    'low'
  );
  
  RETURN QUERY SELECT v_id, v_position;
END;
$$;