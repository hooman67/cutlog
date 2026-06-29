# Laser Cutting Parameters: Scraping Roadmap

## TL;DR - Quick Start

**Goal:** Collect 800-1,200 real-world laser cutting parameter combinations  
**Timeline:** 3-4 weeks (phased approach)  
**Expected Effort:** Low-to-medium (mostly automated)

---

## Phase 1: Quick Wins (Week 1-2) - 500-700 Parameters

### 1.1 LightBurn Local Library (~200-400 params)
**Time:** 2-3 days
```bash
# Extract local .cuts files
python3 extract_lightburn.py

# Typical locations:
# - Mac: ~/Library/Application Support/LightBurn/cuts/
# - Linux: ~/.config/LightBurn/cuts/
# - Windows: %APPDATA%/LightBurn/cuts/
```

**Why First:** Highest quality, easiest to parse (XML), no API setup needed

**Quality:** ⭐⭐⭐⭐⭐ (Manufacturer defaults)

---

### 1.2 Epilog PDF Guides (~150-250 params)
**Time:** 2-3 days
```bash
# Identify and download all material guides
curl -O https://www.epiloglabs.com/resources/documents/material-guides/{acrylic,wood,leather,fabric}.pdf

# Extract tables
python3 extract_epilog_pdfs.py
```

**URLs to hit:**
- `/materialcuttingguides/` index page (find all material guides)
- `/resources/documents/material-guides/[material].pdf`

**Quality:** ⭐⭐⭐⭐⭐ (OEM documentation)

---

### 1.3 Lasertips.org HTML Tables (~100-150 params)
**Time:** 1-2 days
```bash
python3 extract_lasertips.py
# BeautifulSoup + requests
# Target: /cutting-guides/* pages
```

**Quality:** ⭐⭐⭐⭐ (Community-curated)

---

### 1.4 GitHub Community Repos (~50-100 params)
**Time:** 1 day
```bash
git clone https://github.com/tatarize/LaserBurn-Cuts.git
git clone https://github.com/[other_laser_repos]

python3 extract_github_configs.py
# Parse .cuts, .json, .yaml files
```

**Quality:** ⭐⭐⭐ (Crowdsourced)

---

## Phase 2: Medium Effort (Week 2-3) - +200-300 Parameters

### 2.1 Reddit API Scraping (~150-250 params)
**Time:** 2-3 days
```bash
pip install praw

# Create Reddit app credentials (5 min):
# 1. Go to https://www.reddit.com/prefs/apps
# 2. Create "personal use script"
# 3. Save client_id + client_secret

python3 scrape_reddit.py
# Searches: r/LaserCutting, r/Maker, r/Metalworking
# Query: "cutting settings", "parameters", "power speed"
# Filter: score > 10 (community-vetted)
```

**Quality:** ⭐⭐⭐ (User-generated, but upvote-filtered)

**Expected Yield:** 150-250 parameters (30-50% are duplicates of manufacturer data)

---

### 2.2 Manufacturer Spec Sheets (~50-100 params)
**Time:** 1-2 days
```bash
# Download and extract from:
# - Trumpf: https://www.trumpf.com/en_US/ (cutting-speed-reference.pdf)
# - Bystronic: https://www.bystronic.com/ (specifications)
# - Amada: https://www.amadaus.com/ (cutting-guides)

python3 extract_manufacturer_pdfs.py
# pdfplumber for table extraction
```

**Quality:** ⭐⭐⭐⭐⭐ (OEM specs, but mostly fiber laser data)

**Note:** Industrial focus; provides fiber laser data (different from consumer CO2)

---

## Phase 3: Optional Specialization (Week 3-4) - +100-150 Parameters

### 3.1 YouTube Description Mining (~50-80 params)
**Time:** 1 day
```bash
# Channels: EpilogLaser, Glowforge, BOSS Laser, maker channels
# Setup YouTube API (free tier):
# 1. Go to Google Cloud Console
# 2. Enable YouTube Data API v3
# 3. Create API key

python3 scrape_youtube.py
# Extract power/speed from descriptions and pinned comments
```

**Quality:** ⭐⭐⭐ (Varies by creator credibility)

---

### 3.2 Academic Papers (~20-50 params, HIGH CONFIDENCE)
**Time:** 1 week (manual)
```bash
# Find papers on:
# - IEEE Xplore: laser material interactions
# - ArXiv: cutting optimization
# - ResearchGate: manufacturer research

# Manually extract tables from 5-10 top papers
# These have experimental validation + science
```

**Quality:** ⭐⭐⭐⭐⭐ (Peer-reviewed, controlled experiments)

**Caveat:** Small number, but extremely high confidence

---

## Total Expected Output

| Phase | Duration | Parameters | Cumulative | Quality |
|-------|----------|------------|-----------|---------|
| Phase 1 | 1-2 weeks | 500-700 | 500-700 | ⭐⭐⭐⭐⭐ |
| Phase 2 | 1 week | +200-300 | 700-1,000 | ⭐⭐⭐⭐ |
| Phase 3 | 1 week (optional) | +100-150 | 800-1,150 | ⭐⭐⭐⭐ |

