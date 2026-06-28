# CutLog — Competitor Product Audit (Feature Teardown → Ideas to Steal)

**Date:** 2026-06-28
**Author:** Product-strategy teardown (Opus 4.8). Builds on the prior fresh research in this folder — does NOT re-do it.
**Lens:** Mine competitors for COPYABLE product/UX patterns, not threats. Every recommendation is filtered through CutLog's honest positioning: *"the fastest way to a trusted starting point so you run fewer test squares"* — NOT an AI per-machine oracle. Industrial-cutting + galvo/MOPA depth is the wedge.

**Sources fetched live this session** (in addition to the four prior reports):
- LaserMarkDB.com — verification/provenance UX, badges, fields, Q&A, multi-format export
- LaserSettingsHub.com — provenance badge taxonomy, vote-on-worked, machine-match, freemium tiers
- MachinesForMakers.com/laser-material-library — aggregation framing, source attribution, email-gating, filtering
- BeamMate (mwm.ai listing) — Safe/Standard/Fast preset framing, test-grid generator
- Glowforge.com/proofgrade — Proofgrade auto-settings ("digitally encoded" material recognition)
- xTool software page (partial) + prior-report confirmation of Creative Space auto test arrays

> Cross-reference: the four prior reports (`00_SYNTHESIS_AND_VERDICT.md`, `competitive_web.md`, `competitive_app_stores.md`, `competitor_verification.md`) remain the source of truth on traction, threat scores, and pricing. This file is purely the "what to build" layer on top.

---

## 1. LaserMarkDB.com — the verification + provenance gold standard

**What they do (verbatim / near-verbatim from the live site):**

- **Per-machine granularity.** Settings are tagged to **make, model, wattage, and lens** — "not just 'CO2 60W'." Covers CO2, Fiber, Diode, UV.
- **Verification-count mechanic.** Each entry carries a **"Verified ×[N]"** badge (the live featured stainless entry showed **"Fiber Mark Verified ×14"**). Other makers reproduce the setting *on their own machine* and confirm it; the count is how many independent makers got the result. This is the single most trust-building mechanic in the whole competitive set — it converts "some stranger's number" into "14 people reproduced this."
- **Before/after result photos** attached to the exact machine+material combo (and "the actual photo of the outcome" stored with the setting fields).
- **Entry fields:** power, speed, frequency, passes, air assist, focus offset, software, material thickness, operation type, fill density, machine/material linkage, plus the outcome photo.
- **Reputation & provenance UX:**
  - **Founder badge** ("Founder badge on your profile") for early members.
  - **Reputation** that "follow[s] them as the platform grows."
  - **Community Q&A** ("Real questions. Maker-tested answers") — a discussion layer that replaces the scattered Facebook-group Q&A.
- **Multi-format export:** **LightBurn / EZCAD / RDWorks export notes** per entry — covers the CO2 hobby crowd (LightBurn), the galvo/fiber-marking crowd (EZCAD), and the legacy CO2 crowd (RDWorks).
- **Positioning:** "No plans. No paywalls. No 'pro' tier that hides the good stuff. Every feature, every setting, free forever for makers."

**Why it builds trust:** Replication count is the closest thing to a scientific peer-review signal a settings DB can have. It maps perfectly onto CutLog's honest "run a test" message — it doesn't claim the number is right, it shows *how many people independently confirmed it works on the same hardware.*

**How CutLog ships a BETTER version:**
- Adopt verification-count, but **gate it to verified machine identity** (parsed from an imported .clb / EZCAD file or a confirmed machine profile), so "Verified ×N" means "N confirmations from the *same model/wattage/lens*," not N anonymous thumbs-ups. Show the count *broken down by exact machine match* vs. *similar machine*.
- Beat them on the one thing they lack: **J/mm normalization** so a "Verified ×14" entry on a 30W also displays a transferred starting point for a 50W of the same family (clearly labeled "scaled estimate, unverified at 50W"). No competitor does honest cross-wattage transfer.
- Match their multi-format export (EZCAD/RDWorks, not just .clb) — this is table stakes for the marking niche CutLog wants.

