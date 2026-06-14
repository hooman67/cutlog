# Technical Analysis: Speed as the Key Variable — Simplifying the ML Model for v1

## Source Insight

**Tinker Withit** (Fiber Laser Cutting Machine | Metal Laser Cutter Users group, 2026-06-12):

> "We deal with this quite often and use the closest parameters that we have and begin to make changes. It's usually just about speed at that point. Everything else is dialed in pretty close."

This single quote from an experienced operator unlocks a massive simplification for the v1 ML model.

---

## 1. Why Speed Is the Key Variable (Physics Explanation)

### Parameters That Stay Constant (and Why)

| Parameter | Why It Stays Constant | Typical Change Frequency |
|-----------|----------------------|--------------------------|
| **Power** | Set to 85-90% of max to preserve resonator life (per Nate Keen: "100% = 5 years, 85-90% = 40 years"). Operators find their machine's sweet spot and rarely deviate. | Once per machine lifetime |
| **Gas type** | Dictated by material chemistry: N2 for stainless/aluminum (inert = no oxidation), O2 for mild steel (exothermic reaction assists cutting), air for thin/non-critical. Physics doesn't change job-to-job. | Per material family (not per job) |
| **Gas pressure** | Determined by nozzle diameter and material thickness band. Once you know "14 bar N2 for stainless under 6mm on my machine," it doesn't vary much within that band. | Per material/thickness band |
| **Focus position** | Defined by lens focal length, nozzle geometry, and material surface. Negative focus for N2 cuts, positive for O2. Set once per cutting head configuration. | Per nozzle/head change |
| **Nozzle diameter** | Selected by thickness range (1.0-1.5mm nozzle for thin, 2.0-3.0mm for thick). Physical constraint of the consumable installed. | Per thickness band |
| **Pulse frequency** | Only relevant for pulsed/MOPA mode. In CW cutting (most industrial work), it's simply "continuous." When used, set per material family. | Per material family |

### Why Speed Is Different

Speed is the **one parameter that directly trades off between three competing demands** on every single job:

1. **Heat input per unit length** = Power / Speed. Lower speed = more heat per mm = deeper penetration but more HAZ (heat-affected zone), potential burning, wider kerf.

2. **Material removal rate** = Speed directly determines throughput and therefore cost per part.

3. **Cut quality** = Speed determines whether the molten material has time to be evacuated by assist gas before resolidifying. Too fast = incomplete cuts or heavy dross. Too slow = excessive heat, burn marks, material warping.

**The physics**: All other parameters define the *energy delivery system* (how much power, what gas, where focused). Speed defines *how that energy is distributed across the cut path*. The energy system is stable per machine configuration. The distribution changes per material and thickness because different materials have different:
- Melting points (aluminum: 660C vs stainless: 1400C)
- Thermal conductivity (aluminum conducts heat away 10x faster than stainless)
- Reflectivity (copper/brass reflect more energy, requiring slower speeds)
- Thickness (linear relationship: 2x thickness requires roughly 0.4-0.5x speed)

### The Operator's Mental Model

Experienced operators effectively partition their parameter space into:
- **Machine constants** (power %, focus, nozzle) — set during machine setup/calibration
- **Material constants** (gas type, gas pressure) — set per material family
- **The dial they turn** (speed) — adjusted per job based on material + thickness + quality need

This is why Tinker Withit says "everything else is dialed in pretty close" — those other parameters are already solved for their machine. Speed is the remaining degree of freedom.

---

## 2. How This Simplifies the ML Model for v1

### Current Architecture (Prototype): Overly Complex

The existing CutLog prototype logs and suggests **10+ parameters** simultaneously:
- Power %, speed, gas type, gas pressure, focus position, nozzle diameter, nozzle distance, line interval, pulse frequency

This creates a high-dimensional prediction problem with sparse data. With 10 parameters, you need orders of magnitude more data to make useful predictions.

### v1 Model: Speed-Only Recommendation

