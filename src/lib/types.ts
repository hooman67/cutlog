export interface Machine {
  id: string
  user_id: string
  brand: string
  model: string | null
  wattage_w: number | null
  source_type: 'fiber' | 'co2' | 'diode'
  resonator_hours: number | null
  gas_types: string[]
  controller: string | null
  location_country: string | null
  nickname: string | null
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
  created_at: string
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
