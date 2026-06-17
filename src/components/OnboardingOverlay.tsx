"use client";

import { useEffect, useState } from "react";

const ONBOARDED_KEY = "cutlog-onboarded";

export default function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyOnboarded = localStorage.getItem(ONBOARDED_KEY);
    if (!alreadyOnboarded) {
      setVisible(true);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem(ONBOARDED_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-[400px] rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-xl animate-slide-up">
        <h2 className="text-xl font-bold text-zinc-100 mb-1">
          Welcome to CutLog!
        </h2>
        <p className="text-sm text-zinc-400 mb-5">
          Here&apos;s what you can do:
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 text-xl leading-none mt-0.5">🎯</span>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Get Speed Recommendations
              </p>
              <p className="text-xs text-zinc-400">
                Enter your material + thickness, get how fast to cut
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 text-xl leading-none mt-0.5">📂</span>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Import Your LightBurn Library
              </p>
              <p className="text-xs text-zinc-400">
                Drag in a .clb file, all your settings are instantly searchable
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 text-xl leading-none mt-0.5">🔧</span>
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Per-Machine Learning
              </p>
              <p className="text-xs text-zinc-400">
                Set up your machine and CutLog personalizes recommendations over time
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors"
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
