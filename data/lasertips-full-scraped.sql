-- Scraped Fiber Laser Parameters from lasertips.org
-- Source: lasertips.org (fiber laser marking/engraving/cutting parameters)
-- Generated: 2026-06-23
-- Total entries: 134
-- (Excludes 16 entries already in lasertips-scraped.sql)
--
-- Conversion notes:
--   - Speed: mm/s * 60 = mm/min
--   - Frequency: kHz * 1000 = Hz
--   - thickness_mm: 0 for engraving/marking, extracted from name for cutting
--   - source: 'scraped_public'
--   - is_shared: true
--   - quality_rating: 4 (community-contributed reference data)

INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, frequency_hz, quality_rating, notes, source, is_shared, operation_type, num_passes) VALUES

-- ID 70: 1911 pistol slide hard metal
('1911 pistol slide hard metal', 0, 85, 18000, NULL, NULL, NULL, NULL, NULL, 0.03, 50000, 4, 'Machine: raycus 50w; Hatch #1; Hatch type: cross-hatch; Lens: 150mm; hatch 1: xhatch, auto rotate 30deg', 'scraped_public', true, 'engrave', 20),
-- ID 71: 1911 pistol slide hard metal
('1911 pistol slide hard metal', 0, 35, 90000, NULL, NULL, NULL, NULL, NULL, 0.04, 50000, 4, 'Machine: raycus 50w; Hatch #2; Hatch type: unidirectional; hatch 1: xhatch, auto rotate 30deg', 'scraped_public', true, 'engrave', 3),
-- ID 127: 50w jpt - white on black acrylic
('50w jpt - white on black acrylic', 0, 12, 60000, NULL, NULL, NULL, NULL, NULL, 0.05, 40000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: bi-hatch; Lens: 210; Angle: 0 ch; good for all around. if higher detail is needed use p:8% s:900', 'scraped_public', true, 'engrave', 1),
-- ID 128: 50w jpt - white on chalkboard
('50w jpt - white on chalkboard', 0, 5, 72000, NULL, NULL, NULL, NULL, NULL, 0.097, 200000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: unidirectional; Lens: 300; Angle: 0 ch; .095 to .097 are pretty close but it’s worth testing for a solid bright white. tested on chalkboard wall art pieces from hobby lobby.', 'scraped_public', true, 'engrave', 1),
-- ID 122: 50w jpt engrave powder coated tumbler
('50w jpt engrave powder coated tumbler', 0, 55, 30000, NULL, NULL, NULL, NULL, NULL, 0.04, 50000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: bi-dir; second hatch is cleanpass', 'scraped_public', true, 'engrave', NULL),
-- ID 123: 50w jpt engrave powder coated tumbler
('50w jpt engrave powder coated tumbler', 0, 35, 120000, NULL, NULL, NULL, NULL, NULL, 0.04, 30000, 4, 'Machine: 50w jpt; Hatch #2; Hatch type: bi-dir; second hatch is cleanpass', 'scraped_public', true, 'engrave', NULL),
-- ID 124: 50w jpt stainless steel black engrave
('50w jpt stainless steel black engrave', 0, 40, 12000, NULL, NULL, NULL, NULL, NULL, 0.005, 60000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: unidirectional; unfocus up 3mm', 'scraped_public', true, 'engrave', NULL),
-- ID 56: abs plastic
('abs plastic', 0, 30, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 30000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 210mm; Angle: 0', 'scraped_public', true, 'engrave', 1),
-- ID 111: abs plastic engraving
('abs plastic engraving', 0, 30, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 30000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: cross-hatch; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 15: aluminum businesscard painted
('aluminum businesscard painted', 0, 30, 36000, NULL, NULL, NULL, NULL, NULL, 0.03, 25000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Angle: 45', 'scraped_public', true, 'engrave', 1),
-- ID 11: aluminum deep engrave
('aluminum deep engrave', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Angle: 90', 'scraped_public', true, 'engrave', 25),
-- ID 12: aluminum deep engrave
('aluminum deep engrave', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: raycus 30w; Hatch #2; Hatch type: bi-dir; Angle: 180', 'scraped_public', true, 'engrave', 25),
-- ID 13: aluminum deep engrave
('aluminum deep engrave', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.02, 75000, 4, 'Machine: raycus 30w; Hatch #3; Hatch type: unidirectional; Angle: 315', 'scraped_public', true, 'engrave', 25),
-- ID 19: aluminum deep engraving
('aluminum deep engraving', 0, 100, 60000, NULL, NULL, NULL, NULL, NULL, 0.04, 30000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: bi-dir; Lens: 300mm; Angle: 0; all calc, follow edge once, images - interupted hatch, text- continues hatch', 'scraped_public', true, 'engrave', NULL),
-- ID 79: aluminum marking - black - focus
('aluminum marking - black - focus', 0, 95, 18000, NULL, NULL, NULL, NULL, NULL, 0.045, 20000, 4, 'Machine: 30w max; Hatch #1; Hatch type: cross-hatch', 'scraped_public', true, 'mark', NULL),
-- ID 78: aluminum marking - white - focus
('aluminum marking - white - focus', 0, 90, 120000, NULL, NULL, NULL, NULL, NULL, 0.045, 70000, 4, 'Machine: 30w max; Hatch #1; Hatch type: cross-hatch', 'scraped_public', true, 'mark', 1),
-- ID 143: aluminum oxide black marking - 80w jpt
('aluminum oxide black marking - 80w jpt', 0, 75, 18000, NULL, NULL, NULL, NULL, NULL, NULL, 430000, 4, 'Machine: 80w jpt; Hatch #1; Hatch type: unidirectional; Lens: 150; Pulse: 4.00ns', 'scraped_public', true, 'mark', NULL),
-- ID 1: aluminum white/frost - 50w
('aluminum white/frost - 50w', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, 45000, 4, 'Machine: raycus 50w; Hatch #1; Hatch type: unidirectional; Angle: 90', 'scraped_public', true, 'engrave', 2),
-- ID 42: anneal stainless steel
('anneal stainless steel', 0, 85, 12000, NULL, NULL, NULL, NULL, NULL, 0.04, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150mm; Angle: 0; unfocus 4-5 below', 'scraped_public', true, 'mark', NULL),
-- ID 74: anneal stainless steel fillet knife - 2mm unfocus up
('anneal stainless steel fillet knife - 2mm unfocus up', 0, 30, 6000, NULL, NULL, NULL, NULL, NULL, 0.003, 60000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: unidirectional; Lens: 150mm; Angle: 0; unfocus 2mm up', 'scraped_public', true, 'fill', 1),
-- ID 61: annealing - black on stainless steel (knife)
('annealing - black on stainless steel (knife)', 0, 30, 6000, NULL, NULL, NULL, NULL, NULL, 0.003, 60000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150mm; Angle: 0; on focus', 'scraped_public', true, 'mark', NULL),
-- ID 37: anodized business card any colors
('anodized business card any colors', 0, 30, 36000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150; Angle: 90; will mark card', 'scraped_public', true, 'mark', NULL),
-- ID 38: anodized business card any colors smooth touch..
('anodized business card any colors smooth touch..', 0, 50, 48000, NULL, NULL, NULL, NULL, NULL, 0.03, 75000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150; Angle: 90; smooth engraving..', 'scraped_public', true, 'mark', NULL),
-- ID 144: bitmap on leather
('bitmap on leather', 0, 40, 6000, NULL, NULL, NULL, NULL, NULL, 0.05, 20000, 4, 'Machine: raycus 20w; Hatch #1; Hatch type: unidirectional; Lens: 110x110; Angle: 90; backround is a degraded color', 'scraped_public', true, 'engrave', 1),
-- ID 97: black anodized business card 50w raycus
('black anodized business card 50w raycus', 0, 20, 48000, NULL, NULL, NULL, NULL, NULL, 0.03, 75000, 4, 'Machine: 50w raycus; Hatch #1; Hatch type: unidirectional; Lens: f 210 150mm x 150mm0; Angle: 0', 'scraped_public', true, 'engrave', 1),
-- ID 29: black color marking on abs
('black color marking on abs', 0, 30, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 30000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Angle: 0; on focus', 'scraped_public', true, 'mark', NULL),
-- ID 27: black color marking on steel
('black color marking on steel', 0, 90, 6000, NULL, NULL, NULL, NULL, NULL, NULL, 25000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Angle: 0; unfocus 2-5mm.', 'scraped_public', true, 'mark', NULL),
-- ID 40: black engraving on stainless steel tags
('black engraving on stainless steel tags', 0, 50, 18000, NULL, NULL, NULL, NULL, NULL, 0.01, 30000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Lens: 150 mm; Angle: 552', 'scraped_public', true, 'engrave', NULL),
-- ID 95: black marking on 316 stainless steel 50w raycus
('black marking on 316 stainless steel 50w raycus', 0, 25, 3000, NULL, NULL, NULL, NULL, NULL, 0.025, 25000, 4, 'Machine: 50w raycus; Hatch #1; Hatch type: bi-dir; Lens: f 210 150mm x 150mm; Angle: 45', 'scraped_public', true, 'mark', 1),
-- ID 96: black marking on 316 stainless steel 50w raycus
('black marking on 316 stainless steel 50w raycus', 0, 25, 3000, NULL, NULL, NULL, NULL, NULL, 0.025, 25000, 4, 'Machine: 50w raycus; Hatch #2; Hatch type: unidirectional; Lens: f 210 150mm x 150mm; Angle: -45', 'scraped_public', true, 'mark', 1),
-- ID 63: black on alu
('black on alu', 0, 90, 18000, NULL, NULL, NULL, NULL, NULL, 0.05, 40000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: bi-dir; Lens: 150mm; Angle: 90; wobble .5mm', 'scraped_public', true, 'engrave', 1),
-- ID 30: black on aluminum
('black on aluminum', 0, 100, 6000, NULL, NULL, NULL, NULL, NULL, 0.02, 30000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 139: black on aluminum - 80w mopa
('black on aluminum - 80w mopa', 0, 40, 60000, NULL, NULL, NULL, NULL, NULL, 0.002, 625000, 4, 'Machine: 80w mopa; Hatch #1; Hatch type: unidirectional; Lens: 300; Angle: 0; Pulse: 10.00ns; focused', 'scraped_public', true, 'engrave', 1),
-- ID 115: black on aluminum mopa
('black on aluminum mopa', 0, 45, 72000, NULL, NULL, NULL, NULL, NULL, 0.003, 250000, 4, 'Machine: 30w jpt mopa; Hatch #1; Hatch type: unidirectional; Lens: 100; Angle: 0; Pulse: 10.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 116: black on aluminum mopa 2
('black on aluminum mopa 2', 0, 30, 60000, NULL, NULL, NULL, NULL, NULL, 0.001, 540000, 4, 'Machine: 30w jpt mopa; Hatch #1; Hatch type: unidirectional; Lens: 100; Pulse: 6.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 148: black on aluminum oxide
('black on aluminum oxide', 0, 75, 18000, NULL, NULL, NULL, NULL, NULL, 0.01, 430000, 4, 'Machine: jpt 80w; Hatch #1; Hatch type: unidirectional; Lens: 150; Pulse: 4.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 121: black on brass
('black on brass', 0, 90, 9000, NULL, NULL, NULL, NULL, NULL, 0.02, 20000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: unidirectional; Angle: 90', 'scraped_public', true, 'engrave', NULL),
-- ID 141: black on brass jpt 50w
('black on brass jpt 50w', 0, 60, 18000, NULL, NULL, NULL, NULL, NULL, 0.004, 60000, 4, 'Machine: jpt 50w; Hatch #1; Hatch type: unidirectional; Lens: 110; Angle: 90; Pulse: 200.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 101: black on cardboard
('black on cardboard', 0, 23, 72000, NULL, NULL, NULL, NULL, NULL, 0.04, 300000, 4, 'Machine: jpt 50w; Hatch #1; Hatch type: bi-dir; Lens: 200x200; Angle: 90', 'scraped_public', true, 'engrave', 1),
-- ID 31: black on copper
('black on copper', 0, 100, 12000, NULL, NULL, NULL, NULL, NULL, 0.001, 45000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 70mm; Angle: 0; may work with 400 speed', 'scraped_public', true, 'engrave', 1),
-- ID 64: black on plastic - raycus 20w
('black on plastic - raycus 20w', 0, 45, 60000, NULL, NULL, NULL, NULL, NULL, 0.04, 25000, 4, 'Machine: raycus 20w; Hatch #1; Hatch type: unidirectional; Lens: 110mm; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 32: black on silver
('black on silver', 0, 60, 6000, NULL, NULL, NULL, NULL, NULL, 0.002, 30000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 70mm; Angle: 0', 'scraped_public', true, 'engrave', 1),
-- ID 67: black on stainless steel - mopa
('black on stainless steel - mopa', 0, 45, 60000, NULL, NULL, NULL, NULL, NULL, 0.001, 45000, 4, 'Machine: jpt mopa; Hatch #1; Hatch type: bi-dir; Pulse: 100.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 62: black on stainless steel (coasters)
('black on stainless steel (coasters)', 0, 80, 15000, NULL, NULL, NULL, NULL, NULL, 0.02, 30000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 110mm; Angle: 0; minus 4mm out of focus', 'scraped_public', true, 'engrave', NULL),
-- ID 72: black on stainless steel (raycus 30w)
('black on stainless steel (raycus 30w)', 0, 30, 12000, NULL, NULL, NULL, NULL, NULL, 0.01, 60000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Lens: 290; Angle: 0', 'scraped_public', true, 'engrave', 1),
-- ID 105: black on white plastic apple airpods may work on different apple products
('black on white plastic apple airpods may work on different apple products', 0, 15, 120000, NULL, NULL, NULL, NULL, NULL, 0.05, 50000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: bi-dir; Lens: 150; Angle: 90; 3 passes', 'scraped_public', true, 'engrave', NULL),
-- ID 138: black/ grey on white hdpe
('black/ grey on white hdpe', 0, 50, 30000, NULL, NULL, NULL, NULL, NULL, 0.05, 50000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: bi-dir; Lens: 110; Angle: 0', 'scraped_public', true, 'engrave', 2),
-- ID 49: blue on stainless steel
('blue on stainless steel', 0, 90, 78000, NULL, NULL, NULL, NULL, NULL, 0.002, 140000, 4, 'Machine: jpt mopa 30w m6-m7; Hatch #1; Hatch type: bi-dir; Lens: 175mm; Angle: 0; Pulse: 4.00ns', 'scraped_public', true, 'engrave', 1),
-- ID 66: blue on stainless steel - mopa
('blue on stainless steel - mopa', 0, 45, 60000, NULL, NULL, NULL, NULL, NULL, 0.002, 300000, 4, 'Machine: jpt mopa; Hatch #1; Hatch type: unidirectional; Angle: 0; Pulse: 6.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 98: blue stainless steel non mopa
('blue stainless steel non mopa', 0, 10, 48000, NULL, NULL, NULL, NULL, NULL, 0.002, 120000, 4, 'Machine: jpt lp 50w; Hatch #1; Hatch type: cross-hatch; Lens: 110mm; Angle: 0; Pulse: 200.00ns; in focus 167mm', 'scraped_public', true, 'engrave', 1),
-- ID 150: brass coin
('brass coin', 0, 90, 12000, NULL, NULL, NULL, NULL, NULL, 0.008, 50000, 4, 'Machine: m8 50w; Hatch #1; Hatch type: unidirectional; Lens: 110; Angle: 0; Pulse: 200.00ns', 'scraped_public', true, 'engrave', 1),
-- ID 46: brass coins
('brass coins', 0, 50, 12000, NULL, NULL, NULL, NULL, NULL, 0.01, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150mm; Angle: 0; all calc', 'scraped_public', true, 'engrave', NULL),
-- ID 75: brown leather
('brown leather', 0, 20, 60000, NULL, NULL, NULL, NULL, NULL, 0.05, 45000, 4, 'Machine: 20w raycus; Hatch #1; Hatch type: cross-hatch; Lens: 110', 'scraped_public', true, 'engrave', 1),
-- ID 142: cut silver 1.5mm
('cut silver 1.5mm', 1.5, 95, 18000, NULL, NULL, NULL, NULL, NULL, NULL, 70000, 4, 'Machine: jpt 100w; Hatch #1; Hatch type: bi-dir; Lens: 110; Angle: 0; Pulse: 200.00ns; wobble .22 dist.03 step', 'scraped_public', true, 'cut', 10),
-- ID 41: cutting brass
('cutting brass', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.05, 50000, 4, 'Machine: tykma 50 watt; Hatch #1; Hatch type: bi-dir; Lens: 100mm s; Angle: 45; use wobble 1mm and 0.05', 'scraped_public', true, 'cut', 99),
-- ID 132: cutting silver 1mm
('cutting silver 1mm', 1, 95, 6000, NULL, NULL, NULL, NULL, NULL, NULL, 20000, 4, 'Machine: jpt 200w; Hatch #1; Hatch type: 6; Lens: 110; Pulse: 200.00ns', 'scraped_public', true, 'cut', 5),
-- ID 43: dark engraving stainless steel knife
('dark engraving stainless steel knife', 0, 600, 42000, NULL, NULL, NULL, NULL, NULL, 0.001, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 200x200; Angle: 30', 'scraped_public', true, 'engrave', NULL),
-- ID 59: dark markings stainless steel 50w
('dark markings stainless steel 50w', 0, 85, 15000, NULL, NULL, NULL, NULL, NULL, 0.01, 30000, 4, 'Machine: jpt 50w; Hatch #1; Hatch type: cross-hatch; Lens: 110; Angle: 0; dark markings/engraving on stainless steel', 'scraped_public', true, 'mark', NULL),
-- ID 7: deep engrave on brass
('deep engrave on brass', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Angle: 90', 'scraped_public', true, 'engrave', 25),
-- ID 8: deep engrave on brass
('deep engrave on brass', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: raycus 30w; Hatch #2; Hatch type: bi-dir; Angle: 180', 'scraped_public', true, 'engrave', 25),
-- ID 9: deep engrave on brass
('deep engrave on brass', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.02, 75000, 4, 'Machine: raycus 30w; Hatch #3; Hatch type: unidirectional; Angle: 315', 'scraped_public', true, 'engrave', 5),
-- ID 82: deep engrave on silver
('deep engrave on silver', 0, 90, 6000, NULL, NULL, NULL, NULL, NULL, 0.01, 20000, 4, 'Machine: 50w raycus; Hatch #1; Hatch type: bi-dir; autorotate 15 degrees', 'scraped_public', true, 'engrave', 15),
-- ID 76: deep engraving silver
('deep engraving silver', 0, 100, 18000, NULL, NULL, NULL, NULL, NULL, 0.01, 20000, 4, 'Machine: raycus 20w; Hatch #1; Hatch type: bi-dir; Lens: 110; autorotate 15 degrees', 'scraped_public', true, 'engrave', 12),
-- ID 26: deep engraving ss/cs/aluminum
('deep engraving ss/cs/aluminum', 0, 95, 60000, NULL, NULL, NULL, NULL, NULL, 0.03, 30000, 4, 'Machine: 30watt max q-switched; Hatch #1; Hatch type: unidirectional; Angle: 5', 'scraped_public', true, 'engrave', 18),
-- ID 47: dogtags steinless steel
('dogtags steinless steel', 0, 70, 18000, NULL, NULL, NULL, NULL, NULL, 0.04, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 100x100; Angle: 90; all calc', 'scraped_public', true, 'engrave', NULL),
-- ID 93: em-smart - engraving slate
('em-smart - engraving slate', 0, 80, 72000, NULL, NULL, NULL, NULL, NULL, NULL, 20000, 4, 'Machine: em-smart 20w; Hatch #1; Hatch type: unidirectional; Angle: 0', 'scraped_public', true, 'engrave', 5),
-- ID 92: em-smart - stainless steel engraving
('em-smart - stainless steel engraving', 0, 50, 18000, NULL, NULL, NULL, NULL, NULL, 0.05, 20000, 4, 'Machine: em-smart 20w; Hatch #1; Hatch type: unidirectional; Angle: 90', 'scraped_public', true, 'engrave', NULL),
-- ID 25: engrave on brown leather
('engrave on brown leather', 0, 40, 168000, NULL, NULL, NULL, NULL, NULL, 0.03, 40000, 4, 'Machine: raycus 20w; Hatch #1; Hatch type: unidirectional; Angle: 0; marc contour, all calc', 'scraped_public', true, 'engrave', 1),
-- ID 20: engrave on colored glass
('engrave on colored glass', 0, 50, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: unidirectional; Lens: 300x300; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 39: engrave on leather
('engrave on leather', 0, 30, 18000, NULL, NULL, NULL, NULL, NULL, 0.05, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150; Angle: 90; it smells. have good ventilation', 'scraped_public', true, 'engrave', NULL),
-- ID 14: engrave on mirror
('engrave on mirror', 0, 50, 42000, NULL, NULL, NULL, NULL, NULL, 0.03, 25000, 4, 'Machine: max 30w; Hatch #1; Hatch type: unidirectional; Angle: 90; laser will remove the backing of mirror.', 'scraped_public', true, 'engrave', 1),
-- ID 24: engrave on stone
('engrave on stone', 0, 50, 30000, NULL, NULL, NULL, NULL, NULL, 0.02, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Angle: 90', 'scraped_public', true, 'engrave', 5),
-- ID 109: engrave silver
('engrave silver', 0, 50, 90000, NULL, NULL, NULL, NULL, NULL, 0.4, 37000, 4, 'Machine: 1500; Hatch #1; Hatch type: unidirectional; Lens: 100; Angle: 0; Pulse: 200.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 149: engrave stone
('engrave stone', 0, 75, 90000, NULL, NULL, NULL, NULL, NULL, 0.03, 25000, 4, 'Machine: m8 50w; Hatch #1; Hatch type: unidirectional; Lens: 110; Angle: 0; Pulse: 200.00ns', 'scraped_public', true, 'engrave', 25),
-- ID 106: fiber carbon engraving
('fiber carbon engraving', 0, 90, 48000, NULL, NULL, NULL, NULL, NULL, 0.05, 45000, 4, 'Machine: jpt 30w; Hatch #1; Hatch type: cross-hatch; Lens: 110; Angle: 90; Pulse: 200.00ns', 'scraped_public', true, 'engrave', 3),
-- ID 91: glock stippling
('glock stippling', 0, 35, 240000, NULL, NULL, NULL, NULL, NULL, 0.05, 35000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: cross-hatch; Lens: 150x150; all calc, follow edge', 'scraped_public', true, 'engrave', NULL),
-- ID 23: gold engraving 18k
('gold engraving 18k', 0, 40, 42000, NULL, NULL, NULL, NULL, NULL, 0.01, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Angle: 0; all calc', 'scraped_public', true, 'engrave', 2),
-- ID 137: gold on stainless steel - mopa
('gold on stainless steel - mopa', 0, 57, 21000, NULL, NULL, NULL, NULL, NULL, 0.06, 25000, 4, 'Machine: 80w jpt mopa; Hatch #1; Hatch type: bi-dir; Lens: 110; Angle: 90; Pulse: 75.00ns; in focus', 'scraped_public', true, 'engrave', 1),
-- ID 140: gray marking on silver (830/925)
('gray marking on silver (830/925)', 0, 90, 90000, NULL, NULL, NULL, NULL, NULL, 0.01, 37000, 4, 'Machine: 80w mopa; Hatch #1; Hatch type: unidirectional; Lens: 300x300; Angle: 0; Pulse: 200.00ns; unfocused 3mm up', 'scraped_public', true, 'mark', 1),
-- ID 52: green on stainless steel
('green on stainless steel', 0, 30, 90000, NULL, NULL, NULL, NULL, NULL, 0.001, 350000, 4, 'Machine: jpt mopa 30w m6-m7; Hatch #1; Hatch type: bi-dir; Lens: 175mm; Angle: 0; Pulse: 13.00ns', 'scraped_public', true, 'engrave', 1),
-- ID 68: green on stainless steel - mopa
('green on stainless steel - mopa', 0, 25, 60000, NULL, NULL, NULL, NULL, NULL, 0.001, 350000, 4, 'Machine: jpt mopa; Hatch #1; Hatch type: unidirectional; Pulse: 15.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 34: iron dog tags
('iron dog tags', 0, 70, 30000, NULL, NULL, NULL, NULL, NULL, 0.02, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150; Angle: 45', 'scraped_public', true, 'engrave', 6),
-- ID 145: jpt 200w silver cutting 1.2mm
('jpt 200w silver cutting 1.2mm', 1.2, 90, 18000, NULL, NULL, NULL, NULL, NULL, NULL, 130000, 4, 'Machine: jpt 200w; Hatch #1; Hatch type: 6; Lens: 70mm; Angle: 90; Pulse: 500.00ns', 'scraped_public', true, 'cut', 7),
-- ID 102: laser stippling glock frames
('laser stippling glock frames', 0, 35, 84000, NULL, NULL, NULL, NULL, NULL, 0.1, 60000, 4, 'Machine: 30w jpt; Hatch #1; Hatch type: unidirectional; Lens: 150; Angle: 90; do many passes', 'scraped_public', true, 'engrave', NULL),
-- ID 83: laton (vainas de balas)
('laton (vainas de balas)', 0, 85, 6000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: jpt 50w; Hatch #1; Hatch type: cross-hatch; Lens: f-290; Angle: 0; cross hatch y contorno', 'scraped_public', true, 'engrave', NULL),
-- ID 147: mirror
('mirror', 0, 40, 60000, NULL, NULL, NULL, NULL, NULL, 0.042, 75000, 4, 'Machine: mopa 60; Hatch #1; Hatch type: bi-dir; Lens: 175; Angle: 0; Pulse: 200.00ns; lightburn was what i used', 'scraped_public', true, 'engrave', NULL),
-- ID 129: mopa 60w stainless steel black anneal.
('mopa 60w stainless steel black anneal.', 0, 20, 15000, NULL, NULL, NULL, NULL, NULL, 0.003, 60000, 4, 'Machine: jpt m7 60w mopa; Hatch #1; Hatch type: unidirectional; Lens: 170; Angle: 0; Pulse: 200.00ns; defocus up by 3 to 4 mm', 'scraped_public', true, 'mark', 1),
-- ID 35: mopa-aluminium-dark engraving
('mopa-aluminium-dark engraving', 0, 100, 24000, NULL, NULL, NULL, NULL, NULL, 0.01, 75000, 4, 'Machine: mopa 30w; Hatch #1; Hatch type: bi-dir; Lens: 150x150; Angle: 90; can feel to touch', 'scraped_public', true, 'engrave', 1),
-- ID 36: mopa-aluminium-light engraving
('mopa-aluminium-light engraving', 0, 100, 60000, NULL, NULL, NULL, NULL, NULL, 0.01, 20000, 4, 'Machine: mopa-30w; Hatch #1; Hatch type: bi-dir; Lens: 150x150; Angle: 90; can feel to touch', 'scraped_public', true, 'engrave', 1),
-- ID 33: mopa-stainless-black annealing
('mopa-stainless-black annealing', 0, 20, 9000, NULL, NULL, NULL, NULL, NULL, 0.002, 60000, 4, 'Machine: mopa m7 30w; Hatch #1; Hatch type: bi-dir; Lens: 150x150; Angle: 0', 'scraped_public', true, 'mark', 1),
-- ID 119: natural leather
('natural leather', 0, 45, 48000, NULL, NULL, NULL, NULL, NULL, 0.05, 37000, 4, 'Machine: 30w jpt; Hatch #1; Hatch type: cross-hatch; smells', 'scraped_public', true, 'engrave', NULL),
-- ID 126: nice black on stainless steel knife mopa
('nice black on stainless steel knife mopa', 0, 30, 15000, NULL, NULL, NULL, NULL, NULL, 0.01, 80000, 4, 'Machine: 30w jpt mopa; Hatch #1; Hatch type: unidirectional; Angle: 0; Pulse: 200.00ns; enable crosshatch', 'scraped_public', true, 'engrave', 1),
-- ID 113: pbt plastics
('pbt plastics', 0, 25, 48000, NULL, NULL, NULL, NULL, NULL, 0.05, 10000, 4, 'Machine: 30w jpt; Hatch #1; Hatch type: cross-hatch; Angle: 90', 'scraped_public', true, 'engrave', NULL),
-- ID 114: pbt plastics
('pbt plastics', 0, 25, 48000, NULL, NULL, NULL, NULL, NULL, 0.05, NULL, 4, 'Machine: 30w jpt; Hatch #2; Hatch type: cross-hatch; Angle: 45', 'scraped_public', true, 'engrave', NULL),
-- ID 55: petg plastic
('petg plastic', 0, 30, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 30000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 210mm; Angle: 0', 'scraped_public', true, 'engrave', 1),
-- ID 134: photo black marking stainless steel - 50w jpt
('photo black marking stainless steel - 50w jpt', 0, 35, 2400, NULL, NULL, NULL, NULL, NULL, 0.078, 30000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: unidirectional; Lens: 150x150; Angle: 0; unfocuced -5.5mm', 'scraped_public', true, 'mark', 1),
-- ID 99: pink stainless steel non mopa
('pink stainless steel non mopa', 0, 10, 48000, NULL, NULL, NULL, NULL, NULL, 0.003, 140000, 4, 'Machine: jpt lp 50w; Hatch #1; Hatch type: cross-hatch; Lens: 110mm; Angle: 0; Pulse: 200.00ns; +1.8mm focus', 'scraped_public', true, 'engrave', 1),
-- ID 112: pmag engraving
('pmag engraving', 0, 25, 150000, NULL, NULL, NULL, NULL, NULL, 0.01, 50000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: cross-hatch; Lens: 100; Angle: 0; 100mm opex lens', 'scraped_public', true, 'engrave', NULL),
-- ID 60: pmags 50w
('pmags 50w', 0, 20, 150000, NULL, NULL, NULL, NULL, NULL, 0.01, 50000, 4, 'Machine: jpt 50w; Hatch #1; Hatch type: cross-hatch; Lens: 110; Angle: 0; marks pmags', 'scraped_public', true, 'engrave', NULL),
-- ID 135: pom (black) - white marking 100w mopa
('pom (black) - white marking 100w mopa', 0, 7, 60000, NULL, NULL, NULL, NULL, NULL, 0.02, 45000, 4, 'Machine: mopa m7 100w; Hatch #1; Hatch type: bi-dir; Lens: 100; Angle: 0', 'scraped_public', true, 'mark', NULL),
-- ID 90: pom (black) - white marking 30w mopa
('pom (black) - white marking 30w mopa', 0, 45, 60000, NULL, NULL, NULL, NULL, NULL, 0.03, 45000, 4, 'Machine: mopa m7 30w; Hatch #1; Hatch type: bi-dir; Angle: 0', 'scraped_public', true, 'mark', NULL),
-- ID 81: rainbow effect non mopa  304 stainless steel
('rainbow effect non mopa  304 stainless steel', 0, 45, 18000, NULL, NULL, NULL, NULL, NULL, 0.05, 30000, 4, 'Machine: 30w max; Hatch #1; Hatch type: unidirectional; Angle: 0; on focus', 'scraped_public', true, 'engrave', NULL),
-- ID 80: rainbow look stainless steel - 30w jpt m6 mopa
('rainbow look stainless steel - 30w jpt m6 mopa', 0, 70, 30000, NULL, NULL, NULL, NULL, NULL, 0.02, 60000, 4, 'Machine: 30w jpt m6 mopa; Hatch #1; Hatch type: unidirectional; Lens: 174; Pulse: 200.00ns; 3mm out of focus(up)', 'scraped_public', true, 'engrave', NULL),
-- ID 54: red glass
('red glass', 0, 50, 30000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Lens: 210mm; Angle: 0', 'scraped_public', true, 'engrave', 1),
-- ID 50: red on stainless steel
('red on stainless steel', 0, 30, 24000, NULL, NULL, NULL, NULL, NULL, 0.005, 200000, 4, 'Machine: jpt mopa 30w m6-m7; Hatch #1; Hatch type: bi-dir; Lens: 175mm; Angle: 0; Pulse: 80.00ns', 'scraped_public', true, 'engrave', 1),
-- ID 65: red on stainless steel - mopa
('red on stainless steel - mopa', 0, 45, 60000, NULL, NULL, NULL, NULL, NULL, 0.003, 400000, 4, 'Machine: jpt mopa; Hatch #1; Hatch type: unidirectional; Angle: 0; Pulse: 60.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 21: remove coating from tumblers
('remove coating from tumblers', 0, 32, 60000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: 30w raycus; Hatch #1; Hatch type: unidirectional; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 22: rosegold metal/glossy coating.
('rosegold metal/glossy coating.', 0, 70, 3000, NULL, NULL, NULL, NULL, NULL, 0.01, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Angle: 0; you have to mark it 2-4 times before it mark.', 'scraped_public', true, 'engrave', NULL),
-- ID 44: round dog tags plated
('round dog tags plated', 0, 40, 24000, NULL, NULL, NULL, NULL, NULL, 0.03, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150mm; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 136: scratch paper 60w mopa 25d
('scratch paper 60w mopa 25d', 0, 20, 60000, NULL, NULL, NULL, NULL, NULL, 0.005, 30000, 4, 'Machine: jpt m7 60w mopa; Hatch #1; Hatch type: unidirectional; Lens: 170; Angle: 0; Pulse: 200.00ns; leaves a strong smell.', 'scraped_public', true, 'engrave', 1),
-- ID 110: silicon plastic
('silicon plastic', 0, 20, 48000, NULL, NULL, NULL, NULL, NULL, 0.5, 5000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: cross-hatch; Angle: 90; Pulse: 200.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 103: slate coasters laser engraving
('slate coasters laser engraving', 0, 70, 10500, NULL, NULL, NULL, NULL, NULL, 0.1, 45000, 4, 'Machine: 50w jpt; Hatch #1; Hatch type: unidirectional; Lens: 150; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 104: slate coasters laser engraving
('slate coasters laser engraving', 0, 55, 120000, NULL, NULL, NULL, NULL, NULL, 0.1, 300000, 4, 'Machine: 50w jpt; Hatch #2; Hatch type: unidirectional; Lens: 150; Angle: 90', 'scraped_public', true, 'engrave', NULL),
-- ID 16: stainless steel firing pin
('stainless steel firing pin', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.03, 35000, 4, 'Machine: raycus 50w; Hatch #1; Hatch type: bi-dir; Angle: 90; courier new greek, 3.4mm height, .35 between letters, size 2x13mm.', 'scraped_public', true, 'engrave', 5),
-- ID 17: stainless steel firing pin
('stainless steel firing pin', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.03, 35000, 4, 'Machine: raycus 50w; Hatch #2; Hatch type: bi-dir; Angle: 270', 'scraped_public', true, 'engrave', 5),
-- ID 18: stainless steel firing pin
('stainless steel firing pin', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, 75000, 4, 'Machine: raycus 50w; Hatch #3; Hatch type: unidirectional; Angle: 135', 'scraped_public', true, 'engrave', 5),
-- ID 53: stainless steel ring black anneal
('stainless steel ring black anneal', 0, 25, 3600, NULL, NULL, NULL, NULL, NULL, 0.003, 60000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150; Angle: 0; unfocus +2mm below', 'scraped_public', true, 'mark', NULL),
-- ID 2: steel deep engraving
('steel deep engraving', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Angle: 90', 'scraped_public', true, 'engrave', 25),
-- ID 3: steel deep engraving
('steel deep engraving', 0, 100, 90000, NULL, NULL, NULL, NULL, NULL, 0.02, 35000, 4, 'Machine: raycus 30w; Hatch #2; Hatch type: bi-dir; Angle: 180', 'scraped_public', true, 'engrave', 25),
-- ID 4: steel deep engraving
('steel deep engraving', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.02, 75000, 4, 'Machine: raycus 30w; Hatch #3; Hatch type: unidirectional; Angle: 315', 'scraped_public', true, 'engrave', 5),
-- ID 118: stone / granite
('stone / granite', 0, 30, 30000, NULL, NULL, NULL, NULL, NULL, 0.05, 37000, 4, 'Machine: 30w jpt; Hatch #1; Hatch type: cross-hatch; Angle: 90', 'scraped_public', true, 'engrave', NULL),
-- ID 120: synthetic leather
('synthetic leather', 0, 25, 72000, NULL, NULL, NULL, NULL, NULL, 0.05, 15000, 4, 'Machine: 30w jpt; Hatch #1; Hatch type: unidirectional; Lens: 100; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 28: white color marking on steel
('white color marking on steel', 0, 50, 90000, NULL, NULL, NULL, NULL, NULL, NULL, 35000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Angle: 0; on focus', 'scraped_public', true, 'mark', NULL),
-- ID 5: white color on brass
('white color on brass', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, 60000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Angle: 90', 'scraped_public', true, 'mark', 4),
-- ID 6: white color on brass
('white color on brass', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, 60000, 4, 'Machine: raycus 30w; Hatch #2; Hatch type: unidirectional; Angle: 180', 'scraped_public', true, 'mark', 4),
-- ID 57: white glass
('white glass', 0, 50, 30000, NULL, NULL, NULL, NULL, NULL, 0.02, 20000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Lens: 210mm; Angle: 0', 'scraped_public', true, 'engrave', 1),
-- ID 58: white markings on aluminum
('white markings on aluminum', 0, 80, 30000, NULL, NULL, NULL, NULL, NULL, 0, 30000, 4, 'Machine: jpt 50w; Hatch #1; Hatch type: cross-hatch; Lens: 110; Angle: 0; white markings', 'scraped_public', true, 'mark', NULL),
-- ID 117: white on aluminum mopa
('white on aluminum mopa', 0, 80, 120000, NULL, NULL, NULL, NULL, NULL, 0.5, 265000, 4, 'Machine: 30w jpt mopa; Hatch #1; Hatch type: unidirectional; Pulse: 10.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 10: white on anodized aluminum
('white on anodized aluminum', 0, 100, 120000, NULL, NULL, NULL, NULL, NULL, 0.03, 55000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Angle: 90', 'scraped_public', true, 'engrave', 1),
-- ID 48: white on black casted acrylic
('white on black casted acrylic', 0, 40, 36000, NULL, NULL, NULL, NULL, NULL, 0.05, 40000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: bi-dir; Lens: 150x150mm; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 69: white on stainless steel - mopa
('white on stainless steel - mopa', 0, 45, 60000, NULL, NULL, NULL, NULL, NULL, 0.002, 300000, 4, 'Machine: jpt mopa; Hatch #1; Hatch type: bi-dir; Pulse: 6.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 45: white on tumblers
('white on tumblers', 0, 32, 60000, NULL, NULL, NULL, NULL, NULL, 0.03, 32000, 4, 'Machine: raycus 30w; Hatch #1; Hatch type: unidirectional; Lens: 150x150mm; Angle: 0', 'scraped_public', true, 'engrave', NULL),
-- ID 107: white/grey on gold
('white/grey on gold', 0, 45, 90000, NULL, NULL, NULL, NULL, NULL, 0.05, 37000, 4, 'Machine: 30w jpt; Hatch #1; Hatch type: unidirectional; Lens: 100mm; Pulse: 200.00ns', 'scraped_public', true, 'engrave', NULL),
-- ID 51: yellow on stainless steel
('yellow on stainless steel', 0, 55, 90000, NULL, NULL, NULL, NULL, NULL, 0.005, 200000, 4, 'Machine: jpt mopa 30w m6-m7; Hatch #1; Hatch type: bi-dir; Lens: 175mm; Angle: 0; Pulse: 13.00ns', 'scraped_public', true, 'engrave', 1) ON CONFLICT DO NOTHING;
