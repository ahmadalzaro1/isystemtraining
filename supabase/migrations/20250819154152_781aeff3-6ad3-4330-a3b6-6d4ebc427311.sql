-- Add registration_id to registration_responses table to link responses directly to registrations
ALTER TABLE public.registration_responses 
ADD COLUMN registration_id UUID;

-- Make user_id nullable since guest registrations won't have a user_id
ALTER TABLE public.registration_responses 
ALTER COLUMN user_id DROP NOT NULL;

-- Add foreign key constraint to link to workshop_registrations
ALTER TABLE public.registration_responses 
ADD CONSTRAINT fk_registration_responses_registration_id 
FOREIGN KEY (registration_id) REFERENCES public.workshop_registrations(id) ON DELETE CASCADE;

-- Add index for better performance when querying by registration_id
CREATE INDEX idx_registration_responses_registration_id 
ON public.registration_responses(registration_id);

-- Update existing records to populate registration_id where possible
-- For authenticated user responses, match by user_id and created dates
UPDATE public.registration_responses 
SET registration_id = (
  SELECT wr.id 
  FROM public.workshop_registrations wr 
  WHERE wr.user_id = registration_responses.user_id 
  AND DATE(wr.registration_date) = DATE(registration_responses.completed_at)
  ORDER BY wr.registration_date DESC 
  LIMIT 1
)
WHERE user_id IS NOT NULL AND registration_id IS NULL;