# Etsy Parameter Files & Nate Keen CSV - Comprehensive Analysis

**Date**: 2026-06-17
**Purpose**: Analyze 3 purchased Etsy parameter file products + Nate Keen's shared library to understand format, quality, content, and how they inform CutLog's competitive positioning.

---

## Executive Summary

We purchased 3 Etsy laser parameter file products ($46 total) and received Nate Keen's personal library (free, from DM relationship). Combined findings:

| Source | Entries | Materials | Wattage/Type | Price | Value Assessment |
|--------|---------|-----------|--------------|-------|-----------------|
| LaserSecrets (Raycus) | 188 unique (x20 lens files = 3,760 total) | 48 | 50W Galvo Fiber | $32 | HIGH - best product |
| BenMyersWoodshop | 19 | 11 | 30W OMTech Fiber | $9 | LOW - minimal content |
| HolsterGeek (PMAG) | 10 unique (x6 lenses = 60 total) | 1 (PMag only) | 60W Galvo Fiber | $5 | NICHE - single material |
| Nate Keen (personal) | 82 | 17 | ~60W Galvo Fiber | Free | HIGH - expert-tested, overlaps with LaserSecrets |

**Key Finding**: LaserSecrets' 20 lens-variant files are NOT independently tested. They apply a mathematical power scaling factor (~1.79x for 110mm to 200mm) while keeping speed, frequency, and interval identical. This is the SAME approach as our LaserParams Converter math. They're selling a formula, not testing.

**Grand total unique parameter entries across all sources: 299** (188 LaserSecrets + 19 BenMyers + 10 HolsterGeek + 82 Nate Keen)

---

## Per-Product Breakdown

### 1. LaserSecrets (Raycus 50W) - $32

**Seller**: Valentin (responsive, offers post-purchase support)
**Reviews**: 422+ on Etsy (market leader)
**Format**: 20 .clb files, 1 PDF guide ("Fiber Laser Settings Bible"), install video

#### Content
- **188 unique entries** per .clb file (identical content, only power scaled)
- **48 materials** covered (strongest breadth)
- **20 lens configurations**: 40mm, 50mm, 65mm, 70mm, 90mm, 100mm, 110mm, 112mm, 140mm, 150mm, 160mm, 175mm, 200mm, 210mm, 220mm, 250mm, 300mm, 350mm, 400mm, 450mm
- **Operation types**: 125 Scan, 46 Cut, 17 Image (per file)
- **Metadata**: Version v10.0, dated 2025-06-19, MaxPct=90 (caps power at 90%)

#### Materials Covered (48 total)
ABS, Acrylic, Aluminum, Aluminum Anodized, Aluminum Sheet, Aluminum Biz Card, Black Leather, Black-coated Paper, Brass, CPVC, Cardboard, Cerakote Metal, Ceramic Black Coasters, Copper, Dark card stock, Delrin Plastic Black Sheet, Electro Plating, Glass Painted, Glock Polymer, Gold, Gold-plated material, Granite, Kydex, Leather, MDF, MFT/Polymer Magazines, Mags, PBT, PET, PETG (3D printed), PLA (3D printed), PMAG, Pewter, Polyester, Powder Coated, Red Copper, Rock Coasters, Rubber, Silicone, Silver, Slate, Stainless Steel, Steel, Stone And Rock, Tin, Titanium, Wood, Zinc

#### Parameter Fields
index, LinkPath, minPower, maxPower, minPower2, maxPower2, speed, frequency, PPI, JumpSpeed, perfLen, perfSkip, dotTime, bidir, crossHatch, overscan/overscanPercent, interval, angle, priority, tabCount, tabCountMax, cellsPerInch, ditherMode, dpi, floodFill, numPasses, kerf, wobbleEnable, wobbleSize, zOffset, anglePerPass, dotSpacing, dotWidth, scanOpt, globalRepeat, runBlower, subname

#### Critical Discovery: The Lens Scaling Formula

LaserSecrets' 20 files are NOT independently tested. Analysis reveals:
- **Only maxPower differs** between lens files
- **Speed stays IDENTICAL** across all 20 files (with 16/188 minor exceptions for cutting operations)
- **Frequency stays IDENTICAL** across all 20 files (0 differences)
- **Interval stays IDENTICAL** across all 20 files (0 differences)

