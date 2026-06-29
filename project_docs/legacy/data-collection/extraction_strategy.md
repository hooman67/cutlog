# Laser Cutting Parameters: Extraction Strategy & Implementation Guide

## Quick Reference: Prioritized Extraction Roadmap

### Priority 1: Automatic, High-Confidence (Target: 500-700 parameters)
- LightBurn `.cuts` library → 200-400 params
- Epilog PDF guides → 150-250 params  
- Lasertips.org HTML → 100-150 params
- GitHub repos → 50-100 params

### Priority 2: Semi-Automatic (Target: +200-300 parameters)
- Reddit API scraping → 150-250 params
- Manufacturer PDFs → 100-150 params

---

## Tier 1: LightBurn Cut Settings Library

### Why This Source First
- **Format:** Machine-readable XML (`.cuts` files)
- **Volume:** 200-400 curated parameter combinations
- **Quality:** Manufacturer-validated defaults
- **Access:** Free, public library + community contributions
- **Automation:** 95% extractable via script

### Extraction Approach

#### Step 1: Locate LightBurn Library Files

```bash
# Find LightBurn installed library locations
if [ "$(uname)" = "Darwin" ]; then
  LIGHTBURN_DIR="$HOME/Library/Application Support/LightBurn/cuts"
elif [ "$(uname)" = "Linux" ]; then
  LIGHTBURN_DIR="$HOME/.config/LightBurn/cuts"
else
  LIGHTBURN_DIR="$APPDATA/LightBurn/cuts"
fi

# List available cut libraries
find "$LIGHTBURN_DIR" -name "*.cuts" -type f | head -20
```

#### Step 2: Parse `.cuts` XML Format

```python
import xml.etree.ElementTree as ET
import json
from pathlib import Path

def extract_lightburn_cuts(cuts_file_path):
    """
    Parse LightBurn .cuts XML file and extract parameters.
    
    LightBurn .cuts format:
    <CutLibrary>
      <Group name="Material">
        <Cut name="Settings" power="80" speed="500" freq="5000" ...>
          <CustomData key="material">acrylic</CustomData>
          <CustomData key="thickness">3mm</CustomData>
        </Cut>
      </Group>
    </CutLibrary>
    """
    tree = ET.parse(cuts_file_path)
    root = tree.getroot()
    
    parameters = []
    
    for group in root.findall('.//Group'):
        for cut in group.findall('Cut'):
            param = {
                'source': 'LightBurn',
                'source_url': 'https://lightburn.com/',
                'material': None,
                'material_thickness_mm': None,
                'laser_type': 'CO2',  # Default; check for 'laser_type' attribute
                'cutting_power_percent': int(cut.get('power', 0)),
                'cutting_speed_mm_s': int(cut.get('speed', 0)),
                'frequency_khz': int(cut.get('freq', 0)) / 1000 if cut.get('freq') else None,
                'assist_gas': cut.get('air', 'air'),
                'passes': int(cut.get('passes', 1)),
                'z_offset_mm': float(cut.get('zoffset', 0)),
                'quality_notes': cut.get('notes', ''),
                'reliability_score': 0.95,  # High confidence in manufacturer defaults
            }
            
            # Extract custom data attributes
            for custom_data in cut.findall('CustomData'):
                key = custom_data.get('key')
                value = custom_data.text
                if key == 'material':
                    param['material'] = value
                elif key == 'thickness':
                    # Parse "3mm" -> 3.0
                    try:
                        param['material_thickness_mm'] = float(value.replace('mm', ''))
                    except:
                        pass
            
            # Fill group name if material not found in custom data
            if not param['material']:
                param['material'] = group.get('name', 'unknown')
            
            parameters.append(param)
    
    return parameters

# Usage
cuts_file = Path.home() / "Library/Application Support/LightBurn/cuts/Default.cuts"
if cuts_file.exists():
    params = extract_lightburn_cuts(cuts_file)
    print(f"Extracted {len(params)} parameter combinations")
    for p in params[:3]:
        print(json.dumps(p, indent=2))
```

