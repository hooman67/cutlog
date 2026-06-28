/**
 * Test suite for the J/mm linear energy-density normalization layer.
 *
 * These verify the honest cross-machine transfer math: a LightBurn % setting
 * does not transfer directly, but energy-per-length (J/mm) does.
 */

import {
  linearEnergyDensity,
  speedFromEnergyDensity,
  crossMachineSpeed,
  formatEnergyDensity,
} from './energy'

describe('linearEnergyDensity', () => {
  it('computes basic J/mm correctly', () => {
    // 80% of 2000W = 1600W optical. 6000 mm/min = 100 mm/s.
    // 1600 / 100 = 16 J/mm
    const result = linearEnergyDensity({ powerPct: 80, wattageW: 2000, speedMmMin: 6000 })
    expect(result).toBeCloseTo(16, 5)
  })

  it('handles a clean round number case', () => {
    // 100% of 1000W = 1000W. 60 mm/min = 1 mm/s => 1000 J/mm
    const result = linearEnergyDensity({ powerPct: 100, wattageW: 1000, speedMmMin: 60 })
    expect(result).toBeCloseTo(1000, 5)
  })

  it('scales linearly with number of passes', () => {
    const single = linearEnergyDensity({ powerPct: 80, wattageW: 2000, speedMmMin: 6000, numPasses: 1 })
    const triple = linearEnergyDensity({ powerPct: 80, wattageW: 2000, speedMmMin: 6000, numPasses: 3 })
    expect(triple).toBeCloseTo(single! * 3, 5)
  })

  it('defaults numPasses to 1 when omitted', () => {
    const withDefault = linearEnergyDensity({ powerPct: 50, wattageW: 4000, speedMmMin: 3000 })
    const explicit = linearEnergyDensity({ powerPct: 50, wattageW: 4000, speedMmMin: 3000, numPasses: 1 })
    expect(withDefault).toBe(explicit)
  })

  it('returns null when powerPct is null', () => {
    expect(linearEnergyDensity({ powerPct: null, wattageW: 2000, speedMmMin: 6000 })).toBeNull()
  })

  it('returns null when wattageW is null', () => {
    expect(linearEnergyDensity({ powerPct: 80, wattageW: null, speedMmMin: 6000 })).toBeNull()
  })

  it('returns null when speedMmMin is null', () => {
    expect(linearEnergyDensity({ powerPct: 80, wattageW: 2000, speedMmMin: null })).toBeNull()
  })

  it('returns null when speed is zero or negative (no divide-by-zero)', () => {
    expect(linearEnergyDensity({ powerPct: 80, wattageW: 2000, speedMmMin: 0 })).toBeNull()
    expect(linearEnergyDensity({ powerPct: 80, wattageW: 2000, speedMmMin: -100 })).toBeNull()
  })

  it('returns null for non-positive power or wattage', () => {
    expect(linearEnergyDensity({ powerPct: 0, wattageW: 2000, speedMmMin: 6000 })).toBeNull()
    expect(linearEnergyDensity({ powerPct: 80, wattageW: 0, speedMmMin: 6000 })).toBeNull()
  })
})

describe('speedFromEnergyDensity', () => {
  it('solves for the speed that achieves a target J/mm', () => {
    // 16 J/mm at 80% of 2000W (=1600W). speed = 1600*60/16 = 6000 mm/min
    const result = speedFromEnergyDensity({ jPerMm: 16, powerPct: 80, wattageW: 2000 })
    expect(result).toBeCloseTo(6000, 5)
  })

  it('accounts for numPasses', () => {
    // With 3 passes, can move 3x faster to deposit the same total J/mm
    const single = speedFromEnergyDensity({ jPerMm: 16, powerPct: 80, wattageW: 2000, numPasses: 1 })
    const triple = speedFromEnergyDensity({ jPerMm: 16, powerPct: 80, wattageW: 2000, numPasses: 3 })
    expect(triple).toBeCloseTo(single! * 3, 5)
  })

  it('returns null on null inputs', () => {
    expect(speedFromEnergyDensity({ jPerMm: null, powerPct: 80, wattageW: 2000 })).toBeNull()
    expect(speedFromEnergyDensity({ jPerMm: 16, powerPct: null, wattageW: 2000 })).toBeNull()
    expect(speedFromEnergyDensity({ jPerMm: 16, powerPct: 80, wattageW: null })).toBeNull()
  })

  it('returns null on non-positive J/mm', () => {
    expect(speedFromEnergyDensity({ jPerMm: 0, powerPct: 80, wattageW: 2000 })).toBeNull()
  })
})