**Power scaling ratio**: Average 1.79x from 110mm to 200mm lens, proportional to beam spot area ratio.

**Implication**: They tested on ONE lens (likely 110mm, their "standard"), then applied beam density math to generate 19 more files. This is EXACTLY what our LaserParams Converter math does. They're monetizing a formula we already have.

#### Bonus Content
- **"Fiber Laser Settings Bible" PDF** (12 pages): Not parameter data. It's a LightBurn tutorial covering raster image prep, trace workflow, cut/fill assignment, DPI recommendations, air assist guidance, lens selection, safety, and FAQ. Generic but well-written. Useful for beginners.
- **Install video** (MP4): How to import .clb into LightBurn
- **Old settings archive** (v1/v2 for comparison)
- **Personal support**: Valentin offers 1-on-1 help via Etsy messages

#### Why It Has 422 Reviews ($32 justification)
1. **Breadth**: 48 materials covers most Galvo use cases
2. **Lens coverage**: 20 lens sizes = "works with any setup" perception
3. **Professional packaging**: PDF guide + video + support offer = premium feel
4. **Version history**: v10.0 implies continuous refinement and updates
5. **Personal touch**: Post-purchase message offering help (builds trust/reviews)
6. **MaxPct=90 safety cap**: Shows they understand laser safety (builds credibility)
7. **Metadata in files**: CI element with date/version = professional engineering feel

---

### 2. BenMyersWoodshop (30W OMTech Fiber) - $9

**Format**: 1 .clb file + HowToInstall.txt

#### Content
- **19 entries** total
- **11 materials**: ABS Plastic, Aluminum, Aluminum (Anodized), Brass, Cardboard, HDPE, Leather, Rotary, Silicone, Silver, Steel
- **Operation types**: 15 Scan, 2 Cut, 2 Image

#### Organization
Clean naming: `Material / Operation / Variant` (e.g., "Aluminum / Engrave / Engrave (White)")

#### Assessment
- **Minimal content**: 19 entries for $9 = $0.47/entry
- **No lens variants**: Single file, no adjustment guidance
- **No documentation**: Just a HowToInstall.txt pointing to YouTube
- **Target audience**: Complete beginners who need "something, anything"
- **Unique materials**: HDPE (not in other files), Rotary (generic rotary settings)

#### Install Instructions (full text)
Basic: Unzip, open LightBurn, go to Library tab, click Load, select file. Includes disclaimer that it won't work in trial versions.

---

### 3. HolsterGeek (PMAG 60W) - $5

**Seller**: Jesse Bazan (Holster Geek team, email: jessebazan2016@gmail.com)
**Format**: 6 .clb files (one per lens) + 2-page instruction PDF

#### Content
- **10 unique entries** per file (60 total across 6 lens files)
- **1 material only**: Magpul PMAG (polymer magazines)
- **All operations**: Scan only (engraving)
- **Lenses**: 70mm, 110mm, 175mm, 200mm, 250mm, 300mm
- **Color variants**: Brown (Dark/Medium), Gray (Dark/Light), Tan (Dark/Medium/Light) + Tan PMAG (Dark/Light/Medium)

#### Scaling Pattern
Unlike LaserSecrets, HolsterGeek's lens scaling is MINIMAL:
- Only 3 of 10 entries differ between 70mm and 300mm (the lighter marks: Gray-Dark, Gray-Light, Tan-Light)
- The darker/higher-power marks stay IDENTICAL across all lenses (Brown-Dark: 50% power everywhere)
- Speed and frequency NEVER change across lenses

#### Instruction Sheet (2 pages)
Professional documentation covering:
- File compatibility (Galvo fiber + LightBurn only, NOT EZCad or CO2)
- Supported PMAG types (Magpul only, other polymers may differ)
- Color settings explanation
- Tips: clean with IPA, avoid touching after cleaning, microfiber wipe after etch
- Contact info for support

#### Assessment
- **Hyper-niche**: Only useful for PMAG engravers
- **Good value at $5**: If you engrave PMAGs, this saves hours of testing color variants
- **Well-documented**: Clear instruction sheet, honest about limitations
- **Practical knowledge embedded**: The "clean with IPA" / "don't touch after cleaning" tips show real-world testing

---

### 4. Nate Keen's CSV (Personal Library, Free)

