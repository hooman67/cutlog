"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DiscoveryHintProps {
  /** Unique key for localStorage dismissal tracking */
  storageKey: string;
  /** Whether this hint can be dismissed */
  dismissable?: boolean;
  children: React.ReactNode;
}

export function DiscoveryHint({ storageKey, dismissable = true, children }: DiscoveryHintProps) {
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash

  useEffect(() => {
    const stored = localStorage.getItem(`cutlog_hint_${storageKey}`);
    setDismissed(stored === "dismissed");
  }, [storageKey]);

  if (dismissed) return null;

  return (
    <div className="relative border border-sky-800/50 bg-sky-950/20 rounded-xl p-4 mb-4">
      {dismissable && (
        <button
          onClick={() => {
            localStorage.setItem(`cutlog_hint_${storageKey}`, "dismissed");
            setDismissed(true);
          }}
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300 text-sm leading-none p-1"
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
      <div className="text-sm text-zinc-300 pr-6">{children}</div>
    </div>
  );
}

interface HintLinkProps {
  href: string;
  children: React.ReactNode;
}

export function HintLink({ href, children }: HintLinkProps) {
  return (
    <Link href={href} className="text-sky-400 hover:text-sky-300 underline underline-offset-2">
      {children}
    </Link>
  );
}
