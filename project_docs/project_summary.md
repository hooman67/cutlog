# CutLog Project Summary

**Last updated**: 2026-06-14
**Purpose**: Complete context transfer document. Any agent session reading this file should have everything needed to continue work on this project.

---

## What Is This Project?

**CutLog** is a machine-specific laser cutting/engraving parameter journal with smart suggestions. It's a SaaS app where operators log cuts (30 seconds each), building a personal + community database that learns per-machine.

**Tagline**: "Stop keeping parameters in your head. Let your machine remember."

**Origin**: Discovered through systematic 40-cycle venture-scale startup idea research. Scored 8.70/10 — highest of 74 ideas evaluated. Pure SaaS, $200K capital, zero competition, 200K+ addressable machines.

---

## Core Idea (The Two-Layer Model)

**Two-layer learning system:**
1. **General Model** — trained on everyone's data across thousands of machines. Understands how lasers work, material properties, parameter relationships.
2. **Machine-Specific Calibration Layer** — personalized for YOUR machine's unique characteristics (resonator degradation, calibration drift, environmental quirks, historical success patterns).

**Key insight from validation**: "Speed is the key variable. Everything else is dialed in pretty close." (Tinker Withit). For v1, the ML model primarily predicts SPEED for a given material/thickness/machine.

**Value proposition**: When you ask "what parameters for 3mm stainless," the system doesn't say "use 3500W, 4m/min" (generic). It says "use 3200W, 4.2m/min, 12-bar gas" — calibrated for YOUR machine's age, calibration state, and history.

---

## Current State (2026-06-14)

### Prototype: LIVE AND DEPLOYED

| Component | Status | Details |
|-----------|--------|---------|
| **App** | ✅ Functional | Next.js 14 + Tailwind + Supabase, 5 screens |
| **Database** | ✅ Seeded | 724 parameter sets across 20+ materials |
| **Auth** | ✅ Working | Supabase email auth |
| **Hosting** | ✅ LIVE | **https://cutlog-two.vercel.app** (public, anyone can use) |
| **Dev server** | ✅ Available | Pluto machine port 8000, SSH tunnel for dev |
| **GitHub** | ✅ Pushed | `git@github.com:hooman67/cutlog.git` |
| **PWA** | ✅ Installable | iPhone "Add to Home Screen" = native app feel |

### Customer Validation: IN PROGRESS

| Phase | Status | Results |
|-------|--------|---------|
| Facebook polls (Round 1) | ✅ Complete | 30+ responses, 81% group engagement rate |
| DM outreach (Round 1) | ✅ Complete | 3/5 responded positively, none booked calls yet |
| Follow-up messages | ✅ Sent | Full product explanation sent to Mike, Nate, Sean |
| Facebook polls (Round 2) | ✅ Complete | 35+ comments, deeper engagement |
| DM outreach (Round 2) | 🔲 Pending | 5 new targets identified, DMs drafted |
| Discovery calls | 🔲 Not yet | Zero calls booked so far |

### Data Collection: PARTIALLY COMPLETE

| Source | Records | Status |
|--------|---------|--------|
| AI-generated baseline | 554 | ✅ In DB |
| LightBurn GitHub repos | 52 | ✅ In DB |
| lasertips.org + Wikipedia | 43 | ✅ In DB |
| Reddit/forums | 80 | ✅ In DB |
| Manual user logs | 2 | ✅ In DB |
| **Total in DB** | **724** | |
| OMG Laser (130+ entries) | 0 | 🔲 Ready to scrape |
| Etsy .CLB files | 0 | 🔲 Need to buy ($32-50) |
| OEM manuals | 0 | 🔲 Planned |

---

## Technical Architecture

