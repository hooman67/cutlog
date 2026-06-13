#!/usr/bin/env python3

"""
Generate realistic AI baseline laser cutting parameters for Supabase seeding

Generates 500-600 parameter sets across 20 materials and thicknesses
with scientifically reasonable defaults based on material properties.

Usage:
    python3 generate-baseline-data.py              # Generate both JSON + SQL
    python3 generate-baseline-data.py --dry-run    # Preview only
    python3 generate-baseline-data.py --json       # JSON only
    python3 generate-baseline-data.py --sql        # SQL only
    python3 generate-baseline-data.py --output /path/to/dir
"""

import json
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple

# Material properties & cutting parameters
# Based on industry standards for fiber lasers
MATERIAL_CONFIGS = {
    # --- EXISTING MATERIALS (unchanged) ---
    'Stainless Steel 304': {
        'category': 'stainless',
        'thicknesses': [0.5, 1, 2, 3, 5, 8],
        'gas_types': ['O2', 'N2', 'air'],
        'power_ranges': {
            0.5: (25, 80),
            1: (40, 90),
            2: (40, 90),
            3: (60, 100),
            5: (60, 100),
            8: (60, 100),
        },
        'speed_ranges': {
            0.5: (800, 1400),
            1: (400, 800),
            2: (400, 800),
            3: (150, 400),
            5: (150, 400),
            8: (150, 400),
        },
    },
    'Mild Steel': {
        'category': 'mild_steel',
        'thicknesses': [0.5, 1, 2, 3, 5, 8],
        'gas_types': ['O2', 'air'],
        'power_ranges': {
            0.5: (20, 75),
            1: (35, 85),
            2: (35, 85),
            3: (50, 95),
            5: (50, 95),
            8: (50, 95),
        },
        'speed_ranges': {
            0.5: (900, 1600),
            1: (500, 1000),
            2: (500, 1000),
            3: (200, 500),
            5: (200, 500),
            8: (200, 500),
        },
    },
    'Aluminum': {
        'category': 'aluminum',
        'thicknesses': [0.5, 1, 2, 3, 5],
        'gas_types': ['N2', 'air'],
        'power_ranges': {
            0.5: (15, 70),
            1: (30, 80),
            2: (30, 80),
            3: (45, 90),
            5: (45, 90),
        },
        'speed_ranges': {
            0.5: (1000, 1800),
            1: (600, 1200),
            2: (600, 1200),
            3: (300, 700),
            5: (300, 700),
        },
    },
    'Acrylic': {
        'category': 'non_metal',
        'thicknesses': [1, 3, 5, 8, 10],
        'gas_types': ['air'],
        'power_ranges': {
            1: (10, 40),
            3: (10, 40),
            5: (15, 60),
            8: (15, 60),
            10: (15, 60),
        },
        'speed_ranges': {
            1: (200, 600),
            3: (200, 600),
            5: (100, 300),
            8: (100, 300),
            10: (100, 300),
        },
    },
    'Copper': {
        'category': 'copper',
        'thicknesses': [0.5, 1, 2, 3],
        'gas_types': ['N2'],
        'power_ranges': {
            0.5: (30, 85),
            1: (50, 95),
            2: (50, 95),
            3: (70, 100),
        },
        'speed_ranges': {
            0.5: (300, 800),
            1: (150, 400),
            2: (150, 400),
            3: (80, 250),
        },
    },
    'Leather': {
        'category': 'non_metal',
        'thicknesses': [1, 2, 3, 5],
        'gas_types': ['air'],
        'power_ranges': {
            1: (5, 25),
            2: (5, 25),
            3: (10, 40),
            5: (10, 40),
        },
        'speed_ranges': {
            1: (100, 400),
            2: (100, 400),
            3: (50, 200),
            5: (50, 200),
        },
    },
    # --- NEW MATERIALS ---
    'Stainless Steel 316': {
        'category': 'stainless',
        'thicknesses': [0.5, 1, 2, 3, 5, 8],
        'gas_types': ['N2', 'O2'],
        'power_ranges': {
            0.5: (30, 80),
            1: (45, 92),
            2: (50, 95),
            3: (65, 100),
            5: (70, 100),
            8: (80, 100),
        },
        'speed_ranges': {
            0.5: (750, 1350),
            1: (380, 780),
            2: (250, 600),
            3: (140, 380),
            5: (80, 250),
            8: (40, 150),
        },
    },
    'Stainless Steel 430': {
        'category': 'stainless',
        'thicknesses': [0.5, 1, 2, 3, 5],
        'gas_types': ['N2', 'O2'],
        'power_ranges': {
            0.5: (25, 75),
            1: (40, 88),
            2: (45, 92),
            3: (60, 98),
            5: (65, 100),
        },
        'speed_ranges': {
            0.5: (850, 1500),
            1: (420, 850),
            2: (280, 650),
            3: (160, 420),
            5: (90, 280),
        },
    },
    'Carbon Steel': {
        'category': 'mild_steel',
        'thicknesses': [0.5, 1, 2, 3, 5, 8, 10, 12],
        'gas_types': ['O2', 'air'],
        'power_ranges': {
            0.5: (20, 70),
            1: (30, 80),
            2: (40, 88),
            3: (50, 92),
            5: (55, 95),
            8: (65, 100),
            10: (75, 100),
            12: (85, 100),
        },
        'speed_ranges': {
            0.5: (1000, 1800),
            1: (600, 1200),
            2: (400, 900),
            3: (250, 600),
            5: (150, 400),
            8: (80, 250),
            10: (50, 180),
            12: (30, 120),
        },
    },
    'Galvanized Steel': {
        'category': 'mild_steel',
        'thicknesses': [0.5, 1, 2, 3, 5],
        'gas_types': ['O2', 'N2', 'air'],
        'power_ranges': {
            0.5: (25, 75),
            1: (35, 85),
            2: (45, 90),
            3: (55, 95),
            5: (60, 100),
        },
        'speed_ranges': {
            0.5: (850, 1500),
            1: (450, 950),
            2: (300, 700),
            3: (180, 450),
            5: (100, 300),
        },
    },
    'Brass': {
        'category': 'copper',
        'thicknesses': [0.5, 1, 2, 3],
        'gas_types': ['N2', 'air'],
        'power_ranges': {
            0.5: (30, 80),
            1: (45, 90),
            2: (55, 95),
            3: (65, 100),
        },
        'speed_ranges': {
            0.5: (400, 900),
            1: (200, 500),
            2: (120, 350),
            3: (70, 200),
        },
    },
    'Titanium': {
        'category': 'exotic',
        'thicknesses': [0.5, 1, 2, 3],
        'gas_types': ['N2', 'Ar'],
        'power_ranges': {
            0.5: (25, 75),
            1: (40, 88),
            2: (55, 95),
            3: (65, 100),
        },
        'speed_ranges': {
            0.5: (600, 1200),
            1: (350, 750),
            2: (180, 450),
            3: (100, 300),
        },
    },
    'Inconel': {
        'category': 'exotic',
        'thicknesses': [1, 2, 3],
        'gas_types': ['N2', 'Ar'],
        'power_ranges': {
            1: (55, 95),
            2: (65, 100),
            3: (75, 100),
        },
        'speed_ranges': {
            1: (200, 500),
            2: (100, 300),
            3: (50, 180),
        },
    },
    'Hastelloy': {
        'category': 'exotic',
        'thicknesses': [1, 2, 3],
        'gas_types': ['N2', 'Ar'],
        'power_ranges': {
            1: (55, 95),
            2: (70, 100),
            3: (80, 100),
        },
        'speed_ranges': {
            1: (180, 450),
            2: (90, 280),
            3: (45, 160),
        },
    },
    'Plywood': {
        'category': 'non_metal',
        'thicknesses': [3, 5, 8, 12, 18],
        'gas_types': ['air'],
        'power_ranges': {
            3: (15, 45),
            5: (20, 55),
            8: (30, 65),
            12: (40, 75),
            18: (55, 90),
        },
        'speed_ranges': {
            3: (300, 700),
            5: (200, 500),
            8: (120, 350),
            12: (70, 200),
            18: (30, 120),
        },
    },
    'MDF': {
        'category': 'non_metal',
        'thicknesses': [3, 5, 8, 12],
        'gas_types': ['air'],
        'power_ranges': {
            3: (12, 40),
            5: (18, 50),
            8: (25, 60),
            12: (35, 75),
        },
        'speed_ranges': {
            3: (350, 800),
            5: (250, 600),
            8: (150, 400),
            12: (80, 250),
        },
    },
    'Polycarbonate': {
        'category': 'non_metal',
        'thicknesses': [1, 2, 3, 5],
        'gas_types': ['air', 'N2'],
        'power_ranges': {
            1: (8, 30),
            2: (12, 40),
            3: (18, 50),
            5: (25, 65),
        },
        'speed_ranges': {
            1: (300, 700),
            2: (200, 500),
            3: (120, 350),
            5: (70, 220),
        },
    },
    'Rubber': {
        'category': 'non_metal',
        'thicknesses': [1, 2, 3, 5],
        'gas_types': ['air'],
        'power_ranges': {
            1: (8, 30),
            2: (12, 38),
            3: (18, 48),
            5: (25, 60),
        },
        'speed_ranges': {
            1: (150, 500),
            2: (100, 350),
            3: (60, 250),
            5: (30, 150),
        },
    },
    'Felt': {
        'category': 'non_metal',
        'thicknesses': [1, 2, 3],
        'gas_types': ['air'],
        'power_ranges': {
            1: (5, 20),
            2: (8, 28),
            3: (12, 35),
        },
        'speed_ranges': {
            1: (200, 600),
            2: (150, 450),
            3: (100, 350),
        },
    },
    'Cork': {
        'category': 'non_metal',
        'thicknesses': [2, 3, 5],
        'gas_types': ['air'],
        'power_ranges': {
            2: (8, 25),
            3: (12, 35),
            5: (18, 45),
        },
        'speed_ranges': {
            2: (200, 550),
            3: (150, 400),
            5: (80, 250),
        },
    },
}