#### Step 3: Download Community LightBurn Library

```bash
# LightBurn community cuts are distributed via:
# 1. Official library (within LightBurn app download)
# 2. Community GitHub repos

git clone https://github.com/tatarize/LaserBurn-Cuts.git ~/lightburn_community
find ~/lightburn_community -name "*.cuts" -o -name "*.json" | wc -l

# Alternative: Extract from LightBurn app installation
# The app includes default material settings in the installation package
```

#### Step 4: Collect All Variations

```python
def harvest_all_lightburn_sources():
    """Collect .cuts files from all LightBurn sources."""
    import os
    
    cuts_paths = []
    
    # User library
    if os.path.isdir(lightburn_cuts_dir):
        for root, dirs, files in os.walk(lightburn_cuts_dir):
            for file in files:
                if file.endswith('.cuts'):
                    cuts_paths.append(os.path.join(root, file))
    
    # Community repos
    community_paths = [
        Path.home() / 'lightburn_community',
        # Add more community sources as discovered
    ]
    
    for path in community_paths:
        if path.exists():
            for root, dirs, files in os.walk(path):
                for file in files:
                    if file.endswith('.cuts') or file.endswith('.json'):
                        cuts_paths.append(os.path.join(root, file))
    
    all_parameters = []
    for cuts_file in cuts_paths:
        try:
            params = extract_lightburn_cuts(cuts_file)
            all_parameters.extend(params)
        except Exception as e:
            print(f"Error parsing {cuts_file}: {e}")
    
    # Deduplicate by (material, thickness, power, speed)
    seen = set()
    deduplicated = []
    for p in all_parameters:
        key = (p['material'], p['material_thickness_mm'], 
               p['cutting_power_percent'], p['cutting_speed_mm_s'])
        if key not in seen:
            seen.add(key)
            deduplicated.append(p)
    
    return deduplicated
```

---

## Tier 2: Epilog Laser Documentation

### Source Structure

Epilog publishes material cutting guides at: `https://www.epiloglabs.com/materialcuttingguides/`

### Extraction Approach

```python
import requests
from bs4 import BeautifulSoup
import re

def scrape_epilog_material_guides():
    """
    Scrape Epilog material cutting guides.
    
    Typical page structure:
    /materialcuttingguides/
      /acrylic/
      /wood/
      /leather/
      etc.
    
    Each page contains HTML tables with:
    Material | Thickness | Power | Speed | Air Assist | Notes
    """
    
    base_url = "https://www.epiloglabs.com"
    materials = [
        'acrylic', 'wood', 'plywood', 'leather', 'fabric',
        'rubber-stamp-material', 'mylar', 'paper', 'cardboard'
    ]
    
    all_parameters = []
    
    for material in materials:
        guide_url = f"{base_url}/materialcuttingguides/{material}/"
        
        try:
            response = requests.get(guide_url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find tables containing cutting parameters
            tables = soup.find_all('table')
            
            for table in tables:
                rows = table.find_all('tr')
                for row in rows[1:]:  # Skip header
                    cells = row.find_all(['td', 'th'])
                    
                    if len(cells) >= 4:
                        try:
                            param = {
                                'source': 'Epilog',
                                'source_url': guide_url,
                                'material': material,
                                'material_thickness_mm': parse_thickness(cells[0].text),
                                'laser_type': 'CO2',  # Epilog primarily CO2
                                'cutting_power_percent': parse_percentage(cells[2].text),
                                'cutting_speed_percent': parse_percentage(cells[3].text),
                                'assist_gas': 'air',
                                'reliability_score': 0.92,
                            }
                            
                            # Try to extract additional notes
                            if len(cells) > 5:
                                param['quality_notes'] = cells[5].text.strip()
                            
                            all_parameters.append(param)
                        except Exception as e:
                            continue
        
        except Exception as e:
            print(f"Error scraping Epilog {material}: {e}")
    
    return all_parameters

def parse_thickness(text):
    """Extract thickness in mm from text like '3mm' or '1/8\"'."""
    # Handle "1/8 inch" format
    if '"' in text:
        match = re.search(r'(\d+)/(\d+)', text)
        if match:
            numerator = int(match.group(1))
            denominator = int(match.group(2))
            return (numerator / denominator) * 25.4  # Convert inches to mm
    
    # Handle "3mm" format
    match = re.search(r'(\d+(?:\.\d+)?)', text)
    if match:
        return float(match.group(1))
    
    return None

def parse_percentage(text):
    """Extract percentage value from text."""
    match = re.search(r'(\d+(?:\.\d+)?)\s*%?', text)
    if match:
        return float(match.group(1))
    return None
```

