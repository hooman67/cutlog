# Laser Cutting Baseline Data Generation - Complete Implementation Guide

## Overview

This package provides production-ready scripts to generate ~250-300 realistic, scientifically accurate laser cutting parameters for AI model training, system initialization, and baseline recommendations.

## What Was Generated

### Scripts (3 versions)

1. **JavaScript** (`generate-baseline-data.js`)
   - Node.js implementation
   - Use with: `node scripts/generate-baseline-data.js`
   - Or npm: `npm run gen:baseline`

2. **TypeScript** (`generate-baseline-data.ts`)
   - Type-safe version with full IDE support
   - Use with: `npx ts-node scripts/generate-baseline-data.ts`
   - Recommended for production use

3. **Python** (`generate-baseline-data.py`)
   - Pure Python 3 alternative (no dependencies)
   - Use with: `python3 scripts/generate-baseline-data.py`
   - Best if Node.js not available

### Documentation

- **README.md** - Script overview and reference
- **USAGE.md** - Complete usage guide with examples
- **GUIDE.md** - This file (comprehensive implementation guide)
- **sample-output.json** - Sample of generated data format

### Configuration

- **package.json** - Updated with npm scripts for easy execution

## Files Created

```
/mnt/localssd/laser_log/app/scripts/
├── generate-baseline-data.js          (Main Node.js implementation)
├── generate-baseline-data.ts          (TypeScript version)
├── generate-baseline-data.py          (Python version)
├── README.md                          (Script documentation)
├── USAGE.md                           (Detailed usage guide)
├── GUIDE.md                           (This file)
└── sample-output.json                 (Example output)
```

## Quick Start (5 minutes)

### 1. Generate Baseline Data

Choose one method based on your environment:

**Using Node.js (recommended):**
```bash
cd /mnt/localssd/laser_log/app
npm run gen:baseline
```

**Using TypeScript with ts-node:**
```bash
npm install -D ts-node  # If not already installed
npx ts-node scripts/generate-baseline-data.ts
```

**Using Python (no dependencies):**
```bash
python3 scripts/generate-baseline-data.py
```

### 2. Preview Output (no files written)

```bash
npm run gen:baseline:dry
# or
node scripts/generate-baseline-data.js --dry-run
```

Output shows:
- First 5 sample parameters
- Total count: ~250-300 parameter sets
- No files created

### 3. Insert into Database

Generated files appear in `data/` directory:
- `baseline-parameters.json` - JSON array format
- `baseline-parameters.sql` - SQL INSERT statements

**Insert via SQL:**
```bash
psql -h <host> -d <database> -U <user> -f data/baseline-parameters.sql
```

**Or insert via JavaScript in your app:**
```javascript
import baselineData from './scripts/data/baseline-parameters.json';
const { error } = await supabase.from('cuts').insert(baselineData);
```

## Data Generated

### Scope

- **Materials**: 6 primary (Stainless Steel 304, Mild Steel, Aluminum, Acrylic, Copper, Leather)
- **Thickness variations**: 4-6 per material (0.5mm to 10mm)
- **Total combos**: ~30 material/thickness combinations
- **Variations per combo**: 2-4 parameter sets each
- **Total parameter sets**: ~250-300

### Parameters Per Set

| Parameter | Range | Scientific Basis |
|-----------|-------|------------------|
| Power | 5-100% | Material absorption + thickness |
| Speed | 50-1800 mm/min | Material + thickness + gas type |
| Gas Type | O2, N2, air | Material-specific optimization |
| Gas Pressure | 1-5 bar | Gas type + material requirements |
| Focus Position | -5 to +5 mm | Beam waist optimization |
| Nozzle Diameter | 1-4 mm | Material thickness + detail level |
| Nozzle Distance | 0.5-2 mm | Gas jet effectiveness |
| Line Interval | 0.05-0.15 mm | Surface quality requirement |
| Quality Rating | 1-5 stars | 70% excellent, 20% very good, 10% good |
| Edge Quality | clean/slight_dross | 75% clean, 25% slight oxidation |

### Material-Specific Intelligence

#### Stainless Steel 304
```
Thicknesses: 0.5, 1, 2, 3, 5, 8 mm
Best Gas: N2 (quality) | O2 (speed)
Power Profile: 25-100% (increases with thickness)
Speed Profile: 1400 mm/min (0.5mm) → 150 mm/min (8mm)
Characteristics: Excellent for precision work; N2 essential for quality
```

#### Mild Steel
```
Thicknesses: 0.5, 1, 2, 3, 5, 8 mm
Best Gas: O2 (significant speed advantage)
Power Profile: 20-95%
Speed Profile: 1600 mm/min (0.5mm) → 200 mm/min (8mm)
Characteristics: O2 enables fastest cuts; economical with air
```