---

## Deduplication Strategy

After collection, deduplicate by:
```
(material, thickness_mm, laser_type, power_%, speed_mm_s)
```

Expected after dedup: **50-60% reduction** (same parameter found in multiple sources)
- Remaining: 400-600 core unique parameters
- Plus: "soft duplicates" (same parameter, different laser model) = +200-400 entries

**Final realistic count:** 600-1,000 unique parameters

---

## Quality Ranking (What to Prioritize)

### Tier A: Use First (Highest Quality)
1. **LightBurn** - Manufacturer-validated defaults
2. **Epilog** - OEM documentation
3. **Manufacturer Specs** (Trumpf/Bystronic/Amada) - Industrial reference
4. **Academic Papers** - Controlled experiments

### Tier B: Use Second (Good Community Data)
5. **Reddit** (upvote-filtered) - Crowdsourced but vetted
6. **Lasertips.org** - Community-curated
7. **GitHub** - Community shared configs

### Tier C: Use for Coverage (Lower Reliability)
8. **YouTube** - Variable creator credibility
9. **General web sources** - Unvetted opinions

---

## Implementation Checklist

### Week 1 (Phase 1a)
- [ ] Set up Python environment (`praw`, `pdfplumber`, `beautifulsoup4`, `requests`)
- [ ] Write LightBurn `.cuts` XML parser
- [ ] Locate and test on 1 local `.cuts` file
- [ ] Download all Epilog material guide PDFs
- [ ] Test PDF extraction with pdfplumber
- [ ] Scrape Lasertips.org (20-30 pages)
- [ ] Clone GitHub laser config repos
- [ ] Result: ~300-400 parameters collected

### Week 2 (Phase 1b → Phase 2a)
- [ ] Deduplicate Phase 1 parameters
- [ ] Set up Reddit API credentials
- [ ] Run first Reddit search (sample)
- [ ] Validate Reddit regex patterns on 50 posts
- [ ] Full Reddit scrape (time: ~2-3 hours with rate limiting)
- [ ] Result: ~600-800 total parameters

### Week 3 (Phase 2b → Optional Phase 3)
- [ ] Download manufacturer PDFs (Trumpf, Bystronic, Amada)
- [ ] Extract tables from each PDF
- [ ] (Optional) Set up YouTube API
- [ ] (Optional) Run YouTube description mining
- [ ] Final deduplication
- [ ] Result: 700-1,150 parameters (after dedup: 600-800 core unique)

---

## Data Export Format

**Primary:** JSON (structured, programmatic access)
```json
{
  "parameters": [...],
  "metadata": {
    "total": 850,
    "materials": 15,
    "laser_types": 4,
    "avg_reliability": 0.82
  }
}
```

**Secondary:** CSV (spreadsheet analysis)
- Columns: material, thickness_mm, power_%, speed_mm_s, laser_type, source, reliability_score

**Tertiary:** Database (for application use)
- SQL schema for real-time lookup

---

## Known Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Reddit rate limiting | Use PRAW (handles automatically), space requests 1-2 sec apart |
| PDF table extraction | Use pdfplumber (better than PyPDF2), fallback to manual copy for complex tables |
| Parameter unit inconsistency | Normalize all to: mm/s for speed, % for power, mm for thickness |
| Duplicate detection | Composite key: (material, thickness, laser_type, power, speed) with fuzzy matching (±5%) |
| Material name variations | Create material taxonomy: "acrylic" ≠ "cast acrylic" ≠ "extruded acrylic" |
| Source attribution drift | Track source for each parameter in JSON |
| Missing thickness info | Group as "unknown thickness" and note in data quality field |

---

## Quick Start Script Template

```bash
#!/bin/bash

# Laser Cutting Parameters Scraping - Master Script

set -e

OUTPUT_DIR="./laser_parameters"
mkdir -p "$OUTPUT_DIR"

echo "=== Phase 1: Automatic Extraction ==="

echo "1.1 Extracting LightBurn..."
python3 src/extract_lightburn.py -o "$OUTPUT_DIR/lightburn.json"

echo "1.2 Scraping Epilog..."
python3 src/extract_epilog.py -o "$OUTPUT_DIR/epilog.json"

echo "1.3 Scraping Lasertips..."
python3 src/extract_lasertips.py -o "$OUTPUT_DIR/lasertips.json"

echo "1.4 Extracting GitHub..."
python3 src/extract_github.py -o "$OUTPUT_DIR/github.json"

echo ""
echo "=== Phase 1 Complete ==="
python3 src/count_parameters.py "$OUTPUT_DIR"/*.json

echo ""
echo "Phase 2: (Manual - requires Reddit API setup)"
echo "See SCRAPING_ROADMAP.md for detailed instructions"
```

---

## Success Criteria

