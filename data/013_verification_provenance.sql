-- 013_verification_provenance.sql
-- Verification-count + provenance support for the suggest page.
--
-- GOAL: surface how trustworthy a recommendation is.
--   * Provenance is derived in the API from the existing cuts.source column
--     (user_logged / ai_baseline / scraped_public) + per-cut quality signals.
--     No schema change is strictly required for provenance badges.
--   * Verification count = how many DISTINCT operators have confirmed a setting
--     worked for a given material / thickness. We derive this from the EXISTING
--     public.feedback table (feedback_type = 'perfect'). The view below makes
--     that aggregation cheap and reusable from the search route.
--
-- The UI degrades gracefully: if this view / column is absent, the search route
-- simply omits verified_count and the badge hides the count.
--
-- SAFE TO RE-RUN: uses CREATE OR REPLACE / IF NOT EXISTS throughout.
-- Apply manually in the Supabase SQL editor.

-- --------------------------------------------------------------------------
-- 1. Verification view: distinct operators who marked a (material, thickness)
--    recommendation as "perfect". Thickness is rounded to the nearest 0.5mm so
--    nearby thicknesses aggregate together the way the search tolerance does.
-- --------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.material_verifications AS
SELECT
  lower(material)                              AS material_key,
  round((thickness_mm * 2))::numeric / 2       AS thickness_bucket,
  count(DISTINCT user_id)                       AS verified_count
FROM public.feedback
WHERE feedback_type = 'perfect'
GROUP BY 1, 2;

COMMENT ON VIEW public.material_verifications IS
  'Distinct operator count confirming a material/thickness recommendation worked (feedback_type=perfect). Used for the "Verified by N operators" badge.';

-- Views inherit RLS from their underlying tables in Postgres only when
-- security_invoker is set; enable it so the existing feedback RLS applies.
-- (Postgres 15+; Supabase supports this. Harmless if already set.)
ALTER VIEW public.material_verifications SET (security_invoker = true);

-- --------------------------------------------------------------------------
-- 2. Optional denormalized verified_count on cuts.
--    Lets a future batch job cache a verification count directly on a cut row
--    (e.g. for scraped/community entries that gather confirmations). The search
--    route reads it if present and falls back to the view / 0 if NULL.
-- --------------------------------------------------------------------------
ALTER TABLE public.cuts
  ADD COLUMN IF NOT EXISTS verified_count integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.cuts.verified_count IS
  'Cached count of distinct operators who confirmed this exact cut works. 0 = unconfirmed. Optional; the suggest UI hides the count when 0.';

-- Index to make material-key lookups on the view fast.
CREATE INDEX IF NOT EXISTS idx_feedback_perfect_material
  ON public.feedback (lower(material), feedback_type)
  WHERE feedback_type = 'perfect';
