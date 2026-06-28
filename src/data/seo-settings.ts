/**
 * Curated, hand-authored laser parameter STARTING POINTS for programmatic SEO pages.
 *
 * IMPORTANT — POSITIONING / HONESTY:
 * Every value here is a CONSERVATIVE STARTING POINT, not a guaranteed recipe.
 * Real cuts depend on the individual machine, beam quality, resonator hours,
 * assist-gas purity, optics condition, nozzle wear, material batch, and ambient
 * conditions. Operators MUST run a material test on their own machine and dial
 * in from these numbers. This mirrors CutLog's product positioning: "a better
 * starting point so you run fewer test squares," NOT an AI oracle that gives
 * "the number."
 *
 * These values are intentionally on the safe/quality side (slightly slower, with
 * adequate gas) so a first test is unlikely to be catastrophic. They are derived
 * from published manufacturer cutting charts and widely-reported community ranges
 * for fiber metal cutting and galvo/MOPA marking — generalized across brands.
 *
 * This file is STATIC. It is never queried from Supabase. It is the single source
 * of truth for /settings/[slug] page generation, the sitemap, and internal links.
 */

export type LaserType =
  | "fiber-cutting"
  | "fiber-engraving"
  | "co2-cutting"
  | "co2-engraving"
  | "diode-engraving"
  | "uv-marking";

