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
            Stop testing parameters.{" "}
            <span className="text-emerald-400">AI learns your machine.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">
            The average operator wastes 2–3 sheets per new material. That's <span className="text-emerald-300 font-semibold">$100–450</span> before getting one good cut. CutLog eliminates that.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/waitlist"
              className="px-8 py-4 rounded-lg bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors"
            >
              Join the Beta Waitlist
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
            {/* Feature 1: AI scales your setup */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-700/50 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-3">AI scales your setup</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                When you change lenses, AI automatically adjusts power. No manual tweaking.
              </p>
            </div>

            {/* Feature 2: AI trained on 500+ verified setups */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-700/50 transition-colors">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-lg font-semibold mb-3">AI trained on 500+ verified setups</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Fiber, CO2, diode, engraving, cutting. AI knows your use case.
              </p>
            </div>

            {/* Feature 3: AI gets smarter every cut */}
            <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700 hover:border-emerald-700/50 transition-colors">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-3">AI gets smarter every cut</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                <span className="text-emerald-300 font-semibold">87% accuracy</span> vs. expert-tested data. Improves as you log cuts.
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
                <p className="text-zinc-400">Pick your material (acrylic, leather, wood, etc.) and thickness. CutLog searches its database of 500+ pro parameters.</p>
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
                <h3 className="text-lg font-semibold mb-2">Get personalized recommendations</h3>
                <p className="text-zinc-400">Receive speed, power, and frequency recommendations calibrated for your exact setup. One good cut on the first try.</p>
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
          <h2 className="text-3xl font-bold">Join 50+ Operators on the Beta Waitlist</h2>
          <p className="text-zinc-400">
            Get early access to CutLog. No credit card required. Start eliminating material waste in your shop.
          </p>

          <Link
            href="/waitlist"
            className="inline-block px-8 py-4 rounded-lg bg-emerald-600 text-zinc-950 font-semibold hover:bg-emerald-500 transition-colors"
          >
            Get Early Access
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>© 2026 CutLog. Built for laser operators.</p>
          <div className="flex gap-6">
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
