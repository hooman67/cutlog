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

Speed is a **weighted average** of all qualifying cuts across all tiers:

```
avgSpeed = sum(speed[i] * weight[i]) / sum(weight[i])
```

**Source tier weights:**
| Source | Weight | Rationale |
|--------|--------|-----------|
| User's own cuts | 3x | You tested it on YOUR machine |
| Community shared | 2x | Another operator verified it |
| AI baseline | 1x | Reference data, not human-verified |

Supporting parameters are also averaged (simple mean):
- `avgPower` = mean of all power values
- `avgGasPressure` = mean of gas pressures
- `avgFocus` = mean of focus positions
- `avgNozzle` = mean of nozzle diameters
- `commonGasType` = mode (most frequently occurring gas type)

### Confidence Determination (Updated 2026-06-21)

Uses a **priority-based system** — personal verification overrides statistics:

| Condition | Confidence | Rationale |
|-----------|-----------|-----------|
| User has own cut rated 4-5 stars | **HIGH** | You tested it yourself, you trust it |
| 5+ data points AND cv < 0.2 | **HIGH** | Lots of data that agrees |
| 3+ data points OR cv < 0.4 | **MEDIUM** | Some data, moderate agreement |
| Otherwise | **LOW** | Sparse or inconsistent |

**Key insight:** If you logged a cut and rated it 4-5 stars, that means YOU verified it works on YOUR machine. That's the highest possible confidence — no amount of community disagreement should override your own tested experience.

**Coefficient of Variation (cv):** `stddev / mean` of all speed values. Low cv = speeds agree. High cv = speeds disagree (different operators, different machines, inconsistent data).

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

### No Match Behavior (Updated 2026-06-21)

Before showing the empty state, the system now tries **progressive fallbacks**:

1. **Material alias resolution** — queries the `materials` table for canonical name + all aliases (e.g., "304 Stainless" → also searches "Stainless Steel", "316 SS", "Inox")
2. **Thickness widening** — progressively expands from ±0.5mm → ±1.5mm → ±3mm until data is found
3. **Operation type filtering** — separates cutting from engraving results based on machine type

If ALL fallbacks still return zero results, the system tries one final step:

4. **Gemini AI Suggestion (Last Resort)** — Calls Gemini 2.0 Flash to generate a starting-point recommendation based on the material, thickness, and laser type. This is the lowest trust tier and is clearly marked as unverified.

If Gemini also fails (API error, timeout, or returns no useful data), the page shows a structured empty state:
1. Import your LightBurn library (.clb file)
2. Log your first test cut
3. Try a broader search
4. "AI recommendations improve as more operators log cuts for this material."

**UI indicators when fallback was used:**
- Amber text: "Showing data for nearby thicknesses (±Xmm)" when thickness was widened
- Zinc-500 text: "Also matched: 304 Stainless, 316 SS" when aliases resolved

---

## 1b. Tier 4: AI Suggestion (Gemini Fallback)

### When It Triggers

The Gemini fallback activates ONLY when ALL of the following have returned zero results:
1. Tier 1 (Own Cuts) — no user cuts match
2. Tier 2 (AI Baseline) — no pre-seeded baseline data matches
3. Tier 3 (Community) — no shared community cuts match
4. Material alias resolution — searching all known aliases found nothing
5. Thickness widening — progressively expanding from +/-0.5mm to +/-3mm found nothing

Only after exhausting every database query does the system call Gemini.

### Prompt Sent to Gemini

```
You are a laser cutting/engraving parameter expert. A user is looking for 
starting parameters for their laser machine.

Material: {material}
Thickness: {thickness_mm}mm
Laser type: {source_type} (fiber/co2/diode)
Laser wattage: {wattage}W
Lens focal length: {lens_mm}mm

Provide a conservative starting-point recommendation for cutting this material.
Return JSON with these fields:
- speed_mm_min: recommended speed in mm/min
- power_pct: recommended power percentage (0-100)
- gas_type: recommended assist gas (nitrogen, oxygen, air, or none)
- gas_pressure_bar: recommended gas pressure in bar (or null)
- focus_position_mm: recommended focus position in mm (or null)
- confidence_note: 1-2 sentences explaining your reasoning and any caveats

IMPORTANT: Be conservative. It's better to suggest too slow than too fast.
These are STARTING POINTS that operators will adjust.
```

### Display & Trust Tier

The result is displayed as the lowest confidence tier:

| Tier | Badge | Color | Label |
|------|-------|-------|-------|
| Tier 1: Your Data | HIGH | Green | "YOUR DATA" |
| Tier 2: Community | MEDIUM | Blue | "COMMUNITY" |
| Tier 3: AI Baseline | LOW | Orange | "AI BASELINE" |
| **Tier 4: AI Suggestion** | **UNVERIFIED** | **Gray** | **"AI SUGGESTION (Unverified)"** |

