# Feasibility & Prototype Plan: Laser Cutting Parameter Optimization SaaS

## Architecture Overview

```
[Laser Cutter] ──OPC-UA──> [Edge Gateway] ──HTTPS──> [Cloud API] ──> [Web Dashboard]
                                                          │
                                                    ML Model (recommendation)
                                                    Parameter Library (community)
                                                    Quality Feedback Loop
```

For MVP, the edge gateway is optional — users can manually input parameters and quality ratings through the web app. Machine connectivity comes in v2.

---

## 1. Software Stack (No Hardware Required)

### Core Application

| Layer | Technology | License/Cost | Confidence |
|-------|-----------|--------------|------------|
| **Frontend** | React + Next.js + Tailwind | Free (MIT) | VERIFIED — standard web stack |
| **Backend API** | Python (FastAPI) or Node.js | Free (MIT) | VERIFIED |
| **Database** | PostgreSQL (parameters) + Redis (caching) | Free / managed ~$50/month | VERIFIED |
| **ML Model** | PyTorch → served via TorchServe or ONNX Runtime | Free (BSD) | VERIFIED |
| **Hosting** | Vercel (frontend) + AWS (API + ML) or Railway | $50-200/month at scale | VERIFIED |
| **Auth** | Clerk or Auth0 | Free tier → $25/month | VERIFIED |
| **Search** | Typesense or Meilisearch | Free (open-source) | VERIFIED |
| **Analytics** | PostHog or Mixpanel | Free tier | VERIFIED |

### Machine Connectivity (v2 — not needed for MVP, but CRITICAL for long-term defensibility against AI/LLM disruption)

The machine connectivity layer is what makes this product durable. Without it, LLMs will eventually replicate the "static lookup" functionality. With it, the product builds a per-machine learning model that no AI can replicate.

| Component | Technology | Notes |
|-----------|-----------|-------|
| **OPC-UA client** | open62541 (C) or opcua-asyncio (Python) | Connects to modern laser controllers |
| **Edge gateway** | Raspberry Pi 4 + Python OPC-UA client | Reads live cutting parameters from machine |
| **Protocol support** | OPC-UA (Trumpf, Bystronic), EtherCAT (some), proprietary APIs | Each OEM has different interfaces |
| **Data pipeline** | MQTT → AWS IoT Core → Lambda → DynamoDB | Standard IoT ingestion |
| **Per-machine model** | Online learning (incremental updates per machine) | Tracks YOUR machine's drift over time |

**Why this matters for AI defensibility**: An LLM can tell you generic parameters for "3mm stainless." It cannot tell you that YOUR specific machine with 8,000 hours on the resonator needs +0.3mm focus offset and 2 bar more gas pressure than the textbook says. The connected platform learns this automatically from the feedback loop.

---

## 2. Data Model

### Parameter Record Schema

```
{
  machine_brand: "Trumpf",
  machine_model: "TruLaser 3030 fiber",
  laser_power_watts: 6000,
  material: "Stainless Steel 304",
  thickness_mm: 3.0,
  cutting_speed_mm_min: 4500,
  gas_type: "N2",
  gas_pressure_bar: 16,
  focus_position_mm: -1.5,
  nozzle_diameter_mm: 2.0,
  nozzle_distance_mm: 0.8,
  pulse_frequency_hz: null,  // CW mode
  quality_rating: 4,  // 1-5 stars
  edge_quality: "clean, no dross",
  kerf_width_mm: 0.25,
  notes: "Works well at room temp. Had issues above 35°C ambient.",
  submitted_by: "user_123",
  verified_by: ["user_456", "user_789"],
  created_at: "2026-06-15T14:30:00Z"
}
```

### ML Model Architecture

**Input features** (what the user provides):
- Machine brand + model (categorical, one-hot encoded)
- Material type (categorical, ~50 common types)
- Thickness (continuous, mm)
- Desired quality level (1-5)
- Laser source power (continuous, watts)

**Output predictions** (what the model recommends):
- Cutting speed (mm/min)
- Laser power % of max
- Gas type (categorical: N2, O2, air)
- Gas pressure (bar)
- Focus position (mm, relative to surface)
- Nozzle distance (mm)

**Model type**: Gradient boosted trees (XGBoost/LightGBM) for initial version — fast, interpretable, works well with tabular data and mixed types. Upgrade to neural network ensemble when dataset exceeds 100K records.

**Cold start strategy**: Seed with published OEM parameter tables (freely available in machine manuals) + academic papers + online forum data scraping.

---

## 3. Build Instructions — First Prototype

### Phase 0: Validate Demand with Manual MVP (Week 1-2)

**Goal**: Prove people will use a parameter search tool before building ML.

**What you build**:
1. Simple web form: select machine + material + thickness
2. Returns: matching parameters from a manually-curated database
3. Users can submit their own parameters + quality rating
4. No ML yet — just a searchable, structured database

**How to seed the database**:
- Scrape 5-10 OEM parameter tables from machine manuals (freely available as PDFs)
- Extract parameters from 50-100 forum posts (PracticalMachinist, Facebook groups)
- Organize into the schema above
- Start with ~200-500 parameter records

