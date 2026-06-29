# LightBurn Integration Research

> Deep research report — compiled 2026-06-14
> Sources: LightBurn official docs, GitHub repos, community forums, web research

---

## 1. What is LightBurn?

### Overview

LightBurn is the **de facto standard** layout, editing, and control software for laser cutters and engravers in the hobbyist-to-prosumer market. It handles everything from importing artwork through applying cut parameters to controlling the machine directly.

### Company

| Detail | Value |
|--------|-------|
| Company | LightBurn Software |
| HQ | Brookfield, CT, USA |
| Employees | ~24 (bootstrapped, no VC) |
| Also makes | MillMage (CNC router software) |

### Pricing Model — Perpetual License (NOT Subscription)

| Tier | Price | Controllers |
|------|-------|-------------|
| **LightBurn Core** | $99 USD | GCode only: Grbl, Smoothieware, Marlin, Cohesion3D |
| **LightBurn Pro** | $199 USD | ALL: GCode + DSP (Ruida, Trocen, TopWisdom) + Galvo (EZCad2-based fiber/CO2/UV) |
| Update renewal | $40/year (optional) | Software works forever without it |
| Computers | Up to 3 per license | Cross-platform (Win/Mac/Linux) |

### User Base

No official count published. Proxy metrics from forum.lightburnsoftware.com:
- ~40,000+ total forum topics
- ~107 new sign-ups per day
- 1,020 monthly active forum users
- **Estimated total user base: hundreds of thousands of license holders** (only a fraction of users participate in forums)

### Supported Machines

| Type | Controllers |
|------|-------------|
| CO2 lasers | Ruida, Trocen, TopWisdom, Grbl |
| Diode lasers | Grbl, Marlin, Smoothieware |
| Fiber lasers | EZCad2-based galvo boards |
| Galvo (CO2/UV) | EZCad2-based boards |

Covers entry-level hobby lasers ($200 diode) through mid-level industrial machines ($20K+ CO2/fiber). Only excludes high-end industrial ($50K+) which use proprietary OEM software.

### Market Position

- **Dominant** in hobbyist/prosumer — self-describes as "the industry standard"
- Only cross-platform, cross-controller, full-featured paid option
- LaserGRBL explicitly positions itself as "a free alternative to LightBurn"
- No serious paid competitor — alternatives are all free/OSS with narrower features
- Profitable bootstrapped company sustaining 24 employees on license revenue alone

### Competitors

| Competitor | Price | Limitations |
|-----------|-------|-------------|
| LaserGRBL | Free | Windows-only, Grbl-only, engraving-focused |
| RDWorks | Free (bundled) | Windows-only, Ruida-only |
| EZCad2/3 | Bundled with hardware | Windows-only, galvo-only |
| xTool Creative Space | Free (locked to xTool) | Single-vendor |
| Glowforge UI | Free (locked to Glowforge) | Single-vendor, web-only |
| MeerK40t | Free (MIT) | Less polished, smaller community |

---

## 2. The .clb File Format — LightBurn Material Library

### What Is It?

The `.clb` file is LightBurn's **Material Library** — a user-built collection of laser cut/engrave presets organized by material, thickness, and operation type. Libraries are entirely user-generated; LightBurn ships with NO pre-populated settings.

### File Format: Plain-Text XML

**Confirmed by multiple independent sources** (two GitHub parsers, community posts, LightBurn staff). The .clb file is standard XML that can be opened in any text editor.

### Complete XML Schema

```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightBurnLibrary DisplayName="My Library">
  <Material name="Birch Plywood">
    <Entry Thickness="3.0" Desc="Clean cut" NoThickTitle="">
      <CutSetting type="Cut">
        <index Value="0"/>
        <name Value="C00"/>
        <LinkPath Value=""/>
        <priority Value="0"/>
        <speed Value="10"/>
        <maxPower Value="65"/>
        <minPower Value="15"/>
        <maxPower2 Value="20"/>
        <numPasses Value="2"/>
        <interval Value="0.08"/>
        <tabCount Value="0"/>
        <tabCountMax Value="0"/>
      </CutSetting>
    </Entry>
    <Entry Thickness="6.0" Desc="Deep engrave" NoThickTitle="">
      <CutSetting type="Scan">
        <index Value="1"/>
        <name Value="C01"/>
        <speed Value="300"/>
        <maxPower Value="40"/>
        <minPower Value="10"/>
        <interval Value="0.08"/>
        <!-- ... additional parameters ... -->
      </CutSetting>
    </Entry>
  </Material>
  <Material name="Acrylic Clear">
    <!-- ... -->
  </Material>
</LightBurnLibrary>
```

