#!/usr/bin/env node

/**
 * Generate realistic AI baseline laser cutting parameters for Supabase seeding
 *
 * Generates ~250-300 parameter sets across common materials and thicknesses
 * with scientifically reasonable defaults based on material properties.
 *
 * This TypeScript version provides type safety and better IDE support.
 */

import * as fs from 'fs';
import * as path from 'path';

// Type definitions
interface PowerRange {
  min: number;
  max: number;
}

interface SpeedRange {
  min: number;
  max: number;
}

interface MaterialConfig {
  category: string;
  thicknesses: number[];
  gasTypes: string[];
  powerRange: (thickness: number) => PowerRange;
  speedRange: (thickness: number) => SpeedRange;
}

interface ParameterSet {
  material: string;
  thickness_mm: number;
  power_pct: number;
  speed_mm_min: number;
  gas_type: string;
  gas_pressure_bar: number;
  focus_position_mm: number;
  nozzle_diameter_mm: number;
  nozzle_distance_mm: number;
  line_interval_mm: number;
  pulse_frequency_hz?: number;
  quality_rating: number;
  edge_quality: string;
  source: string;
  is_shared: boolean;
  created_at: string;
}

interface DatabaseInsertRow extends ParameterSet {
  machine_id: string;
  user_id: string;
}

// Material properties & cutting parameters
// Based on industry standards for fiber lasers
const MATERIAL_CONFIGS: Record<string, MaterialConfig> = {
  'Stainless Steel 304': {
    category: 'stainless',
    thicknesses: [0.5, 1, 2, 3, 5, 8],
    gasTypes: ['O2', 'N2', 'air'],
    powerRange: (thickness: number): PowerRange => ({
      min: Math.max(20, thickness === 0.5 ? 25 : thickness <= 2 ? 40 : 60),
      max: Math.min(100, thickness === 0.5 ? 80 : thickness <= 2 ? 90 : 100),
    }),
    speedRange: (thickness: number): SpeedRange => ({
      min: thickness === 0.5 ? 800 : thickness <= 2 ? 400 : 150,
      max: thickness === 0.5 ? 1400 : thickness <= 2 ? 800 : 400,
    }),
  },
  'Mild Steel': {
    category: 'mild_steel',
    thicknesses: [0.5, 1, 2, 3, 5, 8],
    gasTypes: ['O2', 'air'],
    powerRange: (thickness: number): PowerRange => ({
      min: thickness === 0.5 ? 20 : thickness <= 2 ? 35 : 50,
      max: thickness === 0.5 ? 75 : thickness <= 2 ? 85 : 95,
    }),
    speedRange: (thickness: number): SpeedRange => ({
      min: thickness === 0.5 ? 900 : thickness <= 2 ? 500 : 200,
      max: thickness === 0.5 ? 1600 : thickness <= 2 ? 1000 : 500,
    }),
  },
  'Aluminum': {
    category: 'aluminum',
    thicknesses: [0.5, 1, 2, 3, 5],
    gasTypes: ['N2', 'air'],
    powerRange: (thickness: number): PowerRange => ({
      min: thickness === 0.5 ? 15 : thickness <= 2 ? 30 : 45,
      max: thickness === 0.5 ? 70 : thickness <= 2 ? 80 : 90,
    }),
    speedRange: (thickness: number): SpeedRange => ({
      min: thickness === 0.5 ? 1000 : thickness <= 2 ? 600 : 300,
      max: thickness === 0.5 ? 1800 : thickness <= 2 ? 1200 : 700,
    }),
  },
  'Acrylic': {
    category: 'non_metal',
    thicknesses: [1, 3, 5, 8, 10],
    gasTypes: ['air'],
    powerRange: (thickness: number): PowerRange => ({
      min: thickness <= 3 ? 10 : 15,
      max: thickness <= 3 ? 40 : 60,
    }),
    speedRange: (thickness: number): SpeedRange => ({
      min: thickness <= 3 ? 200 : 100,
      max: thickness <= 3 ? 600 : 300,
    }),
  },
  'Copper': {
    category: 'copper',
    thicknesses: [0.5, 1, 2, 3],
    gasTypes: ['N2'],
    powerRange: (thickness: number): PowerRange => ({
      min: thickness === 0.5 ? 30 : thickness <= 2 ? 50 : 70,
      max: thickness === 0.5 ? 85 : thickness <= 2 ? 95 : 100,
    }),
    speedRange: (thickness: number): SpeedRange => ({
      min: thickness === 0.5 ? 300 : thickness <= 2 ? 150 : 80,
      max: thickness === 0.5 ? 800 : thickness <= 2 ? 400 : 250,
    }),
  },
  'Leather': {
    category: 'non_metal',
    thicknesses: [1, 2, 3, 5],
    gasTypes: ['air'],
    powerRange: (thickness: number): PowerRange => ({
      min: thickness <= 2 ? 5 : 10,
      max: thickness <= 2 ? 25 : 40,
    }),
    speedRange: (thickness: number): SpeedRange => ({
      min: thickness <= 2 ? 100 : 50,
      max: thickness <= 2 ? 400 : 200,
    }),
  },
};