describe('round-trip: normalize then solve at same wattage returns original speed', () => {
  it('recovers the original speed', () => {
    const powerPct = 75
    const wattageW = 3000
    const speedMmMin = 4200
    const jPerMm = linearEnergyDensity({ powerPct, wattageW, speedMmMin })
    const recovered = speedFromEnergyDensity({ jPerMm, powerPct, wattageW })
    expect(recovered).toBeCloseTo(speedMmMin, 5)
  })

  it('recovers the original speed with multi-pass', () => {
    const powerPct = 60
    const wattageW = 1500
    const speedMmMin = 2000
    const numPasses = 2
    const jPerMm = linearEnergyDensity({ powerPct, wattageW, speedMmMin, numPasses })
    const recovered = speedFromEnergyDensity({ jPerMm, powerPct, wattageW, numPasses })
    expect(recovered).toBeCloseTo(speedMmMin, 5)
  })
})

describe('crossMachineSpeed', () => {
  it('gives ~3x faster speed for a 2kW -> 6kW transfer at the same power %', () => {
    const result = crossMachineSpeed({
      sourcePowerPct: 80,
      sourceWattageW: 2000,
      sourceSpeedMmMin: 1000,
      targetPowerPct: 80,
      targetWattageW: 6000,
    })
    // 3x the wattage at the same power% => 3x the speed to keep J/mm constant
    expect(result).toBeCloseTo(3000, 5)
  })

  it('gives the same speed when source and target machines are identical', () => {
    const result = crossMachineSpeed({
      sourcePowerPct: 70,
      sourceWattageW: 4000,
      sourceSpeedMmMin: 2500,
      targetPowerPct: 70,
      targetWattageW: 4000,
    })
    expect(result).toBeCloseTo(2500, 5)
  })

  it('halving target power requires halving speed to keep J/mm constant', () => {
    const result = crossMachineSpeed({
      sourcePowerPct: 80,
      sourceWattageW: 2000,
      sourceSpeedMmMin: 1000,
      targetPowerPct: 40,
      targetWattageW: 2000,
    })
    expect(result).toBeCloseTo(500, 5)
  })

  it('accounts for differing pass counts between source and target', () => {
    // Source: 1 pass. Target chooses 2 passes at same power/wattage =>
    // can run 2x faster per pass to deposit same total energy.
    const result = crossMachineSpeed({
      sourcePowerPct: 80,
      sourceWattageW: 2000,
      sourceSpeedMmMin: 1000,
      sourceNumPasses: 1,
      targetPowerPct: 80,
      targetWattageW: 2000,
      targetNumPasses: 2,
    })
    expect(result).toBeCloseTo(2000, 5)
  })

  it('returns null when source cannot be normalized', () => {
    const result = crossMachineSpeed({
      sourcePowerPct: null,
      sourceWattageW: 2000,
      sourceSpeedMmMin: 1000,
      targetPowerPct: 80,
      targetWattageW: 6000,
    })
    expect(result).toBeNull()
  })
})

describe('formatEnergyDensity', () => {
  it('formats a typical value with 1 decimal', () => {
    expect(formatEnergyDensity(12.37)).toBe('12.4 J/mm')
  })

  it('formats sub-1 values with 2 decimals', () => {
    expect(formatEnergyDensity(0.456)).toBe('0.46 J/mm')
  })

  it('returns em-dash for null/invalid', () => {
    expect(formatEnergyDensity(null)).toBe('—')
    expect(formatEnergyDensity(undefined)).toBe('—')
    expect(formatEnergyDensity(Infinity)).toBe('—')
  })
})