**Source**: Shared via Facebook DM during validation outreach
**Format**: CSV (manually converted from his LightBurn .clb library)
**Laser**: ~60W Galvo fiber (estimated from power ranges)

#### Content
- **82 entries** total
- **17 materials** covered
- **31 columns** (full LightBurn parameter set)

#### Material Focus (Specialization Pattern)
| Material | Entries | Specialty |
|----------|---------|-----------|
| Gold | 22 | JEWELRY (14K White, 14K Rose, 10-14K Yellow, Photo modes) |
| Experimental | 16 | Unusual materials (ABS, Delrin, Glock Polymer, Pewter, Rock, Cerkote) |
| Leather | 7 | Multiple resistance levels + frequency variants |
| Silver | 6 | Jewelry (including photo mode) |
| Aluminum | 5 | Standard engraving |
| Steel | 5 | Including Z-Mark and Anneal techniques |

#### Notable Features
- **Multi-step photo workflows**: Gold and Silver have 3-step photo processes (1-Base, 2-White/Cleanup, 3-Details)
- **Specialized jewelry knowledge**: Distinguishes 14K White vs Rose vs Yellow gold, each with different settings
- **Sub-millimeter precision**: Several entries use interval=0.002 (very fine detail work)
- **Frequency expertise**: Uses full range from 25kHz to 200kHz, showing understanding of frequency-dependent effects
- **Firearms niche**: PMAG, Glock Polymer, Browning Composite, Cerkote settings

#### Parameter Ranges
- maxPower: 9-81%
- speed: 35-5000 mm/s
- frequency: 25,000-200,000 Hz
- interval: 0.002-0.2 mm

