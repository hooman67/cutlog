# LightBurn Community Parameter Sources

## Summary

Scraped 52 cutting parameter entries from 3 public GitHub repositories containing LightBurn material library (.clb) files. Data was parsed from XML, normalized, and converted to SQL INSERT statements compatible with the `cuts` table schema.

**Output file:** `lightburn-scraped.sql`  
**Date scraped:** 2026-06-12  
**Total records:** 52 unique material/thickness/power/speed combinations

---

## Sources

### 1. HuppertzL/lightburn-materials-library-ortur-laser-master-2-pro

- **URL:** https://github.com/HuppertzL/lightburn-materials-library-ortur-laser-master-2-pro
- **Machine:** Ortur Laser Master 2 Pro (5W diode laser)
- **File:** `Ortur LM2 Pro.clb` (14,130 bytes, 376 lines XML)
- **Stars:** 2
- **Records extracted:** 12 cut entries
- **Materials covered:** Acrylic, Leather, Non-Woven Fabric, Paper, Paperboard, Pine Board, Plywood, Plastic Sheet
- **Characteristics:** All entries use 100% power (typical for low-wattage diode), speeds 1.67-66.67 mm/s

### 2. clvLabs/lightburn-material-lbraries

- **URL:** https://github.com/clvLabs/lightburn-material-lbraries
- **Machine:** OMT CO2 laser (60W)
- **File:** `libraries/omt-60w.clb` (43,223 bytes, 1,148 lines XML)
- **Stars:** 1
- **Records extracted:** 26 cut entries
- **Materials covered:** Clear Acrylic (0.4-5mm), Cardboard, Corrugated Cardboard, Cork, Kraft Paper, EVA Foam, Felt, Foam Board, Leather (dark/medium), Linoleum, MDF, Oak Veneer, Plywood, Graflux Bicolor Laminate
- **Characteristics:** Well-organized library with thickness-specific settings, power ranges 8-80%, speeds 5-600 mm/s. Most comprehensive of the three sources.

### 3. skelleyrc51/Gweike-Cloud-50W-Lightburn-

- **URL:** https://github.com/skelleyrc51/Gweike-Cloud-50W-Lightburn-
- **Machine:** Gweike Cloud (50W CO2 laser)
- **File:** `README.md` (LightBurn XML embedded in README)
- **Stars:** 0
- **Records extracted:** 14 cut entries
- **Materials covered:** Acrylic (3-8mm), Canvas, Cork, Corrugated Paper, Leather, Linden Wood, MDF, Maple, PVC Film, Paper, Paulownia Wood, Walnut
- **Characteristics:** Higher power settings (55-100%), includes exotic wood types. Good thick-material data (up to 10mm maple/linden).

---

## Data Transformation Notes

### Speed Conversion
- LightBurn stores speed in **mm/s**
- Our schema uses **mm/min**
- Conversion: `speed_mm_min = speed_mms * 60`

### Power
- LightBurn stores power as percentage (0-100), matching our schema directly
- `maxPower` used as the primary power value

### Filtering
- Only `CutSetting type="Cut"` entries extracted (through-cutting operations)
- Excluded: `Scan` (fill/engrave), `Image` (photo engraving), score/fold lines
- Entries with speed=0 and power=0 excluded

### Default Values Applied
| Field | Default | Rationale |
|-------|---------|-----------|
| gas_type | 'air' | CO2 and diode lasers use air assist |
| gas_pressure_bar | NULL | Not specified in LightBurn libraries |
| focus_position_mm | NULL | Varies by machine setup |
| nozzle_diameter_mm | NULL | Not applicable to these laser types |
| nozzle_distance_mm | NULL | Not specified |
| line_interval_mm | NULL | Only relevant for engraving |
| quality_rating | 4 | Published/recommended = high quality |
| edge_quality | 'clean' | Recommended settings assumed clean |
| source | 'scraped_public' | All from public GitHub repos |
| is_shared | true | Public community data |

---

## Material Coverage Summary

| Material Category | Variants | Thickness Range |
|-------------------|----------|-----------------|
| Acrylic | Clear, Standard | 0.4 - 8.0 mm |
| Wood (Plywood) | Standard, Veneer | 1.5 - 5.0 mm |
| Wood (Hardwood) | Maple, Walnut, Oak, Linden, Paulownia, Pine | 0.6 - 10.0 mm |
| MDF | Standard | 3.0 mm |
| Leather | Standard, Dark, Medium | 0.7 - 2.0 mm |
| Paper/Cardboard | Paper, Kraft, Cardboard, Corrugated | 0.1 - 6.0 mm |
| Foam | EVA, Foam Board | 2.0 - 4.5 mm |
| Fabric | Felt, Non-Woven, Canvas | 0.2 - 2.0 mm |
| Other | Cork, Linoleum, PVC, Plastic, Graflux | 0.3 - 4.0 mm |

---

## Additional Repos Found (Not Scraped)

- **shark92651/LaserParamsConverter** (46 stars) - Windows app to convert laser parameters between wattages. Contains code for parsing LightBurn .clb files but no raw parameter data in the repo.
- **HSBNE-Archive/visicut-settings** - Historical VisiCut settings, migrated to LightBurn (no .clb files in repo).

---

## LightBurn .clb File Format Reference

LightBurn material libraries use XML with this structure:

```xml
<LightBurnLibrary>
  <Material name="material-name">
    <Entry Thickness="3.0000" Desc="Cut">
      <CutSetting type="Cut|Scan|Image">
        <maxPower Value="80"/>
        <minPower Value="30"/>
        <speed Value="20"/>        <!-- mm/s -->
        <kerf Value="0.04"/>       <!-- mm -->
        <numPasses Value="1"/>
        <interval Value="0.1"/>    <!-- mm, line spacing for engraving -->
      </CutSetting>
    </Entry>
  </Material>
</LightBurnLibrary>
```

- `Thickness="-1.0000"` means "any thickness" (universal setting)
- `type="Cut"` = vector cutting/scoring
- `type="Scan"` = raster fill/engrave
- `type="Image"` = photo engraving with dithering