def get_random_int(min_val: int, max_val: int) -> int:
    """Generate random integer between min and max."""
    return random.randint(min_val, max_val)


def get_random_float(min_val: float, max_val: float, decimals: int = 1) -> float:
    """Generate random float with specified decimal places."""
    val = random.uniform(min_val, max_val)
    return round(val, decimals)


def random_element(arr: List) -> any:
    """Return random element from list."""
    return random.choice(arr)


def generate_date_in_last_n_days(days: int) -> str:
    """Generate ISO datetime string for date in last N days."""
    now = datetime.utcnow()
    days_ago = random.uniform(0, days)
    date = now - timedelta(days=days_ago)
    return date.isoformat() + 'Z'


def generate_parameter_set(material: str, thickness: float, config: Dict) -> Dict:
    """Generate a single parameter set for material/thickness combo."""

    power_min, power_max = config['power_ranges'][thickness]
    speed_min, speed_max = config['speed_ranges'][thickness]
    gas_type = random_element(config['gas_types'])

    # Focus position: typically -5 to +5mm
    focus_position = get_random_float(-5, 5, 1)

    # Line interval: typically 0.05-0.15mm
    line_interval = get_random_float(0.05, 0.15, 3)

    # Nozzle diameter: typically 1-4mm
    nozzle_diameter = get_random_float(1, 4, 1)

    # Nozzle distance: typically 0.5-2mm
    nozzle_distance = get_random_float(0.5, 2, 1)

    # Gas pressure varies by type
    if gas_type == 'O2':
        gas_pressure = get_random_float(1.5, 3.5, 1)
    elif gas_type == 'N2':
        gas_pressure = get_random_float(2.5, 5, 1)
    elif gas_type == 'Ar':
        gas_pressure = get_random_float(3.0, 6.0, 1)
    else:
        gas_pressure = get_random_float(1, 2.5, 1)

    # Power and speed
    power = get_random_float(power_min, power_max, 0)
    speed = get_random_float(speed_min, speed_max, 0)

    # Quality distribution: 70% 5-star, 20% 4-star, 10% 3-star
    quality_roll = random.random()
    if quality_roll < 0.7:
        quality = 5
    elif quality_roll < 0.9:
        quality = 4
    else:
        quality = 3

    # Edge quality: 75% clean, 25% slight_dross
    edge_quality = 'clean' if random.random() < 0.75 else 'slight_dross'

    return {
        'material': material,
        'thickness_mm': thickness,
        'power_pct': int(power),
        'speed_mm_min': int(speed),
        'gas_type': gas_type,
        'gas_pressure_bar': gas_pressure,
        'focus_position_mm': focus_position,
        'nozzle_diameter_mm': nozzle_diameter,
        'nozzle_distance_mm': nozzle_distance,
        'line_interval_mm': line_interval,
        'quality_rating': quality,
        'edge_quality': edge_quality,
        'source': 'ai_baseline',
        'is_shared': True,
        'created_at': generate_date_in_last_n_days(30),
    }


