# CutLog Recommendation Algorithm

How the "How fast should I cut?" feature works today, end to end.

---

## 1. Current Algorithm (How It Works Today)

### Search Input
The user provides two inputs:
- **Material** (free-text with autocomplete from the `materials` table, matched on `name` or `aliases`)
- **Thickness** (numeric, in mm)

### Supabase Queries (Three Tiers)

When the user hits "Get Speed Recommendation", the code fires **three sequential queries** against the `cuts` table:

#### Tier 1: Own Cuts (User's History)
```sql
SELECT * FROM cuts
WHERE user_id = {current_user}
  AND material ILIKE '%{searchMaterial}%'
  AND thickness_mm BETWEEN {thickness - 0.5} AND {thickness + 0.5}
ORDER BY quality_rating DESC
LIMIT 10
```
- **Material match**: Case-insensitive substring (`ILIKE '%...%'`)
- **Thickness match**: +/- 0.5mm tolerance window

#### Tier 2: AI Baseline
```sql
SELECT * FROM cuts
WHERE material ILIKE '%{searchMaterial}%'
  AND source = 'ai_baseline'
  AND thickness_mm BETWEEN {thickness - 0.5} AND {thickness + 0.5}
ORDER BY quality_rating DESC
LIMIT 10
```
- Same material/thickness logic as Tier 1
- Restricted to `source = 'ai_baseline'` (pre-seeded reference data)

#### Tier 3: Community (Shared User Cuts)
```sql
SELECT * FROM cuts
WHERE source != 'ai_baseline'
  AND material ILIKE '%{searchMaterial}%'
  AND is_shared = true
  AND thickness_mm BETWEEN {thickness - 1.0} AND {thickness + 1.0}
ORDER BY quality_rating DESC
LIMIT 10
```
- Broader thickness tolerance: **+/- 1.0mm**
- Excludes AI baseline, requires `is_shared = true`

### Filtering (Quality Gate)

After all three queries return, results are passed to `computeSpeedRecommendation()` which filters:

```
Only cuts where:
  speed_mm_min IS NOT NULL
  AND (quality_rating IS NULL OR quality_rating >= 3)
```

Cuts with `quality_rating < 3` are excluded. Null ratings are **included** (benefit of the doubt).

### Speed Computation

Speed is a **simple arithmetic mean** of all qualifying cuts across all tiers:

```
avgSpeed = sum(scaled_speed || speed_mm_min) / count
```

- No weighting by source tier (own data weighted equally to community data)
- No weighting by quality rating (a 3-star cut counts the same as a 5-star cut)
- No weighting by recency
- All tiers are pooled together into a single average

Supporting parameters are also averaged:
- `avgPower` = mean of all power values
- `avgGasPressure` = mean of gas pressures
- `avgFocus` = mean of focus positions
- `avgNozzle` = mean of nozzle diameters
- `commonGasType` = mode (most frequently occurring gas type)

### Confidence Determination

Based purely on **count of qualifying data points**:

| Data Points | Confidence |
|-------------|-----------|
| >= 10       | HIGH      |
| >= 5        | MEDIUM    |
| < 5         | LOW       |

No consideration of data quality, consistency, or source tier.

### Parameter Scaling (Lens/Wattage)

If the user has a machine profile configured, each cut is individually scaled before averaging using physics-based formulas from the LaserSecrets/LaserParamsConverter project:

**Power scaling formula (fiber lasers):**
```
power_modifier = (original_power_pct * target_lens_mm) / source_lens_mm
output_power_pct = (source_wattage * power_modifier) / target_wattage
```

**Speed scaling:**
- Speed only changes if scaled power exceeds 100% (machine max)
- In that case: `speed_modifier = original_power / computed_power`
- Speed is reduced proportionally to compensate

**Key behaviors:**
- CO2 lasers skip lens scaling entirely (lens values forced to 1)
- Cross-type scaling (e.g., fiber to CO2) is blocked entirely
- If source lens/wattage match user's machine, no scaling is applied
- Warning levels: >1.5x factor = warning, >2x factor = danger

### Speed Profile Application

The user's machine has a `speed_profile` setting:

| Profile        | Multiplier | Behavior                          |
|---------------|-----------|-----------------------------------|
| `fast`        | 1.0x      | Full computed speed (production)  |
| `conservative`| 0.5x      | Half speed (quality priority)     |
| `auto`        | -         | Uses `fast` (cutting default)     |

The displayed "hero speed" is:
- **Conservative**: `avgSpeed * 0.5`
- **Fast** or **Auto**: `avgSpeed * 1.0`

### No Match Behavior

When **all three queries return zero results**, the page shows a static empty state with three suggestions:
1. Import your LightBurn library (.clb file)
2. Log your first test cut
3. Try a broader search

There is **no fallback logic** -- no relaxed search, no nearest-neighbor lookup, no interpolation.

---

## 2. Data Flow Diagram

