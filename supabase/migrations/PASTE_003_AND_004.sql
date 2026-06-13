-- PASTE THIS INTO SUPABASE SQL EDITOR
-- Combines migration 003 (source column) + 004 (baseline support)

-- ===== MIGRATION 003: Add source column =====
ALTER TABLE cuts ADD COLUMN IF NOT EXISTS source text DEFAULT 'user_logged' CHECK (source IN ('user_logged', 'ai_baseline', 'scraped_public'));
CREATE INDEX IF NOT EXISTS idx_cuts_source ON cuts(source);
CREATE INDEX IF NOT EXISTS idx_cuts_user_source ON cuts(user_id, source);

-- ===== MIGRATION 004: Allow baseline data without user/machine =====
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
