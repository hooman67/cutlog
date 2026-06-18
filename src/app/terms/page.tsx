import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8 pt-4">
        <Link href="/" className="text-zinc-400 hover:text-zinc-200 text-lg">&larr;</Link>
        <h1 className="text-2xl font-bold">Terms of Service &amp; Disclaimer</h1>
      </div>

      <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Use at Your Own Risk</h2>
          <p>
            CutLog provides parameter recommendations as starting points only. These are not guaranteed safe settings for your specific machine, material, or environment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Always Test First</h2>
          <p>
            Always test on scrap material before production cuts. Every laser machine behaves differently based on age, alignment, optics condition, and environment. A recommendation that works on one machine may not work on yours.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">No Liability</h2>
          <p>
            We are not responsible for material damage, machine damage, or personal injury resulting from the use of CutLog or any parameters suggested by this tool.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Data Sources</h2>
          <p>
            Parameter recommendations are community-sourced and AI-generated. They represent aggregated starting points, not verified safe values. Always verify before use on production material.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-2">Summary</h2>
          <p className="font-medium text-zinc-200">
            Use at your own risk. CutLog is a tool to help you find starting points faster, not a replacement for operator judgment and proper safety procedures.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-zinc-800 text-xs text-zinc-500">
        <p>Last updated: June 2026</p>
      </div>
    </div>
  );
}
