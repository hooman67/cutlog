-- 019_material_alias_audit.sql
-- Close ALL remaining material-picker -> cut-data alias gaps in one pass.
--
-- The recurring bug (hit 3x: HRPO in 016, Grade 50 in 018, and plain "Carbon Steel"):
--   Search (src/app/api/search/route.ts) resolves a picked/typed material against the
--   `materials` table (name ILIKE %input% OR alias = input), collects the matched entries'
--   name+aliases, then filters cut rows via `material ILIKE %resolvedName%`. So a picked
--   material only surfaces a cut row if some materials entry's NAME (or an alias) is a
--   case-insensitive SUBSTRING of that cut row's `material` label. If NO entry name/alias
--   is a substring of a cut-label, picking from the dropdown never surfaces those rows -
--   they only appear by lucky free-text substring.
--
-- Audit (2026-07-02): extracted the 573 distinct `material` labels across the cut-data
--   seed files (data/*.sql: baseline-parameters, industrial-cutting, competitors, omglaser,
--   lightburn, lasertips*, reddit-forums), then tested each against the post-016/018
--   materials table using the exact `material ILIKE %name%` substring direction of the
--   resolver. Result: 413 distinct labels (3,656 rows) did NOT resolve from any picker
--   selection. The bulk were GENERIC base material names that carry the most rows but had
--   only specific-grade entries in the table (e.g. label "Aluminum" 146 rows, but the table
--   only had "Aluminum 6061" etc., whose names are NOT substrings of the bare label).
--
-- Fix: add first-class, selectable `materials` entries whose NAME is the generic base label
--   itself (so ILIKE %name% catches every qualified variant, e.g. entry "Cork" resolves
--   "Cork", "Cork 3mm", "Cork Sheet 3mm", "Cork coasters", ...). Prefer NEW entries over
--   mutating existing ones. Every name/alias below was grepped (case-insensitive substring)
--   against all 573 distinct labels; over-matching aliases were dropped ("SS" hit glass/
--   basswood; "CS" hit "plastics"; "Ash" hit "Washi Tape" - all removed). This migration
--   closes 321 distinct labels / 3,491 rows. The ~92 remaining are niche free-text one-offs
--   (brand names like "LoneStar Adhesives"/"Rowmark"-only variants, firearm/tumbler galvo
--   engraving notes, bare "Steel"/"Metal") intentionally NOT added: too ambiguous to alias
--   without over-matching, and out of scope for the picker.
--
-- FALSE-POSITIVE NOTES (terms that could over-match; verified safe):
--   - "aluminium" only matches the UK-spelled Aluminium engraving labels (all aluminum).
--   - "Stone" matches only Stone/stone labels; "Iron" only iron labels.
--   - "Glass" also substring-matches "Plexiglass (5W UV)" - harmless: that label already
--     resolves via Acrylic's existing "plexiglass" alias; double-match changes nothing.
--   - "canvas" (alias on Cotton Fabric) resolves the "Canvas" label (canvas is cotton).
--   - We deliberately add NO "steel"/"chrome"/"HR" style short alias (016 removed the loose
--     "HR" alias precisely because it false-matched "chrome").
--
-- Idempotent: INSERT ... ON CONFLICT (name) DO UPDATE. Safe to re-run.
-- Apply manually in the Supabase SQL editor per project convention.

INSERT INTO materials (name, category, aliases) VALUES
  -- Generic base metals (fiber cutting primary; also fiber/galvo engraving)
  ('Carbon Steel',      'mild_steel', '{"mild steel", "carbon steel plate"}'),
  ('Stainless Steel',   'stainless',  '{"stainless", "inox"}'),
  ('Aluminum',          'aluminum',   '{"aluminium"}'),
  ('Brass',             'copper',     '{"brass sheet"}'),
  ('Copper',            'copper',     '{"copper sheet"}'),
  ('Titanium',          'titanium',   '{"Ti sheet"}'),
  ('Silver',            'precious',   '{"sterling silver"}'),
  ('Gold',              'precious',   '{"18k gold", "24k gold"}'),
  ('Zinc',              'exotic',     '{"zinc sheet", "zamak"}'),
  ('Nickel',            'exotic',     '{"nickel plated"}'),
  ('Iron',              'mild_steel', '{"cast iron", "wrought iron"}'),
  ('Inconel',           'exotic',     '{"nickel superalloy"}'),
  ('Hastelloy',         'exotic',     '{"hast alloy"}'),

  -- Generic woods + common species (CO2/diode funnel + engraving)
  ('Wood',              'non_metal',  '{"hardwood", "plywood sheet", "timber"}'),
  ('Maple',             'non_metal',  '{"hard maple"}'),
  ('Walnut',            'non_metal',  '{"black walnut"}'),
  ('Cherry',            'non_metal',  '{"cherry wood"}'),
  ('Oak',               'non_metal',  '{"white oak", "red oak"}'),
  ('Basswood',          'non_metal',  '{"bass wood", "linden", "linden wood", "lime wood"}'),
  ('Bamboo',            'non_metal',  '{"bambus"}'),
  ('Pine',              'non_metal',  '{"pine board", "pine wood"}'),
  ('Alder',             'non_metal',  '{"red alder"}'),
  ('Cedar',             'non_metal',  '{"cedar wood"}'),
  ('Balsa',             'non_metal',  '{"balsa wood"}'),
  ('Poplar',            'non_metal',  '{"tulipwood"}'),
  ('Mahogany',          'non_metal',  '{"sapele"}'),
  ('Cork',              'non_metal',  '{"cork sheet"}'),

  -- Stone / glass
  ('Slate',             'non_metal',  '{"slate coaster", "pizarra"}'),
  ('Glass',             'non_metal',  '{"crystal", "borosilicate"}'),
  ('Marble',            'non_metal',  '{"marble tile"}'),
  ('Granite',           'non_metal',  '{"granite stone"}'),
  ('Stone',             'non_metal',  '{"natural stone"}'),

  -- Paper / board
  ('Paper',             'non_metal',  '{"copy paper", "notebook paper", "paperboard"}'),
  ('Cardstock',         'non_metal',  '{"card stock", "cover stock"}'),
  ('Cardboard',         'non_metal',  '{"corrugated cardboard", "corrugated"}'),
  ('Kraft Paper',       'non_metal',  '{"kraft"}'),
  ('Chipboard',         'non_metal',  '{"greyboard"}'),
  ('Hardboard',         'non_metal',  '{"HDF", "hardboard HDF"}'),
  ('Melamine',          'non_metal',  '{"melamine board"}'),

  -- Fabric / foam / rubber / film
  ('Cotton Fabric',     'non_metal',  '{"cotton", "canvas"}'),
  ('Denim Fabric',      'non_metal',  '{"denim"}'),
  ('Felt',              'non_metal',  '{"craft felt", "polyester felt", "wool felt"}'),
  ('Foam',              'non_metal',  '{"EVA foam", "foam board", "foamboard"}'),
  ('Rubber',            'non_metal',  '{"rubber stamp", "rubber sheet", "laser rubber"}'),
  ('Vinyl',             'non_metal',  '{"HTV", "HTV vinyl", "PVC film"}'),
  ('Mylar',             'non_metal',  '{"mylar stencil", "polyester film"}'),

  -- Coated / engraving laminates
  ('Powder Coat',       'coated',     '{"powder coat metal", "powdercoat"}'),
  ('Rowmark',           'coated',     '{"rowmark laserlights", "rowmark lasermax", "rowmark naturals", "engraving plastic", "engraving laminate"}')

ON CONFLICT (name) DO UPDATE SET aliases = EXCLUDED.aliases, category = EXCLUDED.category;