### Alternative: Extract from PDF Guides

```python
import pdfplumber

def extract_epilog_pdf_guides():
    """
    Extract parameters from Epilog PDF material guides.
    
    PDF location pattern: /resources/documents/material-guides/[material].pdf
    """
    
    pdf_urls = {
        'acrylic': 'https://www.epiloglabs.com/resources/documents/material-guides/acrylic.pdf',
        'wood': 'https://www.epiloglabs.com/resources/documents/material-guides/wood.pdf',
        # ... etc for each material
    }
    
    all_parameters = []
    
    for material, pdf_url in pdf_urls.items():
        try:
            # Download PDF
            response = requests.get(pdf_url, timeout=30)
            pdf_path = f"/tmp/epilog_{material}.pdf"
            
            with open(pdf_path, 'wb') as f:
                f.write(response.content)
            
            # Extract tables using pdfplumber
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    tables = page.extract_tables()
                    
                    for table in tables:
                        # Process each table
                        for row in table[1:]:  # Skip header
                            if len(row) >= 4:
                                param = {
                                    'source': 'Epilog PDF',
                                    'source_url': pdf_url,
                                    'material': material,
                                    'material_thickness_mm': parse_thickness(row[0]),
                                    'cutting_power_percent': parse_percentage(row[2]),
                                    'cutting_speed_percent': parse_percentage(row[3]),
                                    'reliability_score': 0.93,
                                }
                                all_parameters.append(param)
        
        except Exception as e:
            print(f"Error extracting Epilog PDF {material}: {e}")
    
    return all_parameters
```

---

## Tier 3: Reddit Parameter Mining

### Search Strategy

```python
import praw
import re
from datetime import datetime, timedelta

def mine_reddit_parameters(subreddits=['LaserCutting', 'Maker', 'Metalworking']):
    """
    Extract laser cutting parameters from Reddit posts and comments.
    
    Requires: pip install praw
    Setup: https://praw.readthedocs.io/en/latest/getting_started/authentication.html
    """
    
    # Initialize PRAW (Reddit API wrapper)
    reddit = praw.Reddit(
        client_id='YOUR_CLIENT_ID',
        client_secret='YOUR_CLIENT_SECRET',
        user_agent='LaserParamBot/1.0'
    )
    
    all_parameters = []
    
    # Search patterns for laser parameters
    param_patterns = [
        # "100% power, 500 mm/s"
        r'(\d+)\s*%?\s*power[,\s]+(\d+)\s*mm/s',
        # "power: 80"
        r'power[:\s]+(\d+)\s*%?',
        # "speed: 500"
        r'speed[:\s]+(\d+)\s*(mm/s)?',
        # "80% / 500"
        r'(\d+)\s*%?\s*/\s*(\d+)',
    ]
    
    for subreddit_name in subreddits:
        try:
            subreddit = reddit.subreddit(subreddit_name)
            
            # Search for parameter-related posts (last 6 months)
            query = 'cutting settings OR parameters OR power speed'
            
            for submission in subreddit.search(query, sort='relevance', time_filter='year'):
                # Check if post has high engagement (likely reliable)
                if submission.score < 10:
                    continue
                
                param = extract_params_from_submission(submission, param_patterns)
                if param:
                    all_parameters.append(param)
        
        except Exception as e:
            print(f"Error scraping r/{subreddit_name}: {e}")
    
    return all_parameters

def extract_params_from_submission(submission, patterns):
    """Extract parameters from Reddit submission and comments."""
    
    full_text = f"{submission.title} {submission.selftext}"
    
    # Try to match patterns
    for pattern in patterns:
        matches = re.findall(pattern, full_text, re.IGNORECASE)
        if matches:
            try:
                power = int(matches[0][0]) if len(matches[0]) > 0 else None
                speed = int(matches[0][1]) if len(matches[0]) > 1 else None
                
                # Extract material mention
                material = infer_material_from_text(full_text)
                
                return {
                    'source': 'Reddit',
                    'source_url': submission.url,
                    'material': material,
                    'cutting_power_percent': power,
                    'cutting_speed_mm_s': speed,
                    'reliability_score': min(0.5 + (submission.score / 100), 0.85),
                    'verified_by': max(1, submission.score // 10),
                }
            except:
                pass
    
    return None

def infer_material_from_text(text):
    """Try to infer material from post text."""
    materials = ['acrylic', 'wood', 'leather', 'fabric', 'metal', 'plastic']
    text_lower = text.lower()
    
    for material in materials:
        if material in text_lower:
            return material
    
    return 'unknown'
```