### Hierarchy

```
Root (DisplayName attribute)
  └── Material (name attribute)
        └── Entry (Thickness, Desc, NoThickTitle attributes)
              └── CutSetting (type="Cut"|"Scan"|"Image")
                    ├── index (Value)
                    ├── name (Value)
                    ├── LinkPath (Value)
                    ├── priority (Value)
                    ├── speed (Value) — mm/s
                    ├── maxPower (Value) — percentage
                    ├── minPower (Value) — percentage
                    ├── maxPower2 (Value) — percentage
                    ├── numPasses (Value)
                    ├── interval (Value) — line spacing in mm
                    ├── tabCount (Value)
                    └── tabCountMax (Value)
```

### CutSetting Types

| Type | Description |
|------|-------------|
| `Cut` | Vector cutting/scoring — line following |
| `Scan` | Raster fill/engraving — back-and-forth |
| `Image` | Bitmap engraving with dithering |

### Parameters Stored

**Core parameters (confirmed in XML):**

| XML Element | Description | Typical Range |
|-------------|-------------|---------------|
| `speed` | Feed rate (mm/s) | 1–10000 |
| `maxPower` | Maximum laser power (%) | 0–100 |
| `minPower` | Minimum power at corners (%) | 0–100 |
| `maxPower2` | Power for second layer/pass (%) | 0–100 |
| `numPasses` | Number of repeat passes | 1–20+ |
| `interval` | Line spacing for Scan (mm) | 0.01–1.0 |
| `priority` | Execution order | 0+ |

