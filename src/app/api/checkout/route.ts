import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { findTier, isSegment } from "@/lib/pricing";

/**
 * POST /api/checkout
 *
 * Stage-2 of the WTP instrument. Creates a Stripe Checkout Session for the
 * chosen tier and returns its redirect URL. See
 * project_docs/4.8_research/wtp_validation_plan.md (§2a.3, §4.5).
 *
 * Request body: { segment, tier, intent_id? }
 *
 * HONESTY GUARDRAIL: if Stripe isn't configured yet (no STRIPE_SECRET_KEY or no
 * Price ID env var for this tier), we DON'T error — we record checkout_started
 * on the intent row, log a checkout_start event, and return
 * { reserved: true } so the client shows a "Founding members — reserve your
 * spot" confirmation. The moment Hooman pastes the keys + Price IDs into Vercel,
 * the same button starts taking real money with zero code change.
 */

function getSupabase(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : undefined
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase(request);

    let userId: string | null = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }

    const body = await request.json();
    const { segment, tier: tierKey, intent_id } = body;

    if (!isSegment(segment)) {
      return NextResponse.json({ error: "Invalid or missing segment" }, { status: 400 });
    }
    const tier = findTier(segment, tierKey);
    if (!tier || !tier.paid) {
      return NextResponse.json({ error: "Unknown or non-paid tier" }, { status: 400 });
    }

    // Best-effort: mark the intent row as having reached stage-2 and log the
    // checkout_start funnel event regardless of whether Stripe is live.
    if (intent_id) {
      try {
        await supabase
          .from("wtp_intent")
          .update({ checkout_started: true })
          .eq("id", intent_id);
      } catch {
        // table may not exist yet — ignore
      }
    }
    try {
      await supabase.from("wtp_event").insert({
        user_id: userId,
        event: "checkout_start",
        segment,
        tier: tier.key,
        intent_id: intent_id ?? null,
      });
    } catch {
      // ignore
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = tier.stripePriceEnv ? process.env[tier.stripePriceEnv] : undefined;

    // --- Honesty guardrail: Stripe not configured → reserve-the-spot fallback ---
    if (!secretKey || !priceId) {
      return NextResponse.json({ reserved: true });
    }

    // --- Real Stripe Checkout ---
    // Dynamic import so a missing `stripe` package or key never breaks the build
    // / other routes; this path only runs when Stripe is actually configured.
    let Stripe: typeof import("stripe").default;
    try {
      Stripe = (await import("stripe")).default;
    } catch {
      // Package not installed — fall back to reserve gracefully.
      return NextResponse.json({ reserved: true });
    }

    const stripe = new Stripe(secretKey);

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://cutlog-two.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: tier.mode ?? "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing?status=success`,
      cancel_url: `${origin}/pricing?status=cancel`,
      client_reference_id: intent_id ?? undefined,
      metadata: {
        segment,
        tier: tier.key,
        intent_id: intent_id ?? "",
        user_id: userId ?? "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
