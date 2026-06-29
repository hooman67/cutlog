# CutLog — Willingness-To-Pay Validation (Running Log)

> THE CURRENT TOP-PRIORITY GATE. Record of the WTP experiment: what's built, what Hooman must do,
> results, and the go/no-go. See `4.8_research/wtp_validation_plan.md` (plan) and
> `4.8_research/IMPL_pricing.md` (build). Update every session.

**Last updated:** 2026-06-28
**Window:** 3-4 weeks from first warm-lead contact. **Observed WTP to date:** $0.

## The gate (kill / validate criteria)

From the plan §3. Window = 3 weeks from first warm-lead contact, hard stop at 4 weeks. Warm-lead denominator **Y = ~8-12** reachable leads.

- **STRONG VALIDATE:** **>=3 of Y** warm leads pay a founding annual OR sign LOI + deposit within the window, AND **>=1 is industrial cutting**. -> Build on.
- **WEAK / CONDITIONAL:** 1-2 leads pay/commit, OR >=3 paid concierge jobs ($49) with no founding close, OR >=1 real payment from cold/free pricing-page traffic. -> One more focused cycle at a re-shaped offer; do NOT build new features.
- **KILL:** **Zero** payments AND **zero** signed+deposited commitments across all methods after honest effort (every warm lead actually asked, concierge offered, page live with real checkout). -> No WTP. Stop building.
- **Honesty clause:** "I'd pay for that" with no transaction = **KILL-leaning**, not validation. Only cash or a deposited commitment flips the verdict to VALIDATE.

## Pricing being tested

- **Industrial (primary):** $99/machine/mo, sold to warm leads as a **$790/yr founding annual** — price locked for life, 60-day no-questions money-back, first 10 shops.
- **Industrial Shop tier:** $249/mo flat, up to 5 machines (removes per-machine friction).
- **Galvo/hobby (secondary):** **$129 one-time lifetime** "Pro" + **$19 one-time export unlock** as the entry micro-test. Recurring subs expected to fail here; one-time is the fair test.
- **Concierge:** $49 for a first dialed-in starting point (credited toward founding).
- **Abandoned:** old Free / Pro $200 / Enterprise $400 per-machine tiers — produced zero sales.

## What's built (VERIFIED, merged to main)

The `/pricing` fake-door instrument (plan §2a + §4) was built on branch `wtp-pricing` (commit `08855f4`) and **MERGED into `main` on 2026-06-28** via clean fast-forward. It implements: a public two-segment `/pricing` page, two-stage CTA (intent capture -> checkout), Stripe Checkout + webhook, a funnel readout in `/admin`, and soft upsells. Everything **degrades gracefully** — if the `wtp_intent`/`wtp_event` tables are absent or Stripe keys are unset, nothing 500s; the checkout button falls back to a "reserve your spot" confirmation that still records intent.

**New files:**
- `data/014_wtp_intent.sql` — migration: `wtp_intent` (leads + WTP answer) + `wtp_event` (append-only funnel log); RLS mirrors `user_feedback` (012) but allows null `user_id`.
- `src/lib/pricing.ts` — single source of truth for segments, tiers, prices, bullets, and each tier's Stripe Price-ID env-var name.
- `src/app/pricing/page.tsx` — the fake-door page (segment toggle, tier cards, two-stage modal, Stripe-return banner; public/logged-out OK).
- `src/app/api/wtp-intent/route.ts` — `POST`, records stage-1 intent + funnel events (mirrors `/api/feedback`).
- `src/app/api/checkout/route.ts` — `POST`, creates a Stripe Checkout Session; no keys/Price ID -> `{ reserved: true }`.
- `src/app/api/stripe-webhook/route.ts` — `POST`, on `checkout.session.completed` flips `payment_complete`.
- `project_docs/4.8_research/IMPL_pricing.md` — the build doc.

**Edited:** `src/app/api/admin/stats/route.ts` (WTP funnel fields), `src/app/admin/page.tsx` (new WTP tab), `src/app/page.tsx` (Go Pro nav), `src/app/suggest/page.tsx` (soft upsell), `src/app/history/page.tsx` (export upsell), `package.json` (+`stripe ^17.7.0`), `.env.example` (Stripe vars, all optional).

**Build status (honest):** Merging into `main` **fixed** the prior `stripe` "module not found" break. The build still fails in a bare sandbox at `/api/admin/users` with "supabaseUrl is required" — this is a **PRE-EXISTING env-var issue** (admin routes throw at module load without Supabase env vars), **NOT a defect introduced by this work**. It builds on Vercel with env vars present + Node 20.

## Hooman's action items

From plan §6 (the part only Hooman can do):

- [ ] Create a **Stripe account**; verify business/bank for live payouts (start in Test mode).
- [ ] Generate **Payment Links / Prices**: Founding Annual **$790/yr/machine**, Concierge **$49**, Lifetime **$129**, Export Unlock **$19** (and $99/mo, $249/mo).
- [ ] Set the `STRIPE_*` **env vars in Vercel** (secret key, webhook secret, and the per-tier Price IDs); add a webhook endpoint at `/api/stripe-webhook` subscribed to `checkout.session.completed`.
- [ ] Apply **`data/014_wtp_intent.sql`** in the Supabase SQL editor.
- [ ] **DM the warm industrial leads** the founding offer (§2b script) — lead with **Tinker Withit, John Stegenga, Jeremy Hubert**; then George/Les/Chris/Mike. Send **Nate Keen the galvo/creator variant**.
- [ ] Offer the **$49 concierge** to anyone interested-but-hesitant; ask for the job details.
- [ ] Book 15-min calls and **ask for the money or a deposit** — get a yes/no, don't end with "let me know."
- [ ] **Week 4: write the verdict** (in the Decision section below) and act on it.

## Warm leads to ask (Y = ~8-12)

| Lead | Fit / note |
|------|-----------|
| Tinker Withit | Fiber cutting machine shop; runs Raytool; gave the "just speed at that point" endorsement. **Best industrial fit.** |
| John Stegenga | Runs **3 identical machines** (per-machine pricing fit); spent "hundreds/thousands" on test material — quantified pain. High WTP logic. |
| Jeremy Hubert | UV/fiber; disciplined material-test workflow; values reference libraries. |
| George Diffey | Industrial; already pays for OEM-bundled libraries + support (proves pays for parameter help). Reach if accessible. |
| Les Strickland | Industrial; same OEM-library-buyer profile. |
| Chris Savar | Industrial; same OEM-library-buyer profile. |
| Mike Guindon | Warm but lower industrial fit; secondary. |
| Nate Keen | Galvo; huge distribution (20K YT / 225K TikTok). **Pitch the B-tier $129 lifetime + creator/affiliate angle, NOT the industrial price.** |

## Results log (fill in as they come)

**None yet — observed WTP = $0.** No DMs sent, no Stripe live, no payments or deposits recorded.

| date | lead | offer | response | $ committed |
|------|------|-------|----------|-------------|
| — | — | — | — | — |

## Decision (week 4)

**TBD.** Apply the gate (§3 above) once outreach is done and the page is live with real checkout, then write the go/no-go verdict here: VALIDATE (build on), WEAK (one more cycle, no new features), or KILL (stop building as a paid product).
