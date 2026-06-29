-- 014_wtp_intent.sql
-- Willingness-to-Pay (WTP) validation instrument — fake-door pricing page.
--
-- GOAL: capture real purchase-intent + a "what would you pay" number + the live
-- funnel (pricing_view → tier_click → checkout_start → payment_complete) so we
-- can answer the only question that matters: will anyone actually pay?
-- See project_docs/4.8_research/wtp_validation_plan.md (§2a, §4).
--
-- Two tables:
--   * wtp_intent  — one row per stage-1 modal submission (the "I'd pay $X" lead),
--                   updated in place as the same lead advances through checkout.
--   * wtp_event   — append-only funnel log (one row per funnel step), used for
--                   per-segment / per-tier counts in /admin.
--
-- RLS mirrors the user_feedback table (012): anon/auth users may INSERT their own
-- rows; only the service-role key (used by /api/admin/stats) reads them. Because
-- the pricing page is PUBLIC (logged-out traffic must be able to record intent),
-- user_id is nullable and the INSERT policy allows a null user_id.
--
-- The app degrades gracefully if these tables are absent (the routes wrap writes
-- in try/catch and /api/admin/stats already tolerates missing tables), so this
-- migration is safe to apply at any time.

-- ---------------------------------------------------------------------------
-- wtp_intent — the lead + its WTP answer, advanced in place through the funnel
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wtp_intent (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),         -- null for logged-out visitors
  segment text NOT NULL CHECK (segment IN ('industrial', 'engraving')),
  tier_clicked text NOT NULL,                      -- e.g. 'pro_monthly', 'founding_annual', 'shop', 'lifetime', 'export_unlock'
  price_shown text,                                -- human-readable price label shown on the card
  email text,
  would_pay_amount text,                           -- free-text "what would you pay" answer (kept as text on purpose)
  machines_count integer,
  machine_model text,
  checkout_started boolean DEFAULT false,          -- stage-2 reached (real Stripe OR founding-reserve fallback)
  payment_complete boolean DEFAULT false,          -- set by /api/stripe-webhook on checkout.session.completed
  stripe_session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wtp_intent ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) may record intent. A logged-in user must use
-- their own id; logged-out visitors insert with a null user_id.
CREATE POLICY "Anyone can insert wtp intent"
  ON wtp_intent FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Users can view their own intent rows (admin reads go through the service role,
-- which bypasses RLS).
CREATE POLICY "Users can view own wtp intent"
  ON wtp_intent FOR SELECT
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- wtp_event — append-only funnel log for per-segment / per-tier counts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wtp_event (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  event text NOT NULL CHECK (event IN ('pricing_view', 'tier_click', 'checkout_start', 'payment_complete')),
  segment text CHECK (segment IN ('industrial', 'engraving')),
  tier text,
  intent_id uuid REFERENCES wtp_intent(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wtp_event ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert wtp event"
  ON wtp_event FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can view own wtp event"
  ON wtp_event FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS wtp_event_segment_tier_idx ON wtp_event (segment, tier);
CREATE INDEX IF NOT EXISTS wtp_intent_segment_tier_idx ON wtp_intent (segment, tier_clicked);