```
User Input
  material: "Stainless Steel"  thickness: 4mm
         |
         v
+-----------------------------+
| Material Autocomplete       |
| (materials table: name +    |
|  aliases, client-side filter)|
+-----------------------------+
         |
         v
+-----------------------------+
| Tier 1: Own Cuts Query      |
| ILIKE '%material%'          |
| thickness +/- 0.5mm         |
| LIMIT 10                    |
+-----------------------------+
         |
         v
+-----------------------------+
| Tier 2: AI Baseline Query   |
| ILIKE '%material%'          |
| source = 'ai_baseline'     |
| thickness +/- 0.5mm         |
| LIMIT 10                    |
+-----------------------------+
         |
         v
+-----------------------------+
| Tier 3: Community Query     |
| ILIKE '%material%'          |
| is_shared = true            |
| thickness +/- 1.0mm         |
| LIMIT 10                    |
+-----------------------------+
         |
         v
+-----------------------------+
| Quality Filter              |
| speed != null               |
| quality_rating >= 3 or null |
+-----------------------------+
         |
         v
+-----------------------------+
| Scale Each Cut              |
| (if user machine differs    |
|  from stored cut config)    |
| - Lens focal length ratio   |
| - Wattage ratio             |
| - Clamp power at 100%       |
| - Reduce speed if clamped   |
+-----------------------------+
         |
         v
+-----------------------------+
| Compute Recommendation      |
| avgSpeed = mean(all speeds) |
| confidence = f(count)       |
| min/max = range             |
| supporting params = means   |
+-----------------------------+
         |
         v
+-----------------------------+
| Apply Speed Profile         |
| fast: speed * 1.0           |
| conservative: speed * 0.5   |
| auto: speed * 1.0 (cutting) |
+-----------------------------+
         |
         v
+-----------------------------+
| Display                     |
| Hero speed (large number)   |
| Confidence badge            |
| Speed range (min-max)       |
| Reference params            |
| Expandable: all cut details |
| Feedback buttons            |
+-----------------------------+
```

---

## 3. Known Limitations

### 3.1 No Fuzzy Matching on Material Name
The `ILIKE '%material%'` is a substring match, not a fuzzy match. Searching "Stainless Steel" will match "Stainless Steel" and "304 Stainless Steel" but will NOT match:
- "SS304" (no substring overlap)
- "Inox" (European term for stainless)
- Typos like "Stainles Steel"

### 3.2 No Interpolation Between Thicknesses
If data exists for 3mm and 5mm stainless but NOT 4mm:
- Tier 1 and 2 search +/- 0.5mm (3.5 to 4.5mm) -- misses both
- Tier 3 searches +/- 1.0mm (3.0 to 5.0mm) -- might catch one or both

If only community data has adjacent thicknesses, they appear. But there is no mathematical interpolation (e.g., averaging 3mm and 5mm speeds to estimate 4mm).

### 3.3 No Weighting by Source Tier
Own cuts (proven on your machine) are weighted identically to community cuts (unknown machine, unknown conditions). A single community cut with rating 3 counts the same as your own verified 5-star cut.

### 3.4 No Machine Similarity Weighting
Community cuts from a 500W Trumpf and a 1500W Bodor are treated equally regardless of how similar they are to the user's machine. Scaling adjusts for lens/wattage, but doesn't weight by similarity.

### 3.5 Confidence Based Only on Count
A recommendation from 10 cuts with wildly different speeds (1000-5000 mm/min range) gets HIGH confidence, while 4 extremely consistent cuts (all within 50 mm/min) gets LOW confidence. The variance/consistency is ignored.

### 3.6 Feedback Not Used in Computation
The "Too Fast / Perfect / Too Slow" feedback is saved to localStorage only. It is never fed back into the recommendation algorithm or sent to the database. It is purely for future reference display.

### 3.7 Fixed Thickness Tolerance Windows
The +/- 0.5mm (own/AI) and +/- 1.0mm (community) windows are hardcoded. For thin materials (0.5mm sheet), +/- 0.5mm is extremely broad (would match 0-1mm). For thick materials (25mm plate), it may be too narrow.

### 3.8 No Consideration of Operation Type
Cuts for different operations (cut, engrave, mark, score) are all pooled together. A marking speed for stainless at 4mm would be averaged with a through-cut speed, producing a meaningless result.

---

## 4. Improvement Backlog (Prioritized)

### Priority 1 -- High Impact, Low Effort

1. **Fuzzy thickness fallback** -- If no exact match within +/- 0.5mm, automatically widen to +/- 1mm, then +/- 2mm, with clear UI indication ("Showing results for nearby thicknesses"). Could also interpolate linearly between the two nearest data points.

2. **Material alias matching via the materials table** -- The `materials` table already has an `aliases` field. The current code only uses aliases for autocomplete filtering but does NOT use them in the Supabase cut query. The fix: resolve the user's search to a canonical material name + all aliases, then query with `material IN (name, alias1, alias2, ...)` instead of a single ILIKE.