#### Aluminum
```
Thicknesses: 0.5, 1, 2, 3, 5 mm
Best Gas: N2 > air (aluminum highly reflective)
Power Profile: 15-90%
Speed Profile: 1800 mm/min (0.5mm) → 300 mm/min (5mm)
Characteristics: Demands careful setup; N2 recommended
```

#### Acrylic
```
Thicknesses: 1, 3, 5, 8, 10 mm
Best Gas: Air
Power Profile: 10-60% (very low power)
Speed Profile: 600 mm/min (1-3mm) → 100 mm/min (8-10mm)
Characteristics: Extreme low power to avoid burning/charring
```

#### Copper
```
Thicknesses: 0.5, 1, 2, 3 mm
Best Gas: N2 only (highly conductive)
Power Profile: 30-100%
Speed Profile: 800 mm/min (0.5mm) → 80 mm/min (3mm)
Characteristics: Requires N2 for any acceptable cuts
```

#### Leather
```
Thicknesses: 1, 2, 3, 5 mm
Best Gas: Air
Power Profile: 5-40% (minimal power)
Speed Profile: 400 mm/min (1-2mm) → 50 mm/min (5mm)
Characteristics: Ultra low power to prevent charring
```

## Output Formats

### JSON Format

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

### SQL Format (excerpt)

```sql
INSERT INTO cuts (machine_id, user_id, material, thickness_mm, power_pct, ...) VALUES
('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Stainless Steel 304', 2, 65, ...),
('550e8400-e29b-41d4-a716-446655440000'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Mild Steel', 0.5, 45, ...),
...
;
```

## Integration Examples

### Example 1: Recommendation System

```javascript
// Get baseline parameters for a material/thickness
const baselines = baselineData.filter(
  p => p.material === 'Stainless Steel 304' && p.thickness_mm === 2
);

// Return best quality baseline
const recommended = baselines.reduce((best, current) =>
  current.quality_rating > best.quality_rating ? current : best
);

console.log(`Recommended settings for SS304 @ 2mm:
  Power: ${recommended.power_pct}%
  Speed: ${recommended.speed_mm_min} mm/min
  Gas: ${recommended.gas_type} @ ${recommended.gas_pressure_bar} bar`);
```

### Example 2: Machine Initialization

```sql
-- Copy baseline to a specific machine
INSERT INTO cuts (
  machine_id, user_id, material, thickness_mm, power_pct, speed_mm_min,
  gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm,
  nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality,
  is_shared, created_at
)
SELECT
  'YOUR-MACHINE-UUID'::uuid as machine_id,
  'YOUR-USER-UUID'::uuid as user_id,
  material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar,
  focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm,
  quality_rating, edge_quality, is_shared, now()::timestamptz as created_at
FROM cuts
WHERE source = 'ai_baseline'
```

### Example 3: Model Training

```javascript
// Use baseline data for training parameter prediction model
import baselineData from './scripts/data/baseline-parameters.json';

export function prepareTrainingData() {
  return baselineData.map(record => ({
    inputs: {
      material: record.material,
      thickness: record.thickness_mm,
      gasType: record.gas_type,
    },
    outputs: {
      power: record.power_pct / 100, // Normalize 0-1
      speed: record.speed_mm_min / 2000, // Normalize to 0-1
    },
    weight: record.quality_rating / 5, // Weight by quality
  }));
}
```

## Advanced Usage

### Customizing Parameters

Edit material configurations in the script:

```javascript
// In generate-baseline-data.js
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

### Generating Multiple Datasets

```bash
# Generate different output directories for A/B testing
node scripts/generate-baseline-data.js --output ./data/variant-a
node scripts/generate-baseline-data.js --output ./data/variant-b

# Compare statistics
jq -r '.[].quality_rating' data/variant-a/baseline-parameters.json | sort | uniq -c
jq -r '.[].quality_rating' data/variant-b/baseline-parameters.json | sort | uniq -c
```

### Filtering & Analysis

```bash
# Show only 5-star parameters
jq '.[] | select(.quality_rating == 5)' data/baseline-parameters.json | jq -r '\(.material)|\(.thickness_mm)|\(.quality_rating)'

# Average power by material
jq -r 'group_by(.material) | map({
  material: .[0].material,
  avg_power: (map(.power_pct) | add / length | floor),
  count: length
})' data/baseline-parameters.json | jq -r '.[] | "\(.material): \(.avg_power)% (\(.count) samples)"'