**Tech stack for PoC**:
- Airtable or Notion database (free, quick to set up) OR
- Next.js + Supabase (free tier, more scalable)
- Deploy on Vercel (free)

**Success criteria**: 50 signups and 20 parameter submissions in first month.

**Cost**: $0 (your time only). **Time**: 1-2 weekends.

---

### Phase 1: Community Platform (Weeks 3-8)

**Step 1: Build the real application (Week 3-5)**
- Next.js frontend with parameter search/filter/submit
- PostgreSQL database with proper schema
- User authentication (Clerk)
- Contribution system: submit parameters → community reviews/rates → verified badge
- Machine model registry (dropdown of all common laser cutters)
- Material database (comprehensive list with aliases)

**Step 2: Seed the community (Week 5-8)**
- Post in Facebook groups (Fiber Laser Cutting Network: 20K+ members)
- Post on PracticalMachinist forums
- Create useful free content: "Complete parameter table for [material]" → drives traffic
- Offer early-adopter badges / recognition for contributors

**Step 3: Build trust mechanics**
- "Verified" badge for parameters tested by 3+ users
- Upvote/downvote on parameter sets
- "Report" button for clearly wrong data
- Leaderboard of top contributors

---

### Phase 2: ML Recommendations (Weeks 8-14)

**Step 1: Collect enough data**
- Need: ~1000 quality-rated parameter sets across diverse machines/materials
- If community contributes slowly: supplement with published DOE papers + manufacturer data

**Step 2: Train initial model**
- XGBoost regression model predicting cutting speed from (machine, material, thickness, quality_target)
- Separate models for gas type selection (classification) and pressure (regression)
- Validate with cross-validation: target RMSE < 15% of true value

**Step 3: Build recommendation endpoint**
- User inputs: machine + material + thickness + quality target
- API returns: recommended parameters with confidence interval
- Show: "Based on 47 similar successful cuts across 12 machines"

**Step 4: Feedback loop**
- After user tries the recommendation: "How did it work?" (1-5 stars)
- Failed cuts teach the model what DOESN'T work (equally valuable)
- Model retrains weekly on growing dataset

---

### Phase 3: Machine Connectivity (Weeks 14-24 — REQUIRED for AI-defensible moat)

This phase transforms the product from "searchable database" (vulnerable to LLMs) into "connected learning system" (impossible for LLMs to replicate). Must ship within 12 months of launch.

**Step 1: OPC-UA integration**
- Build Python OPC-UA client that reads from Trumpf/Bystronic controllers
- Deploy on Raspberry Pi at partner shop ($50 hardware)
- Auto-log every cut: parameters used + duration + material (from job)
- Operator rates quality after each cut via tablet (one-tap: 1-5 stars)

**Step 2: Automatic data collection**
- Every cut generates a parameter record automatically
- Removes friction of manual entry → 10x more data per shop
- Enables time-series analysis: "parameters drift over time as nozzle wears"

**Step 3: Per-machine learning model**
- Each connected machine builds a local calibration profile
- Detects machine-specific quirks: this machine cuts 3% faster with N2, needs +0.5mm focus offset on thick material
- Recommends parameters adjusted for THIS machine, not generic textbook values
- Over time, detects degradation: "your recommendations are getting worse → nozzle replacement due"

**Step 4: LLM-assisted cold start for exotic materials**
- When community data is sparse (<3 data points for a material/machine combo):
  - Use LLM to generate starting-point parameters from general knowledge
  - CLEARLY LABEL as "AI-suggested, unverified" (different UI treatment than community-verified)
  - After user tries and rates → becomes verified community data
  - This makes the LLM a TOOL we use, not a competitor

**Why this phase is non-negotiable**: Without machine connectivity, a sufficiently good LLM eventually provides "80% as good" answers for free. With machine connectivity, we provide answers that are calibrated to YOUR specific machine — something no general AI can ever do. This is the durable moat.

---

## 4. Risk Register

| Risk | Likelihood | Impact | Mitigation | Fallback |
|------|-----------|--------|------------|----------|
| **Cold start: not enough data for ML** | MEDIUM | HIGH | Seed with OEM manuals + forum scraping + academic papers. Offer "manual" mode without ML initially | Run as parameter library (no ML) until data accumulates — still useful |
| **Community won't contribute** | MEDIUM | HIGH | Gamification (badges, leaderboards). Make it easy (one-click submit from cut log). Show immediate value (get recommendations = motivation to contribute) | Pivot to B2B data collection: pay shops to share their parameters |
| **OPC-UA access blocked by OEM** | MEDIUM | MEDIUM | Start with manual parameter entry. OPC-UA is a standard — machines expose it by default. Some shops may need IT approval | Use edge box that reads machine display via camera + OCR (hacky but works) |
| **Users share bad data** | MEDIUM | LOW | Community verification (3+ confirmations). Statistical outlier detection. "Trusted contributor" tiers | Weight recommendations by contributor trust score |
| **OEM sues for using their parameter tables** | LOW | MEDIUM | Machine manuals are sold/given to customers; parameter tables are operational data not copyrightable. No trade secrets. | Remove any OEM-sourced data; rely entirely on community-contributed data |
| **Someone copies the idea** | LOW | MEDIUM | Network effects are the moat — first mover with 10K users is nearly impossible to displace. Data flywheel compounds. | Accelerate user acquisition; add features that increase switching cost (machine-specific learning) |
| **LLMs make basic parameter lookup obsolete** | HIGH | MEDIUM | This WILL happen for common materials within 1-2 years. Mitigation: don't compete on basic lookup — compete on verified community data, per-machine calibration, and connected feedback loops. Ship machine connectivity (Phase 3) within 12 months. | Pivot positioning from "parameter database" to "connected machine intelligence platform." Use LLMs internally for cold-start on exotic materials. The moat is verified outcomes + machine-specific models, not generic knowledge. |

