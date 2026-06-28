# CutLog — Competitive App-Store & Marketplace Research (Fresh Scan)

**Date of research:** 2026-06-28
**Researcher note:** This is a from-scratch scan, ignoring any prior CutLog analysis. Findings are evidence-based and every claim is tied to a source URL. Where data could not be confirmed, it is flagged explicitly rather than guessed.

## Method & Limitations (read this first)

- Tooling available was **WebFetch only** (no native web-search tool). I drove searches through DuckDuckGo HTML/Lite, Bing, Ecosia, and Marginalia, plus direct fetches of `apps.apple.com`, `play.google.com`, AppBrain, APKCombo, and product websites.
- **App-store listings are JS-heavy and frequently truncate** when fetched as markdown. Apple App Store pages rendered reasonably well; **Google Play pages mostly returned only the header** (no install count / rating block). Third-party trackers (AppBrain, APKCombo, AppFigures) returned **HTTP 403** to the fetcher.
- After roughly a dozen queries, **DuckDuckGo began serving CAPTCHA pages** and Bing/Ecosia/Lite-DDG started returning **403**. So search-engine coverage tapered off late in the session. The competitor set below is solid, but it is **not provably exhaustive** — there may be additional low-visibility apps (especially Chinese-market apps that don't surface on Western search engines) that I could not reach.
- **Hard numeric traction data (exact install counts, review counts) was largely unavailable.** For most of these niche apps the stores themselves report "not enough ratings," which is itself a meaningful signal (see below). I have NOT invented numbers.

---

## The competitor landscape at a glance

The space is **more crowded than a "zero competition" framing would suggest**, but it is crowded with **web tools and very early/low-traction mobile apps**, not with an established, dominant mobile incumbent. The overlap clusters into four buckets:

1. **Cross-brand AI parameter generators** (the closest to CutLog's vision): **Laser Assistant**, **LaserParams**, BeraTech CNC's laser module.
2. **Community parameter databases** (CutLog's "shared DB + per-machine" pitch): **LaserMarkDB.com**, **LaserCutSettings.com**.
3. **Offline/database calculators** (no AI, no community): **BeamMate**, **Laser Calculations Tool**, plus many web calculators (Hymson, Porexo, etc.).
4. **Manufacturer hardware companion apps** (single-brand, tied to their own machines): xTool Creative Space / xTool Studio, Glowforge, ComMarker, OMTech.

The single most threatening entity is **Laser Assistant** (laserassistant.com), because it already advertises essentially CutLog's entire feature set: AI parameter generation + per-machine management + community/shared database + a feedback loop + LightBurn export, across fiber (MOPA & non-MOPA), CO2 (gantry & galvo), UV, and diode.

---

## Detailed competitor profiles

### 1. Laser Assistant — laserassistant.com (Blue Moose Designs, Anchorage AK, USA)

**THE strongest competitor. Threat level: 9/10.**

- **What it does / features (confirmed on their own site):** AI-powered laser-settings generator. Covers **Fiber (MOPA & non-MOPA), CO2 (gantry & galvo), UV precision, and diode/hobby** systems. Workflow: user adds machines via "Machine Management" (= **per-machine**), describes the job on a Dashboard, gets AI parameter recommendations with explanations, can customize, save to a **library**, and **export to laser software**. The system **accepts user feedback to improve future recommendations** (= feedback loop). Their features page explicitly lists: *AI parameter generation, per-machine management, community/shared database, feedback loop, LightBurn export, multi-material/multi-laser support.*
  - Sources: https://laserassistant.com (SPA — homepage title only) ; https://laserassistant.com/features (rendered the full feature list)
- **AI:** Yes — central to the product. Requires internet for generation; parameters exportable for offline use.
- **Community/shared DB:** **Yes** — listed as a feature ("Community/Shared Database"). This is the dangerous one: it directly contests CutLog's community moat.
- **Per-machine learning:** Per-machine management yes; whether it truly *learns* per machine vs. just stores machines is unconfirmed.
- **LightBurn/.clb:** "LightBurn export" advertised. Whether it produces actual `.clb` files vs. copy-paste values is **unconfirmed**.
- **Pricing:** Free "Hobby" plan = **10 AI generations/month, no credit card**. Paid subscription tiers above that, **14-day free trial, cancel anytime, 30-day money-back guarantee.** Exact paid-tier dollar amounts **could not be confirmed** — the pricing page is a JS SPA that returned only its title, and search engines were CAPTCHA-blocked before I could pull a cached copy.
  - Sources: https://laserassistant.com (DDG result captured testimonial + free-tier detail) ; https://laserassistant.com/pricing (SPA, not extractable)
- **Platform:** Web app; search results referenced iOS/Android apps too, but I **could not confirm live App Store / Play listings**. Treat "has mobile apps" as **unverified**.
- **Traction:** **No hard data found.** One testimonial on-site ("I used to spend 2-3 hours dialing in settings... now 30 seconds"). No install/review counts located.
- **CutLog better/worse:**
  - *Worse for CutLog:* Laser Assistant has already shipped the full triad (AI + community + per-machine + LightBurn) and is US-based/English-native. If real, CutLog's differentiation narrative ("nobody combines these") is **directly threatened**.
  - *Better for CutLog (potential):* Unknown traction and unconfirmed mobile/PWA presence — CutLog can win on execution, true PWA/mobile-first UX, genuine `.clb` round-tripping, and a verified-by-real-machines community model. CutLog's industrial **thick-metal fiber CUTTING** focus (gas, multiple passes, kerf) may be deeper than Laser Assistant's hobby-leaning framing.

### 2. BeraTech CNC — `com.beratech.cncassistant` (Mehmet Açıkgöz / "BeraProcure", Turkey)

**The app the brief flagged. Threat level: 4/10 — broad scope, near-zero traction.**

- **Platforms:** Android (Google Play) + iOS (App Store, id 6757587493). Also on APKPure, AppBrain, Softonic, apppage.net.
  - Sources: https://play.google.com/store/apps/details?id=com.beratech.cncassistant ; https://apps.apple.com/us/app/beratech-cnc/id6757587493
- **What it does:** AI assistant for *all* machining, not laser-specific: lathes, mills, **fiber lasers**, plasma. Features advertised: CNC AI chat, G-code support, **laser parameter optimization for material/thickness/gas**, technical-drawing analysis, a "50+ module tool center," a **community forum**, plus tangential stuff (metal pricing, salary comparison, industry news). Premium unlocks advanced AI, drawing analysis, "BeraCAM," sheet-metal unfolding.
- **AI:** Yes (chat + parameter). **Community:** a forum, yes. **Per-machine learning:** not evidenced. **LightBurn/.clb:** not mentioned — its laser angle is industrial cutting (gas/thickness), not LightBurn hobby workflows.
- **Pricing:** Free with IAP. **Premium $14.99/month**; a separate "BeraTech AI Pro" at **$4.99** (App-Store-managed). The $14.99/mo is steep for the apparent value.
- **Traction / recency:** **Both stores show "This app hasn't received enough ratings or reviews to display an overview."** No star rating, no review count. Latest version **1.0.27+5, dated ~June 20 (2026)** — so it is **actively maintained and very current**, but **commercially it has essentially no user base yet**. Install-count badge on Play could not be retrieved (page truncated; trackers 403'd).
  - Sources: https://apps.apple.com/us/app/beratech-cnc/id6757587493 (explicit "not enough ratings"; $14.99 / $4.99 prices; v1.0.27+5 dated Jun 20; category Business)
- **CutLog better/worse:** CutLog is **far more focused** (laser-only, recommendation-first, PWA). BeraTech is a sprawling "everything for machinists" app whose laser parameters are one of dozens of modules — generalist and unfocused. BeraTech's edge: it's bilingual-capable, already cross-platform, and a single motivated dev iterating fast. **It is current and alive but not a traction threat as of mid-2026.**

### 3. BeamMate — Laser Engraver App (Emil Deak; distributed via MWM)

**Polished niche calculator. Threat level: 5/10.**

- **Platform:** iOS (iPhone/iPad), id **6760578283**. Distributed/marketed via MWM.
  - Sources: https://apps.apple.com/us/app/beammate-laser-engraver-app/id6760578283 ; https://mwm.ai/apps/beammate-laser-engraver-app/6760578283
- **What it does:** Select laser model + material + operation → three rated presets (**Safe / Standard / Fast**) with power %, speed, passes, DPI. **Database of 137 verified machines and 95 materials.** Air-assist + focus-offset guidance, time estimate, **test-grid generator**, favorites, test log, share via social/messaging, safety/hazard warnings, **bilingual EN/DE**.
- **AI:** No — **pre-calculated database**, no AI. **Community DB:** No — curated, not community-sourced. **Per-machine learning:** No. **LightBurn:** "Compatible with LightBurn, LaserGRBL, xTool Creative Space" (compatibility, not confirmed `.clb` export).
- **Pricing:** Free w/ IAP — **$0.99/mo, $9.99/yr, $12.99 lifetime.** (Cheap; clearly hobbyist-priced.)
- **Traction / recency:** v1.0 **launched 2025-03-23**, last update **2025-06-14 (v1.2.1)** — i.e., **no update in ~12 months as of mid-2026; may be stalling.** Store shows **"not enough ratings."** No review/install counts found.
- **CutLog better/worse:** CutLog's intended **AI fallback + community DB + per-machine learning** all exceed BeamMate, which is a static lookup table with nice UX. BeamMate is better than CutLog *today* only in that it is **shipped, polished, and cheap**. Its lack of updates for a year is a vulnerability.

### 4. LaserMarkDB.com — community laser-settings database (web)

**Direct conceptual competitor to CutLog's community/per-machine pitch. Threat level: 6/10.**

- **What it is:** Free, community-driven DB. Settings tagged to **exact make/model/wattage/lens** (not generic). **Community verification system** — contributors test on their own machines and submit verification data; entries show **verification counts** (how many makers reproduced the result). Each entry: power, speed, frequency, passes, air assist, focus offset, software compatibility, **before/after photos**. **Exports to LightBurn, EZCAD, and RDWorks.** Covers CO2, fiber, diode, UV. Founder badges + reputation scores; discussion boards.
  - Source: https://lasermarkdb.com
- **AI:** Not mentioned. **Community DB:** Yes — this *is* the product, and the verification-count mechanic is essentially CutLog's "verified by real machines" idea. **Mobile app:** None mentioned (web only).
- **Pricing:** **Free forever**, no card, no paywall (per their own copy).
- **Traction:** Unknown; positioned as **early** ("founder badges," "early members") → likely pre-scale, but the data model is sophisticated and squarely in CutLog's lane, including **EZCAD/RDWorks export for the fiber/galvo marking crowd.**
- **CutLog better/worse:** CutLog can win with **AI fallback** (LaserMarkDB has none) and a true **mobile/PWA** experience. But LaserMarkDB has **already designed the exact community-verification + per-machine + multi-software-export model** CutLog plans, and it's free. This undercuts "no one is building the community DB."

### 5. LaserCutSettings.com — community .clb database (web)

**Direct competitor on the LightBurn/.clb community angle. Threat level: 6/10.**

- **What it is:** "Free, community-driven database of laser cutter and engraver settings." **Browse, download, and share LightBurn `.clb` files.** Stated scale: **115 machines across 13 brands, 260 total settings** (e.g., OMTech 20, Monport 12, Boss Laser 9). Covers CO2, Fiber, Q-Switch, Diode, IR Diode. Upload a `.clb` or enter manually with **automatic parsing of LightBurn settings**; uploader attribution ("your name on every download"). Browse by brand → wattage → material.
  - Source: https://lasercutsettings.com
- **AI:** None. **Community DB:** Yes. **Ratings/feedback:** None mentioned. **`.clb` integration:** **Yes — explicitly the core feature** (this is exactly CutLog's claimed `.clb` differentiator). **Mobile app:** None.
- **Pricing:** **Free.** No login to download; account only to upload.
- **Traction:** ~260 settings / 115 machines = **modest but real content already live.** Unknown user counts.
- **CutLog better/worse:** CutLog can win via AI, ratings/feedback, per-machine learning, and mobile/PWA. But the **`.clb` community-sharing-with-auto-parse feature already exists and is free** — CutLog's `.clb` story is **not unique**.

### 6. LaserParams.com — free AI settings calculator (web)

**Threat level: 5/10 (free + AI + brand coverage, but web-only, no community/per-machine).**

- **What it is:** Free online tool generating **speed/power/pass recommendations for 15+ materials in seconds**, supporting **xTool, OMTech, Sculpfun, Atomstack**; compatible with LightBurn & GRBL. Extra calculators: engraving time, kerf width, power/speed conversion.
  - Source: https://laserparams.com (via search result)
- **AI:** Yes (AI-generated per inputs). **Community DB:** Not detailed. **Per-machine:** No. **Mobile app:** None (web). **Pricing:** **Completely free, no premium tier indicated.**
- **CutLog better/worse:** CutLog adds community, per-machine, feedback, mobile/PWA, and fiber-cutting depth. But a **free AI calculator** is a price-anchor problem for any CutLog subscription targeting hobbyists.

### 7. "Laser Calculations Tool" / Laser Calculator — `com.laser_calculator` (Android)

**Threat level: 2/10 — generic engineering calculator.**

- **What it is:** Android app for CO2 / fiber / diode: estimates cutting speed, power, beam diameter, engraving time ("real-time calculations… beam diameter to cutting power"). Version ~1.0422. On Play + APKPure/APKgk.
  - Source: https://play.google.com/store/apps/details?id=com.laser_calculator (page truncated; details from search snippet)
- **AI:** No. **Community:** No. **Per-machine:** No. **LightBurn:** No. **Pricing/traction:** Not retrievable (page truncated, trackers 403'd).
- **CutLog better/worse:** Not a recommender — it's a physics/engineering calculator. CutLog is categorically different and superior for the recommendation use case.

### 8. Misc web tools (not apps, but compete for the same intent / SEO)

- **Hymson Laser** — "45+ free calculators." **Porexo / Simulations4All** — web calculators. **LightBurn's own built-in test-pattern / material-test generator** (desktop). **xTool Creative Space** auto test arrays. **LaserGRBL** test grids. **Mactrontech** MOPA parameter library (web). **OMTech Help Center** (help.omtech.com) material settings. **ComMarker Resources** (commarkerus.com) tested parameters.
  - Sources: search results citing hymson, porexo, simulations4all, mactrontech.net, help.omtech.com, commarkerus.com
- **Relevance:** These are SEO/intent competitors and "good enough" free references that reduce willingness-to-pay, but none is a per-machine community DB or mobile recommender.

---

## Are the big laser brands shipping their own parameter/settings apps?

**Confirmed: brands ship companion apps, but they are single-brand hardware-control apps, not cross-brand parameter recommenders.** This is an important nuance — they don't compete with CutLog's cross-brand recommendation/community model, but they DO own the material-settings experience for *their own* customers.

- **xTool** — **xTool Creative Space** (Play `com.makeblock.xcs`, also iOS), now succeeded by **xTool Studio**. Design + editing + machine control, "snap & process on the go," auto test arrays. The original `com.makeblock.xcs` Play page returned **404** when fetched (likely delisted/superseded by Studio); an AppBrain snippet cited **~4.2★ from ~1,300 ratings, on Play since May 2023, last updated Oct 2023** for the old XCS app — i.e., the old app is being retired in favor of Studio.
  - Sources: https://play.google.com/store/apps/details?id=com.makeblock.xcs (404) ; AppBrain snippet
- **Glowforge** — **Glowforge app** (web + mobile). Famous for **Proofgrade auto-settings** (scan material barcode → settings applied automatically) — a closed, single-brand "magic settings" model. Confirmed the app exists; could not deep-fetch features this session.
- **ComMarker** — **ComMarker app** for Gen-X machines (Omni X / Omni XE / COX), control + creation; separate web "Resources" page with tested settings. Source: https://commarker.com/download-center
- **OMTech** — Software downloads + Help Center material settings (help.omtech.com); **no clearly confirmed dedicated parameter-library mobile app** found this session.
- **OMG Laser, Atomstack, Sculpfun, Creality (Falcon), Two Trees, Bambu Lab** — **No parameter/settings apps confirmed.** I could not verify any of these ship a settings-library mobile app (searches were blocked before confirmation). **Flagged as unconfirmed**, not "no."

**Takeaway on brands:** The threat from brands is *indirect*. They lock their own customers into branded material libraries (Glowforge Proofgrade being the strongest), which removes those users from CutLog's TAM. But **no brand offers a cross-brand, community, AI recommender** — that white space is real.

---

## Threat-level summary table

| App / Site | Platform | AI | Community DB | Per-machine | LightBurn/.clb | Pricing | Traction signal | Threat |
|---|---|---|---|---|---|---|---|---|
| **Laser Assistant** | Web (mobile unconfirmed) | Yes | **Yes** | Yes (mgmt) | "LightBurn export" | Free 10 gens/mo + paid (amounts unconfirmed) | Unknown; testimonials only | **9** |
| **LaserMarkDB.com** | Web | No | **Yes (verified)** | Yes (exact model) | LightBurn+EZCAD+RDWorks export | Free forever | Early/pre-scale | **6** |
| **LaserCutSettings.com** | Web | No | **Yes** | By brand/wattage | **.clb share+parse** | Free | ~260 settings live | **6** |
| **BeamMate** | iOS | No | No (137 curated machines) | No | Compatible | $0.99/mo, $9.99/yr, $12.99 lifetime | "Not enough ratings"; no update ~12mo | **5** |
| **LaserParams.com** | Web | Yes | No | No | Compatible | Free | Unknown | **5** |
| **BeraTech CNC** | iOS+Android | Yes | Forum | No | No | Free + $14.99/mo, $4.99 AI | **"Not enough ratings"** both stores; v1.0.27 Jun 2026 (current) | **4** |
| Laser Calculations Tool | Android | No | No | No | No | Unknown | Unknown | **2** |
| Brand apps (xTool/Glowforge/ComMarker) | iOS+Android | Varies | Single-brand only | Brand machines | Brand SW | Free w/ HW | Established (xTool ~1.3k ratings) | **3** (indirect) |

---

## Things that contradict "no one is doing this"

Be honest internally: several claims a CutLog pitch might make are **already contradicted** by shipped products:

1. **"No one combines AI + community + per-machine + LightBurn."** → **Laser Assistant advertises exactly this combination.** (Strongest contradiction.)
2. **"No community database of laser settings exists."** → **LaserMarkDB and LaserCutSettings both exist, are free, and use per-machine + verification + multi-software export.**
3. **"Sharing `.clb` files in a community is novel."** → **LaserCutSettings already does `.clb` upload/parse/share with attribution.**
4. **"AI parameter recommendation is unbuilt."** → **LaserParams (free), Laser Assistant, and BeraTech all ship AI recommendations.**
5. **"Fiber/galvo/MOPA marking is underserved."** → Partially true for *apps*, but **LaserMarkDB (EZCAD/RDWorks export, frequency/passes) and Mactrontech's MOPA library** already serve marking.

**What genuinely IS still open (CutLog's real white space):**
- A **mobile-first / true-PWA** experience — most real competitors are **web-only** (Laser Assistant, LaserParams, LaserMarkDB, LaserCutSettings). Mobile apps that exist (BeamMate, BeraTech) are either static or unfocused.
- **The full stack done well in one product with real traction.** Every competitor is missing at least one leg (community, OR AI, OR per-machine, OR mobile) — and **none has demonstrable traction** (the recurring "not enough ratings" is the tell).
- **Industrial thick-metal fiber CUTTING** depth (gas type/pressure, nozzle, multi-pass, kerf) — most rivals lean hobby engraving.

---

## Bottom Line

**How crowded is the app-store space?** Moderately crowded in *concept*, thinly populated in *traction*. There is **no dominant incumbent app**. The genuine mobile apps (BeraTech CNC, BeamMate, Laser Calculations Tool) all show **"not enough ratings"** on the stores and/or have **stalled updates** — i.e., shipped but commercially unproven. The real activity is in **free web tools** (Laser Assistant, LaserParams, LaserMarkDB, LaserCutSettings), not native apps. Manufacturer apps (Glowforge/xTool/ComMarker) are **single-brand control apps**, not cross-brand recommenders, so they don't occupy CutLog's lane directly (though Glowforge Proofgrade locks its users in).

**Strongest competitor:** **Laser Assistant (laserassistant.com)** — it already markets CutLog's entire feature stack (AI + per-machine + community DB + feedback loop + LightBurn export across fiber/CO2/galvo/UV/diode). Runners-up are the two free community databases (**LaserMarkDB**, **LaserCutSettings**), which contest the community/`.clb` differentiator.

**Does the "zero competition" claim hold up?** **No — not literally.** Multiple products already do pieces of CutLog, and at least one (Laser Assistant) claims to do nearly all of it. **However**, "zero *proven, mobile-first* competition" largely holds: no rival shows real traction, almost all are web-only, and none has clearly nailed the full stack as a polished PWA with an industrial-cutting depth. CutLog's opportunity is **execution and traction, not invention** — and the marketing must avoid the easily-falsified "nobody is doing this" claim.

### Confidence & gaps
- **High confidence:** existence and feature scope of Laser Assistant, BeraTech CNC, BeamMate, LaserMarkDB, LaserCutSettings, LaserParams; BeraTech/BeamMate "not enough ratings"; BeraTech pricing/recency.
- **Could not confirm (flagged):** exact install counts for any app; Laser Assistant's paid-tier prices and whether it has live iOS/Android apps; whether any "LightBurn export" produces true `.clb`; whether Atomstack/Sculpfun/Creality/Two Trees/Bambu/OMG ship settings apps. Search engines (DDG/Bing/Ecosia) were CAPTCHA/403-blocked late in the session and app-analytics trackers returned 403, so a follow-up pass with a search API or a residential-IP fetcher is recommended to close these gaps.