export interface ParamRow {
  label: string;
  value: string;
  note?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoSetting {
  /** URL slug, e.g. "5mm-mild-steel-fiber-laser-cutting". Stable, lowercase, hyphenated. */
  slug: string;
  /** Material display name, e.g. "Mild Steel". */
  material: string;
  /** Thickness in mm. Null for engraving/marking entries where thickness is not the axis. */
  thicknessMm: number | null;
  /** Laser type / process bucket. */
  laserType: LaserType;
  /** Human label for the laser type, e.g. "Fiber Laser". */
  laserTypeLabel: string;
  /** Wattage band these starting points assume, e.g. "3 kW–6 kW". Important for fiber. */
  powerBand?: string;
  /** True for industrial metal cutting (priority pages). */
  industrial: boolean;
  /** The exact long-tail query this page targets — also the H1. */
  targetQuery: string;
  /** One-paragraph intro that frames the page honestly. */
  intro: string;
  /** Recommended starting-point parameter table. */
  params: ParamRow[];
  /** Process-specific tips shown as bullets. */
  tips: string[];
  /** FAQ used for both on-page content and FAQPage JSON-LD. */
  faqs: FaqItem[];
  /** Slugs of related pages for internal linking. Populated/validated at module load. */
  related: string[];
}

/**
 * Helper to build a fiber-cutting entry with consistent structure.
 */
function fiberCut(args: {
  material: string;
  thicknessMm: number;
  powerBand: string;
  gas: string;
  gasPressure: string;
  speed: string;
  focus: string;
  nozzle: string;
  nozzleDistance: string;
  pierce: string;
  notes?: { speed?: string; gas?: string; focus?: string; nozzle?: string };
}): SeoSetting {
  const matSlug = args.material.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = `${args.thicknessMm}mm-${matSlug}-fiber-laser-cutting`;
  const targetQuery = `Best fiber laser settings for ${args.thicknessMm}mm ${args.material}`;
  return {
    slug,
    material: args.material,
    thicknessMm: args.thicknessMm,
    laserType: "fiber-cutting",
    laserTypeLabel: "Fiber Laser",
    powerBand: args.powerBand,
    industrial: true,
    targetQuery,
    intro:
      `These are conservative starting-point parameters for cutting ${args.thicknessMm}mm ` +
      `${args.material.toLowerCase()} on a fiber laser in roughly the ${args.powerBand} class. ` +
      `Use them as the center of your first test, then dial in for your exact machine, ` +
      `optics, assist-gas purity, and material batch. They are not a guaranteed recipe — ` +
      `no published chart can be, because two same-wattage machines can differ 4–5x in real-world feed rate.`,
    params: [
      { label: "Assist gas", value: args.gas, note: args.notes?.gas },
      { label: "Gas pressure", value: args.gasPressure },
      { label: "Cutting speed", value: args.speed, note: args.notes?.speed ?? "Start here, then push faster only if edge stays clean." },
      { label: "Focus position", value: args.focus, note: args.notes?.focus },
      { label: "Nozzle", value: args.nozzle, note: args.notes?.nozzle },
      { label: "Nozzle standoff", value: args.nozzleDistance },
      { label: "Pierce", value: args.pierce },
      { label: "Power band assumed", value: args.powerBand },
    ],
    tips: [
      `Verify your assist-gas purity. With N₂, a drop from 99.999% to 99.5% can cost ~20–25% feed rate and leave an oxidized edge.`,
      `Check focus on a stainless ramp test before trusting any number — focal shift from a hot or contaminated lens is the most common cause of sudden dross.`,
      `If you see bottom-edge dross, drop speed ~10% or raise gas pressure ~1 bar before touching focus.`,
      `Resonator hours and nozzle wear shift these numbers over time. Re-baseline after a nozzle change or a few hundred resonator hours.`,
    ],
    faqs: [
      {
        question: `What speed should I cut ${args.thicknessMm}mm ${args.material.toLowerCase()} at with a fiber laser?`,
        answer:
          `A conservative starting point in the ${args.powerBand} class is ${args.speed}. ` +
          `Treat this as the middle of your test range and adjust ±15–20% based on edge quality. ` +
          `Higher-wattage machines and clean optics will run faster; worn nozzles, low gas purity, or off-focus will run slower.`,
      },
      {
        question: `Which assist gas is best for ${args.thicknessMm}mm ${args.material.toLowerCase()}?`,
        answer:
          `This starting point uses ${args.gas} at ${args.gasPressure}. ${args.notes?.gas ?? ""} ` +
          `Gas choice trades cost, speed, and edge oxidation — confirm against the finish your parts require.`,
      },
      {
        question: `Why won't one settings chart work on every machine?`,
        answer:
          `Beam quality, resonator hours, optics condition, nozzle wear, assist-gas purity, and material batch all move the numbers. ` +
          `Same-wattage machines from different brands routinely differ 4–5x in achievable feed rate. ` +
          `That is exactly why CutLog gives you a starting point and a fast test workflow instead of pretending there is one universal number.`,
      },
    ],
    related: [],
  };
}

/**
 * The curated dataset. Industrial fiber cutting leads; galvo/marking + a couple of
 * CO2 entries follow for secondary coverage.
 */
const RAW_SETTINGS: SeoSetting[] = [
  // ─── MILD STEEL (O2 for thick, N2 for thin/clean) ───────────────────────────
  fiberCut({
    material: "Mild Steel", thicknessMm: 3, powerBand: "1.5 kW–3 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.6–0.9 bar", speed: "2,800–3,400 mm/min",
    focus: "+0.5 to +1.0 mm (into material)", nozzle: "Single, Ø1.4 mm",
    nozzleDistance: "0.7–1.0 mm", pierce: "0.3–0.5 s, blow pierce",
    notes: { gas: "O₂ adds an exothermic reaction that boosts thick-steel speed; expect a slightly oxidized edge." },
  }),
  fiberCut({
    material: "Mild Steel", thicknessMm: 5, powerBand: "2 kW–4 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.5–0.8 bar", speed: "1,800–2,400 mm/min",
    focus: "+1.0 to +1.5 mm (into material)", nozzle: "Single, Ø1.5 mm",
    nozzleDistance: "0.8–1.2 mm", pierce: "0.5–0.8 s, stepped pierce",
  }),
  fiberCut({
    material: "Mild Steel", thicknessMm: 8, powerBand: "3 kW–6 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.4–0.7 bar", speed: "1,100–1,600 mm/min",
    focus: "+1.5 to +2.5 mm (into material)", nozzle: "Single, Ø2.0 mm",
    nozzleDistance: "1.0–1.5 mm", pierce: "0.8–1.5 s, stepped/progressive pierce",
  }),
  fiberCut({
    material: "Mild Steel", thicknessMm: 10, powerBand: "4 kW–6 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.3–0.6 bar", speed: "900–1,300 mm/min",
    focus: "+2.0 to +3.0 mm (into material)", nozzle: "Single, Ø2.5 mm",
    nozzleDistance: "1.0–1.5 mm", pierce: "1.5–2.5 s, progressive pierce",
  }),
  fiberCut({
    material: "Mild Steel", thicknessMm: 12, powerBand: "4 kW–8 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.3–0.5 bar", speed: "700–1,000 mm/min",
    focus: "+2.5 to +3.5 mm (into material)", nozzle: "Single, Ø2.5–3.0 mm",
    nozzleDistance: "1.2–1.8 mm", pierce: "2.5–4 s, progressive pierce",
  }),
  fiberCut({
    material: "Mild Steel", thicknessMm: 16, powerBand: "6 kW–12 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.2–0.5 bar", speed: "500–800 mm/min",
    focus: "+3.0 to +4.5 mm (into material)", nozzle: "Single, Ø3.0 mm",
    nozzleDistance: "1.5–2.0 mm", pierce: "4–7 s, progressive pierce; consider pre-pierce cycle",
  }),
  fiberCut({
    material: "Mild Steel", thicknessMm: 20, powerBand: "8 kW–15 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.2–0.4 bar", speed: "350–600 mm/min",
    focus: "+3.5 to +5.0 mm (into material)", nozzle: "Single, Ø3.5 mm",
    nozzleDistance: "1.5–2.5 mm", pierce: "6–12 s, progressive pierce; pre-pierce strongly recommended",
  }),
  fiberCut({
    material: "Mild Steel", thicknessMm: 25, powerBand: "10 kW–20 kW",
    gas: "Oxygen (O₂)", gasPressure: "0.15–0.35 bar", speed: "250–450 mm/min",
    focus: "+4.0 to +6.0 mm (into material)", nozzle: "Single, Ø4.0 mm",
    nozzleDistance: "2.0–3.0 mm", pierce: "10–20 s, progressive pierce; pre-pierce required",
  }),

  // ─── STAINLESS STEEL (N2 for clean, oxide-free edge) ────────────────────────
  fiberCut({
    material: "Stainless Steel", thicknessMm: 3, powerBand: "2 kW–4 kW",
    gas: "Nitrogen (N₂)", gasPressure: "12–15 bar", speed: "4,500–6,000 mm/min",
    focus: "−1.0 to −2.0 mm (below surface)", nozzle: "Double, Ø1.5 mm",
    nozzleDistance: "0.5–0.8 mm", pierce: "0.3–0.5 s",
    notes: { gas: "High-pressure N₂ blows out molten metal for a bright, oxide-free edge — purity matters a lot here." },
  }),
  fiberCut({
    material: "Stainless Steel", thicknessMm: 5, powerBand: "3 kW–6 kW",
    gas: "Nitrogen (N₂)", gasPressure: "14–18 bar", speed: "2,800–3,800 mm/min",
    focus: "−1.5 to −3.0 mm (below surface)", nozzle: "Double, Ø2.0 mm",
    nozzleDistance: "0.5–0.8 mm", pierce: "0.5–0.8 s",
  }),
  fiberCut({
    material: "Stainless Steel", thicknessMm: 8, powerBand: "4 kW–8 kW",
    gas: "Nitrogen (N₂)", gasPressure: "16–20 bar", speed: "1,600–2,400 mm/min",
    focus: "−2.5 to −4.0 mm (below surface)", nozzle: "Double, Ø2.5 mm",
    nozzleDistance: "0.6–1.0 mm", pierce: "0.8–1.5 s",
  }),
  fiberCut({
    material: "Stainless Steel", thicknessMm: 10, powerBand: "6 kW–10 kW",
    gas: "Nitrogen (N₂)", gasPressure: "18–24 bar", speed: "1,100–1,700 mm/min",
    focus: "−3.0 to −5.0 mm (below surface)", nozzle: "Double, Ø3.0 mm",
    nozzleDistance: "0.6–1.0 mm", pierce: "1.5–2.5 s",
  }),
  fiberCut({
    material: "Stainless Steel", thicknessMm: 12, powerBand: "6 kW–12 kW",
    gas: "Nitrogen (N₂)", gasPressure: "20–25 bar", speed: "800–1,300 mm/min",
    focus: "−4.0 to −6.0 mm (below surface)", nozzle: "Double, Ø3.0 mm",
    nozzleDistance: "0.8–1.2 mm", pierce: "2.5–4 s",
  }),
  fiberCut({
    material: "Stainless Steel", thicknessMm: 16, powerBand: "8 kW–15 kW",
    gas: "Nitrogen (N₂)", gasPressure: "22–28 bar", speed: "500–900 mm/min",
    focus: "−5.0 to −7.0 mm (below surface)", nozzle: "Double, Ø3.5 mm",
    nozzleDistance: "0.8–1.5 mm", pierce: "4–7 s; consider O₂-assisted pierce then switch to N₂",
  }),
  fiberCut({
    material: "Stainless Steel", thicknessMm: 20, powerBand: "10 kW–20 kW",
    gas: "Nitrogen (N₂)", gasPressure: "24–30 bar", speed: "300–600 mm/min",
    focus: "−6.0 to −9.0 mm (below surface)", nozzle: "Double, Ø4.0 mm",
    nozzleDistance: "1.0–2.0 mm", pierce: "6–12 s; pre-pierce recommended",
  }),

  // ─── ALUMINUM (N2, reflective — care on thin) ───────────────────────────────
  fiberCut({
    material: "Aluminum", thicknessMm: 3, powerBand: "2 kW–4 kW",
    gas: "Nitrogen (N₂)", gasPressure: "12–16 bar", speed: "3,500–5,000 mm/min",
    focus: "−1.0 to −2.0 mm (below surface)", nozzle: "Double, Ø1.5 mm",
    nozzleDistance: "0.5–0.8 mm", pierce: "0.4–0.6 s",
    notes: { gas: "Aluminum is reflective; enable back-reflection protection and never aim at a stationary reflective surface." },
  }),
  fiberCut({
    material: "Aluminum", thicknessMm: 5, powerBand: "3 kW–6 kW",
    gas: "Nitrogen (N₂)", gasPressure: "14–18 bar", speed: "2,200–3,200 mm/min",
    focus: "−2.0 to −3.5 mm (below surface)", nozzle: "Double, Ø2.0 mm",
    nozzleDistance: "0.5–0.8 mm", pierce: "0.6–1.0 s",
  }),
  fiberCut({
    material: "Aluminum", thicknessMm: 8, powerBand: "4 kW–8 kW",
    gas: "Nitrogen (N₂)", gasPressure: "16–22 bar", speed: "1,200–1,900 mm/min",
    focus: "−3.0 to −5.0 mm (below surface)", nozzle: "Double, Ø2.5 mm",
    nozzleDistance: "0.6–1.0 mm", pierce: "1.0–2.0 s",
  }),
  fiberCut({
    material: "Aluminum", thicknessMm: 10, powerBand: "6 kW–10 kW",
    gas: "Nitrogen (N₂)", gasPressure: "18–24 bar", speed: "800–1,400 mm/min",
    focus: "−4.0 to −6.0 mm (below surface)", nozzle: "Double, Ø3.0 mm",
    nozzleDistance: "0.6–1.0 mm", pierce: "2.0–3.5 s",
  }),
  fiberCut({
    material: "Aluminum", thicknessMm: 12, powerBand: "6 kW–12 kW",
    gas: "Nitrogen (N₂)", gasPressure: "20–26 bar", speed: "550–1,000 mm/min",
    focus: "−5.0 to −7.0 mm (below surface)", nozzle: "Double, Ø3.0–3.5 mm",
    nozzleDistance: "0.8–1.2 mm", pierce: "3.5–6 s; burr on bottom edge is common — deburr in finishing",
  }),

  // ─── BRASS / COPPER (highly reflective — high-power N2) ──────────────────────
  fiberCut({
    material: "Brass", thicknessMm: 3, powerBand: "3 kW–6 kW",
    gas: "Nitrogen (N₂)", gasPressure: "14–18 bar", speed: "1,800–2,800 mm/min",
    focus: "−1.0 to −2.5 mm (below surface)", nozzle: "Double, Ø2.0 mm",
    nozzleDistance: "0.5–0.8 mm", pierce: "0.6–1.0 s",
    notes: { gas: "Brass and copper are highly reflective; back-reflection protection is mandatory. Higher power helps couple the beam." },
  }),
  fiberCut({
    material: "Copper", thicknessMm: 3, powerBand: "4 kW–8 kW",
    gas: "Nitrogen (N₂)", gasPressure: "16–20 bar", speed: "1,200–2,000 mm/min",
    focus: "−1.0 to −2.5 mm (below surface)", nozzle: "Double, Ø2.0 mm",
    nozzleDistance: "0.5–0.8 mm", pierce: "0.8–1.4 s",
    notes: { gas: "Copper is the most reflective common metal. Use a machine rated for it and enable back-reflection protection." },
  }),
];

// ─── GALVO / MOPA MARKING + ENGRAVING (secondary niche) ────────────────────────
const GALVO_SETTINGS: SeoSetting[] = [
  {
    slug: "stainless-steel-color-marking-mopa-fiber-laser",
    material: "Stainless Steel (color marking)",
    thicknessMm: null,
    laserType: "fiber-engraving",
    laserTypeLabel: "MOPA Fiber Galvo",
    powerBand: "20 W–60 W MOPA",
    industrial: false,
    targetQuery: "Best MOPA fiber laser settings for color marking stainless steel",
    intro:
      "Color marking on stainless relies on a thin oxide layer whose thickness sets the perceived color, " +
      "so it is extremely sensitive to pulse duration, frequency, and speed. These are starting points for a " +
      "20–60 W MOPA galvo — your exact color will shift with your machine, lens, and the specific alloy. " +
      "Run a parameter array (a grid sweeping speed × frequency × pulse width) and pick the squares you like.",
    params: [
      { label: "Pulse duration", value: "4–8 ns (MOPA, short pulse for color)", note: "The single most important knob for color." },
      { label: "Frequency", value: "60–200 kHz", note: "Higher frequency tends toward cooler blues/purples." },
      { label: "Speed", value: "200–800 mm/s" },
      { label: "Power", value: "20–45% (avg power, not peak)" },
      { label: "Line interval / hatch", value: "0.005–0.02 mm" },
      { label: "Passes", value: "1 (color marking is single-pass)" },
      { label: "Lens", value: "f-163 (110×110 mm field) typical" },
    ],
    tips: [
      "Color marking is the least repeatable process in laser work — build and save a parameter array for each alloy.",
      "Keep the part clean and the surface in focus; defocus changes the color dramatically.",
      "Ambient temperature and the specific 304 vs 316 alloy will shift colors; re-test per batch.",
    ],
    faqs: [
      {
        question: "What MOPA settings make blue on stainless steel?",
        answer:
          "Blue typically appears toward shorter pulse widths (around 4–8 ns) with frequency in the 60–200 kHz range and moderate speed. " +
          "There is no universal blue — run a frequency × speed array on your exact machine and alloy and pick the square you want.",
      },
      {
        question: "Why is my color different from someone else's settings?",
        answer:
          "Color marking depends on the precise oxide thickness, which is set by your laser's pulse shape, lens, alloy, surface finish, and even room temperature. " +
          "Treat shared settings as a starting array, not a recipe.",
      },
    ],
    related: [],
  },
  {
    slug: "anodized-aluminum-engraving-fiber-galvo-laser",
    material: "Anodized Aluminum",
    thicknessMm: null,
    laserType: "fiber-engraving",
    laserTypeLabel: "Fiber Galvo",
    powerBand: "20 W–50 W",
    industrial: false,
    targetQuery: "Best fiber galvo laser settings for engraving anodized aluminum",
    intro:
      "Marking anodized aluminum bleaches the dye to expose the white substrate — it is fast and forgiving, " +
      "which makes it a great first galvo job. These starting points produce a crisp white mark; dial speed up " +
      "until the contrast just holds.",
    params: [
      { label: "Power", value: "20–40%" },
      { label: "Speed", value: "1,000–2,500 mm/s" },
      { label: "Frequency", value: "20–60 kHz" },
      { label: "Line interval / hatch", value: "0.01–0.03 mm" },
      { label: "Passes", value: "1" },
      { label: "Pulse duration", value: "Not critical (Q-switch fine; MOPA optional)" },
    ],
    tips: [
      "Push speed up until the white mark just starts to lose contrast, then back off ~10%.",
      "Too much power can burn through the anodize layer into bare aluminum and look gray, not white.",
    ],
    faqs: [
      {
        question: "How do you engrave anodized aluminum with a fiber laser?",
        answer:
          "Anodized aluminum marks by bleaching the colored dye to reveal the white oxide underneath. " +
          "Start around 20–40% power, 1,000–2,500 mm/s, single pass, and increase speed until the white mark just holds.",
      },
    ],
    related: [],
  },
  {
    slug: "deep-engraving-mild-steel-fiber-galvo-laser",
    material: "Mild Steel (deep engraving)",
    thicknessMm: null,
    laserType: "fiber-engraving",
    laserTypeLabel: "Fiber Galvo",
    powerBand: "50 W–100 W",
    industrial: true,
    targetQuery: "Best fiber laser settings for deep engraving mild steel",
    intro:
      "Deep engraving removes material pass after pass, so total depth is mostly a function of pass count and power. " +
      "These are starting points for a 50–100 W galvo; expect to run many passes for visible depth and to refocus " +
      "between depth steps on tall features.",
    params: [
      { label: "Power", value: "80–100%" },
      { label: "Speed", value: "300–800 mm/s" },
      { label: "Frequency", value: "20–40 kHz (lower = more peak energy per pulse)" },
      { label: "Passes", value: "20–80+ depending on target depth" },
      { label: "Line interval / hatch", value: "0.02–0.04 mm, cross-hatch (0°/90°)" },
      { label: "Refocus", value: "Step focus down ~0.1 mm per several passes for deep cavities" },
    ],
    tips: [
      "Cross-hatching (alternating 0°/90° fill) gives a flatter, cleaner cavity floor.",
      "Air assist or a fume extractor keeps debris from re-depositing and slowing subsequent passes.",
      "Depth per pass is small and varies with focus — measure after a known pass count to calibrate.",
    ],
    faqs: [
      {
        question: "How many passes to deep-engrave steel with a fiber laser?",
        answer:
          "Depth builds up gradually. A 50–100 W galvo typically needs anywhere from 20 to 80+ passes at full power and 20–40 kHz, " +
          "refocusing as the cavity deepens. Calibrate by measuring depth after a known number of passes on a test coupon.",
      },
    ],
    related: [],
  },
  {
    slug: "plastic-marking-uv-laser",
    material: "Plastics (light-colored)",
    thicknessMm: null,
    laserType: "uv-marking",
    laserTypeLabel: "UV Laser (355 nm)",
    powerBand: "3 W–5 W UV",
    industrial: false,
    targetQuery: "Best UV laser settings for marking plastics",
    intro:
      "UV (355 nm) marks plastics by a cold photochemical process rather than heat, giving high-contrast marks " +
      "with minimal melting — ideal on light plastics and where a heat-affected zone is unacceptable. These are " +
      "gentle starting points; UV couples efficiently, so less is more.",
    params: [
      { label: "Power", value: "20–50%" },
      { label: "Speed", value: "500–2,000 mm/s" },
      { label: "Frequency", value: "30–80 kHz" },
      { label: "Passes", value: "1–2" },
      { label: "Line interval / hatch", value: "0.01–0.02 mm" },
    ],
    tips: [
      "UV needs far less power than fiber on plastics — start low to avoid melting or foaming.",
      "Different polymers (ABS vs PC vs PP) respond very differently; test per material.",
    ],
    faqs: [
      {
        question: "Why use a UV laser to mark plastic?",
        answer:
          "UV light marks via a cold photochemical reaction, producing crisp high-contrast marks with almost no heat-affected zone or melting, " +
          "which fiber and CO₂ struggle with on many plastics.",
      },
    ],
    related: [],
  },
];

// ─── A COUPLE OF CO2 NON-METAL ENTRIES (broad reach, clearly secondary) ─────────
const CO2_SETTINGS: SeoSetting[] = [
  {
    slug: "3mm-acrylic-co2-laser-cutting",
    material: "Cast Acrylic",
    thicknessMm: 3,
    laserType: "co2-cutting",
    laserTypeLabel: "CO₂ Laser",
    powerBand: "40 W–80 W",
    industrial: false,
    targetQuery: "Best CO2 laser settings for cutting 3mm acrylic",
    intro:
      "Cast acrylic cuts beautifully on CO₂ with a flame-polished edge. These are starting points for a 40–80 W tube; " +
      "your optics, mirror alignment, and tube age all shift the numbers, so confirm with a quick speed ladder.",
    params: [
      { label: "Power", value: "65–85%" },
      { label: "Speed", value: "8–18 mm/s (≈480–1,080 mm/min)", note: "Higher wattage tubes run the upper end." },
      { label: "Passes", value: "1" },
      { label: "Air assist", value: "Low (keep flame polish; too much air frosts the edge)" },
      { label: "Focus", value: "On surface or ~1/3 into material" },
    ],
    tips: [
      "Low air assist preserves the glossy flame-polished edge; high air assist gives a matte/frosted edge.",
      "Slowing down for a glossier edge beats adding a second pass, which can double-mark the edge.",
    ],
    faqs: [
      {
        question: "What CO2 settings cut 3mm acrylic with a clean edge?",
        answer:
          "On a 40–80 W CO₂ laser, start around 65–85% power, 8–18 mm/s, single pass, with low air assist for a flame-polished edge. " +
          "Adjust for your tube's true output and optics condition.",
      },
    ],
    related: [],
  },
  {
    slug: "3mm-plywood-co2-laser-cutting",
    material: "Birch Plywood",
    thicknessMm: 3,
    laserType: "co2-cutting",
    laserTypeLabel: "CO₂ Laser",
    powerBand: "40 W–80 W",
    industrial: false,
    targetQuery: "Best CO2 laser settings for cutting 3mm plywood",
    intro:
      "Plywood is the least repeatable common CO₂ material — glue lines and voids vary batch to batch, so these are " +
      "deliberately conservative starting points. Expect to re-test when you change suppliers or even batches.",
    params: [
      { label: "Power", value: "70–90%" },
      { label: "Speed", value: "6–12 mm/s (≈360–720 mm/min)" },
      { label: "Passes", value: "1 (add a second only if it doesn't fully sever)" },
      { label: "Air assist", value: "High (reduces charring and flare-ups)" },
      { label: "Focus", value: "On surface" },
    ],
    tips: [
      "Glue-line voids cause inconsistent cuts — strong air assist and a slightly slower speed help.",
      "Batch-to-batch plywood swings are large; never trust a number across a supplier change without a quick test.",
    ],
    faqs: [
      {
        question: "Why are my plywood cuts inconsistent on the laser?",
        answer:
          "Plywood glue lines, voids, and moisture vary significantly between sheets and suppliers. Use strong air assist, a conservative speed, " +
          "and re-run a small test square whenever you change material batches.",
      },
    ],
    related: [],
  },
];

/**
 * Build the final list with computed `related` links.
 * Related = same material (other thicknesses) first, then same laser type, capped.
 */
function withRelated(all: SeoSetting[]): SeoSetting[] {
  const baseMaterial = (m: string) => m.split("(")[0].trim().toLowerCase();
  return all.map((s) => {
    const sameMaterial = all
      .filter((o) => o.slug !== s.slug && baseMaterial(o.material) === baseMaterial(s.material))
      .sort((a, b) => (a.thicknessMm ?? 0) - (b.thicknessMm ?? 0))
      .map((o) => o.slug);
    const sameType = all
      .filter((o) => o.slug !== s.slug && o.laserType === s.laserType && !sameMaterial.includes(o.slug))
      .map((o) => o.slug);
    const related = [...sameMaterial, ...sameType].slice(0, 6);
    return { ...s, related };
  });
}

export const SEO_SETTINGS: SeoSetting[] = withRelated([
  ...RAW_SETTINGS,
  ...GALVO_SETTINGS,
  ...CO2_SETTINGS,
]);

export function getSettingBySlug(slug: string): SeoSetting | undefined {
  return SEO_SETTINGS.find((s) => s.slug === slug);
}

export function getRelatedSettings(slug: string): SeoSetting[] {
  const s = getSettingBySlug(slug);
  if (!s) return [];
  return s.related
    .map((rs) => getSettingBySlug(rs))
    .filter((x): x is SeoSetting => Boolean(x));
}

/** Last meaningful content update — used for sitemap lastModified. Bump when editing data. */
export const SEO_CONTENT_LAST_UPDATED = "2026-06-28";
