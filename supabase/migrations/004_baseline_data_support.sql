-- Support for baseline/AI data that isn't tied to a specific user or machine

-- Step 1: Make machine_id nullable for baseline cuts
-- (Baseline data doesn't belong to a specific machine)
ALTER TABLE cuts ALTER COLUMN machine_id DROP NOT NULL;

-- Step 2: Allow baseline cuts to be inserted with NULL user_id and NULL machine_id
-- We'll use a special policy for this
ALTER TABLE cuts DROP POLICY "Users can insert own cuts";

-- Recreate the policy to allow baseline inserts via Service Role
CREATE POLICY "Users can insert own cuts"
  ON cuts FOR INSERT WITH CHECK (
    auth.uid() = user_id  -- Regular users insert their own cuts
    OR auth.uid() IS NULL -- Service role (for baseline data)
  );

-- Step 3: Update RLS to allow viewing ALL baseline cuts (source = 'ai_baseline')
ALTER TABLE cuts DROP POLICY "Users can view shared cuts";

CREATE POLICY "Users can view shared and baseline cuts"
  ON cuts FOR SELECT USING (
    is_shared = true OR source = 'ai_baseline'
  );

-- Step 4: Ensure all baseline cuts are marked as shared
UPDATE cuts
SET is_shared = true
WHERE source = 'ai_baseline';

-- Verification: Check that constraints allow NULL values where needed
-- SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name='cuts' AND column_name IN ('user_id', 'machine_id');
