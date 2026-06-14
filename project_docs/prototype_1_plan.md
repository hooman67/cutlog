# Prototype 1: "CutLog" — Your Machine's Memory

## Concept

A machine-specific cut journal with smart suggestions. Operators log their cuts daily (30 seconds each), building a personal + community database that learns per-machine. NOT a generic parameter lookup — the daily logging habit creates the data moat.

**Tagline**: "Stop keeping parameters in your head. Let your machine remember."

---

## Why This Prototype (Not a Generic Database)

Validated by Facebook outreach (2026-06-10):

| Respondent | What they said | What it means for prototype |
|------------|---------------|----------------------------|
| Sean BeardyWeirdo | "I have reservations on how this could be achieved by another person" | Generic lookup fails — must be machine-specific first, community second |
| Nate Keen | "Once you've mastered YOUR particular machine it's just small adjustments" / "It's all in my head from years of experience" | The product captures tacit knowledge per-machine; not a generic table |
| Mike AJ Guindon | Shared lasertips.org but still interested in AI tool | Static tables aren't enough — dynamic, learning system is the gap |
| Nate Keen | "Line interval can be the difference from making a clean cut or having cut weld itself back together" | Line interval is THE critical parameter most tools ignore — feature it prominently |

### Why not start with generic database:
- lasertips.org already exists (free, static tables) — operators aren't satisfied
- LLMs already give "80% good enough" generic answers for common materials
- Sean's core objection ("how can someone else's results help MY machine?") kills generic lookup adoption
- A database people search is not a moat; a tool people USE daily that creates a database IS a moat

---

## Core Flow (3 Screens)

### Screen 1: Machine Setup (one-time, 2 minutes)

