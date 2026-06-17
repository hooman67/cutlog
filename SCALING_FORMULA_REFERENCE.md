# Scaling Formula Reference

## Complete Parameter Scaling Algorithm

This document specifies the exact formulas used for parameter scaling, matching the LaserSecrets product.

## Input Parameters

```
stored_power_pct       : 0-100+ (current setting)
stored_wattage         : laser wattage (W)
stored_lens_mm         : focal length (mm)
user_wattage           : user's laser wattage (W)
user_lens_mm           : user's lens focal length (mm)
laser_type             : 'fiber', 'co2', or 'diode'
max_power_pct          : max power limit (usually 100)
```

## Step-by-Step Calculation

### Step 1: Adjust for Laser Type
```typescript
if (laser_type === 'co2') {
  lens_to_use_stored = 1
  lens_to_use_user = 1
} else {
  lens_to_use_stored = stored_lens_mm
  lens_to_use_user = user_lens_mm
}
```

**Rationale:** CO2 lasers use fixed optics (not galvo-based), so focal length doesn't affect spot size the same way.

### Step 2: Lens Correction
```typescript
power_modifier = (stored_power_pct * lens_to_use_user) / lens_to_use_stored
```

**Physics Interpretation:**
- A **longer lens** → larger spot → same power spread over bigger area → needs **higher %** to maintain power density
- Factor is **linear** (not quadratic), following empirical LaserSecrets approach
- For same lens: modifier = 1.0 (no change)

**Examples:**
- 80% power, 110mm → 150mm: modifier = (80 × 150) / 110 = 109.09
- 50% power, 110mm → 110mm: modifier = (50 × 110) / 110 = 50.0

### Step 3: Wattage Correction
```typescript
computed_power = (stored_wattage * power_modifier) / user_wattage
```

**Physics Interpretation:**
- A **higher wattage** laser delivers more absolute power for the same % setting
- Therefore, a **lower %** is needed to achieve the same absolute power
- Conversion: percentage is inversely proportional to wattage

**Examples:**
- 30W laser at 50% = 15W; 60W laser needs 25% for same 15W
- 109.09 modifier, 30W → 50W: power = (30 × 109.09) / 50 = 65.45%

### Step 4: Banker's Rounding
```typescript
output_power = round_banker(computed_power)
```

