CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  material text not null,
  thickness_mm numeric not null,
  feedback_type text not null check (feedback_type in ('too_slow', 'perfect', 'too_fast')),
  recommended_speed numeric,
  created_at timestamp with time zone default now()
);
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own feedback" ON public.feedback FOR SELECT USING (auth.uid() = user_id);
CREATE INDEX idx_feedback_material ON public.feedback(material, thickness_mm);