**UI presentation:**
- Gray badge with warning icon: "AI SUGGESTION (Unverified)"
- Warning text below: "Not verified by any operator"
- Gemini's `confidence_note` displayed as italic reasoning text
- Loading state while waiting: "Asking AI for a starting point..."

### 4-Tier Trust Architecture

```
YOUR DATA (green)      — You tested it on YOUR machine. Highest trust.
    |
COMMUNITY (blue)       — Other operators verified on similar machines.
    |
AI BASELINE (orange)   — Pre-seeded reference data, not human-verified.
    |
AI SUGGESTION (gray)   — Gemini-generated, never tested by anyone. Lowest trust.
```

### User Validation ("Was this helpful?")

Below the AI suggestion, two buttons appear:
- **"Was this helpful? Yes"** — Saves the Gemini-generated parameters to the `cuts` table with `source = 'ai_baseline'`, making it available for future searches. Effectively promotes the data from gray tier (AI Suggestion) to orange tier (AI Baseline).
- **"Was this helpful? No"** — Records negative feedback. The suggestion is NOT saved to the database. Helps track Gemini accuracy over time.

**Promotion flow:**
1. User searches "Inconel 718" at 7mm — no data anywhere
2. Gemini returns a suggestion — displayed with gray badge
3. User taps "Yes" — parameters are inserted into `cuts` table with `source = 'ai_baseline'`
4. Next user (or same user) searches "Inconel 718" at 7mm — now finds it in Tier 2 (AI Baseline) with orange badge
5. Over time, as operators log real cuts for this material, it gets promoted through community and personal tiers

This creates a **self-healing data gap system**: Gemini fills gaps, humans validate, and the database grows organically.

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
| Any results?                |
| YES → continue to scaling  |
| NO  → Gemini Fallback      |
+-----------------------------+
         |                \
         | (has data)      \ (no data)
         v                  v
+-----------------------------+    +-------------------------------+
| Scale Each Cut              |    | Tier 4: Gemini 2.0 Flash     |
                                   | POST prompt with material,    |
                                   | thickness, laser type, wattage|
                                   | Returns: speed, power, gas,   |
                                   | focus + confidence_note       |
                                   +-------------------------------+
                                            |
                                            v
                                   +-------------------------------+
                                   | Display as GRAY badge         |
                                   | "AI SUGGESTION (Unverified)"  |
                                   | Show "Was this helpful?"      |
                                   | Yes → save to cuts table      |
                                   | No  → discard                 |
                                   +-------------------------------+

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

## 3. Known Limitations (Updated 2026-06-21)

> **Note:** All Priority 1, 2, and 3 items from the improvement backlog have been implemented as of 2026-06-21. The limitations below reflect what remains unsolved (Priority 4 / future work).

### ~~3.1 No Fuzzy Matching on Material Name~~ — SOLVED
✅ Material alias resolution now queries the `materials` table for canonical name + all aliases. Searching "Stainless Steel" also searches "304 Stainless", "316 SS", "Inox", etc. (Implemented 2026-06-21)

### ~~3.2 No Interpolation Between Thicknesses~~ — SOLVED
✅ Progressive thickness widening (±0.5mm → ±1.5mm → ±3mm) plus linear interpolation between bracketing thicknesses. Users almost always see useful data now. (Implemented 2026-06-21)

### ~~3.3 No Weighting by Source Tier~~ — SOLVED
✅ Source tier weighting implemented: own cuts at 3x, community at 2x, AI baseline at 1x. Personal verified data always dominates recommendations. (Implemented 2026-06-21)

### ~~3.4 No Machine Similarity Weighting~~ — SOLVED
✅ Machine similarity scoring implemented for community data. Cuts from machines with similar wattage (±20%) and same source type are weighted higher. (Implemented 2026-06-21)

### ~~3.5 Confidence Based Only on Count~~ — SOLVED
✅ Confidence now uses coefficient of variation (stddev/mean) in addition to count. Personal verified cuts (4-5 stars) automatically get HIGH confidence. High count + low variance = HIGH. High count + high variance = MEDIUM. (Implemented 2026-06-21)

### ~~3.6 Feedback Not Used in Computation~~ — SOLVED
✅ Feedback now saved to Supabase (migration 008). "Too Fast/Too Slow" feedback is used as a correction factor in recommendations. (Implemented 2026-06-21)

### ~~3.7 Fixed Thickness Tolerance Windows~~ — SOLVED
✅ Progressive fallback system replaces fixed windows. Searches widen automatically from ±0.5mm → ±1.5mm → ±3mm until data is found. (Implemented 2026-06-21)

### ~~3.8 No Consideration of Operation Type~~ — SOLVED
✅ Operation type filtering implemented. Separates cutting from engraving results based on machine type. (Implemented 2026-06-21)

### 3.9 Remaining Limitations (Future Work)
- **No true ML model** — Still using weighted averages, not XGBoost/LightGBM (Priority 4 item)
- **No collaborative filtering** — No "users with similar machines" matrix factorization yet (Priority 4 item)
- **No typo correction** — Material alias resolution handles known aliases but not arbitrary typos
- **No OPC-UA auto-logging** — Manual entry still required

