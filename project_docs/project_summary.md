# CutLog Project Summary

**Last updated**: 2026-06-28
**Purpose**: Complete context transfer document. Any agent session reading this file should have everything needed to continue work on this project.

---

## What Is This Project?

**CutLog** is a machine-specific laser cutting/engraving parameter journal with smart suggestions. It's a SaaS app where operators log cuts (30 seconds each), building a personal + community database that learns per-machine. When no data exists for a material/thickness combination, CutLog falls back to Gemini 2.0 Flash AI to generate a conservative starting point, which users can validate to grow the database organically.

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

## Current State (2026-06-28)

### Prototype: LIVE AND DEPLOYED

| Component | Status | Details |
|-----------|--------|---------|
| **App** | ✅ Functional | Next.js 14 + Tailwind + Supabase, 10 screens (added /import, /suggest, /landing, /waitlist, /tools/font-preview) |
| **Database** | ✅ Seeded | **5,826 parameter sets** across 562+ materials (scraped_public: 5,264, ai_baseline: 554, user_logged: 8). Updated 2026-06-28. Industrial thick cutting data +173. |
| **Auth** | ✅ Working | Supabase email auth |
| **Hosting** | ✅ LIVE | **https://cutlog-two.vercel.app** (public, anyone can use) |
| **Dev server** | ✅ Available | Pluto machine port 8000, SSH tunnel for dev |
| **GitHub** | ✅ Pushed | `git@github.com:hooman67/cutlog.git` |
| **PWA** | ✅ Installable | iPhone "Add to Home Screen" = native app feel. Smart install banner added for mobile users |
| **Algorithm** | ✅ Complete | All 10/10 recommendation algorithm improvements implemented (2026-06-21) |
| **Demo Video** | ✅ Complete | 30-sec demo video recorded (2026-06-23) |
| **Multi-machine** | ✅ Live | Full multi-machine support — users can register and switch between machines |
| **Edit/Delete** | ✅ Live | Users can edit and delete their logged cuts |
| **Admin Tools** | ✅ Live | Admin data reset/cleanup functionality |
| **Gemini AI** | ✅ Live | Gemini 2.0 Flash fallback for materials with no database data |
| **Data Security** | ✅ Live | RLS lockdown (auth required for all data), server-side API routes, rate limiting (30 req/min), auth gates on all endpoints (2026-06-23) |
| **Native App** | 🔲 Planned | Capacitor integration code exists on `migration_to_app` branch. Will merge after 5+ active beta users. |

### Customer Validation: IN PROGRESS

| Phase | Status | Results |
|-------|--------|---------|
| Facebook polls (Round 1) | ✅ Complete | 30+ responses, 81% group engagement rate |
| DM outreach (Round 1) | ✅ Complete | 3/5 responded positively, none booked calls yet |
| Follow-up messages | ✅ Sent | Full product explanation + app link sent to Mike, Nate, Sean (2026-06-15) |
| Facebook polls (Round 2) | ✅ Complete | 35+ comments, deeper engagement |
| DM outreach (Round 2) | ✅ Complete | 6/6 DMs sent (Jeremy, Michael, George, Tinker, Klaus, Lobo). 2 replied (Jeremy, Tinker). |
| Manual DMs (All Tiers) | ✅ Complete | 17 people DM'd across Tier 1-4 (2026-06-22). Monitoring for replies. |
| Influencer outreach | 🔄 In Progress | Jessie Jones replied (2026-06-22). Alex, Justin, Richard emailed (2026-06-21). Chance/Alisha next. |
| Reddit campaign | 🔄 In Progress | Posts: r/ChineseLaserCutters (2026-06-25, 6 upvotes, 2.1K views), r/lasercutting (2026-06-28, pending approval). Joined r/Machinists, r/metalworking, r/sheetmetal (2026-06-28). 9 karma-building comments posted across 3 subs. |
| Facebook lead-gen (Round 3) | 🔄 In Progress | Post Option C ("Settings you'd pay money for") posted in ALL 16 groups on 2026-06-26. Monitoring for commenters → DM targets. |
| Discovery calls | 🔲 Not yet | Zero calls booked so far |

### Data Collection: PARTIALLY COMPLETE

