/**
 * Parameter Scaling Utility
 *
 * Replicates the LaserSecrets parameter conversion logic to scale laser
 * cutting/engraving parameters between different lens configurations.
 *
 * This module implements the physics-based scaling formulas from:
 * https://github.com/shark92651/LaserParamsConverter by David Christian (GPL-3)
 *
 * Core Formula (for fiber lasers):
 *   power_modifier = (input_power_pct * target_lens_mm) / source_lens_mm
 *   output_power_pct = (source_wattage * power_modifier) / target_wattage
 *
 * For CO2 lasers, lens correction is disabled (lens values forced to 1).
 */

type LaserType = 'fiber' | 'co2' | 'diode'

const DEFAULT_MAX_POWER_PCT = 100

/**
 * Scale power percentage when switching lens configurations
 *
 * Args:
 *   originalPowerPct: Power percentage on the source machine (0-100+)
 *   originalWattage: Source laser wattage in watts
 *   targetWattage: Target laser wattage in watts
 *   originalLensMm: Source lens focal length in mm (ignored for CO2)
 *   targetLensMm: Target lens focal length in mm (ignored for CO2)
 *   laserType: "fiber", "co2", or "diode"
 *   maxPowerPct: Maximum power percentage the target machine supports
 *
 * Returns:
 *   Object with scaled power and metadata about clamping
 */
export function scalePower(
  originalPowerPct: number,
  originalWattage: number,
  targetWattage: number,
  originalLensMm: number = 110,
  targetLensMm: number = 110,
  laserType: LaserType = 'fiber',
  maxPowerPct: number = DEFAULT_MAX_POWER_PCT
): { power: number; speedModifier: number | null; clamped: boolean } {
  // CO2 doesn't use lens scaling
  let sourceLens = originalLensMm
  let targetLens = targetLensMm
  if (laserType === 'co2') {
    sourceLens = 1
    targetLens = 1
  }

  // Step 1: Apply lens correction
  // A larger target lens = larger spot = need more power to maintain density
  const powerModifier = (originalPowerPct * targetLens) / sourceLens

  // Step 2: Scale by wattage ratio
  // Higher wattage target = less % needed for same absolute power
  const computedPower = (originalWattage * powerModifier) / targetWattage

  // Step 3: Round to integer (banker's rounding)
  const outputPowerInt = Math.round(computedPower)

  // Step 4: Check if power exceeds machine maximum
  let speedModifier: number | null = null
  let clamped = false
  let finalPower = outputPowerInt

  if (outputPowerInt > maxPowerPct) {
    // Cannot achieve required power, must compensate with slower speed
    speedModifier = originalPowerPct / outputPowerInt
    finalPower = maxPowerPct
    clamped = true
  }

  return { power: finalPower, speedModifier, clamped }
}

/**
 * Scale speed when switching lens configurations
 *
 * Speed only changes when the required power exceeds the target machine's
 * maximum. In that case, we slow down to compensate (more energy per unit area).
 */
export function scaleSpeed(
  originalSpeed: number,
  originalPowerPct: number,
  originalWattage: number,
  targetWattage: number,
  originalLensMm: number = 110,
  targetLensMm: number = 110,
  laserType: LaserType = 'fiber',
  maxPowerPct: number = DEFAULT_MAX_POWER_PCT
): number {
  const { speedModifier } = scalePower(
    originalPowerPct,
    originalWattage,
    targetWattage,
    originalLensMm,
    targetLensMm,
    laserType,
    maxPowerPct
  )

  if (speedModifier !== null) {
    return Math.round(originalSpeed * speedModifier)
  }
  return Math.round(originalSpeed)
}

/**
 * Scale a complete set of parameters from source to target configuration
 */
export interface ScaledParams {
  power: number
  speed: number
  powerClamped: boolean
  speedReduced: boolean
  scaledFrom: {
    wattage: number
    lens: number
  }
}

export function scaleParameters(
  originalPower: number,
  originalSpeed: number,
  originalWattage: number,
  targetWattage: number,
  originalLensMm: number = 110,
  targetLensMm: number = 110,
  laserType: LaserType = 'fiber',
  maxPowerPct: number = DEFAULT_MAX_POWER_PCT
): ScaledParams {
  const powerResult = scalePower(
    originalPower,
    originalWattage,
    targetWattage,
    originalLensMm,
    targetLensMm,
    laserType,
    maxPowerPct
  )

  const speedResult = scaleSpeed(
    originalSpeed,
    originalPower,
    originalWattage,
    targetWattage,
    originalLensMm,
    targetLensMm,
    laserType,
    maxPowerPct
  )

  return {
    power: powerResult.power,
    speed: speedResult,
    powerClamped: powerResult.clamped,
    speedReduced: speedResult !== Math.round(originalSpeed),
    scaledFrom: {
      wattage: originalWattage,
      lens: originalLensMm,
    },
  }
}

/**
 * Compute the power density ratio when switching lenses
 *
 * Power density is inversely proportional to the square of the spot diameter.
 * Higher ratio means lower power density (larger spot).
 */
export function computePowerDensityRatio(
  originalLensMm: number,
  targetLensMm: number
): number {
  return (targetLensMm / originalLensMm) ** 2
}

/**
 * Check if scaling factor is safe (not too extreme)
 *
 * Returns warning level:
 * - null: safe
 * - 'warning': scaling factor > 1.5x or < 0.67x
 * - 'danger': scaling factor > 2x or < 0.5x
 */
export function checkScalingWarning(
  originalWattage: number,
  targetWattage: number,
  originalLensMm: number,
  targetLensMm: number
): { level: 'warning' | 'danger' | null; message: string } {
  // Estimate scaling factor (this is approximate since it depends on power %)
  const lensFactor = targetLensMm / originalLensMm
  const wattageFactor = targetWattage / originalWattage
  const combinedFactor = lensFactor / wattageFactor

  if (combinedFactor > 2 || combinedFactor < 0.5) {
    return {
      level: 'danger',
      message: `Large scaling factor (${combinedFactor.toFixed(1)}x) — test on scrap material first`,
    }
  }

  if (combinedFactor > 1.5 || combinedFactor < 0.67) {
    return {
      level: 'warning',
      message: `Moderate scaling factor (${combinedFactor.toFixed(1)}x) — verify results`,
    }
  }

  return { level: null, message: '' }
}

/**
 * Check if two laser types are compatible for scaling
 *
 * Generally:
 * - Fiber -> Fiber: OK
 * - CO2 -> CO2: OK
 * - Diode -> Diode: OK
 * - Cross-type (e.g., Fiber -> CO2): NOT safe, wavelength differences
 */
export function canScaleBetweenTypes(
  sourceLaserType: LaserType,
  targetLaserType: LaserType
): boolean {
  // Same type is always OK
  if (sourceLaserType === targetLaserType) return true

  // Different types are incompatible
  return false
}

/**
 * Format scaling note for UI display
 *
 * Example output: "Scaled from 110mm lens (stored: 3800W @ 100mm)"
 */
export function formatScalingNote(
  scaledFrom: { wattage: number; lens: number },
  targetLens: number,
  targetWattage: number
): string {
  if (scaledFrom.lens === targetLens && scaledFrom.wattage === targetWattage) {
    return '' // No scaling needed
  }

  const lensNote = scaledFrom.lens === targetLens ? '' : ` @ ${scaledFrom.lens}mm lens`
  return `(scaled from ${scaledFrom.wattage}W${lensNote})`
}
