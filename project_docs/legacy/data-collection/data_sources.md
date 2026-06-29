# Laser Cutting Parameters: Public Data Sources

## Research Date
June 12, 2026

## Executive Summary
Identified **8 primary source categories** with estimated **800-1,200+ real-world parameter combinations** across materials, thicknesses, and laser types. Ranked by data quality, quantity, and extractability.

---

## Tier 1: High-Quality, Easily Scraped Sources

### 1. LightBurn Cut Settings Library
**URL:** https://lightburn.com/  
**Direct Data Location:** Built-in library + community-contributed settings files

**Parameters Available:**
- Power (0-100%)
- Speed (mm/s)
- Frequency (kHz)
- Air assist settings
- Material type
- Material thickness
- Laser type (CO2, Diode, Fiber)
- Pass count
- Z-offset

**Data Count Estimate:** 200-400 parameter combinations
- Acrylic (various thicknesses): 20-30 variations
- Wood/plywood (multiple thicknesses): 25-35 variations
- Fabric (cotton, felt, silk): 15-20 variations
- Metal (anodized, bare): 15-20 variations
- Leather: 10-15 variations
- Mylar/plastic: 10-15 variations
- Rubber/cork: 8-12 variations

**Extraction Method:**
- **Automatic (Recommended):** LightBurn exports settings as `.cuts` files (XML-based)
  - Parse via XML parser
  - Extract all material/power/speed combinations
  - Script can recursively harvest public library
