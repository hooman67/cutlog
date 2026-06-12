-- Seed materials database with common laser cutting materials

INSERT INTO materials (name, category, aliases) VALUES
-- Stainless Steels
('Stainless Steel 304', 'stainless', '{"SS304", "304SS", "18-8", "A2"}'),
('Stainless Steel 316', 'stainless', '{"SS316", "316SS", "A4", "marine grade"}'),
('Stainless Steel 430', 'stainless', '{"SS430", "430SS"}'),
('Stainless Steel 201', 'stainless', '{"SS201"}'),
('Stainless Steel 301', 'stainless', '{"SS301"}'),
('Stainless Steel 303', 'stainless', '{"SS303", "free machining"}'),
('Stainless Steel 310', 'stainless', '{"SS310", "heat resistant"}'),
('Stainless Steel 321', 'stainless', '{"SS321"}'),
('Stainless Steel 347', 'stainless', '{"SS347"}'),
('Stainless Steel 410', 'stainless', '{"SS410", "martensitic"}'),
('Stainless Steel 420', 'stainless', '{"SS420"}'),
('Stainless Steel 440C', 'stainless', '{"SS440C", "blade steel"}'),
('Duplex 2205', 'stainless', '{"2205", "duplex"}'),
('Duplex 2507', 'stainless', '{"2507", "super duplex"}'),

-- Mild / Carbon Steels
('Mild Steel (A36)', 'mild_steel', '{"A36", "HR", "hot rolled", "structural"}'),
('Mild Steel (1018)', 'mild_steel', '{"1018", "CRS", "cold rolled"}'),
('Mild Steel (1020)', 'mild_steel', '{"1020"}'),
('Mild Steel (1045)', 'mild_steel', '{"1045", "medium carbon"}'),
('Mild Steel (4130)', 'mild_steel', '{"4130", "chromoly"}'),
('Mild Steel (4140)', 'mild_steel', '{"4140"}'),
('Spring Steel (1095)', 'mild_steel', '{"1095", "high carbon", "spring steel"}'),
('AR400 Plate', 'mild_steel', '{"AR400", "abrasion resistant"}'),
('AR500 Plate', 'mild_steel', '{"AR500", "armor plate"}'),
('Hardox 450', 'mild_steel', '{"Hardox", "wear plate"}'),
('Corten Steel', 'mild_steel', '{"Corten", "weathering steel", "A588"}'),
('Galvanized Steel', 'mild_steel', '{"galv", "galvanised", "GI"}'),
('Zintec', 'mild_steel', '{"electro-galvanized"}'),

-- Aluminum
('Aluminum 5052', 'aluminum', '{"5052", "AL5052", "marine aluminum"}'),
('Aluminum 6061', 'aluminum', '{"6061", "AL6061", "structural aluminum"}'),
('Aluminum 5083', 'aluminum', '{"5083", "AL5083", "marine plate"}'),
('Aluminum 3003', 'aluminum', '{"3003", "AL3003"}'),
('Aluminum 1100', 'aluminum', '{"1100", "pure aluminum"}'),
('Aluminum 2024', 'aluminum', '{"2024", "aircraft aluminum"}'),
('Aluminum 7075', 'aluminum', '{"7075", "aerospace aluminum"}'),
('Aluminum 6082', 'aluminum', '{"6082"}'),

-- Copper & Brass
('Copper C110', 'copper', '{"C110", "pure copper", "ETP copper"}'),
('Copper C101', 'copper', '{"C101", "OFHC copper", "oxygen free"}'),
('Brass 260', 'copper', '{"C260", "cartridge brass", "70/30"}'),
('Brass 360', 'copper', '{"C360", "free cutting brass"}'),
('Bronze (Phosphor)', 'copper', '{"phosphor bronze", "C510", "C521"}'),
('Bronze (Silicon)', 'copper', '{"silicon bronze", "C655"}'),
('Beryllium Copper', 'copper', '{"BeCu", "C172", "spring copper"}'),

