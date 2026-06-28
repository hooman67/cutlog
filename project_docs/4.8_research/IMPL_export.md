# Multi-format Export — Implementation

Adds EZCAD, RDWorks and a universal CSV export alongside the existing LightBurn
`.clb`, to match competitor LaserMarkDB and serve the galvo/marking crowd.

## What changed

- **New `src/lib/exporters.ts`** — pure, unit-tested formatters. No I/O.
- **New `src/app/api/export/route.ts`** — single multi-format export endpoint.
- **Refactored `src/app/api/export-clb/route.ts`** — now imports `toLightBurnClb`
  from the lib; endpoint/behavior unchanged (backward compatible).
- **Updated `src/app/history/page.tsx`** — the single "Export .clb" button is now
  an "Export ▾" dropdown chooser (LightBurn, EZCAD, RDWorks, Universal CSV).
- **New `src/lib/exporters.test.ts`** — 25 tests, all passing.

## The exporters (`src/lib/exporters.ts`)

Each function takes `ExportableCut[]` (a structural subset of `Cut` so DB rows
pass directly) and returns `{ content, filename, mimeType }`.

| Function | Target | Output | Notes |
|----------|--------|--------|-------|
| `toLightBurnClb(cuts, displayName)` | LightBurn | `.clb` XML (importable) | Native material library. |
| `toEzcad(cuts)` | EZCAD2/EZCAD3 | `.csv` reference sheet | `.ezd` is closed binary — no open import. |
| `toRdworks(cuts)` | RDWorks/RDCAM (Ruida) | `.csv` reference sheet | No open import format. |
| `toCsv(cuts)` | Universal | `.csv` | Lossless dump of all fields. |

### Unit conventions
- **Speed:** CutLog stores mm/min. LightBurn/EZCAD/RDWorks use mm/s → divide by 60.
  (Universal CSV keeps mm/min — it's a faithful field dump.)
- **Q-Pulse:** CutLog stores ns. LightBurn `<QPulseWidth>` is microseconds → ns/1000.
  EZCAD sheet reports the raw ns.
- **Frequency:** stored in Hz. LightBurn/CSV use Hz; EZCAD sheet shows kHz (Hz/1000).
  `frequency_hz` falls back to legacy `pulse_frequency_hz`.

### LightBurn `.clb` specifics (preserved from original)
- Cuts grouped by material; material names sorted alphabetically.
- `maxPower = power_pct`; `minPower = max(5, round(power_pct * 0.15))`.
- `numPasses` defaults to 1 (uses `num_passes` when > 0).
- Galvo fields emitted when present: `<frequency>`, `<QPulseWidth>` (us),
  `<interval>` (line interval), `<numPasses>`, `<angle>` (scan angle).
- All material names / descriptions XML-escaped.

### EZCAD reference sheet columns
`Material, Marking Speed (mm/s), Power (%), Frequency (kHz), Q-Pulse Width (ns),
Loop Count (Passes), Hatch Spacing (mm), Hatch Angle (deg)` — with a `#`-prefixed
comment header explaining EZCAD has no open import format.

### RDWorks reference sheet columns
`Layer/Material, Speed (mm/s), Max Power (%), Min Power (%), Passes, Line Interval (mm)`.
`Max Power = power_pct`; `Min Power = max(5, round(power_pct*0.15))` default.

### Universal CSV columns
`material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar,
focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm,
frequency_hz, q_pulse_ns, num_passes, operation_type, quality_rating, edge_quality,
source, notes`. RFC-4180 escaping (commas, quotes, newlines), CRLF line endings.

### `formats` registry
`Record<ExportFormat, { label, extension, mimeType, fn }>` for keys
`'clb' | 'ezcad' | 'rdworks' | 'csv'`. `isExportFormat()` type guard validates
query params.

## API

### `GET /api/export` (new)
Auth-gated. Query params:
- `format` — `clb | ezcad | rdworks | csv` (default `clb`; invalid → 400).
- `machine_id`, `material` (ilike partial), `source` — same filters as export-clb.

Fetches the user's cuts (ordered by material, thickness; limit 500), runs the
chosen exporter, returns the file with correct `Content-Type` and
`Content-Disposition` filename/extension. 401 if unauthenticated, 404 if no cuts.

### `GET /api/export-clb` (unchanged contract)
Still returns `.clb`; now delegates generation to `toLightBurnClb`.

## UI
History page export button is a dropdown ("Export ▾") with the four formats,
dark-theme styled, mobile-friendly (Web Share API on mobile, anchor download on
desktop), click-away backdrop, and it respects the existing material filter.

## Tests
`src/lib/exporters.test.ts` — run with:
```
npx vitest run src/lib/exporters.test.ts
```
Covers: clb speed mm/s conversion, q-pulse ns→us, galvo field emission, material
grouping/sorting, XML escaping, EZCAD/RDWorks unit conversions + headers, CSV
escaping (commas/quotes/newlines), legacy frequency fallback, the registry, and
empty-input handling for every format. 25/25 passing.
