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
