-- Update workshops table check constraint to include "Digital Art on iPad" category

-- Drop the existing check constraint
ALTER TABLE public.workshops 
DROP CONSTRAINT IF EXISTS workshops_category_check;

-- Add updated check constraint with all categories including "Digital Art on iPad"
ALTER TABLE public.workshops 
ADD CONSTRAINT workshops_category_check 
CHECK (category IN (
  'Mac', 
  'iPhone', 
  'Apple Watch', 
  'AI', 
  'Digital Safety', 
  'Creativity', 
  'Productivity', 
  'iCloud', 
  'Digital Art on iPad'
));