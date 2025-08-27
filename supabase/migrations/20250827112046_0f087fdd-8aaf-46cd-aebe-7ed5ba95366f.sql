-- Create guide categories table
CREATE TABLE public.guide_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Lucide icon name
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guides table
CREATE TABLE public.guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT, -- Full markdown/HTML content
  category_id UUID NOT NULL REFERENCES public.guide_categories(id) ON DELETE CASCADE,
  author TEXT,
  read_time INTEGER, -- Estimated read time in minutes
  difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  featured_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create guide sections table for step-by-step content
CREATE TABLE public.guide_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- Markdown/HTML content for the section
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guide steps table for detailed instructions
CREATE TABLE public.guide_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES public.guide_sections(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT,
  content TEXT NOT NULL, -- Step instruction content
  image_url TEXT,
  tips TEXT, -- Additional tips or notes
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.guide_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guide_categories
CREATE POLICY "Anyone can view active categories" ON public.guide_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.guide_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for guides
CREATE POLICY "Anyone can view published guides" ON public.guides
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage guides" ON public.guides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for guide_sections
CREATE POLICY "Anyone can view sections of published guides" ON public.guide_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.guides 
      WHERE id = guide_sections.guide_id AND is_published = true
    )
  );

CREATE POLICY "Admins can manage sections" ON public.guide_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- RLS Policies for guide_steps
CREATE POLICY "Anyone can view steps of published guides" ON public.guide_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.guide_sections gs
      JOIN public.guides g ON g.id = gs.guide_id
      WHERE gs.id = guide_steps.section_id AND g.is_published = true
    )
  );

CREATE POLICY "Admins can manage steps" ON public.guide_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Create updated_at triggers
CREATE TRIGGER update_guide_categories_updated_at
  BEFORE UPDATE ON public.guide_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_sections_updated_at
  BEFORE UPDATE ON public.guide_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_steps_updated_at
  BEFORE UPDATE ON public.guide_steps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial categories based on your outline
INSERT INTO public.guide_categories (name, slug, description, icon, sort_order) VALUES
  ('Digital Safety & Privacy', 'digital-safety-privacy', 'Secure your Apple devices and protect your digital identity', 'Shield', 1),
  ('AI for Everyday', 'ai-everyday', 'Practical AI tools and tips for productivity and creativity', 'Brain', 2),
  ('Smart Family Tech', 'smart-family-tech', 'Family-friendly tech solutions and parental controls', 'Users', 3),
  ('Apple Device Essentials', 'apple-device-essentials', 'Master your iPhone, iPad, and Mac with essential tips', 'Smartphone', 4),
  ('Apple Services & Ecosystem', 'apple-services-ecosystem', 'Get the most out of iCloud, Apple One, and device syncing', 'Cloud', 5);