**Additional parameters that may be stored (from LightBurn's Cut Settings Editor):**
- Z Offset, Z Step per Pass
- Kerf Offset
- Perforation Mode (cut distance, skip distance)
- Override PWM Frequency (for RF tubes)
- PPI (Pulses Per Inch)
- Overscanning amount
- Bi-directional fill toggle
- Cross-hatch toggle
- Scan angle
- Ramp length
- Air assist enable
- Lead-in/Lead-out

### Programmatic Read/Write — CONFIRMED FEASIBLE

Reading and writing .clb files is straightforward with any XML library:

```python
import xml.etree.ElementTree as ET

# READ
tree = ET.parse("my_library.clb")
root = tree.getroot()

for material in root.findall("Material"):
    name = material.get("name")
    for entry in material.findall("Entry"):
        thickness = entry.get("Thickness")
        cut_setting = entry.find("CutSetting")
        speed = cut_setting.find("speed").get("Value")
        power = cut_setting.find("maxPower").get("Value")
        print(f"{name} @ {thickness}mm: {speed}mm/s, {power}%")

# WRITE
root = ET.Element("LightBurnLibrary", DisplayName="Generated Library")
material = ET.SubElement(root, "Material", name="Birch Plywood")
entry = ET.SubElement(material, "Entry", Thickness="3.0", Desc="AI Recommended")
cut = ET.SubElement(entry, "CutSetting", type="Cut")
ET.SubElement(cut, "speed", Value="10")
ET.SubElement(cut, "maxPower", Value="65")
ET.SubElement(cut, "minPower", Value="15")
ET.SubElement(cut, "numPasses", Value="2")

tree = ET.ElementTree(root)
tree.write("output.clb", encoding="utf-8", xml_declaration=True)
```

---

## 3. Why LightBurn Is Our Distribution Channel

### The Two-Way Data Flywheel

```
┌─────────────────────────────────────────────────────────────┐
│                   OUR APP                                     │
│                                                              │
│  ┌──────────┐     ML/Physics      ┌──────────────┐         │
│  │ IMPORT   │ ──── Engine ───────► │   EXPORT     │         │
│  │ .clb     │                      │   .clb       │         │
│  │ files    │   Learn from user    │   files      │         │
│  │          │   tested params      │              │         │
│  └────┬─────┘                      └──────┬───────┘         │
│       │                                    │                 │
└───────┼────────────────────────────────────┼─────────────────┘
        │                                    │
        ▲                                    ▼
   Users upload                        Users download
   their libraries                     recommendations
        │                                    │
        │         ┌──────────────┐          │
        └─────────┤  LightBurn   ├──────────┘
                  │  Software    │
                  │  (user's     │
                  │   workflow)  │
                  └──────────────┘
```

### Why This Works

1. **EXPORT .clb = Zero-friction adoption**
   - Users already work in LightBurn daily
   - Our recommendations become a .clb file they import with one click
   - No workflow change required — settings appear in their Material Library
   - They can immediately cut/engrave with our parameters

2. **IMPORT .clb = Training data goldmine**
   - Every experienced operator has a .clb library with hundreds of tested parameters
   - These are GROUND TRUTH — real settings that produced successful cuts
   - Users upload their library, we learn from their experience
   - Each library = labeled training data (material + thickness + machine type → parameters)

3. **Network effects create a moat**
   - More users uploading → better recommendations → more users downloading
   - Machine-specific normalization (energy density) makes cross-machine learning possible
   - We become the "missing sharing layer" that LightBurn lacks

### Key Insight: Settings Aren't Portable (But We Can Fix That)

Forum user Jack (Topic 95066) had 60-70 materials in his 20W library but couldn't use them on his 40W machine because "laser powers are specified as a percentage of full power." He built a custom Excel macro to normalize by energy density.

**This is exactly the problem our ML model solves** — translate parameters between machines using physics-informed normalization rather than raw percentages.

---

## 4. Integration Strategy

### Reading .clb Files

| Approach | Effort | Notes |
|----------|--------|-------|
| Python `xml.etree.ElementTree` | Trivial | Standard library, no dependencies |
| Custom parser with validation | Low | Add schema validation, handle edge cases |
| Port from LaserParamsConverter (C#) | Medium | Reference implementation exists |

### Writing .clb Files

Same approach — generate valid XML matching the schema above. Key considerations:
- Must include `xml_declaration=True` and `encoding="utf-8"`
- Root element needs `DisplayName` attribute
- All parameter values stored as strings in `Value` attributes
- `Thickness="-1.0000"` means "not set" (for operations like engraving that aren't thickness-dependent)

### Existing Open-Source Tools

| Tool | Language | What it does | Stars |
|------|----------|--------------|-------|
| **LaserParamsConverter** | C# | Converts between EZCAD2 .lib, EZCAD3 .ini, and LightBurn .clb | 46 |
| **clb-editor** | Python | GUI editor for .clb files | 0 |
| **LaserSettingsTranslator** | Python | Scales .clb parameters between different wattage machines | 0 |
| **lbrnts** | TypeScript | Parses .lbrn/.lbrn2 project files (NOT .clb) | 2 |

### Is There an API or SDK?

**No.** LightBurn has NO official API, SDK, plugin system, or extension mechanism. It is a closed-source desktop application. The only integration path is through file formats:
- `.clb` — Material Library (our primary target)
- `.lbrn2` — Project files (secondary, for generating test patterns)

### EZCAD2/EZCAD3 Formats

| Format | Software | Structure | Key Difference |
|--------|----------|-----------|----------------|
| `MarkParam.lib` | EZCAD2 | Plain text, INI-style sections | Uses `FREQ` key |
| `MarkParamlib.ini` | EZCAD3 | Plain text, INI format | Uses `FREQF` key, 50+ params per section |

**EZCAD parameters stored:**
- MARKSPEED (mm/s)
- POWERRATIO (percentage)
- FREQ/FREQF (kHz)
- QPULSEWIDTH (nanoseconds)
- LOOP (passes)
- WOBBLEMODE, WOBBLEDIAMETER, WOBBLEDIST
- Start TC, Laser Off TC, End TC, Polygon TC
- Jump Speed, Jump Delay

**LaserParamsConverter already handles bidirectional conversion** between all three formats (EZCAD2 ↔ EZCAD3 ↔ LightBurn).

### Integration Priority

1. **Phase 1:** Read/write .clb (LightBurn) — largest user base, XML is trivial
2. **Phase 2:** Read/write EZCAD2 .lib — fiber laser users, text INI is trivial
3. **Phase 3:** Read/write EZCAD3 .ini — newer galvo systems
4. **Phase 4:** Generate .lbrn2 test patterns — material test grids

---

## 5. Competitive Positioning

### LightBurn's Material Library: What It HAS

- Local storage of user-tested cut presets
- Hierarchical organization (material → thickness → description)
- Link/Assign modes for applying settings to layers
- Multi-device support (different libraries per machine)
- Material Test Generator (generates speed/power grid patterns)
- File-based sharing via .clb export/import

### LightBurn's Material Library: What It LACKS

| Gap | Evidence | Our Opportunity |
|-----|----------|-----------------|
| **No community sharing** | No cloud sync, no marketplace, no online repository. Topic 89306: "I'm surprised to not find a shared materials library." | Build the sharing platform |
| **No cross-machine translation** | Settings are raw percentages; 20W library is useless on 40W. Topic 95066: user built custom Excel macro. | Physics-informed normalization |
| **No ML recommendations** | New users told to "just test it yourself." Topic 6979: repeated requests for recommended settings. | ML model predicts optimal params |
| **Material Test is unreliable** | Topic 161627: "I have to greatly increase power and lower speed to get comparable results." Small test squares don't match production. | Our model learns from real production data |
| **No quality control on shared data** | Ad-hoc forum sharing with no validation | Crowdsourced + ML-validated parameters |
| **Forum won't accept .clb uploads** | Users must rename to .txt. Topic 71640 (84,648 views!) | Native .clb hosting/download |

### We COMPLEMENT LightBurn, Not Compete

```
LIGHTBURN                          OUR APP
─────────────────────              ─────────────────────
✓ Design & layout                  ✗ (not our problem)
✓ Machine control                  ✗ (not our problem)
✓ Local parameter storage          ✓ Cloud parameter sharing
✗ Community library sharing        ✓ Built for this
✗ ML recommendations               ✓ Core feature
✗ Cross-machine translation        ✓ Physics-informed
✗ Parameter quality scoring        ✓ Crowdsourced validation
```

### Evidence of Demand

| Signal | Metric | Source |
|--------|--------|--------|
| xTool D1 material settings post | 84,648 views, 465 readers | Forum Topic 71640 |
| "Shared materials library" request | Unanswered by LightBurn | Forum Topic 89306 |
| User spent 6 months trial-and-error | Before sharing results | Forum Topic 39614 |
| MOPA fiber library (AI-generated) | 3,614 views | Forum Topic 160217 |
| LightBurn staff suggests AI for .clb | "An AI might be able to convert..." | Forum Topic 189389 |

### The "Every Laser Is Different" Objection

LightBurn staff (Topic 36612): "It does not make sense to share libraries. Lasers and materials are such different that a setting that works for one user, doesn't for the next."

**Our response:** This is true for RAW parameters but false for NORMALIZED parameters. With energy density normalization (accounting for wattage, spot size, focal length), parameters CAN be translated between machines. LaserSettingsTranslator already proves this with mathematical scaling. Our ML model does it better with learned correction factors.

---

## 6. Technical Implementation Notes

### .clb Generation — Minimal Viable Code

```python
"""Generate a valid LightBurn .clb Material Library from recommendations."""
import xml.etree.ElementTree as ET
from xml.dom import minidom

def create_clb(materials: list[dict], library_name: str = "AI Recommendations") -> str:
    """
    materials: [
        {
            "name": "Birch Plywood",
            "entries": [
                {
                    "thickness": 3.0,
                    "desc": "Clean cut - 40W CO2",
                    "type": "Cut",
                    "speed": 10,
                    "max_power": 65,
                    "min_power": 15,
                    "passes": 2,
                }
            ]
        }
    ]
    """
    root = ET.Element("LightBurnLibrary", DisplayName=library_name)
    
    for mat in materials:
        material_elem = ET.SubElement(root, "Material", name=mat["name"])
        for entry in mat["entries"]:
            entry_elem = ET.SubElement(
                material_elem, "Entry",
                Thickness=str(entry.get("thickness", -1.0)),
                Desc=entry.get("desc", ""),
                NoThickTitle=""
            )
            cut = ET.SubElement(entry_elem, "CutSetting", type=entry.get("type", "Cut"))
            ET.SubElement(cut, "index", Value="0")
            ET.SubElement(cut, "name", Value="C00")
            ET.SubElement(cut, "LinkPath", Value="")
            ET.SubElement(cut, "priority", Value="0")
            ET.SubElement(cut, "speed", Value=str(entry["speed"]))
            ET.SubElement(cut, "maxPower", Value=str(entry["max_power"]))
            ET.SubElement(cut, "minPower", Value=str(entry["min_power"]))
            if "passes" in entry:
                ET.SubElement(cut, "numPasses", Value=str(entry["passes"]))
            if "interval" in entry:
                ET.SubElement(cut, "interval", Value=str(entry["interval"]))
            ET.SubElement(cut, "tabCount", Value="0")
            ET.SubElement(cut, "tabCountMax", Value="0")
    
    # Pretty-print
    rough = ET.tostring(root, encoding="unicode")
    parsed = minidom.parseString(rough)
    return parsed.toprettyxml(indent="  ", encoding="utf-8").decode()


def parse_clb(file_path: str) -> list[dict]:
    """Parse a .clb file into structured data for ML training."""
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    materials = []
    for material in root.findall("Material"):
        mat_data = {"name": material.get("name"), "entries": []}
        for entry in material.findall("Entry"):
            cut_setting = entry.find("CutSetting")
            if cut_setting is None:
                continue
            entry_data = {
                "thickness": float(entry.get("Thickness", -1)),
                "desc": entry.get("Desc", ""),
                "type": cut_setting.get("type", "Cut"),
            }
            # Extract all parameters
            for param in cut_setting:
                entry_data[param.tag] = param.get("Value")
            mat_data["entries"].append(entry_data)
        materials.append(mat_data)
    return materials
```

### Key Caveats

1. **Root element name uncertainty:** Sources show both `<LightBurnLibrary>` and `<LightBurnLibraryVersion>`. Test with actual exported files to confirm.
2. **Version differences:** LightBurn may add new parameter elements in future versions. Parser should handle unknown elements gracefully.
3. **Value types:** All values stored as strings. Speed appears to be integer in some files, float in others. Use float parsing with int fallback.
4. **Device association:** When imported, the library associates with the currently active device in LightBurn. Our export should note the target machine type in the `Desc` field.

---

## 7. Sources

| # | Source | URL | Used For |
|---|--------|-----|----------|
| 1 | LightBurn Official Docs — Material Library | https://docs.lightburnsoftware.com/latest/Reference/MaterialLibrary/ | Library features, .clb extension confirmation |
| 2 | LightBurn License Page | https://lightburnsoftware.com/pages/how-the-lightburn-license-works | Pricing, perpetual model |
| 3 | LightBurn Forum Statistics | https://forum.lightburnsoftware.com/about | User activity metrics |
| 4 | LaserParamsConverter (GitHub) | https://github.com/shark92651/LaserParamsConverter | Cross-format conversion, .clb handling |
| 5 | clb-editor (GitHub) | https://github.com/Crazydoub/clb-editor | XML schema confirmation, Python parsing |
| 6 | LaserSettingsTranslator (GitHub) | https://github.com/bdmartens/LaserSettingsTranslator | Wattage scaling, .clb parser |
| 7 | lbrnts (GitHub) | https://github.com/tscircuit/lbrnts | .lbrn2 format documentation |
| 8 | Forum Topic 89306 | https://forum.lightburnsoftware.com/t/89306 | "Surprised no shared library" |
| 9 | Forum Topic 95066 | (referenced in search results) | Cross-machine parameter translation pain |
| 10 | Forum Topic 161627 | (referenced in search results) | Material test unreliability |
| 11 | Forum Topic 71640 | (referenced in search results) | 84K views for material settings |
| 12 | Forum Topic 189389 | (referenced in search results) | LightBurn staff suggests AI for .clb |
| 13 | Forum Topic 36612 | (referenced in search results) | "Doesn't make sense to share" objection |
| 14 | Diode Laser Wiki | https://diode-laser-wiki.com | Only community settings gallery (beta) |
| 15 | Balor (GitLab) | https://gitlab.com/bryce15/balor | Open-source EZCAD2 replacement |
| 16 | EZCAD2 User Manual | https://omglaser.com/wp-content/uploads/2021/07/Ezcad2.14-User-Manual.pdf | Parameter documentation |
| 17 | ezcad-2-to-3 (GitHub) | https://github.com/azonin/ezcad-2-to-3 | EZCAD format conversion reference |

---

## 8. Key Takeaways for Product Strategy

1. **The .clb format is trivially parseable XML** — we can build import/export in a day
2. **No API exists** — file-based integration is the ONLY path, which is fine
3. **The sharing gap is validated** — 84K views on a settings post, repeated user frustration
4. **LightBurn won't build this** — they've explicitly stated sharing "doesn't make sense"
5. **We complement, never compete** — we make LightBurn more valuable, not less
6. **EZCAD coverage doubles our TAM** — same approach works for fiber laser operators
7. **The "every laser is different" objection is our moat** — ML normalization is the hard part that justifies a product
8. **LaserParamsConverter proves demand** — 46 stars for a conversion tool shows users need cross-format support
