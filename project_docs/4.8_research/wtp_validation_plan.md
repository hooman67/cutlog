# CutLog — Willingness-to-Pay (WTP) Validation Plan

**Date:** 2026-06-28
**Author:** Pricing/GTM strategist (Opus 4.8)
**Status:** Decision-grade. This is the go/no-go.

> **Read this first — the brutal honesty.** Across ~17 operator DMs, three FB/Reddit lead-gen
> rounds, and a live free product with **5,826 seeded parameters** and a deployed PWA, the
> observed willingness to pay is **exactly $0**. Nobody has booked a call, asked for a paid
> feature, or offered money. Feature completeness is NOT the problem — the prototype is more
> complete than most live competitors. **The only question that matters now is whether anyone
> will pay real money.** Every other workstream (more data, J/mm normalization, .clb fixes,
> SEO) is a distraction until this is answered. This document is a fast, cheap, honest
> experiment to get a yes/no on WTP in **3–4 weeks**, then act on it without flinching.

> **Where the money is (from `market_sizing.md`).** Durable WTP exists only in **Segment A:
> industrial thick-metal fiber cutting** — adjacent monitoring software (FourJaw $90–230/machine/mo,
> FreePoint $125, Predator $39) proves shops pay recurring per-machine fees tied to machine-time
> ROI. Hobbyist (Segment C) WTP is near-zero with free competition (LightBurn library, xTool
> EasySet, LaserCutSettings.com) and savage churn — it is a funnel asset, not a profit center.
> Galvo/MOPA marking (Segment B) is in between: most *engaged* (Nate Keen), lowest cost-per-failure,
> low WTP. **So we validate industrial first and hardest; galvo second.**

---

## 1. Hypotheses & Pricing Options To Test

### Framing principle
We are NOT testing "is the product good." We are testing **"will a specific buyer hand over money
(or a binding commitment) at a specific price."** A price test only counts if it ends in a
**transaction or a signed/deposited commitment** — clicks and "I'd pay $X" surveys are *intent
signal*, not WTP, and we weight them accordingly (see §3).

### Segment A — Industrial thick-metal fiber cutting (the segment with money)

Anchor to the proven monitoring band ($90–230/machine/mo) but discount because a parameter tool
is *narrower* than full monitoring. The ROI story is concrete and citable: per `01_product_definition.md`,
~$11k/yr/machine value (wasted sheets + setup time). Price at well under 50% of value.

| # | Model | Price | Rationale / anchor |
|---|---|---|---|
| **A1 (PRIMARY)** | Per-machine monthly | **$99/machine/mo** ($990/yr if annual, ~2 months free) | Clean psychological floor under FourJaw's $90–230 band; "narrower than monitoring" honesty; below CutLog's old $200 ask which had zero takers. The defensible recurring number from `market_sizing.md`. |
| A2 | Shop / team tier (flat) | **$249/mo per shop**, up to 5 machines | Removes per-machine friction for the 1–5-machine job shop (the ICP). Owner approves one line item. Good if per-machine metering scares buyers. |
| A3 | Founding-member annual (pre-sale) | **$790/yr/machine** (locked for life), money-back 60 days | The *actual* WTP instrument for warm leads — cash up front, real commitment, reversible risk. This is the offer in §2b. |

**Primary industrial hypothesis (the one we put forward first):**
> **A1: $99/machine/mo, sold as a founding annual of $790/yr (A3) to warm industrial leads.**
> If ≥3 of the warm/identified industrial leads pay or sign+deposit within the window, WTP is
> validated in the only segment that can carry the business. If zero pay after honest effort,
> that is the kill signal.

### Segment B — Galvo/MOPA engraving + hobby/prosumer (reach & data, not primary revenue)

WTP here is structurally capped by free/one-time competition (LightBurn $99 one-time, Etsy files
$4–17, Glowforge Premium $20/mo, Patreon $2–6/mo). Test the *shape* of payment that this niche
actually uses, not a SaaS-monitoring price.

| # | Model | Price | Rationale / anchor |
|---|---|---|---|
| **B1 (PRIMARY)** | Flat prosumer sub | **$9/mo or $79/yr** | Matches the Glowforge-Premium / Laser Assistant ($9.99) tier; the realistic ceiling for marking shops per `market_sizing.md` ($120/yr). |
| B2 | One-time lifetime | **$129 one-time** | Mirrors LightBurn's proven one-time model — the *only* recurring-free shape this audience reliably pays. De-risks churn-fear. Strong WTP test: people pay once for tools they trust. |
| B3 | Pay-for-data-export | **$19 one-time** to export your library to .clb/EZCAD/RDWorks (or unlock bulk export) | Micro-transaction tied to a concrete, already-built capability (`/api/export-clb` exists). Lowest-friction paid action; tests "will they pay anything at all." |

