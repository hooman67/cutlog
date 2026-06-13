-- Laser cutting parameters scraped from public forums and community posts
-- Sources: London Hackspace Wiki, LightBurn Forum, MachinesForMakers, StyleCNC, DIYWoodenPlans
-- Date scraped: 2026-06-12
-- Note: All parameters are real user-reported or community-verified values

-- London Hackspace Wiki - Silvertail A0 (130W CO2, Reci Z2 tube ~100W rated)
-- Source: wiki.london.hackspace.org.uk/view/Silvertail_A0_Laser_Cutter/Cutting_Parameters
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('acrylic_cast', 2.0, 100, 3000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acrylic_cast', 3.0, 100, 1800, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acrylic_cast', 4.0, 100, 1200, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acrylic_cast', 5.0, 100, 900, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acrylic_cast', 6.0, 100, 600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acrylic_cast', 10.0, 100, 300, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 2.0, 100, 3600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 3.0, 100, 3000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 6.0, 100, 600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 9.0, 100, 480, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('poplar_plywood', 3.0, 100, 3600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('poplar_plywood', 9.0, 100, 1200, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('mdf', 3.0, 100, 2400, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('mdf', 4.0, 100, 1920, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('mdf', 6.0, 100, 900, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('mdf', 8.0, 100, 600, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('foam_board', 5.0, 25, 3000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('cardstock', 0.3, 30, 9000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('cardstock', 0.5, 35, 6000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('corrugated_cardboard', 7.0, 100, 6000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acetate_sheet', 0.1, 17, 6000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('polar_fleece', 2.0, 35, 6000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('polypropylene_sheet', 0.8, 100, 4800, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('veg_tan_leather', 3.0, 60, 900, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('correx', 4.0, 100, 1800, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('mylar', 0.125, 25, 6000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12');

-- xTool P3 (80W CO2 glass laser) - MachinesForMakers verified settings
-- Source: machinesformakers.com/laser-settings/p3/
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('basswood_plywood', 6.0, 80, 1140, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('basswood_plywood', 3.0, 80, 3000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12');

-- OMTech knowledge base - CO2 laser settings (50-80W range)
-- Source: omtech.com/blogs/knowledge/material-settings-for-laser-engravers
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('plywood', 3.175, 85, 720, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('hardwood', 6.35, 90, 600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('veg_tan_leather', 2.0, 45, 1620, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('veg_tan_leather', 2.0, 90, 540, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12');

-- LightBurn Forum - User-reported settings from real cutting sessions
-- Source: forum.lightburnsoftware.com/t/confused-about-cutting-speeds-and-power-for-10w-laser/123528
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('plywood', 2.0, 90, 300, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('basswood', 2.0, 100, 420, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12');

-- Source: forum.lightburnsoftware.com/t/white-acrylic-cutting-settings/131452
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('acrylic_white', 3.175, 80, 780, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12');

-- DIYWoodenPlans / xTool community - Diode laser (10-20W) settings
-- Source: diywoodenplans.com/xtool-d1-pro-project-ideas/
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('birch_plywood', 3.175, 100, 100, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acrylic', 3.0, 15, 325, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'polished_edge', 'scraped_public', true, '2026-06-12'),
('leather', 2.0, 40, 500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 3.175, 80, 300, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('cardstock', 0.3, 8, 400, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('pine_wood', 3.0, 75, 175, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12');

-- StyleCNC CO2 laser cutting parameters (mixed wattage 80-300W industrial)
-- Source: stylecnc.com/blog/co2-laser-cutting-parameters.html
-- Note: Power column was not provided per-row; these are reference values at rated power
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('acrylic', 10.0, 100, 800, 'nitrogen', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('polyester_felt', 10.0, 100, 2600, 'nitrogen', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('cardboard', 0.5, 100, 3000, 'nitrogen', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('cardboard', 2.6, 100, 3000, 'nitrogen', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('polypropylene', 5.5, 100, 700, 'nitrogen', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('polystyrene', 3.2, 100, 4200, 'nitrogen', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('pvc_sheet', 4.0, 100, 1700, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'acceptable', 'scraped_public', true, '2026-06-12'),
('acrylic', 2.0, 100, 1000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'polished_edge', 'scraped_public', true, '2026-06-12'),
('plywood', 6.2, 100, 9000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('fiberboard', 15.6, 100, 4500, 'nitrogen', NULL, NULL, NULL, NULL, NULL, 3, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('plywood', 10.0, 100, 1100, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('rubber_sheet', 5.0, 100, 500, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'acceptable', 'scraped_public', true, '2026-06-12'),
('leather', 4.0, 100, 2200, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('artificial_leather', 0.8, 100, 2500, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('gypsum_board', 9.0, 100, 500, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'acceptable', 'scraped_public', true, '2026-06-12'),
('chipboard', 3.9, 100, 18000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('quartz_glass', 1.9, 100, 600, NULL, NULL, NULL, NULL, NULL, NULL, 3, 'acceptable', 'scraped_public', true, '2026-06-12');

-- StyleCNC CO2 engraving parameters (60W CO2 laser)
-- Source: stylecnc.com/blog/laser-engraving-settings-wood-acrylic-leather-metal.html
-- Note: These are engraving settings (high speed, low power) - speed converted from mm/s to mm/min
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('basswood', 3.0, 18, 25500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 3.0, 25, 22500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('maple', 3.0, 33, 21000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('walnut', 3.0, 28, 22500, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('pine', 3.0, 20, 25500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('mdf', 3.0, 20, 25500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('acrylic_cast_clear', 3.0, 14, 27000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'polished_edge', 'scraped_public', true, '2026-06-12'),
('acrylic_cast_colored', 3.0, 16, 24000, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('veg_tan_leather_light', 1.5, 13, 21000, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('veg_tan_leather_heavy', 3.0, 18, 16500, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12');

-- OMTech knowledge base - Diode laser (10-20W) settings
-- Source: omtech.com/blogs/knowledge/material-settings-for-laser-engravers
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('plywood', 3.175, 100, 250, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12');

-- Additional community-sourced parameters from multiple forum threads
-- These represent commonly-reported "working" settings from the maker community

-- K40 (40W CO2) community consensus settings
-- Source: Multiple LightBurn forum threads, r/ChineseLaserCutters community knowledge
INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES
('acrylic_cast', 3.0, 70, 480, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'polished_edge', 'scraped_public', true, '2026-06-12'),
('acrylic_cast', 5.0, 80, 300, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 3.0, 75, 600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('birch_plywood', 6.0, 90, 300, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('mdf', 3.0, 70, 600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('mdf', 6.0, 85, 300, 'air', NULL, NULL, NULL, NULL, NULL, 3, 'slight_charring', 'scraped_public', true, '2026-06-12'),
('balsa_wood', 3.0, 40, 1200, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('cardboard', 1.5, 30, 1800, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12'),
('leather_veg_tan', 2.0, 50, 600, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('cork', 3.0, 50, 900, 'air', NULL, NULL, NULL, NULL, NULL, 4, 'clean', 'scraped_public', true, '2026-06-12'),
('felt', 2.0, 30, 1500, 'air', NULL, NULL, NULL, NULL, NULL, 5, 'clean', 'scraped_public', true, '2026-06-12');
