import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  SEO_SETTINGS,
  getSettingBySlug,
  getRelatedSettings,
  SEO_CONTENT_LAST_UPDATED,
} from "@/data/seo-settings";

const SITE_URL = "https://cutlog-two.vercel.app";
const APP_URL = "https://cutlog-two.vercel.app";

// Fully static — no Supabase, no runtime fetches.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_SETTINGS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const setting = getSettingBySlug(params.slug);
  if (!setting) return { title: "Not found" };

  const title = `${setting.targetQuery} (Starting Point) | CutLog`;
  const description =
    `${setting.targetQuery}: a conservative, tested starting point for ` +
    `${setting.laserTypeLabel}${setting.powerBand ? ` (${setting.powerBand})` : ""}, ` +
    `plus the material-test workflow to dial it in for your machine. From CutLog.`;
  const url = `${SITE_URL}/settings/${setting.slug}`;

  return {
    title,
    description,
    keywords: [
      setting.targetQuery.toLowerCase(),
      `${setting.material.toLowerCase()} laser settings`,
      setting.thicknessMm ? `${setting.thicknessMm}mm ${setting.material.toLowerCase()}` : setting.material.toLowerCase(),
      `${setting.laserTypeLabel.toLowerCase()} parameters`,
      "laser cutting settings",
      "laser parameters chart",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "CutLog",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function SettingPage({ params }: { params: { slug: string } }) {
  const setting = getSettingBySlug(params.slug);
  if (!setting) notFound();

  const related = getRelatedSettings(params.slug);
  const url = `${SITE_URL}/settings/${setting.slug}`;

  // ── Structured data ────────────────────────────────────────────────────────
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: setting.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to dial in ${setting.targetQuery.replace(/^Best /i, "")}`,
    description: `A repeatable material-test workflow to find reliable laser parameters for ${setting.material} on a ${setting.laserTypeLabel}.`,
    step: [
      { "@type": "HowToStep", name: "Start from a known-good baseline", text: "Begin with the conservative starting-point parameters on this page." },
      { "@type": "HowToStep", name: "Run a parameter test", text: "Cut a small grid (a speed/power array) on the actual material you will use." },
      { "@type": "HowToStep", name: "Evaluate edge quality", text: "Inspect for dross, burn, kerf width, and squareness; pick the best square." },
      { "@type": "HowToStep", name: "Log the result", text: "Record the winning parameters against this machine and material so you never re-test it." },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: setting.targetQuery,
    description: setting.intro,
    dateModified: SEO_CONTENT_LAST_UPDATED,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "CutLog" },
    publisher: { "@type": "Organization", name: "CutLog" },
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Nav */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/landing" className="text-xl font-bold text-emerald-400">CutLog</Link>
          <Link
            href={`${APP_URL}/auth`}
            className="text-sm px-4 py-2 rounded-lg border border-emerald-700 text-emerald-400 hover:bg-emerald-950/30 transition-colors"
          >
            Open the app
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-zinc-500" aria-label="Breadcrumb">
          <Link href="/landing" className="hover:text-zinc-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/settings" className="hover:text-zinc-300">Settings library</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">{setting.material}</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{setting.targetQuery}</h1>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">{setting.laserTypeLabel}</span>
            {setting.powerBand && <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">{setting.powerBand}</span>}
            {setting.thicknessMm != null && <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">{setting.thicknessMm} mm</span>}
            {setting.industrial && <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-900/50">Industrial</span>}
          </div>
          <p className="text-zinc-400 leading-relaxed">{setting.intro}</p>
        </header>

        {/* Honesty banner */}
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 text-sm text-amber-200/90">
          <strong className="text-amber-300">Starting point — not a recipe.</strong>{" "}
          Run a material test on your own machine. Every laser, lens, gas supply, and material batch is
          different. These numbers exist to shrink your test, not replace it.
        </div>

        {/* Parameter table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Recommended starting-point parameters</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <tbody>
                {setting.params.map((p, i) => (
                  <tr key={p.label} className={i % 2 ? "bg-zinc-900/40" : "bg-zinc-900/20"}>
                    <th scope="row" className="text-left align-top px-4 py-3 font-medium text-zinc-300 w-2/5">{p.label}</th>
                    <td className="px-4 py-3 align-top">
                      <span className="text-zinc-100 font-mono">{p.value}</span>
                      {p.note && <p className="mt-1 text-xs text-zinc-500 font-sans">{p.note}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips */}
        {setting.tips.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Dialing it in</h2>
            <ul className="space-y-3">
              {setting.tips.map((t, i) => (
                <li key={i} className="flex gap-3 text-sm text-zinc-300 leading-relaxed">
                  <span className="text-emerald-500 mt-0.5">›</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Material-test workflow */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">The material-test workflow</h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The fastest way to a reliable cut is not a perfect chart — it&apos;s a tight test loop that you only run once per
            machine/material combination, then never repeat:
          </p>
          <ol className="space-y-3 text-sm text-zinc-300">
            {[
              ["Start from this baseline.", "Load the starting-point numbers above as the center of your test."],
              ["Run a small array.", "Cut a grid that sweeps speed (and power, if cutting) ±20% around the baseline — typically 9–16 small squares."],
              ["Judge the edge.", "Look for dross, burn-back, kerf width, and squareness. Pick the square that meets your part's requirement, not the prettiest one."],
              ["Log it once.", "Save the winning parameters against this exact machine + material so the next job starts from your proven number — not a generic chart."],
            ].map(([title, body], i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-zinc-950 font-bold text-xs flex items-center justify-center">{i + 1}</span>
                <span><strong className="text-zinc-100">{title}</strong> {body}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-emerald-900/40 bg-gradient-to-br from-emerald-950/40 to-zinc-900/40 p-6 text-center space-y-4">
          <h2 className="text-xl font-bold">Stop re-running the same test square</h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mx-auto">
            CutLog gives you a starting point calibrated to your wattage and lens, then remembers every cut you log —
            so your machine builds its own proven library. Free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`${APP_URL}/suggest`} className="px-6 py-3 rounded-lg bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors">
              Get a starting point for my machine
            </Link>
            <Link href={`${APP_URL}/auth`} className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
              Open CutLog
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
          <div className="space-y-3">
            {setting.faqs.map((f, i) => (
              <details key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 group">
                <summary className="cursor-pointer font-medium text-zinc-200 list-none flex justify-between items-center">
                  {f.question}
                  <span className="text-zinc-500 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related internal links */}
        {related.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Related settings</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/settings/${r.slug}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 hover:border-emerald-800/60 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-200">{r.targetQuery}</span>
                  <span className="block mt-1 text-xs text-zinc-500">{r.laserTypeLabel}{r.powerBand ? ` · ${r.powerBand}` : ""}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-xs text-zinc-600 pt-4 border-t border-zinc-900">
          Last reviewed {SEO_CONTENT_LAST_UPDATED}. Values are conservative starting points generalized across brands and
          published cutting charts; always verify on your own machine.
        </p>
      </article>
    </main>
  );
}
