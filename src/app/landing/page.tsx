"use client";

import Link from "next/link";

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur border-b border-zinc-800/50 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-emerald-400">CutLog</div>
          <Link
            href="/auth"
            className="text-sm px-4 py-2 rounded-lg border border-emerald-700 text-emerald-400 hover:bg-emerald-950/30 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Dial in thick stainless &amp; mild steel{" "}
            <span className="text-emerald-400">in fewer test cuts.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">
            Every machine is different — so we don&apos;t sell you a magic number. CutLog gives you a <span className="text-emerald-300 font-semibold">trusted starting point</span> for gas, pressure, nozzle, focus, pierce and passes, plus a one-click LightBurn test grid. Burn fewer sheets dialing in 6–25mm metal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="https://cutlog-two.vercel.app/auth"
              className="px-8 py-4 rounded-lg bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors"
            >
              Try CutLog Free
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Operators Love CutLog</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Honest starting point */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-700/50 transition-colors">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-3">An honest starting point</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Full cutting parameters for 6–25mm steel, stainless and aluminum: assist gas &amp; pressure, nozzle, focus, pierce and passes. Not a magic number — a head start.
              </p>
            </div>

            {/* Feature 2: Energy-normalized transfer */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-700/50 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-3">Transfers to your wattage</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                A power % doesn&apos;t carry across machines. CutLog normalizes to energy-per-length (J/mm) and scales a setting to your laser&apos;s wattage automatically.
              </p>
            </div>

            {/* Feature 3: One-click test grid */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-700/50 transition-colors">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-lg font-semibold mb-3">One-click test grid</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Generate a LightBurn material-test grid that sweeps speed or power. Run it once, pick the cleanest row, and confirm the setting for <em>your</em> machine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4" id="how-it-works">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-zinc-950 font-bold text-lg flex items-center justify-center">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Set up your machine</h3>
                <p className="text-zinc-400">Tell CutLog about your laser: brand, wattage, and current lens. Takes 1 minute.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-zinc-950 font-bold text-lg flex items-center justify-center">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Search material + thickness</h3>
                <p className="text-zinc-400">Pick your metal (mild steel, stainless, aluminum) and thickness — 6mm to 25mm. CutLog returns a starting point with gas, pressure, nozzle, focus and pierce, normalized to your wattage. Engraving materials supported too.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-zinc-950 font-bold text-lg flex items-center justify-center">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Confirm with a test grid</h3>
                <p className="text-zinc-400">Generate a LightBurn material-test grid from your starting point, run it once, and lock in the exact setting for your machine — fewer wasted sheets, faster to production.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">What Operators Are Saying</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700">
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                &ldquo;Even if it gets people in the ballpark for material testing that&apos;s 90% there!&rdquo;
              </p>
              <div>
                <p className="font-semibold text-zinc-100">Nate Keen</p>
                <p className="text-xs text-zinc-500">Galvo Laser Operator</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700">
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                &ldquo;This is exactly what I&apos;ve been looking for&rdquo;
              </p>
              <div>
                <p className="font-semibold text-zinc-100">Jeremy Hubert</p>
                <p className="text-xs text-zinc-500">LightBurn Power User</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700">
              <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                &ldquo;Finally, a tool that understands my machine&rdquo;
              </p>
              <div>
                <p className="font-semibold text-zinc-100">John Stegenga</p>
                <p className="text-xs text-zinc-500">Multi-Machine Operator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-gradient-to-br from-emerald-950/40 to-zinc-900/40 p-8 rounded-2xl border border-emerald-900/30">
          <h2 className="text-3xl font-bold">50+ Operators Are Using CutLog</h2>
          <p className="text-zinc-400">
            No credit card required. Set up your machine in 1 minute, get your first recommendation in 30 seconds.
          </p>

          <Link
            href="https://cutlog-two.vercel.app/auth"
            className="inline-block px-8 py-4 rounded-lg bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors"
          >
            Try It Now — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>© 2026 CutLog. Built for laser operators.</p>
          <div className="flex gap-6">
            <Link href="/waitlist" className="hover:text-zinc-300 transition-colors">
              Want updates instead? Join the waitlist
            </Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
