export interface Machine {
  id: string
  user_id: string
  brand: string
  model: string | null
  wattage_w: number | null
  source_type: 'fiber' | 'co2' | 'diode'
  lens_focal_length_mm: number | null
  resonator_hours: number | null
  gas_types: string[]
  controller: string | null
  location_country: string | null
  nickname: string | null
  laser_source_type: 'fiber_cutting' | 'fiber_engraving' | 'co2_cutting' | 'co2_engraving' | 'diode_engraving' | 'uv_marking' | null
  speed_profile: 'fast' | 'conservative' | 'auto'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Cut {
  id: string
  machine_id: string
  user_id: string
  material: string
  thickness_mm: number
  power_pct: number | null
  speed_mm_min: number | null
  gas_type: string | null
  gas_pressure_bar: number | null
  focus_position_mm: number | null
  nozzle_diameter_mm: number | null
  nozzle_distance_mm: number | null
  line_interval_mm: number | null
  pulse_frequency_hz: number | null
  quality_rating: number | null
  edge_quality: 'clean' | 'slight_dross' | 'heavy_dross' | 'burn_marks' | null
  photo_url: string | null
  notes: string | null
  is_shared: boolean
  source: 'user_logged' | 'ai_baseline' | 'scraped_public'
  created_at: string
  // Engraving-specific parameters
  frequency_hz: number | null
  num_passes: number | null
  operation_type: 'engrave' | 'mark' | 'cut' | 'score' | 'fill' | 'outline' | null
  cross_hatch: boolean | null
  scan_angle_degrees: number | null
  q_pulse_ns: number | null
  // Optional fields for parameter scaling
  recorded_wattage_w?: number | null
  recorded_lens_focal_length_mm?: number | null
}

export interface Material {
  id: string
  name: string
  category: string
  aliases: string[]
}

export interface Suggestion {
  source: 'own' | 'similar_machine' | 'community' | 'ai'
  cuts: Cut[]
  confidence: number
  machine_similarity?: number
  avg_rating: number
  count: number
}

export const MACHINE_BRANDS = [
  'Trumpf', 'Bystronic', 'Amada', 'Mazak', 'Mitsubishi',
  'Han\'s Laser', 'HSG', 'Bodor', 'IPG', 'Raycus',
  'JPT', 'MAX', 'BLM Group', 'Prima Power', 'Salvagnini',
  'Cincinnati', 'Messer', 'Koike', 'ESAB', 'Hypertherm',
  'Other'
] as const

export const EDGE_QUALITIES = [
  { value: 'clean', label: 'Clean cut' },
  { value: 'slight_dross', label: 'Slight dross' },
  { value: 'heavy_dross', label: 'Heavy dross' },
  { value: 'burn_marks', label: 'Burn marks' },
] as const

export const GAS_TYPES = ['N2', 'O2', 'Air', 'Ar', 'He'] as const

export const OPERATION_TYPES = [
  { value: 'cut', label: 'Cut' },
  { value: 'engrave', label: 'Engrave' },
  { value: 'mark', label: 'Mark' },
  { value: 'score', label: 'Score' },
  { value: 'fill', label: 'Fill' },
  { value: 'outline', label: 'Outline' },
] as const

export const LASER_SOURCE_TYPES = [
  { value: 'fiber_cutting', label: 'Fiber - Cutting' },
  { value: 'fiber_engraving', label: 'Fiber - Engraving' },
  { value: 'co2_cutting', label: 'CO2 - Cutting' },
  { value: 'co2_engraving', label: 'CO2 - Engraving' },
  { value: 'diode_engraving', label: 'Diode - Engraving' },
  { value: 'uv_marking', label: 'UV - Marking' },
] as const

export const SPEED_PROFILES = [
  { value: 'fast', label: 'Fast Production', icon: '⚡', description: 'Optimized for maximum throughput' },
  { value: 'conservative', label: 'Conservative Quality', icon: '🎯', description: 'Prioritizes edge quality and durability' },
  { value: 'auto', label: 'Auto', icon: 'ℹ️', description: 'Fast for cutting, Conservative for engraving' },
] as const

export const SPEED_PROFILE_MULTIPLIERS = {
  fast: 1.0,
  conservative: 0.5,
  auto: undefined,
} as const

/**
 * Returns true if the machine is a galvo/engraving laser where cutting-specific
 * fields (gas, nozzle, focus, edge quality) are irrelevant.
 * Galvo modes: fiber_engraving, uv_marking
 * Engraving modes (hide some fields): co2_engraving, diode_engraving
 */
export function isGalvoMode(machine: Machine | null): boolean {
  if (!machine?.laser_source_type) return false
  return machine.laser_source_type === 'fiber_engraving' || machine.laser_source_type === 'uv_marking'
}

/**
 * Returns true if the machine is any engraving/marking type where cutting
 * fields are less relevant (galvo + co2_engraving + diode_engraving).
 */
export function isEngravingMode(machine: Machine | null): boolean {
  if (!machine?.laser_source_type) return false
  return (
    machine.laser_source_type === 'fiber_engraving' ||
    machine.laser_source_type === 'uv_marking' ||
    machine.laser_source_type === 'co2_engraving' ||
    machine.laser_source_type === 'diode_engraving'
  )
}