-- Titanium
('Titanium Grade 1', 'titanium', '{"Ti Gr1", "CP titanium", "commercially pure"}'),
('Titanium Grade 2', 'titanium', '{"Ti Gr2", "CP2"}'),
('Titanium Grade 5 (Ti-6Al-4V)', 'titanium', '{"Ti64", "Ti-6-4", "Grade 5", "aerospace titanium"}'),
('Titanium Grade 9', 'titanium', '{"Ti Gr9", "3-2.5"}'),
('Titanium Grade 23', 'titanium', '{"Ti-6Al-4V ELI", "medical titanium"}'),

-- Nickel Alloys / Superalloys
('Inconel 625', 'exotic', '{"IN625", "Alloy 625"}'),
('Inconel 718', 'exotic', '{"IN718", "Alloy 718"}'),
('Hastelloy C-276', 'exotic', '{"C276", "Alloy C-276"}'),
('Hastelloy X', 'exotic', '{"HastX"}'),
('Monel 400', 'exotic', '{"Monel", "Alloy 400"}'),
('Waspaloy', 'exotic', '{"Waspaloy"}'),
('Nimonic 80A', 'exotic', '{"Nimonic"}'),
('Invar 36', 'exotic', '{"Invar", "FeNi36", "low expansion"}'),
('Kovar', 'exotic', '{"Kovar", "Fe-Ni-Co", "glass sealing"}'),

-- Precious Metals
('Gold (24K)', 'precious', '{"pure gold", "Au"}'),
('Silver (Sterling)', 'precious', '{"925 silver", "Ag"}'),
('Platinum', 'precious', '{"Pt"}'),

-- Tool Steels
('Tool Steel D2', 'tool_steel', '{"D2", "cold work"}'),
('Tool Steel A2', 'tool_steel', '{"A2", "air hardening"}'),
('Tool Steel O1', 'tool_steel', '{"O1", "oil hardening"}'),
('Tool Steel S7', 'tool_steel', '{"S7", "shock resistant"}'),
('Tool Steel H13', 'tool_steel', '{"H13", "hot work"}'),
('Tool Steel M2', 'tool_steel', '{"M2", "high speed steel", "HSS"}'),

-- Non-metals (fiber lasers can cut some)
('Acrylic (PMMA)', 'non_metal', '{"acrylic", "plexiglass", "perspex", "PMMA"}'),
('Polycarbonate', 'non_metal', '{"PC", "Lexan", "Makrolon"}'),
('ABS', 'non_metal', '{"ABS plastic"}'),
('Delrin (POM)', 'non_metal', '{"Delrin", "acetal", "POM"}'),
('PEEK', 'non_metal', '{"PEEK", "polyether ether ketone"}'),
('Carbon Fiber (CFRP)', 'non_metal', '{"CFRP", "carbon fiber", "CF sheet"}'),
('Fiberglass (GFRP)', 'non_metal', '{"GFRP", "fiberglass", "FR4"}'),
('Plywood', 'non_metal', '{"plywood", "birch ply"}'),
('MDF', 'non_metal', '{"MDF", "medium density fiberboard"}'),
('Leather', 'non_metal', '{"leather", "veg tan"}'),
('Rubber (Silicone)', 'non_metal', '{"silicone", "silicone rubber"}'),
('Ceramic (Alumina)', 'non_metal', '{"Al2O3", "alumina", "ceramic"}'),

-- Coated / Special
('Painted Steel', 'coated', '{"powder coated", "painted"}'),
('Anodized Aluminum', 'coated', '{"anodized", "anodised"}'),
('Mirror Stainless', 'coated', '{"mirror finish", "polished SS"}'),
('Brushed Stainless', 'coated', '{"brushed SS", "satin finish"}'),
('Pre-painted Galv (Colorbond)', 'coated', '{"Colorbond", "prepainted"}')

ON CONFLICT (name) DO NOTHING;
