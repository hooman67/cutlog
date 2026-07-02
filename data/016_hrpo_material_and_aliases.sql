-- 016_hrpo_material_and_aliases.sql
-- Make HRPO reliably resolve to our 24 scraped_public HRPO cut rows.
--
-- Problem this fixes (found 2026-07-02):
--   Our thick-metal cut rows are labeled 'HRPO (Hot Rolled Pickled & Oiled)', but the material
--   picker only offered 'Mild Steel (A36..4140)' and 'Carbon Steel' — there was NO "HRPO" entry
--   and no plain "Mild Steel" cut data. HRPO IS mild/carbon steel (pickled+oiled surface finish,
--   not a different alloy — our own scraped note says "HRPO cuts like mild steel after pickling").
--   Search resolves a picked material to its name+aliases then filters cut rows via
--   `material ILIKE %alias%`. So HRPO rows only surfaced by luck: typing "HRPO", or picking
--   A36 specifically (whose "HR"/"hot rolled" aliases happen to substring-match "HRPO").
--   Picking any other mild-steel variant found nothing. Bonus bug: the 2-char alias "HR" also
--   substring-matched "c(HR)ome" (Chrome Plated Steel / Zippo), a false positive.
--
-- Fix:
--   1. Add HRPO as its own first-class, selectable material (so it shows in the picker and Hugh
--      sees his exact term). Its label matches the cut-row material string exactly.
--   2. Add HRPO/pickled/P&O aliases to Mild Steel (A36) so a "Mild Steel" search also surfaces
--      the HRPO rows (via the retained "hot rolled" alias + the new explicit ones).
--   3. Replace the loose "HR" alias with "HR steel" so it no longer false-matches "chrome".
--
-- Idempotent: INSERT ... ON CONFLICT DO UPDATE, and a full-array UPDATE. Safe to re-run.
-- Apply manually in the Supabase SQL editor per project convention.

-- 1 + 2. New HRPO material entry (selectable in the picker; label == cut-row material string).
INSERT INTO materials (name, category, aliases) VALUES
  ('HRPO (Hot Rolled Pickled & Oiled)', 'mild_steel',
   '{"HRPO", "pickled", "P&O", "hot rolled pickled", "pickled and oiled", "hot rolled"}')
ON CONFLICT (name) DO UPDATE SET aliases = EXCLUDED.aliases, category = EXCLUDED.category;

-- 3. Mild Steel (A36): add HRPO/pickled/P&O aliases; swap loose "HR" -> "HR steel".
UPDATE materials
  SET aliases = '{"A36", "HR steel", "hot rolled", "structural", "HRPO", "pickled", "P&O", "hot rolled pickled", "pickled and oiled"}'
  WHERE name = 'Mild Steel (A36)';
