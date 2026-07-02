# CutLog — Competitive Web Research (Fresh, 2026)

**Date:** 2026-06-28
**Method:** Fresh web search (DuckDuckGo HTML, Bing, direct site fetches). App stores covered by a separate agent. Every claim below was verified by fetching the actual site where possible. Items I could not directly load are flagged **[low confidence]**.

> **HEADLINE: "Zero direct competition" is FALSE.** There are at least 8–12 live websites doing some or all of what CutLog does (community/aggregated laser settings databases, .clb export, source-labeled entries, vote-on-worked feedback loops, and — newly in 2025 — AI parameter recommendations). Several are larger than CutLog by entry count. At least three explicitly AI-powered settings tools launched in ~2025. The space is now **crowded at the hobbyist tier** and still **mostly open at the industrial fiber tier**.

---

## Category 1 — Direct competitors (community / cross-brand settings databases)

### CONFIRMED (fetched directly)

| Name | URL | What it does | Model | Traction / signals | Threat |
|---|---|---|---|---|---|
| **Machines for Makers — Laser Material Library** | machinesformakers.com/laser-material-library | Aggregated settings DB; filter by material/machine/power. CO2, diode, IR, RF, fiber MOPA, fiber, UV. | "Free forever," email-gated to see all results. Aggregated **manufacturer** data, **not** community, **not** AI ("13,000 data points from manufacturers beats starting from zero"). | **13,209 settings from 72 sources** (xTool, Epilog, Glowforge, Thunder, Boss + 60 more). Established maker brand (Brandon Cullum). Largest catalog found — **bigger than CutLog's ~5,800**. | **8/10** |
| **LaserCutSettings.com** | lasercutsettings.com | Community DB; **browse/download/upload LightBurn .clb files**, no login to import. CO2, fiber, Q-switch, diode, IR; 13 brands. | 100% free, account only to upload. "Your name on every download." Auto-parses uploaded .clb. | **115 machines · 260 settings · 13 brands.** Active: most recent entries "2mo ago," oldest shown "3mo ago." Small but **directly overlaps CutLog's .clb import/export + community DB combo.** | **8/10** |
| **Laser Settings Hub** | lasersettingshub.com | Community DB with **provenance/source badges** (supplier ref vs personal test vs community report), **vote-on-whether-it-worked**, machine-match comparison. | Freemium. Free: browse, publish 20, save 20. **Pro $5/mo** (unlimited + test-grid generator). **Team $19/mo** (shared libraries, branded pages, roles). | **245 machines · 19 materials · 367 settings.** Near-clone of CutLog's model (community DB + source labels + feedback loop) **plus a paid tier CutLog may not have.** | **9/10** |
| **LaserMark DB** | lasermarkdb.com | Community-verified DB; CO2/fiber/diode/UV, filter by make/model/wattage/lens. Before/after photos, discussion board, rep/founder badges. **Export to LightBurn, EZCAD, RDWorks.** | Explicitly free, anti-paywall: "No 'pro' tier that hides the good stuff." | Entry count not shown; positioned as forum-replacement. Multi-format export is a feature CutLog should match. | **7/10** |
| **lasertips.org** *(known player — re-verified)* | lasertips.org | Fiber/galvo/MOPA settings DB. Raycus/JPT/MAX/MOPA 20–200W, EM-SMART, Tykma. Metals, plastics, glass, stone, firearms. Hatch/power/speed/freq/pulse/lens + reference photos. | Free, moderated submissions ("New submissions must be approved"). | "Hundreds of entries." No public count/date. **Strongest free competitor for the industrial/galvo fiber niche CutLog targets.** | **8/10** |
| **Bonny Creations — Laser Settings Database** *(known — re-verified)* | bonnycreations.com/settings | Community DB; diode/CO2/fiber/UV. Filter by machine/material/operation. Community-rated. | Free, no account for most tools. Monetizes via SVG/jig/design-file shop. | **59+ machines, 118+ materials, "3,800+ Laser Settings."** Comparable scale to CutLog, attached to an established maker brand with audience. | **7/10** |
| **OMG Laser — settings page** *(known — re-verified)* | omglaser.com/laser-settings | Curated reference tables, not crowdsourced. Fiber 20–200W, galvo CO2 30–60W, UV 5–10W. Metals, stone, glass, leather, firearms. | Free reference. Community via a Facebook group ("Learn & Share"). | Curated, vendor-adjacent. Reference, not a wiki — lower direct overlap. | **5/10** |
| **PolygonLogix — Tech Table Builder** | polygonlogix.com/tools | **Industrial** fiber tech-table builder: nozzle, gas, speed, focus, pierce, power for stainless/aluminum/carbon steel, **3–8 kW**. CSV export. Has a fuller paid CAD/nest/quote workflow. | Free tool, no signup; paid full-workflow product behind it. | Aims at the **thick-metal industrial operator** — CutLog's hardest, highest-value segment. Closest competitor for that buyer. | **7/10** |

