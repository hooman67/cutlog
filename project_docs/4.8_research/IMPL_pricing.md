# CutLog — WTP / Pricing Fake-Door Implementation

**Date:** 2026-06-28
**Status:** Built on branch `wtp-pricing`. Implements `wtp_validation_plan.md` §2a + §4
(the in-app fake-door pricing page, intent capture, Stripe Checkout, webhook, funnel
readout, and soft upsells). Degrades gracefully with no Stripe keys and no migration applied.

> Read `wtp_validation_plan.md` first — it is the authoritative spec and the go/no-go
> framing. This doc is the build summary + the exact steps that remain for Hooman.

---

## What was built

A public `/pricing` page (the fake door) with a two-segment toggle, real value bullets,
a two-stage CTA (intent capture → checkout), a Stripe Checkout + webhook path, a funnel
readout in `/admin`, and tasteful single-line upsells on `/suggest` and the export flow.

Everything is defensive: if the `wtp_intent` / `wtp_event` tables don't exist yet, or if
Stripe env keys are absent, nothing 500s — writes are swallowed and the checkout button
falls back to a "Founding members — reserve your spot" confirmation that still records intent.

## New files

| File | Purpose |
|------|---------|
| `data/014_wtp_intent.sql` | Migration: `wtp_intent` (leads + WTP answer, advanced in place) and `wtp_event` (append-only funnel log). RLS mirrors `user_feedback` (012) but allows null `user_id` so logged-out visitors can record intent. |
| `src/lib/pricing.ts` | Single source of truth for segments, tiers, prices, value bullets, and the env-var name holding each tier's Stripe Price ID. |
| `src/app/pricing/page.tsx` | The fake-door page. Segment toggle (defaults to engraving if the logged-in user's machine is an engraver), tier cards, two-stage modal, Stripe-return banner. Public — works logged-out. |
| `src/app/api/wtp-intent/route.ts` | `POST` — records stage-1 intent into `wtp_intent` and logs funnel events into `wtp_event`. Mirrors `/api/feedback`; auth optional. |
| `src/app/api/checkout/route.ts` | `POST` — creates a Stripe Checkout Session for the chosen Price and returns its URL. Honesty guardrail: no keys/Price ID → `{ reserved: true }` + records `checkout_started`. |
| `src/app/api/stripe-webhook/route.ts` | `POST` — on `checkout.session.completed`, flips `payment_complete` on the intent row and appends a `payment_complete` event (via the service-role admin client). |

## Edited files

| File | Change |
|------|--------|
| `src/app/api/admin/stats/route.ts` | Added `wtpFunnel`, `wtpBySegmentTier`, `wtpRecentIntents` to the stats payload (graceful if tables absent). |
| `src/app/admin/page.tsx` | New "WTP" tab: funnel counts, intent-by-segment-&-tier grid, recent "what would you pay" leads (incl. checkout-started / PAID flags). |
| `src/app/page.tsx` | "⚡ Go Pro" nav button → `/pricing`. |
| `src/app/suggest/page.tsx` | One soft upsell line under the recommendation ("Unlock unlimited AI suggestions & the verified library → see Pro"). |
| `src/app/history/page.tsx` | One soft upsell inside the export dropdown ("Unlock full bulk export → see Pro"). |
| `package.json` | Added `stripe ^17.7.0`. |
| `.env.example` | Documented the Stripe env vars (all optional). |

## Funnel events

Logged to `wtp_event`: `pricing_view` (page mount + segment switch) → `tier_click`
(stage-1 intent submit) → `checkout_start` (clicking "Continue to checkout") →
`payment_complete` (Stripe webhook). The `/admin` → WTP tab shows counts per segment per tier.

---

## SQL the user must apply

Apply the new migration in the Supabase SQL editor (or via your migration tooling):

```
data/014_wtp_intent.sql
```

It creates `wtp_intent` + `wtp_event` with RLS. Until it is applied, the page and routes
still work (intent writes are silently swallowed and the funnel readout shows zeros).

## Env vars to set (Vercel project settings — all OPTIONAL)

| Var | Needed for |
|-----|-----------|
| `STRIPE_SECRET_KEY` | Real Stripe Checkout (`sk_test_…` then `sk_live_…`). Absent → reserve-the-spot fallback. |
| `STRIPE_WEBHOOK_SECRET` | Verifying the webhook signature (`whsec_…`). |
| `STRIPE_PRICE_FOUNDING_ANNUAL` | Industrial founding annual ($790/yr) Price ID. |
| `STRIPE_PRICE_PRO_MONTHLY` | Industrial Pro ($99/machine/mo) Price ID. |
| `STRIPE_PRICE_SHOP` | Industrial Shop ($249/mo) Price ID. |
| `STRIPE_PRICE_LIFETIME` | Engraving Pro Lifetime ($129 one-time) Price ID. |
| `STRIPE_PRICE_EXPORT_UNLOCK` | Engraving Export Unlock ($19 one-time) Price ID. |
| `NEXT_PUBLIC_SITE_URL` | Checkout success/cancel redirect base (falls back to request Origin, then the prod URL). |

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
are already set (the webhook reuses the service-role admin client).

## Remaining manual Stripe-dashboard steps (Hooman)

1. Create a Stripe account; start in **Test mode**.
2. Create Products & Prices (no code):
   - Industrial: "CutLog Pro — per machine" recurring **$99/mo**; "Founding Annual" **$790/yr**; "Shop" **$249/mo**.
   - Engraving: "Pro Lifetime" one-time **$129**; "Export Unlock" one-time **$19**.
3. Copy each **Price ID** (`price_…`) into the matching `STRIPE_PRICE_*` env var in Vercel.
4. Add a webhook endpoint pointing at `https://<your-domain>/api/stripe-webhook`, subscribe to
   `checkout.session.completed`, and paste the signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Paste `STRIPE_SECRET_KEY` (test). Run one test-mode purchase end-to-end; confirm the webhook
   writes the row and `/admin` → WTP shows `payment_complete`.
6. Flip to **Live** keys to take real money. (For week-1 warm-lead pre-sales, Stripe Payment
   Links pasted into a DM are enough and need none of the above — see `wtp_validation_plan.md` §4.)

---

## Build / verification status

`node`/`npm` were **not available in the build sandbox**, so `npm install`, `npx tsc --noEmit`,
and `npm run build` could not be executed here. The code was written to match the existing
conventions and is type-correct by inspection. Before deploying, run:

```
npm install          # pulls the newly-added `stripe` dependency
npx tsc --noEmit     # (pre-existing errors in settings/page.tsx are unrelated)
npm run build
```

Note: `stripe` is imported via dynamic `import("stripe")` inside the Stripe routes, wrapped in
try/catch, so a missing package never breaks unrelated routes — but the dependency must be
installed for `tsc`/`build` to resolve its types.
