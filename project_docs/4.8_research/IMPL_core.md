# IMPL_core — J/mm energy layer, material-test grid, provenance/verification, thick-metal focus

Implemented by the core agent. Repositions CutLog toward "fastest path to a trusted
STARTING POINT so you run fewer test squares" with industrial thick-metal fiber cutting
as the primary use case.

## DB migration the user MUST apply

**File: `data/013_verification_provenance.sql`** — apply manually in the Supabase SQL editor.

It is OPTIONAL for the UI to function (everything degrades gracefully if absent), but it
enables the "✓ Verified by N operators" badge to be richer. It:
- Creates view `public.material_verifications` (distinct operators with `feedback_type='perfect'`
  per material/thickness bucket), `security_invoker=true` so existing feedback RLS applies.
- Adds nullable cached column `cuts.verified_count integer NOT NULL DEFAULT 0`.
- Adds a partial index on `feedback(lower(material), feedback_type) WHERE feedback_type='perfect'`.

Note: the search route currently derives verification counts directly from the `feedback`
table at query time (no dependency on the view), and reads `cuts.verified_count` only if the
column exists. So applying 013 is recommended but not blocking.

## New files

- `src/lib/energy.ts` — pure J/mm linear energy-density layer:
  - `linearEnergyDensity({powerPct,wattageW,speedMmMin,numPasses})` → J/mm (nulls → null).
  - `speedFromEnergyDensity({jPerMm,powerPct,wattageW,numPasses})` → solve target speed.
  - `crossMachineSpeed({source*, target*})` → normalize source then solve target speed.
  - `formatEnergyDensity(jPerMm)` → "12.4 J/mm".
  - Doc comment explains it's an approximation valid only for same laser-type/wavelength, is a
    STARTING POINT requiring a material test, and that area-based (line-interval) engraving is
    out of scope (linear only).
- `src/lib/energy.test.ts` — 23 vitest cases: basic calc, multi-pass, null/zero-speed handling,
  round-trip (normalize→solve at same wattage returns original), cross-wattage (2kW→6kW ≈ 3×),
  pass-count transfer, formatting. All passing:
  `npx vitest run src/lib/energy.test.ts` → 23 passed.
- `src/app/tools/material-test/page.tsx` — one-click LightBurn `.clb` material-test grid
  generator. Pick sweep param (Speed/Power), min/max/steps, fixed values, material+thickness,
  gas/passes. Generates `.clb` XML client-side (one `CutSetting` per step, speed = mm_min/60,
  layers C00..Cnn) and downloads via Blob — NO new API route. Labeled thick-metal presets
  (10mm mild steel O₂ speed sweep, 6mm stainless N₂, 12mm aluminum N₂ power sweep, 3mm acrylic).
  Hides gas fields in galvo mode.

## Edited files

- `src/app/api/search/route.ts`
  - Added `deriveProvenance()` → tags each cut: your_data / community_verified /
    community_reported / scraped_reference / ai_unverified (from `source` + verification signals).
  - Queries the `feedback` table for distinct `perfect` voters (verification count), bucketed to
    the search tolerance; reads optional `cuts.verified_count` if present (max of the two).
  - Attaches `provenance` + `verified_count` to every returned cut; adds top-level `verifiedCount`.
  - All wrapped in try/catch so a missing feedback table/column never breaks search.
- `src/app/suggest/page.tsx`
  - Imports `energy.ts`. `ScaledCut` gains `provenance`/`verified_count`; `SpeedRecommendation`
    gains `topProvenance`, `verifiedCount`, `jPerMm`, `sourceWattageW`, `energyScaledSpeed`.
  - `computeSpeedRecommendation` now computes the most authoritative provenance, the max verified
    count, the recommendation's J/mm (from the highest-weighted cut), and — when the user's machine
    wattage differs from the source data's wattage — an energy-normalized "scaled to your machine"
    speed via `crossMachineSpeed` (complements, does not replace, lens-based `scaling.ts`).
  - Hero card now shows: colored provenance badge, "✓ Verified by N operators", a `⚡ X J/mm`
    badge, and a sky "Scaled to your machine (~X mm/min)" card clearly labeled "starting point —
    run a material test". Detailed cuts show per-group provenance badges plus per-cut Nozzle Gap,
    Passes (>1) and Energy (J/mm).
  - Added thick-metal quick-pick buttons (mild steel/stainless/aluminum × common thicknesses,
    hidden in galvo mode), a link to `/tools/material-test`, and honest starting-point subtitle.
- `src/app/page.tsx` (home) — new "🧪 Material Test Generator" button linking `/tools/material-test`;
  getting-started copy now leads with thick stainless/mild steel + cutting params.
- `src/app/landing/page.tsx` — hero/features/how-it-works rewritten to lead with industrial thick
  metal (6–25mm), honest "starting point not a magic number" framing, J/mm wattage transfer, and the
  one-click test grid. Engraving kept as a supported secondary use case.

## Galvo / engraving
`isGalvoMode`/`isEngravingMode` untouched; new cutting UI (quick picks, gas in the test grid,
nozzle/pierce fields) is gated on `!isGalvoMode`. Engraving support preserved everywhere.

## Verification
- `npx vitest run src/lib/energy.test.ts` → 23/23 pass.
- `tsc --noEmit` shows no errors in any owned/edited file (only pre-existing test-global warnings,
  identical to scaling.test.ts, and pre-existing errors in unrelated `settings/page.tsx`).

## Follow-ups / notes
- The "scaled to your machine" J/mm transfer assumes same laser type/wavelength; cross-type is not
  guarded here because the suggest flow already filters by operation type. Could add an explicit
  same-`source_type` guard if community data ever mixes wavelengths.
- A future batch job could populate `cuts.verified_count` (e.g. from clustered feedback) so scraped/
  community entries accrue confirmations independent of the live feedback query.
- `types.ts` was reviewed but needed no changes (Cut already has num_passes, gas/nozzle/focus, etc.).