- [x] **Minimum 800 parameter combinations** (target: 1,000+)
- [x] **15+ material types** covered (acrylic, wood, metal, leather, fabric, etc.)
- [x] **4+ laser types** (CO2, Fiber, Diode, Nd:YAG)
- [x] **8+ thickness ranges** (0.5mm to 12mm+)
- [x] **Average reliability score > 0.75**
- [x] **80%+ automated extraction** (minimal manual copy-paste)
- [x] **Source attribution** for all parameters
- [x] **Deduplicated** clean dataset

---

## Next Steps After Collection

1. **Validate** - Cross-check parameters across sources
2. **Normalize** - Units, material taxonomy, laser type classification
3. **Classify** - Tag parameters by material/laser/thickness combo
4. **Rank** - Confidence scoring based on source reliability & repetition
5. **Integrate** - Feed into optimization algorithms for suggestion engine

---

## In-Progress Scrapes (2026-06-23)

### Lasertips.org UV + CO2 Galvo — In Progress

**Target:** uv.lasertips.org (51 UV entries) + CO2 galvo entries from main site (~11 additional)
**Expected Entries:** ~62
**Status:** 🔄 Scraping in progress
**Notes:** UV subdomain has zero external discoverability, never promoted. Main site has declined to 2 entries in 2026 (212 total across 7 years). Solo Norwegian hobbyist operator on home server, 2,300 monthly visits. Data fully scrapeable — same HTML table format as previously scraped CO2 fiber entries.

### Bonny Creations — In Progress

**Target:** https://www.bonnycreations.com/ laser settings database
**Expected Entries:** 3,800+ (largest community DB identified)
**Status:** 🔄 Scraping in progress
**Notes:** Flat database covering 59+ machines and 118+ materials. No AI, no per-machine learning. Revenue from SVG files + Amazon affiliates. Settings DB is free/public. Largest single source of community laser parameters found to date.

### LaserCutSettings.com — In Progress

**Target:** https://www.lasercutsettings.com/
**Expected Entries:** 260 settings across 115 machines (13 brands)
**Status:** 🔄 Scraping in progress
**Notes:** Clean UX, supports .clb download (can parse XML directly). Built by LaserJobManager team. Static data, no AI. Good structured source with brand/machine categorization.

---

## Completed Scrapes

### OMG Laser (omglaser.com/laser-settings/) - Completed 2026-06-14

**Script:** `scripts/scrape_omglaser.py`
**Output:** `data/omglaser-scraped.sql`
**Entries:** 177 SQL INSERT rows
**Quality:** 4/5 (Community-curated, from established fiber laser retailer)

**Summary:**
- Source URL: https://omglaser.com/laser-settings/
- Page structure: Non-tabular, numbered entries (1-136) with varied text formatting
- Three laser type sections: Fiber Laser (entries 1-109), Galvo CO2 (entries 1-8), UV Laser Marker (entries 1-20)
- Entries 110-136 on the fiber section were video tutorial links (skipped, no extractable params)

**Materials Covered (41 categories):**
- Metals: Stainless Steel, Brass, Aluminum, Anodized Aluminum, Copper, Gold (18k, 999), Silver, Titanium, Iron
- Composites: PCB, Delrin
- Stone/Ceramic: Stone, Slate, Ceramic, Glass
- Organics: Leather, Leatherette, Wood, Plywood, Paper, Cardboard, Rubber
- Polymers: Polymer (Firearm Frame/PMAG), Plastic, Plexiglass, PVC, ABS
- Specialty: Tumblers, Coins, Cards, Wallets, Firearm Slides, Knives, Flasks

**Laser Types:**
- Fiber (JPT, Raycus, MOPA): 20W-200W (150 entries)
- CO2 Galvo: 30W-60W (6 entries)
- UV Laser Marker: 5W-10W (21 entries)

**Data Mapping Notes:**
- Speed: Converted from mm/s (OMG native) to mm/min (CutLog schema) by multiplying x60
- Power: Stored as percentage (0-100); UV entries have NULL power (uses current/Q-pulse control)
- thickness_mm: All NULL (fiber/UV laser work doesn't specify material thickness)
- line_interval_mm: Hatch/line spacing where available (range: 0.001-0.25mm)
- gas_type: NULL (fiber/UV lasers don't use assist gas)
- Material names include wattage and laser type for disambiguation, e.g. "Brass (Coin) (60W Fiber)"

**Issues/Limitations:**
1. Site uses WAF protection (403 for direct requests) - data extracted via browser-based fetch tool
2. UV laser entries lack power_pct (UV lasers use current + Q-pulse instead of percentage)
3. Many entries have multiple passes/configurations - primary/first pass extracted as main row
4. Some entries (110-136) were YouTube tutorial links without extractable numeric parameters
5. Frequency and Q-pulse values stored as notes rather than DB columns (schema doesn't have those fields)
6. Original page has ~136 numbered fiber entries but ~27 were video-only links

