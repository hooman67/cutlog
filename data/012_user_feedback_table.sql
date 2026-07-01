CREATE TABLE IF NOT EXISTS user_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  category text NOT NULL CHECK (category IN ('bug', 'feature', 'feedback')),
  message text NOT NULL,
  page text,
  importance text CHECK (importance IN ('nice_to_have', 'need_it', 'dealbreaker')),
  emoji_rating text CHECK (emoji_rating IN ('angry', 'neutral', 'happy', 'love')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON user_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON user_feedback FOR SELECT
  USING (auth.uid() = user_id);