Fields:
- Machine brand (dropdown: Trumpf, Bystronic, Amada, Han's, HSG, Bodor, IPG, other)
- Machine model (text, with autocomplete from known models)
- Laser source wattage (number, e.g. 6000W)
- Laser source type (fiber/CO2)
- Estimated hours on resonator (number — critical for degradation modeling)
- Gas setup: types available (checkboxes: N2, O2, compressed air)
- Controller software (optional: TruTops, BySoft, AMNC, etc.)
- Shop location (country/region — for ambient condition patterns)
- Nickname for the machine (operators name their machines)

### Screen 2: Log a Cut (daily use, 30 seconds)

Fields:
- Material (searchable dropdown: "Stainless 304", "Mild Steel", "Aluminum 5052", etc.)
- Thickness (mm, number input)
- **Parameters logged**:
  - Power (% of max)
  - Cutting speed (mm/min)
  - Gas type (N2/O2/air)
  - Gas pressure (bar)
  - Focus position (mm, relative to surface)
  - Nozzle diameter (mm)
  - Nozzle distance (mm)
  - **Line interval** (mm) — featured prominently per Nate's insight
  - Pulse frequency (Hz, optional — null for CW mode)
- **Result**:
  - Quality rating (1-5 stars, large tap targets)
  - Edge quality (quick-select: clean / slight dross / heavy dross / burn marks)
  - Optional: photo upload (camera button)
  - Optional: one-line note
- Date/time (auto-filled)

**UX priority**: Must be loggable in <30 seconds on a phone held in one gloved hand. Large buttons, smart defaults (pre-fill last-used values), swipe to rate.

### Screen 3: Get a Suggestion (the payoff)

When operator faces a new material/thickness:

**Priority order of suggestions**:
1. **YOUR history** (green badge): "You've cut 2mm stainless 14 times. Best result: 85% power, 4.2m/min, 14bar N2 (avg 4.8★)"
2. **Similar machines** (blue badge): "3 operators with [same brand, ±1000hrs] averaged these parameters (4.2★ avg)"
3. **Community** (gray badge): "Based on 47 cuts across all machines (3.8★ avg)"
4. **AI starting point** (orange badge, clearly labeled): "No community data. AI-suggested starting point — verify before production use"

Each suggestion shows:
- Confidence indicator (based on number of data points)
- Machine similarity score (how close their machine profile is to yours)
- "Try this" button → pre-fills a new cut log so they can rate the result

---

## Technical Architecture

```
[Mobile/Tablet Browser] → [Next.js on Vercel] → [Supabase (Postgres + Auth + Storage)]
                                                         │
                                                   [Similarity Engine]
                                                   (SQL queries v1, ML v2)
```

### Stack

| Layer | Technology | Cost | Notes |
|-------|-----------|------|-------|
| Frontend | Next.js 14 + Tailwind CSS | $0 | Mobile-first PWA (installable on phone) |
| Backend/API | Next.js API routes + Supabase client | $0 | Serverless |
| Database | Supabase PostgreSQL | $0 (free tier: 500MB, 50K rows) | More than enough for MVP |
| Auth | Supabase Auth (email + Google) | $0 | Built-in |
| Image storage | Supabase Storage | $0 (1GB free) | Cut photos |
| Hosting | Vercel | $0 (hobby tier) | Auto-deploy from GitHub |
| Domain | TBD | ~$12/year when ready | Not needed for beta |
| Search | Supabase full-text search | $0 | Material/machine search |

**Total cost to beta: $0**

### Data Model (Supabase/Postgres)

```sql
-- Machines table
machines (
  id uuid PK,
  user_id uuid FK → auth.users,
  brand text NOT NULL,
  model text,
  wattage_w integer,
  source_type text, -- 'fiber' | 'co2'
  resonator_hours integer,
  gas_types text[], -- ['N2', 'O2', 'air']
  controller text,
  location_country text,
  nickname text,
  created_at timestamptz
)

-- Cut logs table
cuts (
  id uuid PK,
  machine_id uuid FK → machines,
  user_id uuid FK → auth.users,
  material text NOT NULL,
  thickness_mm numeric NOT NULL,
  power_pct numeric,
  speed_mm_min numeric,
  gas_type text,
  gas_pressure_bar numeric,
  focus_position_mm numeric,
  nozzle_diameter_mm numeric,
  nozzle_distance_mm numeric,
  line_interval_mm numeric,
  pulse_frequency_hz numeric,
  quality_rating integer CHECK (1-5),
  edge_quality text, -- 'clean' | 'slight_dross' | 'heavy_dross' | 'burn_marks'
  photo_url text,
  notes text,
  created_at timestamptz
)

-- Materials reference table (pre-seeded)
materials (
  id uuid PK,
  name text NOT NULL, -- "Stainless Steel 304"
  category text, -- "stainless" | "mild_steel" | "aluminum" | "copper" | "exotic"
  aliases text[], -- ["SS304", "304SS", "18-8"]
)
```

### Suggestion Algorithm (v1 — No ML, Pure SQL)

```
1. Search user's OWN cuts for same material + thickness (±0.5mm)
   → Order by quality_rating DESC
   → Return top 3

2. Search ALL cuts where:
   - Same material + thickness (±0.5mm)
   - Same machine brand
   - Resonator hours within ±2000 of user's machine
   → Order by quality_rating DESC, machine similarity
   → Return top 5

3. Search ALL cuts where:
   - Same material + thickness (±1mm)
   - Any machine
   → Order by quality_rating DESC
   → Return top 5 with machine context shown
```

This gets you 80% of the ML value with zero model training. Graduate to XGBoost/LightGBM when you have 1000+ cuts in the database.

---

## Build Phases

### Phase A: Core App (Weekend 1)
- Auth flow (sign up / sign in)
- Machine registration form
- Cut logging form
- Cut history view (your cuts, chronological)
- Material search/autocomplete

### Phase B: Suggestions + Community (Weekend 2)
- "Get Suggestion" flow with the 3-tier priority system
- Community visibility (opt-in: share your cuts with similar-machine users)
- Basic stats dashboard: "You've logged X cuts, your best materials, your machine's profile"

### Phase C: Polish + Beta Launch (Weekend 3)
- PWA manifest (installable on phone home screen)
- Offline support (log cuts offline, sync when connected)
- Onboarding flow (first-time machine setup wizard)
- Seed materials database (~200 common materials with aliases)
- Invite system (each beta user gets 3 invite codes)

---

## MVP Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Beta users (from 3 FB contacts + referrals) | 5-10 | Week 2-3 after launch |
| Cuts logged per user per week | 5+ | After first week of use |
| Users returning after first week | 60%+ | Week 2 |
| "Would you pay for this?" | 3+ say yes | Week 4 survey |
| Total cuts in database | 100+ | Month 1 |

---

## Validation Questions for Discovery Calls

When talking to Mike, Sean, Nate — show this concept and ask:

1. "If this was on your phone right now, would you log your cuts after each job?"
2. "What would make you NOT log a cut? What's too much friction?"
3. "Would you share your cut data with operators who have similar machines?"
4. "What's missing from this that you'd need to actually use it daily?"
5. "Is there a parameter I'm not capturing that matters to you?"

---

## Competitive Position

| vs. | Our advantage |
|-----|---------------|
| lasertips.org | Dynamic, personal, machine-specific. Not static tables. |
| LLM/ChatGPT | Verified outcomes, per-machine calibration, persistent memory, quality ratings |
| OEM tables (TruTops, BySoft) | Cross-brand, community-powered, learns from outcomes |
| Operator notebooks | Searchable, shareable, never retires, transfers with machine |
| Doing nothing | Captures the knowledge that's "all in my head" before it walks out the door |

---

## Future (Post-MVP, Not Built Now)

- OPC-UA machine connectivity (auto-log cuts without manual entry)
- XGBoost/LightGBM model trained on accumulated cut data
- Drift detection ("your parameters are degrading — check nozzle")
- Fleet view for multi-machine shops
- LLM cold-start for exotic materials with zero community data
- API for integration with CAM software (LightBurn, SigmaNest)

---

## Build Status & Progress (2026-06-12)

### ✅ Completed

| Component | Status | Notes |
|-----------|--------|-------|
| **Frontend (Next.js)** | ✅ Complete | All 5 screens built: auth, machine setup, cut logging, suggestions, history |
| **Database Schema** | ✅ Complete | Machines, cuts, materials tables with RLS policies created in Supabase |
| **Materials Seed Data** | ✅ Complete | 85+ common laser materials pre-seeded with categories and aliases |
| **Auth System** | ✅ Complete | Email-based signup/signin via Supabase |
| **Cut Logging** | ✅ Complete | Full form with 10+ parameters, quality ratings, edge quality tracking |
| **Suggestion Engine (v1)** | ✅ Complete (bugfixed) | Searches user's history + shared community cuts, case-insensitive matching |
| **History View** | ✅ Complete | Searchable cut history with filtering |
| **Mobile UI** | ✅ Complete | Dark theme, large touch targets, gloved-hand friendly |
| **Deployable Zip** | ✅ Complete | `/mnt/localssd/laser_log/cutlog.zip` (312KB, no node_modules) |

### 🐛 Bugs Fixed

- **Suggestion search**: Changed `eq` → `ilike` for case-insensitive material matching
- **RLS policy issue**: Removed JOIN on machines table (was silently failing due to row-level security)
- **Suggestion tiers**: Simplified to 2-tier model (own history + shared community) to avoid RLS blocking

### 🚀 Testing

- **Local dev server**: Running on port 8000, accessible via SSH tunnel from work laptop
- **SSH proxy setup**: `ssh -L 8000:localhost:8000 colligo@100.64.21.99 -p 3000`
  - Pluto job hostname: `pluto-prod-hshariati-c5-job-framew-5-0`
  - Internal IP: `100.64.21.99`
  - SSH gateway port: `3000` (non-standard, Pluto-managed)
- **Manual testing**: User can sign up, register machine, log cut, view history
- **Next steps**: Call 3 Facebook contacts (Nate, Mike, Sean) with beta access via SSH tunnel

### 📦 Deployment Ready

- App compiles cleanly (Next.js 14)
- Supabase database initialized with migrations
- `.env.local` configured with project credentials
- Install scripts for Windows (`install.bat`) and Mac/Linux (`install.sh`)
- Can be transferred to personal laptop via zip + npm install

### 🔧 Known Limitations (MVP)

- Suggestion engine has no ML — uses simple SQL ranking by rating
- No machine-specific learning model yet (Phase 3, v2)
- No OPC-UA connectivity (Phase 3, v2)
- Only 2 suggestion tiers (own + community) — "similar machines" requires ML
- Single-user testing only (other respondents not yet invited)