---

## 5. Prototype Validation Plan

### What "Working" Looks Like

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Parameter recommendations accuracy | >70% of recommendations rated 3+ stars on first try | Track quality ratings on ML-recommended parameters |
| Time savings per job | Reduce new-job setup from 30min → 5min | User survey + time tracking in app |
| Community growth | 500 users, 2000 parameter records in 6 months | Dashboard metrics |
| Monthly active users | 200+ (40% of signups active monthly) | Product analytics |
| Willingness to pay | 10%+ conversion from free to Pro tier | Stripe metrics |

### How to Test with Real Users

1. **Identify 5 beta shops** via Facebook groups / LinkedIn / local fabricators
2. **Install free tier** — give them access to parameter library + submit tool
3. **Weekly check-ins** (15-min call): "What did you cut this week? Did you use our recommendations? How were they?"
4. **Track NPS** after 30 days: "Would you recommend this to another shop?"
5. **Introduce paywall** at week 8: Pro features behind $200/month. Track conversion.

### Minimum Data for Validation

- 5 beta shops actively using the product for 4+ weeks
- 50+ parameter recommendations tried with quality feedback
- 3+ shops say "I'd pay $200/month for this"
- No shop says "I can get this from my OEM already"

### Timeline to Each Milestone

| Milestone | Timeline | Cost to Date |
|-----------|----------|-------------|
| Manual database MVP live | Week 2 | $0 |
| First 50 signups | Week 4 | $0 |
| Full web app with community features | Week 8 | $200 (hosting) |
| ML model v1 deployed | Week 12 | $500 (hosting + compute) |
| First paying customer | Week 16 | $1,000 |
| 200 active users | Week 24 | $2,000 |

---

## 6. Total Cost & Time to Working Prototype

### Itemized Budget

| Category | Cost |
|----------|------|
| Domain name + hosting (6 months) | $200 |
| Cloud compute for ML training | $100 |
| Database hosting (Supabase/Railway) | $100 |
| Auth service | $0 (free tier) |
| Marketing (Facebook ads to laser groups) | $300 |
| **Total to validation** | **~$700** |

### The Hidden Cost: Time

The real investment is YOUR time:
- 200-300 hours to build the full platform (8-12 weeks at 25 hrs/week)
- 50 hours of community management in first 3 months
- 30 hours of data seeding (scraping manuals, forums)
- 20 hours of ML model development and tuning

### Calendar Estimate

| Scenario | Time to Revenue |
|----------|----------------|
| Nights/weekends (10 hrs/week) | 6-8 months |
| Half-time (20 hrs/week) | 3-4 months |
| Full-time dedicated | 6-8 weeks |

### Skills Required

| Skill | Needed For | Have It? (Hooman) |
|-------|-----------|-------------------|
| Full-stack web dev (React, Node/Python) | Platform | YES |
| ML/Data Science (Python, PyTorch/sklearn) | Recommendation engine | YES — AI/ML infrastructure background |
| Database design (PostgreSQL) | Data model | YES |
| Community management | User growth | Learnable — but important |
| Laser cutting domain knowledge | Credibility, data validation | NO — need to learn or find advisor |
| OPC-UA / industrial protocols | Machine connectivity | Learnable — Python libraries exist |

**Founder-market fit assessment**: STRONG on the technical side (ML + web + infrastructure). The gap is laser cutting domain expertise — need either a co-founder/advisor with shop experience, or spend 2-3 months learning by visiting shops and cutting things yourself.

---

## 7. Why This Is the #1 Idea

| Factor | Compressed Air (#2) | Laser Cutting (#1) |
|--------|---------------------|---------------------|
| Hardware required | Yes (sensor nodes) | No (pure software) |
| Capital to first revenue | ~$15K | ~$700 |
| Time to first revenue | ~5 months | ~4 months |
| Competitive moat | Medium (ML on data) | HIGH (network effects + community data) |
| Scalability | Linear (hardware per plant) | Exponential (SaaS, zero marginal cost) |
| Recurring revenue | Yes ($200/month) | Yes ($200-400/month per machine) |
| Technical risk | Medium (noise rejection) | Low (proven ML + web stack) |
| Market access | Requires plant visits | Online community (already exists!) |
