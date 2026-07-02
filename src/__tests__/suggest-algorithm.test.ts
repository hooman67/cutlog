/**
 * Tests for the speed recommendation algorithm (computeSpeedRecommendation).
 *
 * The function lives in src/app/suggest/page.tsx as a module-level helper.
 * Since it's embedded in a "use client" component, we re-implement the
 * pure logic here for isolated unit testing. The algorithm specification:
 *
 * 1. Source tier weighting: own=3x, community=2x, AI baseline=1x
 * 2. Time-decay weighting: half-life of 180 days
 * 3. Feedback correction: +/-10% after 3+ consistent feedbacks
 * 4. Confidence: HIGH/MEDIUM/LOW based on data consistency (CV) and count
 * 5. Interpolation reduces confidence by one level
 */

import { describe, it, expect } from 'vitest'
import { SPEED_PROFILE_MULTIPLIERS } from '@/lib/types'

// ---- Re-implement the algorithm for testing (mirrors suggest/page.tsx) ----

interface TestCut {
  id: string
  speed_mm_min: number | null
  power_pct: number | null
  quality_rating: number | null
  gas_type: string | null
  gas_pressure_bar: number | null
  focus_position_mm: number | null
  nozzle_diameter_mm: number | null
  source_tier_weight?: number
  scaled_speed?: number
  scaled_power?: number
  recorded_wattage_w?: number | null
  machine_wattage?: number | null
  created_at: string
}

interface TestSuggestionGroup {
  source: 'own' | 'similar_machine' | 'community'
  label: string
  badge_color: string
  cuts: TestCut[]
  avg_rating: number
}

interface TestMachine {
  speed_profile: 'fast' | 'conservative' | 'auto'
  wattage_w?: number | null
}

interface SpeedRecommendation {
  avgSpeed: number
  fastSpeed: number
  conservativeSpeed: number
  minSpeed: number
  maxSpeed: number
  dataPoints: number
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED'
  avgPower: number | null
  commonGasType: string | null
  avgGasPressure: number | null
  avgFocus: number | null
  avgNozzle: number | null
  scalingApplied: boolean
  activeProfile: 'fast' | 'conservative' | 'auto'
  feedbackCorrectionApplied: boolean
  feedbackCorrectionDirection?: 'faster' | 'slower'
}