---

## 2. Laser Settings Hub — the provenance taxonomy + freemium split

**Provenance badge taxonomy (exact labels, live):** three source labels shown as **"Provenance badges on every entry"**:
1. **"Supplier reference"** — manufacturer guidance / spec-sheet derived.
2. **"Personal test"** — one individual validated it on their own machine.
3. **"Community report"** — aggregated collective maker feedback.

**Vote-on-whether-it-worked (live):** three-outcome vote, not a binary —
- **"worked"**, **"needed adjustment"**, **"was off entirely."**
- Each entry shows a **"vote breakdown"**; the library can sort by **"Most Community-Confirmed."**

**Machine-match comparison (live):** the detail page shows a **"machine comparison summary"** — the poster's laser type / wattage / brand vs. the *viewer's* setup, so you instantly see how far the setting is from your machine. Pro adds **"side-by-side material comparison (up to 4)."**

**Freemium split (verbatim, matches the verification report exactly):**

| Tier | Price | Features |
|---|---|---|
| **Free** | $0 | Full public library access; **publish ≤20** settings; **≤20 private materials**; **≤10 bookmarks**; **.clb export**; standard support |
| **Pro** | **$5/mo** ($49/yr) | **Verified contributor badge**; unlimited publishing; unlimited private materials/bookmarks/saved searches; **side-by-side comparison (≤4)**; **test-grid generator**; priority support |
| **Team** | **$19/mo** ($189/yr) | Everything in Pro + **branded team page**; **shared private library**; **roles & permissions**; **audit trail**; admin dashboard; **3 seats** (+$5/extra user) |

**Why it builds trust/engagement:** The 3-outcome vote ("needed adjustment" is the killer middle option) is far more honest and useful than a star rating — it tells you the *direction of error*, which is exactly the "ballpark, then dial in" mental model CutLog's operators described. The provenance taxonomy lets a user weight a "supplier reference" differently from a "personal test."

