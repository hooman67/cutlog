"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Machine } from "@/lib/types";
import { isEngravingMode } from "@/lib/types";
import {
  TIERS,
  SEGMENT_LABELS,
  type Segment,
  type Tier,
} from "@/lib/pricing";

/**
 * /pricing — fake-door Willingness-to-Pay (WTP) validation page.
 * See project_docs/4.8_research/wtp_validation_plan.md (§2a). Public page: it
 * must work logged-out. All writes go through /api/wtp-intent + /api/checkout
 * and degrade gracefully if those tables / Stripe keys are absent.
 */

interface IntentForm {
  email: string;
  wouldPay: string;
  machines: string;
  machineModel: string;
}

const EMPTY_FORM: IntentForm = { email: "", wouldPay: "", machines: "", machineModel: "" };

function PricingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [segment, setSegment] = useState<Segment>("industrial");
  const [token, setToken] = useState<string | null>(null);
  const [machine, setMachine] = useState<Machine | null>(null);

  // Modal state
  const [activeTier, setActiveTier] = useState<Tier | null>(null);
  const [stage, setStage] = useState<1 | 2>(1);
  const [form, setForm] = useState<IntentForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [intentId, setIntentId] = useState<string | null>(null);
  const [reserved, setReserved] = useState(false);

  // Banner from a returning Stripe redirect (?status=success|cancel).
  const status = searchParams.get("status");

  /** Fire a lightweight funnel event (best-effort, never blocks UI). */
  const logEvent = useCallback(
    (event: string, seg?: Segment, tier?: string, extra?: Record<string, unknown>) => {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        fetch("/api/wtp-intent", {
          method: "POST",
          headers,
          body: JSON.stringify({ event, segment: seg, tier, ...extra }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // ignore
      }
    },
    [token]
  );

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        if (session.user.email) {
          setForm((f) => ({ ...f, email: session.user.email! }));
        }
        // Default the segment from the user's active machine type, if any.
        const { data: machines } = await supabase
          .from("machines")
          .select("*")
          .eq("user_id", session.user.id)
          .order("is_active", { ascending: false, nullsFirst: false })
          .limit(1);
        if (machines && machines.length > 0) {
          setMachine(machines[0]);
          if (isEngravingMode(machines[0])) setSegment("engraving");
        }
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log a pricing_view once on mount (after we know the default segment/token).
  useEffect(() => {
    logEvent("pricing_view", segment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function openTier(tier: Tier) {
    if (!tier.paid) return;
    setActiveTier(tier);
    setStage(1);
    setReserved(false);
    setIntentId(null);
  }

  function closeModal() {
    setActiveTier(null);
    setSubmitting(false);
    setReserved(false);
  }

  async function submitIntent(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTier || !form.wouldPay.trim()) return;
    setSubmitting(true);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch("/api/wtp-intent", {
        method: "POST",
        headers,
        body: JSON.stringify({
          segment,
          tier_clicked: activeTier.key,
          price_shown: `${activeTier.price}${activeTier.unit}`,
          email: form.email || null,
          would_pay_amount: form.wouldPay,
          machines_count: form.machines || null,
          machine_model: form.machineModel || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      setIntentId(data.intent_id ?? null);
    } catch {
      // Even if persistence fails, let the user continue to checkout.
    }

    setStage(2);
    setSubmitting(false);
  }

  async function continueToCheckout() {
    if (!activeTier) return;
    setSubmitting(true);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({ segment, tier: activeTier.key, intent_id: intentId }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      // Honesty guardrail: Stripe not live → reserve-the-spot confirmation.
      setReserved(true);
    } catch {
      setReserved(true);
    }
    setSubmitting(false);
  }

  const tiers = TIERS[segment];

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 pt-2">
        <button onClick={() => router.push("/")} className="text-zinc-400 hover:text-zinc-200 text-lg">&larr;</button>
        <h1 className="text-2xl font-bold">Go Pro</h1>
      </div>
      <p className="text-sm text-zinc-500 mb-6 ml-8">
        A tested starting point so you run fewer test sheets. Founding members lock
        in the lowest price CutLog will ever offer.
      </p>

      {/* Stripe-return banner */}
      {status === "success" && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-900/40 border border-emerald-700 text-emerald-200 text-sm">
          You&apos;re a founding member — thank you. Check your email for a receipt.
        </div>
      )}
      {status === "cancel" && (
        <div className="mb-6 p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm">
          Checkout cancelled — no charge was made. The founding price is still here when you&apos;re ready.
        </div>
      )}

      {/* Segment toggle */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(SEGMENT_LABELS) as Segment[]).map((seg) => (
          <button
            key={seg}
            onClick={() => {
              setSegment(seg);
              logEvent("pricing_view", seg);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              segment === seg
                ? "bg-emerald-900/50 border border-emerald-700 text-emerald-300"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {SEGMENT_LABELS[seg]}
          </button>
        ))}
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className={`flex flex-col rounded-2xl border p-5 ${
              tier.paid
                ? "bg-zinc-900 border-emerald-800"
                : "bg-zinc-900/50 border-zinc-800"
            }`}
          >
            <h2 className="text-lg font-semibold text-zinc-100">{tier.name}</h2>
            <div className="mt-2 mb-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-zinc-100 font-mono">{tier.price}</span>
              <span className="text-sm text-zinc-500">{tier.unit}</span>
            </div>
            {tier.note && <p className="text-xs text-emerald-300/80 mb-3">{tier.note}</p>}

            <ul className="space-y-2 text-sm text-zinc-300 mb-5 mt-2 flex-1">
              {tier.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => openTier(tier)}
              disabled={!tier.paid}
              className={`w-full p-3 rounded-xl font-semibold text-sm transition-colors ${
                tier.paid
                  ? "bg-emerald-700 hover:bg-emerald-600 text-emerald-50"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-default"
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-600 text-center mt-8">
        Questions? <Link href="/feedback" className="text-sky-400 hover:text-sky-300">Send us a note</Link>.
        60-day money-back on founding memberships.
      </p>

      {/* Two-stage modal */}
      {activeTier && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-lg font-semibold text-zinc-100">
                {activeTier.name}
                <span className="block text-sm font-normal text-zinc-500">
                  {activeTier.price}
                  {activeTier.unit}
                </span>
              </h3>
              <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-300 text-xl leading-none">&times;</button>
            </div>

            {/* Stage 1 — intent capture */}
            {stage === 1 && (
              <form onSubmit={submitIntent} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@shop.com"
                    className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    What would you pay for this? <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.wouldPay}
                    onChange={(e) => setForm((f) => ({ ...f, wouldPay: e.target.value }))}
                    placeholder="e.g. $50/mo, or $500 one-time"
                    className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
                  />
                  <p className="text-xs text-zinc-600 mt-1">Honest answers help us price this right.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Machines you run</label>
                    <input
                      type="number"
                      min="1"
                      value={form.machines}
                      onChange={(e) => setForm((f) => ({ ...f, machines: e.target.value }))}
                      placeholder="optional"
                      className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Brand / model</label>
                    <input
                      type="text"
                      value={form.machineModel}
                      onChange={(e) => setForm((f) => ({ ...f, machineModel: e.target.value }))}
                      placeholder="optional"
                      className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !form.wouldPay.trim()}
                  className="w-full p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Continue →"}
                </button>
              </form>
            )}

            {/* Stage 2 — transaction / reserve */}
            {stage === 2 && !reserved && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-zinc-300">
                  You&apos;re about to {activeTier.mode === "subscription" ? "start" : "buy"}{" "}
                  <span className="font-medium text-zinc-100">{activeTier.name}</span> at{" "}
                  <span className="font-mono">{activeTier.price}{activeTier.unit}</span>.
                </p>
                <button
                  onClick={continueToCheckout}
                  disabled={submitting}
                  className="w-full p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? "..." : "Continue to checkout →"}
                </button>
                <button
                  onClick={closeModal}
                  className="w-full p-2 rounded-xl text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
                >
                  Maybe later
                </button>
              </div>
            )}

            {/* Honesty guardrail: reserved-spot confirmation */}
            {stage === 2 && reserved && (
              <div className="mt-4 space-y-3 text-center">
                <p className="text-2xl">🛠️</p>
                <p className="text-base font-semibold text-emerald-300">You&apos;re on the founding list.</p>
                <p className="text-sm text-zinc-400">
                  Checkout isn&apos;t live yet — we&apos;ve reserved your founding spot and the
                  founding price. We&apos;ll email {form.email || "you"} the moment it opens.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Pricing() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-zinc-500">Loading pricing...</div>
        </div>
      }
    >
      <PricingInner />
    </Suspense>
  );
}