def generate_all_parameter_sets() -> List[Dict]:
    """Generate all parameter sets."""
    all_sets = []

    for material, config in MATERIAL_CONFIGS.items():
        for thickness in config['thicknesses']:
            # Generate 5-7 variations per material/thickness combo
            variations = random.randint(5, 7)
            for _ in range(variations):
                all_sets.append(generate_parameter_set(material, thickness, config))

    return all_sets


def generate_sql_inserts(parameter_sets: List[Dict]) -> str:
    """Generate SQL INSERT statements."""
    lines = [
        '-- AI Baseline Laser Cutting Parameters',
        '-- Generated with realistic physics-based defaults',
        '-- Paste into Supabase SQL Editor to insert',
        '',
        'INSERT INTO cuts (material, thickness_mm, power_pct, speed_mm_min, gas_type, gas_pressure_bar, focus_position_mm, nozzle_diameter_mm, nozzle_distance_mm, line_interval_mm, quality_rating, edge_quality, source, is_shared, created_at) VALUES',
    ]

    for idx, set_data in enumerate(parameter_sets):
        created_at = f"'{set_data['created_at']}'::timestamptz"

        values = [
            f"'{set_data['material']}'",
            str(set_data['thickness_mm']),
            str(set_data['power_pct']),
            str(set_data['speed_mm_min']),
            f"'{set_data['gas_type']}'",
            str(set_data['gas_pressure_bar']),
            str(set_data['focus_position_mm']),
            str(set_data['nozzle_diameter_mm']),
            str(set_data['nozzle_distance_mm']),
            str(set_data['line_interval_mm']),
            str(set_data['quality_rating']),
            f"'{set_data['edge_quality']}'",
            "'ai_baseline'",
            'true',
            created_at,
        ]

        comma = ',' if idx < len(parameter_sets) - 1 else ';'
        lines.append(f"({', '.join(values)}){comma}")

    lines.append('')
    return '\n'.join(lines)