**Primary galvo/hobby hypothesis:**
> **B2: $129 one-time lifetime "Pro"** (search, multi-machine, unlimited AI suggestions, full
> export), with **B3 $19 export unlock** as the entry micro-test. Recurring subs to this segment
> are expected to fail; the one-time shape is the fair test of whether the tool has *any* value.

### Why these and not the old tiers
The prior `01_product_definition.md` tiers (Free / Pro $200 / Enterprise $400 per machine/mo)
produced **zero** sales. $200/mo was above the FourJaw monitoring midpoint for a *narrower*
product, and Enterprise $400 had no buyer. A1 halves the entry price and reframes the high-value
sale as a reversible founding annual; B-tier abandons recurring for the one-time shape the hobby
market actually pays.

---

## 2. The Experiment Design (multiple methods, fastest/cheapest signal first)

Run these **roughly in parallel**, but the order below is the priority of *signal quality per
dollar/hour*. (b) and (c) — direct human asks to warm leads — are the highest-signal and
lowest-cost; do them in week 1. (a) the fake door and (d) the ad are cheaper to *operate* but
give weaker (intent, not cash) signal, so they back the human outreach, not replace it.

### 2a. Fake-door pricing page test (intent capture, in-app)

**Purpose:** Measure *cold/warm* purchase intent from existing free users and any new traffic,
and capture a real "what would you pay" number plus a live Stripe checkout that can take actual
money. This informs a coding agent precisely.

**What to build (concrete spec for a coding agent — Next.js 14 / Supabase app):**

1. **New route `/pricing` (`src/app/pricing/page.tsx`)** — a public pricing page with two segment
   toggles at the top: **"Industrial cutting"** | **"Engraving / hobby"** (default to whichever
   the user's machine type implies if logged in; the app already has machine context and a galvo
   mode). Render the tiers per segment:
   - Industrial: **Free** (current product) · **Pro — $99/machine/mo** (or $790/yr founding)
     · **Shop — $249/mo up to 5 machines**.
   - Engraving/hobby: **Free** · **Pro Lifetime — $129 one-time** · **Export unlock — $19**.
   - Each paid tier lists the *real* value bullets (unlimited AI suggestions, multi-machine,
     full .clb/EZCAD/RDWorks export, priority verified industrial thick-metal library, J/mm
     transfer once shipped).
2. **CTA = real "Upgrade" / "Start founding membership" button.** Two-stage:
   - **Stage 1 (intent):** clicking opens a modal that captures **email** (prefill if logged in)
     + a required **"What would you pay for this?"** field (free-text or a $ slider) + optional
     **"machines you run"** count + **"machine brand/model."** Persist to a new
     `wtp_intent` table (reuse the pattern of the existing `/api/feedback` route — see
     `src/app/api/feedback/route.ts`). Record `segment`, `tier_clicked`, `price_shown`,
     `would_pay_amount`, `ts`, `user_id|null`.
   - **Stage 2 (transaction):** the modal's primary button is **"Continue to checkout →"** which
     hits Stripe Checkout (§4). For the founding-annual it's a real charge; for the monthly it's
     a real subscription. Capture `checkout_started` and (via webhook) `checkout_completed`.
3. **Instrument the funnel.** Log four events to `wtp_intent` / an `events` table:
   `pricing_view` → `tier_click` → `checkout_start` → `payment_complete`. Add a tiny
   `/admin` panel readout (the app already has `/admin` with stats routes) showing counts per
   segment per tier.
4. **Honesty guardrail (do this, it protects credibility with technical operators):** if Stripe
   isn't live yet, the checkout button can route to a **"Founding members — reserve your spot"**
   confirmation that still records intent, BUT the moment we want a *real* WTP read we must let
   it actually charge. A pure fake door (button → "coming soon") only yields intent; we need at
   least the warm-lead path (§2b) to take real money. Prefer **real Stripe Checkout live** so the
   page itself can convert.
5. **Surface it:** add a "Pricing" / "Go Pro" link in the main nav and a single non-nag upsell
   on `/suggest` and `/export-clb` results ("Unlock unlimited / full export → see Pro").

**What we measure:** pricing-page views, tier click-through %, checkout-start %, and **actual
payments**. The load-bearing metrics are checkout-start→payment and absolute payment count.

### 2b. Direct pre-sale / founding-member offer to warm industrial leads (HIGHEST signal)