### Rate-Limited Reddit Scraping (No API)

```bash
#!/bin/bash
# Simple curl-based Reddit scraping (respects rate limits)

# Search r/LaserCutting for "cutting settings"
for page in {0..5}; do
    offset=$((page * 25))
    
    curl -A "Mozilla/5.0" \
         "https://reddit.com/r/LaserCutting/search.json?q=cutting+settings&sort=relevance&t=year&limit=25&after=$offset" \
         -H "Accept: application/json" \
         | jq '.data.children[].data | {title, selftext, score, url}'
    
    # Rate limit: 1 request per 2 seconds
    sleep 2
done
```

---

## Tier 4: Manufacturer PDF Extraction

### Trumpf/Bystronic/Amada Pattern

```python
import pdfplumber
import csv

def extract_manufacturer_specs(pdf_urls):
    """
    Extract laser cutting parameters from manufacturer spec sheets.
    
    Pattern: Material | Thickness | Power (W) | Speed (m/min) | Gas Pressure
    """
    
    all_parameters = []
    
    for manufacturer, pdf_url in pdf_urls.items():
        try:
            response = requests.get(pdf_url, timeout=30)
            pdf_path = f"/tmp/{manufacturer}_specs.pdf"
            
            with open(pdf_path, 'wb') as f:
                f.write(response.content)
            
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    tables = page.extract_tables()
                    
                    for table in tables:
                        for row in table[1:]:  # Skip header
                            try:
                                param = {
                                    'source': manufacturer.capitalize(),
                                    'source_url': pdf_url,
                                    'material': row[0].strip() if row else None,
                                    'material_thickness_mm': parse_thickness(row[1]) if len(row) > 1 else None,
                                    'laser_type': 'Fiber',  # Manufacturer focus
                                    'cutting_power_w': float(re.search(r'\d+', row[2]).group()) if len(row) > 2 else None,
                                    'cutting_speed_mm_s': convert_mmin_to_mms(row[3]) if len(row) > 3 else None,
                                    'assist_gas_pressure_bar': float(re.search(r'\d+(?:\.\d+)?', row[4]).group()) if len(row) > 4 else None,
                                    'reliability_score': 0.97,  # High confidence in manufacturer data
                                }
                                all_parameters.append(param)
                            except:
                                pass
        
        except Exception as e:
            print(f"Error extracting {manufacturer}: {e}")
    
    return all_parameters

def convert_mmin_to_mms(value_str):
    """Convert m/min to mm/s."""
    # "1000 m/min" -> 1000 * 1000 / 60 = 16667 mm/s
    try:
        match = re.search(r'(\d+(?:\.\d+)?)', value_str)
        if match:
            mmin = float(match.group(1))
            return mmin * 1000 / 60
    except:
        pass
    return None
```

---

## Deduplication Strategy

