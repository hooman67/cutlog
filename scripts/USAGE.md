# Baseline Data Generation - Complete Guide

## Overview

The baseline data generation script creates realistic laser cutting parameters for AI model training and system initialization. It generates ~250-300 scientifically accurate parameter sets across 6 primary materials and multiple thickness variations.

## Quick Start

### 1. Generate and view sample output (no files written)

```bash
cd /mnt/localssd/laser_log/app
npm run gen:baseline:dry
# or
node scripts/generate-baseline-data.js --dry-run
```

**Output:**
- Console shows first 5 sample parameters
- Total count displayed
- No files written to disk

### 2. Generate both JSON and SQL files

```bash
npm run gen:baseline
# or
node scripts/generate-baseline-data.js
```

**Output:**
- `data/baseline-parameters.json` - 250-300 parameter objects
- `data/baseline-parameters.sql` - Ready-to-run SQL INSERT statements

### 3. Generate JSON only

```bash
npm run gen:baseline:json
# or
node scripts/generate-baseline-data.js --json
```

### 4. Generate SQL only

```bash
npm run gen:baseline:sql
# or
node scripts/generate-baseline-data.js --sql
```

### 5. Custom output directory

```bash
node scripts/generate-baseline-data.js --output ./exports
node scripts/generate-baseline-data.js --output /tmp/baseline-data
```

## Database Insertion

### Method 1: Using SQL INSERT statements

```bash
# 1. Generate SQL file
npm run gen:baseline:sql

# 2. (Optional) Inspect the SQL
head -50 data/baseline-parameters.sql

# 3. Load into Supabase via psql
psql -h <host> -d <database> -U <user> -f data/baseline-parameters.sql

# Or via Supabase CLI:
supabase db push --file data/baseline-parameters.sql
```

**SQL Format:**
```sql
INSERT INTO cuts (machine_id, user_id, material, thickness_mm, ...)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, ...),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, ...),
  ...
;
```

### Method 2: Using JavaScript/Node.js

**In your Node.js/Next.js app:**

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Use service key for bulk inserts
);

// Load the generated data
const baselineData = require('./scripts/data/baseline-parameters.json');

// Insert in batches (Supabase recommends 500-1000 per batch)
async function insertBaseline() {
  for (let i = 0; i < baselineData.length; i += 500) {
    const chunk = baselineData.slice(i, i + 500);
    
    // Add required fields
    const recordsToInsert = chunk.map(record => ({
      ...record,
      machine_id: '550e8400-e29b-41d4-a716-446655440000',
      user_id: '550e8400-e29b-41d4-a716-446655440001',
    }));

    const { data, error } = await supabase
      .from('cuts')
      .insert(recordsToInsert);

    if (error) {
      console.error(`Batch ${i/500 + 1} failed:`, error);
    } else {
      console.log(`Inserted rows ${i} to ${i + chunk.length}`);
    }
  }
}

await insertBaseline();
```

### Method 3: Using curl + Supabase REST API

```bash
# Generate JSON
npm run gen:baseline:json

# Insert via REST API
curl -X POST "https://<project>.supabase.co/rest/v1/cuts" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d @data/baseline-parameters.json
```

## Parameter Explanations

### Generated Fields

| Field | Range | Notes |
|-------|-------|-------|
| `material` | Fixed | One of: Stainless Steel 304, Mild Steel, Aluminum, Acrylic, Copper, Leather |
| `thickness_mm` | Material-specific | 0.5-10mm depending on material |
| `power_pct` | 5-100% | Material & thickness dependent |
| `speed_mm_min` | 50-1800 mm/min | Material & thickness dependent |
| `gas_type` | O2, N2, air | Material-specific (e.g., copper requires N2) |
| `gas_pressure_bar` | 1-5 bar | Gas-type dependent |
| `focus_position_mm` | -5 to +5 mm | Distance above/below material surface |
| `nozzle_diameter_mm` | 1-4 mm | Larger for thick materials |
| `nozzle_distance_mm` | 0.5-2 mm | Distance from nozzle to material |
| `line_interval_mm` | 0.05-0.15 mm | Scan line spacing |
| `quality_rating` | 1-5 | 70% 5★, 20% 4★, 10% 3★ |
| `edge_quality` | clean / slight_dross | 75% clean, 25% slight_dross |
| `created_at` | Last 30 days | Distributed over past month |

### Material-Specific Ranges

#### Stainless Steel 304
- **Thicknesses**: 0.5, 1, 2, 3, 5, 8 mm
- **Best Gas**: N2 (quality), O2 (speed)
- **Power**: 25-100% (thickness-dependent)
- **Speed**: 150-1400 mm/min (thicker = slower)
- **Notes**: High-quality cuts with N2; O2 enables faster cutting

#### Mild Steel
- **Thicknesses**: 0.5, 1, 2, 3, 5, 8 mm
- **Best Gas**: O2 (fast) or air (economical)
- **Power**: 20-95%
- **Speed**: 200-1600 mm/min
- **Notes**: O2 improves cutting speed significantly

#### Aluminum
- **Thicknesses**: 0.5, 1, 2, 3, 5 mm
- **Best Gas**: N2 or air (aluminum is highly reflective)
- **Power**: 15-90%
- **Speed**: 300-1800 mm/min (thinner material = faster)
- **Notes**: Reflectivity requires careful setup

#### Acrylic
- **Thicknesses**: 1, 3, 5, 8, 10 mm
- **Best Gas**: Air only
- **Power**: 10-60% (low power prevents burning)
- **Speed**: 100-600 mm/min
- **Notes**: Very low power needed; watch for charring

#### Copper
- **Thicknesses**: 0.5, 1, 2, 3 mm
- **Best Gas**: N2 (required for quality)
- **Power**: 30-100%
- **Speed**: 80-800 mm/min (lower than steels)
- **Notes**: Highly conductive; N2 essential

#### Leather
- **Thicknesses**: 1, 2, 3, 5 mm
- **Best Gas**: Air
- **Power**: 5-40% (very low power)
- **Speed**: 50-400 mm/min
- **Notes**: Extreme low power to avoid charring

## Data Structure (JSON)

Each parameter set object:

```json
{
  "material": "Stainless Steel 304",
  "thickness_mm": 2,
  "power_pct": 65,
  "speed_mm_min": 450,
  "gas_type": "N2",
  "gas_pressure_bar": 3.5,
  "focus_position_mm": 0.5,
  "nozzle_diameter_mm": 2.5,
  "nozzle_distance_mm": 1.2,
  "line_interval_mm": 0.084,
  "quality_rating": 5,
  "edge_quality": "clean",
  "source": "ai_baseline",
  "is_shared": true,
  "created_at": "2026-06-09T14:23:45.123Z"
}
```

### For Database Insertion

Add these fields:
```json
{
  "machine_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  ... (all fields above)
}
```

## Customization

### Modifying Parameters

Edit `/mnt/localssd/laser_log/app/scripts/generate-baseline-data.js` or `.ts`:

1. **Add/remove materials**: Update `MATERIAL_CONFIGS` object
2. **Adjust power ranges**: Modify `powerRange()` function
3. **Change speed profiles**: Modify `speedRange()` function
4. **Alter quality distribution**: Edit `generateParameterSet()` quality logic
5. **Add more thicknesses**: Add to `thicknesses` array

Example:
```javascript
'Titanium Grade 5': {
  category: 'titanium',
  thicknesses: [0.5, 1, 2, 3, 5],
  gasTypes: ['N2'],
  powerRange: (thickness) => ({
    min: thickness === 0.5 ? 40 : 60,
    max: thickness === 0.5 ? 90 : 100,
  }),
  speedRange: (thickness) => ({
    min: thickness === 0.5 ? 200 : 100,
    max: thickness === 0.5 ? 600 : 300,
  }),
}
```

## Validation

### Check generated data

```bash
# Count records
jq '. | length' data/baseline-parameters.json

