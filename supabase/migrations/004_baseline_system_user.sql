-- Create system user for baseline/AI data (not owned by any real user)
-- This allows baseline cuts to be inserted without a real user_id

-- Step 1: Create a system user in auth.users (must be done via Supabase dashboard)
-- For now, we'll use a fixed UUID for the system user
-- Go to: Supabase Dashboard → Authentication → Users → "New user"
-- Email: system+baseline@cutlog.local (will NOT receive emails)
-- Password: Generate a random strong one (won't be used)
-- Once created, get the user_id UUID and replace the constant below

-- Step 2: Create a placeholder system machine (owned by system user)
-- This represents "community/baseline" data without a specific machine

-- Step 3: Make baseline cuts readable by everyone (they're always shared)
-- Update RLS policies to allow viewing baseline cuts

-- IMPORTANT: Before running this, you need to:
-- 1. Create the system user in Supabase Auth dashboard
-- 2. Get its UUID
-- 3. Replace 'SYSTEM_USER_ID_PLACEHOLDER' below with the actual UUID
-- 4. Run this migration

-- For now, we'll document the structure and you can create it manually:

-- Example system user UUID (you'll create this in the dashboard):
-- Email: system+baseline@cutlog.local
-- Then run the INSERT below with the real UUID

-- Insert a system machine for baseline data
-- (after you create the system user)
INSERT INTO machines (
  id,
  user_id,
  brand,
  model,
  wattage_w,
  source_type,
  resonator_hours,
  nickname,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,  -- Placeholder for system user UUID
  'Baseline',
  'AI Generated',
  NULL,
  'fiber',
  0,
  'Community Baseline Data',
  now()
) ON CONFLICT DO NOTHING;

-- Update baseline cuts to be always shared (readable by all users)
UPDATE cuts
SET is_shared = true
WHERE source = 'ai_baseline';

-- Add a new RLS policy to allow reading baseline cuts (already covered by is_shared = true policy)
-- But we need a policy to allow inserting baseline data from outside auth context
-- This requires a Service Role Key call from the backend

-- For now, baseline data should be inserted using the Supabase Service Role Key
-- The insertion endpoint can bypass RLS with the service role

-- Document: To insert baseline data:
-- 1. Use the Supabase Service Role Key (not the public anon key)
-- 2. Bypass RLS by using the admin client
-- 3. All baseline cuts are marked with source = 'ai_baseline' and is_shared = true
-- 4. Users can query them via the existing "Users can view shared cuts" policy
