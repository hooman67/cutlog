import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import SmartNudges from "@/components/SmartNudges";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://cutlog-two.vercel.app"),
  title: {
    default: "CutLog — Laser Cutting & Engraving Settings, Calibrated to Your Machine",
    template: "%s | CutLog",
  },
  description:
    "A better starting point so you run fewer test squares. Conservative, tested laser parameters for fiber metal cutting (mild steel, stainless, aluminum, 3–25mm), galvo/MOPA marking, and CO₂ — plus the material-test workflow to dial them in for your exact machine.",
  keywords: [
    "laser cutting settings",
    "fiber laser parameters",
    "laser cutting chart",
    "best settings for laser cutting steel",
    "stainless steel fiber laser settings",
    "aluminum fiber laser cutting",
    "MOPA color marking settings",
    "galvo laser engraving settings",
    "laser material test",
    "CutLog",
  ],
  applicationName: "CutLog",
  manifest: "/manifest.json",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "CutLog",
    title: "CutLog — Laser Settings Calibrated to Your Machine",
    description:
      "A better starting point so you run fewer test squares. Tested laser parameters for fiber metal cutting, galvo marking, and CO₂ — plus how to dial them in.",
    url: "https://cutlog-two.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "CutLog — Laser Settings Calibrated to Your Machine",
    description:
      "A better starting point so you run fewer test squares. Tested laser parameters for fiber metal cutting, galvo marking, and CO₂.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Allow pinch-zoom: bright-shop legibility + WCAG. (Do not set maximumScale/userScalable.)
  viewportFit: "cover", // enables env(safe-area-inset-*) for installed PWA on iPhone
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen antialiased`}>
        {children}
        <footer className="text-center py-4 text-xs text-zinc-600">
          <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms &amp; Disclaimer</Link>
        </footer>
        <PWAInstallBanner />
        <OnboardingOverlay />
        <SmartNudges />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
