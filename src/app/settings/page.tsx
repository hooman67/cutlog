import type { Metadata } from "next";
import Link from "next/link";
import { SEO_SETTINGS, type SeoSetting } from "@/data/seo-settings";

const SITE_URL = "https://cutlog-two.vercel.app";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Laser Cutting & Engraving Settings Library | CutLog",
  description:
    "Conservative starting-point parameters for fiber laser metal cutting (mild steel, stainless, aluminum, 3–25mm), galvo/MOPA marking, and CO₂ — each with the material-test workflow to dial it in for your machine.",
  alternates: { canonical: `${SITE_URL}/settings` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/settings`,
    title: "Laser Cutting & Engraving Settings Library | CutLog",
    description: "Starting-point laser parameters for metal fiber cutting, galvo marking, and CO₂ — plus how to dial them in.",
    siteName: "CutLog",
  },
};

function groupKey(s: SeoSetting): string {
  if (s.laserType === "fiber-cutting") return "Fiber Laser Metal Cutting";
  if (s.laserType === "fiber-engraving") return "Fiber Galvo / MOPA Marking & Engraving";
  if (s.laserType === "uv-marking") return "UV Marking";
  if (s.laserType.startsWith("co2")) return "CO₂ Cutting & Engraving";
  return "Other";
}

const GROUP_ORDER = [
  "Fiber Laser Metal Cutting",
  "Fiber Galvo / MOPA Marking & Engraving",
  "UV Marking",
  "CO₂ Cutting & Engraving",
];

export default function SettingsIndexPage() {
  const groups: Record<string, SeoSetting[]> = {};
  for (const s of SEO_SETTINGS) {
    const k = groupKey(s);
    (groups[k] ??= []).push(s);
  }
  for (const k of Object.keys(groups)) {
    groups[k].sort(
      (a: SeoSetting, b: SeoSetting) =>
        a.material.localeCompare(b.material) || (a.thicknessMm ?? 0) - (b.thicknessMm ?? 0),
    );
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SEO_SETTINGS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/settings/${s.slug}`,
      name: s.targetQuery,
    })),
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/landing" className="text-xl font-bold text-emerald-400">CutLog</Link>
          <Link href="https://cutlog-two.vercel.app/auth" className="text-sm px-4 py-2 rounded-lg border border-emerald-700 text-emerald-400 hover:bg-emerald-950/30 transition-colors">
            Open the app
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Laser settings library</h1>
          <p className="text-zinc-400 leading-relaxed">
            Conservative <strong className="text-zinc-200">starting-point</strong> parameters for laser cutting and engraving —
            led by industrial thick-metal fiber cutting. Each page gives a tested baseline plus the material-test workflow to
            dial it in for your exact machine. They shrink your test; they don&apos;t replace it.
          </p>
        </header>

        {GROUP_ORDER.filter((g) => groups[g]?.length).map((g) => (
          <section key={g} className="space-y-4">
            <h2 className="text-2xl font-semibold">{g}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {groups[g].map((s) => (
                <Link
                  key={s.slug}
                  href={`/settings/${s.slug}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 hover:border-emerald-800/60 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-200">{s.targetQuery}</span>
                  <span className="block mt-1 text-xs text-zinc-500">
                    {s.laserTypeLabel}{s.powerBand ? ` · ${s.powerBand}` : ""}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/40 to-zinc-900/40 p-6 text-center space-y-4">
          <h2 className="text-xl font-bold">Want a starting point for your exact machine?</h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            CutLog calibrates the baseline to your wattage and lens, then remembers every cut you log.
          </p>
          <Link href="https://cutlog-two.vercel.app/suggest" className="inline-block px-6 py-3 rounded-lg bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors">
            Get my starting point
          </Link>
        </section>
      </div>
    </main>
  );
}
