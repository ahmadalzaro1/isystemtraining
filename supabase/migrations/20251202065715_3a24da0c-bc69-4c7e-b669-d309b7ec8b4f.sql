-- First, fix the existing data by syncing spots_remaining with actual registrations
UPDATE workshops
SET spots_remaining = max_capacity - COALESCE((
  SELECT COUNT(*) 
  FROM workshop_registrations 
  WHERE workshop_registrations.workshop_id = workshops.id 
  AND status = 'confirmed'
), 0);

-- Create a trigger function to auto-update spots_remaining when registrations change
CREATE OR REPLACE FUNCTION update_workshop_spots()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the workshop's spots_remaining based on confirmed registrations
  UPDATE workshops
  SET spots_remaining = max_capacity - COALESCE((
    SELECT COUNT(*) 
    FROM workshop_registrations 
    WHERE workshop_id = COALESCE(NEW.workshop_id, OLD.workshop_id)
    AND status = 'confirmed'
  ), 0)
  WHERE id = COALESCE(NEW.workshop_id, OLD.workshop_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for INSERT
DROP TRIGGER IF EXISTS trigger_update_spots_on_insert ON workshop_registrations;
CREATE TRIGGER trigger_update_spots_on_insert
AFTER INSERT ON workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION update_workshop_spots();

-- Create trigger for UPDATE
DROP TRIGGER IF EXISTS trigger_update_spots_on_update ON workshop_registrations;
CREATE TRIGGER trigger_update_spots_on_update
AFTER UPDATE ON workshop_registrations
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.workshop_id IS DISTINCT FROM NEW.workshop_id)
EXECUTE FUNCTION update_workshop_spots();

-- Create trigger for DELETE
DROP TRIGGER IF EXISTS trigger_update_spots_on_delete ON workshop_registrations;
CREATE TRIGGER trigger_update_spots_on_delete
AFTER DELETE ON workshop_registrations
FOR EACH ROW
EXECUTE FUNCTION update_workshop_spots();

-- Also create a trigger to auto-sync when max_capacity changes
CREATE OR REPLACE FUNCTION sync_spots_on_capacity_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.max_capacity IS DISTINCT FROM OLD.max_capacity THEN
    NEW.spots_remaining := NEW.max_capacity - COALESCE((
      SELECT COUNT(*) 
      FROM workshop_registrations 
      WHERE workshop_id = NEW.id
      AND status = 'confirmed'
    ), 0);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_spots_on_capacity ON workshops;
CREATE TRIGGER trigger_sync_spots_on_capacity
BEFORE UPDATE ON workshops
FOR EACH ROW
WHEN (OLD.max_capacity IS DISTINCT FROM NEW.max_capacity)
EXECUTE FUNCTION sync_spots_on_capacity_change();