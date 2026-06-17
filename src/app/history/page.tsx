"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Cut } from "@/lib/types";

export default function History() {
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [exporting, setExporting] = useState(false);
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

  async function handleExport() {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("material", search);

      const res = await fetch(`/api/export-clb?${params.toString()}`);

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Export failed");
        setExporting(false);
        return;
      }

      // Download the file
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `CutLog_Export_${new Date().toISOString().split("T")[0]}.clb`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    }
    setExporting(false);
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200">←</button>
        <h1 className="text-xl font-bold">Cut History</h1>
        <span className="text-sm text-zinc-500 ml-auto">{cuts.length} cuts</span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Filter by material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
        />
        <button
          onClick={handleExport}
          disabled={exporting || cuts.length === 0}
          title="Export as LightBurn Library (.clb)"
          className="px-4 py-3 rounded-xl bg-blue-900/50 border border-blue-800 hover:bg-blue-900/80 text-blue-300 text-sm font-medium transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {exporting ? "..." : "Export .clb"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Loading...</div>
      ) : cuts.length === 0 ? (
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 text-center">
          <p className="text-zinc-400 text-lg mb-3">No cuts logged yet.</p>
          <p className="text-sm text-zinc-500 mb-1">Once you log cuts, CutLog learns your machine's characteristics and auto-scales parameters for your lens.</p>
          <p className="text-xs text-zinc-600 mb-4">Get started:</p>
          <div className="space-y-3 text-sm">
            <p>
              <Link href="/import" className="text-sky-400 hover:text-sky-300">
                Import your LightBurn library &rarr;
              </Link>
              <span className="block text-xs text-zinc-600">(cutting & engraving)</span>
            </p>
            <p>
              <Link href="/log" className="text-sky-400 hover:text-sky-300">
                Log your first cut &rarr;
              </Link>
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-lg mb-2">No cuts match your filter</p>
          <button
            onClick={() => setSearch("")}
            className="text-sky-400 hover:text-sky-300 text-sm"
          >
            Clear filter &rarr;
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
