"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Machine, Material, Cut } from "@/lib/types";

interface SuggestionGroup {
  source: "own" | "similar_machine" | "community";
  label: string;
  badge_color: string;
  cuts: Cut[];
  avg_rating: number;
}

export default function Suggest() {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialSearch, setMaterialSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [material, setMaterial] = useState("");
  const [thickness, setThickness] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionGroup[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      if (machines && machines.length > 0) setMachine(machines[0]);

      const { data: mats } = await supabase
        .from("materials")
        .select("*")
        .order("name");

      if (mats) setMaterials(mats);
    }
    init();
  }, []);

  const filteredMaterials = materials.filter(m =>
    m.name.toLowerCase().includes(materialSearch.toLowerCase()) ||
    m.aliases?.some(a => a.toLowerCase().includes(materialSearch.toLowerCase()))
  ).slice(0, 8);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const searchMaterial = material || materialSearch;
    if (!searchMaterial || !thickness) return;
    setLoading(true);
    setSuggestions([]);

    const thicknessMm = parseFloat(thickness);
    const groups: SuggestionGroup[] = [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Own cuts (case-insensitive match, includes your own data)
    const { data: ownCuts } = await supabase
      .from("cuts")
      .select("*")
      .eq("user_id", user.id)
      .ilike("material", `%${searchMaterial}%`)
      .gte("thickness_mm", thicknessMm - 0.5)
      .lte("thickness_mm", thicknessMm + 0.5)
      .order("quality_rating", { ascending: false })
      .limit(5);

    if (ownCuts && ownCuts.length > 0) {
      const avg = ownCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / ownCuts.length;
      groups.push({
        source: "own",
        label: "Your History",
        badge_color: "bg-emerald-900/50 border-emerald-600 text-emerald-300",
        cuts: ownCuts,
        avg_rating: avg,
      });
    }

    // 2. AI Baseline data (always available)
    const { data: baselineCuts } = await supabase
      .from("cuts")
      .select("*")
      .ilike("material", `%${searchMaterial}%`)
      .eq("source", "ai_baseline")
      .gte("thickness_mm", thicknessMm - 0.5)
      .lte("thickness_mm", thicknessMm + 0.5)
      .order("quality_rating", { ascending: false })
      .limit(5);

    if (baselineCuts && baselineCuts.length > 0) {
      const avg = baselineCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / baselineCuts.length;
      groups.push({
        source: "similar_machine",
        label: "AI Starting Point",
        badge_color: "bg-orange-900/50 border-orange-600 text-orange-300",
        cuts: baselineCuts,
        avg_rating: avg,
      });
    }

    // 3. Community (real user shared cuts, wider thickness tolerance)
    const { data: communityCuts } = await supabase
      .from("cuts")
      .select("*")
      .neq("source", "ai_baseline")
      .ilike("material", `%${searchMaterial}%`)
      .eq("is_shared", true)
      .gte("thickness_mm", thicknessMm - 1)
      .lte("thickness_mm", thicknessMm + 1)
      .order("quality_rating", { ascending: false })
      .limit(5);

    if (communityCuts && communityCuts.length > 0) {
      const avg = communityCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / communityCuts.length;
      groups.push({
        source: "community",
        label: "Community",
        badge_color: "bg-blue-900/50 border-blue-600 text-blue-300",
        cuts: communityCuts,
        avg_rating: avg,
      });
    }

    setSuggestions(groups);
    setSearched(true);
    setLoading(false);
  }

  function formatParam(value: number | null, unit: string): string {
    if (value === null || value === undefined) return "—";
    return `${value}${unit}`;
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto pb-20">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200">←</button>
        <h1 className="text-xl font-bold">Get Suggestion</h1>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        {/* Material search */}
        <div className="relative">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Material</label>
          <input
            type="text"
            placeholder="Search materials..."
            value={materialSearch || material}
            onChange={(e) => {
              setMaterialSearch(e.target.value);
              setMaterial("");
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-blue-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
          {showDropdown && materialSearch && filteredMaterials.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-lg max-h-64 overflow-y-auto">
              {filteredMaterials.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMaterial(m.name);
                    setMaterialSearch("");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-zinc-800 border-b border-zinc-800 last:border-0"
                >
                  <span className="text-zinc-100">{m.name}</span>
                  <span className="text-xs text-zinc-500 ml-2">{m.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Thickness (mm)</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 3.0"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-blue-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!material && !materialSearch) || !thickness}
          className="w-full p-3 rounded-xl bg-blue-700 hover:bg-blue-600 font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find Parameters"}
        </button>
      </form>

      {/* Results */}
      {searched && suggestions.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-lg mb-2">No data yet</p>
          <p className="text-zinc-600 text-sm">
            Be the first to log a cut for {material} at {thickness}mm.
            <br />Your data helps the community!
          </p>
        </div>
      )}

      {suggestions.map((group) => (
        <div key={group.source} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${group.badge_color}`}>
              {group.source === "own" ? "YOUR DATA" : group.source === "similar_machine" ? "AI BASELINE" : "COMMUNITY"}
            </span>
            <span className="text-sm text-zinc-400">{group.label}</span>
            <span className="text-sm text-yellow-400 ml-auto">
              {"★".repeat(Math.round(group.avg_rating))} {group.avg_rating.toFixed(1)}
            </span>
          </div>

          {group.cuts.map((cut, i) => (
            <div key={cut.id || i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-2">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-zinc-500 text-xs block">Power</span>
                  <span className="font-mono">{formatParam(cut.power_pct, "%")}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs block">Speed</span>
                  <span className="font-mono">{formatParam(cut.speed_mm_min, " mm/min")}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs block">Gas</span>
                  <span className="font-mono">{cut.gas_type || "—"} {cut.gas_pressure_bar ? `${cut.gas_pressure_bar}bar` : ""}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs block">Focus</span>
                  <span className="font-mono">{formatParam(cut.focus_position_mm, "mm")}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs block">Line Int.</span>
                  <span className="font-mono">{formatParam(cut.line_interval_mm, "mm")}</span>
                </div>
                <div>
                  <span className="text-zinc-500 text-xs block">Rating</span>
                  <span className="text-yellow-400">{"★".repeat(cut.quality_rating || 0)}</span>
                </div>
              </div>
              {cut.notes && (
                <p className="text-xs text-zinc-500 mt-2 italic">&ldquo;{cut.notes}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
