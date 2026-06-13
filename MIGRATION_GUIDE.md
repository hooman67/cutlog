# CutLog Database Migration: Add Source Tracking

## Overview
This migration adds a `source` column to the `cuts` table to track the origin of cut data:
- `user_logged`: Data entered directly by users
- `ai_baseline`: AI-generated reference/baseline data
- `scraped_public`: Data from public sources

## Files Updated

### 1. Migration File
**Location:** `/mnt/localssd/laser_log/app/supabase/migrations/003_add_source_column.sql`

This file contains the complete migration with:
- ALTER TABLE statement to add `source` column with enum constraint
- Default value: `'user_logged'`
- Two indexes for query optimization
- Column documentation

### 2. TypeScript Types
**Location:** `/mnt/localssd/laser_log/app/src/lib/types.ts`

Updated `Cut` interface to include:
```typescript
source: 'user_logged' | 'ai_baseline' | 'scraped_public'
```

## How to Apply

### Option A: Automatic (Supabase CLI)
If using Supabase CLI with local connection:
```bash
supabase migration up
```

### Option B: Manual (Supabase SQL Editor)
Copy and paste the following SQL into Supabase SQL Editor:

```sql
-- Add data source tracking to cuts table
-- Tracks whether data came from user logs, AI baseline, or public scrapes

-- Add source column to cuts table
ALTER TABLE cuts ADD COLUMN source text NOT NULL DEFAULT 'user_logged' CHECK (source IN ('user_logged', 'ai_baseline', 'scraped_public'));

-- Create index for efficient filtering by source
CREATE INDEX idx_cuts_source ON cuts(source);

-- Create composite index for common queries (e.g., user's personal logs)
CREATE INDEX idx_cuts_user_source ON cuts(user_id, source);

-- Update existing shared cuts that appear to be community data to mark them appropriately
-- Note: Existing cuts default to 'user_logged' unless manually updated
COMMENT ON COLUMN cuts.source IS 'Data source: user_logged (user entered), ai_baseline (AI-generated reference), scraped_public (public domain data)';
```

## RLS Policies - No Changes Required

The existing RLS policies continue to work correctly with the new column:

### For SELECT operations:
- `"Users can view own cuts"` → Uses `user_id` (unaffected)
- `"Users can view shared cuts"` → Uses `is_shared` (unaffected)
- Both work regardless of `source` value

### For INSERT/UPDATE/DELETE operations:
- All operations check `user_id` and/or `is_shared`
- The new `source` column doesn't affect access control
- Default `'user_logged'` is appropriate for user-inserted data
- System processes can set other source values via direct DB updates if needed

### Why no policy changes needed:
The `source` column is informational—it describes *how* data was obtained, not *who* can access it. Access control remains based on `user_id` and `is_shared`.

## Post-Migration Checks

After applying the migration:

1. **Verify column exists:**
   ```sql
   SELECT column_name, data_type, column_default
   FROM information_schema.columns
   WHERE table_name = 'cuts' AND column_name = 'source';
   ```

2. **Verify indexes created:**
   ```sql
   SELECT indexname, indexdef
   FROM pg_indexes
   WHERE tablename = 'cuts' AND indexname LIKE 'idx_cuts_%source%';
   ```

3. **Test insert (should succeed with default):**
   ```sql
   INSERT INTO cuts (
     machine_id, user_id, material, thickness_mm
   ) VALUES (
     'machine_uuid', 'user_uuid', 'Stainless Steel 304', 2.0
   )
   RETURNING source;
   ```
   Should return: `user_logged`

4. **Test constraint violation (should fail):**
   ```sql
   INSERT INTO cuts (
     machine_id, user_id, material, thickness_mm, source
   ) VALUES (
     'machine_uuid', 'user_uuid', 'Stainless Steel 304', 2.0, 'invalid_source'
   );
   ```
   Should raise CHECK constraint violation.

## Querying by Source

### Find all user-logged cuts (most common):
```sql
SELECT * FROM cuts WHERE source = 'user_logged' AND user_id = auth.uid();
```

### Find baseline references for a material:
```sql
SELECT * FROM cuts 
WHERE material = 'Stainless Steel 304' 
  AND source = 'ai_baseline'
ORDER BY quality_rating DESC;
```

### Find scraped public data:
```sql
SELECT * FROM cuts 
WHERE source = 'scraped_public' 
  AND is_shared = true
LIMIT 10;
```

### Get source distribution for a user:
```sql
SELECT source, COUNT(*) as count
FROM cuts
WHERE user_id = auth.uid()
GROUP BY source;
```

## Frontend Updates

When building the app, consider:

1. **Insert handler:** Explicitly set `source: 'user_logged'` or let DB default
   ```typescript
   const { data, error } = await supabase
     .from('cuts')
     .insert({
       machine_id, user_id, material, thickness_mm,
       source: 'user_logged'  // explicit
     })
   ```

2. **Filter suggestions:** Show source context to users
   ```typescript
   const suggestions = cuts.filter(c => c.source === 'ai_baseline');
   ```

3. **UI indicators:** Badge/label cuts by source for transparency

## Rollback

If needed, to rollback this migration:
```sql
DROP INDEX IF EXISTS idx_cuts_user_source;
DROP INDEX IF EXISTS idx_cuts_source;
ALTER TABLE cuts DROP COLUMN source;
```

---

**Migration created:** 2026-06-12
**Target version:** 003