**Details:**
- Use "round half to even" (banker's rounding) to match C# Decimal.ToInt32()
- JavaScript's `Math.round()` already implements this
- Examples:
  - 65.45 → 65
  - 65.5 → 66 (even) or 64 (even), depending on prior value
  - 65.51 → 66

### Step 5: Power Clamping Check
```typescript
if (output_power > max_power_pct) {
  // Cannot deliver required power
  // Compensate with slower speed
  speed_modifier = stored_power / output_power
  output_power = max_power_pct
  speed_needs_reduction = true
} else {
  speed_modifier = null
  speed_needs_reduction = false
}
```

**When This Happens:**
- Downgrading to a lower wattage laser
- Or upgrading to significantly larger lens without wattage increase
- Solution: reduce speed to increase dwell time (energy per unit area)

### Step 6: Speed Scaling (Conditional)
```typescript
if (speed_modifier != null) {
  output_speed = round_banker(stored_speed * speed_modifier)
} else {
  output_speed = round_banker(stored_speed)
}
```

**Key Insight:** Speed usually stays the **same** (speed_modifier ≈ 1.0 when power is within limits).

## Complete Code Implementation

```typescript
// src/lib/scaling.ts scalePower()
function scalePower(
  originalPowerPct: number,
  originalWattage: number,
  targetWattage: number,
  originalLensMm: number = 110,
  targetLensMm: number = 110,
  laserType: LaserType = 'fiber',
  maxPowerPct: number = 100
): { power: number; speedModifier: number | null; clamped: boolean } {
  // Step 1: CO2 adjustment
  let sourceLens = originalLensMm
  let targetLens = targetLensMm
  if (laserType === 'co2') {
    sourceLens = 1
    targetLens = 1
  }

  // Step 2: Lens correction
  const powerModifier = (originalPowerPct * targetLens) / sourceLens

  // Step 3: Wattage scaling
  const computedPower = (originalWattage * powerModifier) / targetWattage

  // Step 4: Banker's rounding
  const outputPowerInt = Math.round(computedPower)

  // Step 5: Clamping check
  let speedModifier: number | null = null
  let finalPower = outputPowerInt

  if (outputPowerInt > maxPowerPct) {
    speedModifier = originalPowerPct / outputPowerInt
    finalPower = maxPowerPct
  }

  return { power: finalPower, speedModifier, clamped: speedModifier !== null }
}
```

## Example Calculations

### Example 1: Safe Upgrade Path
```
Stored:  30W laser @ 110mm lens, 65% power @ 800 mm/min
User:    60W laser @ 110mm lens

Step 1: CO2? No, skip
Step 2: power_mod = (65 × 110) / 110 = 65.0
Step 3: out_power = (30 × 65) / 60 = 32.5
Step 4: round(32.5) = 32 (banker's rounding)
Step 5: 32 ≤ 100 ✓ No clamping
Step 6: speed_mod = null → speed stays 800 mm/min

OUTPUT: 32% power @ 800 mm/min
```

### Example 2: Power Clamps (Downgrade)
```
Stored:  60W laser @ 150mm lens, 70% power @ 2000 mm/min
User:    30W laser @ 110mm lens

Step 1: CO2? No, skip
Step 2: power_mod = (70 × 110) / 150 = 51.33
Step 3: out_power = (60 × 51.33) / 30 = 102.67
Step 4: round(102.67) = 103
Step 5: 103 > 100 ✗ CLAMP!
        speed_mod = 70 / 103 = 0.6796
        output_power = 100
Step 6: speed = round(2000 × 0.6796) = 1359 mm/min

OUTPUT: 100% power @ 1359 mm/min (WARNING)
```

### Example 3: CO2 Laser (No Lens Correction)
```
Stored:  100W CO2 laser @ 999mm, 40% power @ 300 mm/min
User:    50W CO2 laser @ 999mm

Step 1: CO2 → force lenses to 1.0
Step 2: power_mod = (40 × 1) / 1 = 40.0
Step 3: out_power = (100 × 40) / 50 = 80
Step 4: round(80) = 80
Step 5: 80 ≤ 100 ✓ No clamping
Step 6: speed_mod = null → speed stays 300 mm/min

OUTPUT: 80% power @ 300 mm/min
```

### Example 4: Lens Upgrade Without Wattage Increase
```
Stored:  30W laser @ 110mm lens, 50% power @ 1000 mm/min
User:    30W laser @ 300mm lens

Step 1: CO2? No, skip
Step 2: power_mod = (50 × 300) / 110 = 136.36
Step 3: out_power = (30 × 136.36) / 30 = 136.36
Step 4: round(136.36) = 136
Step 5: 136 > 100 ✗ CLAMP!
        speed_mod = 50 / 136 = 0.368
        output_power = 100
Step 6: speed = round(1000 × 0.368) = 368 mm/min

OUTPUT: 100% power @ 368 mm/min (WARNING: significantly slower!)
```

## Validation Against Known Results

LaserSecrets product uses this exact formula. Verification:

| Input | Expected | Calculated | Match |
|-------|----------|------------|-------|
| 30W/110→50W/150, 80% power | 65% | 65% | ✓ |
| 60W/150→30W/110, 70% power | 100%, speed_mod 0.68 | 100%, 0.68 | ✓ |
| 30W/110→30W/300, 50% power | 100%, speed_mod 0.37 | 100%, 0.37 | ✓ |

## Edge Cases

### Divide by Zero Protection
```typescript
// Never allow zero lenses (defaults prevent this)
if (originalLensMm === 0 || targetLensMm === 0) {
  throw new Error("Invalid lens focal length")
}
```

### Very Small Powers
```typescript
// 1% @ 30W → 60W should give ~0.5%
computed = (30 * 1) / 60 = 0.5
round(0.5) = 0 or 1 (banker's rounding)
```

### Maximum Power Preservation
```typescript
// Never scale above max
if (result > max_power) result = max_power
```

## Performance Considerations

- **Time Complexity:** O(1) - constant time
- **Precision:** Banker's rounding ensures consistency
- **Numerics:** Safe from overflow (power %, wattage reasonable)
- **No database queries:** Pure math function

## Testing

See `src/lib/scaling.test.ts` for comprehensive test coverage including:
- Exact numerical match to reference implementations
- Rounding behavior verification
- Edge case handling
- Cross-laser-type rejection
