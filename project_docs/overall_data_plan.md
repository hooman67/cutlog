# Overall Data Collection Plan: Laser Cutting Parameter Optimization

## Date: June 14, 2026
## Status: Planning Phase (Pre-Collection)

---

## 1. Current State: What We Have

### Data Collected So Far: 724 parameters IN THE DATABASE

Cold-start seeding is **COMPLETE**. The following data has been generated/scraped and inserted into the Supabase production database:

| Source | Records | Method | Status |
|--------|---------|--------|--------|
| AI-generated baseline | 554 | Python script (`scripts/generate-baseline-data.py`) | ✅ In DB |
| LightBurn GitHub repos | 52 | Scraped from 3 public repos (Ortur, OMT, Gweike) | ✅ In DB |
| lasertips.org + Wikipedia | 43 | Web scraping + manual extraction | ✅ In DB |
| Reddit/forums (London Hackspace, OMTech, K40 community) | 80 | Web scraping | ✅ In DB |
| Manual user logs (testing) | 2 | User-entered via app | ✅ In DB |
| **TOTAL IN DB** | **724** | | |

**SQL files** (for re-seeding or reference): `/mnt/localssd/laser_log/app/data/`
- `COMBINED_PASTE_ALL.sql` — All 724 rows in one file (paste into Supabase SQL Editor)
- `baseline-parameters.sql` — 554 AI baseline rows
- `lightburn-scraped.sql` — 52 LightBurn community rows
- `lasertips-scraped.sql` — 43 reference rows
- `reddit-forums-scraped.sql` — 80 forum rows

**Generator script**: `scripts/generate-baseline-data.py` — Produces realistic parameters for 20 materials across multiple thicknesses (run with `python3 scripts/generate-baseline-data.py`)

**Materials covered (20 in baseline)**: Stainless Steel 304, 316, 430, Mild Steel, Carbon Steel, Galvanized Steel, Aluminum, Copper, Brass, Titanium, Inconel, Hastelloy, Acrylic, Leather, Plywood, MDF, Polycarbonate, Rubber, Felt, Cork

**Additional materials from scraping**: Birch Plywood, Poplar Plywood, Basswood, Walnut, Maple, Pine, Oak, Paper, Cardboard, EVA Foam, Linoleum, Cork, Canvas, PVC, Polypropylene, Mylar, Gold, Silver, Boron Epoxy, and more.

### What's Built (Product Side)
- CutLog prototype is functional: auth, machine setup, cut logging, suggestion engine (SQL-based)
- 85+ materials pre-seeded in materials reference table
- **Suggestion engine works with 3-tier results**: Your Data (green) → AI Baseline (orange) → Community (blue)
- Supports partial text search (type "stainless" and get all stainless variants)
- **App is LIVE on Vercel**: https://cutlog-two.vercel.app
- PWA-installable on iPhone (Add to Home Screen = native app feel)
- 3 Facebook contacts identified for beta + 5 Round 2 targets identified

### What's Been Done (vs. Original Plan)
- ✅ Cold-start seeding complete (724 params vs. target of 300-500 for Tier 1)
- ✅ LightBurn community .cuts files parsed from GitHub
- ✅ lasertips.org data extracted
- ✅ Reddit/forum parameters collected
- ✅ Database schema updated with `source` tracking column
- ✅ RLS policies updated for baseline data access
- 🔲 OMG Laser scraping (130+ entries) — not yet done
- 🔲 Etsy .CLB file purchase — not yet done
- 🔲 LaserParams Converter logic extraction — not yet done
- 🔲 OEM manual PDFs — not yet done

---

## 2. New Sources to Evaluate (Not in Original Research)

### 2.1 OMG Laser (omglaser.com/laser-settings/)

| Attribute | Assessment |
|-----------|-----------|
| **Data volume** | 130+ static parameter entries |
| **Format** | HTML tables (likely BeautifulSoup-scrapable) |
| **Cost** | Free |
| **Quality** | Medium — community/editorial, not OEM-validated |
| **Laser types covered** | Likely CO2 + diode (consumer-oriented) |
| **Effort to scrape** | LOW — single page or small set of pages with HTML tables |

