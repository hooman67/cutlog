# Source Tracking: Quick Reference

## Apply the Migration

**Via Supabase SQL Editor (Easiest):**
1. Copy from: `supabase/migrations/003_ADD_SOURCE_PASTE.sql`
2. Open Supabase Dashboard → SQL Editor
3. Paste and run
4. Done!

**Via CLI:**
```bash
supabase migration up
```

## Schema Change

```sql
ALTER TABLE cuts ADD COLUMN source text NOT NULL 
  DEFAULT 'user_logged' 
  CHECK (source IN ('user_logged', 'ai_baseline', 'scraped_public'));
```

## TypeScript Update

```typescript
export interface Cut {
  // ... existing fields ...
  source: 'user_logged' | 'ai_baseline' | 'scraped_public'
}
```

## RLS Policies

✅ **No changes needed** — all existing policies continue to work

Why? Policies use `user_id` and `is_shared` for access control. The `source` field is informational only.

## Query Examples

**User's own cuts:**
```sql
SELECT * FROM cuts WHERE user_id = auth.uid() AND source = 'user_logged';
```

**Baseline references for a material:**
```sql
SELECT * FROM cuts WHERE material = 'Stainless Steel 304' AND source = 'ai_baseline';
```

**Source distribution:**
```sql
SELECT source, COUNT(*) FROM cuts WHERE user_id = auth.uid() GROUP BY source;
```

## Files

| File | Purpose |
|------|---------|
| `supabase/migrations/003_add_source_column.sql` | Main migration |
| `supabase/migrations/003_ADD_SOURCE_PASTE.sql` | Copy-paste version |
| `src/lib/types.ts` | TypeScript interface (updated) |
| `MIGRATION_GUIDE.md` | Detailed guide |
| `SOURCE_TRACKING_SUMMARY.md` | Full summary |

## Verification

After running the migration:
```sql
-- Check column
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'cuts' AND column_name = 'source';

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'cuts' AND indexname LIKE 'idx_cuts_%source%';
```

## Source Values

- `user_logged` — Data entered by user (default)
- `ai_baseline` — AI-generated reference data
- `scraped_public` — Data from public sources

---

**Status:** Ready to deploy
**Backward compatible:** Yes
**No app code changes required:** Yes (but filtering by source requires updates)