# Check data types
jq '.[0]' data/baseline-parameters.json

# Validate SQL syntax
psql -h localhost -d testdb -f data/baseline-parameters.sql --dry-run

# Check for duplicates
jq -r 'map("\(.material)|\(.thickness_mm)") | unique | length' data/baseline-parameters.json
```

### Statistics

```bash
# Show distribution by material
jq -r '.[].material' data/baseline-parameters.json | sort | uniq -c

# Average power by material
jq -r 'group_by(.material) | map({material: .[0].material, avg_power: (map(.power_pct) | add / length)})' data/baseline-parameters.json

# Quality distribution
jq -r '.[] | "\(.quality_rating)" ' data/baseline-parameters.json | sort | uniq -c
```

## Integration

### With Recommendation System

```javascript
// In your API/ML model
import baselineData from './scripts/data/baseline-parameters.json';

export function getBaselineParameters(material, thickness) {
  return baselineData.filter(
    p => p.material === material && p.thickness_mm === thickness
  );
}

export function getRecommendation(material, thickness) {
  const baselines = getBaselineParameters(material, thickness);
  if (baselines.length === 0) return null;
  
  // Return highest quality baseline
  return baselines.sort((a, b) => b.quality_rating - a.quality_rating)[0];
}
```

### With Material Selector

```sql
-- Find available thickness/material combos from baseline data
SELECT DISTINCT material, thickness_mm, COUNT(*) as sample_count
FROM cuts
WHERE source = 'ai_baseline'
GROUP BY material, thickness_mm
ORDER BY material, thickness_mm;
```

## Troubleshooting

### "node: command not found"
```bash
# Install Node.js or use npm/npx
npm run gen:baseline

# Or use the TypeScript version with ts-node
npx ts-node scripts/generate-baseline-data.ts
```

### SQL INSERT fails
```bash
# Check for syntax errors
psql -h localhost -d testdb -f data/baseline-parameters.sql --echo-errors

# Validate UUIDs
grep "550e8400" data/baseline-parameters.sql

# Check table exists
psql -h localhost -d testdb -c "SELECT * FROM cuts LIMIT 1;"
```

### Duplicate entries
The script uses random UUIDs for machine_id and user_id. To use specific ones:

```bash
# Edit the SQL output and replace UUIDs
sed -i "s/550e8400-e29b-41d4-a716-446655440000/<actual-machine-uuid>/g" data/baseline-parameters.sql
```

## Performance

- **Generation time**: ~100-200ms for 250-300 parameters
- **File size**: ~150-200KB (JSON) or ~100-150KB (SQL)
- **Database insert**: ~1-2 seconds for 250-300 rows (with proper indexes)

## Next Steps

1. **Generate baseline data**: `npm run gen:baseline`
2. **Review sample output**: Check `data/baseline-parameters.json`
3. **Insert into database**: Use SQL or JavaScript method
4. **Validate in app**: Query cuts table for `source = 'ai_baseline'`
5. **Train models**: Use baseline parameters as training data
6. **Generate recommendations**: Use `getRecommendation()` for users
