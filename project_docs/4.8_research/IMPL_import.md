# Import (.clb / .lbset / .xml / CSV) — hardening for galvo/MOPA

## Background

Our most committed power user (Nate Keen, galvo/MOPA fiber engraving) reported
**"Doesn't seem to recognise .clb files."** The `.clb` importer is the key
onboarding wedge, and it broke for a real galvo file.

## What was broken before

The old `parseClbXml` was a brittle set of regexes that baked in a single, narrow
assumption about LightBurn's structure:

- **Required `Value="X"` (capital V) attributes only.** Newer LightBurn versions and
  some exports use lowercase `value="X"` or nested text nodes `<speed>X</speed>`.
  Galvo files using either form parsed as empty.
- **Required `<Material name="...">` as the very first attribute** (`name="..."`
  immediately after `<Material`). Files with attributes in a different order, or a
  device-name attribute first, did not match.
- **Required a `type="..."` attribute on `<CutSetting>`.** Files where the type was a
  nested `<type Value="..."/>` tag were skipped.
- **No fallback for flat files.** A galvo/MOPA export that is just a sequence of
  `<CutSetting>` blocks (no `<Material>`/`<Entry>` wrapper) produced zero entries and
  the generic "contact support" error — exactly the reported symptom.
- **Material names with `&amp;`, `&quot;` etc.** were passed through raw.
- **Only `.clb` / `.xml` extensions** were accepted; `.lbset` and CSV were rejected.
- **Power only read `maxPower`** (some files use `power`).
- Throwing on any single malformed block would 500 the whole import.

## What is now supported

### File formats (route: `src/app/api/import-clb/route.ts`)

| Format | Extensions | Detection |
|---|---|---|
| LightBurn library | `.clb` | extension + `<Material>/<CutSetting>` content |
| LightBurn settings export | `.lbset` | same XML family, same parser |
| Generic XML | `.xml` | content starts with `<` |
| CSV | `.csv`, `.tsv`, `.txt` | content heuristic (header has `material`) or extension |

Detection is **content-first** (so a `.txt` containing CSV still works, and an XML
mislabeled file still works), falling back to extension. BOM (literal + escaped) and
CRLF are stripped/tolerated.

### XML parser (`parseClbXml`)

- Param values accepted as `<tag Value="X"/>`, `<tag value="X"/>`, `<tag>X</tag>`,
  single or double quotes, **tags in any order**, self-closing or nested.
- Material `name` and `Entry` attributes read order-independently; XML entities
  (`&amp; &lt; &gt; &quot; &apos; &#nn; &#xnn;`) decoded.
- `Thickness="-1"`, `"0"`, missing, or non-numeric → `thickness_mm = null`.
- Captures galvo/engraving params: `speed`, `maxPower`/`power`, `minPower`,
  `frequency` (Hz), `QPulseWidth` (µs), `numPasses`, `interval` (line interval, mm),
  `DPI`, `scanAngle`, `crossHatch`, `bidir`, `tabsEnabled`, `overscanning`.
- **Unit conversions (verified):**
  - Speed: `.clb` stores **mm/s** → CutLog stores **mm/min** = `speed * 60`.
  - Q-pulse: `.clb` `QPulseWidth` is in **microseconds** → `q_pulse_ns = µs * 1000`
    (1 µs = 1000 ns). e.g. `QPulseWidth=200` → `q_pulse_ns = 200000`.
- `operation_type` mapping: `Scan`/`Image` → `engrave`, `Mark` → `mark`,
  `Offset` → `cut`, plus `Cut`/`Score`/`Fill`/`Outline`/`Engrave`; unknown types are
  lower-cased through.
- **Permissive fallbacks:**
  - `<Material>` with direct `<CutSetting>` (no `<Entry>`) is parsed.
  - If there are **no `<Material>` blocks but `<CutSetting>` blocks exist**, they are
    parsed as a single `"Imported"` material — so a flat galvo export still imports.
- **Never throws:** a single malformed `<CutSetting>` is skipped; the rest are
  returned. Error messages are specific (empty file / not XML / no cut settings /
  unrecognized) and actionable.

### CSV parser (`parseCsv`)

- Header-driven, tolerant of casing/spacing/punctuation and aliases:
  `material`/`name`, `thickness`/`thickness_mm`, `power`/`watts`/`maxpower`/`power_pct`,
  `speed`/`speed (mm/min)`/`speed_mm_s`, `interval`/`line_interval_mm`,
  `frequency`/`freq`/`frequency_hz`, `q_pulse_ns` vs `q_pulse_width_us`,
  `num_passes`/`passes`, `operation`/`type`, `scan_angle`, `cross_hatch`, `notes`/`desc`.
- **Speed units:** assumed **mm/min** unless a `mm/s` column is present (then `* 60`).
- **Q-pulse units:** explicit `q_pulse_ns` used as-is; a `…us` column is `* 1000`.
- Quoted fields with embedded commas handled (`"Brass, polished"`); malformed rows
  skipped. Requires a `material` column; header-only / no-material → empty.

## Import page UX (`src/app/import/page.tsx`)

- Accepted-formats messaging updated to `.clb / .lbset / .xml` and `.csv`.
- A green note states **galvo/MOPA files are supported** (Q-pulse, frequency, line
  interval, DPI, scan angle imported when present).
- Client-side extension validation widened to the new set.
- Preview rows now render **galvo-relevant badges** (Q-pulse ns, frequency in kHz/Hz,
  scan angle, cross-hatch) only when those values are present.
- The file `<input>` keeps **no `accept` attribute** (iOS file-picker compatibility),
  per the existing mobile constraint.

## Tests (`src/__tests__/import-clb.test.ts`)

The tests now import the **real** `parseClbXml`, `parseCsv`, and `extractValue`
(instead of a mirrored copy). 43 tests cover:

- Classic single/multi-material `.clb`, speed conversion, descriptions.
- CutSetting type mapping incl. `Mark`/`Offset`.
- A **galvo/MOPA** fixture (BOM, CRLF, `type="Scan"`, no thickness, `&amp;` in name)
  asserting `q_pulse_ns = 200000` (200 µs) and `speed_mm_min = 30000` (500 mm/s).
- A **newer nested-value** fixture (`<speed>20</speed>`, lowercase `value=`,
  nested `<type>`).
- A **flat `<CutSetting>`-only** fragment → single `"Imported"` material.
- A **CSV** fixture with `speed (mm/min)` header + galvo columns, plus a `mm/s` /
  `…us` CSV asserting unit conversion.
- **Malformed XML** that must not throw and still recovers a usable block.

Run: `npx vitest run src/__tests__/import-clb.test.ts` → 43 passed.
