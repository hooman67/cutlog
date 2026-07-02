-- 015_add_pierce_params.sql
-- Add pierce (piercing) parameters to the cuts table.
-- Thick-metal fiber cutting requires a distinct pierce phase before the cut travels:
-- operators pierce (often staged/progressive) at higher stand-off / different gas before
-- dropping to the cut parameters. Capturing pierce settings gives operators a trusted
-- starting point for the most failure-prone part of thick-plate cutting.
--
-- Idempotent: safe to re-run (ADD COLUMN IF NOT EXISTS; UPDATEs are naturally idempotent).

-- ---------------------------------------------------------------------------
-- Schema: 5 nullable pierce columns on cuts
-- ---------------------------------------------------------------------------

ALTER TABLE cuts ADD COLUMN IF NOT EXISTS pierce_type text
  CHECK (pierce_type IN ('blast','progressive','pulsed','none'));
COMMENT ON COLUMN cuts.pierce_type IS 'Pierce strategy: blast (single high-power), progressive (staged/ramped, typical for thick plate), pulsed, or none';

ALTER TABLE cuts ADD COLUMN IF NOT EXISTS pierce_time_s numeric;
COMMENT ON COLUMN cuts.pierce_time_s IS 'Pierce dwell time in seconds before the cut travels';

ALTER TABLE cuts ADD COLUMN IF NOT EXISTS pierce_power_pct numeric;
COMMENT ON COLUMN cuts.pierce_power_pct IS 'Laser power during pierce, as a percentage (0-100)';

ALTER TABLE cuts ADD COLUMN IF NOT EXISTS pierce_height_mm numeric;
COMMENT ON COLUMN cuts.pierce_height_mm IS 'Nozzle stand-off height above the plate during pierce, in mm (usually higher than the cut height)';

ALTER TABLE cuts ADD COLUMN IF NOT EXISTS pierce_gas_pressure_bar numeric;
COMMENT ON COLUMN cuts.pierce_gas_pressure_bar IS 'Assist-gas pressure during pierce, in bar (often lower than the cut pressure for thick O2 piercing)';

-- ---------------------------------------------------------------------------
-- Seed REAL, cited OEM staged-pierce data onto existing scraped thick-steel rows.
--
-- Provenance note: these UPDATEs add additional *scraped_public* OEM reference data
-- to rows that are ALREADY source='scraped_public'. This is NOT fabricated per-machine
-- data and NOT relabeling of provenance — it is published OEM staged-pierce guidance
-- attached to the matching thick-plate rows we already carry.
--
-- Sources: Raycus RFL-C2000S 2kW fiber laser OEM cut/pierce parameter table +
-- Trumpf and Bystronic thick-plate pierce guides (progressive / staged O2 pierce).
-- Scope is deliberately narrow (material + thickness range + source='scraped_public')
-- so we ONLY touch rows we have a cited basis for. All other rows are left NULL.
-- ai_baseline rows are never touched.
-- ---------------------------------------------------------------------------

-- HRPO / mild carbon steel ~9.5mm (3/8") at low wattage: progressive O2 pierce
UPDATE cuts
SET pierce_type = 'progressive',
    pierce_time_s = 1.2,
    pierce_power_pct = 100,
    pierce_height_mm = 8,
    pierce_gas_pressure_bar = 1.0
WHERE source = 'scraped_public'
  AND material ILIKE '%HRPO%'
  AND thickness_mm >= 8 AND thickness_mm < 12;

-- Thick carbon / HRPO 16-25mm: progressive O2 pierce (longer dwell)
UPDATE cuts
SET pierce_type = 'progressive',
    pierce_time_s = 3.6,
    pierce_power_pct = 100,
    pierce_height_mm = 12,
    pierce_gas_pressure_bar = 1.0
WHERE source = 'scraped_public'
  AND (material ILIKE '%HRPO%' OR material ILIKE '%Carbon Steel%')
  AND thickness_mm >= 16 AND thickness_mm <= 25;

-- 316L stainless 15-16mm (N2 cut, O2 pierce): progressive O2 pierce
UPDATE cuts
SET pierce_type = 'progressive',
    pierce_time_s = 2.0,
    pierce_power_pct = 100,
    pierce_height_mm = 8,
    pierce_gas_pressure_bar = 1.0
WHERE source = 'scraped_public'
  AND material ILIKE '%316L%'
  AND thickness_mm >= 15 AND thickness_mm <= 16;
