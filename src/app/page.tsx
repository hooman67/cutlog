"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Machine } from "@/lib/types";
import { DiscoveryHint } from "@/components/DiscoveryHint";

const ADMIN_EMAIL = "houman_sh2001@hotmail.com";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [cutCount, setCutCount] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      if (user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      }

      // Feature 6: Query for the active machine
      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .order("is_active", { ascending: false, nullsFirst: false })
        .limit(1);

      if (machines && machines.length > 0) {
        setMachine(machines[0]);
      }

      // Get cut count to determine if user is new
      const { count } = await supabase
        .from("cuts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setCutCount(count ?? 0);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-lg mx-auto">
      <header className="flex items-center justify-between mb-8 pt-2">
        <div>
          <h1 className="text-2xl font-bold">CutLog</h1>
          {machine && (
            <p className="text-sm text-zinc-500">
              {machine.nickname || machine.brand} · {machine.wattage_w ? (machine.wattage_w >= 1000 ? `${machine.wattage_w / 1000}kW` : `${machine.wattage_w}W`) : ""}
            </p>
          )}
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/auth");
          }}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          Sign out
        </button>
      </header>

      {/* Getting Started card for new users */}
      {cutCount === 0 && !machine && (
        <DiscoveryHint storageKey="home_getting_started" dismissable={true}>
          <p className="font-medium text-zinc-200 mb-2">Welcome to CutLog!</p>
          <p className="text-xs text-zinc-400 mb-2">Auto-scales parameters for your lens. Cutting & engraving. Validated against Etsy data.</p>
          <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 text-xs">
            <li>
              <Link href="/machine" className="text-sky-400 hover:text-sky-300">Set up your machine</Link>
            </li>
            <li>
              <Link href="/import" className="text-sky-400 hover:text-sky-300">Import your LightBurn library</Link>
              {" or "}
              <Link href="/log" className="text-sky-400 hover:text-sky-300">log your first cut</Link>
            </li>
            <li>
              <Link href="/suggest" className="text-sky-400 hover:text-sky-300">Get speed recommendations</Link>
            </li>
          </ol>
        </DiscoveryHint>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => router.push("/log")}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-emerald-900/30 border border-emerald-800 hover:bg-emerald-900/50 transition-colors"
        >
          <span className="text-3xl mb-2">✂️</span>
          <span className="font-semibold">Log a Cut</span>
          <span className="text-xs text-zinc-400 mt-1">30 seconds</span>
        </button>

        <button
          onClick={() => router.push("/suggest")}
          className="flex flex-col items-center justify-center p-6 rounded-2xl bg-blue-900/30 border border-blue-800 hover:bg-blue-900/50 transition-colors"
        >
          <span className="text-3xl mb-2">🔍</span>
          <span className="font-semibold">Get Suggestion</span>
          <span className="text-xs text-zinc-400 mt-1">Find parameters</span>
        </button>
      </div>

      <button
        onClick={() => router.push("/history")}
        className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 transition-colors text-left mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Cut History</span>
            <p className="text-sm text-zinc-500">View & search your logged cuts</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => router.push("/import")}
        className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 transition-colors text-left mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Import LightBurn Library</span>
            <p className="text-sm text-zinc-500">Upload .clb files to add parameters</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => router.push("/machine")}
        className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 transition-colors text-left mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Machine Settings</span>
            <p className="text-sm text-zinc-500">Update hours, calibration</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => router.push("/feedback")}
        className="w-full p-4 rounded-xl bg-violet-900/30 border border-violet-800 hover:bg-violet-900/50 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">💬 Feedback & Ideas</span>
            <p className="text-sm text-zinc-500">Bugs, features, or thoughts</p>
          </div>
        </div>
      </button>

      {isAdmin && (
        <button
          onClick={() => router.push("/admin")}
          className="w-full p-4 rounded-xl bg-amber-900/30 border border-amber-800 hover:bg-amber-900/50 transition-colors text-left mt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-amber-200">Admin Dashboard</span>
              <p className="text-sm text-amber-600">User management & site stats</p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
