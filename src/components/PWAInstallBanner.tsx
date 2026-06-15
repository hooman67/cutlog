"use client";

import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const dismissed = localStorage.getItem(DISMISS_KEY);
  if (!dismissed) return false;
  const dismissedAt = parseInt(dismissed, 10);
  if (isNaN(dismissedAt)) return false;
  return Date.now() - dismissedAt < DISMISS_DURATION_MS;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const mobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const smallScreen = window.innerWidth <= 768;
  return mobileUA || smallScreen;
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua);
}

export default function PWAInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed, not mobile, or recently dismissed
    if (isStandalone() || !isMobile() || isDismissed()) {
      return;
    }

    // Listen for the beforeinstallprompt event (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // On iOS, there's no beforeinstallprompt, so show the banner anyway
    if (isIOS()) {
      setVisible(true);
    }

    // Small delay to also show on Android if the event already fired or won't fire
    const timeout = setTimeout(() => {
      if (!isStandalone() && isMobile() && !isDismissed()) {
        setVisible(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timeout);
    };
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
    setShowIOSInstructions(false);
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (deferredPrompt) {
      // Android/Chrome: trigger native install prompt
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        setVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS()) {
      // iOS: show manual instructions
      setShowIOSInstructions(true);
    }
  }, [deferredPrompt]);

  if (!visible) return null;

  // iOS instructions overlay
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 p-6 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Install CutLog</h3>
            <button
              onClick={dismiss}
              className="p-1 rounded-full hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4 text-sm text-zinc-300">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100">1</span>
              <p>
                Tap the{" "}
                <span className="inline-flex items-center gap-1">
                  <svg className="w-4 h-4 text-blue-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="font-medium text-blue-400">Share</span>
                </span>{" "}
                button in your browser toolbar
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100">2</span>
              <p>Scroll down and tap <span className="font-medium text-white">&quot;Add to Home Screen&quot;</span></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100">3</span>
              <p>Tap <span className="font-medium text-white">&quot;Add&quot;</span> in the top-right corner</p>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="mt-5 w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-zinc-300 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    );
  }

  // Main banner (bottom toast)
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-slide-up">
      <div className="w-full max-w-sm flex items-center gap-3 rounded-2xl bg-zinc-900 border border-zinc-700/80 px-4 py-3 shadow-lg shadow-black/30">
        {/* Phone icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-900/40 border border-emerald-800/50 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
          </svg>
        </div>

        {/* Text + action */}
        <button
          onClick={handleInstallClick}
          className="flex-1 text-left"
        >
          <p className="text-sm font-medium text-zinc-100">Install CutLog</p>
          <p className="text-xs text-zinc-400">Quick access from your home screen</p>
        </button>

        {/* Dismiss X */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 p-2 -mr-1 rounded-full hover:bg-zinc-800 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
