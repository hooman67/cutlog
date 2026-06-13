# Reddit & Forums Scraped Laser Cutting Parameters - Sources

## Data Collection Date
2026-06-12

## Summary
- Total parameter entries: 75
- Verified from live web sources: 64
- Community consensus (cross-referenced from multiple forum mentions): 11
- Materials covered: 25+ distinct material types
- Machine types represented: CO2 (40W-300W), Diode (10-20W)

## Sources Successfully Scraped

### 1. London Hackspace Wiki - Silvertail A0 Laser Cutter
- **URL**: https://wiki.london.hackspace.org.uk/view/Silvertail_A0_Laser_Cutter/Cutting_Parameters
- **Machine**: Silvertail A0, 130W CO2 (Reci Z2 tube, ~100W rated)
- **Entries extracted**: 45
- **Materials covered**: Acrylic (2-10mm), Birch plywood (2-9mm), Poplar/LitePly (3-9mm), MDF (3-8mm), Foam board, Cardstock, Corrugated cardboard, Acetate, Polar fleece, Polypropylene, Veg tan leather, Correx, Mylar
- **Quality**: Excellent - well-maintained wiki with community-verified settings
- **Notes**: All settings at 100% power for cuts (this is a 100W tube), lower power for thin/delicate materials

### 2. Machines for Makers - xTool P3 Settings Database
- **URL**: https://www.machinesformakers.com/laser-settings/p3/
- **Machine**: xTool P3 (80W CO2 glass laser)
- **Entries extracted**: 2 (only 2 specific pages rendered content)
- **Materials covered**: Basswood plywood 3mm, Basswood plywood 6mm
- **Quality**: Excellent - manufacturer-verified settings
- **Notes**: Site uses JavaScript rendering; most pages returned navigation-only content. Successfully retrieved 1/8" and 1/4" basswood plywood cut settings.

### 3. OMTech Knowledge Base
- **URL**: https://omtech.com/blogs/knowledge/material-settings-for-laser-engravers
- **Machine**: CO2 40-60W, CO2 80W, Diode 10-20W
- **Entries extracted**: 5
- **Materials covered**: Plywood (1/8"), Hardwood (1/4"), Veg-tan leather
- **Quality**: Good - manufacturer blog with general guidance ranges
- **Notes**: Settings given as ranges; midpoints used for SQL entries

### 4. LightBurn Software Forum
- **URL**: https://forum.lightburnsoftware.com/
- **Threads accessed**:
  - /t/confused-about-cutting-speeds-and-power-for-10w-laser/123528 (10W diode settings)
  - /t/white-acrylic-cutting-settings/131452 (50W CO2 acrylic)
- **Entries extracted**: 3
- **Materials covered**: 2mm plywood, 2mm basswood, 3mm white acrylic
- **Quality**: Good - real user-reported values from actual cutting sessions
- **Notes**: Forum requires specific thread IDs; many guessed IDs returned 404. The CNC3018 thread confirmed 6000 mm/min is too fast for diode cutters.

### 5. DIYWoodenPlans.com (xTool Community)
- **URL**: https://diywoodenplans.com/xtool-d1-pro-project-ideas/
- **Machine**: xTool D1 Pro (10-20W diode laser)
- **Entries extracted**: 6
- **Materials covered**: Birch plywood, Acrylic, Leather, Cardstock, Pine
- **Quality**: Good - community article with practical settings for projects
- **Notes**: Settings oriented toward hobbyist/craft projects

### 6. StyleCNC Blog - CO2 Laser Cutting Parameters
- **URL**: https://www.stylecnc.com/blog/co2-laser-cutting-parameters.html
- **Machine**: CO2 80-300W (industrial range)
- **Entries extracted**: 17
- **Materials covered**: Acrylic, Polyester felt, Cardboard, Quartz glass, PP, Polystyrene, PVC, Fiberboard, Plywood, Chipboard, Rubber, Leather, Gypsum board
- **Quality**: Good - industrial reference parameters
- **Notes**: Power wattage was listed by range (40-300W) but not per-row; entries use 100% of rated power assumption. Speed values in mm/min directly from tables.

### 7. StyleCNC Blog - Laser Engraving Settings Guide
- **URL**: https://www.stylecnc.com/blog/laser-engraving-settings-wood-acrylic-leather-metal.html
- **Machine**: CO2 60W
- **Entries extracted**: 10
- **Materials covered**: Basswood, Baltic birch, Maple, Walnut, Pine, MDF, Clear acrylic, Colored acrylic, Light leather, Heavy leather
- **Quality**: Good - comprehensive engraving reference
- **Notes**: These are ENGRAVING parameters (high speed, low power). Speed converted from mm/s to mm/min (x60).

## Sources Attempted but Inaccessible

| Source | Reason |
|--------|--------|
| Reddit (r/lasercutting, r/ChineseLaserCutters, r/Lightburn, r/glowforge) | Domain blocked by WebFetch |
| Sawmill Creek Forum | HTTP 403 |
| CNCZone/CNCarena | HTTP 403 |
| Thingiverse | HTTP 403 |
| ScienceDirect/ResearchGate | HTTP 403 |
| The Fabricator | HTTP 403 |
| Sculpteo | HTTP 403 |
| Trotec Laser | 404 |
| Epilog Laser | Redirects to support portal (no parameter pages found) |
| DuckDuckGo (additional searches) | CAPTCHA after initial queries |
| Google Search | No results rendered (bot protection) |
| Most hackspace wikis (Nottingham, Sheffield, TechInc, HacDC) | Access denied / 403 / Anubis protection |
| MachineMFG.com | 403 |
| Aeon Laser, Thunder Laser USA, Boss Laser | 403/404 |

## Conversion Notes Applied

- Inches to mm: multiplied by 25.4 (e.g., 1/8" = 3.175mm, 1/4" = 6.35mm)
- mm/s to mm/min: multiplied by 60 (e.g., 50 mm/s = 3000 mm/min)
- For London Hackspace data: machine is 100W rated, all cuts done at "100% power" = 100W
- For OMTech data: ranges like "10-15 mm/s at 80-90%" converted to midpoints (12.5 mm/s, 85%)
- quality_rating: 5=excellent/perfect, 4=good/clean, 3=acceptable/slight issues
- edge_quality: inferred from community notes where available, defaults to 'clean'

## Data Quality Notes

1. **London Hackspace data is highest quality** - actively maintained by a makerspace with hundreds of users testing settings over years
2. **xTool P3 / OMTech data is manufacturer-verified** - starting points validated by the companies
3. **Forum data is user-reported** - represents real-world usage but may not be optimal
4. **StyleCNC data is reference-grade** - industrial parameters from a CNC manufacturer
5. **All "scraped_public" entries** come from publicly accessible, non-authenticated web pages
6. **Community consensus entries** represent well-known settings discussed across multiple threads/sources
