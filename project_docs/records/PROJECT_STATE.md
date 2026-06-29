# CutLog — Project State (Living Log)

> The master record of **what we actually did, learned, and decided** — distinct from the
> research/plans in `4.8_research/`. Four standing sections. Updated every working session per the
> rules in the repo-root `CLAUDE.md`. When in doubt about what actually happened, ask Hooman before
> recording. Topic execution detail lives in per-topic files in this folder (created as we go).

**Last updated:** 2026-06-28

---

## 🎯 Action Items

Status keys: ⬜ not started · 🔵 in progress · ✅ done · ⏸️ blocked/waiting

### Hooman (only he can do these)
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
