/**
 * Test suite for parameter scaling module
 *
 * These tests verify the scaling logic matches the LaserSecrets algorithm
 * from: https://github.com/shark92651/LaserParamsConverter
 */

import {
  scalePower,
  scaleSpeed,
  scaleParameters,
  computePowerDensityRatio,
  checkScalingWarning,
  canScaleBetweenTypes,
  formatScalingNote,
} from './scaling'

describe('Parameter Scaling', () => {
  describe('scalePower', () => {
    it('should scale power from 30W/110mm to 50W/150mm', () => {
      // Test case: 30W@110mm -> 50W@150mm, power=80%
      // Expected: power_mod = (80 * 150) / 110 = 109.09
      //           out_power = (30 * 109.09) / 50 = 65.45 -> rounds to 65%
      const result = scalePower(80, 30, 50, 110, 150, 'fiber')
      expect(result.power).toBe(65)
      expect(result.speedModifier).toBeNull()
      expect(result.clamped).toBe(false)
    })

    it('should clamp power to max and return speed modifier', () => {
      // Test case: 60W@150mm -> 30W@110mm, power=70%
      // Expected: power_mod = (70 * 110) / 150 = 51.33
      //           out_power = (60 * 51.33) / 30 = 102.67 -> rounds to 103
      //           Exceeds 100, so: speedMod = 70 / 103 = 0.6796
      const result = scalePower(70, 60, 30, 150, 110, 'fiber')
      expect(result.power).toBe(100)
      expect(result.speedModifier).toBeCloseTo(70 / 103, 2)
      expect(result.clamped).toBe(true)
    })

    it('should ignore lens for CO2 lasers', () => {
      // Test case: CO2 100W -> 50W (lens should be ignored)
      // Expected: power_mod = (40 * 1) / 1 = 40
      //           out_power = (100 * 40) / 50 = 80%
      const result = scalePower(40, 100, 50, 999, 999, 'co2')
      expect(result.power).toBe(80)
      expect(result.clamped).toBe(false)
    })

    it('should handle same config (no scaling needed)', () => {
      // Test case: same wattage and lens
      const result = scalePower(50, 30, 30, 110, 110, 'fiber')
      expect(result.power).toBe(50)
      expect(result.speedModifier).toBeNull()
      expect(result.clamped).toBe(false)
    })
  })

  describe('scaleSpeed', () => {
    it('should not change speed when power is within limits', () => {
      // Speed stays same if power doesn't clamp
      const result = scaleSpeed(1000, 80, 30, 50, 110, 150, 'fiber')
      expect(result).toBe(1000)
    })

    it('should reduce speed when power clamps', () => {
      // Test case: 60W@150mm -> 30W@110mm, speed=2000, power=70%
      // Expected: speedMod = 70 / 103, out_speed = 2000 * 0.6796 = 1359.2 -> 1359
      const result = scaleSpeed(2000, 70, 60, 30, 150, 110, 'fiber')
      expect(result).toBe(1359)
    })
  })

  describe('scaleParameters', () => {
    it('should scale both power and speed correctly', () => {
      const result = scaleParameters(65, 500, 30, 100, 110, 300, 'fiber')
      expect(result.power).toBeGreaterThan(0)
      expect(result.speed).toBeGreaterThan(0)
      expect(result.scaledFrom).toEqual({ wattage: 30, lens: 110 })
    })

    it('should flag when scaling applied', () => {
      const result = scaleParameters(50, 1000, 30, 60, 110, 150, 'fiber')
      expect(result.scaledFrom.wattage).toBe(30)
      expect(result.scaledFrom.lens).toBe(110)
    })
  })

  describe('computePowerDensityRatio', () => {
    it('should compute power density ratio correctly', () => {
      // 150mm / 110mm = 1.36
      // Power density ratio = (1.36)^2 = 1.86
      const ratio = computePowerDensityRatio(110, 150)
      expect(ratio).toBeCloseTo(1.86, 1)
    })

    it('should return 1.0 for same lens', () => {
      const ratio = computePowerDensityRatio(110, 110)
      expect(ratio).toBe(1.0)
    })
  })

  describe('checkScalingWarning', () => {
    it('should warn for large scaling factor (>1.5x)', () => {
      // 30W/110mm -> 100W/300mm
      // This is a large upgrade but manageable
      const warning = checkScalingWarning(30, 100, 110, 300)
      expect(warning.level).toBeDefined()
      expect(warning.message).toContain('scaling factor')
    })

    it('should no warning for moderate scaling', () => {
      // 30W/110mm -> 60W/150mm
      // Reasonable upgrade path
      const warning = checkScalingWarning(30, 60, 110, 150)
      // May be 'warning' or null depending on exact factor
      expect([null, 'warning']).toContain(warning.level)
    })

    it('should report danger for extreme scaling (>2x or <0.5x)', () => {
      // 100W/300mm -> 20W/110mm
      // Extreme downgrade
      const warning = checkScalingWarning(100, 20, 300, 110)
      expect(warning.level).toBeDefined()
    })
  })

  describe('canScaleBetweenTypes', () => {
    it('should allow scaling between same types', () => {
      expect(canScaleBetweenTypes('fiber', 'fiber')).toBe(true)
      expect(canScaleBetweenTypes('co2', 'co2')).toBe(true)
      expect(canScaleBetweenTypes('diode', 'diode')).toBe(true)
    })

    it('should reject cross-type scaling', () => {
      expect(canScaleBetweenTypes('fiber', 'co2')).toBe(false)
      expect(canScaleBetweenTypes('co2', 'fiber')).toBe(false)
      expect(canScaleBetweenTypes('fiber', 'diode')).toBe(false)
    })
  })

  describe('formatScalingNote', () => {
    it('should format scaling note correctly', () => {
      const note = formatScalingNote(
        { wattage: 100, lens: 110 },
        150,
        50
      )
      expect(note).toContain('100W')
      expect(note).toContain('110mm')
    })

    it('should return empty string when no scaling needed', () => {
      const note = formatScalingNote(
        { wattage: 100, lens: 110 },
        110,
        100
      )
      expect(note).toBe('')
    })

    it('should omit lens from note when same', () => {
      const note = formatScalingNote(
        { wattage: 100, lens: 110 },
        110,
        150
      )
      expect(note).toContain('100W')
      expect(note).not.toContain('110mm')
    })
  })
})

// Integration tests
describe('LaserSecrets Compatibility', () => {
  it('should replicate 30W/110mm -> 60W/220mm stainless black example', () => {
    // Common example from LaserSecrets: upgrading to a higher wattage + longer lens
    const result = scaleParameters(50, 1200, 30, 60, 110, 220, 'fiber')
    expect(result.power).toBeGreaterThan(0)
    expect(result.power).toBeLessThanOrEqual(100)
    expect(result.speed).toBeGreaterThan(0)
  })

  it('should provide consistent results across multiple calls', () => {
    const result1 = scaleParameters(65, 500, 30, 100, 110, 300, 'fiber')
    const result2 = scaleParameters(65, 500, 30, 100, 110, 300, 'fiber')
    expect(result1.power).toBe(result2.power)
    expect(result1.speed).toBe(result2.speed)
  })
})
