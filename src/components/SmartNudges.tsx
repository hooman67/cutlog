"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// localStorage keys
const SUGGEST_VISITS_KEY = "cutlog-suggest-visits";
const HAS_IMPORTED_KEY = "cutlog-has-imported";
const FEEDBACK_GIVEN_KEY = "cutlog-feedback-given";
const NUDGE_IMPORT_SHOWN_KEY = "cutlog-nudge-import-shown";
const NUDGE_FEEDBACK_SHOWN_KEY = "cutlog-nudge-feedback-shown";
const CUTS_LOGGED_KEY = "cutlog-cuts-logged";
const MACHINE_SETUP_KEY = "cutlog-machine-setup";
const NUDGE_SCALING_SHOWN_KEY = "cutlog-nudge-scaling-shown";
const NUDGE_CONSERVATIVE_SHOWN_KEY = "cutlog-nudge-conservative-shown";
const NUDGE_ENGRAVING_SHOWN_KEY = "cutlog-nudge-engraving-shown";
const SEARCH_WITH_NO_RESULTS_KEY = "cutlog-search-no-results";

interface NudgeConfig {
  id: string;
  message: string;
  linkText?: string;
  linkHref?: string;
}

const AUTO_DISMISS_MS = 8000;

export default function SmartNudges() {
  const [activeNudge, setActiveNudge] = useState<NudgeConfig | null>(null);
  const [dismissing, setDismissing] = useState(false);
  const pathname = usePathname();

  const dismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(() => {
      setActiveNudge(null);
      setDismissing(false);
    }, 300);
  }, []);

  // Track suggest page visits
  useEffect(() => {
    if (pathname === "/suggest") {
      const current = parseInt(localStorage.getItem(SUGGEST_VISITS_KEY) || "0", 10);
      localStorage.setItem(SUGGEST_VISITS_KEY, String(current + 1));
    }
    // Track if user searched and got no results
    if (pathname === "/suggest") {
      // We'll track this via data attribute on the page when search fails
    }
  }, [pathname]);

  // Evaluate nudges after route change
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Small delay so localStorage writes from this page load settle first
    const timeout = setTimeout(() => {
      const nudge = evaluateNudges();
      if (nudge) {
        setActiveNudge(nudge);
        setDismissing(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!activeNudge) return;
    const timer = setTimeout(() => {
      dismiss();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [activeNudge, dismiss]);

  if (!activeNudge) return null;

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-50 flex justify-center transition-all duration-300 ${
        dismissing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0 animate-slide-up"
      }`}
    >
      <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-amber-800/60 px-4 py-3 shadow-lg shadow-black/30">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 text-amber-400 text-sm mt-0.5">💡</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 leading-snug">
              {activeNudge.message}
            </p>
            {activeNudge.linkText && activeNudge.linkHref && (
              <Link
                href={activeNudge.linkHref}
                onClick={dismiss}
                className="inline-block mt-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                {activeNudge.linkText}
              </Link>
            )}
          </div>
          <button
            onClick={dismiss}
            className="flex-shrink-0 p-1 -mr-1 -mt-0.5 rounded-full hover:bg-zinc-800 transition-colors"
            aria-label="Dismiss tip"
          >
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function evaluateNudges(): NudgeConfig | null {
  if (typeof window === "undefined") return null;

  // Nudge A: User visits /suggest 3+ times but has never imported a .clb file
  const suggestVisits = parseInt(localStorage.getItem(SUGGEST_VISITS_KEY) || "0", 10);
  const hasImported = localStorage.getItem(HAS_IMPORTED_KEY) === "true";
  const nudgeImportShown = localStorage.getItem(NUDGE_IMPORT_SHOWN_KEY) === "true";

  if (suggestVisits >= 3 && !hasImported && !nudgeImportShown) {
    localStorage.setItem(NUDGE_IMPORT_SHOWN_KEY, "true");
    return {
      id: "import-nudge",
      message: "Tip: You can drag in a .clb file to import your whole LightBurn library at once.",
      linkText: "Go to Import",
      linkHref: "/import",
    };
  }

  // Nudge B: User has logged 3+ cuts but never used feedback buttons on /suggest
  const cutsLogged = parseInt(localStorage.getItem(CUTS_LOGGED_KEY) || "0", 10);
  // Check both the dedicated flag and whether any speed feedback entries exist
  const feedbackFlagSet = localStorage.getItem(FEEDBACK_GIVEN_KEY) === "true";
  const speedFeedbackRaw = localStorage.getItem("cutlog_speed_feedback");
  const feedbackGiven = feedbackFlagSet || (speedFeedbackRaw !== null && speedFeedbackRaw !== "[]");
  const nudgeFeedbackShown = localStorage.getItem(NUDGE_FEEDBACK_SHOWN_KEY) === "true";

  if (cutsLogged >= 3 && !feedbackGiven && !nudgeFeedbackShown) {
    localStorage.setItem(NUDGE_FEEDBACK_SHOWN_KEY, "true");
    return {
      id: "feedback-nudge",
      message: "Tip: Use the Too Slow / Perfect / Too Fast buttons after trying a recommendation — it helps improve future suggestions.",
    };
  }

  // Nudge C: User has set up their machine profile
  const machineSetup = localStorage.getItem(MACHINE_SETUP_KEY) === "true";
  const nudgeScalingShown = localStorage.getItem(NUDGE_SCALING_SHOWN_KEY) === "true";

  if (machineSetup && !nudgeScalingShown) {
    localStorage.setItem(NUDGE_SCALING_SHOWN_KEY, "true");
    return {
      id: "scaling-nudge",
      message: "We've auto-configured scaling for your lens. Update your machine profile if your lens changes.",
      linkText: "Machine Profile",
      linkHref: "/machine",
    };
  }

  // Nudge D: User searched but found no exact match
  const searchNoResults = localStorage.getItem(SEARCH_WITH_NO_RESULTS_KEY) === "true";
  const nudgeConservativeShown = localStorage.getItem(NUDGE_CONSERVATIVE_SHOWN_KEY) === "true";

  if (searchNoResults && !nudgeConservativeShown) {
    localStorage.setItem(NUDGE_CONSERVATIVE_SHOWN_KEY, "true");
    localStorage.removeItem(SEARCH_WITH_NO_RESULTS_KEY); // Clear after showing once
    return {
      id: "conservative-nudge",
      message: "All recommendations auto-scale for your lens. If speeds seem off, try the Conservative Quality profile.",
      linkText: "Learn More",
      linkHref: "/suggest",
    };
  }

  // Nudge E: For Galvo laser users (check if user has indicated engraving capability)
  const userPrefsRaw = localStorage.getItem("cutlog_user_prefs");
  let userHasGalvo = false;
  if (userPrefsRaw) {
    try {
      userHasGalvo = JSON.parse(userPrefsRaw).hasGalvo === true;
    } catch {
      userHasGalvo = false;
    }
  }
  const nudgeEngravingShown = localStorage.getItem(NUDGE_ENGRAVING_SHOWN_KEY) === "true";

  if (userHasGalvo && !nudgeEngravingShown) {
    localStorage.setItem(NUDGE_ENGRAVING_SHOWN_KEY, "true");
    return {
      id: "engraving-nudge",
      message: "You can now log engraving parameters (frequency, passes, scan angle) to get personalized recommendations.",
      linkText: "Log Engraving",
      linkHref: "/log",
    };
  }

  return null;
}
