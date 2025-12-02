-- Fix search_path security warnings for the new trigger functions
CREATE OR REPLACE FUNCTION update_workshop_spots()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION sync_spots_on_capacity_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;