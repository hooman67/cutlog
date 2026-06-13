-- Run this in Supabase SQL Editor
-- Fixes: allows baseline data without user_id/machine_id

-- Make user_id and machine_id nullable for baseline data
ALTER TABLE cuts ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE cuts ALTER COLUMN machine_id DROP NOT NULL;

-- Drop and recreate INSERT policy
DROP POLICY IF EXISTS "Users can insert own cuts" ON cuts;

CREATE POLICY "Users can insert own cuts"
  ON cuts FOR INSERT WITH CHECK (
    auth.uid() = user_id
    OR user_id IS NULL
  );

-- Drop and recreate SELECT policy for shared cuts
DROP POLICY IF EXISTS "Users can view shared cuts" ON cuts;

CREATE POLICY "Users can view shared and baseline cuts"
  ON cuts FOR SELECT USING (
    is_shared = true OR source = 'ai_baseline'
  );

-- Mark any existing baseline cuts as shared
UPDATE cuts SET is_shared = true WHERE source = 'ai_baseline';
