# CutLog — Marketing Cheat Sheet (1-Pager)

**Keep this open while doing outreach.** Honest "starting point" voice. Industrial fiber cutting primary. App: https://cutlog-two.vercel.app

---

## POSITIONING

**One-liner:** *The fastest way to a trusted starting point for any material — so you run fewer test squares.*

**10-second pitch:** "You know how every new material means burning a sheet on test cuts? CutLog gives you a verified starting point from operators on machines like yours, scaled to your wattage, so your first test is close instead of blind. It's not magic — you still run a test. It just makes that test short."

**The honest value prop:** A *better starting point*, not a magic per-machine number. Settings collapse a blank-slate guess into a small, targeted test grid. We do NOT claim plug-and-play. We say it out loud: *every machine is different, so always run a material test* — we just get you to the right neighborhood first.

---

## FEATURES (grouped by benefit — say the "why it matters" line)

**Get to a starting point fast**
- 5,800+ verified settings across 562 materials → *"Someone with a setup like yours probably already tested this."*
- Per-machine matching (laser type, wattage, similar machine) → *"You get results weighted to YOUR setup, not a stranger's."*
- AI fallback (Gemini) when no data exists → *"Even oddball materials get a conservative physics-based starting point, clearly labeled unverified."*

**Settings that actually transfer (the real wedge)**
- **J/mm energy normalization** *(new/imminent)* → *"LightBurn's % power doesn't transfer between a 60W and a 100W — energy/length does. We normalize so a 4kW setting honestly scales to your 6kW."*
- **One-click LightBurn material-test generator** *(new/imminent)* → *"We hand you the exact test grid to confirm the starting point — the workflow you already trust, pre-loaded."*

**Fits your existing workflow — no re-typing**
- `.clb` import → *"Pull your scattered LightBurn settings into one searchable place. Personal organizer first, community second."*
- **Bulletproof galvo .clb / CSV import** *(new/imminent)* → *"Galvo formats finally import clean — the thing that broke for power users is fixed."*
- **Multi-format export: EZCAD / RDWorks / CSV + .clb** *(new/imminent)* → *"Push settings straight into your controller, whatever you run."*

**Trust what you're looking at**
- **Verification-count + provenance badges** *(new/imminent)* → *"See how many operators confirmed a setting and where it came from. Tested-by-human vs AI-calculated is always obvious."*
- 4-tier source labels (Your Data / Community / AI Baseline / AI Suggestion) → *"You always know if a human ran it or a machine guessed it."*

**Gets better with one tap**
- "Too Slow / Perfect / Too Fast" feedback → *"One tap after a cut — no logging chore — and your next recommendation adjusts for your machine."*
- Per-machine learning + multi-machine support → *"Register every machine in the shop; each learns its own quirks."*

**Built for the work**
- Galvo mode (hides gas/nozzle clutter, shows line interval + Q-pulse) → *"Engraving fields only — no cutting noise."*
- Mobile-first PWA → *"Add to home screen, use it at the machine. Every competitor is web-only on a desktop."*
- SEO settings pages *(being built)* → *"Find 'best settings for 12mm mild steel on a 6kW' from a Google search."*

---

## TARGET SEGMENTS

| Tier | Segment | Specific pain |
|---|---|---|
| **PRIMARY** | Industrial/semi-industrial fiber **cutting** (2–12kW; mild/stainless/HRPO; 6–25mm) | Supplier swaps alloy (S235→S355) and the old settings fail mid-sheet; $180+ per ruined plate; pierce/gas/focus/dross on thick metal; their own settings scattered across notebooks, whiteboards, 40 text files |
| **SECONDARY** | Galvo / MOPA fiber **engraving** (tumblers, coins, cards) | Line interval, Q-pulse, frequency, focus "all in my head"; want a clean galvo UI and their .clb library organized — NOT gas/nozzle fields |
| **TERTIARY** | Hobbyist CO2 / diode | Burning material on test grids; no OEM support; cheap consumables = low pain, low conversion. Funnel/brand asset, not a profit center |