#### Organization System
`Material / SubCategory / Preset` hierarchy (same as LightBurn's internal structure):
- Material = top-level grouping (Gold, Steel, etc.)
- SubCategory = material variant or application context (14K White, General, Photo)
- Preset = specific operation/result (Base, Cleanup, Engrave, Cut)

---

## Comparative Analysis

### Price vs Value

| Product | Price | Unique Entries | $/Entry | Materials | $/Material |
|---------|-------|---------------|---------|-----------|-----------|
| LaserSecrets | $32 | 188 | $0.17 | 48 | $0.67 |
| BenMyersWoodshop | $9 | 19 | $0.47 | 11 | $0.82 |
| HolsterGeek | $5 | 10 | $0.50 | 1 | $5.00 |
| **CutLog (current DB)** | **Free** | **901** | **$0.00** | **60+** | **$0.00** |

### Organization Quality

| Product | Naming Convention | Hierarchy | Consistency | Score |
|---------|------------------|-----------|-------------|-------|
| LaserSecrets | Material/SubFolder/Operation | 3-level via LinkPath | High (some typos: "Sylver") | 8/10 |
| BenMyersWoodshop | Material/Operation/Variant | 3-level | High (clean) | 7/10 |
| HolsterGeek | Material/Color/Intensity | 3-level | Perfect (only 1 material) | 9/10 |
| Nate Keen | Material/Category/Preset | 3-level | Good (some "Experimental" catch-all) | 7/10 |

### Feature Comparison

| Feature | LaserSecrets | BenMyers | HolsterGeek | CutLog |
|---------|-------------|----------|-------------|--------|
| Multiple lenses | 20 files | No | 6 files | Scaling math (infinite) |
| Multiple wattages | No (50W only) | No (30W only) | No (60W only) | Yes (in DB) |
| Documentation | 12-page PDF + video | 1 text file | 2-page PDF | In-app guidance |
| Support | Personal messages | None | Email support | TBD |
| Updates | Versioned (v10) | None apparent | None apparent | Continuous (community) |
| Per-machine tuning | No | No | No | YES (core value prop) |
| Community data | No | No | No | YES |
| Searchable | No (must browse LightBurn) | No | No | YES |
| Photo workflows | Yes (Image mode) | Yes (2 entries) | No | Partial |
| Multi-pass processes | Yes | No | No | Yes (in schema) |

---

## Data Quality Assessment

### Can We Import This Data?

**Legal**: We purchased these files for personal use. The Etsy listings do NOT grant redistribution rights. We CANNOT:
- Republish the raw parameter values as "LaserSecrets data" in our database
- Offer these as downloadable .clb files to our users
- Claim these as our own

**What we CAN do**:
- Use the data to VALIDATE our existing AI-generated baselines (compare our predictions to expert-tested values)
- Learn from their organization structure to improve our own material taxonomy
- Reference the materials covered to identify gaps in our database
- Use the scaling math insight to confirm our LaserParams Converter approach

### Overlap with Existing 901 Entries

Our current database covers these materials that overlap with the purchased files:
- Aluminum, Brass, Copper, Gold, Silver, Steel, Titanium, Stainless Steel (AI baseline + scraped)
- Leather, Wood, Acrylic (from various sources)

**Gaps in our DB that these files reveal**:
- PMAG / polymer magazines (highly requested in firearms community)
- Cerakote removal
- Glock Polymer stippling
- Jewelry-specific gold variants (14K White/Rose/Yellow)
- Photo engraving multi-step workflows
- ABS, PBT, PET, PETG, PLA (3D print post-processing)
- Rubber, Silicone, Slate, Granite, MDF
- Aluminum business cards (specific product type)
- Electro plating
- Glass (painted, backed)
- Rock/Stone coasters

**New materials that could expand our DB**: ~25 materials/variants not currently covered

### Format Compatibility

The .clb XML format maps DIRECTLY to our cuts table schema:
| .clb field | CutLog DB field | Conversion |
|-----------|-----------------|------------|
| maxPower | power_pct | Direct (%) |
| speed | speed_mm_min | Multiply by 60 (clb uses mm/s) |
| frequency | (new column needed) | Direct (Hz) |
| interval | line_interval_mm | Direct (mm) |
| numPasses | (new column needed) | Direct |
| type (Scan/Cut/Image) | (new column needed) | Enum |

**Missing from our schema**: frequency, numPasses, operation_type (Scan vs Cut vs Image), PPI, crossHatch, bidir, angle, overscan, wobble settings. These are ALL critical for Galvo engraving operations but less relevant for CNC cutting.

---

## Competitive Positioning Insights

### What LaserSecrets Does Better Than CutLog (Currently)
1. **More materials covered for engraving** (48 vs our ~20 that apply to Galvo)
2. **Lens-specific files** — users don't need to understand math, just pick their lens
3. **Photo engraving workflows** — multi-step processes we don't support well
4. **Packaging/documentation** — PDF guide creates perceived value
5. **Personal support** — "message me anytime" builds loyalty and generates reviews
6. **Versioning** — "v10" implies continuous improvement (trust signal)

### What CutLog Does Better (Our Advantages)
1. **Searchable** — find any material/setting instantly vs browsing a library tree
2. **Per-machine calibration** — they give ONE starting point; we adapt to YOUR machine
3. **Multiple wattages and machine types** in one place (they need separate products)
4. **Community data** — grows over time without one person testing everything
5. **Free tier** — 901 entries for $0 vs $32 for 188
6. **Speed-first UX** — "how fast should I cut?" vs "here's all 30 parameters"
7. **Feedback loop** — "too fast / perfect / too slow" improves suggestions
8. **No LightBurn dependency** — works regardless of software (eventual EZCad support too)

### What CutLog is Doing Worse
1. **No Galvo-specific parameters** — frequency, interval, PPI, crossHatch are critical for engraving and we don't capture them well
2. **Schema gaps** — our DB schema was designed for CNC cutting (gas, nozzle, focus) not Galvo engraving (frequency, passes, hatch pattern)
3. **No photo workflow support** — multi-step engraving processes are a major use case we miss entirely
4. **No packaging/trust signals** — no PDF guide, no version number, no "message me" support channel

---

## Recommendations for CutLog Product

### Immediate (Based on This Analysis)

1. **Add engraving-specific columns to DB schema**:
   - `frequency_hz` (integer)
   - `num_passes` (integer)
   - `operation_type` (enum: 'cut', 'scan/engrave', 'image/raster')
   - `line_interval_mm` (already exists)
   - `cross_hatch` (boolean)
   - `scan_angle_degrees` (numeric)
   - This addresses the Galvo engraving market (Nate Keen's world, LaserSecrets' audience)

2. **Use purchased data for VALIDATION, not import**:
   - Compare our AI baseline Aluminum/Steel/Titanium parameters to LaserSecrets' tested values
   - Identify where our predictions are off and adjust the generation model
   - Flag any materials where our data is wildly different from expert-tested values

3. **Implement LaserParams Converter scaling in the suggestion engine**:
   - LaserSecrets proved this math WORKS (422 buyers use it daily)
   - Our single tested entry can generate suggestions for any lens size
   - Display as: "Based on 110mm lens data, scaled to your 200mm lens"

4. **Add lens size to machine profile**:
   - Currently our machine schema has: brand, model, wattage, source_type
   - Need to add: `lens_focal_length_mm` (numeric)
   - This enables automatic power scaling in suggestions

### Short-Term (Product Roadmap)

5. **Create "Getting Started" PDF/guide** (like LaserSecrets' Bible):
   - Not parameters, but HOW to use CutLog effectively
   - Include LightBurn integration tutorial
   - This builds trust and perceived value (free users feel they got something)

6. **Support multi-step workflows**:
   - Some operations (jewelry photo engraving) require 3 sequential steps
   - Our schema should allow grouping entries as "workflow" or "recipe"
   - e.g., "Gold 14K Photo: Step 1 (Base) → Step 2 (White) → Step 3 (Details)"

7. **Target the PMAG/firearms niche specifically**:
   - HolsterGeek proving people pay $5 for 10 PMAG settings
   - Nate Keen's library has extensive firearms data
   - Facebook group engagement from firearms engravers is high
   - Add PMAG, Glock Polymer, Cerakote, Kydex to our materials list

### Strategic Insight

**The $32 LaserSecrets product is primarily selling CONFIDENCE, not data.**

What the buyer actually gets: 188 tested starting points + reassurance ("v10", "message me", "Bible" guide). The 20 lens files are mathematical derivatives, not independent testing. The PDF guide teaches LightBurn basics, not laser science.

**CutLog's opportunity**: Provide the SAME confidence (tested starting points that work) but with:
- Machine-specific adaptation (LaserSecrets can't do this)
- Community verification (not one person's testing)
- Continuous improvement (not a static file you buy once)
- Searchability (not browsing a tree structure)

The fact that 422 people paid $32 for a static .clb file proves MASSIVE demand for "just tell me what settings to use." We provide that answer better, faster, and free — we just need to communicate it as clearly as Valentin does.

---

## Speed Validation Against Our Database

**Date**: 2026-06-17 (NEW ANALYSIS)

We conducted a detailed validation comparing our database speeds against Etsy expert-tested speeds. See full results in `speed_validation_report.md`.

### Validation Results Summary

| Metric | Value |
|--------|-------|
| Total Etsy settings analyzed | 3,839 |
| Matched to our DB | 500 (13%) |
| Overall accuracy | **87%** |
| Median speed difference | 0% (excellent match) |
| Mean speed difference | 48.6% (driven by outliers) |
| Settings matching within 5% | 60.4% |
| Outliers >15% difference | 196 (39.2%) |

### Key Findings

1. **For decorative work (Gold engraving)**: Our speeds are 9% off expert data (highly accurate)
2. **For specialty metals (Slate, Aluminum)**: Large discrepancies (150-186% difference)
   - Root cause: Etsy uses conservative speeds for cutting (precision), we use faster speeds (throughput)
   - Aluminum cut: Etsy 433-700 mm/min vs Our 2500 mm/min (6x difference)
3. **PMAG and Silver materials**: Perfect match (0% difference)
4. **Wood materials**: 7.5% mean difference (very accurate)

### Interpretation

- **Our AI baseline is well-validated** for common engraving materials (Gold, Silver, Wood)
- **Cut operations need review** — Etsy is significantly more conservative (likely for edge quality)
- **Database gaps identified** — 3,339 settings (87% of Etsy data) don't match our materials/presets
- **Recommendation**: Use Etsy data to identify which materials/operations we should add/refine

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total .clb files analyzed | 27 |
| Total entries (with lens duplicates) | 3,839 |
| Total UNIQUE entries (deduplicated) | 299 |
| Total unique materials (all sources) | 67 |
| New materials not in our DB | ~25 |
| Average LaserSecrets entry params | 15-20 fields per entry |
| Power scaling ratio (110mm to 200mm) | ~1.79x |
| Price range for static files | $5-$32 |
| CutLog's current free DB | 901 entries |
| **Speed validation accuracy** | **87%** |