| Source | Records | Status |
|--------|---------|--------|
| AI-generated baseline | 554 | ✅ In DB |
| LightBurn GitHub repos | 52 | ✅ In DB |
| lasertips.org + Wikipedia | 43 | ✅ In DB |
| Reddit/forums | 80 | ✅ In DB |
| Manual user logs | 2 | ✅ In DB |
| OMG Laser (omglaser.com) | 177 | ✅ In DB (scraped 2026-06-15) |
| lasertips.org UV + CO2 galvo | 62 | ✅ In DB (scraped 2026-06-23) |
| lasertips.org fiber (full) | 134 | ✅ In DB (scraped 2026-06-23) |
| Bonny Creations | 3,650 | ✅ In DB (scraped 2026-06-23) |
| LaserCutSettings.com | 205 | ✅ In DB (scraped 2026-06-23) |
| LSARMS.net | 693 | ✅ In DB (scraped 2026-06-23) |
| Industrial thick cutting | 173 | ✅ In DB (scraped 2026-06-28) |
| **Total in DB** | **5,826** | **562+ unique materials** |
| Etsy .CLB files (3 products) | 3,839 settings | ✅ Purchased & analyzed (2026-06-17). LaserSecrets=188, BenMyers=19, HolsterGeek=10, + Nate Keen=82. See `etsy_files_analysis.md`. **Validation: 500 matched to our DB (13%), 87% overall accuracy**. See `speed_validation_report.md` |
| OEM manuals | 0 | 🔲 Planned |

---

## Technical Architecture

### Stack
- **Frontend**: Next.js 14 + Tailwind CSS (dark theme, mobile-first)
- **Backend**: Next.js API routes + Supabase client (serverless)
- **Database**: Supabase PostgreSQL (free tier: 500MB, 50K rows)
- **Auth**: Supabase Auth (email-based)
- **AI Fallback**: Google Gemini 2.0 Flash (last-resort suggestion when no database data exists)
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
  - `GEMINI_API_KEY` = (in .env.local) — Google Gemini 2.0 Flash API key for AI suggestion fallback

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
5. `/suggest` — Speed recommendation engine. Hero display shows recommended speed (mm/min) with confidence level (HIGH/MEDIUM/LOW based on data points), range, and supporting params. 3-button quick feedback ("Too Slow" / "Perfect" / "Too Fast") stored in localStorage for future optimization. Full parameters (power, gas, focus, nozzle) in collapsible section below. 4-tier data source display: Your Data (green), Community (blue), AI Baseline (orange), AI Suggestion (gray). When no data exists, Gemini 2.0 Flash generates a starting point displayed with gray "AI SUGGESTION (Unverified)" badge + "Was this helpful?" validation buttons. Page messaging: "How fast should I cut?"
6. `/history` — Searchable cut history + "Export .clb" button (downloads LightBurn library file)
7. `/import` — LightBurn .clb file import (drag-and-drop upload, preview entries, select & save to DB)
8. `/landing` — Public landing page for hybrid launch (hero, problem/solution, features, demo video, waitlist CTA)
9. `/waitlist` — Waitlist signup form (email capture to Supabase)
10. `/tools/font-preview` — Font preview utility (relationship currency for Nate Keen)

### User Discovery & Onboarding UX (Added Session C)

The app includes four lightweight discovery features to help new users find value quickly:

1. **Contextual hints** (`/suggest` page) — When user has no data or no machine configured, shows blue/sky-colored dismissable hints pointing to `/import` and `/machine` setup.
2. **First-visit onboarding overlay** — Single-screen welcome modal on first visit showing 3 key features (speed recommendations, .clb import, per-machine learning). Dismisses forever on click. Tracked via `localStorage`.
3. **Empty states that educate** — When `/history` is empty or `/suggest` returns no results, shows helpful pointers to import, log, or browse. Home page shows a "Getting Started" card for new users with no data.
4. **Smart nudges** — Behavioral one-time tips (amber/yellow, auto-dismiss 8s): after 3 visits to `/suggest` without importing, shows a toast about .clb import; after 3 logged cuts without using feedback buttons, shows a toast about the feedback system. All tracked via `localStorage`.

