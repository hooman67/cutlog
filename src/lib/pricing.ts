/**
 * Pricing / Willingness-to-Pay (WTP) configuration.
 *
 * Single source of truth for the tiers rendered on /pricing, the WTP-intent
 * funnel, and the Stripe Checkout mapping. See
 * project_docs/4.8_research/wtp_validation_plan.md (§1, §2a, §4).
 *
 * IMPORTANT (honesty guardrail): Stripe Price IDs are read from env at request
 * time on the server (NOT bundled here) so Hooman can paste them into Vercel
 * without a code change. If a tier's Price ID env var is absent, /api/checkout
 * falls back to a "founding reserve" confirmation that still records intent.
 */

export type Segment = "industrial" | "engraving";

export type TierKey =
  | "free"
  | "pro_monthly"
  | "founding_annual"
  | "shop"
  | "lifetime"
  | "export_unlock";

export interface Tier {
  key: TierKey;
  name: string;
  /** Headline price label shown on the card, e.g. "$99" */
  price: string;
  /** Sub-label under the price, e.g. "/machine/mo" */
  unit: string;
  /** Short note under the price, e.g. founding-annual framing */
  note?: string;
  /** Real value bullets — what the money buys. */
  bullets: string[];
  /** Whether clicking opens the WTP modal (paid tiers) or is a no-op (free). */
  paid: boolean;
  /** CTA label on the card. */
  cta: string;
  /**
   * Env var name holding the Stripe Price ID for this tier. Resolved on the
   * server only. Absent value → graceful "founding reserve" fallback.
   */
  stripePriceEnv?: string;
  /** Stripe Checkout mode for this tier. */
  mode?: "payment" | "subscription";
}

export const SEGMENT_LABELS: Record<Segment, string> = {
  industrial: "Industrial cutting",
  engraving: "Engraving / hobby",
};

const SHARED_BULLETS = [
  "Unlimited AI cut/engrave suggestions",
  "Multiple machines on one account",
  "Full .clb / EZCAD / RDWorks export",
];

export const TIERS: Record<Segment, Tier[]> = {
  industrial: [
    {
      key: "free",
      name: "Free",
      price: "$0",
      unit: "",
      note: "The current product",
      paid: false,
      cta: "You're on Free",
      bullets: [
        "Log cuts & search your history",
        "AI starting points (rate-limited)",
        "LightBurn .clb export",
      ],
    },
    {
      key: "founding_annual",
      name: "Pro — Founding Annual",
      price: "$790",
      unit: "/machine/yr",
      note: "Price locked for life · 60-day money-back · vs $99/mo",
      paid: true,
      cta: "Start founding membership →",
      mode: "payment",
      stripePriceEnv: "STRIPE_PRICE_FOUNDING_ANNUAL",
      bullets: [
        ...SHARED_BULLETS,
        "Verified thick-metal industrial library",
        "J/mm cross-machine transfer (once shipped)",
        "Personal onboarding: dial in your hardest material",
      ],
    },
    {
      key: "pro_monthly",
      name: "Pro — Monthly",
      price: "$99",
      unit: "/machine/mo",
      paid: true,
      cta: "Go Pro →",
      mode: "subscription",
      stripePriceEnv: "STRIPE_PRICE_PRO_MONTHLY",
      bullets: [
        ...SHARED_BULLETS,
        "Verified thick-metal industrial library",
        "J/mm cross-machine transfer (once shipped)",
      ],
    },
    {
      key: "shop",
      name: "Shop",
      price: "$249",
      unit: "/mo",
      note: "Up to 5 machines · one line item for the owner",
      paid: true,
      cta: "Get Shop →",
      mode: "subscription",
      stripePriceEnv: "STRIPE_PRICE_SHOP",
      bullets: [
        ...SHARED_BULLETS,
        "Up to 5 machines on one account",
        "Verified thick-metal industrial library",
        "J/mm cross-machine transfer (once shipped)",
      ],
    },
  ],
  engraving: [
    {
      key: "free",
      name: "Free",
      price: "$0",
      unit: "",
      note: "The current product",
      paid: false,
      cta: "You're on Free",
      bullets: [
        "Log marks & search your history",
        "AI starting points (rate-limited)",
        "LightBurn .clb export",
      ],
    },
    {
      key: "lifetime",
      name: "Pro Lifetime",
      price: "$129",
      unit: " one-time",
      note: "Pay once — no subscription",
      paid: true,
      cta: "Get Lifetime →",
      mode: "payment",
      stripePriceEnv: "STRIPE_PRICE_LIFETIME",
      bullets: [
        ...SHARED_BULLETS,
        "Verified marking library",
        "J/mm transfer across galvo/MOPA machines (once shipped)",
      ],
    },
    {
      key: "export_unlock",
      name: "Export Unlock",
      price: "$19",
      unit: " one-time",
      note: "Unlock bulk .clb / EZCAD / RDWorks export of your library",
      paid: true,
      cta: "Unlock export →",
      mode: "payment",
      stripePriceEnv: "STRIPE_PRICE_EXPORT_UNLOCK",
      bullets: [
        "Full bulk export of your whole library",
        "All formats: .clb / EZCAD / RDWorks / CSV",
        "Lowest-friction way to support CutLog",
      ],
    },
  ],
};

/** Look up a tier by segment + key (used by /api/checkout to resolve the price). */
export function findTier(segment: Segment, tierKey: string): Tier | undefined {
  return TIERS[segment]?.find((t) => t.key === tierKey);
}

export function isSegment(value: unknown): value is Segment {
  return value === "industrial" || value === "engraving";
}
