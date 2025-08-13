-- Fix workshop_registrations table to ensure data integrity
-- Add foreign key constraint and make workshop_id NOT NULL

-- First, clean up any existing null workshop_id records (there shouldn't be any with proper RLS)
DELETE FROM workshop_registrations WHERE workshop_id IS NULL;

-- Make workshop_id NOT NULL since every registration must reference a workshop
ALTER TABLE workshop_registrations 
ALTER COLUMN workshop_id SET NOT NULL;

-- Add foreign key constraint to ensure referential integrity
ALTER TABLE workshop_registrations 
ADD CONSTRAINT fk_workshop_registrations_workshop_id 
FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop_id 
ON workshop_registrations(workshop_id);

-- Add check constraint to ensure guest registrations have email
ALTER TABLE workshop_registrations 
ADD CONSTRAINT chk_guest_registration_email 
CHECK (
  (user_id IS NOT NULL) OR 
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_email != '')
);

-- Update updated_at timestamp trigger if it doesn't exist for workshop_registrations
CREATE OR REPLACE TRIGGER update_workshop_registrations_updated_at
BEFORE UPDATE ON workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();