# Laser Cutting Baseline Data Generation

This directory contains scripts for generating and managing baseline laser cutting parameters.

## Scripts

### `generate-baseline-data.js`

Generates realistic AI baseline laser cutting parameters for ~250-300 material/thickness combinations.

**Usage:**

```bash
# Generate both JSON and SQL outputs (default)
node scripts/generate-baseline-data.js

# Dry-run: preview first 5 samples without writing files
node scripts/generate-baseline-data.js --dry-run

# JSON only
node scripts/generate-baseline-data.js --json

# SQL only
node scripts/generate-baseline-data.js --sql

# Custom output directory
node scripts/generate-baseline-data.js --output ./exports
```

**Outputs:**

- `data/baseline-parameters.json` - All 250-300 parameter sets as JSON array
- `data/baseline-parameters.sql` - SQL INSERT statements ready for Supabase

**Parameter Generation Strategy:**

The script generates scientifically reasonable parameters based on material properties:

1. **Material Database**: 6 primary materials with realistic cutting profiles:
   - Stainless Steel 304
   - Mild Steel
   - Aluminum
   - Acrylic
   - Copper
   - Leather

2. **Thickness Variations**: Each material has 4-6 standard thicknesses (0.5mm - 10mm)

3. **Parameter Ranges**: Power, speed, and gas pressure vary by:
   - Material type and composition
   - Thickness (thicker = lower speed, higher power)
   - Gas type (O₂ for fast cutting, N₂ for quality)

4. **Realistic Distributions**:
   - Power: 15-100% (thickness-dependent)
   - Speed: 50-1800 mm/min (material/thickness-dependent)
   - Gas types: O₂, N₂, air (material-specific)
   - Gas pressure: 1-5 bar (gas-type dependent)
   - Focus position: -5 to +5mm
   - Line interval: 0.05-0.15mm
   - Nozzle diameter: 1-4mm
   - Nozzle distance: 0.5-2mm

5. **Quality Distribution**:
   - 70% 5-star cuts
   - 20% 4-star cuts
   - 10% 3-star cuts
   - 75% clean edges, 25% slight dross

6. **Temporal Distribution**: created_at timestamps spread over last 30 days

## Bulk Insert to Supabase

### Using SQL INSERT statements:

```bash
# 1. Generate SQL output
node scripts/generate-baseline-data.js --sql

# 2. Connect to Supabase and run the SQL
psql -h <your-host> -d <your-database> -U <your-user> -f data/baseline-parameters.sql

# Or use Supabase CLI:
supabase db push --file data/baseline-parameters.sql
```

### Using JSON + Supabase JS client:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const data = require('./data/baseline-parameters.json');

// Chunk inserts (Supabase recommends 100-1000 per batch)
for (let i = 0; i < data.length; i += 500) {
  const chunk = data.slice(i, i + 500);
  const { error } = await supabase.from('cuts').insert(chunk);
  if (error) console.error(error);
  console.log(`Inserted rows ${i} to ${i + chunk.length}`);
}
```

## Parameter Reference

### Gas Types & Typical Pressures:

- **O₂ (Oxygen)**: 1.5-3.5 bar - faster cuts, better edge quality on mild steel
- **N₂ (Nitrogen)**: 2.5-5 bar - high quality cuts, reduces oxidation
- **Air**: 1-2.5 bar - economical, suitable for non-metals and some aluminum

### Material-Specific Notes:

| Material | Best Gas | Speed Range | Power Range | Notes |
|----------|----------|-------------|-------------|-------|
| Stainless 304 | N₂ | 150-1400 mm/min | 25-100% | Excellent quality with N₂, slow for thick stock |
| Mild Steel | O₂ | 200-1600 mm/min | 20-95% | O₂ gives speed; N₂ for quality |
| Aluminum | N₂/Air | 300-1800 mm/min | 15-90% | Very reflective; air cuts work but N₂ is better |
| Acrylic | Air | 100-600 mm/min | 10-60% | Low power needed; avoid burning |
| Copper | N₂ only | 80-800 mm/min | 30-100% | Highly conductive; N₂ essential |
| Leather | Air | 50-400 mm/min | 5-40% | Very low power; watch for charring |

### Nozzle Guide:

- Diameter 1-1.5mm: Thin materials, detail work, very focused
- Diameter 2-2.5mm: General purpose (most common)
- Diameter 3-4mm: Thick materials, wide beam

Distance from surface: typically 0.5-2mm for optimal gas flow and beam quality.

## Database Schema

Parameters map directly to the `cuts` table:

```sql
CREATE TABLE cuts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid NOT NULL REFERENCES machines(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
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
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  edge_quality text CHECK (edge_quality IN ('clean', 'slight_dross', 'heavy_dross', 'burn_marks')),
  is_shared boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

## Customization

To modify parameter generation:

1. Edit `MATERIAL_CONFIGS` in `generate-baseline-data.js`
2. Adjust `powerRange()`, `speedRange()` functions for material behavior
3. Modify gas types, quality distributions in `generateParameterSet()`
4. Re-run the script

## Testing & Validation

1. **Dry-run preview**:
   ```bash
   node scripts/generate-baseline-data.js --dry-run
   ```

2. **JSON validation**:
   ```bash
   node -e "const j = require('./data/baseline-parameters.json'); console.log(`Valid: ${Array.isArray(j)} (${j.length} items)`)"
   ```

3. **SQL syntax check**:
   ```bash
   # psql will report syntax errors
   psql -h localhost -d testdb -f data/baseline-parameters.sql --dry-run
   ```
