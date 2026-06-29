import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSegment } from "@/lib/pricing";

/**
 * POST /api/wtp-intent
 *
 * Records willingness-to-pay intent from the /pricing fake-door page, and logs
 * funnel events. Mirrors the /api/feedback pattern, but the pricing page is
 * PUBLIC, so auth is optional: a logged-out visitor records intent with a null
 * user_id; a logged-in visitor's token (if present) attributes the row to them.
 *
 * Two request shapes:
 *   1. Funnel event only (lightweight beacon):
 *        { event: "pricing_view" | "tier_click" | "checkout_start" | "payment_complete",
 *          segment?, tier? }
 *   2. Stage-1 intent capture (the WTP modal submit):
 *        { segment, tier_clicked, price_shown, email, would_pay_amount,
 *          machines_count?, machine_model? }
 *      → inserts a wtp_intent row AND a tier_click event; returns { intent_id }.
 *
 * Degrades gracefully: if the wtp_intent / wtp_event tables don't exist yet, the
 * write is swallowed and we still return 200 so the UI never breaks (same
 * defensive posture as the search route).
 */

const VALID_EVENTS = ["pricing_view", "tier_click", "checkout_start", "payment_complete"];

/**
 * Build a Supabase client. If a Bearer token is present we attach it so the row
 * is attributed to the user and passes the RLS "own row" check; otherwise we use
 * the plain anon client (RLS allows a null user_id insert).
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

    // Resolve the user if a token was supplied (optional — page is public).
    let userId: string | null = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }

    const body = await request.json();

    // --- Shape 1: a bare funnel event ---
    if (body.event && !body.tier_clicked) {
      if (!VALID_EVENTS.includes(body.event)) {
        return NextResponse.json({ error: "Invalid event" }, { status: 400 });
      }
      const segment = isSegment(body.segment) ? body.segment : null;
      try {
        await supabase.from("wtp_event").insert({
          user_id: userId,
          event: body.event,
          segment,
          tier: body.tier ?? null,
          intent_id: body.intent_id ?? null,
        });
      } catch {
        // wtp_event table may not exist yet — swallow so the UI never breaks.
      }
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // --- Shape 2: stage-1 intent capture ---
    const {
      segment,
      tier_clicked,
      price_shown,
      email,
      would_pay_amount,
      machines_count,
      machine_model,
    } = body;

    if (!isSegment(segment)) {
      return NextResponse.json({ error: "Invalid or missing segment" }, { status: 400 });
    }
    if (!tier_clicked) {
      return NextResponse.json({ error: "tier_clicked is required" }, { status: 400 });
    }
    if (!would_pay_amount) {
      return NextResponse.json(
        { error: "would_pay_amount is required" },
        { status: 400 }
      );
    }

    let intentId: string | null = null;
    try {
      const { data, error } = await supabase
        .from("wtp_intent")
        .insert({
          user_id: userId,
          segment,
          tier_clicked,
          price_shown: price_shown ?? null,
          email: email ?? null,
          would_pay_amount,
          machines_count:
            machines_count !== undefined && machines_count !== null && machines_count !== ""
              ? Number(machines_count)
              : null,
          machine_model: machine_model || null,
        })
        .select("id")
        .single();

      if (error) {
        console.error("wtp_intent insert error:", error);
      } else {
        intentId = data?.id ?? null;
      }
    } catch {
      // wtp_intent table may not exist yet — swallow.
    }

    // Also log the tier_click funnel event (best-effort).
    try {
      await supabase.from("wtp_event").insert({
        user_id: userId,
        event: "tier_click",
        segment,
        tier: tier_clicked,
        intent_id: intentId,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, intent_id: intentId }, { status: 201 });
  } catch (err) {
    console.error("WTP intent API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
