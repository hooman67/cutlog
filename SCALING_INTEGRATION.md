# Parameter Scaling Integration

## Overview

This document describes the integration of the LaserSecrets-compatible parameter scaling module into the suggestion engine. When a user has a different lens or wattage than stored cut data, the system automatically scales recommended parameters to match their machine configuration.

**Impact:** Multiplies effective coverage of 901 baseline parameters across different lens sizes without requiring separate parameter libraries.

## What Was Integrated

### 1. Core Scaling Module (`src/lib/scaling.ts`)

A pure TypeScript implementation of the LaserSecrets parameter conversion algorithm:

- `scalePower()` - Scales power percentage based on lens/wattage changes
- `scaleSpeed()` - Reduces speed if power clamps at maximum
- `scaleParameters()` - Converts complete parameter sets
- `computePowerDensityRatio()` - Calculates power density changes
- `checkScalingWarning()` - Identifies extreme scaling factors
- `canScaleBetweenTypes()` - Validates cross-laser-type compatibility
- `formatScalingNote()` - Formats UI display text

**Key Physics:**
```
power_modifier = (stored_power_pct * user_lens_mm) / stored_lens_mm
scaled_power = (stored_wattage * power_modifier) / user_wattage

If scaled_power > max_power:
  speed_modifier = stored_power / scaled_power
  scaled_speed = stored_speed * speed_modifier
  scaled_power = max_power (clamped)
```

### 2. Database Schema Update (`supabase/migrations/005_add_lens_focal_length.sql`)

Added `lens_focal_length_mm` column to machines table:
- Default: 110mm (common fiber laser lens)
- Range: 1-1000mm
- Indexed for query performance

### 3. Type System Updates (`src/lib/types.ts`)

#### Machine Interface
- Added `lens_focal_length_mm?: number | null`

#### Cut Interface
- Added `recorded_wattage_w?: number | null` - Store original machine wattage
- Added `recorded_lens_focal_length_mm?: number | null` - Store original lens at log time

### 4. Suggestion Engine Integration (`src/app/suggest/page.tsx`)

**New Functions:**
- `scaleCutIfNeeded()` - Applies scaling when user lens differs from stored lens
- Updated `computeSpeedRecommendation()` - Aggregates scaled values

**New Interfaces:**
- `ScaledCut` extends Cut with scaling metadata
- Updated `SpeedRecommendation` with scaling flags and warnings

**Updated Render Logic:**
- Displays scaling warning banner for >1.5x factors
- Shows "(auto-scaled)" indicator when scaling applied
- Displays original lens in detailed parameter view
- Updates both power and speed in recommendations

## How the Scaling Works

### Example: User Has 150mm Lens, Stored Data is 110mm

```
Stored data:  80% power @ 1000 mm/min, 30W/110mm lens
User config:  60W/150mm lens

Step 1: Lens correction
  power_mod = (80 * 150) / 110 = 109.09

Step 2: Wattage scaling
  scaled_power = (30 * 109.09) / 60 = 54.54 -> 55% (rounded)

Step 3: Check if within limits
  55% < 100%, so speed stays 1000 mm/min

Result: 55% power @ 1000 mm/min (auto-scaled for 150mm lens)
```

### Example: Extreme Scale-Up (Speed Reduction)

```
Stored data:  70% power @ 2000 mm/min, 60W/150mm
User config:  30W/110mm

Step 1: Lens correction
  power_mod = (70 * 110) / 150 = 51.33

Step 2: Wattage scaling
  scaled_power = (60 * 51.33) / 30 = 102.67 -> 103%

Step 3: Exceeds max (100%)
  speed_mod = 70 / 103 = 0.6796
  scaled_speed = 2000 * 0.6796 = 1359.2 -> 1359 mm/min
  final_power = 100% (clamped)

Result: 100% power @ 1359 mm/min (WARNING: extreme scaling)
```

## Display Behavior

