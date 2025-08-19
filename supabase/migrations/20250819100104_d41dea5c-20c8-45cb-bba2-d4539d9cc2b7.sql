-- Add location column to workshops table
ALTER TABLE public.workshops 
ADD COLUMN location text NOT NULL DEFAULT 'Online';

-- Update existing workshops to have a default location
UPDATE public.workshops 
SET location = 'Online' 
WHERE location IS NULL;

-- Add check constraint for valid locations
ALTER TABLE public.workshops 
ADD CONSTRAINT workshops_location_check 
CHECK (location IN (
  'iSystem Khalda',
  'iSystem Abdoun', 
  'iSystem Mecca Street',
  'iSystem Swefieh',
  'iSystem City Mall',
  'Online'
));