**Purpose:** The fastest path to a real "yes, here's money." These are named humans who already
engaged. Make a concrete, reversible, time-boxed cash offer.

**Targets (from `feedback_analysis.md`), prioritized by industrial-cutting fit + budget:**
1. **Tinker Withit** — fiber cutting machine shop; gave the "it's just speed at that point"
   endorsement; runs Raytool; clearly a working shop. Best industrial fit.
2. **John Stegenga** — runs **3 identical machines** (multi-machine = per-machine pricing fit),
   spent "hundreds/thousands" on test material (quantified pain). High WTP logic.
3. **Jeremy Hubert** — UV/fiber, disciplined material-test workflow; values reference libraries.
4. **George Diffey / Les Strickland / Chris Savar** — industrial buyers who already *pay* for
   OEM-bundled libraries + support (proves they pay for parameter help). Reach if accessible.
5. **Mike Guindon, Sean (diode)** — secondary; warm but lower industrial fit.
6. **Nate Keen** — galvo, huge distribution (20K YT / 225K TikTok) — pitch him the **B-tier
   founding/lifetime** AND a creator/affiliate angle, not the industrial price.

**The offer (industrial):**
> Founding membership: **$790/year per machine, price locked for life** (vs $99/mo = $1,188).
> **60-day, no-questions money-back.** First 10 shops only. In return I personally dial in your
> thick-metal starting points and you get the verified industrial library + full export.

**Exact DM/email script (industrial warm lead):**

