-- CutLog: Initial Schema
-- Machines, cuts, and materials reference tables

-- Materials reference (pre-seeded)
CREATE TABLE materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  aliases text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- User machines
CREATE TABLE machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand text NOT NULL,
  model text,
  wattage_w integer,
  source_type text NOT NULL DEFAULT 'fiber' CHECK (source_type IN ('fiber', 'co2', 'diode')),
  resonator_hours integer,
  gas_types text[] DEFAULT '{}',
  controller text,
  location_country text,
  nickname text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cut logs
CREATE TABLE cuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material text NOT NULL,
  thickness_mm numeric NOT NULL,
  power_pct numeric,
  speed_mm_min numeric,
  gas_type text,
  gas_pressure_bar numeric,
  focus_position_mm numeric,
  nozzle_diameter_mm numeric,
  nozzle_distance_mm numeric,
  line_interval_mm numeric,
  pulse_frequency_hz numeric,
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  edge_quality text CHECK (edge_quality IN ('clean', 'slight_dross', 'heavy_dross', 'burn_marks')),
  photo_url text,
  notes text,
  is_shared boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Indexes for suggestion queries
CREATE INDEX idx_cuts_material_thickness ON cuts(material, thickness_mm);
CREATE INDEX idx_cuts_machine_id ON cuts(machine_id);
CREATE INDEX idx_cuts_user_id ON cuts(user_id);
CREATE INDEX idx_cuts_quality ON cuts(quality_rating DESC);
CREATE INDEX idx_machines_brand_model ON machines(brand, model);
CREATE INDEX idx_machines_user_id ON machines(user_id);

-- Row Level Security
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Materials: everyone can read
CREATE POLICY "Materials are readable by everyone"
  ON materials FOR SELECT USING (true);

-- Machines: users see only their own
CREATE POLICY "Users can view own machines"
  ON machines FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own machines"
  ON machines FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own machines"
  ON machines FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own machines"
  ON machines FOR DELETE USING (auth.uid() = user_id);

-- Cuts: users see own cuts + shared cuts from others
CREATE POLICY "Users can view own cuts"
  ON cuts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared cuts"
  ON cuts FOR SELECT USING (is_shared = true);

CREATE POLICY "Users can insert own cuts"
  ON cuts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cuts"
  ON cuts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cuts"
  ON cuts FOR DELETE USING (auth.uid() = user_id);