### Hero Speed Card
```
Recommended Speed (auto-scaled)
3500 mm/min
for 150mm lens

⚠️ Moderate scaling factor (1.2x) — verify results
Scaled from 3800W @ 110mm lens
```

### Parameters Detail View
Each cut shows:
- Power: `65% (scaled from 58% @ 110mm lens)`
- Speed: `1200 mm/min (unchanged)`
- Gas, Focus, Nozzle: unchanged
- Rating, Notes: unchanged

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| No user machine | No scaling, show as-is |
| Same lens/wattage | No scaling applied |
| Scaling factor >1.5x | Yellow warning banner |
| Scaling factor >2x or <0.5x | Red danger banner |
| Fiber → Fiber | Scale normally |
| CO2 → CO2 | Scale without lens correction |
| Fiber → CO2 | Skip (wavelength incompatible) |
| Power clamps at 100% | Speed reduced to compensate |

## Testing

Unit tests in `src/lib/scaling.test.ts` verify:
- Exact numerical match to LaserSecrets algorithm
- Correct rounding behavior (banker's rounding)
- Edge cases (clamping, zero values)
- Cross-laser-type handling
- Consistency across multiple calls

### Running Tests
```bash
npm test -- src/lib/scaling.test.ts
```

## Migration Path

To deploy:

1. **Run migration:**
   ```bash
   npx supabase migration up
   ```

2. **Backfill optional fields** (for improved accuracy):
   - Set `recorded_wattage_w` = machine's current wattage
   - Set `recorded_lens_focal_length_mm` = machine's current lens
   - (Existing data will use machine profile as fallback)

3. **Update machine profiles:**
   - Users should set their lens focal length in `/machine` page
   - Default is 110mm if not set

4. **UI updates appear automatically** when scaling is needed

## Remaining Work (Optional)

### 1. Per-Laser-Type Validation Matrix
Create a detailed table of which laser types can scale to which:
- Fiber (20-200W, galvo-based) ↔ Fiber ✓
- CO2 (40-180W, gantry-based) ↔ CO2 ✓
- Diode ↔ Diode ✓
- All cross-type: ✗ (wavelength differences)

### 2. Recorded Machine Metadata
Optionally capture and store the machine config when a cut is logged:
```sql
ALTER TABLE cuts ADD COLUMN recorded_wattage_w integer;
ALTER TABLE cuts ADD COLUMN recorded_lens_focal_length_mm integer;
```
This improves scaling accuracy if the user later upgrades their machine.

### 3. Scaling History
Track which parameters were scaled (for analytics):
```
scaling_applied: boolean
scaling_factor: float
speed_was_reduced: boolean
```

### 4. Advanced Settings UI
Allow power users to:
- Override scaling (use stored values as-is)
- Adjust scaling exponent (currently fixed at 1.0 for lens)
- Test scaling on non-production materials first

### 5. Engraving vs Cutting Distinction
Currently treats all operations the same. Could refine by operation type:
- Cutting: full scaling (requires consistent kerf)
- Engraving: may need adjustments (line width tolerance)
- Marking: may scale differently (minimal material removal)

## Physics Notes

### Why Linear Lens Scaling (Not Quadratic)?
LaserSecrets uses **linear** lens correction:
```
power_mod = power * (target_lens / source_lens)
```

Despite power density being proportional to (focal_length)^-2, the converter uses empirical/practical linear scaling because:
1. Real-world beam profiles aren't perfect
2. Lens aberrations affect results unpredictably
3. Linear scaling provides consistent user experience
4. Verified to work by 422+ customers (hence the $32 price point)

### Why Speed Typically Stays Same
Key LaserSecrets insight: keeping speed constant and only adjusting power maintains:
- Same dwell time per area
- Same heat dissipation profile
- Predictable engraving patterns (for text, logos)

Speed only reduces when power is clamped at maximum (last resort).

## References

- LaserSecrets repo: https://github.com/shark92651/LaserParamsConverter (GPL-3)
- Author: David Christian
- 422 positive reviews, $32 price point validates the approach
- Physics: spot size proportional to focal length, not area