- **Location:** Settings stored in user profile directory
  - Windows: `%AppData%\LightBurn\cuts\`
  - Mac: `~/Library/Application Support/LightBurn/cuts/`
  - Linux: `~/.config/LightBurn/cuts/`

**Scrapeability Score:** ⭐⭐⭐⭐⭐ (Machine-parseable XML)
**Reliability:** Very High (manufacturer-validated defaults)

**Access Considerations:**
- Public community library via LightBurn forums
- Some settings open-source in GitHub community repos
- No authentication required for public library access

---

### 2. Epilog Laser Documentation & Forums
**URL:** https://www.epiloglabs.com/  
**Forums:** https://www.epiloglabs.com/pages/forum.php

**Parameters Available:**
- Laser power (%)
- Cutting speed (%)
- Engraving resolution
- Frequency settings (CO2-specific)
- Air assist pressure
- Material specifications (acrylic, wood, leather, etc.)
- Thickness ranges (0.125" - 1/8" to 1/2"+)

**Data Count Estimate:** 150-250 parameter combinations
- Acrylic cutting guide: 20-25 entries
- Wood cutting guide: 25-30 entries
- Rubber stamp material: 10-15 entries
- Leather cutting: 15-20 entries
- Fabric marking: 10-15 entries
- Anodized aluminum: 8-12 entries
- Material-specific forum posts: 50-75 additional user-tested combinations

**Extraction Method:**
- **Semi-Automatic:** HTML table parsing
  - Epilog publishes PDF & web-based material cutting guides
  - Tables contain: Material | Thickness | Power | Speed | Settings
  - PDFs accessible via direct URL pattern
  - Use `pdfplumber` or similar for PDF extraction
  - HTML tables extractable via BeautifulSoup
- **Manual Augmentation:** Forum posts often contain undocumented parameter variations
  - Estimate 30-40% additional data from community posts
  - Searchable by material type

**Scrapeability Score:** ⭐⭐⭐⭐ (Mixed HTML/PDF)
**Reliability:** Very High (OEM documentation)

**Specific URLs to Scrape:**
- Material cutting guides: `/materialcuttingguides/`
- Technical documentation: `/documentation/`
- Forum search: site-specific search by material

---

### 3. Trumpf Laser Reference Guides
**URL:** https://www.trumpf.com/en_US/  
**Direct Resources:** Cutting speed reference tables, material spec sheets

**Parameters Available:**
- Laser power (W)
- Cutting speed (m/min)
- Assist gas type and pressure
- Kerf width
- Material thickness
- Surface finish specifications
- Laser wavelength specifics (fiber: 1.064µm)

**Data Count Estimate:** 100-150 parameter combinations
- Carbon steel (various gauges): 20-25 entries
- Stainless steel: 20-25 entries
- Aluminum: 15-20 entries
- Copper/brass: 10-15 entries
- Tool steel: 8-12 entries

**Extraction Method:**
- **Automatic:** Download PDF spec sheets (typically behind free registration)
  - Tables standardized format: Material | Thickness | Power | Speed | Gas Pressure
  - Pdfplumber or Tabula can extract tables
  - Coordinate scraper to handle registration if needed
- **Limitation:** Industrial focus (likely fiber laser specs, not consumer CO2)
  - Data highly relevant for metal-focused optimization

**Scrapeability Score:** ⭐⭐⭐⭐ (Standardized PDFs)
**Reliability:** Excellent (manufacturer reference standards)

**Caveat:** Primarily fiber laser data; may need separate CO2 laser hunting

---

### 4. Bystronic Cutting Parameter Database
**URL:** https://www.bystronic.com/  
**Resources:** Material recommendation database, technical specifications

**Parameters Available:**
- Fiber laser power ranges
- Cutting speed per material
- Gas assist pressure requirements
- Edge quality classifications
- Thickness optimization

**Data Count Estimate:** 80-120 parameter combinations
- Metal cutting focus (primary offering)
- Multiple material classes standardized

**Extraction Method:**
- **Contact/Manual:** May require technical data sheet request
- Some data published in downloadable guides
- Typical format: structured tables convertible to CSV

**Scrapeability Score:** ⭐⭐⭐ (PDF, possibly gated)
**Reliability:** Very High (OEM specifications)

---

### 5. Amada Reference Cutting Guides
**URL:** https://www.amadaus.com/  
**Resources:** Technical libraries, material cutting guides

**Parameters Available:**
- Laser type and wattage
- Cutting speed (mm/min)
- Assist gas pressure
- Material thickness
- Surface finish notes

**Data Count Estimate:** 60-100 parameter combinations

**Extraction Method:**
- Similar to Trumpf/Bystronic
- Download technical documentation PDFs
- Extract tabular data via standard tools

**Scrapeability Score:** ⭐⭐⭐ (PDF-based)
**Reliability:** Very High (OEM source)

---

## Tier 2: Community-Generated, Moderate Quality

### 6. Reddit Communities (Multiple Subreddits)
**Subreddits to Search:**
- r/LaserCutting (primary) — ~50k members
- r/Maker — laser cutting subset
- r/Metalworking — some fiber laser discussion
- r/Glitch_Art — specific aesthetic techniques
- r/makerspace — community workshop experiences

**Parameters Found:**
- Power percentage (0-100%)
- Speed settings (document units vary: mm/s, %, arbitrary)
- Frequency/pulse settings
- Material and thickness
- Results/quality notes
- Laser model specifics

**Data Count Estimate:** 200-400 parameter combinations
- Posts per material: 10-50 per popular material type
- Quality variability: 30-50% are reproducible, tested parameters
- 50-70% anecdotal or trial-and-error results
- Noise: ~20-30% contain contradictory info (material/laser variation)

**Extraction Method:**
- **Automatic (Recommended):** Reddit API (PRAW library in Python)
  - Search by keywords: "cutting settings", "parameters", "power speed", material names
  - Parse post titles and comments for parameter mentions
  - Regex extraction for power/speed patterns
  - Typical pattern: "100% power, 500 mm/s for 3mm acrylic"
  - Extract metadata: laser type, material, thickness, outcome
- **Rate limiting:** 60 requests/min (manageable for scraping task)
- **Data availability:** Archive goes back ~5+ years

**Scrapeability Score:** ⭐⭐⭐⭐ (Structured API)
**Reliability:** Medium (User-generated, but community-vetted via upvotes)

**Recommended Search Queries:**
```
site:reddit.com/r/LaserCutting "power" "speed"
site:reddit.com/r/LaserCutting acrylic settings
site:reddit.com/r/LaserCutting "cutting settings" [material]
site:reddit.com/r/Maker laser cutting parameters
```

**Data Quality Filtering:**
- Upvote threshold: >10 upvotes (vetted by community)
- Cross-post validation: Same parameter mentioned by 3+ users = likely accurate
- Laser model specificity: Parameters tagged with laser model preferred

---

### 7. YouTube Video Metadata & Descriptions
**Channels to Target:**
- Epilog Laser (official): https://www.youtube.com/c/EpilogLaser
- Glowforge (official): https://www.youtube.com/c/Glowforge
- BOSS Laser: https://www.youtube.com/c/BOSSLaser
- Various maker channels (200+ hours of laser content)

**Parameters in Descriptions/Comments:**
- Power settings (mentioned in video or pinned comments)
- Speed values
- Material and thickness
- Typical range: 50-100 videos with explicit parameters

**Data Count Estimate:** 80-150 parameter combinations
- Official channels (Epilog, Glowforge, BOSS): 30-50 videos with explicit settings
- Community channels: 50-100 videos mentioning parameters

**Extraction Method:**
- **Semi-Automatic:** YouTube API or scraping
  - Extract video descriptions via YouTube API (requires API key)
  - Fetch comments (rate-limited, but doable)
  - Parse descriptions for regex patterns: "power: X%", "speed: Y mm/s"
  - Use video timestamp scraping to match parameters in description to exact footage
- **Alternative (No API):** Website scraping (violates TOS, not recommended)

**Scrapeability Score:** ⭐⭐⭐ (API available, rate-limited)
**Reliability:** Medium-High (depends on video creator credibility)

**Parameter Extraction Patterns:**
- "Power: 80%" or "80% power"
- "Speed: 500 mm/s" or "@500 mm/s"
- "Settings in description"
- Pinned comments often contain tested parameters

---

### 8. Lasertips.org Cutting Guide Database
**URL:** https://www.lasertips.org  
**Content Type:** Material-specific cutting guides, settings libraries

**Parameters Available:**
- Laser type and wattage
- Power percentage
- Speed (as % or mm/s)
- Frequency settings
- Material thickness
- Assist gas recommendations

**Data Count Estimate:** 150-250 parameter combinations
- Materials covered: 20+ different material types
- Thickness variations: 3-5 per material typically
- Multiple guide entries per material

**Extraction Method:**
- **Automatic:** HTML table parsing
  - Site structure: typically `/cutting-guides/[material]/`
  - Tables with consistent format
  - Use BeautifulSoup + CSS selectors
  - Estimated 20-30 material pages to scrape
- **Format:** Usually HTML tables convertible to CSV/JSON

**Scrapeability Score:** ⭐⭐⭐⭐ (HTML-based)
**Reliability:** Medium-High (Community-curated)

---

### 8b. Bonny Creations Laser Settings Database
**URL:** https://www.bonnycreations.com/  
**Content Type:** Community-contributed laser settings database

**Parameters Available:**
- Machine brand and model (59+ machines)
- Material type (118+ materials)
- Power percentage
- Speed (mm/s or %)
- Passes
- Thickness

**Data Count:** 3,800+ parameter combinations (largest community DB identified)
**Business Model:** Revenue from SVG files + Amazon affiliate links (settings DB is free)

**Extraction Method:**
- **Semi-Automatic:** HTML scraping or API inspection
  - Flat database structure, no AI layer
  - Covers 59+ machines across multiple brands
  - 118+ material types with settings per machine

**Scrapeability Score:** ⭐⭐⭐⭐ (Web-based, structured data)
**Reliability:** Medium-High (Community-contributed, large sample size)
**Status:** 🔄 Scraping in progress (2026-06-23)

---

### 8c. LaserCutSettings.com
**URL:** https://www.lasercutsettings.com/  
**Content Type:** Structured laser settings database with .clb download support

**Parameters Available:**
- Machine brand and model (115 machines, 13 brands)
- Material type
- Power, speed, passes
- Supports .clb file download

**Data Count:** 260 settings across 115 machines
**Built By:** LaserJobManager team (related product ecosystem)

**Extraction Method:**
- **Semi-Automatic:** HTML scraping
  - Clean UX with structured data
  - .clb download available (XML-parseable)
  - 13 brand categories

**Scrapeability Score:** ⭐⭐⭐⭐⭐ (Clean structure + .clb files available)
**Reliability:** Medium-High (Curated by software team)
**Status:** 🔄 Scraping in progress (2026-06-23)

---

### 8d. Lasertips.org UV + CO2 Galvo Subdomain
**URL:** https://uv.lasertips.org/  
**Content Type:** UV and CO2 galvo laser settings (separate from main CO2/fiber site)

**Parameters Available:**
- Laser type (UV, CO2 galvo)
- Power, speed, frequency
- Material type
- Q-pulse settings

**Data Count:** 51 entries (UV subdomain) + additional CO2 galvo entries = ~62 total
**Notes:** Zero external discoverability, never promoted. Supplements the 212 entries on main lasertips.org.

**Extraction Method:**
- **Automatic:** HTML table parsing (same structure as main site)

**Scrapeability Score:** ⭐⭐⭐⭐⭐ (Same format as main site, already parsed)
**Reliability:** Medium (Solo operator, small dataset)
**Status:** 🔄 Scraping in progress (2026-06-23)

---

## Tier 3: Specialized/Niche Sources

### 9. GitHub Open-Source Projects
**Repositories:**
- LightBurn configuration repos
- Laser control software (GRBL derivatives)
- Community parameter databases

**Data Count Estimate:** 50-100 parameter combinations
- Community-contributed settings files
- Often include material optimization research

**Extraction Method:** Direct file parsing (JSON, YAML, CSV)

**Scrapeability Score:** ⭐⭐⭐⭐⭐ (Machine-readable formats)
**Reliability:** Medium (Crowdsourced)

---

### 10. Academic/Research Papers (IEEE, ArXiv, ResearchGate)
**Sources:**
- Laser material interaction studies
- Optimization research papers
- Manufacturer research publications

**Data Count Estimate:** 20-50 parameter combinations (high quality)
- Controlled experimental conditions
- Includes energy density calculations
- Material interaction science

**Extraction Method:** Manual extraction from PDFs (contains empirical data tables)

**Scrapeability Score:** ⭐⭐⭐ (PDF, tables require parsing)
**Reliability:** Excellent (Peer-reviewed science)

---

## Data Quality Ranking

| Rank | Source | Data Points | Reliability | Scrapeability | Effort |
|------|--------|------------|-------------|---------------|--------|
| 1 | LightBurn Settings | 200-400 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Low |
| 2 | Epilog Documentation | 150-250 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Low |
| 3 | Trumpf Reference Guides | 100-150 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Low |
| 4 | Bystronic Database | 80-120 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Medium |
| 5 | Amada Guides | 60-100 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Medium |
| 6 | Reddit Communities | 200-400 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Medium |
| 7 | YouTube Descriptions | 80-150 | ⭐⭐⭐ | ⭐⭐⭐ | Medium |
| 8 | Lasertips.org | 150-250 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Low |
| 9 | GitHub Projects | 50-100 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Low |
| 10 | Academic Papers | 20-50 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | High |

---

## Recommended Scraping Approach (Phase-Based)

### Phase 1: High-Confidence, Low-Effort (500-700 parameters)
1. **LightBurn** - Extract `.cuts` XML files directly
2. **Epilog** - Scrape PDF guides and web material pages
3. **Lasertips.org** - HTML table extraction
4. **GitHub** - Clone community repos, parse JSON/YAML

**Estimated Time:** 1-2 weeks  
**Expected Parameters:** 500-700 combinations

### Phase 2: Medium-Effort, High-Yield (200-300 additional parameters)
5. **Reddit** - API scraping with quality filtering
6. **Manufacturer Specs** - Trumpf, Bystronic, Amada PDFs

**Estimated Time:** 1-2 weeks  
**Expected Parameters:** 200-300 combinations

### Phase 3: Specialized (100-150 additional parameters, optional)
7. **YouTube** - Description + comment mining
8. **Academic** - Manual extraction from 5-10 top papers

**Estimated Time:** 1 week  
**Expected Parameters:** 100-150 combinations

---

## Total Data Collection Estimate

**Conservative (Phase 1 only):** 500-700 parameter combinations  
**Mid-range (Phase 1 + Phase 2):** 700-1,000 parameter combinations  
**Comprehensive (All phases):** 900-1,200+ parameter combinations

---

## Critical Parameters to Extract

For each entry, capture:

```json
{
  "id": "unique_identifier",
  "source": "source_name",
  "source_url": "url",
  "material": "acrylic|wood|metal|leather|fabric|etc",
  "material_thickness_mm": 3.0,
  "laser_type": "CO2|Fiber|Diode|Nd:YAG",
  "laser_power_w": 80,
  "cutting_power_percent": 80,
  "cutting_speed_mm_s": 500,
  "cutting_speed_percent": null,
  "frequency_khz": null,
  "pulse_duration_us": null,
  "assist_gas": "air|nitrogen|oxygen|none",
  "assist_gas_pressure_bar": null,
  "passes": 1,
  "z_offset_mm": 0,
  "air_assist_strength": "low|medium|high",
  "kerf_width_mm": null,
  "quality_notes": "clean cut, some charring, fast",
  "reliability_score": 0.85,
  "date_added": "2026-06-12",
  "verified_by": "n_users"
}
```

---

## Extraction Tools Recommended

| Task | Tool | Language | Effort |
|------|------|----------|--------|
| XML parsing (LightBurn) | `xml.etree` | Python | Low |
| PDF extraction | `pdfplumber` or `PyPDF2` | Python | Low |
| HTML scraping | `BeautifulSoup` + `requests` | Python | Low |
| Reddit API | `PRAW` (Python Reddit API Wrapper) | Python | Low |
| YouTube API | `google-api-python-client` | Python | Medium |
| Regex patterns | Built-in | Python/Bash | Low |

---

## Legal/Ethical Considerations

- **LightBurn:** Settings freely redistributable (check license)
- **Manufacturer sites:** Check robots.txt; most allow scraping of public tech docs
- **Reddit:** Allowed under terms of service (rate limits apply)
- **YouTube:** Terms of service restrict scraping; API preferred
- **Academic papers:** Respect copyright; extract data only for research

---

## Success Metrics

- [ ] Collect 500+ unique parameter combinations
- [ ] Represent 15+ material types
- [ ] Cover 5+ laser types (CO2, Fiber, Diode, etc.)
- [ ] Include 8+ thickness ranges (0.5mm - 12mm+)
- [ ] Average reliability score > 0.7
- [ ] Automated extraction for 80%+ of data

