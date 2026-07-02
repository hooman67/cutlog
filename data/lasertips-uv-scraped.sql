-- Scraped UV and CO2 Galvo Laser Parameters from lasertips.org ecosystem
-- Source 1: uv.lasertips.org (UV laser marking/engraving parameters)
-- Source 2: co2galvo.lasertips.org (CO2 galvo laser parameters)
-- Generated: 2026-06-23
-- UV entries: 51
-- CO2 galvo entries: 11
-- Total: 62
--
-- Conversion notes:
--   - Speed: mm/s * 60 = mm/min
--   - Frequency: kHz * 1000 = Hz
--   - thickness_mm: 0 for engraving/marking, extracted from name for cutting
--   - source: 'scraped_public'
--   - is_shared: true
--   - quality_rating: 4 (community-contributed reference data)

INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, frequency_hz, quality_rating, notes, source, is_shared, operation_type, num_passes) VALUES

-- =============================================================================
-- Source: uv.lasertips.org - UV laser parameters (51 entries)
-- Laser types: UV 3W/5W/10W (JPT, Sculpfun)
-- =============================================================================
-- PHOTO ON IKEA SUNDVIK CHAIR
('PHOTO ON IKEA SUNDVIK CHAIR', 0, NULL, 24000, NULL, NULL, NULL, NULL, NULL, 0.0212, 30000, 4, 'Machine: UV 5W; Q-pulse: 1; Hatch: unidirectional; Lens: 150mm; Sculpfun V5 with SGD Laser', 'scraped_public', true, 'engrave', 1),
-- 5MM MULTIPLEX CUT
('5MM MULTIPLEX CUT', 5, NULL, 2400, NULL, NULL, NULL, NULL, NULL, NULL, 40000, 4, 'Machine: UV 5W; Q-pulse: 1; Lens: 150mm; Sculpfun V5 with SGD Laser', 'scraped_public', true, 'cut', 25),
-- 3MM MULTIPLEX CUT
('3MM MULTIPLEX CUT', 3, NULL, 6000, NULL, NULL, NULL, NULL, NULL, NULL, 40000, 4, 'Machine: UV 5W; Q-pulse: 1; Hatch: bi-dir; Lens: 150mm; Sculpfun V5 with SGDLaser', 'scraped_public', true, 'cut', 20),
-- COCONUT SHELL
('COCONUT SHELL', 0, NULL, 6000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: JPT 5W; Q-pulse: 10.0; Hatch: bi-dir; Lens: 174mm; Bi-directional fill, diffusion fill', 'scraped_public', true, 'engrave', NULL),
-- COCONUT ENGRAVING
('COCONUT ENGRAVING', 0, NULL, 6000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: JPT 5W; Q-pulse: 10.0; Hatch: bi-dir; Lens: 174mm; Bi-directional fill, diffusion fill', 'scraped_public', true, 'engrave', NULL),
-- COCONUT
('COCONUT', 0, NULL, 6000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: JPT 5W; Q-pulse: 10.0; Hatch: bi-dir; Lens: 174mm; Bi-directional fill, diffusion fill', 'scraped_public', true, 'engrave', NULL),
-- ZAMAK (ZINC DIE CASTING ALLOYS)  - COPPER COLORED
('ZAMAK (ZINC DIE CASTING ALLOYS)  - COPPER COLORED', 0, NULL, 40800, NULL, NULL, NULL, NULL, NULL, 0.002, 35000, 4, 'Machine: JPT 5W; Q-pulse: 2; Hatch: bi-dir; Lens: 110mm; Angle: 0', 'scraped_public', true, 'mark', NULL),
-- GLASS CHAMPAIGNE FLUTE
('GLASS CHAMPAIGNE FLUTE', 0, NULL, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 60000, 4, 'Machine: JPT 10W; Q-pulse: 1; Hatch: bi-dir; Lens: 210mm; Angle: 0; Rotary .3 split zero overlap. Focus down 3mm', 'scraped_public', true, 'engrave', NULL),
-- BLACK ON ALUMINIUM
('BLACK ON ALUMINIUM', 0, NULL, 3000, NULL, NULL, NULL, NULL, NULL, 0.01, 30000, 4, 'Machine: JPT 5W; Q-pulse: 1; Hatch: cross-hatch; Lens: 150mm', 'scraped_public', true, 'engrave', 1),
-- ENGRAVED STEEL WITH 5W UV
('ENGRAVED STEEL WITH 5W UV', 0, NULL, 18000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: JPT 5W; Q-pulse: 10; Hatch: cross-hatch; Lens: 175mm; Angle: 0; Enable : Flood fill', 'scraped_public', true, 'engrave', NULL),
-- PHOTO ENGRAVING ON A BLACK ALUMINIUM BUSSINES CARD
('PHOTO ENGRAVING ON A BLACK ALUMINIUM BUSSINES CARD', 0, NULL, 24000, NULL, NULL, NULL, NULL, NULL, NULL, 72000, 4, 'Machine: 5w; Q-pulse: 7; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- BLACK ON TUMBLER
('BLACK ON TUMBLER', 0, NULL, 30000, NULL, NULL, NULL, NULL, NULL, 0.02, 70000, 4, 'Machine: 5W uv; Q-pulse: 3; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- TESA 6930 LASERABLE TAPE CUT
('TESA 6930 LASERABLE TAPE CUT', 0, NULL, 3000, NULL, NULL, NULL, NULL, NULL, NULL, 50000, 4, 'Machine: JPT 5W; Q-pulse: 3; Hatch: bi-dir', 'scraped_public', true, 'cut', NULL),
-- TESA 6930 LASERABLE TAPE ENGRAVING
('TESA 6930 LASERABLE TAPE ENGRAVING', 0, NULL, 72000, NULL, NULL, NULL, NULL, NULL, 0.05, 150000, 4, 'Machine: JPT 5W; Q-pulse: 1; Hatch: Unidirectional', 'scraped_public', true, 'engrave', NULL),
-- JDS PLASTIC CUP
('JDS PLASTIC CUP', 0, NULL, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: 5w; Q-pulse: 20; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- WHITE ON BLACK ALU BUSINESS CARD 5W
('WHITE ON BLACK ALU BUSINESS CARD 5W', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.01, 1000, 4, 'Machine: JPT 5W; Q-pulse: 20; Hatch: bi-dir', 'scraped_public', true, 'engrave', 2),
-- YELLOW TPU EAR TAGS
('YELLOW TPU EAR TAGS', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.04, 1000, 4, 'Machine: JPT 5W; Q-pulse: 20; Hatch: Unidirectional', 'scraped_public', true, 'engrave', NULL),
-- DEEP STONE ENGRAVING
('DEEP STONE ENGRAVING', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.03, 1000, 4, 'Machine: JPT 5W; Q-pulse: 50; Hatch: bi-dir; cross hatch', 'scraped_public', true, 'engrave', 5),
-- OLIVE WOOD 5W
('OLIVE WOOD 5W', 0, NULL, 18000, NULL, NULL, NULL, NULL, NULL, 0.02, 1000, 4, 'Machine: JPT 5W; Q-pulse: 50; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- THIN LEATHER SKIN COLOR
('THIN LEATHER SKIN COLOR', 0, NULL, 24000, NULL, NULL, NULL, NULL, NULL, 0.05, 20000, 4, 'Machine: JPT 5W; Q-pulse: 2; Hatch: bi-dir; #1 enable cross hatch', 'scraped_public', true, 'mark', NULL),
-- WHITE ON ANODIZED ALUMINIUM
('WHITE ON ANODIZED ALUMINIUM', 0, NULL, 30000, NULL, NULL, NULL, NULL, NULL, 0.01, 1000, 4, 'Machine: JPT 5W; Q-pulse: 20; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- ABS ENCLOSURE
('ABS ENCLOSURE', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.03, 2000, 4, 'Machine: JPT 5W; Q-pulse: 20; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- BIRCH PLYWOOD
('BIRCH PLYWOOD', 0, NULL, 15000, NULL, NULL, NULL, NULL, NULL, 0.04, 40000, 4, 'Machine: JPT 5W; Q-pulse: 1; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- DIBOND (ALUMINIUM SANDWICH PANEL)
('DIBOND (ALUMINIUM SANDWICH PANEL)', 0, NULL, 45000, NULL, NULL, NULL, NULL, NULL, 0.02, 1000, 4, 'Machine: JPT 5W; Q-pulse: 40; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- GEL BALLPOINT PEN
('GEL BALLPOINT PEN', 0, NULL, 45000, NULL, NULL, NULL, NULL, NULL, 0.02, 1000, 4, 'Machine: JPT 5W; Q-pulse: 40; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- CORK 5W
('CORK 5W', 0, NULL, 12000, NULL, NULL, NULL, NULL, NULL, 0.05, 70000, 4, 'Machine: JPT 5W; Q-pulse: 1; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- RUBBER WOOD
('RUBBER WOOD', 0, NULL, 4800, NULL, NULL, NULL, NULL, NULL, 0.05, 10000, 4, 'Machine: JPT 5W; Q-pulse: 60; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- CUTTING GLASS
('CUTTING GLASS', 0, NULL, 48000, NULL, NULL, NULL, NULL, NULL, 0.01, 30000, 4, 'Machine: JPT 5W; Q-pulse: 1; Hatch: bi-dir; Wobble .5 &amp; dist. 0.03', 'scraped_public', true, 'cut', NULL),
-- PP - POLYPROPYLEEN
('PP - POLYPROPYLEEN', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.02, 4000, 4, 'Machine: JPT 5W; Q-pulse: 20; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- BLACK ON WHITE TUMBLERS
('BLACK ON WHITE TUMBLERS', 0, NULL, 48000, NULL, NULL, NULL, NULL, NULL, 0.04, 1000, 4, 'Machine: JPT 5W; Q-pulse: 50; Hatch: Unidirectional', 'scraped_public', true, 'engrave', NULL),
-- WHITE ON PMAG
('WHITE ON PMAG', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.05, 25000, 4, 'Machine: JPT 5W; Q-pulse: 10; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- WHITE OAK WOOD 5W
('WHITE OAK WOOD 5W', 0, NULL, 12000, NULL, NULL, NULL, NULL, NULL, 0.02, 1000, 4, 'Machine: JPT 5W; Q-pulse: 50; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- BLACK ON STAINLESS STEEL 10W
('BLACK ON STAINLESS STEEL 10W', 0, NULL, 6000, NULL, NULL, NULL, NULL, NULL, 0.05, 50000, 4, 'Machine: JPT 10W; Q-pulse: 1; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- SLATE COASTERS 10W
('SLATE COASTERS 10W', 0, NULL, 30000, NULL, NULL, NULL, NULL, NULL, 0.025, 63000, 4, 'Machine: JPT 10W; Q-pulse: 4; Hatch: bi-dir; Angle: 45', 'scraped_public', true, 'engrave', NULL),
-- SLATE COASTERS
('SLATE COASTERS', 0, NULL, 9000, NULL, NULL, NULL, NULL, NULL, 0.01, 120000, 4, 'Machine: 5W JPT; Q-pulse: 2; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- CLEAR GOLF BALL
('CLEAR GOLF BALL', 0, NULL, 24000, NULL, NULL, NULL, NULL, NULL, 0.04, 20000, 4, 'Machine: 5W uv; Q-pulse: 10; Hatch: bi-dir; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- BLACK ON BRASS
('BLACK ON BRASS', 0, NULL, 3000, NULL, NULL, NULL, NULL, NULL, 0.02, 30000, 4, 'Machine: JPT 5W; Q-pulse: 3; Hatch: bi-dir', 'scraped_public', true, 'engrave', NULL),
-- CORK 10W
('CORK 10W', 0, NULL, 6000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: JPT 10W; Q-pulse: 1; Hatch: bi-dir; Angle: 90', 'scraped_public', true, 'engrave', NULL),
-- GLASS MARKING (FEELTEK 3D)
('GLASS MARKING (FEELTEK 3D)', 0, NULL, 24000, NULL, NULL, NULL, NULL, NULL, 0.03, 50000, 4, 'Machine: JPT 5W; Q-pulse: 1; Hatch: Unidirectional; Angle: 0', 'scraped_public', true, 'mark', 1),
-- GLASS WITH A ROTARY
('GLASS WITH A ROTARY', 0, NULL, 12000, NULL, NULL, NULL, NULL, NULL, 0.025, 50000, 4, 'Machine: 5w; Q-pulse: 1; Hatch: bi-dir; Angle: 0; rotary split size .025', 'scraped_public', true, 'engrave', 1),
-- PACIFIERS MARKING - POLYPROPYLENE
('PACIFIERS MARKING - POLYPROPYLENE', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.02, 70000, 4, 'Machine: 5W JPT; Q-pulse: 10; Hatch: bi-dir; Angle: 0', 'scraped_public', true, 'mark', NULL),
-- CRYSTAL ENGRAVING
('CRYSTAL ENGRAVING', 0, NULL, 12000, NULL, NULL, NULL, NULL, NULL, 0.2, 50000, 4, 'Machine: 5W JPT; Q-pulse: 18; Hatch: Unidirectional; Angle: 90', 'scraped_public', true, 'engrave', NULL),
-- GLASS ENGRAVING
('GLASS ENGRAVING', 0, NULL, 18000, NULL, NULL, NULL, NULL, NULL, 0.05, 60000, 4, 'Machine: 10W JPT; Q-pulse: 1; Hatch: bi-dir; Angle: 0; enable cross hatch', 'scraped_public', true, 'engrave', NULL),
-- WINEGLASS
('WINEGLASS', 0, NULL, 12000, NULL, NULL, NULL, NULL, NULL, NULL, 20000, 4, 'Machine: 5W JPT; Q-pulse: 20; Hatch: Unidirectional; Angle: 270; all calc, cross hatch', 'scraped_public', true, 'engrave', NULL),
-- PICTURE ON BUSINESS-CARD
('PICTURE ON BUSINESS-CARD', 0, NULL, 120000, NULL, NULL, NULL, NULL, NULL, NULL, 20000, 4, 'Machine: 5W JPT; Q-pulse: 10; Hatch: Unidirectional; Invert, dither, bidir scan, drill mode: 0.2', 'scraped_public', true, 'engrave', NULL),
-- WOOD
('WOOD', 0, NULL, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: 5W JPT; Q-pulse: 10; Hatch: Unidirectional; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- CRYSTAL K9
('CRYSTAL K9', 0, NULL, 18000, NULL, NULL, NULL, NULL, NULL, NULL, 20000, 4, 'Machine: 5W JPT; Q-pulse: 10; Hatch: Unidirectional; Lens: 210mm; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- WHITE MARKING ON BLACK PLASTIC ABS POLYCARBONATE
('WHITE MARKING ON BLACK PLASTIC ABS POLYCARBONATE', 0, NULL, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, 60000, 4, 'Machine: 5W JPT; Q-pulse: 5; Hatch: Unidirectional', 'scraped_public', true, 'mark', NULL),
-- ACRYLIC ENGRAVING
('ACRYLIC ENGRAVING', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.02, 40000, 4, 'Machine: 3W JPT; Q-pulse: 1; Hatch: bi-dir; Angle: 0; A 1', 'scraped_public', true, 'engrave', NULL),
-- GLASSES CLOTH
('GLASSES CLOTH', 0, NULL, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, NULL, 4, 'Machine: 5W JPT UV; Q-pulse: 10; Hatch: bi-dir', 'scraped_public', true, 'engrave', 1),
-- ENGRAVE CARDBOARD
('ENGRAVE CARDBOARD', 0, NULL, 60000, NULL, NULL, NULL, NULL, NULL, 0.05, 25000, 4, 'Machine: UV 5W; Q-pulse: 10; Hatch: bi-dir; Angle: 90', 'scraped_public', true, 'engrave', 1),

-- =============================================================================
-- Source: co2galvo.lasertips.org - CO2 galvo laser parameters (11 entries)
-- Laser types: 40W RF CO2 galvo
-- =============================================================================
-- Car Coasters cork
('Car Coasters cork', 0, 7, 48000, NULL, NULL, NULL, NULL, NULL, 0.05, 20000, 4, 'Machine: 40W RF; Hatch: unidirectional; Flood fill enabled', 'scraped_public', true, 'engrave', 1),
-- Rainbow tumbler
('Rainbow tumbler', 0, 35, 33000, NULL, NULL, NULL, NULL, NULL, 0.02, 5000, 4, 'Machine: 40W RF; Hatch: bi-hatch; Lens: 210mm', 'scraped_public', true, 'engrave', 1),
-- Rainbow tumbler black
('Rainbow tumbler black', 0, 65, 33000, NULL, NULL, NULL, NULL, NULL, 0.03, 5000, 4, 'Machine: 40W RF; Hatch: bi-dir; Lens: 210mm', 'scraped_public', true, 'engrave', 1),
-- Rowmark Blue color
('Rowmark Blue color', 0, 20, 60000, NULL, NULL, NULL, NULL, NULL, 0.05, 15000, 4, 'Machine: 40W RF; Hatch: bi-dir; Lens: 210mm', 'scraped_public', true, 'mark', 1),
-- Polar Camel
('Polar Camel', 0, 80, 27000, NULL, NULL, NULL, NULL, NULL, 0.07, 25000, 4, 'Machine: 40W RF; Hatch: bi-dir; Lens: 310mm', 'scraped_public', true, 'engrave', NULL),
-- Notebook paper
('Notebook paper', 0, 100, 18000, NULL, NULL, NULL, NULL, NULL, 0.05, 25000, 4, 'Machine: 60W RF; Hatch: bi-dir; Lens: 300mm', 'scraped_public', true, 'engrave', 1),
-- JDS Leatherette
('JDS Leatherette', 0, 15, 30000, NULL, NULL, NULL, NULL, NULL, 0.1, 25000, 4, 'Machine: 60W RF; Hatch: bi-dir; Lens: 300mm', 'scraped_public', true, 'engrave', 1),
-- Cork coasters
('Cork coasters', 0, 20, 60000, NULL, NULL, NULL, NULL, NULL, 0.1, 25000, 4, 'Machine: 60W RF; Hatch: bi-dir; Lens: 300mm', 'scraped_public', true, 'engrave', 1),
-- Bi-color JDS leatherettes
('Bi-color JDS leatherettes', 0, 10, 30000, NULL, NULL, NULL, NULL, NULL, 0.1, 25000, 4, 'Machine: 60W RF; Hatch: bi-dir; Lens: 300mm', 'scraped_public', true, 'mark', 1),
-- Clear acrylic
('Clear acrylic', 0, 60, 30000, NULL, NULL, NULL, NULL, NULL, 0.05, 25000, 4, 'Machine: 40W RF; Hatch: bi-dir; Lens: 100mm', 'scraped_public', true, 'engrave', NULL),
-- Bambus cutting board
('Bambus cutting board', 0, 40, 36000, NULL, NULL, NULL, NULL, NULL, 0.05, 24000, 4, 'Machine: 40W RF; Hatch: bi-dir; Lens: 210mm', 'scraped_public', true, 'cut', 2) ON CONFLICT DO NOTHING;
