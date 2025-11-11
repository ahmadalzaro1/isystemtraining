-- Add "Mecca Mall - SmartTech" to the workshops location check constraint

-- Drop the existing check constraint
ALTER TABLE public.workshops 
DROP CONSTRAINT IF EXISTS workshops_location_check;

-- Add the updated check constraint with the new location
ALTER TABLE public.workshops
ADD CONSTRAINT workshops_location_check 
CHECK (location IN (
  'iSystem Khalda',
  'iSystem Abdoun', 
  'iSystem Mecca Street',
  'iSystem Swefieh',
  'iSystem City Mall',
  'Mecca Mall - SmartTech',
  'Online'
));