**Verdict: YES, scrape this.** Low effort, decent volume. Good for cold-start seeding of consumer laser parameters. Treat as Tier B confidence (0.70-0.80). Do it in Phase 1.

**Action items:**
1. Visit the URL and inspect page structure (is it one big table or paginated?)
2. Write BeautifulSoup scraper — likely 50-100 lines of Python
3. Map their column headers to our schema
4. Estimated time: 2-4 hours

---

### 2.2 Lasertips.org (100+ material/app combos)

| Attribute | Assessment |
|-----------|-----------|
| **Data volume** | 100-150 parameter entries (confirmed in prior research) |
| **Format** | HTML tables per material page |
| **Cost** | Free |
| **Quality** | Medium-High — community-curated, well-organized |
| **Effort to scrape** | LOW — 20-30 pages with consistent table format |

**Verdict: YES, scrape this.** Already identified as Phase 1 priority in existing roadmap. Proceed as planned.

**Action items:**
1. Map site structure (/cutting-guides/[material]/)
2. Write table parser — consistent CSS selectors
3. Estimated time: 3-5 hours

---

### 2.3 LaserParams Converter (GitHub: shark92651/LaserParams)

| Attribute | Assessment |
|-----------|-----------|
| **What it is** | C# tool that converts EZCAD2/EZCAD3/LightBurn parameter libraries between wattages and lens sizes |
| **Stars** | 46 (niche but validated) |
| **Last active** | 2022 (dormant) |
| **License** | Need to check (critical for integration) |
| **Core value** | The CONVERSION LOGIC — "if params work on 60W with 220mm lens, what should they be on 100W with 300mm lens?" |

**Verdict: YES, integrate the conversion logic — but as a FEATURE, not a data source.**

This is not a data source per se. It's a **feature engineering tool** that multiplies the value of every data point we collect. Here's why:

**Without LaserParams logic:**
- You have 1 verified data point: "3mm acrylic, 60W CO2, 220mm lens → 80% power, 500mm/s"
- A user with a 100W CO2, 300mm lens asks for recommendations → no match, no suggestion

**With LaserParams logic:**
- Same data point gets mathematically scaled to the user's machine specs
- 1 verified data point becomes applicable to N machine configurations
- This is a MULTIPLIER on our dataset — effectively 5-10x the useful parameter coverage