3. **Filter by operation type** -- Add operation_type to the query (default: 'cut'). This prevents mixing cutting speeds with engraving speeds in the same recommendation.

### Priority 2 -- High Impact, Medium Effort

4. **Source tier weighting** -- Weight own cuts at 3x, AI baseline at 1x, community at 0.5x (or similar). This makes recommendations more personalized without dropping community data.

5. **Confidence based on consistency** -- Use coefficient of variation (stddev/mean) in addition to count. High count + low variance = HIGH. High count + high variance = MEDIUM. Low count = LOW.

6. **Machine similarity scoring for community data** -- When querying community cuts, also fetch the machine metadata. Weight cuts from machines with similar wattage (+/- 20%) and same source type higher than dissimilar machines.

7. **Broader search fallback with UI** -- When no results found, automatically run a second query with relaxed constraints and show: "No exact match for Stainless Steel 4mm. Here's what we have:" with nearby materials/thicknesses displayed as suggestions.

### Priority 3 -- Medium Impact, Higher Effort

8. **Historical feedback integration** -- Save "Too Fast/Too Slow" feedback to Supabase (not just localStorage). Use it as a correction factor: if 3 users reported "too fast" for a combo, reduce the recommended speed by 10-15%.

9. **Thickness interpolation** -- If data exists for 3mm (speed=2000) and 6mm (speed=800), estimate 4mm via linear interpolation: `2000 - (2000-800) * (4-3)/(6-3) = 1600 mm/min`. Display with appropriate confidence reduction.

10. **Time-decay weighting** -- Recent cuts weighted higher than old cuts (laser tubes degrade, techniques improve). Exponential decay with half-life of 6 months.

### Priority 4 -- Transformational, High Effort

11. **True ML model (v2)** -- Train XGBoost/LightGBM on all cut data with features: material_encoded, thickness, wattage, lens, source_type, operation_type. Predict speed directly. Falls back to current algorithm when insufficient training data for a combination.

12. **Collaborative filtering** -- "Users with similar machines who cut this material used these settings." Matrix factorization or nearest-neighbor approach across user-material-thickness triples.

---

## 5. Quick Wins (Can Implement This Week)

### Quick Win 1: Material Alias Resolution in Query (1-2 hours)

**Problem it solves**: Searching "Stainless Steel" misses cuts logged as "304 Stainless", "316 SS", "Inox".

**Implementation**:
```typescript
// Before querying cuts, resolve material to all known names
const matchedMaterial = materials.find(m =>
  m.name.toLowerCase() === searchMaterial.toLowerCase() ||
  m.aliases?.some(a => a.toLowerCase() === searchMaterial.toLowerCase())
);

// Build OR query with all aliases
const allNames = matchedMaterial
  ? [matchedMaterial.name, ...(matchedMaterial.aliases || [])]
  : [searchMaterial];

// Use .or() filter in Supabase for each name
```

**Why it's quick**: The data model already supports aliases. The materials table already has them populated. Only the query construction needs to change.

### Quick Win 2: Automatic Thickness Widening with Interpolation (2-3 hours)

**Problem it solves**: "Stainless Steel 4mm" returns nothing when data exists for 3mm and 5mm.

**Implementation**:
```typescript
// If primary search returns 0 results, widen search
if (groups.length === 0) {
  // Search with +/- 3mm tolerance
  const { data: nearbyCuts } = await supabase
    .from("cuts")
    .select("*")
    .ilike("material", `%${searchMaterial}%`)
    .gte("thickness_mm", thicknessMm - 3)
    .lte("thickness_mm", thicknessMm + 3)
    .order("thickness_mm")
    .limit(20);

  // Group by thickness, show as "Nearby data available"
  // Optionally interpolate between bracketing thicknesses
}
```

**Why it's quick**: It's an additive change (only triggers on the current empty-state path). No existing behavior changes.

### Recommended First Ship

**Do Quick Win 2 first.** It directly solves the "Stainless Steel 4mm -> no results" problem the user hit. The fallback search with nearby thicknesses means users almost always see *something* useful instead of an empty screen. Material alias resolution (Quick Win 1) is also important but affects fewer searches.

---

## 6. Why "Stainless Steel 4mm" Returned No Results

The specific failure case:

1. User searched: material = "Stainless Steel", thickness = 4mm
2. Tier 1 (own cuts): Queried `material ILIKE '%Stainless Steel%'` with thickness 3.5-4.5mm -- user has no matching cuts
3. Tier 2 (AI baseline): Same query against ai_baseline source -- no baseline data seeded for this exact material+thickness combination
4. Tier 3 (community): Searched thickness 3.0-5.0mm with `is_shared = true` -- no community cuts shared for stainless in this range
5. All three groups empty => "No exact match found" displayed

**Root causes:**
- The AI baseline data may not include "Stainless Steel" at 4mm (data gap)
- The material might be stored under a different name ("304 Stainless Steel", "SS 304") that doesn't match the ILIKE pattern
- The thickness tolerance window is too narrow for the available data
- There is no fallback or graceful degradation