### API Routes
- `POST /api/import-clb` — Parses uploaded .clb XML file, returns structured entries for preview
- `GET /api/export-clb` — Fetches user's cuts from DB, generates downloadable .clb XML file (supports ?material= and ?machine_id= filters)

### LightBurn Integration
- **Import**: Upload .clb files → preview parsed entries → select which to save → inserts to `cuts` table with source='user_logged'
- **Export**: Fetches user's cuts → groups by material → generates valid LightBurn XML (.clb) with speed converted from mm/min to mm/s
- Speed conversion: .clb files use mm/s, CutLog DB uses mm/min (multiply by 60 on import, divide by 60 on export)
- Handles CutSetting types (Cut, Scan, Image), thickness=-1 (not specified), multiple passes, line intervals

### Data Pipeline

**Current state: 5,826 parameters in production DB (massive data expansion 2026-06-23: +4,744 from Bonny Creations, LSARMS, LaserCutSettings, lasertips.org full scrape; +173 industrial thick cutting 2026-06-28)**

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
5. `005` through `007` — Various schema improvements
6. `008_feedback_table.sql` — Feedback table for "Too Fast / Perfect / Too Slow" responses (applied 2026-06-21)
7. `009_is_active_on_machines.sql` — Added `is_active` column to machines table for multi-machine support (applied 2026-06-21)
8. `011_add_q_pulse.sql` — Added Q-pulse fields (applied 2026-06-27)
9. `012_user_feedback_table.sql` — User feedback table (applied 2026-06-28)

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
| **lasertips.org** | 2/10 | Static database, 212 entries across 7 years, declining activity (2 entries in 2026), zero community, no AI, no per-machine learning. Data fully scrapeable. Solo Norwegian hobbyist operator on home server. 2,300 monthly visits. UV subdomain (uv.lasertips.org) has 51 entries, zero external discoverability, never promoted. | Dynamic ML, all brands, per-machine, growing community |
| **Bonny Creations** | 3/10 | Largest community DB (3,800+ entries, 59+ machines, 118+ materials). Flat database, no AI, no per-machine learning. Revenue from SVG files + Amazon affiliates. | Per-machine ML, AI fallback, LightBurn integration, adaptive learning |
| **LaserCutSettings.com** | 2/10 | 260 settings, 115 machines, 13 brands. Clean UX, supports .clb download. Built by LaserJobManager team. Static data, no AI. | Per-machine learning, community growth, AI suggestions, feedback loop |
| **OMG Laser settings** | 2/10 | 130+ static entries, sales funnel | Same as above |
| **LaserParams Converter** (GitHub) | 1/10 | Wattage/lens math converter, dormant | Different problem, but integrate their math |
| **Beam Squadron** (Chance Lawson) | 4/10 | Education ($30-50/mo), engraving courses | We're a tool, not education. Partner opportunity |
| **Etsy parameter sellers** | 2/10 | Static .CLB files ($5-43) | Dynamic, learning, per-machine |
| **LightBurn Material Library** | 5/10 | Built-in param storage (no community sharing) | We ADD community + ML on top. Must integrate with .clb format |
| **OEM WhatsApp support** | 3/10 | First-year support, fades over time | Always available, improves over time |
| **LLMs (ChatGPT/Claude)** | MEDIUM | Generic params for common materials | Per-machine calibration, verified outcomes, connected data |
| **BeraTech CNC** (Mehmet Açıkgöz) | 4/10 | AI-powered mobile app (Flutter, iOS/Android). Broad CNC tool (laser+milling+turning). ~1,900 downloads. Solo Turkish developer. $14.99/mo. | No community data, no per-machine learning, no feedback loop, no LightBurn integration. Broad vs our deep specialization. See `beratech_cnc_competitive_analysis.md` |

---

## Customer Validation Findings

### Key People (From Facebook Outreach)