**Integration approach:**
1. Clone the repo, read the C# source to extract the mathematical relationships
2. The conversion formulas are likely based on physics: power density = power / (spot_size^2), where spot_size is a function of lens focal length
3. Reimplement in TypeScript/Python (not dependent on C# runtime)
4. Use as a feature in the suggestion engine: when a user's machine differs from stored parameters, apply the scaling factors
5. Tag converted parameters clearly: "Scaled from verified data on similar machine" (lower confidence than direct match)

**Key formulas to extract:**
- Power scaling: P_new = P_original * (W_new / W_original) * correction_factor
- Speed scaling: inversely proportional to power increase (for same cut quality)
- Lens correction: spot_size = focal_length * beam_divergence → affects power density

**Action items:**
1. Clone https://github.com/shark92651/LaserParams
2. Read C# source — identify the core conversion functions
3. Document the mathematical model (likely 3-5 formulas)
4. Reimplement in Python (for ML feature engineering) and TypeScript (for app)
5. Add as "Parameter Scaling" module to CutLog suggestion engine
6. Estimated time: 1-2 days to understand + reimplement

**Priority: HIGH** — this is a force multiplier. Every data point we collect becomes 5-10x more useful.

---

### 2.4 OEM Manuals (Trumpf, Bystronic, Amada)

Already covered in existing research. Key update:

| Attribute | Assessment |
|-----------|-----------|
| **Data volume** | 240-370 combined (Trumpf: 100-150, Bystronic: 80-120, Amada: 60-100) |
| **Format** | PDF tables |
| **Quality** | Excellent — manufacturer reference |
| **Effort** | Medium — PDFs need pdfplumber extraction |
| **Coverage** | Primarily FIBER lasers, industrial scale (2kW-12kW) |

**Verdict: YES, but deprioritize slightly.** Industrial fiber laser data is important for completeness but our initial users (Nate, Mike, Sean from Facebook groups) are likely running consumer/prosumer machines (60W-150W CO2, 20-50W fiber). Start with consumer data sources first.

**Action items:**
1. Download freely available PDFs from each manufacturer
2. Extract with pdfplumber (code already written in extraction_strategy.md)
3. Schedule for Phase 2 (after consumer sources are done)
4. Estimated time: 2-3 days

---

### 2.5 Academic Papers (10+ identified with parameter data)

| Attribute | Assessment |
|-----------|-----------|
| **Data volume** | 20-50 high-quality parameter combinations |
| **Format** | Tables embedded in PDFs |
| **Quality** | Excellent — controlled experiments, peer-reviewed |
| **Effort** | HIGH — manual extraction, understanding experimental context |
| **Unique value** | Energy density calculations, kerf width data, surface roughness metrics |

**Verdict: YES, but save for Phase 3.** Small volume, high effort — but the data is gold-standard quality. Use for ML model validation (holdout test set) rather than training data.

**Key papers with extractable data:**
1. Wagner et al. 2025 — transfer learning validation data
2. Radovanovic & Madic 2011 — ANN training data (mild steel)
3. Behbahani et al. 2022 — alumina ceramics parameters
4. Yilbas et al. 2012-2016 — stainless/aluminum/mild steel comprehensive tables

**Action items:**
1. Download PDFs for top 5 papers
2. Manually extract parameter tables into CSV
3. Use as validation/test set for ML model
4. Estimated time: 1 week (manual, intermittent)

---

### 2.6 Facebook Group Scraping (Manual Extraction)

| Attribute | Assessment |
|-----------|-----------|
| **Data volume** | 50-200 parameter combinations (estimated across relevant groups) |
| **Format** | Unstructured text in posts/comments |
| **Quality** | Medium — user-shared, but from experienced operators |
| **Effort** | HIGH — manual reading and extraction (no API for groups) |
| **Legal** | Gray area — Facebook ToS prohibit automated scraping; manual note-taking is fine |

**Relevant groups:**
- "Laser Cutting and Engraving" (large group, 50K+ members)
- "Fiber Laser Users" (focused on fiber lasers)
- "CO2 Laser Cutting" (consumer/prosumer focus)
- Various brand-specific groups (OMTech, xTool, etc.)

**Verdict: DO MANUALLY, DON'T AUTOMATE.** The 3 contacts (Nate, Mike, Sean) are already in these groups. When we talk to them for beta validation, ask them to share any "settings posts" they've saved/bookmarked. Many operators screenshot or save parameter posts.

**Action items:**
1. During beta calls with Nate/Mike/Sean, ask: "Have you saved any parameter posts from groups?"
2. Ask for permission to include their shared parameters in the database
3. Manually extract any shared screenshots/posts into our schema
4. Do NOT build automated scrapers for Facebook
5. Estimated time: Ongoing (piggyback on customer conversations)

---

### 2.7 LightBurn .clb File Imports from Users

| Attribute | Assessment |
|-----------|-----------|
| **Data volume** | 10-100 per user (depends on their library size) |
| **Format** | .clb is a LightBurn Cut Library file — proprietary binary or XML variant |
| **Quality** | HIGH — these are the user's own verified, working parameters |
| **Effort** | Medium — need to reverse-engineer .clb format (or use .cuts export) |
| **Unique value** | Machine-specific, user-verified parameters — exactly what CutLog needs |

**Verdict: YES, build this as a FEATURE (import wizard), not a scraping task.**

This is the single highest-value data source because:
1. Parameters are already verified (the user uses them daily)
2. They're machine-specific (tied to the user's exact setup)
3. Importing them creates immediate value for the user (their data is now searchable)
4. It's the user voluntarily contributing data (no legal/ethical concerns)

**Implementation approach:**
1. Research .clb file format (LightBurn forum likely has documentation)
2. If .clb is too complex, support .lbrn (project files) which ARE documented XML
3. Build "Import from LightBurn" feature in CutLog
4. On import: parse parameters, attach to user's machine profile, auto-rate as 4-star (verified working)
5. Ask user if they want to share imported data with community (opt-in)