### LOW CONFIDENCE (appeared in search summaries; could not fully verify live content)
- **lasersettingshub** competitors that surfaced but I could only thinly load: **thelaserworkshop.com/community**, **lasereverything.net**, **reticle-red.com/laser-data**, **lasersettingsexchange.com**, **laserartcreator.com**, **lasermakerexchange.com**. Treat as unconfirmed leads — several may be thin/SEO/affiliate pages or AI-summary artifacts. Worth a manual pass. **[low confidence]**

---

## Category 2 — OEM digital tools (Trumpf / Bystronic / Amada / Han's / IPG)

- **Trumpf** (trumpf.com): markets "smart functions" and sensor tech (VisionLine OCT, melt travel monitor, image processing). These are **adaptive monitoring on Trumpf machines**, not cross-brand and not a shared parameter community. Active Speed Control exists in their line but is proprietary/closed.
- **Bystronic / Amada / Han's / IPG:** could not pull product-page detail through search proxies, but the established pattern holds: OEM parameter intelligence is **locked to the OEM's own machines and software** (TruTops, BySoft, AmadaVPSS). None offer cross-brand or community parameter sharing.
- **Implication:** OEMs are NOT direct competitors to CutLog's cross-brand, bring-your-own-machine model. They are a moat *for* CutLog (the multi-brand shop is exactly who OEM tools fail). **Threat 3/10**, but a long-term risk if an OEM opens a cross-brand cloud parameter service.

---

## Category 3 — CAM / nesting players that could add parameters

- **PolygonLogix** (above) already bundles parameters + nesting + quoting — the clearest example of a CAM-adjacent player moving into parameters. **Threat 7/10.**
- **SigmaNest, Lantek, ProNest (Hypertherm):** carry cutting tech tables/databases inside their CAM, but these are enterprise-licensed, machine/OEM-tied, and not community or AI-recommendation products. Adjacent, not direct. **[low confidence on 2025-26 AI roadmaps — not independently verified this session.]** **Threat 4/10.**
- **LightBurn:** ships a built-in **Material Library** (per-install, import/export of libraries) but, as of this research, **no official cloud/community shared library**. This is the gap CutLog and LaserCutSettings.com both exploit. If LightBurn ever launches an in-app community library, that is an extinction-level event for the hobbyist tier. **Threat 6/10 (latent, high if realized).**

---

## Category 4 — AI / process-optimization tools (the key 2025-2026 risk)

**This is where the landscape changed. Multiple AI settings tools launched ~2025:**

| Name | URL | What it does | Model | Threat |
|---|---|---|---|---|
| **LaserParams.com** | laserparams.com | **"Free AI-powered speed, power & pass recommendations for your laser."** CO2/diode/fiber; wood/acrylic/leather/general; targets xTool, OMTech, Sculpfun, Atomstack; references LightBurn/Inkscape/EZCAD2. Plus SVG templates, photo-to-vector, calculators. Active feedback ("I read every message"). | Free. Solo-builder vibe. | **Most direct AI competitor to CutLog's Gemini fallback.** Same core pitch ("get speed/power/passes in seconds"). Hobbyist-focused. | **9/10** |
| **The Laser Gurus** | thelasergurus.com | AI tool suite for lasers: Vector Studio (text-to-design), photo-to-lineart, ReliefMaker (fiber relief), **"Laser Chat" — curated AI assistant for laser equipment.** Supports Glowforge/xTool/LightBurn machines. | Freemium, **credit-based: $4.99/mo for 40 credits**, 5 free credits. | AI assistant overlaps CutLog's AI-fallback; broader design-tool play. Funded/polished enough to monetize. | **7/10** |
| **xTool AIMake** | (vendor) | xTool's AI generator for laser/CNC-ready files, launched **Nov 2025**. | Bundled with xTool ecosystem. | File generation more than parameters, but signals **OEMs are shipping AI into the maker stack** — parameter AI is a plausible next step. | **6/10** |

**Takeaway:** The "AI tells you the settings" pitch is no longer novel — at least one free tool (LaserParams) leads with it. CutLog's AI fallback is now **table stakes, not a differentiator**, at the hobbyist tier.

---

## Category 5 — GitHub / open-source

