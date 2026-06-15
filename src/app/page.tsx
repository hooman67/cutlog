"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Machine } from "@/lib/types";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [machine, setMachine] = useState<Machine | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      if (!machines || machines.length === 0) {
        router.push("/machine");
        return;
      }

      setMachine(machines[0]);
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
          <p className="text-sm text-zinc-500">
            {machine?.nickname || machine?.brand} · {machine?.wattage_w ? `${machine.wattage_w / 1000}kW` : ""}
          </p>
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
          <span className="text-zinc-600">→</span>
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
          <span className="text-zinc-600">→</span>
        </div>
      </button>

      <button
        onClick={() => router.push("/machine")}
        className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/80 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Machine Settings</span>
            <p className="text-sm text-zinc-500">Update hours, calibration</p>
          </div>
          <span className="text-zinc-600">→</span>
        </div>
      </button>
    </div>
  );
}