**Action items:**
1. Find .clb file format documentation (LightBurn forum, GitHub issues)
2. Get a sample .clb file (from beta users or download from community)
3. Write parser (likely XML-based, similar to .cuts parser we already have)
4. Build import UI in CutLog (drag-and-drop or file picker)
5. Estimated time: 3-5 days (including testing)

**Priority: HIGH for v1.1** — Not needed for cold-start, but critical for user onboarding. "Import your existing LightBurn library" reduces friction to zero.

---

## 3. Priority Order for Data Collection

### Tier 1: IMMEDIATE (This Week) — Cold-Start Seeding

These sources populate the database before beta users arrive. Goal: 300-500 params.

| # | Source | Est. Params | Effort | Time |
|---|--------|------------|--------|------|
| 1 | **OMG Laser** (omglaser.com) | 130+ | Low | 2-4 hrs |
| 2 | **Lasertips.org** | 100-150 | Low | 3-5 hrs |
| 3 | **LightBurn community .cuts** (GitHub) | 50-100 | Low | 2-3 hrs |
| 4 | **LaserParams Converter** (logic extraction) | 0 new, but 5-10x multiplier | Medium | 1-2 days |

**Subtotal: 280-380 raw params + scaling logic = effectively 500-1000 applicable suggestions**

---

### Tier 2: NEXT WEEK — Expand Coverage

| # | Source | Est. Params | Effort | Time |
|---|--------|------------|--------|------|
| 5 | **Epilog PDF guides** | 150-250 | Low-Med | 2-3 days |
| 6 | **LightBurn local library** (if installable) | 200-400 | Low | 1 day |
| 7 | **Reddit API** (r/LaserCutting) | 100-200 | Medium | 2-3 days |

**Subtotal: +450-850 params (cumulative: 730-1,230 raw)**

---

### Tier 3: WEEK 3 — Industrial + Validation

| # | Source | Est. Params | Effort | Time |
|---|--------|------------|--------|------|
| 8 | **Trumpf/Bystronic/Amada PDFs** | 150-250 | Medium | 2-3 days |
| 9 | **Academic papers** (manual) | 20-50 | High | 3-5 days |
| 10 | **Facebook groups** (manual, via contacts) | 20-50 | Ongoing | Passive |

**Subtotal: +190-350 params (cumulative: 920-1,580 raw)**

---

### Tier 4: FEATURE BUILD (Parallel Track)

| # | Feature | Value | Time |
|---|---------|-------|------|
| 11 | **LightBurn .clb/.lbrn import** in CutLog | User onboarding (10-100 params per user) | 3-5 days |
| 12 | **LaserParams scaling** in suggestion engine | 5-10x multiplier on all stored data | 1-2 days |
| 13 | **Community contribution flow** | Ongoing data growth from users | Already built |

---

## 4. Estimated Volume Summary

| Source | Raw Params | After Dedup (est. 40% overlap) | Confidence Tier |
|--------|-----------|-------------------------------|-----------------|
| OMG Laser | 130 | ~100 unique | B (0.70-0.80) |
| Lasertips.org | 125 | ~90 unique | B (0.70-0.80) |
| LightBurn (community) | 75 | ~60 unique | A (0.90-0.95) |
| Epilog PDFs | 200 | ~150 unique | A (0.92-0.95) |
| LightBurn (local library) | 300 | ~200 unique | A (0.95) |
| Reddit | 150 | ~80 unique | C (0.60-0.85) |
| Manufacturer PDFs | 200 | ~150 unique | A (0.95-0.97) |
| Academic papers | 35 | ~35 unique | A+ (0.97+) |
| Facebook (manual) | 35 | ~30 unique | B (0.75) |
| User imports (.clb) | Variable | All unique (user-specific) | A (0.90+) |
| **TOTAL** | **~1,250** | **~895 unique** | |

With LaserParams scaling logic applied: **895 unique params x 5-8 machine variants = 4,000-7,000 applicable suggestions**

---

## 5. Data Schema / Format Considerations

### Unified Schema (extends existing design from data_sources.md)

