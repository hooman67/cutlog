-- 017_scraped_wattage_and_dedup.sql
-- Fixes two related defects in the scraped_public cut data (found 2026-07-02).
--
-- DEFECT A — scaling never engaged (recommendations run optimistic):
--   The app reads cuts.recorded_wattage_w to know the SOURCE machine wattage and
--   down-scale a high-wattage row's speed to the user's machine
--   (suggest/page.tsx:366-370). But recorded_wattage_w was NEVER created as a column
--   — it's read but always undefined — so scaling fell back to the USER's wattage as
--   the source, meaning a 10kW row's 3800 mm/min was treated as already-2kW and not
--   scaled down. Headline came out too fast (e.g. 1460/2919 vs the true 2kW ~1200).
--   The scraped rows carry their wattage ONLY in the notes text ("2kW fiber; ...").
--   Fix: add the column and backfill it by parsing "<N>kW" / "<N>W" from notes.
--
-- DEFECT B — duplicate rows:
--   The scraped seed files are plain INSERTs with no unique constraint, so applying a
--   seed file twice duplicated every row (observed: HRPO 24 rows -> 48). Fix: delete
--   exact duplicates (keep lowest id), then add a unique index so a re-apply is a
--   no-op-safe conflict instead of a silent duplicate.
--
-- Idempotent: safe to re-run. Apply manually in the Supabase SQL editor.

-- ── A. Add + backfill recorded_wattage_w ────────────────────────────────────
ALTER TABLE cuts ADD COLUMN IF NOT EXISTS recorded_wattage_w integer;
COMMENT ON COLUMN cuts.recorded_wattage_w IS 'Source machine wattage (W) the row was recorded/scraped at; used for cross-machine speed scaling. For scraped_public rows this is parsed from the notes prefix ("<N>kW fiber; ...").';

-- Parse "<N>kW" (e.g. "10kW fiber") -> N*1000; else "<N>W" -> N. Only touch scraped
-- rows that don't already have a value, so re-runs and future manual edits are safe.
UPDATE cuts
SET recorded_wattage_w = (substring(notes from '([0-9]+)\s*kW'))::int * 1000
WHERE source = 'scraped_public'
  AND recorded_wattage_w IS NULL
  AND notes ~ '[0-9]+\s*kW';

UPDATE cuts
SET recorded_wattage_w = (substring(notes from '([0-9]+)\s*W'))::int
WHERE source = 'scraped_public'
  AND recorded_wattage_w IS NULL
  AND notes ~ '[0-9]+\s*W'
  AND notes !~ '[0-9]+\s*kW';

-- ── B. De-duplicate scraped rows (keep the lowest id per natural key) ────────
-- Natural key = the identifying parameter columns of a scraped row. NULLs are
-- normalized via COALESCE so duplicate NULLs collapse together.
DELETE FROM cuts a
USING cuts b
WHERE a.source = 'scraped_public'
  AND b.source = 'scraped_public'
  AND a.id > b.id
  AND a.material                       = b.material
  AND a.thickness_mm                   = b.thickness_mm
  AND COALESCE(a.power_pct,-1)         = COALESCE(b.power_pct,-1)
  AND COALESCE(a.speed_mm_min,-1)      = COALESCE(b.speed_mm_min,-1)
  AND COALESCE(a.gas_type,'')          = COALESCE(b.gas_type,'')
  AND COALESCE(a.gas_pressure_bar,-1)  = COALESCE(b.gas_pressure_bar,-1)
  AND COALESCE(a.focus_position_mm,-999) = COALESCE(b.focus_position_mm,-999)
  AND COALESCE(a.operation_type,'')    = COALESCE(b.operation_type,'')
  AND COALESCE(a.notes,'')             = COALESCE(b.notes,'');

-- Prevent future double-applies: a partial unique index over the scraped natural key.
-- A repeated seed INSERT will now raise a conflict (visible) rather than duplicate.
CREATE UNIQUE INDEX IF NOT EXISTS uq_cuts_scraped_natural_key
  ON cuts (
    material, thickness_mm,
    COALESCE(power_pct,-1),
    COALESCE(speed_mm_min,-1),
    COALESCE(gas_type,''),
    COALESCE(gas_pressure_bar,-1),
    COALESCE(focus_position_mm,-999),
    COALESCE(operation_type,''),
    md5(COALESCE(notes,''))
  )
  WHERE source = 'scraped_public';
