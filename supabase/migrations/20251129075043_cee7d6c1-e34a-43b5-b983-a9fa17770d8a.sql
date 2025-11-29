-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  wellness_goals TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create mood assessments table
CREATE TABLE public.mood_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  responses JSONB NOT NULL,
  scores JSONB NOT NULL,
  ai_insights TEXT,
  overall_score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.mood_assessments ENABLE ROW LEVEL SECURITY;

-- Mood assessments policies
CREATE POLICY "Users can view their own assessments"
  ON public.mood_assessments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own assessments"
  ON public.mood_assessments FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create game progress table
CREATE TABLE public.game_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  game_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  session_duration INTEGER, -- in seconds
  stress_before INTEGER, -- 1-10 scale
  stress_after INTEGER, -- 1-10 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;

-- Game progress policies
CREATE POLICY "Users can view their own game progress"
  ON public.game_progress FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own game progress"
  ON public.game_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create wellness metrics table for tracking 10 dimensions over time
CREATE TABLE public.wellness_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.mood_assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  emotional_wellbeing INTEGER NOT NULL,
  stress_anxiety INTEGER NOT NULL,
  sleep_quality INTEGER NOT NULL,
  social_connections INTEGER NOT NULL,
  physical_health INTEGER NOT NULL,
  work_life_balance INTEGER NOT NULL,
  self_care INTEGER NOT NULL,
  mental_clarity INTEGER NOT NULL,
  resilience INTEGER NOT NULL,
  life_satisfaction INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.wellness_metrics ENABLE ROW LEVEL SECURITY;

-- Wellness metrics policies
CREATE POLICY "Users can view their own wellness metrics"
  ON public.wellness_metrics FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own wellness metrics"
  ON public.wellness_metrics FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create trigger to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();