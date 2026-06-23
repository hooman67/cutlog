-- ============================================================================
-- Migration 010: Lock down RLS - Block all anonymous/unauthenticated access
-- ============================================================================
--
-- Problem: Existing SELECT policies on cuts, machines, and feedback use
-- conditions like (is_shared = true) which evaluate to TRUE even for
-- unauthenticated (anon) requests. This exposes shared cuts and baseline
-- data to anyone with the Supabase anon key.
--
-- Solution: Drop all existing SELECT policies on cuts, machines, and feedback,
-- then recreate them with an explicit auth.uid() IS NOT NULL guard so that
-- only authenticated users can read any rows.
--
-- The materials table remains publicly readable (needed for autocomplete
-- before the user logs in).
--
-- Safe to paste into Supabase SQL Editor in one go.
-- ============================================================================

BEGIN;

-- ============================================================================
-- SECTION 1: DROP all existing SELECT policies on cuts, machines, feedback
-- ============================================================================

-- cuts table SELECT policies (from 001_initial_schema + 004_baseline_data_support)
DROP POLICY IF EXISTS "Users can view own cuts" ON cuts;
DROP POLICY IF EXISTS "Users can view shared cuts" ON cuts;
DROP POLICY IF EXISTS "Users can view shared and baseline cuts" ON cuts;

-- machines table SELECT policies (from 001_initial_schema)
DROP POLICY IF EXISTS "Users can view own machines" ON machines;

-- feedback table SELECT policies (from 008_create_feedback_table)
DROP POLICY IF EXISTS "Users can read own feedback" ON feedback;


-- ============================================================================
-- SECTION 2: CREATE new restrictive SELECT policies
-- ============================================================================

-- --------------------------------------------------------------------------
-- cuts table
-- --------------------------------------------------------------------------
-- Authenticated users can read their own cuts (regardless of is_shared flag)
CREATE POLICY "Authenticated users can view own cuts"
  ON cuts FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- Authenticated users can read shared cuts from other users
CREATE POLICY "Authenticated users can view shared cuts"
  ON cuts FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND is_shared = true
  );

-- Authenticated users can read AI baseline and scraped public reference data
-- (these rows have user_id = NULL, so the "own cuts" policy won't match them)
CREATE POLICY "Authenticated users can view baseline data"
  ON cuts FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND source IN ('ai_baseline', 'scraped_public')
  );

-- --------------------------------------------------------------------------
-- machines table
-- --------------------------------------------------------------------------
-- Only authenticated users can see their own machines - no anonymous access
CREATE POLICY "Authenticated users can view own machines"
  ON machines FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );

-- --------------------------------------------------------------------------
-- feedback table
-- --------------------------------------------------------------------------
-- Only authenticated users can see their own feedback - no anonymous access
CREATE POLICY "Authenticated users can view own feedback"
  ON feedback FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND auth.uid() = user_id
  );


-- ============================================================================
-- SECTION 3: Verify INSERT/UPDATE/DELETE policies are still appropriate
-- ============================================================================
-- The following policies already require auth.uid() = user_id which implicitly
-- blocks anonymous access. We list them here for documentation:
--
-- cuts:
--   "Users can insert own cuts"  - INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL)
--   "Users can update own cuts"  - UPDATE USING (auth.uid() = user_id)
--   "Users can delete own cuts"  - DELETE USING (auth.uid() = user_id)
--
-- machines:
--   "Users can insert own machines"  - INSERT WITH CHECK (auth.uid() = user_id)
--   "Users can update own machines"  - UPDATE USING (auth.uid() = user_id)
--   "Users can delete own machines"  - DELETE USING (auth.uid() = user_id)
--
-- feedback:
--   "Users can insert own feedback"  - INSERT WITH CHECK (auth.uid() = user_id)
--
-- materials:
--   "Materials are readable by everyone" - SELECT USING (true) [INTENTIONALLY PUBLIC]
--
-- No changes needed for INSERT/UPDATE/DELETE policies.


-- ============================================================================
-- SECTION 4: Verification query - list all policies after migration
-- ============================================================================

COMMIT;

-- Run this after the transaction to verify:
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('cuts', 'machines', 'feedback', 'materials')
ORDER BY tablename, cmd, policyname;