```json
{
  "id": "param_uuid",
  "source": "omglaser|lasertips|lightburn|epilog|reddit|trumpf|bystronic|amada|academic|user|facebook",
  "source_url": "https://...",
  "source_type": "scraped|imported|user_logged|manual_entry",
  
  "material": "Stainless Steel 304",
  "material_category": "stainless",
  "material_thickness_mm": 3.0,
  
  "laser_type": "CO2|Fiber|Diode|Nd:YAG",
  "laser_power_w": 80,
  "lens_focal_length_mm": 220,
  
  "cutting_power_percent": 80,
  "cutting_speed_mm_s": 500,
  "cutting_speed_mm_min": 30000,
  "frequency_khz": 5.0,
  "pulse_duration_us": null,
  
  "assist_gas": "air|nitrogen|oxygen|none",
  "assist_gas_pressure_bar": null,
  "nozzle_diameter_mm": null,
  "focus_position_mm": null,
  "line_interval_mm": null,
  "passes": 1,
  "z_offset_mm": 0,
  
  "quality_rating": 4,
  "edge_quality": "clean|slight_dross|heavy_dross|burn_marks",
  "kerf_width_mm": null,
  "quality_notes": "clean cut, no charring",
  
  "confidence_score": 0.85,
  "corroboration_count": 2,
  "verified_by_users": 0,
  
  "scaling_applicable": true,
  "scaling_source_wattage": 60,
  "scaling_source_lens_mm": 220,
  
  "date_added": "2026-06-14",
  "last_verified": "2026-06-14"
}
```

### Key Schema Decisions

1. **Dual speed fields** — Store both mm/s and mm/min (different sources use different units). Always convert to mm/s as canonical.

2. **Scaling metadata** — When LaserParams logic is applied, store the ORIGINAL source parameters AND the scaling factors used. This allows re-scaling if formulas are updated.

3. **Confidence score** — Computed from: source_weight x corroboration_factor x recency_factor (formula from source_validation.md).

4. **Material taxonomy** — Normalize to canonical names with aliases:
   - "SS304" / "304SS" / "Stainless 304" / "18-8 Stainless" → all map to "Stainless Steel 304"
   - Use `material_category` for broad grouping in ML features

5. **Source attribution** — Always track provenance. Critical for:
   - Legal compliance (can we redistribute this data?)
   - Quality weighting (OEM data weighted higher than Reddit)
   - Deduplication (same param from 3 sources = higher confidence)

---

## 6. Technical Implementation Plan

### Week 1: Scraping Infrastructure + Quick Wins

```
Day 1-2: OMG Laser + Lasertips.org
├── Inspect page structures (curl + browser dev tools)
├── Write scrapers (BeautifulSoup, ~100 lines each)
├── Map to unified schema
├── Store as JSON in /data/scraped/
└── Validate: spot-check 10 entries per source

Day 3: LightBurn Community
├── Clone github.com/tatarize/LaserBurn-Cuts
├── Run existing XML parser from extraction_strategy.md
├── Deduplicate against OMG/Lasertips data
└── Store in /data/scraped/

Day 4-5: LaserParams Converter
├── Clone github.com/shark92651/LaserParams
├── Read C# source, document formulas
├── Implement in Python (scaling_engine.py)
├── Unit tests: verify conversion matches C# output
└── Document scaling assumptions + limits
```

### Week 2: Expand + Import Feature

```
Day 6-7: Epilog PDF Extraction
├── Download material guide PDFs
├── Extract with pdfplumber
├── Handle edge cases (merged cells, footnotes)
└── Add to dataset

Day 8-9: Reddit API Setup + Scraping  
├── Create Reddit app (free)
├── Implement PRAW-based scraper
├── Quality filter: score > 10, has material mention
├── NLP extraction of power/speed/material from text
└── Lower confidence scoring for these entries

Day 10: LightBurn Import Feature (CutLog)
├── Research .clb/.lbrn file format
├── Build parser
├── Add "Import from LightBurn" UI to CutLog
└── Test with sample files
```

### Week 3: Industrial Data + ML Prep

```
Day 11-12: Manufacturer PDFs
├── Trumpf cutting speed reference
├── Bystronic specifications  
├── Amada cutting guides
└── All fiber laser focused — tag accordingly

Day 13-14: Data Pipeline + Quality
├── Run full deduplication pass
├── Compute confidence scores
├── Generate statistics (coverage by material/laser/thickness)
├── Identify gaps (materials with <5 data points)
└── Seed CutLog database with top-confidence params

Day 15: ML Feature Engineering
├── Apply LaserParams scaling to generate synthetic variants
├── Create feature matrix for future XGBoost model
├── Export training-ready dataset
└── Reserve academic paper data as validation holdout
```

