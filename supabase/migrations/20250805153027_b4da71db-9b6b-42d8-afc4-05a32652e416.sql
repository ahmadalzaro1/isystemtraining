-- Create workshops table to replace mock data
CREATE TABLE public.workshops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  description TEXT,
  spots_remaining INTEGER NOT NULL DEFAULT 0,
  skill_level TEXT NOT NULL CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL CHECK (category IN ('Mac', 'iPhone', 'Apple Watch', 'AI', 'Digital Safety', 'Creativity', 'Productivity', 'iCloud')),
  instructor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view workshops" 
ON public.workshops 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage workshops" 
ON public.workshops 
FOR ALL 
USING (is_current_user_admin());

-- Create trigger for timestamps
CREATE TRIGGER update_workshops_updated_at
BEFORE UPDATE ON public.workshops
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update workshop_registrations to use workshops table
ALTER TABLE public.workshop_registrations 
ADD COLUMN workshop_uuid UUID REFERENCES public.workshops(id);

-- Create index for better performance
CREATE INDEX idx_workshops_date ON public.workshops(date);
CREATE INDEX idx_workshops_category ON public.workshops(category);
CREATE INDEX idx_workshops_skill_level ON public.workshops(skill_level);