```python
def deduplicate_parameters(all_params):
    """
    Merge duplicate entries while preserving source attribution.
    
    Group by: (material, thickness, laser_type, power, speed)
    Keep highest reliability_score and merge source list.
    """
    
    from collections import defaultdict
    
    groups = defaultdict(list)
    
    for param in all_params:
        # Create composite key
        key = (
            param.get('material', 'unknown').lower(),
            round(param.get('material_thickness_mm', 0), 1),
            param.get('laser_type', 'unknown'),
            param.get('cutting_power_percent', param.get('cutting_power_w', 0)),
            param.get('cutting_speed_mm_s', param.get('cutting_speed_percent', 0)),
        )
        
        groups[key].append(param)
    
    # Merge duplicate groups
    deduplicated = []
    for key, group in groups.items():
        # Sort by reliability_score, take best
        best = max(group, key=lambda x: x.get('reliability_score', 0.5))
        
        # Merge source URLs
        sources = set(p.get('source') for p in group)
        best['sources'] = list(sources)
        best['verified_by'] = sum(p.get('verified_by', 0) for p in group)
        
        deduplicated.append(best)
    
    return deduplicated
```

---

## Complete Extraction Pipeline

```python
def run_complete_extraction():
    """Orchestrate all extraction sources."""
    
    all_parameters = []
    
    print("Extracting LightBurn...")
    all_parameters.extend(harvest_all_lightburn_sources())
    
    print("Scraping Epilog...")
    all_parameters.extend(scrape_epilog_material_guides())
    all_parameters.extend(extract_epilog_pdf_guides())
    
    print("Mining Reddit...")
    all_parameters.extend(mine_reddit_parameters())
    
    print("Extracting manufacturer specs...")
    manufacturer_pdfs = {
        'trumpf': 'https://www.trumpf.com/en_US/products/.../cutting-speed-reference.pdf',
        'bystronic': 'https://www.bystronic.com/.../specifications.pdf',
        'amada': 'https://www.amadaus.com/.../cutting-guides.pdf',
    }
    all_parameters.extend(extract_manufacturer_specs(manufacturer_pdfs))
    
    print(f"Collected {len(all_parameters)} total parameters")
    
    # Deduplicate
    deduplicated = deduplicate_parameters(all_parameters)
    print(f"After deduplication: {len(deduplicated)} unique parameters")
    
    # Save to JSON
    with open('laser_cutting_parameters.json', 'w') as f:
        json.dump(deduplicated, f, indent=2)
    
    # Generate CSV for analysis
    with open('laser_cutting_parameters.csv', 'w', newline='') as f:
        if deduplicated:
            fieldnames = deduplicated[0].keys()
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(deduplicated)
    
    return deduplicated

if __name__ == '__main__':
    params = run_complete_extraction()
```

---

## Expected Output Format

```json
{
  "parameters": [
    {
      "id": "param_001",
      "source": "LightBurn",
      "sources": ["LightBurn", "Reddit"],
      "source_url": "https://lightburn.com/",
      "material": "acrylic",
      "material_thickness_mm": 3.0,
      "laser_type": "CO2",
      "laser_power_w": 80,
      "cutting_power_percent": 80,
      "cutting_speed_mm_s": 500,
      "cutting_speed_percent": null,
      "frequency_khz": 5.0,
      "pulse_duration_us": null,
      "assist_gas": "air",
      "assist_gas_pressure_bar": null,
      "passes": 1,
      "z_offset_mm": 0,
      "air_assist_strength": "medium",
      "kerf_width_mm": 0.1,
      "quality_notes": "clean cut, no charring",
      "reliability_score": 0.95,
      "verified_by": 0,
      "date_added": "2026-06-12"
    }
  ],
  "metadata": {
    "total_parameters": 850,
    "unique_materials": 15,
    "unique_laser_types": 4,
    "average_reliability": 0.82,
    "extraction_date": "2026-06-12",
    "sources_used": ["LightBurn", "Epilog", "Reddit", "Trumpf", "Bystronic", "Amada"]
  }
}
```