---

## 7. Key Decisions & Recommendations

### Should we scrape OMG Laser?
**YES.** Low effort (2-4 hours), 130+ free entries, consumer-relevant. No API key needed, just HTML parsing. Do it first.

### Should we scrape Lasertips.org?
**YES.** Already planned, confirmed valuable. Same effort profile as OMG Laser. Nate (our beta user contact) actually shared this site as a reference — validates its relevance.

### Should we integrate LaserParams Converter logic?
**YES — this is the highest-leverage item on this list.** It's not a data source; it's a force multiplier. Every single parameter we collect becomes applicable to 5-10 machine configurations. The math is well-established (power density scaling with lens/wattage). The C# code saves us from deriving formulas ourselves.

### Should we build LightBurn import?
**YES, for v1.1.** Not needed for cold-start, but critical for user onboarding friction. "Import your existing library" is the killer feature that makes a user's first session immediately valuable.

### What about Facebook groups?
**Manual only.** Don't build scrapers (ToS violation, technically complex, low ROI vs. effort). Instead, leverage beta user conversations to extract parameters organically. Ask users to share bookmarked settings posts.

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Sources go offline | Download and archive all data locally during scraping |
| Data quality issues (wrong units, typos) | Implement validation rules: power 0-100%, speed 0-50000mm/s, thickness 0.1-50mm |
| Legal concerns with scraping | All sources confirmed public + free; respect robots.txt; don't redistribute raw data (only derived insights) |
| LaserParams repo abandoned | Extract formulas NOW; the math won't change (it's physics) |
| Low user adoption means no community data | Cold-start dataset ensures value even with 0 users contributing |
| Deduplication removes too much | Keep "soft duplicates" (same material, different machine) — these are VALUABLE for ML, not noise |

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Unique parameters collected | 600+ (after dedup) | Count distinct (material, thickness, laser_type, power, speed) |
| Material coverage | 20+ material types | Count distinct material_category |
| Laser type coverage | 4 types (CO2, Fiber, Diode, Nd:YAG) | Count distinct laser_type |
| Thickness range | 0.5mm - 25mm+ | Range of material_thickness_mm |
| Average confidence score | > 0.75 | Mean of confidence_score |
| Applicable suggestions (with scaling) | 3,000+ | Count after LaserParams expansion |
| Cold-start coverage | 80% of common requests get a result | Test with top-20 material/thickness combos |

---

## 10. Next Actions (Immediate)

1. **TODAY:** Inspect OMG Laser page structure and start scraper
2. **TODAY:** Clone LaserParams repo and read the C# conversion logic
3. **TOMORROW:** Scrape Lasertips.org + OMG Laser (both in one session)
4. **THIS WEEK:** Extract LaserParams formulas, implement in Python
5. **THIS WEEK:** Clone LightBurn community repo, parse .cuts files
6. **NEXT WEEK:** Epilog PDFs + Reddit API setup
7. **PARALLEL:** During beta calls with Nate/Mike/Sean, ask about Facebook settings posts and .clb files they could share

---

## Appendix: Source Priority Matrix

```
                    HIGH VALUE
                        │
    LaserParams ────────┼──── LightBurn Library
    (multiplier)        │     (OEM quality)
                        │
    OMG Laser ──────────┼──── Epilog PDFs
    (quick win)         │     (OEM quality)
                        │
    Lasertips ──────────┼──── Manufacturer PDFs
    (quick win)         │     (industrial)
                        │
                   LOW EFFORT ──────────────── HIGH EFFORT
                        │
    Reddit ─────────────┼──── Academic Papers
    (medium quality)    │     (excellent but manual)
                        │
    YouTube ────────────┼──── Facebook Groups
    (low priority)      │     (manual only)
                        │
                    LOW VALUE
```

**The sweet spot is top-left: high value, low effort.** That's OMG Laser, Lasertips, LightBurn community, and LaserParams converter logic. Do those first.