- **LaserParamsConverter** (github.com/shark92651/LaserParamsConverter): C# Windows tool, **converts** EZCAD2/EZCAD3/LightBurn libraries across wattages/lenses; CSV export. **47 stars, 10 forks, last release v1.1.3 = Nov 3, 2022 — effectively dormant.** A converter, not a database. **Threat 2/10**, but the wattage/lens conversion feature is worth borrowing.
- No other significant active open-source parameter **database** surfaced. The lack of a strong OSS community DB is part of CutLog's opportunity.

---

## Category 6 — Etsy / Gumroad / paid settings marketplaces

- Etsy blocks scraping (403/anti-bot), so exact sales/review counts couldn't be pulled this session. Confirmed via search summaries that **"Lightburn Laser Files" and "Laser Files Lightburn" are active Etsy marketplace categories**, and named sellers exist:
  - **Engrave and Cut Files** — diode (10/20/30W) + 2W IR libraries, "22 materials, dozens of settings."
  - **Myers Woodshop** — CO2 LightBurn libraries (Etsy).
  - **Thunder Laser USA** — free official material libraries.
  - **For Laser Cut** — 400k+ laser-cut design files (design files, not settings).
- **LaserSecrets** (named in the brief) did **not** appear in this session's searches — possibly renamed, dead, or low-rank. **[unverified this session]**
- **Read:** a real but **fragmented, low-ticket** market — people pay $5–$30 for static .lbset/.clb bundles. This validates willingness-to-pay but the product is a one-time file, inferior to a living, machine-learning database. **Threat 4/10** individually; collectively a sign of demand.

---

## Category 7 — YouTubers / educators selling settings or courses

- **Beam Squadron / Chance Lawson** (beamsquadron.com): fiber-laser **training platform** — video courses, "thousands of laser files," 30–200W fiber/UV/CO2, 1:1 consults, monthly subscription. Instagram @beamsquadron ~3,242 followers. Sells education + files, **not a parameter database**. Adjacent influencer competing for the same fiber-operator attention/wallet. **Threat 5/10.**
- Other educators (Victor Wolansky, Myers Woodshop, Laser Everything) monetize via courses/files/affiliate — same pattern: content & files, not a recommendation engine. **Threat 3–4/10**, but they own the audience CutLog must reach.

---

## Category 8 — New 2025-2026 entrants (the key risk)

- **Confirmed new AI entrants (~2025):** LaserParams.com, The Laser Gurus, xTool AIMake (Nov 2025) — see Category 4.
- **Laser Settings Hub** (Category 1) is a recent-feeling, fully-built clone of CutLog's exact model **with a paid tier** — the single most "this is literally us" find.
- Product Hunt search surfaced no dedicated laser-settings launch (only unrelated novelty items). Hacker News / indie-hacker presence appears thin — these tools are launching via maker YouTube/Reddit/Facebook, not the tech-launch circuit.
- Reddit verification was blocked by CAPTCHA this session; recommend a manual sweep of r/lasercutting, r/fiberlasers, r/Glowforge, r/xTool for tool mentions. **[unverified this session]**

---

## Bottom Line

**Is this still white space in 2026? Partially — and shrinking fast at the hobbyist end.**

- **Hobbyist/diode/CO2 tier = crowded.** Machines for Makers (13.2k aggregated settings), LaserCutSettings.com (.clb community), Laser Settings Hub (community DB + feedback loop + paid tiers), Bonny Creations (3.8k), plus free AI tools (LaserParams, Laser Gurus). CutLog has **no defensible edge here** — its AI fallback and community-DB model are already replicated, sometimes at larger scale.
- **Industrial thick-metal fiber + galvo fiber tier = still mostly open.** Only lasertips.org (galvo/MOPA, free, no ML) and PolygonLogix (industrial 3–8 kW tech tables, no community/ML) seriously play here. **This is CutLog's real white space and where it should plant its flag.**

**Most dangerous competitor: Laser Settings Hub** — it independently built CutLog's exact thesis (cross-brand community DB + source provenance + vote-on-worked feedback + freemium $5/$19 tiers). **Runner-up: Machines for Makers** (scale + audience) and **LaserParams.com** (commoditizes the AI pitch for free).