---

## TOP 5 OBJECTIONS + HONEST REBUTTALS

1. **"Every machine is different — you can't use someone else's settings."** → *"100% agree, and that's the point. It's a starting point, not a final number — it gets you to a short test instead of a blind one. You still read your own cut."*
2. **"There's no substitute for a material test."** → *"Right, and we don't replace it — we hand you the LightBurn test grid and a tighter range to run, so you test 5 increments instead of 15."*
3. **"My OEM gave me a library / I use WhatsApp support."** → *"Great for the materials they covered. CutLog is for the off-list material at 9pm when support is asleep, and for when you switch suppliers."*
4. **"Why is it free / what's the catch?"** → *"Built it because I needed it. No paywall today. If hosting gets expensive I might add a donate button — that's it."*
5. **"LightBurn already stores my settings."** → *"And we import that .clb so you don't lose it. We add a starting point for materials you *haven't* tested yet and make the whole library searchable."*

---

## PROOF POINTS / CREDIBILITY

- **5,800+ verified settings, 562 materials** — hobby diode up to 25mm carbon and 316L on 12kW.
- **87% accuracy** benchmarked against purchased expert Etsy parameter files (60% within 5%).
- **`.clb` import/export** — speaks LightBurn's native format, the ecosystem everyone already uses.
- **Real operator validation** — Nate Keen (galvo, 20K YT/225K TikTok): *"even getting people in the ballpark for material testing, that's 90% there!"*; Tinker Withit: *"it's usually just about speed at that point."*
- **Verification counts + provenance** — you can see who confirmed a setting, not just trust a number.

---

## WHAT NOT TO SAY

- ❌ "Nobody else is doing this" / "zero competition." (Trivially false — LaserMarkDB, Machines for Makers, etc. exist. It burns credibility instantly with technical operators.)
- ❌ Over-sell the AI. AI is **table stakes**, not the differentiator. Don't pitch "AI learns your machine's drift and gives you THE number" — the physics and operators don't back it.
- ❌ Don't ask people to "log your cuts" before they've gotten value. Value first, then a one-tap "did this work?"
- ❌ Don't promise plug-and-play / "never test again." Always pair with "run a material test."
- ❌ Don't lead with "browse our database." Lead with "here's the answer to YOUR specific material."

---

## DIFFERENTIATORS vs NAMED COMPETITORS (honest, specific)

- **vs Machines for Makers** (13k+ settings, big maker audience, free): They aggregate *manufacturer* charts; we have *operator-verified* community data + per-machine matching + .clb workflow + mobile. They own SEO — we win on depth + workflow, not catalog size.
- **vs Laser Settings Hub** (~same model + paid $5/$19): Architecturally similar but tiny (~367 settings) with no provable traction. We have 15x the data and a real .clb/export pipeline.
- **vs LaserMarkDB** (free, per-machine, verified, EZCAD/RDWorks export, anti-paywall): Strong on galvo/marking. We match their multi-format export and add J/mm transfer + cutting depth + mobile PWA.
- **vs LaserParams.com** (free AI recommendations): Commoditizes the AI-only pitch at $0 — which is exactly why we don't lead with AI. We lead with verified data + J/mm + workflow.
- **vs BeraTech CNC** ($14.99/mo, broad CNC tool, "not enough ratings"): Broad and unproven. We're deep in laser, free, with .clb integration and real operator feedback.
- **vs LightBurn Material Library** (the incumbent workflow): We *complement* it — import the .clb, generate the test, fill the gaps. Never position as a replacement.

---

## LINKS / CTAs

- **App:** https://cutlog-two.vercel.app
- **Primary CTA (DM/comment):** *"Want me to send what it recommends for your wattage? Takes 30 sec to try."*
- **Soft CTA (forum/skeptic):** *"It's a free starting-point tool — search a material you know well and tell me if it's even in the ballpark."*
- **Follow-up (after they try):** *"Did that work — too fast, perfect, or too slow?"*