---

## 4. Improvement Backlog (Prioritized)

> **Status: 10/10 improvements implemented as of 2026-06-21.** All Priority 1, 2, and 3 items are live in production. Only Priority 4 (transformational, high-effort) items remain for future work.

### Priority 1 -- High Impact, Low Effort — ✅ ALL IMPLEMENTED (2026-06-21)

1. ✅ **Fuzzy thickness fallback** — IMPLEMENTED. Progressive widening from ±0.5mm → ±1.5mm → ±3mm with clear UI indication ("Showing data for nearby thicknesses (±Xmm)").

2. ✅ **Material alias matching via the materials table** — IMPLEMENTED. Resolves user search to canonical material name + all aliases, queries with all known names.

3. ✅ **Filter by operation type** — IMPLEMENTED. Separates cutting from engraving results based on machine type.

### Priority 2 -- High Impact, Medium Effort — ✅ ALL IMPLEMENTED (2026-06-21)

4. ✅ **Source tier weighting** — IMPLEMENTED. Own cuts weighted 3x, community 2x, AI baseline 1x.

5. ✅ **Confidence based on consistency** — IMPLEMENTED. Uses coefficient of variation (stddev/mean) + personal verification override (own cuts rated 4-5 stars = HIGH confidence automatically).

6. ✅ **Machine similarity scoring for community data** — IMPLEMENTED. Weights cuts from machines with similar wattage (±20%) and same source type higher.

7. ✅ **Broader search fallback with UI** — IMPLEMENTED. Progressive fallbacks with UI indicators showing what was matched and how.

### Priority 3 -- Medium Impact, Higher Effort — ✅ ALL IMPLEMENTED (2026-06-21)

8. ✅ **Historical feedback integration** — IMPLEMENTED. Feedback saved to Supabase via migration 008 (feedback table). "Too Fast/Too Slow" used as correction factor in speed computation.

9. ✅ **Thickness interpolation** — IMPLEMENTED. Linear interpolation between bracketing thicknesses when no exact match exists. Displayed with appropriate confidence reduction.

10. ✅ **Time-decay weighting** — IMPLEMENTED. Recent cuts weighted higher than old cuts using exponential decay with 6-month half-life.

### Priority 4 -- Transformational, High Effort (FUTURE WORK)

11. 🔲 **True ML model (v2)** -- Train XGBoost/LightGBM on all cut data with features: material_encoded, thickness, wattage, lens, source_type, operation_type. Predict speed directly. Falls back to current algorithm when insufficient training data for a combination.

12. 🔲 **Collaborative filtering** -- "Users with similar machines who cut this material used these settings." Matrix factorization or nearest-neighbor approach across user-material-thickness triples.

---

## 5. Quick Wins — ✅ ALL COMPLETED (2026-06-21)

Both quick wins were implemented as part of the full 10/10 algorithm improvement sweep.

### ✅ Quick Win 1: Material Alias Resolution in Query — DONE

Searching "Stainless Steel" now also searches "304 Stainless", "316 SS", "Inox", etc. via the materials table aliases field.

### ✅ Quick Win 2: Automatic Thickness Widening with Interpolation — DONE

Progressive widening (±0.5mm → ±1.5mm → ±3mm) plus linear interpolation between bracketing thicknesses. Users almost always see useful data now instead of empty states.

---

## 6. Why "Stainless Steel 4mm" Returned No Results (Historical — Now Solved)

> **UPDATE 2026-06-21:** This failure case is now fully resolved by the implemented improvements: material alias resolution (searches all known names), progressive thickness widening (±0.5mm → ±1.5mm → ±3mm), thickness interpolation, and Gemini AI fallback. Users will now almost always see useful results.

The specific failure case (before fixes):

1. User searched: material = "Stainless Steel", thickness = 4mm
2. Tier 1 (own cuts): Queried `material ILIKE '%Stainless Steel%'` with thickness 3.5-4.5mm -- user has no matching cuts
3. Tier 2 (AI baseline): Same query against ai_baseline source -- no baseline data seeded for this exact material+thickness combination
4. Tier 3 (community): Searched thickness 3.0-5.0mm with `is_shared = true` -- no community cuts shared for stainless in this range
5. All three groups empty => "No exact match found" displayed

**Root causes (all now addressed):**
- ~~The AI baseline data may not include "Stainless Steel" at 4mm (data gap)~~ → Progressive thickness widening + interpolation
- ~~The material might be stored under a different name ("304 Stainless Steel", "SS 304") that doesn't match the ILIKE pattern~~ → Material alias resolution
- ~~The thickness tolerance window is too narrow for the available data~~ → Progressive widening ±0.5mm → ±1.5mm → ±3mm
- ~~There is no fallback or graceful degradation~~ → Gemini AI fallback as last resort
