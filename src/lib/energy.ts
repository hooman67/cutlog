/**
 * Linear Energy Density (J/mm) normalization layer
 *
 * THE CORE HONEST-TRANSFER INSIGHT:
 * LightBurn (and most laser controllers) store power as a *percentage* of the
 * machine's full power. A setting like "80% power, 4000 mm/min" therefore does
 * NOT transfer across machines of different wattage — 80% of a 2kW laser is a
 * very different amount of energy than 80% of a 6kW laser.
 *
 * Energy-per-length normalizes this. Linear energy density is the amount of
 * laser energy deposited per millimetre of travel:
 *
 *   J/mm = (powerPct/100 * wattageW) / (speedMmMin / 60) * numPasses
 *
 *   - powerPct/100 * wattageW    -> actual optical power in watts (J/s)
 *   - speedMmMin / 60            -> travel speed in mm/s
 *   - watts / (mm/s)             -> joules per mm
 *   - * numPasses                -> total energy if the cut is run multiple times
 *
 * To transfer a setting to YOUR machine, hold J/mm constant: pick a power %,
 * and solve for the speed that deposits the same energy per mm. That is the
 * honest "what speed should I use on my laser?" calculation.
 *
 * IMPORTANT — this is an APPROXIMATION and only a STARTING POINT:
 *   - Valid only for the SAME laser type / wavelength (fiber->fiber, CO2->CO2).
 *     Cross-wavelength transfer is meaningless because absorption differs.
 *   - It ignores spot size, beam quality, focus, assist gas, pulse shaping and
 *     other real-world factors. Two machines at the same J/mm can still cut
 *     differently.
 *   - Operators universally agree: every machine is different. ALWAYS run a
 *     material test (see the material-test grid generator). Treat the output as
 *     a trusted starting point that reduces the number of test squares, NOT as
 *     a magic number.
 *
 * AREA-BASED ENGRAVING IS OUT OF SCOPE: raster/fill engraving deposits energy
 * over an AREA, governed by the line interval (J/mm^2 = J/mm / line_interval).
 * That requires a different normalization and is intentionally not handled here.
 * These functions are LINEAR (per-length) and intended for cutting / scoring /
 * vector marking where the beam follows a path.
 */

export interface LinearEnergyInput {
  powerPct: number | null | undefined
  wattageW: number | null | undefined
  speedMmMin: number | null | undefined
  numPasses?: number | null | undefined
}

/**
 * Compute linear energy density in J/mm.
 *
 * J/mm = (powerPct/100 * wattageW) / (speedMmMin/60) * numPasses
 *
 * Returns null if any required input is missing or non-positive speed (would
 * divide by zero / produce a meaningless infinite energy density).
 */
export function linearEnergyDensity(input: LinearEnergyInput): number | null {
  const { powerPct, wattageW, speedMmMin } = input
  const numPasses = input.numPasses ?? 1

  if (
    powerPct === null || powerPct === undefined ||
    wattageW === null || wattageW === undefined ||
    speedMmMin === null || speedMmMin === undefined
  ) {
    return null
  }

  if (!isFinite(powerPct) || !isFinite(wattageW) || !isFinite(speedMmMin)) {
    return null
  }

  // Non-positive speed or wattage is physically meaningless here.
  if (speedMmMin <= 0 || wattageW <= 0 || powerPct <= 0) {
    return null
  }

  const passes = numPasses && numPasses > 0 ? numPasses : 1

  const opticalWatts = (powerPct / 100) * wattageW
  const speedMmPerSec = speedMmMin / 60

  return (opticalWatts / speedMmPerSec) * passes
}

export interface SpeedFromEnergyInput {
  jPerMm: number | null | undefined
  powerPct: number | null | undefined
  wattageW: number | null | undefined
  numPasses?: number | null | undefined
}

/**
 * Given a target J/mm, a chosen power % and the target machine's wattage,
 * compute the speed (mm/min) that deposits the same linear energy density.
 *
 * This is the honest "transfer this setting to MY machine" calculation:
 * the operator decides what power % they want to run on their machine, and we
 * tell them the speed that matches the proven energy-per-length.
 *
 * Derivation (single pass):
 *   J/mm = opticalWatts / (speed_mm_min / 60)
 *   speed_mm_min = opticalWatts * 60 / (J/mm)
 * With passes, total energy scales by passes, so per-pass speed is multiplied
 * by numPasses to keep total J/mm equal.
 *
 * Returns null on missing inputs or non-positive J/mm.
 */
export function speedFromEnergyDensity(input: SpeedFromEnergyInput): number | null {
  const { jPerMm, powerPct, wattageW } = input
  const numPasses = input.numPasses ?? 1

  if (
    jPerMm === null || jPerMm === undefined ||
    powerPct === null || powerPct === undefined ||
    wattageW === null || wattageW === undefined
  ) {
    return null
  }

  if (!isFinite(jPerMm) || !isFinite(powerPct) || !isFinite(wattageW)) {
    return null
  }

  if (jPerMm <= 0 || powerPct <= 0 || wattageW <= 0) {
    return null
  }

  const passes = numPasses && numPasses > 0 ? numPasses : 1

  const opticalWatts = (powerPct / 100) * wattageW
  // J/mm = opticalWatts / (speedMmMin/60) * passes
  // => speedMmMin = opticalWatts * 60 * passes / jPerMm
  return (opticalWatts * 60 * passes) / jPerMm
}

export interface CrossMachineInput {
  sourcePowerPct: number | null | undefined
  sourceWattageW: number | null | undefined
  sourceSpeedMmMin: number | null | undefined
  sourceNumPasses?: number | null | undefined
  targetPowerPct: number | null | undefined
  targetWattageW: number | null | undefined
  targetNumPasses?: number | null | undefined
}

/**
 * Convenience: normalize a source setting to J/mm, then solve for the speed
 * (mm/min) the target machine needs to achieve the same energy density at the
 * chosen target power %.
 *
 * Example: a setting proven on a 2kW laser at 80% / 1000 mm/min, transferred to
 * a 6kW laser at the same 80% power, yields ~3x the speed (3000 mm/min), because
 * the target machine puts down 3x the optical watts and must move faster to
 * deposit the same J/mm.
 *
 * STARTING POINT ONLY — requires a material test on the target machine.
 *
 * Returns null if the source cannot be normalized or the target cannot be solved.
 */
export function crossMachineSpeed(input: CrossMachineInput): number | null {
  const jPerMm = linearEnergyDensity({
    powerPct: input.sourcePowerPct,
    wattageW: input.sourceWattageW,
    speedMmMin: input.sourceSpeedMmMin,
    numPasses: input.sourceNumPasses,
  })

  if (jPerMm === null) return null

  return speedFromEnergyDensity({
    jPerMm,
    powerPct: input.targetPowerPct,
    wattageW: input.targetWattageW,
    numPasses: input.targetNumPasses,
  })
}

/**
 * Format a J/mm value as a short human-readable string, e.g. "12.4 J/mm".
 * Returns an em-dash for null/invalid input.
 */
export function formatEnergyDensity(jPerMm: number | null | undefined): string {
  if (jPerMm === null || jPerMm === undefined || !isFinite(jPerMm)) {
    return '—'
  }
  // Use 1 decimal for typical values, more precision for very small ones.
  const decimals = jPerMm < 1 ? 2 : 1
  return `${jPerMm.toFixed(decimals)} J/mm`
}
