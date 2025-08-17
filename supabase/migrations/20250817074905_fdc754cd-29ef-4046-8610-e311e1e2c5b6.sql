-- Update existing workshops to have future dates starting from August 18, 2025
UPDATE workshops 
SET date = '2025-08-18'::date, updated_at = now()
WHERE id = '070af029-985e-41d2-9cbe-5b974c049eaf';

UPDATE workshops 
SET date = '2025-08-19'::date, updated_at = now()
WHERE id = 'b58d82a1-c8f7-4f65-8b48-8c043afdb5ba';

UPDATE workshops 
SET date = '2025-08-20'::date, updated_at = now()
WHERE id = '3920a64e-e95f-419c-a3fd-9b4d2188b8a7';

UPDATE workshops 
SET date = '2025-08-21'::date, updated_at = now()
WHERE id = '6d0be232-f488-4209-8915-1b1a05f58418';

UPDATE workshops 
SET date = '2025-08-22'::date, updated_at = now()
WHERE id = 'a1f9417b-7eab-41e1-b7ef-205d11fe31fc';

UPDATE workshops 
SET date = '2025-08-23'::date, updated_at = now()
WHERE id = '8c81a426-74f5-47cb-b472-c6b21c67c640';