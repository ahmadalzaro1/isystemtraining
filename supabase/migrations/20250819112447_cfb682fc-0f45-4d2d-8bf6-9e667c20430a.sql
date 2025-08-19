-- Add max_capacity field to workshops table
ALTER TABLE workshops 
ADD COLUMN max_capacity integer NOT NULL DEFAULT 12;

-- Update existing workshops to have the default capacity
UPDATE workshops 
SET max_capacity = 12 
WHERE max_capacity IS NULL;