-- Scraped Laser Cutting Parameters from Public Sources
-- Source 1: lasertips.org (fiber laser marking/cutting parameters)
-- Source 2: Wikipedia - Laser Cutting article (CO2 laser cutting speeds and power)
-- Generated: 2026-06-12
--
-- Conversion notes applied:
--   - Wikipedia speeds: cm/s * 10 * 60 = mm/min (cm/s -> mm/s -> mm/min)
--   - lasertips.org speeds: mm/s * 60 = mm/min (where speed > 0)
--   - Power percentages: derived from stated wattage vs machine max
--   - Missing fields: NULL where data not available from source
--   - source: 'scraped_public'
--   - is_shared: true
--   - quality_rating: 4 (published reference data)
--   - edge_quality: 'clean' (published optimal parameters)

INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES

-- =============================================================================
-- Source: lasertips.org - Fiber laser cutting parameters
-- Laser types: Raycus 20W/30W, JPT 50W/100W/200W
-- =============================================================================

-- Brass cutting (Raycus 30W, power_pct = 100% of 30W)
('Brass', 0.4, 100, NULL, NULL, NULL, NULL, NULL, NULL, 0.05, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:00Z'::timestamptz),

-- Brass cutting (Raycus 20W, power_pct = 100% of 20W)
('Brass', 1.5, 100, NULL, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:01Z'::timestamptz),

-- Brass cutting (JPT 50W, power_pct = 90% of 50W)
('Brass', 0.5, 90, NULL, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:02Z'::timestamptz),

-- Silver cutting (Raycus 30W, power_pct = 95%)
('Silver', 0.4, 95, NULL, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:03Z'::timestamptz),
('Silver', 0.5, 95, NULL, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:04Z'::timestamptz),
('Silver', 0.6, 95, NULL, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:05Z'::timestamptz),
('Silver', 0.7, 95, NULL, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:06Z'::timestamptz),
('Silver', 0.8, 20, NULL, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:07Z'::timestamptz),
('Silver', 0.9, 95, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:08Z'::timestamptz),

-- Silver cutting (JPT 100W, speed 200 mm/s = 12000 mm/min)
('Silver', 1.0, 95, 12000, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:09Z'::timestamptz),

-- Silver cutting (JPT 200W, speed 200 mm/s = 12000 mm/min)
('Silver', 1.5, 95, 12000, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:10Z'::timestamptz),
('Silver', 2.0, 95, 12000, NULL, NULL, NULL, NULL, NULL, 0.01, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:11Z'::timestamptz),

-- Gold/Silver cutting (JPT 30W, speed 200 mm/s = 12000 mm/min, power 90%)
('Gold', 0.5, 90, 12000, NULL, NULL, NULL, NULL, NULL, 0.5, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:12Z'::timestamptz),

-- Aluminum cutting (JPT 50W, power 95%)
('Aluminum', 0.5, 95, NULL, NULL, NULL, NULL, NULL, NULL, 0.05, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:13Z'::timestamptz),

-- Carbon Steel cutting (1000W JNCT, speed 35 mm/s = 2100 mm/min, power_pct = 100% of 1000W)
('Mild Steel', 1.0, 100, 2100, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:00:14Z'::timestamptz),

-- =============================================================================
-- Source: Wikipedia - Laser Cutting article
-- CO2 laser cutting rates (cm/s converted to mm/min)
-- Power data from heat input requirements table
-- Gas type inferred from standard industrial practice:
--   Mild steel: O2 (oxygen-assisted combustion cutting)
--   Stainless steel: N2 (inert gas for clean edge)
--   Aluminum: N2 (inert gas)
--   Titanium: Ar (argon for reactive metal)
-- =============================================================================

-- Stainless Steel - 0.51mm (1000W CO2)
-- Speed: 42.3 cm/s = 25380 mm/min
('Stainless Steel 304', 0.51, 100, 25380, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:00Z'::timestamptz),

-- Stainless Steel - 1.0mm (1000W CO2)
-- Speed: 23.28 cm/s = 13968 mm/min
('Stainless Steel 304', 1.0, 100, 13968, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:01Z'::timestamptz),

-- Stainless Steel - 2.0mm (1000W CO2)
-- Speed: 13.76 cm/s = 8256 mm/min
('Stainless Steel 304', 2.0, 100, 8256, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:02Z'::timestamptz),

-- Stainless Steel - 3.2mm (1500W CO2)
-- Speed: 7.83 cm/s = 4698 mm/min
('Stainless Steel 304', 3.2, 100, 4698, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:03Z'::timestamptz),

-- Stainless Steel - 6.4mm (2500W CO2)
-- Speed: 3.4 cm/s = 2040 mm/min
('Stainless Steel 304', 6.4, 100, 2040, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:04Z'::timestamptz),

-- Stainless Steel - 13mm (power unknown, interpolated)
-- Speed: 0.76 cm/s = 456 mm/min
('Stainless Steel 304', 13.0, 100, 456, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:05Z'::timestamptz),

-- Aluminum - 0.51mm (1000W CO2)
-- Speed: 33.87 cm/s = 20322 mm/min
('Aluminum', 0.51, 100, 20322, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:06Z'::timestamptz),

-- Aluminum - 1.0mm (1000W CO2)
-- Speed: 14.82 cm/s = 8892 mm/min
('Aluminum', 1.0, 100, 8892, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:07Z'::timestamptz),

-- Aluminum - 2.0mm (1000W CO2)
-- Speed: 6.35 cm/s = 3810 mm/min
('Aluminum', 2.0, 100, 3810, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:08Z'::timestamptz),

-- Aluminum - 3.2mm (3800W CO2)
-- Speed: 4.23 cm/s = 2538 mm/min
('Aluminum', 3.2, 100, 2538, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:09Z'::timestamptz),

-- Aluminum - 6.4mm (10000W CO2)
-- Speed: 1.69 cm/s = 1014 mm/min
('Aluminum', 6.4, 100, 1014, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:10Z'::timestamptz),

-- Aluminum - 13mm
-- Speed: 1.27 cm/s = 762 mm/min
('Aluminum', 13.0, 100, 762, 'N2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:11Z'::timestamptz),

-- Mild Steel - 1.0mm (400W CO2)
-- Speed: 8.89 cm/s = 5334 mm/min
('Mild Steel', 1.0, 100, 5334, 'O2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:12Z'::timestamptz),

-- Mild Steel - 2.0mm (implied ~450W CO2)
-- Speed: 7.83 cm/s = 4698 mm/min
('Mild Steel', 2.0, 100, 4698, 'O2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:13Z'::timestamptz),

-- Mild Steel - 3.2mm (500W CO2)
-- Speed: 6.35 cm/s = 3810 mm/min
('Mild Steel', 3.2, 100, 3810, 'O2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:14Z'::timestamptz),

-- Mild Steel - 6.4mm (implied ~800W CO2)
-- Speed: 4.23 cm/s = 2538 mm/min
('Mild Steel', 6.4, 100, 2538, 'O2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:15Z'::timestamptz),

-- Mild Steel - 13mm
-- Speed: 2.1 cm/s = 1260 mm/min
('Mild Steel', 13.0, 100, 1260, 'O2', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:16Z'::timestamptz),

-- Titanium - 0.51mm (250W CO2)
-- Speed: 12.7 cm/s = 7620 mm/min
('Titanium', 0.51, 100, 7620, 'Ar', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:17Z'::timestamptz),

-- Titanium - 1.0mm (210W CO2)
-- Speed: 12.7 cm/s = 7620 mm/min
('Titanium', 1.0, 100, 7620, 'Ar', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:18Z'::timestamptz),

-- Titanium - 2.0mm (210W CO2)
-- Speed: 4.23 cm/s = 2538 mm/min
('Titanium', 2.0, 100, 2538, 'Ar', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:19Z'::timestamptz),

-- Titanium - 3.2mm
-- Speed: 3.4 cm/s = 2040 mm/min
('Titanium', 3.2, 100, 2040, 'Ar', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:20Z'::timestamptz),

-- Titanium - 6.4mm
-- Speed: 2.5 cm/s = 1500 mm/min
('Titanium', 6.4, 100, 1500, 'Ar', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:21Z'::timestamptz),

-- Titanium - 13mm
-- Speed: 1.7 cm/s = 1020 mm/min
('Titanium', 13.0, 100, 1020, 'Ar', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:22Z'::timestamptz),

-- =============================================================================
-- Source: Wikipedia - Additional materials (Plywood, Boron/Epoxy)
-- =============================================================================

-- Plywood - 6.4mm (650W CO2)
-- Speed: 7.62 cm/s = 4572 mm/min
('Plywood', 6.4, 100, 4572, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:23Z'::timestamptz),

-- Plywood - 13mm
-- Speed: 1.9 cm/s = 1140 mm/min
('Plywood', 13.0, 100, 1140, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:24Z'::timestamptz),

-- Boron/Epoxy composite - 3.2mm (3000W CO2)
-- Speed: 2.5 cm/s = 1500 mm/min
('Boron Epoxy', 3.2, 100, 1500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:25Z'::timestamptz),

-- Boron/Epoxy composite - 6.4mm
-- Speed: 2.5 cm/s = 1500 mm/min
('Boron Epoxy', 6.4, 100, 1500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:26Z'::timestamptz),

-- Boron/Epoxy composite - 13mm
-- Speed: 1.1 cm/s = 660 mm/min
('Boron Epoxy', 13.0, 100, 660, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12T00:01:27Z'::timestamptz) ON CONFLICT DO NOTHING;