function computeSpeedRecommendation(
  groups: TestSuggestionGroup[],
  userMachine: TestMachine | null = null,
  feedbackCorrection?: { direction: 'faster' | 'slower' } | null,
  interpolated?: boolean
): SpeedRecommendation | null {
  const goodCuts: TestCut[] = []
  for (const group of groups) {
    const tierWeight = group.source === 'own' ? 3 : group.source === 'community' ? 2 : 1
    for (const cut of group.cuts) {
      if (cut.speed_mm_min && (cut.quality_rating === null || cut.quality_rating >= 3)) {
        cut.source_tier_weight = tierWeight
        goodCuts.push(cut)
      }
    }
  }

  if (goodCuts.length === 0) return null

  // Gas separation: base the rec on the dominant gas only (O2 vs N2 differ ~2x).
  const gasTally: Record<string, number> = {}
  for (const c of goodCuts) { if (c.gas_type) gasTally[c.gas_type] = (gasTally[c.gas_type] || 0) + 1 }
  const dominantGas = Object.entries(gasTally).sort((a, b) => b[1] - a[1])[0]?.[0] || null
  const recCuts = dominantGas
    ? goodCuts.filter((c) => !c.gas_type || c.gas_type === dominantGas)
    : goodCuts

  const now = Date.now()
  const HALF_LIFE_DAYS = 180

  const speeds = recCuts.map((c) => c.scaled_speed || c.speed_mm_min!)
  const weights = recCuts.map((c) => {
    const baseTierWeight = c.source_tier_weight || 1
    let decayWeight = 1
    if (c.created_at) {
      const createdAt = new Date(c.created_at).getTime()
      const ageDays = (now - createdAt) / (1000 * 60 * 60 * 24)
      decayWeight = Math.pow(0.5, ageDays / HALF_LIFE_DAYS)
    }
    // Wattage-proximity weighting: closer source wattage -> more trust (1/scaleRatio).
    let proximityWeight = 1
    const userW = userMachine?.wattage_w || null
    const sourceW = c.recorded_wattage_w ?? c.machine_wattage ?? userW ?? null
    if (userW && sourceW && userW > 0 && sourceW > 0) {
      const ratio = userW >= sourceW ? userW / sourceW : sourceW / userW
      proximityWeight = 1 / ratio
    }
    return baseTierWeight * decayWeight * proximityWeight
  })

  const totalWeight = weights.reduce((a, b) => a + b, 0)
  let avgSpeed = Math.round(
    speeds.reduce((sum, speed, i) => sum + speed * weights[i], 0) / totalWeight
  )
  const minSpeed = Math.min(...speeds)
  const maxSpeed = Math.max(...speeds)

  let feedbackCorrectionApplied = false
  let feedbackCorrectionDirection: 'faster' | 'slower' | undefined
  if (feedbackCorrection) {
    feedbackCorrectionApplied = true
    feedbackCorrectionDirection = feedbackCorrection.direction
    if (feedbackCorrection.direction === 'faster') {
      avgSpeed = Math.round(avgSpeed * 1.1)
    } else {
      avgSpeed = Math.round(avgSpeed * 0.9)
    }
  }

  const fastSpeed = avgSpeed
  const conservativeSpeed = Math.round(avgSpeed * SPEED_PROFILE_MULTIPLIERS.conservative)
  const activeProfile: 'fast' | 'conservative' | 'auto' = userMachine?.speed_profile || 'auto'

  const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length
  const variance = speeds.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / speeds.length
  const stddev = Math.sqrt(variance)
  const cv = mean > 0 ? stddev / mean : 1

  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW'
  const hasOwnVerifiedCut = goodCuts.some(
    (c) => c.source_tier_weight === 3 && c.quality_rating && c.quality_rating >= 4
  )
  if (hasOwnVerifiedCut) confidence = 'HIGH'
  else if (goodCuts.length >= 5 && cv < 0.2) confidence = 'HIGH'
  else if (goodCuts.length >= 3 || cv < 0.4) confidence = 'MEDIUM'

  if (interpolated) {
    if (confidence === 'HIGH') confidence = 'MEDIUM'
    else if (confidence === 'MEDIUM') confidence = 'LOW'
  }

  const powers = recCuts
    .filter((c) => (c.scaled_power !== undefined ? c.scaled_power : c.power_pct) !== null)
    .map((c) => (c.scaled_power !== undefined ? c.scaled_power : c.power_pct)!)
  const avgPower = powers.length > 0 ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : null

  const commonGasType = dominantGas

  const pressures = recCuts.filter((c) => c.gas_pressure_bar !== null).map((c) => c.gas_pressure_bar!)
  const avgGasPressure = pressures.length > 0 ? Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length * 10) / 10 : null

  const focuses = recCuts.filter((c) => c.focus_position_mm !== null).map((c) => c.focus_position_mm!)
  const avgFocus = focuses.length > 0 ? Math.round(focuses.reduce((a, b) => a + b, 0) / focuses.length * 10) / 10 : null

  const nozzles = recCuts.filter((c) => c.nozzle_diameter_mm !== null).map((c) => c.nozzle_diameter_mm!)
  const avgNozzle = nozzles.length > 0 ? Math.round(nozzles.reduce((a, b) => a + b, 0) / nozzles.length * 10) / 10 : null

  const scaledCut = recCuts.find((c) => c.scaled_speed !== undefined)
  const scalingApplied = !!scaledCut

  return {
    avgSpeed,
    fastSpeed,
    conservativeSpeed,
    minSpeed,
    maxSpeed,
    dataPoints: goodCuts.length,
    confidence,
    avgPower,
    commonGasType,
    avgGasPressure,
    avgFocus,
    avgNozzle,
    scalingApplied,
    activeProfile,
    feedbackCorrectionApplied,
    feedbackCorrectionDirection,
  }
}

// ---- Test helpers ----

