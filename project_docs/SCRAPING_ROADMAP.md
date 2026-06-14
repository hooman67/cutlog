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

