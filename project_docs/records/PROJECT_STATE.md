# CutLog — Project State (Living Log)

> The master record of **what we actually did, learned, and decided** — distinct from the
> research/plans in `4.8_research/`. Four standing sections. Updated every working session per the
> rules in the repo-root `CLAUDE.md`. When in doubt about what actually happened, ask Hooman before
> recording. Topic execution detail lives in per-topic files in this folder (created as we go).

**Last updated:** 2026-07-01

---

## 🎯 Action Items

Status keys: ⬜ not started · 🔵 in progress · ✅ done · ⏸️ blocked/waiting

### Hooman (only he can do these)
- ✅ **Applied SQL migration `data/015_add_pierce_params.sql`** in Supabase (Hooman, 2026-07-01).
  Pierce data is now live in prod — Hugh's DM is unblocked.
- ✅ **Applied SQL migration `data/016_hrpo_material_and_aliases.sql`** in Supabase (Hooman,
  2026-07-02). HRPO now selectable + "Mild Steel" search surfaces the HRPO rows.
- ✅ **DM'd Paul Malfroid** (2026-07-02) — first WTP outreach DM sent. Awaiting reply. Final wording
  + his data in `facebook.md §2`.
- ✅ **DM'd Hugh Owings** (2026-07-02) — final DM `facebook.md §1` (dropped engrave, leads with
  cut+pierce). Verified his live view before sending. Awaiting reply.
- ⬜ **Apply SQL migration `data/017_scraped_wattage_and_dedup.sql`** in Supabase — dedups the
  double-applied scraped rows AND backfills `recorded_wattage_w` so speed scaling engages (fixes the
  optimistic headline). Until applied, recommendations from high-wattage rows still run fast.
- ⬜ **Watch for Paul's / Hugh's replies** — if they give wattage, send matching numbers; first real
  WTP conversations.
- ⬜ **Stripe setup (~1–2h):** create account, generate Payment Links — Founding Annual $790/yr,
  Concierge $49, Lifetime $129, Export unlock $19. (No code needed for Payment Links.)
- ⬜ **DM warm industrial leads** with the founding offer + payment link. Lead with Tinker Withit,
  John Stegenga, Jeremy Hubert. Galvo/creator variant to Nate Keen (otherwise leave Nate alone).
  Scripts: `4.8_research/wtp_validation_plan.md §2b`, `4.8_research/OUTREACH_STRATEGY.md`.
- ⬜ **Offer the $49 concierge job** to interested-but-hesitant leads.
- ⬜ **Set Stripe env vars in Vercel** (see WTP build note below) once Prices exist.
- ⬜ **Apply SQL migration `data/014_wtp_intent.sql`** in the Supabase SQL editor.
- ⬜ **Week 4: apply the kill/validate gate** and write down the verdict.

### Code / agents
- ⬜ **Revisit the Conservative speed profile for thick-metal cutting** (deferred, 2026-07-02). It's a
  flat Fast×0.5, so HRPO/2kW showed 567 mm/min — *below* the real 2kW datapoint (1200), too timid for
  thick metal (too-slow can stall/burn as easily as too-fast). Consider a gentler multiplier or a
  floor near the nearest real datapoint. Not a bug; product tuning. `SPEED_PROFILE_MULTIPLIERS` in
  `src/lib/types.ts`.
- ✅ **Merged two fixes to main** (2026-07-02, `08ddf9b`): (1) **per-machine delete button** on
  `/machine` (mirrors cuts delete UX; inline Confirm/Cancel; shows for 1+ machines) + **removed the
  bulk "Reset My Data" danger zone**; (2) **operation-type mismatch fix** — when the DB has data for
  the opposite op type of the active machine, the app now says "we have cutting data — switch to a
  cutting machine" instead of a wrong AI fallback, and clamps absurd AI speeds (was 60,000 mm/min
  for 9.5mm steel). Both verified: 186/186 tests, 0 non-test tsc errors. App logic only, no migration.
- ⚠️ **File-corruption watch:** `data/015_add_pierce_params.sql` was found overwritten to a single
  `t` in the working tree (2026-07-02) — same stray-keystroke corruption that hit `facebook.md`
  earlier. Restored from git (HEAD was intact). **If pierce data looks missing in prod, re-apply
  015** — unclear whether the intact or corrupt version was applied in Supabase.