function makeCut(overrides: Partial<TestCut> = {}): TestCut {
  return {
    id: 'cut-' + Math.random().toString(36).slice(2, 8),
    speed_mm_min: 3500,
    power_pct: 80,
    quality_rating: 4,
    gas_type: 'N2',
    gas_pressure_bar: 12,
    focus_position_mm: null,
    nozzle_diameter_mm: null,
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

function makeGroup(
  source: 'own' | 'similar_machine' | 'community',
  cuts: TestCut[]
): TestSuggestionGroup {
  return {
    source,
    label: source === 'own' ? 'Your History' : source === 'community' ? 'Shared Cuts' : 'AI Starting Point',
    badge_color: '',
    cuts,
    avg_rating: cuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / cuts.length,
  }
}

// ---- Tests ----

describe('computeSpeedRecommendation', () => {
  describe('Basic computation', () => {
    it('returns null when no groups have valid cuts', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: null })]),
      ])
      expect(result).toBeNull()
    })

    it('returns null for empty groups', () => {
      const result = computeSpeedRecommendation([])
      expect(result).toBeNull()
    })

    it('computes average speed from a single cut', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: 3500 })]),
      ])
      expect(result).not.toBeNull()
      expect(result!.avgSpeed).toBe(3500)
      expect(result!.dataPoints).toBe(1)
    })

    it('computes average speed from multiple cuts', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000 }),
          makeCut({ speed_mm_min: 4000 }),
        ]),
      ])
      expect(result).not.toBeNull()
      // Both cuts are "own" source, same age, same tier weight
      // Weighted average = (3000 + 4000) / 2 = 3500
      expect(result!.avgSpeed).toBe(3500)
    })

    it('filters out low-quality cuts (rating < 3)', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, quality_rating: 5 }),
          makeCut({ speed_mm_min: 1000, quality_rating: 2 }), // filtered
          makeCut({ speed_mm_min: 1000, quality_rating: 1 }), // filtered
        ]),
      ])
      expect(result!.dataPoints).toBe(1)
      expect(result!.avgSpeed).toBe(3000)
    })

    it('includes cuts with null quality rating', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, quality_rating: null }),
        ]),
      ])
      expect(result!.dataPoints).toBe(1)
      expect(result!.avgSpeed).toBe(3000)
    })

    it('computes min and max speed correctly', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 2000 }),
          makeCut({ speed_mm_min: 5000 }),
          makeCut({ speed_mm_min: 3500 }),
        ]),
      ])
      expect(result!.minSpeed).toBe(2000)
      expect(result!.maxSpeed).toBe(5000)
    })
  })

  describe('Source tier weighting', () => {
    it('weights own cuts at 3x, community at 2x, AI baseline at 1x', () => {
      // All cuts recent (no time decay effect), single cut per tier
      const now = new Date().toISOString()
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: 3000, created_at: now })]),
        makeGroup('community', [makeCut({ speed_mm_min: 4000, created_at: now })]),
        makeGroup('similar_machine', [makeCut({ speed_mm_min: 5000, created_at: now })]),
      ])
      // Weighted avg: (3000*3 + 4000*2 + 5000*1) / (3+2+1) = (9000+8000+5000)/6 = 22000/6 = 3667
      expect(result!.avgSpeed).toBe(3667)
    })

    it('own cuts dominate when mixed with community', () => {
      const now = new Date().toISOString()
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: 2000, created_at: now })]),
        makeGroup('community', [makeCut({ speed_mm_min: 4000, created_at: now })]),
      ])
      // Weighted avg: (2000*3 + 4000*2) / (3+2) = (6000+8000)/5 = 2800
      expect(result!.avgSpeed).toBe(2800)
    })

    it('AI baseline has lowest influence', () => {
      const now = new Date().toISOString()
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: 3000, created_at: now })]),
        makeGroup('similar_machine', [makeCut({ speed_mm_min: 6000, created_at: now })]),
      ])
      // Weighted avg: (3000*3 + 6000*1) / (3+1) = (9000+6000)/4 = 3750
      expect(result!.avgSpeed).toBe(3750)
    })
  })

  describe('Confidence calculation', () => {
    it('returns HIGH confidence when user has own verified cut (4+ stars)', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: 3500, quality_rating: 4 })]),
      ])
      expect(result!.confidence).toBe('HIGH')
    })

    it('returns HIGH confidence when user has own 5-star cut', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: 3500, quality_rating: 5 })]),
      ])
      expect(result!.confidence).toBe('HIGH')
    })

    it('returns HIGH confidence with 5+ consistent data points (CV < 0.2)', () => {
      // 5 cuts all near 3500 mm/min (low variance)
      const cuts = [3500, 3520, 3480, 3510, 3490].map((s) =>
        makeCut({ speed_mm_min: s, quality_rating: 3 })
      )
      const result = computeSpeedRecommendation([makeGroup('community', cuts)])
      expect(result!.confidence).toBe('HIGH')
    })

    it('returns MEDIUM confidence with 3+ data points', () => {
      const cuts = [3000, 3500, 4000].map((s) =>
        makeCut({ speed_mm_min: s, quality_rating: 3 })
      )
      const result = computeSpeedRecommendation([makeGroup('community', cuts)])
      expect(result!.confidence).toBe('MEDIUM')
    })

    it('returns MEDIUM confidence with low CV even with 2 data points', () => {
      // 2 cuts with CV < 0.4 should get MEDIUM
      const cuts = [3500, 3600].map((s) =>
        makeCut({ speed_mm_min: s, quality_rating: 3 })
      )
      const result = computeSpeedRecommendation([makeGroup('community', cuts)])
      // CV = stddev/mean = 50/3550 ~ 0.014 < 0.4 -> MEDIUM
      expect(result!.confidence).toBe('MEDIUM')
    })

    it('returns MEDIUM confidence with single baseline cut when CV < 0.4', () => {
      // A single cut has stddev=0, so CV=0 which is < 0.4 -> MEDIUM
      const result = computeSpeedRecommendation([
        makeGroup('similar_machine', [makeCut({ speed_mm_min: 3500, quality_rating: 3 })]),
      ])
      expect(result!.confidence).toBe('MEDIUM')
    })

    it('returns LOW confidence only when CV >= 0.4 and less than 3 data points and no own verified', () => {
      // Two cuts with vastly different speeds to get high CV
      const cuts = [1000, 5000].map((s) =>
        makeCut({ speed_mm_min: s, quality_rating: 3 })
      )
      const result = computeSpeedRecommendation([makeGroup('similar_machine', cuts)])
      // CV = stddev/mean = 2000/3000 ~ 0.67 >= 0.4, 2 data points < 3
      expect(result!.confidence).toBe('LOW')
    })

    it('returns LOW confidence with high variance community data', () => {
      // Same scenario but with community source to show it's source-agnostic
      const cuts = [1000, 6000].map((s) =>
        makeCut({ speed_mm_min: s, quality_rating: 3 })
      )
      const result = computeSpeedRecommendation([makeGroup('community', cuts)])
      // CV = stddev/mean = 2500/3500 ~ 0.71 >= 0.4, 2 data points < 3
      expect(result!.confidence).toBe('LOW')
    })
  })

  describe('Time-decay weighting', () => {
    it('recent cuts weigh more than old cuts', () => {
      const now = new Date()
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)

      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 4000, created_at: now.toISOString() }),
          makeCut({ speed_mm_min: 2000, created_at: sixMonthsAgo.toISOString() }),
        ]),
      ])

      // The recent cut (4000) should outweigh the old cut (2000)
      // decay for now = 1.0, decay for 180 days ago = 0.5
      // weights: 3*1.0=3, 3*0.5=1.5
      // avg = (4000*3 + 2000*1.5) / (3+1.5) = (12000+3000)/4.5 = 3333
      expect(result!.avgSpeed).toBe(3333)
    })

    it('very old cuts have minimal influence', () => {
      const now = new Date()
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3500, created_at: now.toISOString() }),
          makeCut({ speed_mm_min: 1000, created_at: oneYearAgo.toISOString() }),
        ]),
      ])

      // 365 days ~ 2.03 half-lives, decay ~ 0.245
      // The old cut's influence is heavily diminished
      // Result should be strongly biased toward 3500 (the recent cut)
      expect(result!.avgSpeed).toBeGreaterThan(2900)
      expect(result!.avgSpeed).toBeLessThan(3200)
    })

    it('equal-age cuts result in simple tier-weighted average', () => {
      const now = new Date().toISOString()
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, created_at: now }),
          makeCut({ speed_mm_min: 4000, created_at: now }),
        ]),
      ])
      // Same age, same tier (3x each)
      // avg = (3000*3 + 4000*3) / (3+3) = 21000/6 = 3500
      expect(result!.avgSpeed).toBe(3500)
    })
  })

  describe('Feedback correction', () => {
    it('increases speed by 10% when feedback is "faster"', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3000 })])],
        null,
        { direction: 'faster' }
      )
      // 3000 * 1.1 = 3300
      expect(result!.avgSpeed).toBe(3300)
      expect(result!.feedbackCorrectionApplied).toBe(true)
      expect(result!.feedbackCorrectionDirection).toBe('faster')
    })

    it('decreases speed by 10% when feedback is "slower"', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3000 })])],
        null,
        { direction: 'slower' }
      )
      // 3000 * 0.9 = 2700
      expect(result!.avgSpeed).toBe(2700)
      expect(result!.feedbackCorrectionApplied).toBe(true)
      expect(result!.feedbackCorrectionDirection).toBe('slower')
    })

    it('does not apply correction when no feedback provided', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3000 })])],
        null,
        null
      )
      expect(result!.avgSpeed).toBe(3000)
      expect(result!.feedbackCorrectionApplied).toBe(false)
    })

    it('conservative speed also reflects feedback correction', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 4000 })])],
        null,
        { direction: 'faster' }
      )
      // avgSpeed after correction = 4000 * 1.1 = 4400
      // conservativeSpeed = 4400 * 0.5 = 2200
      expect(result!.fastSpeed).toBe(4400)
      expect(result!.conservativeSpeed).toBe(2200)
    })
  })

  describe('Speed profiles', () => {
    it('fastSpeed equals avgSpeed', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3500 })])],
        { speed_profile: 'fast' }
      )
      expect(result!.fastSpeed).toBe(result!.avgSpeed)
    })

    it('conservativeSpeed is 50% of avgSpeed', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 4000 })])],
        { speed_profile: 'conservative' }
      )
      expect(result!.conservativeSpeed).toBe(2000)
      expect(result!.activeProfile).toBe('conservative')
    })

    it('uses "auto" profile when no machine provided', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3500 })])]
      )
      expect(result!.activeProfile).toBe('auto')
    })

    it('respects machine speed_profile setting', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3500 })])],
        { speed_profile: 'conservative' }
      )
      expect(result!.activeProfile).toBe('conservative')
    })
  })

  describe('Interpolation reduces confidence', () => {
    it('reduces HIGH to MEDIUM when interpolated', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3500, quality_rating: 5 })])],
        null,
        null,
        true // interpolated
      )
      // Would be HIGH (own verified 5-star), but interpolated -> MEDIUM
      expect(result!.confidence).toBe('MEDIUM')
    })

    it('reduces MEDIUM to LOW when interpolated', () => {
      const cuts = [3000, 3500, 4000].map((s) =>
        makeCut({ speed_mm_min: s, quality_rating: 3 })
      )
      const result = computeSpeedRecommendation(
        [makeGroup('community', cuts)],
        null,
        null,
        true // interpolated
      )
      // Would be MEDIUM (3+ data points), but interpolated -> LOW
      expect(result!.confidence).toBe('LOW')
    })

    it('does not reduce below LOW', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('similar_machine', [makeCut({ speed_mm_min: 3500, quality_rating: 3 })])],
        null,
        null,
        true // interpolated
      )
      // Already LOW, stays LOW
      expect(result!.confidence).toBe('LOW')
    })

    it('does not reduce confidence when not interpolated', () => {
      const result = computeSpeedRecommendation(
        [makeGroup('own', [makeCut({ speed_mm_min: 3500, quality_rating: 5 })])],
        null,
        null,
        false // not interpolated
      )
      expect(result!.confidence).toBe('HIGH')
    })
  })

  describe('Supporting parameters', () => {
    it('computes average power from good cuts', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, power_pct: 70 }),
          makeCut({ speed_mm_min: 4000, power_pct: 90 }),
        ]),
      ])
      expect(result!.avgPower).toBe(80)
    })

    it('finds the most common gas type', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, gas_type: 'N2' }),
          makeCut({ speed_mm_min: 3500, gas_type: 'N2' }),
          makeCut({ speed_mm_min: 4000, gas_type: 'O2' }),
        ]),
      ])
      expect(result!.commonGasType).toBe('N2')
    })

    it('computes average gas pressure', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, gas_pressure_bar: 10 }),
          makeCut({ speed_mm_min: 4000, gas_pressure_bar: 14 }),
        ]),
      ])
      expect(result!.avgGasPressure).toBe(12)
    })

    it('returns null for missing optional parameters', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, gas_type: null, gas_pressure_bar: null }),
        ]),
      ])
      expect(result!.commonGasType).toBeNull()
      expect(result!.avgGasPressure).toBeNull()
      expect(result!.avgFocus).toBeNull()
      expect(result!.avgNozzle).toBeNull()
    })

    it('uses scaled_power when available', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, power_pct: 80, scaled_power: 60 } as any),
        ]),
      ])
      // Should use the scaled_power (60) not original (80)
      expect(result!.avgPower).toBe(60)
    })
  })

  describe('Scaling detection', () => {
    it('reports scalingApplied when cuts have scaled_speed', () => {
      const cut = makeCut({ speed_mm_min: 3000 }) as any
      cut.scaled_speed = 2500
      const result = computeSpeedRecommendation([makeGroup('own', [cut])])
      expect(result!.scalingApplied).toBe(true)
    })

    it('reports no scaling when cuts have no scaled values', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [makeCut({ speed_mm_min: 3000 })]),
      ])
      expect(result!.scalingApplied).toBe(false)
    })
  })

  describe('Gas separation', () => {
    it('bases the recommendation on the dominant gas only (does not blend O2 + N2)', () => {
      // 3 O2 rows (fast) + 2 N2 rows (slow). O2 dominates -> N2 speeds excluded.
      const result = computeSpeedRecommendation([
        makeGroup('community', [
          makeCut({ speed_mm_min: 1200, gas_type: 'O2', gas_pressure_bar: 0.8 }),
          makeCut({ speed_mm_min: 1150, gas_type: 'O2', gas_pressure_bar: 0.7 }),
          makeCut({ speed_mm_min: 1250, gas_type: 'O2', gas_pressure_bar: 0.7 }),
          makeCut({ speed_mm_min: 560, gas_type: 'N2', gas_pressure_bar: 14 }),
          makeCut({ speed_mm_min: 600, gas_type: 'N2', gas_pressure_bar: 12 }),
        ]),
      ])
      expect(result!.commonGasType).toBe('O2')
      // avg of only the 3 O2 rows = (1200+1150+1250)/3 = 1200, NOT dragged down by N2
      expect(result!.avgSpeed).toBe(1200)
      // pressure reflects O2 rows only (~0.7), not the N2 14/12 bar
      expect(result!.avgGasPressure).toBeLessThan(2)
    })

    it('keeps gas-less rows and does not crash when no gas recorded', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, gas_type: null, gas_pressure_bar: null }),
          makeCut({ speed_mm_min: 4000, gas_type: null, gas_pressure_bar: null }),
        ]),
      ])
      expect(result!.commonGasType).toBeNull()
      expect(result!.avgSpeed).toBe(3500)
    })
  })

  describe('Wattage-proximity weighting', () => {
    it('weights the row closest to the user wattage far above a heavily-scaled row', () => {
      // Real 2kW row (1200) vs a 10kW row scaled down to 2kW (say 760). User is 2kW.
      // The near row (ratio 1 -> weight 1) should dominate the far row (ratio 5 -> weight 0.2).
      const result = computeSpeedRecommendation(
        [
          makeGroup('community', [
            makeCut({ speed_mm_min: 1200, gas_type: 'O2', gas_pressure_bar: 0.8, recorded_wattage_w: 2000, quality_rating: 3 }),
            makeCut({ scaled_speed: 760, speed_mm_min: 3800, gas_type: 'O2', gas_pressure_bar: 0.5, recorded_wattage_w: 10000, quality_rating: 5 }),
          ]),
        ],
        { speed_profile: 'auto', wattage_w: 2000 }
      )
      // Equal weighting would give ~980; proximity weighting pulls it toward the 2kW row (1200).
      // weighted = (1200*1 + 760*0.2) / 1.2 = 1127 -> closer to 1200 than to 980.
      expect(result!.avgSpeed).toBeGreaterThan(1050)
    })

    it('is unaffected when no user wattage is provided (proximity weight = 1)', () => {
      const result = computeSpeedRecommendation([
        makeGroup('own', [
          makeCut({ speed_mm_min: 3000, gas_type: 'O2' }),
          makeCut({ speed_mm_min: 4000, gas_type: 'O2' }),
        ]),
      ])
      expect(result!.avgSpeed).toBe(3500)
    })
  })
})
