"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Cut } from "@/lib/types";

export default function History() {
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      const { data } = await supabase
        .from("cuts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (data) setCuts(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = cuts.filter(c =>
    c.material.toLowerCase().includes(search.toLowerCase())
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200">←</button>
        <h1 className="text-xl font-bold">Cut History</h1>
        <span className="text-sm text-zinc-500 ml-auto">{cuts.length} cuts</span>
      </div>

      <input
        type="text"
        placeholder="Filter by material..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500 mb-4"
      />

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-lg mb-2">No cuts logged yet</p>
          <button
            onClick={() => router.push("/log")}
            className="text-emerald-400 hover:text-emerald-300 text-sm"
          >
            Log your first cut →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(cut => (
            <div key={cut.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">{cut.material}</span>
                  <span className="text-zinc-500 text-sm ml-2">{cut.thickness_mm}mm</span>
                </div>
                <span className="text-yellow-400 text-sm">
                  {"★".repeat(cut.quality_rating || 0)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs text-zinc-400">
                {cut.power_pct && <span>{cut.power_pct}%</span>}
                {cut.speed_mm_min && <span>{cut.speed_mm_min}mm/min</span>}
                {cut.gas_type && <span>{cut.gas_type} {cut.gas_pressure_bar}bar</span>}
                {cut.focus_position_mm !== null && <span>F:{cut.focus_position_mm}mm</span>}
              </div>
              {cut.edge_quality && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400">
                  {cut.edge_quality.replace("_", " ")}
                </span>
              )}
              <div className="text-xs text-zinc-600 mt-2">{formatDate(cut.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