> Subject: Founding spot on CutLog — locking in thick-metal cut settings for [shop]
>
> Hi [Name] — you helped me earlier when I was building CutLog (the parameter-journal tool),
> and your point about [their specific quote, e.g. "it's just speed once everything else is
> dialed in"] shaped where it's going. I'm opening **10 founding shop spots** and wanted to
> offer you one first.
>
> Straight version: it's a tool that gives you a *tested* thick-metal starting point (gas,
> pressure, focus, pierce, speed) so you cut fewer test sheets on new material/thickness, and
> keeps all your dialed-in settings searchable in one place instead of in your head. It is **not**
> plug-and-play — you still run your test, it just gets you to a smaller grid.
>
> Founding price: **$790/year per machine, locked for life** (it'll be $99/mo after), **60-day
> money-back, no questions**. If you're in, I'll personally sit with your most painful
> material/thickness job and dial in a starting point as part of onboarding.
>
> Worth a 15-min call this week? If it's not useful I'd genuinely rather you keep your money —
> I'm trying to find out if this is worth building further. Either way, thank you.

**The ask:** an actual payment (Stripe link) OR a signed one-page LOI **with a refundable
deposit** (e.g., $200). A verbal "sounds great" does **not** count.

### 2c. Concierge / manual-value test (proves value before product polish)

**Purpose:** Strip the product away and test whether the *outcome* (a dialed-in starting point)
is worth money. This also de-risks the warm-lead close — it's the onboarding promise made
standalone.

**The offer:**
> "Give me your machine (brand/power/lens), the exact material + thickness you're fighting, and
> your assist gas. I'll hand you back a tested starting point + a one-click LightBurn material-test
> grid sized around it, within 48 hours. **$49** for the first job (credited toward a founding
> membership if you join)."

- Deliver manually using the 5,826-row DB + J/mm reasoning + Gemini fallback + your own analysis.
- Even **3–5 paid concierge jobs at $49** is a *direct* WTP datapoint and a testimonial engine.
- For galvo leads (Nate), offer the engraving equivalent (line interval / Q-pulse / frequency
  starting point for a specific tumbler/coin job).

### 2d. Smoke-test ad (optional, cold WTP, week 3 only if budget allows)

**Purpose:** Measure *cold* intent at the chosen price, independent of warm relationships.

- **Budget: $100–150 total.** Reddit (r/lasercutting, r/fiberlasers) or a narrow Meta/FB
  interest ad ("fiber laser cutting"). One ad set, one message: "Stop burning test sheets on new
  thick-metal jobs — tested cut-settings starting points. Founding price." → `/pricing` (industrial).
- **Measure:** CTR, cost-per-pricing-view, and pricing-view→checkout-start %. This tells us if
  cold acquisition is even viable, separate from whether warm leads convert.
- Skip if Stripe/`/pricing` isn't live by week 3; warm-lead signal dominates anyway.

---

## 3. Success / Kill Criteria (explicit, numeric, decisive)

**Window: 3 weeks from first warm-lead contact (week 1 start), hard stop at 4 weeks.**

Define the warm-lead denominator up front: **~8 reachable, identified leads** (Tinker, Stegenga,
Jeremy, George, Les, Chris, Mike, Nate) plus any industrial lead-gen commenters we can DM. Call
this **Y = 8–12**.

| Outcome | Threshold | Verdict |
|---|---|---|
| **STRONG VALIDATE** | **≥3 of Y warm leads** pay a founding annual OR sign LOI + deposit, AND ≥1 is industrial cutting. | Real WTP in the money segment. **Build on.** Proceed to a small founding cohort and the repositioning roadmap. |
| **WEAK / CONDITIONAL** | **1–2** warm leads pay/commit, OR **≥3 paid concierge jobs ($49)** but no recurring/founding close, OR pricing-page **checkout-start→payment ≥1 real payment** from cold/free traffic. | Some value, no proven business. **One more focused cycle** at a re-shaped offer (e.g., lower price, one-time, concierge-led). Do **not** build new features. |
| **KILL** | **Zero** payments and **zero** signed+deposited commitments across ALL methods after honest effort (every warm lead actually asked, concierge offered, page live). | **No WTP. Stop building.** Wind down to a free funnel asset or shelve. The evidence has answered the founding question. |

**Supporting (intent, not decisive) thresholds — used only to interpret, never to override "zero cash = kill":**
- Pricing-page **tier-click ≥15%** of views and **checkout-start ≥5%** = healthy intent worth a second cycle.
- Median **"what would you pay" ≥ $50/mo** (industrial) is encouraging; **< $20/mo** confirms the segment can't carry the model.

**Honesty clause:** A pile of "I'd totally pay for that" with **no transactions** is the
*signature of this exact business's failure so far* and counts as **KILL-leaning**, not validate.
Cash or a deposited commitment is the only thing that flips the verdict to VALIDATE.

---

## 4. Stripe / Payment Setup (steps for Hooman)

Minimal path to actually accept money. ~1–2 hours of setup.

1. **Create a Stripe account** at dashboard.stripe.com (use the CutLog/business identity). Start
   in **Test mode** to wire the flow, then flip to **Live** to take real money.
2. **Business activation for live mode:** add bank account + basic business/identity details so
   payouts work. (Individual/sole-prop is fine to start; can be a personal account initially.)
3. **Create Products & Prices** in the dashboard (no code needed to define them):
   - Industrial: "CutLog Pro — per machine" recurring **$99/mo**; "Founding Annual" one-time/recurring **$790/yr**; "Shop" **$249/mo**.
   - Engraving/hobby: "Pro Lifetime" one-time **$129**; "Export Unlock" one-time **$19**.
4. **Easiest integration = Stripe Payment Links** (zero code): generate a hosted link per Price.
   - Use these immediately for **warm-lead pre-sales (§2b)** and **concierge (§2c)** — just paste
     the link in a DM/email. **This needs no engineering and can take real money on day 1.**
5. **In-app integration (for the `/pricing` fake door, §2a) = Stripe Checkout:**
   - Add `stripe` server SDK; create a `POST /api/checkout` route that creates a Checkout Session
     for the chosen Price and returns the redirect URL (mirror the existing server-route pattern
     in `src/app/api/*`).
   - Add a `POST /api/stripe-webhook` route to record `payment_complete` into Supabase
     (`checkout.session.completed`). Store the Stripe keys in env vars (Vercel project settings),
     same place Gemini/Supabase keys live.
   - Keep it minimal: success page = "You're a founding member" thank-you; cancel page = back to
     `/pricing`.
6. **Test, then go live:** run a real test-mode purchase end-to-end, confirm the webhook writes
   the row and `/admin` shows it, then toggle to live keys.

> For week 1, **Payment Links alone are enough** to run the highest-signal experiments (warm-lead
> pre-sale + concierge). The in-app Checkout is only needed for the fake-door page; build it in
> parallel but don't let it block the human outreach.

---

## 5. Sequencing & Timeline (3–4 weeks, lowest-cost-highest-signal first)

### Week 0 (this week, ~2–3 hrs prep)
- Hooman: create Stripe account, generate **Payment Links** for the founding annual ($790),
  concierge ($49), and lifetime ($129). (No code.)
- Finalize the warm-lead list (Y) and personalize the DM script per lead.

### Week 1 — Direct human asks (highest signal, ~$0 cost)
- Send the **founding-member DM/email (§2b)** to all reachable industrial warm leads (Tinker,
  Stegenga, Jeremy, George, Les, Chris, Mike). Send the galvo/creator variant to Nate.
- Offer the **concierge $49 job (§2c)** to anyone who's interested-but-not-ready.
- Coding agent (parallel, doesn't block): build `/pricing` page + intent capture + Stripe
  Checkout + webhook (§2a, §4).
- Track replies, calls booked, payments, deposits.

### Week 2 — Close + concierge delivery
- Run the booked 15-min calls; convert to payment or signed LOI+deposit.
- Deliver any concierge jobs within 48h; convert satisfied concierge customers to founding.
- Ship `/pricing` live with real Stripe Checkout; add the Go-Pro nav link + the two soft upsells
  on `/suggest` and export. Watch the funnel in `/admin`.

### Week 3 — Cold test + follow-up
- Run the **$100–150 smoke-test ad (§2d)** to `/pricing` (industrial) if the page is live.
- Second, gentle follow-up to non-responding warm leads ("closing founding spots Friday").
- Tally pricing-page funnel + ad CTR/conversion.

### Week 4 — Decide
- Compile all transactions, commitments, concierge sales, and funnel numbers.
- Apply §3 criteria. **Make the go/no-go call and write it down.** Do not extend past 4 weeks —
  open-ended validation is how zero-WTP businesses survive longer than they should.

---

## 6. WHAT HOOMAN NEEDS TO DO (crisp checklist)

**Setup (Week 0):**
- [ ] Create a **Stripe account**; verify business/bank for live payouts.
- [ ] Create Prices and generate **Payment Links**: Founding Annual **$790/yr/machine**,
      Concierge **$49**, Lifetime **$129**, Export Unlock **$19**.
- [ ] Confirm the warm-lead list (Tinker Withit, John Stegenga, Jeremy Hubert, George Diffey,
      Les Strickland, Chris Savar, Mike Guindon, Nate Keen) and find each one's DM/email channel.

**Outreach (Week 1) — the part only Hooman can do:**
- [ ] DM/email the **founding-member offer (§2b script)** to every reachable **industrial** lead,
      with their Payment Link or LOI attached. Lead with Tinker, Stegenga, Jeremy.
- [ ] Send Nate the **galvo lifetime + creator/affiliate** variant.
- [ ] Offer the **$49 concierge job** to anyone interested-but-hesitant; ask for the job details.
- [ ] Book 15-min calls; on the call, **ask for the money or a deposit** — do not end with "let
      me know." Get a yes/no.

**Delivery & close (Week 2–3):**
- [ ] Deliver concierge jobs within 48h; ask satisfied customers to upgrade to founding.
- [ ] Review the live `/pricing` funnel in `/admin`; note "what would you pay" answers.
- [ ] (Optional) Launch the $100–150 ad to `/pricing`.

**Decide (Week 4):**
- [ ] Count real payments + deposited commitments. Apply §3. **Write the verdict and act on it** —
      build on (VALIDATE), one more cycle (WEAK), or stop building (KILL).

**Coding agent (parallel, hand off — not Hooman's manual work):**
- [ ] Build `/pricing` page with segment toggle + tiers (§2a).
- [ ] Intent-capture modal → `wtp_intent` table (reuse `/api/feedback` pattern).
- [ ] `POST /api/checkout` (Stripe Checkout) + `POST /api/stripe-webhook` → record `payment_complete`.
- [ ] Funnel counts in `/admin`; Go-Pro nav link + soft upsell on `/suggest` and export.

---

## Bottom Line

**This is the decision that matters most — more than any feature, dataset, or competitor.** The
product is already more complete than the market; the missing thing is a single dollar of revenue.

- **Recommended PRIMARY price point:** **Industrial — $99/machine/mo, sold to warm leads as a
  $790/yr founding annual (price locked for life, 60-day money-back).** Galvo/hobby secondary:
  **$129 one-time lifetime**, with a **$19 export unlock** as the entry micro-test. The old
  $200/$400-per-machine tiers are abandoned — they produced zero sales.
- **KILL CRITERIA:** If, after honestly asking every warm lead, offering the $49 concierge, and
  running a live pricing page with real Stripe checkout, there are **zero real payments AND zero
  signed-with-deposit commitments within 4 weeks**, WTP is falsified — **stop building CutLog as
  a paid product.** "I'd pay for that" with no transaction counts as kill-leaning, not validation.
- **VALIDATE CRITERIA:** **≥3 of ~8–12 warm leads pay or sign+deposit within 3 weeks, with ≥1
  industrial-cutting shop among them.** Then, and only then, build on.

Run the cheapest, highest-signal thing first: **DM the warm industrial leads a real founding
offer with a Stripe Payment Link this week.** That single action will tell you more than another
month of building.
