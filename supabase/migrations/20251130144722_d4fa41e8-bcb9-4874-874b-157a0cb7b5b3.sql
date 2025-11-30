-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for journal entries
CREATE POLICY "Users can insert their own journal entries"
ON public.journal_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own journal entries"
ON public.journal_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
ON public.journal_entries
FOR DELETE
USING (auth.uid() = user_id);