**How CutLog ships a BETTER version:**
- Adopt the **3-outcome vote verbatim** ("worked / needed adjustment / was off") — it's better than LaserMarkDB's binary verify, and it directly produces the "fewer test squares" data CutLog needs. Combine the two: a "worked" vote *is* a verification, so it increments the verification count AND feeds the breakdown.
- Adopt the **machine-comparison summary** — but make it the centerpiece (CutLog's per-machine story lives here). Show an explicit **"match score"** (exact model / same family / different family / wattage-scaled).
- The **freemium split is the proven price ladder for this exact market** — Free / $5 Pro (test-grid + unlimited + badge) / $19 Team (shared libraries + branded + roles). CutLog should adopt this structure rather than reinvent it. The **Team tier is the only path to industrial WTP** — shared shop libraries + roles + audit trail is what a fab shop with multiple operators actually pays for.

---

## 3. Machines for Makers — the aggregation cold-start playbook

**Aggregation framing (verbatim, live):**
- Hero: **"13,209 settings from 72 sources. Find your starting point in seconds."**
- The honesty hook (this is *the* line to study): **"These aren't magic numbers — every laser varies. But 13,000 data points from manufacturers beats starting from zero."**

**Source attribution (live):** each setting sample shows the **manufacturer source as a label** — the same material/operation (e.g. "Acrylic 3mm — Cut") appears multiple times with **"Epilog," "xTool," "Thunder"** as distinct source tags side by side. The user sees competing manufacturer numbers for the same job and picks.

**Email-gating (live):**
- Before email: you see **3 sample settings** + a teaser count ("Showing 47 matching settings").
- Gate: **"Create free account to see all results."**
- After email: full result set.

**Filtering UX (live):** Machine (dropdown, e.g. "My 50W CO2"), Material, Operation (Cut/Engrave), with **"Auto-matched to your machine specs"**; laser-type facets: Diode, CO2 Glass, IR, CO2 RF, Fiber MOPA, Fiber, UV. **No per-setting confidence/quality indicator** — the only caveat is the global "every laser varies" disclaimer.

**Why it works:** It solves the cold-start problem by *seeding with manufacturer data* instead of waiting for a community — and frames that limitation honestly ("beats starting from zero"). The side-by-side multi-source view is genuinely useful and disarms the "whose number is right?" objection.

**How CutLog ships a BETTER version:**
- **Steal the cold-start move:** seed the DB by ingesting published manufacturer/OEM material tables (xTool, Epilog, Thunder, OMTech, plus fiber/galvo sources like lasertips.org-style references), each clearly tagged **"Supplier reference"** (ties into the provenance taxonomy above). This removes the empty-database problem that kills these tools — but layer CutLog's verification count *on top* so manufacturer entries get promoted to "community-verified" as makers confirm them. **This is the synthesis MachinesForMakers can't do (they have no community layer) and LaserMarkDB can't do (they have no manufacturer seed).**
- **Steal the honesty line.** "13,000 data points beats starting from zero" is the *exact* tone CutLog's repositioning needs. CutLog's version: *"Not magic numbers — a verified starting point so you run one test grid instead of ten."*
- **Soften the email gate.** MachinesForMakers hard-gates all results behind email — copy the "show 3 + tease the count" pattern for SEO/conversion, but let CutLog users browse more before the wall (the harder gate is a trust cost with skeptical industrial operators; see "do NOT copy").
- Add the per-setting confidence indicator they lack (verification count + provenance badge) — this is CutLog's edge over the largest catalog.

---

## 4. Secondary references — preset framing & auto-settings

### BeamMate — Safe / Standard / Fast preset triad
Each laser+material+operation returns **three rated presets: "Safe, Standard and Fast"**, each showing power% (scaled to wattage), speed, passes, line interval/DPI, air-assist rec, focus-offset guidance. "Smart safety validation — power never exceeds 100%." Plus a **"systematic power × speed variation grid"** test-grid generator and 137 curated machines / 95 materials.

**Pattern to steal:** The **Safe / Standard / Fast triad** is an excellent UX for presenting a *range* rather than a false-precision single number — which perfectly matches CutLog's "ballpark, then dial in" honesty. Industrial framing: rename to **"Conservative / Recommended / Aggressive"** (cut quality vs. throughput tradeoff resonates more with a fab shop than "Safe/Fast"). Pair each preset with the test-grid that brackets it.

### Glowforge Proofgrade — auto-settings via encoded material
Proofgrade materials are **"digitally encoded"** (a printed QR-style code on each sheet); the machine **"instantly recognized"** the material and **"automatically applies the optimal print settings"** ("lab-tested print settings... perfect prints every time"). Closed, single-brand, material-locked.

**Pattern to steal (carefully):** The *zero-friction* idea — point at a material, get the setting — is the aspirational UX. CutLog's cross-brand, honest equivalent: a **one-tap "find my starting point"** from a saved machine profile + material pick (no encoded sticker, no lock-in). Do NOT copy the closed material-lock-in model (see "do NOT copy").

### xTool EasySet / Creative Space — curated auto test arrays
xTool curates per-material recommended settings inside Creative Space with one-click apply and **auto test arrays** (prior report, `competitive_app_stores.md`). Single-brand curation.

**Pattern to steal:** **One-click test-array generation** from inside the parameter view — the user shouldn't have to hand-build a power×speed grid. CutLog should generate the LightBurn/EZCAD test grid file directly, bracketed around the recommended starting point.

---

## 5. SYNTHESIS — Prioritized "ADOPT" backlog (steal-and-improve)

Ranked by impact × alignment with the honest "starting point / fewer test squares" positioning. Effort S/M/L.

| # | Feature | Effort | Impact | Why (and why it's *better* than the competitor's) |
|---|---|---|---|---|
| **1** | **Verification-count mechanic** ("Verified ×N", gated to *matched machine identity*) | **M** | **Very high** | LaserMarkDB's strongest trust signal. CutLog's edge: tie the count to *parsed machine identity* + show exact-match vs. similar-match breakdown. This is the core trust currency and directly informs the provenance UX the coding agent is building (see §6). |
| **2** | **3-outcome "did it work?" vote** (worked / needed adjustment / was off) | **S** | **Very high** | From Laser Settings Hub. One-tap, honest, produces the "fewer test squares" data flywheel, and a "worked" vote auto-increments the verification count. The lowest-effort, highest-leverage data-collection mechanic — and the only "ask" operators will actually do (per feedback analysis). |
| **3** | **Source-provenance badge taxonomy** (Supplier reference / Personal test / Community-verified) | **S** | **High** | From Laser Settings Hub. Cheap to ship, enormous trust value, and it's the schema the seeded-manufacturer-data and the verification mechanic both hang off. Define once, reuse everywhere. |
| **4** | **Cold-start seed from manufacturer/OEM tables** (tagged "Supplier reference") + the "beats starting from zero" honesty framing | **M** | **High** | From Machines for Makers. Solves the empty-DB death spiral. CutLog uniquely layers community verification on top, so seeded entries *graduate* to verified — a model neither MFM nor LaserMarkDB can replicate. |
| **5** | **Multi-format export + one-click test-grid generator** (LightBurn .clb / EZCAD / RDWorks, with a power×speed grid bracketing the recommended starting point) | **M** | **High** | Combines LaserMarkDB's multi-format export + BeamMate/xTool/LSH's test-grid. The test grid IS the "fewer test squares" promise made concrete, and EZCAD/RDWorks export unlocks the galvo/fiber niche CutLog wants. (Prior report flags .clb importer is currently broken for galvo — fix that first.) |
| 6 | **Machine-match comparison summary** (poster's machine vs. yours, with a match score) | M | Medium-high | From Laser Settings Hub. Makes the per-machine story tangible; the match score reframes verification count honestly. |
| 7 | **Conservative / Recommended / Aggressive preset triad** per setting | S | Medium | From BeamMate's Safe/Standard/Fast. Presents a range, not false precision — perfectly on-message. Industrial relabel. |
| 8 | **Before/after outcome photos** attached to each entry | S | Medium | From LaserMarkDB. Cheap, high trust, especially for cut-edge quality / dross / kerf on industrial cuts where a photo is worth more than a number. |
| 9 | **Per-entry Q&A / discussion thread** ("maker-tested answers") | M | Medium | From LaserMarkDB. Replaces scattered FB-group Q&A; engagement + SEO. Lower priority — needs community volume first. |
| 10 | **Freemium ladder: Free / $5 Pro / $19 Team** (Team = shared shop library + roles + audit trail) | M | Medium (revenue) | From Laser Settings Hub — the proven price structure for this exact market. The **Team tier is the only credible path to industrial WTP**. Validate before over-building (per synthesis: zero WTP observed so far). |
| 11 | **SEO long-tail "best settings for [material] [thickness] on [machine]" pages** | M | High (acquisition) | How Machines for Makers built its audience. Each verified entry + photos + Q&A becomes a compounding SEO asset. Durable channel; grab it before MFM locks the long-tail. |
| 12 | **Founder / reputation badges** for early contributors | S | Low-medium | From LaserMarkDB. Cheap engagement/retention lever for the cold-start phase; "Founder" badge rewards the first contributors who seed the verified data. |

---

## 6. VERIFICATION & PROVENANCE DESIGN — concrete spec for the coding agent

This is the directly-actionable part. It synthesizes LaserMarkDB's verification count + Laser Settings Hub's provenance taxonomy + the 3-outcome vote into one coherent system aligned with CutLog's honest positioning. **Badge names, colors, and rules are concrete and shippable.**

### 6.1 Source/Trust badge taxonomy (the provenance tier of an entry)

Every setting entry carries **exactly one source badge** describing where the number came from, plus an independent **verification count** (§6.2). Keep the source badge and the verification count visually distinct — source = *origin*, verification = *reproduction*.

| Badge | Label text | Color | Rule (when assigned) | Tooltip |
|---|---|---|---|---|
| Supplier | **"Manufacturer"** | Slate/gray `#64748B` | Seeded from an OEM/manufacturer material table or spec sheet. Neutral, not endorsed by CutLog. | "From the manufacturer's published settings. A starting point — every machine varies." |
| Personal | **"Operator-tested"** | Blue `#2563EB` | Submitted by one identified user who ran it on a known machine profile. | "One operator confirmed this on their own machine. Not yet independently reproduced." |
| Community | **"Community-verified"** | Green `#16A34A` | Has ≥3 independent "worked" confirmations from matched machines (see §6.2 threshold). | "Independently reproduced by 3+ operators on matching machines." |
| Contested | **"Needs review"** | Amber `#D97706` | "needed adjustment" + "was off" votes outweigh "worked," OR a previously-verified entry has dropped below threshold. | "Recent operators reported this needed adjustment. Treat as a rough starting point." |

Notes for the coding agent:
- These four are **mutually exclusive** and **auto-computed** from votes — never user-selectable except the initial Manufacturer-vs-Operator origin. An entry *graduates* Manufacturer/Operator-tested → Community-verified automatically when it crosses the threshold, and demotes to Needs-review when contested. This graduation is the core flywheel and the thing competitors don't have.
- Do NOT use a 5-star rating anywhere. Stars imply precision CutLog explicitly rejects. The vote breakdown replaces stars.

### 6.2 Verification-count mechanic (the reproduction tier)

- **Display:** `✓ Verified ×N` chip next to each entry (mirrors LaserMarkDB's "Verified ×14"), where **N = count of distinct users who voted "worked" from a matched machine.**
- **Machine-match gate (CutLog's improvement over LaserMarkDB):** a vote only counts toward `Verified ×N` if the voter's machine matches the entry's machine on **make + model + wattage + lens** (exact). Votes from *similar* machines (same family, different wattage) accumulate in a separate, secondary counter: `~Similar ×M` (lighter weight, gray). This makes "Verified ×14" honestly mean "14 people with the *same* machine reproduced it."
- **The vote itself = the 3-outcome control** (from Laser Settings Hub), shown as the only post-use ask:
  - **"Worked"** → increments `Verified` (if matched), feeds graduation to Community-verified.
  - **"Needed adjustment"** → does NOT increment Verified; records the *direction* (faster/slower/more power/less) if the user optionally edits the values → this is gold for J/mm refinement.
  - **"Was off"** → counts toward demotion to "Needs review."
- **Vote breakdown bar** under each entry: a small stacked bar `worked | needed adjustment | was off` with counts (Laser Settings Hub pattern). Sort option: **"Most-confirmed for my machine."**
- **Graduation thresholds (tunable):** Community-verified at **≥3 matched "worked" and worked > (needed-adjustment + was-off)**; demote to Needs-review when **(needed-adjustment + was-off) ≥ worked** with ≥3 total votes.
- **Identity requirement:** votes require a logged-in user with at least one saved machine profile (prevents anonymous ballot-stuffing; the machine-match gate falls out of this for free).

### 6.3 The machine-match summary (per entry detail page)
Show poster's machine vs. viewer's machine (Laser Settings Hub's "machine comparison summary"), with an explicit **match score chip**: `Exact match` (green) / `Same family, different wattage — scaled estimate shown` (blue) / `Different machine — reference only` (gray). When not an exact match AND a wattage differs, show the **J/mm-scaled starting point** alongside the raw values, labeled `Scaled estimate — unverified on your machine`.

### 6.4 Honest microcopy (non-negotiable, ties to positioning)
- Global disclaimer near every result set (steal MFM's tone): **"These are starting points, not magic numbers. Every machine varies — run one test grid to confirm."**
- One-tap **"Generate test grid"** button on every entry (brackets the values ±2 steps in power and speed; exports to .clb/EZCAD). This is the literal embodiment of "fewer test squares."

---

## 7. "Do NOT copy" list (traps & positioning conflicts)

| Anti-pattern | Where seen | Why CutLog must avoid it |
|---|---|---|
| **Hard email-gate on ALL results** | Machines for Makers ("create account to see all results" after 3 samples) | Skeptical industrial operators bounce at a wall. Tease the count, but let users see *more* before the gate. A wall on a "trust us" product is a credibility tax. |
| **Closed, material-locked auto-settings** | Glowforge Proofgrade (encoded sticker → only works on their materials/machine) | Directly opposite CutLog's cross-brand, bring-your-own-machine value. Lock-in is the thing CutLog's multi-brand-shop buyer is fleeing. |
| **5-star ratings / single "correct" number** | implicit in calculator tools | Implies a precision the physics doesn't support (4–5x speed spread same-wattage; O₂ purity, plywood batch swings — per `00_SYNTHESIS`). Use the 3-outcome vote + verification count instead. Never a single authoritative number. |
| **"AI tells you THE settings" oracle framing** | LaserParams, Laser Assistant, BeraTech | Now table stakes AND contradicted by CutLog's own operator feedback ("every machine is different, run a test"). Lead with verified-starting-point + test-grid, keep AI as a *fallback* for empty cells, never the headline. |
| **"Free forever, no paid tier" purity** | LaserMarkDB ("no 'pro' tier that hides the good stuff") | Admirable but it's a *lifestyle/passion* stance that forecloses the only revenue path (Team/industrial). CutLog can keep the *core community DB free* (and say so) while charging for Team shared-libraries/roles/test-grid — never paywall the verified data itself. |
| **Sprawling "everything for machinists" scope** | BeraTech CNC (lathes + mills + plasma + salary + news + 50 modules) | Unfocused; "not enough ratings" on both stores. CutLog's edge is focus (laser-only, industrial-cutting + galvo depth). Do not add adjacent modules. |
| **Static, un-updated calculator** | BeamMate (no update ~12 months, "not enough ratings") | A frozen lookup table decays. The verification flywheel + fresh community votes are what keep CutLog's data alive and defensible. |
| **Curated single-shop library presented as "community"** | Laser Assistant (one shop's 500 profiles, no real community/feedback) | Looks comprehensive but has no network effect and no per-machine reproduction signal. CutLog's verification-count + match-gate is the genuine community moat — don't fake it with a static curated list. |

---

## TOP 5 FEATURES TO ADOPT (the summary to relay)

1. **Verification-count mechanic** — "✓ Verified ×N" gated to *exact machine-match* (make/model/wattage/lens), with a separate `~Similar ×M` counter. The strongest trust signal in the market (LaserMarkDB), made honest by CutLog's machine-match gate. **(M effort, very high impact.)**
2. **3-outcome "did it work?" vote** — worked / needed adjustment / was off (Laser Settings Hub). One-tap, honest, feeds both the verification count and the "fewer test squares" data flywheel. Lowest effort, highest leverage. **(S, very high.)**
3. **Source-provenance badge taxonomy** — Manufacturer (gray) / Operator-tested (blue) / Community-verified (green) / Needs-review (amber), auto-computed, with entries *graduating* from manufacturer-seed to community-verified as makers confirm. The synthesis no single competitor has. **(S, high.)**
4. **Cold-start seed from OEM tables + "beats starting from zero" honesty framing** — seed the DB with manufacturer data tagged "Manufacturer," then let verification graduate it (Machines for Makers' cold-start move + LaserMarkDB's community layer combined). **(M, high.)**
5. **Multi-format export + one-click test-grid generator** — LightBurn .clb / EZCAD / RDWorks export with a power×speed grid bracketing the recommended starting point (LaserMarkDB export + BeamMate/xTool test grid). Literally embodies "run one test grid, not ten," and EZCAD/RDWorks unlocks the galvo/fiber niche. **(M, high.)**

**Cross-cutting principle for the coding agent building provenance UX:** never show a single authoritative number or a 5-star rating. Show *origin* (source badge) + *reproduction* (verification count + 3-outcome vote breakdown) + *fit* (machine-match score) + the always-present "starting point, run a test" microcopy and one-tap test-grid button. That four-part honest signal is CutLog's actual differentiator — see §6 for the concrete badge names, colors, and graduation rules.
