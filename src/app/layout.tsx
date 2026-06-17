import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import SmartNudges from "@/components/SmartNudges";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CutLog",
  description: "Your machine's memory. Stop keeping parameters in your head.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <PWAInstallBanner />
        <OnboardingOverlay />
        <SmartNudges />
      </body>
    </html>
  );
}
