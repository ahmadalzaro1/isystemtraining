-- Fix RPC to avoid reserved identifier in RETURNS TABLE
CREATE OR REPLACE FUNCTION public.get_workshops_week(
  p_start date,
  p_end date,
  p_levels text[] DEFAULT NULL,
  p_categories text[] DEFAULT NULL,
  p_query text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  instructor text,
  date date,
  time_text text,
  skill_level text,
  category text,
  spots_remaining integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    w.id,
    w.name,
    w.instructor,
    w.date,
    w.time AS time_text,
    w.skill_level,
    w.category,
    w.spots_remaining
  FROM public.workshops w
  WHERE w.date >= p_start
    AND w.date <= p_end
    AND (p_levels IS NULL OR w.skill_level = ANY(p_levels))
    AND (p_categories IS NULL OR w.category = ANY(p_categories))
    AND (
      p_query IS NULL OR p_query = '' OR
      w.name ILIKE '%' || p_query || '%' OR
      COALESCE(w.description, '') ILIKE '%' || p_query || '%' OR
      w.instructor ILIKE '%' || p_query || '%'
    )
  ORDER BY w.date ASC, w.time ASC;
$$;