**Realistic moat for CutLog:**
1. **Per-machine learning** — a true ML loop that personalizes to *your* machine over time. None of the competitors do this; they serve static or community-averaged numbers. **This is the only genuinely defensible differentiator found.**
2. **Industrial fiber depth** (thick metal: gas type/pressure, nozzle, focus, pierce) — go where the hobbyist tools are weak and the buyers have budget.
3. **Bidirectional LightBurn .clb + EZCAD round-trip** as workflow lock-in (match LaserMark DB's multi-format export).
4. **Data network effect** from the 3-button feedback loop — but this only matters if CutLog out-collects rivals fast, because Machines for Makers (13k) and Laser Settings Hub already have a head start on the community-data flywheel.

**Strategic risk to watch:** LightBurn shipping an official in-app cloud/community library would gut the hobbyist tier overnight.

---

## ADDENDUM — InPulse Logic (inpulselogic.com) — added 2026-07-02

**Why added:** surfaced by a Facebook commenter on a CutLog lead-gen post ("Www.inpulselogic.com has parameters"). Never previously researched. This is our first look.
**Method:** direct WebFetch of the public site + r.jina.ai JS-render proxy for gated/SPA pages + Verisign RDAP for domain age. Search engines were blocked/unusable (Google 451/error, Bing junk, DuckDuckGo returned the unrelated `impulselogic.com` retail platform). **Product tools are login-gated**, so most technical/parameter detail could NOT be verified — flagged **[gated, unverified]** throughout. Confidence is HIGH on what the public marketing pages claim about themselves, LOW on actual DB contents/depth/traction.

### 1. What it is (VERIFIED — public pages)
A brand-new, very broad **"operating system for laser operators + discovery marketplace for customers hiring laser work."** Verbatim headline (`/features`): *"A complete operating system for laser operators and a discovery platform for customers hiring laser work."* Mission (`/about`): *"Build the operating system for laser professionals — one platform for parameters, compliance, quoting, scheduling, and business intelligence."*
It is **NOT primarily a parameter database.** Parameters ("OPTIMIZE") are **one of ~8 top-level modules**: SCAN (AI machine/fault identification), OPTIMIZE (parameters), QUOTE (estimating), SCHEDULE, COMPLY (safety/regs), CONNECT (marketplace), COMMUNITY (knowledge), LEARN (education). The sitemap lists **170 pages** (job board, RFQ/quote builder, fleet/IoT dashboard, weld compliance, chemical reference, defect atlas, seller hub, etc.) — an ERP/marketplace ambition, not a settings wiki.
Critically, it is **built for cleaning / welding / cutting** — verbatim *"Built for all three laser disciplines."* Its "cutting" is **industrial laser cutting alongside laser cleaning and laser welding**, not hobbyist CO2/diode engraving. **Engraving is not a headline discipline.**

### 2. Parameters offering ("has parameters") — [GATED, mostly UNVERIFIED]
The commenter's "has parameters" maps to the **OPTIMIZE** module + **Parameter Wizard** + **Machine & Fault Database** + a **Substrate/Material library**. Public copy references *"searchable industry knowledge," "material guides," "substrate library,"* discipline-specific safety logic, and an **"AI Laser Expert"** Q&A. **All actual parameter content sits behind a login** (`/optimize`, `/laser-parameter-library` (`/glpd`) both return a sign-in wall). Therefore: **cannot verify** what parameters, what machines/materials, entry count, sourcing (community vs AI vs curated), depth for fiber CUTTING (gas/pressure/nozzle/pierce/focus), any galvo/CO2 coverage, J/mm normalization, or **any export** (no LightBurn/.clb/EZCAD/RDWorks mention found anywhere public). Framing leans **AI-generated + curated ("AI Laser Expert," "Parameter Wizard")**, not a vote-on-worked community DB like Laser Settings Hub / LaserMarkDB.

### 3. Pricing / business model (PARTIALLY VERIFIED — tiers yes, dollars no)
Freemium SaaS, four tiers: **Starter / Operator / Pro / Enterprise.** `/pricing` shows a full feature matrix but **no dollar amounts** (prices are effectively gated). Verified matrix:
- **Starter:** 3 lifetime AI questions, 1 seat, no optimization tools. (Free entry; "no credit card, 3 free questions.")
- **Operator:** unlimited AI questions, **7-day free trial**, cleaning/welding/cutting optimization + Parameter Wizard + Machine & Fault DB + Quotes & scheduling, 1 seat.
- **Pro:** above + Marketplace profile, 3 seats.
- **Enterprise:** everything + Marketplace profile, 10 seats, **API & white-label.**
FAQ: "cancel anytime," annual billing ~20% savings for larger teams. **Business model = SaaS subscription + a two-sided operator/customer marketplace** (RFQ, seller hub) — broader monetization than CutLog.

### 4. Traction signals (VERIFIED — and they are WEAK)
- **Domain registered 2026-01-08** (Verisign RDAP; GoDaddy; last-changed same day; expires 2027-01-08). **~6 months old as of this research.**
- **COMMUNITY page renders empty**; no member/post counts anywhere.
- **No entry/settings counts, no reviews, no user numbers** on any public page.
- **No social presence found** (no verifiable Facebook/LinkedIn/YouTube; search engines blocked, so absence is suggestive not conclusive **[low confidence]**).
- Sitemap: 170 pages, uniform priority 0.8, **no lastmod**, identical boilerplate meta on every page — hallmarks of a **very new, largely templated/auto-generated site** where the real product lives behind auth. **Reads as pre-traction / early-launch, possibly one-person or small team; no founder/team/location disclosed.**

### 5. Segment overlap with CutLog
- **Discipline overlap: PARTIAL and skewed away from us.** It targets **industrial laser cutting + cleaning + welding.** It touches CutLog's PRIMARY (industrial fiber cutting) at the parameter layer, but its center of gravity is **cleaning/welding + shop-management/marketplace**, and it **ignores CutLog's galvo/MOPA engraving secondary and the hobbyist CO2/diode funnel.**
- **Model overlap: MODERATE but shallow-per-feature.** It replicates the *parameters* piece (AI wizard + material/machine DB) as 1 of 8 modules, but there is **no verified community vote-on-worked loop, no per-machine ML personalization, no .clb/multi-format export, and no mobile-first PWA angle.** It is going **wide (whole-shop OS + marketplace)** where CutLog goes **deep (parameters done well, mobile).**

### 6. Threat assessment (rubric: Model overlap / Traction / Defensibility / Buyer reach, each 0–3, /12)
| Dimension | Score | Rationale |
|---|---|---|
| **Model overlap** | 1 | Parameters are only 1 of ~8 modules; no verified community/feedback loop, no per-machine ML, no .clb export, not mobile-first. Overlaps our buyer's *need*, not our *product shape*. |
| **Traction** | 0 | Domain 6 months old; empty community; zero public counts/reviews/social; templated stub site. No demonstrable users. |
| **Defensibility** | 1 | Freemium SaaS + two-sided marketplace *could* create lock-in/network effects **if** it gets adoption — but nothing is spinning yet, prices are hidden, and the surface area is enormous for a tiny team to defend. |
| **Buyer reach** | 1 | Aims squarely at the industrial laser operator (good target) and was organically name-dropped by a real operator (a real signal) — but no evidence of any distribution engine, audience, or content. |
| **TOTAL** | **3 / 12** | |

**Verdict:** *An ambitious, 6-month-old "whole-shop OS + marketplace" for industrial laser cleaning/welding/cutting where parameters are just one gated module — broad but unproven, with no verifiable traction and no evidence it replicates CutLog's actual wedge (community feedback loop, per-machine ML, .clb round-trip, mobile-first). **Lowest-threat competitor profiled to date (3/12); watch, don't fear** — the only real signals are that it exists, targets our primary buyer, and got name-checked by an operator. Re-scan in ~6 months for traction or a public parameter DB.*

### 7. What to borrow / how to differentiate
- **Borrow / note:** (a) The **"operating system for laser operators" positioning** is a sharper articulation of the industrial buyer's real job-to-be-done than "settings tool" — worth stealing the *framing* even if we don't build the ERP. (b) **SCAN — AI machine/fault identification** and **"AI Laser Expert" Q&A** are natural adjacencies to a parameter tool. (c) The **two-sided marketplace** (customers hiring laser work) is a monetization path CutLog hasn't considered. (d) An operator organically recommended them in *our* lead-gen thread — evidence the industrial audience is actively hunting for exactly this, which validates CutLog's segment choice.
- **How CutLog out-executes:** (a) **Depth-over-breadth** — 170 shallow pages and an 8-module OS from a ~6-month solo-looking site is a mile wide and an inch deep; CutLog wins by making the ONE thing operators asked for (a trusted starting point → fewer test squares) actually excellent. (b) **Mobile-first PWA** — no mobile story here. (c) **The verified wedges they lack:** community vote-on-worked feedback, J/mm normalization for honest cross-wattage transfer, and **.clb / multi-format round-trip import-export.** (d) **They gate everything behind login** (parameters, prices, even the community) — CutLog can win trust by letting operators *see value before signing up*.

**Honesty caveats:** parameter contents, DB size, sourcing, export capability, and any traction beyond domain age are **UNVERIFIED (login-gated + search engines blocked)**. Scores reflect what is publicly provable today; if the gated OPTIMIZE module turns out to be a deep, community-fed, exportable industrial-cutting DB, Model-overlap could rise to 2 and Total to ~5. Recommend a logged-in walkthrough (free Starter tier) before any strategic reaction.