### Stack
- **Frontend**: Next.js 14 + Tailwind CSS (dark theme, mobile-first)
- **Backend**: Next.js API routes + Supabase client (serverless)
- **Database**: Supabase PostgreSQL (free tier: 500MB, 50K rows)
- **Auth**: Supabase Auth (email-based)
- **Hosting**: Vercel (production: https://cutlog-two.vercel.app) + Pluto job machine for dev

### Code Location
- **App**: `/mnt/localssd/laser_log/app/`
- **GitHub**: `git@github.com:hooman67/cutlog.git` (personal account hooman67, NOT work)
- **SSH key for GitHub**: `/mnt/localssd/laser_log/hs_personal_github_ssh_key`
- **Research docs**: `/home/colligo/hs_scripts/claude/auto_research/deep_research/laser_cutting_optimization/`

### Supabase Credentials
- **Project URL**: `https://aobzsonuemamitlrakqs.supabase.co`
- **Keys**: Stored in `/mnt/localssd/laser_log/app/.env.local` (never commit to git)

### Deployment (Vercel)
- **Production URL**: https://cutlog-two.vercel.app
- **Vercel account**: `cutlog` team, connected to `hooman67` GitHub
- **Auto-deploys**: Push to `main` branch → Vercel rebuilds automatically
- **Environment variables** (set in Vercel dashboard):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://aobzsonuemamitlrakqs.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (in .env.local)
  - `SUPABASE_SERVICE_ROLE_KEY` = (in .env.local)

### Dev Access / Testing
- **Pluto machine**: `100.64.21.99` (SSH gateway port `3000`)
- **SSH tunnel from Mac**: `ssh -L 8000:localhost:8000 colligo@100.64.21.99 -p 3000`
- **Dev server**: `export PATH="/opt/conda/bin:$PATH" && cd /mnt/localssd/laser_log/app && npx next dev -p 8000`
- **Node.js**: `/opt/conda/bin/node` (v18.20.2)
- **Build for production locally**: `export PATH="/opt/conda/bin:$PATH" && cd /mnt/localssd/laser_log/app && npx next build`

### Database Schema

**Tables**: `machines`, `cuts`, `materials`

**cuts** (main table):
- `id` uuid PK
- `machine_id` uuid FK (nullable — NULL for baseline data)
- `user_id` uuid FK (nullable — NULL for baseline data)
- `material` text NOT NULL
- `thickness_mm` numeric NOT NULL
- `power_pct`, `speed_mm_min`, `gas_type`, `gas_pressure_bar`, `focus_position_mm`, `nozzle_diameter_mm`, `nozzle_distance_mm`, `line_interval_mm` (all nullable)
- `quality_rating` integer (1-5)
- `edge_quality` text CHECK ('clean', 'slight_dross', 'heavy_dross', 'burn_marks')
- `source` text CHECK ('user_logged', 'ai_baseline', 'scraped_public') DEFAULT 'user_logged'
- `is_shared` boolean DEFAULT true
- `created_at` timestamptz

**machines**: brand, model, wattage_w, source_type (fiber/co2/diode), resonator_hours, gas_types[], controller, location_country, nickname

**materials**: Pre-seeded 85+ materials with categories and aliases

### App Pages
1. `/` — Home dashboard (Log Cut, Get Suggestion, Cut History, Import LightBurn, Machine Settings)
2. `/auth` — Email signup/signin
3. `/machine` — Machine registration (one-time)
4. `/log` — Cut logging form (30-second workflow, 10+ parameters)
5. `/suggest` — Speed recommendation engine. Hero display shows recommended speed (mm/min) with confidence level (HIGH/MEDIUM/LOW based on data points), range, and supporting params. 3-button quick feedback ("Too Slow" / "Perfect" / "Too Fast") stored in localStorage for future optimization. Full parameters (power, gas, focus, nozzle) in collapsible section below. Keeps 3-tier data source display (Your Data green, AI Baseline orange, Community blue). Page messaging: "How fast should I cut?"
6. `/history` — Searchable cut history + "Export .clb" button (downloads LightBurn library file)
7. `/import` — LightBurn .clb file import (drag-and-drop upload, preview entries, select & save to DB)

### API Routes
- `POST /api/import-clb` — Parses uploaded .clb XML file, returns structured entries for preview
- `GET /api/export-clb` — Fetches user's cuts from DB, generates downloadable .clb XML file (supports ?material= and ?machine_id= filters)

### LightBurn Integration
- **Import**: Upload .clb files → preview parsed entries → select which to save → inserts to `cuts` table with source='user_logged'
- **Export**: Fetches user's cuts → groups by material → generates valid LightBurn XML (.clb) with speed converted from mm/min to mm/s
- Speed conversion: .clb files use mm/s, CutLog DB uses mm/min (multiply by 60 on import, divide by 60 on export)
- Handles CutSetting types (Cut, Scan, Image), thickness=-1 (not specified), multiple passes, line intervals

### Data Pipeline

**Current state: 724 parameters in production DB (cold-start DONE)**

Data files in `/mnt/localssd/laser_log/app/data/`:
- `COMBINED_PASTE_ALL.sql` — All rows, one file (paste into Supabase SQL Editor to re-seed)
- `baseline-parameters.sql` — 554 AI-generated rows
- `lightburn-scraped.sql` — 52 rows from GitHub LightBurn repos
- `lasertips-scraped.sql` — 43 rows from lasertips.org + Wikipedia
- `reddit-forums-scraped.sql` — 80 rows from forums

Generator script: `/mnt/localssd/laser_log/app/scripts/generate-baseline-data.py`
- Run: `python3 scripts/generate-baseline-data.py` → outputs to `data/baseline-parameters.sql`
- 20 materials, 5-7 variations per thickness, scientifically realistic ranges

**Database migrations applied** (in `/mnt/localssd/laser_log/app/supabase/migrations/`):
1. `001_initial_schema.sql` — Core tables + RLS
2. `002_seed_materials.sql` — 85+ materials reference
3. `PASTE_003_AND_004.sql` — Added `source` column + made user_id/machine_id nullable
4. `COMBINED_PASTE_ALL.sql` — 724 parameter rows inserted

**To add new data**: Generate/scrape SQL, paste into Supabase SQL Editor at https://supabase.com/dashboard (no direct DB connection from Pluto). Use service role key for inserts that bypass RLS.

### Key Bugs Fixed (for context)
1. Suggestion search used exact `eq` → changed to `ilike` with `%` wildcards
2. RLS blocked JOINs on machines table → removed JOIN
3. `!machine` guard silently blocked search → removed
4. Typed material didn't trigger search → uses `material || materialSearch`
5. NULL thickness in scraped data violated NOT NULL → filtered out
6. Source column needed before baseline insert → combined migration

---

## Competitive Landscape

| Competitor | Threat | What They Do | Our Advantage |
|-----------|--------|------------|---------------|
| **lasertips.org** | 3/10 | Free static tables, Chinese OEMs only, no search | Dynamic ML, all brands, per-machine |
| **OMG Laser settings** | 2/10 | 130+ static entries, sales funnel | Same as above |
| **LaserParams Converter** (GitHub) | 1/10 | Wattage/lens math converter, dormant | Different problem, but integrate their math |
| **Beam Squadron** (Chance Lawson) | 4/10 | Education ($30-50/mo), engraving courses | We're a tool, not education. Partner opportunity |
| **Etsy parameter sellers** | 2/10 | Static .CLB files ($5-43) | Dynamic, learning, per-machine |
| **LightBurn Material Library** | 5/10 | Built-in param storage (no community sharing) | We ADD community + ML on top. Must integrate with .clb format |
| **OEM WhatsApp support** | 3/10 | First-year support, fades over time | Always available, improves over time |
| **LLMs (ChatGPT/Claude)** | MEDIUM | Generic params for common materials | Per-machine calibration, verified outcomes, connected data |

---

## Customer Validation Findings

### Key People (From Facebook Outreach)

| Name | Role | Key Insight | Status |
|------|------|-------------|--------|
| **Nate Keen** | Experienced operator | Machine variation is MASSIVE (power degradation 5yr vs 40yr). Line interval is THE critical param. "It's all in my head from years of experience." | Messaged, awaiting reply |
| **Mike AJ Guindon** | Small business owner (EST) | Tech-aware, shared lasertips.org, said "I'm up for a chat about your AI idea" | Messaged, awaiting reply |
| **Sean BeardyWeirdo** | Skeptical operator | "I have reservations on how this could be achieved by another person" — THE core objection | Messaged, awaiting reply |
| **Jeremy Hubert** | Technical operator | "No two machines are the same, each lens has unique signature" | DM drafted, not sent |
| **Michael Stanislawczyk** | Tech-savvy operator | Knows LaserParams Converter, LightBurn ecosystem | DM drafted, not sent |
| **Tinker Withit** | Experienced operator | "It's usually just about speed. Everything else is dialed in pretty close." | DM drafted, not sent |

### Validated Insights
1. **Trial and error is dominant** — 80%+ of operators say "testing is the only way"
2. **Per-machine variation is real** — every operator confirms machines differ
3. **Speed is the key variable** — other params stay constant per-machine
4. **People already pay for parameters** — Etsy sellers with 422+ reviews at $32
5. **LightBurn is the ecosystem** — mentioned 8+ times, must integrate with .clb format
6. **OEM support fades after year 1** — target operators 1+ years post-purchase
7. **Market has resigned itself** — they believe nothing can help. Need dramatic proof

### The Core Objection (Must Overcome)
"How can someone else's results help MY machine when every machine is different?"

**Answer**: Two-layer model. Community data trains the general model. YOUR machine's history trains a personal calibration layer. You get both — generic knowledge personalized for YOUR setup.

---

## Research Documents (All in `/home/colligo/hs_scripts/claude/auto_research/deep_research/laser_cutting_optimization/`)

| File | Contents |
|------|----------|
| `01_product_definition.md` | Problem statement, MVP scope, user workflow, pricing, ideal customer |
| `02_competitive_analysis.md` | Full competitive landscape (pre-validation). STRONG GO verdict |
| `03_feasibility_and_prototype.md` | Architecture, build instructions, risk register, validation plan |
| `04_customer_validation.md` | ALL validation work: plan, Round 1 polls/DMs/replies, Round 2 polls/replies, analysis |
| `05_comparison_scorecard.md` | Weighted scoring vs alternatives (8.70/10) |
| `academic_papers.md` | 10 papers proving ML for laser cutting works |
| `beam_squadron_competitive_analysis.md` | Chance Lawson's training platform. 4/10 threat. Partnership opportunity |
| `data_sources.md` | 8 source categories, 800-1200+ potential params |
| `extraction_strategy.md` | Python code for LightBurn XML, Epilog PDFs, Reddit API |
| `etsy_parameter_files_research.md` | Market for paid .CLB files. LaserSecrets = leader ($32, 422 reviews) |
| `lightburn_integration_research.md` | .clb is plain XML. Parseable. Open-source tools exist. 84K views on sharing thread |
| `overall_data_plan.md` | 3-week plan to reach 895 unique params. Priority order for scraping |
| `speed_recommendation_analysis.md` | Why speed is the key variable. MVP just predicts speed. Bandit-style optimization |
| `round1_followup_drafts.md` | Short follow-up DMs for Mike, Nate, Sean |
| `round2_dm_drafts.md` | DM scripts for 5 new targets |
| `prototype_1_plan.md` | Initial prototype planning |
| `SCRAPING_ROADMAP.md` | 3-phase scraping plan |
| `source_validation.md` | Quality assessment of data sources |
| `README_DATA_COLLECTION.md` | Overview of data collection approach |

---

## What Needs to Happen Next (Priority Order)

### Immediate (This Week)
1. **Send the app link** to Round 1 leads (Mike, Nate, Sean) — short message: "Try it: https://cutlog-two.vercel.app — log a cut in 30 sec"
2. **Send Round 2 DMs** to 5 new targets (Jeremy, Michael, Tinker, George, Klaus)
3. **Buy LaserSecrets on Etsy** ($32) — understand market format expectations
4. **Scrape OMG Laser** (130+ entries) — add to existing 724 params in DB

### Short-Term (Next 2 Weeks)
5. **Build LightBurn .clb import/export** into the app — zero-friction adoption
6. **Make speed recommendation the hero feature** — simplify UI around this one thing
7. **Integrate LaserParams Converter math** — power/lens scaling formulas as feature engineering
8. **Scrape remaining sources** (OMG Laser, Epilog PDFs, OEM manuals) — lasertips + Reddit + LightBurn GitHub already done
9. **Investigate Beam Squadron partnership** — Chance Lawson's audience = our beta users

### Medium-Term (Month 2-3)
10. **Get 5 beta users logging cuts** — validate daily logging habit
11. **Train v1 ML model** (XGBoost) — speed prediction from material/thickness/machine
12. **Build drift detection** — alert when machine parameters start degrading
13. **PWA + offline support** — installable on shop floor tablets/phones
14. **OPC-UA connectivity** (Phase 3) — auto-log without manual entry

---

## Key Technical Decisions Made

1. **LightBurn .clb format is plain XML** — trivially parseable, open-source parsers exist
2. **LaserParams Converter logic should be integrated** — not as a competitor, but as feature engineering (convert 1 data point into N machine configurations)
3. **Speed is the primary prediction target for v1** — other params stay constant per-machine
4. **3-button feedback UX** — "too fast / perfect / too slow" for bandit-style optimization
5. **Minimum 10 data points per material/thickness combo** for useful speed predictions
6. **Target: 600+ unique params covering 20+ materials and 4 laser types** within 3 weeks

---

## User Preferences (for any agent working on this)

- Personal GitHub account (`hooman67`), NOT work account (`hshariati`)
- Prefers manual credential passing, NOT MCP authentication for Supabase
- Supabase SQL changes via copy-paste into SQL Editor (no direct DB connection from Pluto)
- Node.js at `/opt/conda/bin/` on Pluto machine
- Working directory for research: `/home/colligo/hs_scripts/claude/auto_research/`
- Working directory for app: `/mnt/localssd/laser_log/app/`
- Uses tmux on Bedrock machine for long-running sessions
- Prefers bypass permissions mode (all tools auto-allowed)

---

## Session History

| Session | Focus | Key Outputs |
|---------|-------|-------------|
| Auto-research (40 cycles) | Idea discovery | 74 ideas evaluated, laser cutting = #1 |
| Deep research | Product definition + competitive analysis | 6 deep-dive documents |
| Session A (bedrock-laser-tmux) | Customer validation + research | Facebook outreach (2 rounds), competitor analysis (Beam Squadron, Etsy, LightBurn), data planning, DM drafts, speed analysis |
| Session B (CutLog prototype) | Building + deploying the app | Next.js app built, Supabase DB, 724 params scraped/generated and seeded, suggestion engine fixed, deployed to Vercel (https://cutlog-two.vercel.app) |

---

## How to Continue This Work

1. **Read this file first** — it has everything
2. **Check `/home/colligo/hs_scripts/claude/auto_research/deep_research/laser_cutting_optimization/`** for detailed docs on any topic
3. **For app work**: cd to `/mnt/localssd/laser_log/app/` and read the code
4. **For customer validation**: read `04_customer_validation.md` for full history
5. **For data collection**: read `overall_data_plan.md` for priorities and `extraction_strategy.md` for code
6. **For ML model design**: read `speed_recommendation_analysis.md`
7. **For LightBurn integration**: read `lightburn_integration_research.md`
