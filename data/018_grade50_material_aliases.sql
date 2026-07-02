-- 018_grade50_material_aliases.sql
-- Make "Carbon Steel Grade 50" reliably resolve to our 12 scraped_public Grade-50 cut rows.
--
-- Problem this fixes (found 2026-07-02):
--   Our thick-metal cut rows include 12 entries labeled 'Carbon Steel Grade 50 (A572/S355)'
--   (thicknesses 10-30mm at 3-10kW, O2 assist; in data/industrial-cutting-scraped.sql), but the
--   materials table (supabase/migrations/002_seed_materials.sql) had NO "Carbon Steel Grade 50"
--   entry and NO A572 / S355 / "Gr 50" aliases. Search resolves a picked/typed material to its
--   name+aliases, then filters cut rows via `material ILIKE %name%`. So a user who picks a
--   first-class material from the dropdown never surfaces the Grade-50 rows — they only matched
--   by lucky free-text substring. Same class of bug already fixed for HRPO in
--   data/016_hrpo_material_and_aliases.sql.
--
--   Note on A36: Grade 50 (ASTM A572 Gr.50 / EN S355) is a DISTINCT, higher-strength structural
--   steel — not a synonym for A36. We deliberately do NOT alias "grade 50"/A572/S355 onto
--   'Mild Steel (A36)'; conflating them would misrepresent the material. We add Grade 50 as its
--   own standalone first-class entry instead.
--
-- Fix:
--   1. Add 'Carbon Steel Grade 50 (A572/S355)' as its own first-class, selectable material
--      (shows in the picker; label matches the cut-row material string EXACTLY so ILIKE finds it).
--   2. Give it the aliases operators actually type: the two standard designations (A572, S355),
--      the plain grade names ("Gr 50", "Grade 50", "gr50"), and the pickled-and-oiled surface
--      variants ("grade 50 p&o", "P&O carbon").
--
--   False-positive check (2026-07-02): each alias below was grepped against every distinct
--   `material` string across data/*.sql. "A572", "S355", "Grade 50" substring-match ONLY the
--   intended 'Carbon Steel Grade 50 (A572/S355)' label; "Gr 50", "gr50", "grade 50 p&o",
--   "P&O carbon" match no material name at all. No unrelated collisions — all aliases are safe.
--
-- Idempotent: INSERT ... ON CONFLICT (name) DO UPDATE. Safe to re-run.
-- Apply manually in the Supabase SQL editor per project convention.

-- 1 + 2. New Grade 50 material entry (selectable in the picker; label == cut-row material string).
INSERT INTO materials (name, category, aliases) VALUES
  ('Carbon Steel Grade 50 (A572/S355)', 'mild_steel',
   '{"A572", "S355", "Gr 50", "Grade 50", "grade 50 p&o", "gr50", "P&O carbon"}')
ON CONFLICT (name) DO UPDATE SET aliases = EXCLUDED.aliases, category = EXCLUDED.category;
