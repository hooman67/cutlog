#!/usr/bin/env node

/**
 * Test suite to validate baseline parameter generation
 * Verifies data format, constraints, and database compatibility
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function test(name, fn) {
  try {
    fn();
    log(`✓ ${name}`, 'green');
    return true;
  } catch (error) {
    log(`✗ ${name}: ${error.message}`, 'red');
    return false;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} (expected ${expected}, got ${actual})`);
  }
}

function assertRange(value, min, max, message) {
  if (value < min || value > max) {
    throw new Error(`${message} - value ${value} not in range [${min}, ${max}]`);
  }
}

// Test Suite
function runTests() {
  const dataDir = './data';
  const jsonFile = path.join(dataDir, 'baseline-parameters.json');
  const sqlFile = path.join(dataDir, 'baseline-parameters.sql');

  let passed = 0;
  let failed = 0;

  // Section: File validation
  log('\n=== FILE VALIDATION ===\n', 'blue');

  if (test('JSON file exists', () => assert(fs.existsSync(jsonFile), 'baseline-parameters.json not found'))) {
    passed++;
  } else {
    failed++;
  }

  if (test('SQL file exists', () => assert(fs.existsSync(sqlFile), 'baseline-parameters.sql not found'))) {
    passed++;
  } else {
    failed++;
  }

  // Load JSON data
  let data = [];
  if (fs.existsSync(jsonFile)) {
    try {
      const jsonContent = fs.readFileSync(jsonFile, 'utf-8');
      data = JSON.parse(jsonContent);
      log(`✓ JSON file is valid (${data.length} records)`, 'green');
      passed++;
    } catch (e) {
      log(`✗ JSON parsing failed: ${e.message}`, 'red');
      failed++;
      return { passed, failed };
    }
  }

  // Section: Data structure validation
  log('\n=== DATA STRUCTURE VALIDATION ===\n', 'blue');

  if (test('Data is array', () => assert(Array.isArray(data), 'Data is not an array'))) {
    passed++;
  } else {
    failed++;
  }

  if (test('Data has records', () => assert(data.length > 0, 'No records in data'))) {
    passed++;
  } else {
    failed++;
  }

  if (test('Data count in range (250-300)', () => assertRange(data.length, 250, 300, 'Record count'))) {
    passed++;
  } else {
    failed++;
  }

  // Section: Record validation
  log('\n=== RECORD VALIDATION ===\n', 'blue');

  const sampleSize = Math.min(10, data.length);
  const requiredFields = [
    'material',
    'thickness_mm',
    'power_pct',
    'speed_mm_min',
    'gas_type',
    'gas_pressure_bar',
    'focus_position_mm',
    'nozzle_diameter_mm',
    'nozzle_distance_mm',
    'line_interval_mm',
    'quality_rating',
    'edge_quality',
    'source',
    'is_shared',
    'created_at',
  ];

  if (test(`All ${sampleSize} sample records have required fields`, () => {
    for (let i = 0; i < sampleSize; i++) {
      const record = data[i];
      for (const field of requiredFields) {
        assert(field in record, `Missing field '${field}' in record ${i}`);
      }
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Section: Field value validation
  log('\n=== FIELD VALUE VALIDATION ===\n', 'blue');

  const validMaterials = ['Stainless Steel 304', 'Mild Steel', 'Aluminum', 'Acrylic', 'Copper', 'Leather'];
  const validGasTypes = ['O2', 'N2', 'air'];
  const validEdgeQualities = ['clean', 'slight_dross'];

  if (
    test('Material values are valid', () => {
      for (const record of data) {
        assert(
          validMaterials.includes(record.material),
          `Invalid material: ${record.material}`
        );
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Gas type values are valid', () => {
      for (const record of data) {
        assert(validGasTypes.includes(record.gas_type), `Invalid gas_type: ${record.gas_type}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Edge quality values are valid', () => {
      for (const record of data) {
        assert(validEdgeQualities.includes(record.edge_quality), `Invalid edge_quality: ${record.edge_quality}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Power percentages in valid range (5-100%)', () => {
      for (const record of data) {
        assertRange(record.power_pct, 5, 100, `Power: ${record.power_pct}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Speed values in valid range (50-1800 mm/min)', () => {
      for (const record of data) {
        assertRange(record.speed_mm_min, 50, 1800, `Speed: ${record.speed_mm_min}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Gas pressure in valid range (1-5 bar)', () => {
      for (const record of data) {
        assertRange(record.gas_pressure_bar, 1, 5, `Pressure: ${record.gas_pressure_bar}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Quality ratings are 1-5', () => {
      for (const record of data) {
        assertRange(record.quality_rating, 1, 5, `Rating: ${record.quality_rating}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Focus position in range (-5 to +5 mm)', () => {
      for (const record of data) {
        assertRange(record.focus_position_mm, -5, 5, `Focus: ${record.focus_position_mm}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Nozzle diameter in range (1-4 mm)', () => {
      for (const record of data) {
        assertRange(record.nozzle_diameter_mm, 1, 4, `Nozzle dia: ${record.nozzle_diameter_mm}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Nozzle distance in range (0.5-2 mm)', () => {
      for (const record of data) {
        assertRange(record.nozzle_distance_mm, 0.5, 2, `Nozzle dist: ${record.nozzle_distance_mm}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (
    test('Line interval in range (0.05-0.15 mm)', () => {
      for (const record of data) {
        assertRange(record.line_interval_mm, 0.05, 0.15, `Line interval: ${record.line_interval_mm}`);
      }
    })
  ) {
    passed++;
  } else {
    failed++;
  }

  if (test('Timestamps are ISO 8601 format', () => {
    for (const record of data) {
      const date = new Date(record.created_at);
      assert(!isNaN(date.getTime()), `Invalid timestamp: ${record.created_at}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  if (test('is_shared is boolean', () => {
    for (const record of data) {
      assert(typeof record.is_shared === 'boolean', `is_shared is not boolean: ${record.is_shared}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  if (test("source is 'ai_baseline'", () => {
    for (const record of data) {
      assertEqual(record.source, 'ai_baseline', `Source: ${record.source}`);
    }
  })) {
    passed++;
  } else {
    failed++;
  }

  // Section: SQL validation
  log('\n=== SQL VALIDATION ===\n', 'blue');

  if (fs.existsSync(sqlFile)) {
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    if (
      test('SQL file contains INSERT statement', () => {
        assert(sqlContent.includes('INSERT INTO cuts'), 'No INSERT statement found');
      })
    ) {
      passed++;
    } else {
      failed++;
    }

    if (
      test('SQL file contains VALUES clause', () => {
        assert(sqlContent.includes('VALUES'), 'No VALUES clause found');
      })
    ) {
      passed++;
    } else {
      failed++;
    }

    if (
      test('SQL file ends with semicolon', () => {
        assert(sqlContent.trim().endsWith(';'), 'SQL does not end with semicolon');
      })
    ) {
      passed++;
    } else {
      failed++;
    }

    if (
      test('SQL has correct number of value tuples', () => {
        const tupleCount = (sqlContent.match(/\(/g) || []).length - 1; // -1 for the column list
        assert(Math.abs(tupleCount - data.length) < 2, `Expected ~${data.length} tuples, got ${tupleCount}`);
      })
    ) {
      passed++;
    } else {
      failed++;
    }
  }

  // Section: Statistical analysis
  log('\n=== STATISTICAL ANALYSIS ===\n', 'blue');

  const stats = {
    materials: {},
    gasTypes: {},
    qualityRatings: {},
    edgeQualities: {},
  };

  for (const record of data) {
    // Material distribution
    stats.materials[record.material] = (stats.materials[record.material] || 0) + 1;

    // Gas type distribution
    stats.gasTypes[record.gas_type] = (stats.gasTypes[record.gas_type] || 0) + 1;

    // Quality distribution
    stats.qualityRatings[record.quality_rating] = (stats.qualityRatings[record.quality_rating] || 0) + 1;

    // Edge quality distribution
    stats.edgeQualities[record.edge_quality] = (stats.edgeQualities[record.edge_quality] || 0) + 1;
  }

  log('Material Distribution:', 'blue');
  for (const [material, count] of Object.entries(stats.materials).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / data.length) * 100).toFixed(1);
    log(`  ${material}: ${count} (${pct}%)`);
  }

  log('\nGas Type Distribution:', 'blue');
  for (const [gas, count] of Object.entries(stats.gasTypes).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / data.length) * 100).toFixed(1);
    log(`  ${gas}: ${count} (${pct}%)`);
  }

  log('\nQuality Rating Distribution:', 'blue');
  for (const rating of [5, 4, 3, 2, 1]) {
    const count = stats.qualityRatings[rating] || 0;
    const pct = ((count / data.length) * 100).toFixed(1);
    const stars = '★'.repeat(rating);
    log(`  ${stars}: ${count} (${pct}%)`);
  }

  log('\nEdge Quality Distribution:', 'blue');
  for (const [quality, count] of Object.entries(stats.edgeQualities).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / data.length) * 100).toFixed(1);
    log(`  ${quality}: ${count} (${pct}%)`);
  }

  // Section: Summary
  log('\n=== SUMMARY ===\n', 'blue');

  const total = passed + failed;
  const passRate = ((passed / total) * 100).toFixed(1);

  log(`Total Tests: ${total}`);
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  log(`Pass Rate: ${passRate}%`, passRate >= 95 ? 'green' : 'yellow');

  if (failed === 0) {
    log('\n✓ All tests passed! Data is ready for database insertion.\n', 'green');
  } else {
    log('\n✗ Some tests failed. Please review the errors above.\n', 'red');
  }

  return { passed, failed };
}

// Run tests
const results = runTests();
process.exit(results.failed > 0 ? 1 : 0);