- ✅ **Built + merged pierce-params feature** (2026-07-01, merge `b9d739c`). 5 nullable pierce
  columns on `cuts` (type/time_s/power_pct/height_mm/gas_pressure_bar) + cited OEM staged-pierce
  seed on `scraped_public` thick-metal rows; AI-suggest + UI wired. Independently verified:
  186/186 tests, 0 non-test tsc errors. **Not live until migration 015 applied in Supabase.**
- ✅ **Session-resume backup** (2026-07-01): session store relocated to git-backed
  `~/hs_scripts/claude/cutlog_claud_resume/` + symlinked; `RESTORE.sh` re-links after restart.
  Documented in repo `CLAUDE.md` (🔁 Resuming section).
- ✅ **Verified prior agents' build claims** (background agent, 2026-06-28). See Learnings.
- ✅ **Built WTP `/pricing` instrument** on branch `wtp-pricing` (commit `08855f4`, not pushed).
  See Learnings + `4.8_research/IMPL_pricing.md`.
- ✅ **Merged `wtp-pricing` → `main`** (2026-06-28, clean fast-forward) — resolved the `stripe`
  build break.
- ✅ **Confirmed build on `main`:** `stripe` resolves now. Remaining `npm run build` failure in the
  bare sandbox is the pre-existing `/api/admin/*` "supabaseUrl is required" env-var artifact, not a
  defect — builds on Vercel with env vars + Node 20.
- ✅ **Records structure set up** (2026-06-28): repo-root `CLAUDE.md` (auto-load + rules + cold-start),
  `project_docs/README.md` index, `records/` living logs (PROJECT_STATE + reddit/facebook/youtube/
  seo/wtp), legacy docs archived by topic under `project_docs/legacy/`.

---

## 💡 Learnings