| Name | Role | Key Insight | Status |
|------|------|-------------|--------|
| **Nate Keen** | Galvo laser operator (engraving) | Galvo lasers don't drift; different market than CNC cutters. "Even if it gets people in the ballpark that's 90% there!" Advised: polish before marketing. Offered YouTube/TikTok promo. | PARTNERSHIP: Offered to make video (20K YT + 225K TikTok). Polish app first, then he promotes. |
| **Mike AJ Guindon** | Small business owner (EST) | Busy running shop, consistently willing but time-poor | ✅ App link sent, "will try this week." Follow up by 2026-06-20. |
| **Sean BeardyWeirdo** | Skeptical operator | "I have reservations on how this could be achieved by another person" — THE core objection | ✅ Asked about diode compatibility. Reply sent 2026-06-21. Potential diode market validation. |
| **John Stegenga** | Multi-machine operator | "I have 3 of the same machines, and they all are different" — strongest per-machine validation | Late reply. DM candidate for app link. |
| **Jeremy Hubert** | Technical operator, LightBurn user | Saves tests in LightBurn material library. Systematic tester. | ✅ DM replied. Follow up re: sharing .clb library. |
| **Tinker Withit** | Experienced CNC cutter (Raytool) | Uses book + web for starting points, adjusts speed. Confirms starting-point value. | ✅ Replied on thread. Warm. |
| **Lobo Lightbringer** | Systematic thinker | "Speed is almost the same across brands for each laser source output power" — validates scaling math | ✅ DM sent (2026-06-17). Awaiting reply. |