// Helper functions
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number, decimals: number = 1): number {
  const num = Math.random() * (max - min) + min;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDateInLastNDays(days: number): string {
  const now = new Date();
  const daysAgo = Math.random() * days;
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
}

function generateParameterSet(material: string, thickness: number, config: MaterialConfig): ParameterSet {
  const powerRange = config.powerRange(thickness);
  const speedRange = config.speedRange(thickness);
  const gasType = randomElement(config.gasTypes);

  // Focus position: typically -5 to +5mm relative to surface
  const focusPosition = getRandomFloat(-5, 5, 1);

  // Line interval: affects scan lines per mm, typically 0.05-0.15mm
  const lineInterval = getRandomFloat(0.05, 0.15, 3);

  // Nozzle diameter: typically 1-4mm
  const nozzleDiameter = getRandomFloat(1, 4, 1);

  // Nozzle distance: typically 0.5-2mm from surface
  const nozzleDistance = getRandomFloat(0.5, 2, 1);

  // Gas pressure varies by gas type
  let gasPressure: number;
  if (gasType === 'O2') {
    gasPressure = getRandomFloat(1.5, 3.5, 1);
  } else if (gasType === 'N2') {
    gasPressure = getRandomFloat(2.5, 5, 1);
  } else {
    gasPressure = getRandomFloat(1, 2.5, 1);
  }

  // Power and speed with realistic variation
  const power = getRandomFloat(powerRange.min, powerRange.max, 0);
  const speed = getRandomFloat(speedRange.min, speedRange.max, 0);

  // Quality distribution: 70% 5-star, 20% 4-star, 10% 3-star (realistic for AI baseline)
  const qualityRoll = Math.random();
  let quality: number;
  if (qualityRoll < 0.7) {
    quality = 5;
  } else if (qualityRoll < 0.9) {
    quality = 4;
  } else {
    quality = 3;
  }

  // Edge quality distribution: 75% clean, 25% slight_dross
  const edgeQuality = Math.random() < 0.75 ? 'clean' : 'slight_dross';

  return {
    material,
    thickness_mm: thickness,
    power_pct: power,
    speed_mm_min: speed,
    gas_type: gasType,
    gas_pressure_bar: gasPressure,
    focus_position_mm: focusPosition,
    nozzle_diameter_mm: nozzleDiameter,
    nozzle_distance_mm: nozzleDistance,
    line_interval_mm: lineInterval,
    quality_rating: quality,
    edge_quality: edgeQuality,
    source: 'ai_baseline',
    is_shared: true,
    created_at: generateDateInLastNDays(30),
  };
}

function generateAllParameterSets(): ParameterSet[] {
  const allSets: ParameterSet[] = [];

  for (const [material, config] of Object.entries(MATERIAL_CONFIGS)) {
    for (const thickness of config.thicknesses) {
      // Generate 2-4 variations per material/thickness combo
      const variations = getRandomInt(2, 4);
      for (let i = 0; i < variations; i++) {
        allSets.push(generateParameterSet(material, thickness, config));
      }
    }
  }

  return allSets;
}

function generateSQLInserts(parameterSets: ParameterSet[]): string {
  const inserts: string[] = [];

  inserts.push(
    '-- AI Baseline Laser Cutting Parameters',
    '-- Generated with realistic physics-based defaults',
    '-- Insert via: psql -h <host> -d <db> -U <user> -f inserts.sql',
    '',
    'INSERT INTO cuts (machine_id, user_id, material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, is_shared, created_at) VALUES'
  );

  const valueLines = parameterSets.map((set, idx) => {
    // Use a fixed UUID for baseline machine and user for bulk insert
    const machineId = "'550e8400-e29b-41d4-a716-446655440000'::uuid";
    const userId = "'550e8400-e29b-41d4-a716-446655440001'::uuid";
    const createdAt = `'${set.created_at}'::timestamptz`;

    const values = [
      machineId,
      userId,
      `'${set.material}'`,
      set.thickness_mm,
      set.power_pct,
      set.speed_mm_min,
      `'${set.gas_type}'`,
      set.gas_pressure_bar,
      set.focus_position_mm,
      set.nozzle_diameter_mm,
      set.nozzle_distance_mm,
      set.line_interval_mm,
      set.quality_rating,
      `'${set.edge_quality}'`,
      set.is_shared,
      createdAt,
    ];

    const comma = idx < parameterSets.length - 1 ? ',' : ';';
    return `(${values.join(', ')})${comma}`;
  });

  inserts.push(...valueLines);
  inserts.push('');

  return inserts.join('\n');
}

function generateJSON(parameterSets: ParameterSet[]): string {
  return JSON.stringify(parameterSets, null, 2);
}

function printExamples(parameterSets: ParameterSet[], count: number = 5): void {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`SAMPLE BASELINE PARAMETERS (first ${count} of ${parameterSets.length})`);
  console.log(`${'='.repeat(80)}\n`);

  for (let i = 0; i < Math.min(count, parameterSets.length); i++) {
    const set = parameterSets[i];
    console.log(`[${i + 1}] ${set.material} @ ${set.thickness_mm}mm`);
    console.log(`    Power: ${set.power_pct}% | Speed: ${set.speed_mm_min} mm/min | Gas: ${set.gas_type} @ ${set.gas_pressure_bar} bar`);
    console.log(`    Focus: ${set.focus_position_mm}mm | Nozzle: ${set.nozzle_diameter_mm}mm dia, ${set.nozzle_distance_mm}mm dist`);
    console.log(`    Line interval: ${set.line_interval_mm}mm | Quality: ${set.quality_rating}★ (${set.edge_quality})`);
    console.log('');
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const outputFormat = args.includes('--sql') ? 'sql' : args.includes('--json') ? 'json' : 'both';
  const outputDirIndex = args.indexOf('--output');
  const outputDir = outputDirIndex !== -1 ? args[outputDirIndex + 1] : './data';

  console.log('Generating realistic AI baseline laser cutting parameters...\n');

  // Generate all parameter sets
  const parameterSets = generateAllParameterSets();
  console.log(`✓ Generated ${parameterSets.length} parameter sets`);

  // Show examples
  printExamples(parameterSets, 5);

  if (dryRun) {
    console.log(`\n[DRY RUN] Would generate ${parameterSets.length} records to database.\n`);
    return;
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate outputs
  if (outputFormat === 'json' || outputFormat === 'both') {
    const jsonPath = path.join(outputDir, 'baseline-parameters.json');
    fs.writeFileSync(jsonPath, generateJSON(parameterSets));
    console.log(`✓ JSON output: ${jsonPath}`);
  }

  if (outputFormat === 'sql' || outputFormat === 'both') {
    const sqlPath = path.join(outputDir, 'baseline-parameters.sql');
    fs.writeFileSync(sqlPath, generateSQLInserts(parameterSets));
    console.log(`✓ SQL output: ${sqlPath}`);
  }

  console.log(`\nUsage:`);
  console.log(`  npx node scripts/generate-baseline-data.ts            # Generate both JSON + SQL`);
  console.log(`  npx node scripts/generate-baseline-data.ts --json     # JSON only`);
  console.log(`  npx node scripts/generate-baseline-data.ts --sql      # SQL only`);
  console.log(`  npx node scripts/generate-baseline-data.ts --dry-run  # Preview only`);
  console.log(`  npx node scripts/generate-baseline-data.ts --output ./custom/path`);
}

main();