### 2026-06-28 — Prior agents' feature work is real (verified)
Independent verification (ran the suites + build, didn't trust the docs):
- J/mm energy layer (23 tests), hardened .clb/galvo importer (43), multi-format export (25),
  28 SEO pages (22 industrial fiber-cutting; the doc's "23" was a minor overcount) — **all real
  and passing.** Full suite **186/186 green**. `tsc` clean in all four features.
- **`npm run build` was failing on `main`** — *not* from those features, but from a half-wired
  Stripe payments feature a prior agent left behind (imported `stripe` in `api/checkout` +
  untracked `api/stripe-webhook` but never added `stripe` to `package.json`).

### 2026-06-28 — WTP instrument built; resolves the build break
The `wtp-pricing` branch added `stripe` to deps and completed the checkout/webhook routes, so the
build compiles there. **`main` is still broken until this branch merges.** Everything degrades
gracefully if the `wtp_intent` table or Stripe keys are absent (no 500s).

### 2026-07-01 — Lead × DB data-confidence audit (verified against `data/industrial-cutting-scraped.sql`)
Investigated which warm leads we actually have strong data for, to lead outreach with the best hand.
Key correction: **an early agent claimed Hugh's data was only weak `ai_baseline` — FALSE.** The
thick-metal data lives in `industrial-cutting-scraped.sql` (not `baseline-parameters.sql`), and it's
`scraped_public` (published OEM charts). DB has **only two `source` values: `scraped_public` (5,444
rows) + `ai_baseline` (1,110)** — **zero** `community_verified`/`user_logged`. So "verified" in the
old DM drafts is inaccurate; honest term is **"published manufacturer data."**
- **Paul Malfroid** (.625"/15.875mm 316L): HIGH — 9 scraped rows at exact spec, no caveats. **Best hand.**
- **Hugh Owings** (3/8"/9.525mm HRPO, 2kW): HIGH for **cut+pierce** (8 scraped rows at exact spec incl.
  a 2kW row, ~1,200 mm/min O₂) but **engrave = AI only** (no HRPO engrave rows) and his exact 2kW row
  is quality 3/5 "near max for 2kW." DM reworded to be honest about this.
- **Nicklas** HIGH · **Levi** MEDIUM (no thickness) · **Olga** MEDIUM/off-strategy (CO2 hobbyist).
- Research also confirmed our numbers are physically sound (Raycus 2kW OEM table corroborates ~1,200
  mm/min) and that **nobody sells a 2kW cross-machine cutting library** (Etsy has only per-thickness
  single-machine 4kW+ files) — supports the niche positioning.

### 2026-07-02 — Rec count/label honesty: only-used-rows + flag excluded gas (fixed, 2dc3e34)
After gas separation, the headline was O₂-only but "Based on 9 cuts" + range + confidence still
counted ALL rows (incl. the 2 excluded N₂ rows) — overstating evidence and showing N₂ rows in the
detail list with no indication they weren't used. Fixed: `dataPoints` + confidence now use recCuts
(rows actually used); detail list dims + labels other-gas rows "Not used for this O₂ recommendation."

### 2026-07-02 — Recommendation undershoot after scaling turned on: gas blend + no proximity weighting (fixed)
Once migration 017 made scaling work, the HRPO/2kW headline swung the OTHER way — 946/473, *below*
the true 2kW datapoint (1200) the DB has. Two causes (fixed in `afa91e7`): (1) the rec **blended
gas types** — N₂ rows (needing ~2x energy, infeasible on 2kW) averaged in with O₂, and N₂ pressure
bled into the O₂ params; (2) **no wattage-proximity weighting** — a 10kW row scaled 5× to 2kW got the
same weight as the real 2kW row. Fix: pick the dominant gas and base speed+params only on it; weight
each row by 1/scaleRatio to the user's wattage so near/real datapoints dominate. +4 tests (190 total).
**Lesson:** cross-machine scaling isn't enough — you must also *trust nearby data more* and not blend
physically different processes (O₂ vs N₂). Verify recommendation-logic changes in the live app, not
just vitest (tests can't prove the real blended number).

### 2026-07-02 — Two scraped-data defects: phantom wattage column + duplicate rows (fixed, migration 017)
Verifying Hugh's live view surfaced two more issues (both in `data/017` + seed idempotency, `cb2f932`):
1. **Scaling never engaged → optimistic headlines.** `cuts.recorded_wattage_w` is *read* by the
   scaling path (`suggest/page.tsx:366-370`) and declared in the `Cut` type, but **was never created
   as a column** in any migration. So the "source wattage" fell back to the *user's* wattage and a
   10kW row's 3800 mm/min was treated as already-2kW (no down-scale). Scraped rows only carry wattage
   in the **notes text** ("2kW fiber; …"). 017 adds the column + backfills it by regex-parsing kW/W
   from notes. **Lesson:** a typed-but-never-migrated column fails silently as `undefined`.
2. **Duplicate rows** (HRPO 24→48): seed files were plain INSERTs, `cuts` had no unique constraint,
   and a seed got applied twice. 017 deletes exact dupes (keep lowest id) + adds a partial unique
   index on the scraped natural key; all scraped seed INSERTs now carry `ON CONFLICT DO NOTHING`.
   **Lesson:** "apply manually" seed files must be idempotent or double-applies silently duplicate.

### 2026-07-02 — HRPO search fell to AI despite data present: PostgREST .or() parens bug (fixed)
After applying all seed files, HRPO/9.5mm on a **cutting** machine STILL returned an AI
hallucination. DB had the data (`select count(*) ... ilike '%HRPO%'` → 48 rows, min 9.525). Root
cause: material names with reserved chars — **parentheses**, `,`, `&` (e.g. `HRPO (Hot Rolled
Pickled & Oiled)`, `Mild Steel (A36)`) — corrupt PostgREST's `.or()` filter parse; the query
returns nothing and the app silently drops to AI. **Self-inflicted regression:** migration 016 added
an HRPO materials entry whose parenthesized *name* then got injected into `.or()` (before 016,
"HRPO" resolved to no entry → clean `%HRPO%` filter → worked). Fixed in `aa0d129` with an `orValue()`
helper that double-quotes each `.or()` value; applied to all 5 affected spots. **Lesson:** never
interpolate raw user/DB strings into a PostgREST `.or()` — always quote; 82 parenthesized material
names were latently affected. Unit tests don't hit the live DB, so this class of bug needs
app-level/preview verification, not just `vitest`.

### 2026-07-02 — Active-machine op-type silently hides cross-operation data (fixed)
While testing Hugh's HRPO/9.5mm case, the app returned a **wrong AI hallucination** (60,000 mm/min;
"a 50W fiber laser can't cut 9.5mm") instead of our 8 scraped rows. Root cause: search maps the
**active machine's** `laser_source_type` → operationType (engrave vs cut) and filters all tiers by it
(`route.ts:126-131, 155/183/213`). Hooman's active machine is a **50W engraver**, so cut-only HRPO
rows were excluded → all tiers empty → AI fallback. **Hugh's own 2kW cutter resolves to "cut," so HE
sees the real data.** Fixed: app now detects the mismatch and tells the user to switch machine type,
+ clamps absurd AI speeds. **Lesson:** the active machine's operation type is a hidden global filter
on every search — when testing "do we have data for X," use a machine whose op type matches the data.

### 2026-07-02 — HRPO ≠ its own alloy; material-matching gap found & fixed
Hooman flagged: the app has no "HRPO", only "Mild Steel" — is that the right material? Yes — HRPO
(Hot Rolled Pickled & Oiled) is mild/carbon steel with a descaled+oiled surface finish, not a
distinct alloy. But investigation found our 24 HRPO cut rows (labeled `HRPO (Hot Rolled Pickled &
Oiled)`) only surfaced in search **by luck**: typing "HRPO", or picking Mild Steel (A36) whose
"HR"/"hot rolled" aliases substring-match "HRPO". Picking Carbon Steel or any other mild-steel
variant returned nothing. Also found a false-positive: the 2-char "HR" alias matched "c**HR**ome".
Fixed in migration `016` (HRPO now a selectable material + proper aliases on A36; "HR"→"HR steel").
**Lesson:** cut-row material *labels* and picker *material names* are matched by loose substring
ILIKE via the alias table — always verify a lead's material string actually resolves to the rows
before pitching "we have data for X."

### Strategic (from `4.8_research/00_SYNTHESIS_AND_VERDICT.md`)
- "Zero competition" is FALSE — 8–12 live competitors (LaserMarkDB, Machines for Makers, Laser
  Settings Hub, etc.); AI-tells-you-settings is now table stakes. Never claim "nobody does this."
- Market is a **lifestyle business** (~$1–2M ARR 5-yr ceiling), not venture-scale.
- Operators' ground truth: every machine differs, you must run your own material test. The
  defensible pitch is the **humble** one — "fewer test squares," not "AI oracle."
- Observed willingness-to-pay so far = **$0**. That, not feature completeness, is the open question.

---

## ✅ Decisions

- **2026-06-28 — Reposition** from "AI per-machine oracle" → "fastest path to a trusted starting
  point, fewer test squares." Normalize stored data to J/mm so settings transfer across wattages.
- **2026-06-28 — WTP validation is the next gate.** Stop building features; prove someone pays.
  3–4 week window. Kill if zero cash + zero deposited commitments; validate if ≥3 of ~8–12 warm
  leads pay/deposit with ≥1 industrial. ("I'd pay" without a transaction = kill-leaning.)
- **2026-06-28 — Segment focus:** industrial fiber cutting PRIMARY (revenue), galvo SECONDARY
  (reach/data), hobbyist TERTIARY (funnel). Don't spread across all channels.
- **2026-06-28 — Shelve the hardware-on-each-machine plan.** Not venture-scale for a solo founder;
  revisit only as a later upsell for a paying industrial cohort.
- **2026-06-28 — Records & workflow rules** captured in repo-root `CLAUDE.md` (auto-loaded). Memory
  lives in-repo under `project_docs/records/`.
- **2026-07-01 — Build pierce feature + lead with strongest data.** Approved building pierce params
  (done, merged). Outreach: **DM Paul first** (zero-caveat data), **Hugh after** pierce is live in
  prod. Drop "verified" from all DM copy → "published manufacturer data" (we have no verified rows).

---

## 🗺️ Long-term Plans

- **Pricing (recommended):** Industrial $99/machine/mo, sold to warm leads as a $790/yr founding
  annual (locked for life, 60-day money-back). Galvo/hobby: $129 one-time lifetime + $19 export
  unlock entry test. Old $200/$400 tiers abandoned (zero sales).
- **Product wedges to deepen (only after WTP validates):** bulletproof .clb importer (the actual
  pull), J/mm normalization + one-click LightBurn test-grid generator, multi-format export parity.
- **SEO long-tail** ("best settings for [material] [thickness] on [machine]") — compounding
  acquisition; win it before Machines for Makers locks it. 28 pages live; scale to ~50, gated by
  the quality bar in `4.8_research/IMPL_seo.md`.
- **Distribution:** go deep in CNC Fiber Laser Ninja (FB), Reddit cutting subs, YouTube comments;
  micro-YouTuber outreach; Product Hunt in month 2. Don't add channels — go deep.
- **Later/maybe:** consented "cutting-PC agent" that auto-harvests LightBurn/.clb params (captures
  ~80% of the hardware-data value at ~0% of the cost). Custom domain before heavy link-building.