### Validated Insights
1. **Trial and error is dominant** — 80%+ of operators say "testing is the only way"
2. **Per-machine variation is real** — every operator confirms machines differ (John Stegenga: 3 identical machines, all different)
3. **Speed is the key variable** — confirmed by Tinker Withit + Lobo Lightbringer independently
4. **People already pay for parameters** — Etsy sellers with 422+ reviews at $32
5. **LightBurn is the ecosystem** — mentioned 8+ times, must integrate with .clb format (✅ DONE)
6. **OEM support fades after year 1** — target operators 1+ years post-purchase
7. **Market has resigned itself** — they believe nothing can help. Need dramatic proof
8. **"Ballpark = 90% of the value"** — Nate Keen (experienced operator) says getting in the ballpark is 90% there. Our value prop is saving the first 90% of trial-and-error.
9. **Two distinct markets exist** — Galvo engraving (Nate's world: no gas, no drift, marking/etching) vs CNC cutting (industrial: gas, nozzle, through-cutting). Both valid but different parameter needs. Our OMG Laser data serves galvo; our AI baseline serves CNC cutters.
10. **Jeremy uses LightBurn Material Library as his system** — proves .clb import is the right onboarding flow

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
| `round2_dm_drafts.md` | DM scripts for 6 targets (Jeremy, Michael, Tinker, George, Klaus, Lobo) |
| `beratech_cnc_competitive_analysis.md` | BeraTech CNC app competitor analysis. AI-powered mobile app, 4/10 threat. Solo Turkish developer |
| `migration_to_full_app_plan.md` | Capacitor integration plan to wrap CutLog as native iOS/Android app. Trigger: 5+ active users |
| `prototype_1_plan.md` | Initial prototype planning |
| `SCRAPING_ROADMAP.md` | 3-phase scraping plan |
| `source_validation.md` | Quality assessment of data sources |
| `README_DATA_COLLECTION.md` | Overview of data collection approach |

---

## Launch Approach (June 2026)

**Strategy**: Option C — Hybrid Launch (Go Public + Parallel Deep Dives) + **Nate Keen Video Partnership**

We are executing a **hybrid launch strategy** starting Week of June 17, 2026, with a critical update:
- **Phase 1 (Week 1-2)**: Test all workflows, fix bugs, polish UX. Deploy public landing page. Send personal DMs to 6 power users. Facebook posts as secondary/parallel channel.
- **Phase 1.5 (NEW — Nate Polish)**: Import Nate's .clb files, iterate on his feedback, polish font preview tool. Get his green light that app is video-worthy.
- **Phase 2 (Nate Video)**: Nate publishes video to YouTube (20K subs) + TikTok (225K followers). Expected: 500-2000 qualified views.
- **Phase 3 (Post-Video)**: Handle incoming users, collect feedback, scale based on traction.

**STRATEGY SHIFT (2026-06-17)**: Nate Keen offered to make a video about CutLog. His condition: "bugs sorted out and fine tuned." One video to his laser-operator audience = more qualified traffic than all Facebook posts combined. New priority: **Polish first, Nate video second, scale third.** Facebook posts continue in parallel (low cost) but are now secondary.

**Why this approach**: Combines the speed of public launch with the credibility of real-world validation, now supercharged by a trusted creator endorsement. Proof of concept (2-3 users logging cuts) before mass scaling via Nate's audience.

**Key docs**:
- [`launch_strategy_hybrid.md`](launch_strategy_hybrid.md) — Full strategy, timeline, success metrics, risk mitigation
- [`launch_checklist.md`](launch_checklist.md) — 5-step execution checklist for Week 1 (landing page, demo video, waitlist form, Facebook posts, email templates)

**Budget**: $0 if using Vercel + Next.js; $15/mo if using Carrd

---

## What Needs to Happen Next (Priority Order)

### STRATEGIC PIVOT (2026-06-26): Focus, Don't Spread

Based on r/indiehackers research (see `indiehackers_learnings.md` and `strategy_pivot_june26.md`):
1. **Primary channel:** Reddit + YouTube comments (45 min/day answering laser questions with data + link)
2. **Every interaction solves a problem first** — tool mentioned as source, not as pitch
3. **Value before contribution** — deliver recommendation → user tries → prompt "did it work?" (not "log your cuts")
4. **SEO pages** for long-tail "best settings for [material] on [machine]" queries
5. **Product Hunt launch** planned for Month 2
6. Nate Keen and influencers = bonus, not primary strategy

### This Week (June 17-23): Hybrid Launch Phase 1

**COMPLETED (2026-06-21):**
1. ~~**[CRITICAL] Test all 22 workflows**~~ — ✅ DONE. Workflows 18-22 added (multi-machine, edit/delete, admin data cleanup, feedback integration, algorithm improvements). All passing.
2. ~~**Deploy to Vercel**~~ — ✅ DONE. All code pushed to `main` (auto-deploys). Supabase migrations 008 (feedback table) and 009 (is_active on machines) applied. All 10/10 algorithm improvements live. Multi-machine support, edit/delete cuts, admin data reset all live.

**THEN: Go-to-market — ✅ ALL COMPLETE (2026-06-23)**
3. ~~**[CRITICAL] Facebook posts in 16 groups**~~ — ✅ DONE (2026-06-22). All 16 groups posted (Round 1 + Round 2).
4. ~~**[CRITICAL] Send DMs to power users**~~ — ✅ DONE (2026-06-22). All tiers sent (17 people total across Tier 1-4).
5. ~~**Record 30-sec demo video**~~ — ✅ DONE (2026-06-23).
6. ~~**Parameter scaling integration**~~ — ✅ DONE. Scaling applied in suggestion engine.

**Already completed:**
- ~~**Send the app link**~~ — ✅ DONE (2026-06-15). Sent Option A (direct link) to Mike, Nate, Sean. Awaiting replies.
- ~~**Send Round 2 DMs**~~ — ✅ 6/6 sent (Klaus + Lobo sent 2026-06-17). All DMs delivered.
- ~~**Buy LaserSecrets on Etsy**~~ — ✅ DONE (2026-06-17). Bought 3 products, analyzed all. Key insight: lens files use power scaling math, not independent testing. See `etsy_files_analysis.md`
- ~~**Scrape OMG Laser**~~ — ✅ DONE (177 entries added to DB, total now 901)
- ~~**Validate speeds vs Etsy expert data**~~ — ✅ DONE (2026-06-17). Analyzed 3,839 Etsy settings against 64 DB entries. **Results: 87% accuracy, 60% match within 5%.** Outliers identified (cut operations are 6x slower in Etsy data). See `speed_validation_report.md`

### Short-Term (June 24-July 7): Hybrid Launch Phase 2-3
5. **Deep-dive follow-ups** (Week 2) — 1:1 DMs with power users. Encourage them to try app. Ask what material/thickness they want to test.
6. **Collect feedback** (Week 2-3) — Interview active users. Questions: Did suggestions make sense? Would you pay? What's missing?
7. **Compile case studies** (Week 3) — Write 2-3 testimonials with specific wins from active testers.
8. **Iterate landing page** (Week 2-3) — A/B test messaging if needed. Update with case studies + screenshots.
9. **Monitor metrics** (Ongoing) — Track landing page signups (target 100+), DM reply rate (target 50%), app trial users (target 5+), active loggers (target 2-3).
10. **Reddit campaign** (June 25-July 12) — Posting across 9 subreddits (r/ChineseLaserCutters done, r/laserengraving next). See `reddit_strategy.md` for schedule and posts.

### Medium-Term (After Launch Phase Completes)
10. ~~**Build LightBurn .clb import/export**~~ — ✅ DONE (/import page, /api/import-clb, /api/export-clb, export button on /history)
11. ~~**Make speed recommendation the hero feature**~~ — ✅ DONE (speed hero UX + 3-button feedback + collapsible full params)
12. ~~**Integrate LaserParams Converter math**~~ — ✅ DONE (Python module at scripts/parameter_scaling.py, formulas extracted)
13. **Scrape remaining sources** (Epilog PDFs, OEM manuals) — OMG Laser + lasertips + Reddit + LightBurn GitHub done. **In progress (2026-06-23):** lasertips UV/CO2 galvo (62 entries), Bonny Creations (3,800+ entries), LaserCutSettings.com (260 settings)
14. **Investigate Beam Squadron partnership** — Chance Lawson's audience = our beta users
15. ~~**Integrate parameter_scaling.py into suggestion engine**~~ — ✅ DONE. Scaling applied in suggestion engine to expand raw params into applicable suggestions.
    - ~~**Data security**~~ — ✅ DONE (2026-06-23). RLS lockdown, server-side API routes, rate limiting, auth gates. No action needed.
16. **Get 5 beta users logging cuts** — validate daily logging habit (after public launch proves concept)
17. **Train v1 ML model** (XGBoost) — speed prediction from material/thickness/machine
18. **Wrap app in Capacitor** — publish to App Store + Google Play (plan at `migration_to_full_app_plan.md`, trigger: 5+ active users). Capacitor integration code exists on `migration_to_app` branch. Will merge after 5+ active beta users.
19. **Build drift detection** — alert when machine parameters start degrading
20. **OPC-UA connectivity** (Phase 3) — auto-log without manual entry

---

## Key Technical Decisions Made

1. **LightBurn .clb format is plain XML** — trivially parseable, open-source parsers exist
2. **LaserParams Converter logic should be integrated** — not as a competitor, but as feature engineering (convert 1 data point into N machine configurations)
3. **Speed is the primary prediction target for v1** — other params stay constant per-machine
4. **3-button feedback UX** — "too fast / perfect / too slow" for bandit-style optimization
5. **Minimum 10 data points per material/thickness combo** for useful speed predictions
6. **Target: 600+ unique params covering 20+ materials and 4 laser types** within 3 weeks
7. **Discovery UX via localStorage, not server state** — All onboarding/nudge tracking (first-visit flag, nudge counters, dismissals) stored in localStorage. Zero backend cost, no migrations, instant. Approach: subtle education (blue hints, amber nudges) rather than aggressive popups. One-time nudges that respect the user's time
8. **Data protection via server-side queries** — All data queries moved from client-side Supabase calls to server-side API routes (/api/search). Rate limiting at 30 req/min authenticated, 5 req/min anon. RLS blocks all unauthenticated reads. Prevents competitors from scraping our 5,653-entry database.

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
| Session C (cutlog-app, 2026-06-15) | Feature build + data + competitive intel + onboarding UX | OMG Laser scraped (177 entries → DB at 901 total), LightBurn .clb import/export built, LaserParams Converter formulas extracted to Python, suggestion engine refactored (speed-first hero UX + 3-button feedback), PWA install banner added, BeraTech CNC competitor analyzed (4/10 threat), Capacitor migration plan written, Lobo Lightbringer DM drafted, **user discovery/onboarding features added** (contextual hints, first-visit overlay, empty states that educate, smart nudges) |
| Session D (cutlog-app, 2026-06-17) | Launch prep, code audit, bug fixes, go-to-market strategy | Landing page built (`/landing`), waitlist system (`/waitlist` + Supabase table), outreach docs (launch_checklist.md, launch_strategy_hybrid.md, prototype_1_workflows.md with 11 test workflows), **9 bug fixes** (code audit), strategy audit (hybrid launch = Option C chosen), DM status updated (Klaus sent, Lobo sent), font-preview tool (`/tools/font-preview`) |
| Session E (cutlog-app, 2026-06-21) | Algorithm improvements, multi-machine, edit/delete, admin tools | **All 10/10 algorithm improvements implemented** (fuzzy thickness, material aliases, operation type filter, source tier weighting, consistency-based confidence, machine similarity, broader search fallback, feedback integration, thickness interpolation, time-decay weighting). Multi-machine support (migration 009: is_active on machines). Edit/delete cuts. Admin data cleanup. Feedback table (migration 008). Workflows 18-22 added to testing plan. All pushed to main (auto-deployed to Vercel). |
| Session F (laser_log, 2026-06-23 to 2026-06-28) | Data expansion, security, marketing pivot, community presence | **Data:** 901→5,653 entries (scraped Bonny Creations 3,650, LSARMS 693, LaserCutSettings 205, lasertips.org full 196). Industrial thick cutting data scraped (173 entries added to DB). **Security:** RLS lockdown, server-side API routes (/api/search), rate limiting middleware (30 req/min), auth gates on all endpoints. **Marketing pivot (June 26):** Based on r/indiehackers research, shifted from broad shallow outreach to deep community presence. Primary channel: Reddit + YouTube + Facebook (CNC Fiber Laser Ninja). **Outreach:** Influencer DMs sent to Jessie Jones (replied!), Chance Lawson, Alisha Pate, Victor Wolansky (replied!), Alex/Justin/Richard (email). All manual DMs complete (17 people). Lead-gen Facebook post ("what material would you pay money for?") posted in all 16 groups. **Reddit:** Posts in r/ChineseLaserCutters (6 upvotes, 2.1K views, 4 comments), r/lasercutting Post 6 submitted (2026-06-28, pending approval). Joined r/Machinists (275K), r/metalworking (762K), r/sheetmetal (7K) on 2026-06-28. 9 karma-building comments posted across r/metalworking (3), r/lasercutting (3), r/Machinists (3). Prior karma building in 5 subs (r/lasercutting, r/laserengraving, r/lightburn, r/hobbycnc, r/xToolOfficial). **YouTube:** 5 comments on fiber laser videos with real parameter data + CutLog link. **Facebook:** Helpful replies in CNC Fiber Laser Ninja with CutLog mentions. Replied to Tony Smiley (closed, not target), Michael Greenstein (seed planted), Dan Allkins brass question (parameter data + seed), Jacob Aldrich quoting software question. **Strategy learning:** CNC Fiber Laser Ninja is best FB group (fast, easy engagement). "Fiber Laser The Next Level" has pending/approval issues — deprioritize. **Nate Keen:** He tried the app! Reported .clb import bug + limited edit form → both fixed same day. Sent Q-pulse + galvo mode reply (2026-06-28). Video partnership still pending. **Technical (2026-06-28):** Built Q-pulse field, galvo mode filtering, feedback & ideas page. Applied migrations 011 (q_pulse) and 012 (user_feedback). Gemini AI fixed (reverted to original working format). **Earlier technical fixes:** Gemini AI model name fix, retry with backoff, mobile .clb import (removed accept attribute for iOS), mobile export (Web Share API), new laser beam app icon, admin dashboard, per-cut edit/delete with 16-field form, unit tests (135 tests via vitest). **Docs:** Reddit strategy, YouTube comments strategy, indiehackers learnings, strategy pivot, lead gen posts, competitive analysis (lasertips.org, Bonny Creations, LaserCutSettings, LSARMS). Reddit sub research completed (r/Machinists, r/metalworking, r/sheetmetal identified as key audiences for industrial thick-cutting users). |

---

### Project Documentation Index

| File | Purpose |
|------|---------|
| `project_summary.md` | Master overview — read this FIRST. Has everything. |
| `01_product_definition.md` | Problem statement, MVP scope, pricing, ideal customer |
| `02_competitive_analysis.md` | Full competitive landscape |
| `03_feasibility_and_prototype.md` | Architecture, build instructions, risk register |
| `04_customer_validation.md` | All validation work: polls, DMs, replies, analysis |
| `05_comparison_scorecard.md` | Weighted scoring vs alternatives |
| `recommendation_algorithm.md` | How the suggest engine works (4-tier, scaling, confidence) |
| `launch_strategy_hybrid.md` | Hybrid launch plan + Nate Keen video partnership |
| `launch_checklist.md` | Week 1 execution checklist |
| `outreach_3_waitlist.md` | Facebook group posts (3 rounds) |
| `outreach_4_manual_dms.md` | All 17 manual DMs sent + status |
| `outreach_5_influencers.md` | Influencer outreach (11 targets, status log) |
| `outreach_6_lead_gen.md` | Lead gen posts + 13 new DM targets + templates |
| `round1_dms_and_replies.md` | Full DM conversation history (Mike, Nate, Sean, Jeremy, etc.) |
| `round2_dms_and_replies.md` | Round 2 Facebook post results + all comments |
| `reddit_strategy.md` | Reddit posting schedule, 10 posts, activity log |
| `youtube_comments_strategy.md` | YouTube comment approach, 15 video targets, templates |
| `indiehackers_learnings.md` | Research: what indie hackers do differently. Critical insights. |
| `strategy_pivot_june26.md` | The strategic pivot: focus > spread. Daily routine. |
| `demo_video_plan.md` | 30-sec demo video shot list and script |
| `beta_invite_emails.md` | 7 email templates for beta lifecycle |
| `speed_validation_report.md` | CutLog vs Etsy expert data (87% accuracy) |
| `etsy_files_analysis.md` | Analysis of $46 purchased Etsy parameter files |
| `migration_to_full_app_plan.md` | Capacitor native app plan (trigger: 5+ users) |
| `data_sources.md` | All data sources with scrapeability scores |
| `SCRAPING_ROADMAP.md` | Scraping plan and status |
| `beam_squadron_competitive_analysis.md` | Beam Squadron / Chance Lawson analysis |
| `beratech_cnc_competitive_analysis.md` | BeraTech CNC competitor analysis |
| `lightburn_integration_research.md` | .clb format research |
| `overall_data_plan.md` | Data collection priorities |
| `speed_recommendation_analysis.md` | Why speed is the key variable |
| `academic_papers.md` | 10 papers proving ML for laser cutting works |

---

## How to Continue This Work (Updated 2026-06-28)

1. **Read this file first** — it has the full picture
2. **Read `strategy_pivot_june26.md`** — the current strategy (focus > spread)
3. **Read `indiehackers_learnings.md`** — why we pivoted
4. **Daily routine (non-negotiable):**
   - 15 min: Answer 3-5 "what settings?" questions on YouTube/Reddit/Facebook (CNC Fiber Laser Ninja)
   - 15 min: Check DM replies, respond to Facebook lead-gen post comments
   - 15 min: DM new leads from comments
5. **This week priorities:**
   - Reddit post to r/diodelaser (June 28, story format — see `reddit_strategy.md` POST 5 REVISED)
   - Send DMs to 5 new targets from Round 2 commenters (see `outreach_6_lead_gen.md` PART 5)
   - Monitor Facebook lead-gen post for comments → DM each commenter
   - Enable Gemini billing (API key quota exhausted — see ai-suggest route)
   - Continue YouTube comments (2-3/day with real parameter data)
6. **Nate Keen status:** He tried the app, reported bugs (fixed), awaiting his next response. DO NOT MESSAGE — let him come back naturally.
7. **Key pending replies:** Chance Lawson, Alisha Pate (awaiting), Jessie Jones (follow up June 28 if no reply)
8. **Git setup:** Repo-local config at `/mnt/localssd/laser_log/cutlog`. Identity: hooman67, SSH key at `/mnt/localssd/laser_log/hs_personal_github_ssh_key`. Run `npx vitest run` before all commits.
9. **Supabase:** Project aobzsonuemamitlrakqs. Credentials in `/mnt/localssd/laser_log/supabase_creds.txt`. SQL changes via SQL Editor (paste), not direct DB connection.
10. **Deployment:** Push to main → Vercel auto-deploys. Production: https://cutlog-two.vercel.app