def generate_json(parameter_sets: List[Dict]) -> str:
    """Generate JSON output."""
    return json.dumps(parameter_sets, indent=2)


def print_examples(parameter_sets: List[Dict], count: int = 5) -> None:
    """Print sample parameters to console."""
    print(f"\n{'='*80}")
    print(f"SAMPLE BASELINE PARAMETERS (first {count} of {len(parameter_sets)})")
    print(f"{'='*80}\n")

    for i, set_data in enumerate(parameter_sets[:count]):
        print(f"[{i+1}] {set_data['material']} @ {set_data['thickness_mm']}mm")
        print(f"    Power: {set_data['power_pct']}% | Speed: {set_data['speed_mm_min']} mm/min | Gas: {set_data['gas_type']} @ {set_data['gas_pressure_bar']} bar")
        print(f"    Focus: {set_data['focus_position_mm']}mm | Nozzle: {set_data['nozzle_diameter_mm']}mm dia, {set_data['nozzle_distance_mm']}mm dist")
        print(f"    Line interval: {set_data['line_interval_mm']}mm | Quality: {set_data['quality_rating']}★ ({set_data['edge_quality']})")
        print()


def main():
    """Main entry point."""
    args = sys.argv[1:]
    dry_run = '--dry-run' in args
    output_format = 'sql' if '--sql' in args else 'json' if '--json' in args else 'both'

    output_dir = './data'
    if '--output' in args:
        output_dir = args[args.index('--output') + 1]

    print('Generating realistic AI baseline laser cutting parameters...\n')

    # Generate all parameter sets
    parameter_sets = generate_all_parameter_sets()
    print(f'✓ Generated {len(parameter_sets)} parameter sets')

    # Show examples
    print_examples(parameter_sets, 5)

    if dry_run:
        print(f'\n[DRY RUN] Would generate {len(parameter_sets)} records to database.\n')
        return

    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate outputs
    if output_format in ('json', 'both'):
        json_path = output_path / 'baseline-parameters.json'
        json_path.write_text(generate_json(parameter_sets))
        print(f'✓ JSON output: {json_path}')

    if output_format in ('sql', 'both'):
        sql_path = output_path / 'baseline-parameters.sql'
        sql_path.write_text(generate_sql_inserts(parameter_sets))
        print(f'✓ SQL output: {sql_path}')

    print(f'\nUsage:')
    print(f'  python3 scripts/generate-baseline-data.py            # Generate both JSON + SQL')
    print(f'  python3 scripts/generate-baseline-data.py --json     # JSON only')
    print(f'  python3 scripts/generate-baseline-data.py --sql      # SQL only')
    print(f'  python3 scripts/generate-baseline-data.py --dry-run  # Preview only')
    print(f'  python3 scripts/generate-baseline-data.py --output ./custom/path')


if __name__ == '__main__':
    main()