**Input features:**
```
material_type:      categorical (e.g., "Stainless 304", "Mild Steel", "Aluminum 6061")
thickness_mm:       continuous (e.g., 3.0)
machine_profile:    {brand, wattage, source_type, resonator_hours, lens_focal_length}
quality_target:     categorical ("production" | "precision" | "rough_cut")
gas_type:           categorical (N2 | O2 | air) — included because it's material-determined
```

**Output:**
```
recommended_speed_mm_min:   continuous (e.g., 4200)
confidence_interval:        continuous (e.g., +/- 200)
confidence_level:           categorical ("high" | "medium" | "low")
data_points_used:           integer (e.g., 23)
```

**Example recommendation:**
> "For 3mm Stainless 304 on your 6kW fiber laser (4200 hours): Try **4200 mm/min +/- 200**
> Based on 23 cuts from similar machines. 78% confidence."

### Why This Works Better

| Dimension | 10-param model | Speed-only model |
|-----------|---------------|-----------------|
| **Training data needed** | ~500+ cuts per material/thickness/machine combo | ~20-30 cuts per combo |
| **Prediction accuracy** | Low (sparse data, high dimensionality) | High (single continuous variable, dense data) |
| **User trust** | Low ("why is it suggesting I change my gas pressure?") | High ("just telling me how fast to go") |
| **Feedback loop** | Complex (which param was wrong?) | Simple (too fast / too slow / perfect) |
| **Time to useful** | Months of data collection | Days to weeks |
| **Aligns with operator workflow** | No (they don't change all params per job) | Yes (speed is what they actually adjust) |

### Model Architecture (v1)

**Phase 1: Lookup + interpolation (no ML needed)**
```
1. Find cuts in database matching: material + thickness (+/- 0.5mm) + machine similarity
2. Weight by: quality_rating * machine_similarity_score * recency_factor
3. Return: weighted_mean(speed), std_dev(speed) as confidence interval
4. If <5 data points: widen thickness tolerance to +/- 1mm, lower confidence
```

**Phase 2: Gradient-boosted model (when data > 500 cuts per material family)**
```
Model: LightGBM regressor
Features: material_embedding, thickness, wattage, resonator_hours, gas_type
Target: optimal_speed_mm_min (where quality_rating >= 4)
Validation: MAPE < 10% on held-out test set
```

**Phase 3: Per-machine fine-tuning (when user has 20+ logged cuts)**
```
Transfer learning: Start from global model, fine-tune on user's machine data
Captures: degradation, calibration drift, environmental quirks
Output: machine-specific speed adjustment factor (e.g., "your machine runs 8% slower than average for this material")
```

---

## 3. MVP Feature Design

### Primary User Flow (30 seconds)

```
[User opens app]
    |
    v
[Select Material] --> Searchable dropdown: "Stainless 304"
    |
    v
[Select Thickness] --> Number input: "3.0 mm"
    |
    v
[SPEED RECOMMENDATION APPEARS]
    ┌─────────────────────────────────────────────┐
    │  Recommended Speed: 4200 mm/min             │
    │  Range: 4000 - 4400 mm/min                  │
    │                                             │
    │  Confidence: HIGH (23 similar cuts)         │
    │  Best result: 4250 mm/min (5-star, your     │
    │  machine, 2 weeks ago)                      │
    │                                             │
    │  [Try This]  [Adjust]  [See All Data]       │
    └─────────────────────────────────────────────┘
    |
    v
[User tries the cut]
    |
    v
[Quick Feedback] --> "How was it?"
    ┌─────────────────────────────────────────────┐
    │  [Too Slow]  [PERFECT]  [Too Fast]          │
    │                                             │
    │  Actual speed used: [4200] (pre-filled)     │
    │  Quality: [star rating]                     │
    └─────────────────────────────────────────────┘
    |
    v
[Model updates. Next recommendation will be better.]
```

### Feedback Loop Design

The three-button feedback ("Too Slow / Perfect / Too Fast") is critical:
- **Too Fast**: Material didn't cut through, dross on bottom, incomplete separation. Model adjusts downward.
- **Too Slow**: Excessive heat, burn marks, warping, unnecessary time waste. Model adjusts upward.
- **Perfect**: Clean cut, minimal dross, good edge quality. Model anchors here.

This is a **bandit-style optimization** problem. Each feedback narrows the optimal speed range for that material/thickness/machine combination.

### Secondary Features (Available but Not Primary)

- **Full parameter view**: User can see all logged parameters (power, gas, focus, etc.) for reference
- **Parameter notes**: "This speed assumes 85% power, 14 bar N2, -1mm focus" shown as context
- **Override/log all params**: Power users can still log everything for data completeness

### Key UX Principle

**Speed recommendation is THE hero feature. It is the first thing you see. It is the reason you open the app.**

Other parameters are "settings" that live in a machine profile. Speed is "the answer" that changes per job.

---

## 4. How This Fits Into the Existing App Architecture

### Current State (CutLog Prototype)

The prototype treats all 10+ parameters equally in both logging and suggestions. This is architecturally correct for data collection but wrong for user experience and ML tractability.

### Proposed Restructuring

```
CURRENT ARCHITECTURE:
┌─────────────────────────────────────────────┐
│ Machine Setup → Log Cut (all params) → View Suggestions (all params) │
└─────────────────────────────────────────────┘

PROPOSED ARCHITECTURE:
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Machine Profile (one-time setup)                                   │
│  ├── Brand, model, wattage, hours                                   │
│  ├── DEFAULT power % (e.g., 85%)                                    │
│  ├── DEFAULT gas configs per material family                        │
│  ├── DEFAULT focus positions per nozzle                             │
│  └── DEFAULT nozzle diameters owned                                 │
│                                                                     │
│  Speed Recommendation (PRIMARY FEATURE - daily use)                 │
│  ├── Input: material + thickness                                    │
│  ├── Output: speed recommendation + confidence                      │
│  ├── Quick feedback: too fast / perfect / too slow                  │
│  └── Automatic model update                                         │
│                                                                     │
│  Cut Journal (SECONDARY - optional detail logging)                  │
│  ├── Full parameter logging (for power users / data completeness)   │
│  ├── Photo upload                                                   │
│  └── Notes                                                          │
│                                                                     │
│  Analytics (TERTIARY - insights over time)                          │
│  ├── Speed trends per material                                      │
│  ├── Machine drift detection                                        │
│  └── Community comparisons                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Database Schema Modification

The existing `cuts` table remains unchanged (still logs all parameters). The change is in how the **suggestion engine** works:

```sql
-- NEW: Speed recommendations table (materialized predictions)
speed_recommendations (
  id uuid PK,
  machine_id uuid FK → machines,
  material text NOT NULL,
  thickness_mm numeric NOT NULL,
  gas_type text,
  recommended_speed_mm_min numeric NOT NULL,
  confidence_low numeric NOT NULL,    -- lower bound of interval
  confidence_high numeric NOT NULL,   -- upper bound of interval
  confidence_level text,              -- 'high' | 'medium' | 'low'
  data_points_used integer,
  last_updated timestamptz,
  model_version text
)

-- NEW: Speed feedback table (rapid learning loop)
speed_feedback (
  id uuid PK,
  machine_id uuid FK → machines,
  user_id uuid FK → auth.users,
  material text NOT NULL,
  thickness_mm numeric NOT NULL,
  recommended_speed numeric,          -- what we suggested
  actual_speed numeric,               -- what they used
  feedback text CHECK (feedback IN ('too_slow', 'perfect', 'too_fast')),
  quality_rating integer,             -- optional 1-5
  created_at timestamptz
)
```

### API Endpoint Design

```
GET  /api/speed?material=stainless_304&thickness=3.0&machine_id=xxx
     → { speed: 4200, low: 4000, high: 4400, confidence: "high", sources: 23 }

POST /api/speed/feedback
     → { machine_id, material, thickness, actual_speed, feedback: "perfect" }
     → triggers model update for this machine/material/thickness
```

### Suggestion Engine Rewrite (v1)

```sql
-- Priority 1: User's own successful cuts for this material/thickness
SELECT AVG(speed_mm_min) as avg_speed, 
       STDDEV(speed_mm_min) as speed_std,
       COUNT(*) as n
FROM cuts 
WHERE machine_id = $machine_id 
  AND material ILIKE $material 
  AND thickness_mm BETWEEN $thickness - 0.5 AND $thickness + 0.5
  AND quality_rating >= 4;

-- Priority 2: Similar machines (same brand, similar wattage/hours)
SELECT AVG(speed_mm_min) as avg_speed,
       STDDEV(speed_mm_min) as speed_std,
       COUNT(*) as n
FROM cuts c
JOIN machines m ON c.machine_id = m.id
WHERE c.material ILIKE $material
  AND c.thickness_mm BETWEEN $thickness - 0.5 AND $thickness + 0.5
  AND c.quality_rating >= 4
  AND m.brand = $user_brand
  AND m.wattage_w BETWEEN $user_wattage * 0.8 AND $user_wattage * 1.2
  AND m.resonator_hours BETWEEN $user_hours - 3000 AND $user_hours + 3000;

-- Priority 3: All machines (community average)
SELECT AVG(speed_mm_min) as avg_speed,
       STDDEV(speed_mm_min) as speed_std,
       COUNT(*) as n
FROM cuts c
WHERE c.material ILIKE $material
  AND c.thickness_mm BETWEEN $thickness - 1.0 AND $thickness + 1.0
  AND c.quality_rating >= 4;
```

Confidence interval = `avg_speed +/- (1.96 * speed_std / sqrt(n))` (95% CI), capped at +/- 500 mm/min maximum.

---

## 5. Data Requirements

### Minimum Viable Data Per Combination

| Data Points | What You Can Do | Confidence Level |
|-------------|----------------|-----------------|
| 1-2 | Show as "starting point" with very wide range (+/- 30%) | LOW |
| 3-5 | Calculate mean + rough confidence interval | LOW-MEDIUM |
| 6-10 | Reliable mean, meaningful standard deviation | MEDIUM |
| 11-20 | Statistical significance, narrow confidence interval | MEDIUM-HIGH |
| 20+ | High-confidence recommendation, detect outliers | HIGH |
| 50+ | Per-machine fine-tuning becomes viable | VERY HIGH |

### Coverage Matrix (What to Seed First)

**Top 80% of cuts by volume** (focus data collection here):

| Material | Common Thicknesses (mm) | Combos |
|----------|------------------------|--------|
| Mild Steel | 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25 | 13 |
| Stainless Steel (304/316) | 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12 | 10 |
| Aluminum (5052/6061) | 1, 1.5, 2, 3, 4, 5, 6, 8, 10 | 9 |
| Galvanized Steel | 1, 1.5, 2, 3 | 4 |
| Copper/Brass | 1, 1.5, 2, 3 | 4 |
| **Total priority combos** | | **40** |

### Data Collection Strategy

**Target: 10 data points per material/thickness combo for MEDIUM confidence = 400 speed data points minimum**

Sources (in priority order):
1. **Existing scraped data** (800-1200 parameters from extraction strategy) — filter to speed values, bin by material/thickness. Estimated yield: 200-400 speed data points.
2. **LightBurn material libraries** (.clb files shared in communities) — parse speed values per material/thickness. Estimated yield: 100-200 speed data points.
3. **Early user logging** (beta testers logging their cuts) — 5 users * 5 cuts/week * 4 weeks = 100 speed data points.
4. **Manufacturer tables** (Trumpf, Bystronic, Amada published specs) — often list speed per material/thickness for reference machines. Estimated yield: 50-100 speed data points.

**Realistic timeline to useful recommendations:**
- Week 0: Seed from scraped data → 200+ combos have at least 1 data point (LOW confidence)
- Week 2: Add LightBurn + manufacturer data → 30+ combos have 5+ points (MEDIUM confidence)
- Month 1: Beta user data starts flowing → top 10 combos reach HIGH confidence
- Month 3: 20+ active users → most common combos at HIGH confidence

### Machine-Specific Data Requirements

Per-machine fine-tuning requires the individual user to have logged **20+ cuts** on their machine. At 5 cuts/week, this takes ~4 weeks of daily use. After that, speed recommendations become machine-specific (accounting for their specific resonator degradation, calibration state, etc.).

---

## 6. Validation Approach

### Success Criteria

The speed recommendation is "accurate enough to be useful" when:

1. **The operator doesn't need to do a test cut** (or does only 1 instead of 3-5)
2. **The recommendation is within 10% of their final chosen speed** (industry tolerance)
3. **The operator rates the recommendation as "useful starting point" or better**

### Quantitative Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| **Mean Absolute Percentage Error (MAPE)** | < 10% | Compare recommended speed to actual speed user chose |
| **"Perfect" feedback rate** | > 40% | Percentage of recommendations where user clicks "Perfect" |
| **Iteration reduction** | 50%+ fewer test cuts | Survey: "How many test cuts did you need?" before vs. after |
| **Time-to-first-good-cut** | < 2 attempts | Count feedback entries before first "Perfect" for new material |
| **Confidence calibration** | 80% of actual speeds fall within stated confidence interval | Statistical validation |

### Validation Protocol (Beta Phase)

**Week 1-2: Baseline Measurement**
- Ask beta users to log their normal workflow WITHOUT recommendations
- Measure: how many test cuts per new material, time spent, material wasted
- This establishes the "before" baseline

**Week 3-4: Recommendation Testing**
- Enable speed recommendations
- For each recommendation, track:
  - Did user try the recommended speed?
  - What speed did they actually end up using?
  - How many iterations to get to a good cut?
  - Feedback: too fast / perfect / too slow

**Week 5+: Iterative Improvement**
- Compare recommendation accuracy to baseline
- A/B test: users with recommendations vs. users without
- Track MAPE trend over time (should decrease as model learns)

### Qualitative Validation

After 2 weeks of use, ask each beta user:
1. "Did the speed recommendations save you time or material?"
2. "How accurate were they as starting points? (1-10)"
3. "Would you trust the recommendation enough to skip a test cut on familiar materials?"
4. "What material/thickness was the recommendation most wrong about?"

### Failure Modes to Watch

| Failure | Signal | Response |
|---------|--------|----------|
| Recommendations too conservative (always too slow) | >60% "too slow" feedback | Adjust model bias upward |
| Recommendations too aggressive (cuts failing) | >30% "too fast" feedback | Reduce speed by safety margin |
| Wide variance in user feedback for same combo | High MAPE despite many data points | Segment by machine sub-type or wattage band |
| Users not trusting recommendations | Low "Try This" click rate | Add provenance ("based on 23 cuts from 6kW fiber lasers") |
| Model doesn't improve with more data | MAPE plateaus above 15% | Add features (wattage, hours, gas pressure as inputs) |

### The Key Question for Beta

The ultimate validation is whether this statement becomes true for users:

> "I open CutLog, it tells me to try 4200 mm/min for this 3mm stainless, I try it, it works. I saved 20 minutes and a sheet of material."

If 3 out of 5 beta users report this experience within the first month, the speed recommendation model is validated and ready for scale.

---

## Summary: Strategic Implications

### For Product Positioning

Stop calling this a "parameter database" or "cut journal." Reframe as:

> **"CutLog tells you how fast to cut. For your material, on your machine."**

This is a dramatically simpler value proposition than "AI-powered multi-parameter optimization."

### For Fundraising / Pitch

The speed-only insight means:
- **Simpler ML** = faster to build, cheaper to run, easier to validate
- **Simpler UX** = one number output, three-button feedback
- **Faster data flywheel** = need 10x less data per useful prediction
- **Clearer moat** = per-machine speed calibration from proprietary feedback data

### For v2 and Beyond

Once speed recommendations are validated and trusted:
- v2: Add gas pressure optimization (second most variable parameter for thick materials)
- v3: Drift detection ("your speeds are trending 5% slower — check nozzle condition")
- v4: Full multi-parameter optimization for complex/exotic materials
- v5: Predictive maintenance ("based on speed degradation curve, resonator replacement in ~6 months")

The speed-first approach builds trust incrementally. Users will accept more complex recommendations only after the simple ones prove accurate.
