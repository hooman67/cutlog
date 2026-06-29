import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * POST /api/stripe-webhook
 *
 * Records a completed payment into Supabase on `checkout.session.completed`.
 * See project_docs/4.8_research/wtp_validation_plan.md (§4.5).
 *
 * Uses the service-role admin client (bypasses RLS) to flip the matching
 * wtp_intent row's payment_complete flag and to append a payment_complete
 * funnel event — same pattern as /api/admin/stats.
 *
 * Verifies the Stripe signature when STRIPE_WEBHOOK_SECRET is set. Degrades
 * gracefully: if Stripe isn't configured (no secret key / package), the route
 * 200s without doing anything so a misconfigured webhook never spams errors.
 */
export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secretKey) {
      // Stripe not live yet — acknowledge so Stripe doesn't retry forever.
      return NextResponse.json({ received: true, note: "stripe-not-configured" });
    }

    let Stripe: typeof import("stripe").default;
    try {
      Stripe = (await import("stripe")).default;
    } catch {
      return NextResponse.json({ received: true, note: "stripe-not-installed" });
    }

    const stripe = new Stripe(secretKey);
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event: import("stripe").default.Event;
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err) {
        console.error("Stripe webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // No signing secret configured — parse without verification (test only).
      event = JSON.parse(rawBody) as import("stripe").default.Event;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as import("stripe").default.Checkout.Session;
      const intentId = session.client_reference_id || session.metadata?.intent_id || null;
      const segment = session.metadata?.segment ?? null;
      const tier = session.metadata?.tier ?? null;
      const userId = session.metadata?.user_id || null;

      // Mark the intent row paid (best-effort).
      if (intentId) {
        try {
          await supabaseAdmin
            .from("wtp_intent")
            .update({ payment_complete: true, stripe_session_id: session.id })
            .eq("id", intentId);
        } catch (err) {
          console.error("wtp_intent payment update error:", err);
        }
      }

      // Append the payment_complete funnel event.
      try {
        await supabaseAdmin.from("wtp_event").insert({
          user_id: userId || null,
          event: "payment_complete",
          segment,
          tier,
          intent_id: intentId,
        });
      } catch (err) {
        console.error("wtp_event payment insert error:", err);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