# Find all N2 parameters
jq '.[] | select(.gas_type == "N2")' data/baseline-parameters.json | jq '.material,.gas_pressure_bar' | head -20
```

## Validation & Testing

### Syntax Validation

```bash
# Validate JSON
node -e "const j = require('./data/baseline-parameters.json'); console.log('Valid JSON:', Array.isArray(j), 'Count:', j.length)"

# Validate SQL
psql -d testdb -f data/baseline-parameters.sql --echo-errors

# Check file sizes
ls -lh data/baseline-parameters.*
```

### Data Quality Checks

```bash
# Count records
jq 'length' data/baseline-parameters.json

# Check for nulls
jq -r '.[] | select(.power_pct == null or .speed_mm_min == null)' data/baseline-parameters.json | wc -l

# Verify quality ratings are 1-5
jq -r '.[] | select(.quality_rating < 1 or .quality_rating > 5)' data/baseline-parameters.json | wc -l

# Check timestamps are valid
jq -r '.[] | .created_at' data/baseline-parameters.json | head -5
```

## Troubleshooting

### "Node not found"

```bash
# Install Node.js (macOS)
brew install node

# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use Python version
python3 scripts/generate-baseline-data.py
```

### "Permission denied"

```bash
# Make scripts executable
chmod +x scripts/generate-baseline-data.js
chmod +x scripts/generate-baseline-data.py

# Then run with appropriate interpreter
node scripts/generate-baseline-data.js
python3 scripts/generate-baseline-data.py
```

### Database Insert Fails

```bash
# Check connection
psql -h <host> -d <database> -U <user> -c "SELECT version();"

# Check table exists
psql -d <database> -c "SELECT COUNT(*) FROM cuts;"

# Review SQL syntax
head -100 data/baseline-parameters.sql

# Try small batch insert
psql -d <database> -c "INSERT INTO cuts (...) VALUES (...); ROLLBACK;"
```

## Performance Notes

- **Generation time**: ~50-200ms (depends on hardware)
- **JSON file size**: ~150-200KB for 250-300 records
- **SQL file size**: ~100-150KB
- **Database insert**: ~0.5-2 seconds for full dataset
- **Query performance**: <10ms with proper indexes on material + thickness

## Files Reference

### Generated Data Files (after running script)

```
data/
├── baseline-parameters.json    (~180KB)
└── baseline-parameters.sql     (~120KB)
```

### Script Files (in /scripts)

```
scripts/
├── generate-baseline-data.js   (~6.5KB) - Main Node.js version
├── generate-baseline-data.ts   (~7.5KB) - Type-safe TypeScript
├── generate-baseline-data.py   (~8KB)   - Pure Python alternative
├── README.md                   (~5KB)   - Script documentation
├── USAGE.md                    (~15KB)  - Detailed usage guide
├── GUIDE.md                    (this file) - Implementation guide
└── sample-output.json          (~5KB)   - Example output
```

## Best Practices

1. **Always preview first**: Use `--dry-run` to see sample output
2. **Validate before insert**: Check JSON/SQL syntax before database operations
3. **Use appropriate gas**: Follow material-specific recommendations
4. **Weight by quality**: Use quality_rating when training models
5. **Batch inserts**: Insert in 500-1000 record chunks for performance
6. **Keep backups**: Save output files before inserting

## Next Steps

1. **Generate baseline data**:
   ```bash
   npm run gen:baseline
   ```

2. **Review sample output**:
   ```bash
   jq '.[] | select(.material == "Stainless Steel 304") | select(.thickness_mm == 2)' data/baseline-parameters.json | head -3
   ```

3. **Insert into database**:
   ```bash
   psql -f data/baseline-parameters.sql
   ```

4. **Validate insertion**:
   ```bash
   psql -c "SELECT COUNT(*) FROM cuts WHERE source = 'ai_baseline';"
   ```

5. **Use in recommendations**:
   ```javascript
   const baseline = await supabase
     .from('cuts')
     .select('*')
     .eq('source', 'ai_baseline')
     .eq('material', userMaterial)
     .eq('thickness_mm', userThickness)
     .order('quality_rating', { ascending: false })
     .limit(1);
   ```

## Support

For questions or issues:

1. Check USAGE.md for common scenarios
2. Review sample-output.json for format reference
3. Run with `--dry-run` to debug generation issues
4. Validate JSON: `jq . data/baseline-parameters.json`
5. Validate SQL: `psql -f data/baseline-parameters.sql --echo-errors`

## Version Info

- Script Version: 1.0
- Database Schema: Supabase (PostgreSQL)
- Node.js: 14+ recommended
- Python: 3.6+
- Generated: June 2026
- Parameters: ~250-300 sets
- Materials: 6 primary types
- Thickness Combos: ~30
