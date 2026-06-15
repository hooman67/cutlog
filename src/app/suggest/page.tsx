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

interface SpeedRecommendation {
  avgSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  dataPoints: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  avgPower: number | null;
  commonGasType: string | null;
  avgGasPressure: number | null;
  avgFocus: number | null;
  avgNozzle: number | null;
}

type FeedbackType = "too_slow" | "perfect" | "too_fast";

interface StoredFeedback {
  material: string;
  thickness: string;
  feedback: FeedbackType;
  speed: number;
  timestamp: number;
}

function getStoredFeedback(material: string, thickness: string): StoredFeedback[] {
  if (typeof window === "undefined") return [];
  const key = `cutlog_speed_feedback`;
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  const all: StoredFeedback[] = JSON.parse(raw);
  return all.filter(
    (f) => f.material.toLowerCase() === material.toLowerCase() && f.thickness === thickness
  );
}

function saveFeedback(material: string, thickness: string, feedback: FeedbackType, speed: number) {
  const key = `cutlog_speed_feedback`;
  const raw = localStorage.getItem(key);
  const all: StoredFeedback[] = raw ? JSON.parse(raw) : [];
  all.push({ material, thickness, feedback, speed, timestamp: Date.now() });
  localStorage.setItem(key, JSON.stringify(all));
}

function computeSpeedRecommendation(groups: SuggestionGroup[]): SpeedRecommendation | null {
  // Collect all cuts with quality_rating >= 3 and valid speed
  const goodCuts: Cut[] = [];
  for (const group of groups) {
    for (const cut of group.cuts) {
      if (cut.speed_mm_min && (cut.quality_rating === null || cut.quality_rating >= 3)) {
        goodCuts.push(cut);
      }
    }
  }

  if (goodCuts.length === 0) return null;

  const speeds = goodCuts.map((c) => c.speed_mm_min!);
  const avgSpeed = Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length);
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);

  // Confidence
  let confidence: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  if (goodCuts.length >= 10) confidence = "HIGH";
  else if (goodCuts.length >= 5) confidence = "MEDIUM";

  // Supporting params (averages)
  const powers = goodCuts.filter((c) => c.power_pct !== null).map((c) => c.power_pct!);
  const avgPower = powers.length > 0 ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : null;

  const gases = goodCuts.filter((c) => c.gas_type).map((c) => c.gas_type!);
  const gasCount: Record<string, number> = {};
  gases.forEach((g) => { gasCount[g] = (gasCount[g] || 0) + 1; });
  const commonGasType = Object.entries(gasCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const pressures = goodCuts.filter((c) => c.gas_pressure_bar !== null).map((c) => c.gas_pressure_bar!);
  const avgGasPressure = pressures.length > 0 ? Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length * 10) / 10 : null;

  const focuses = goodCuts.filter((c) => c.focus_position_mm !== null).map((c) => c.focus_position_mm!);
  const avgFocus = focuses.length > 0 ? Math.round(focuses.reduce((a, b) => a + b, 0) / focuses.length * 10) / 10 : null;

  const nozzles = goodCuts.filter((c) => c.nozzle_diameter_mm !== null).map((c) => c.nozzle_diameter_mm!);
  const avgNozzle = nozzles.length > 0 ? Math.round(nozzles.reduce((a, b) => a + b, 0) / nozzles.length * 10) / 10 : null;

  return { avgSpeed, minSpeed, maxSpeed, dataPoints: goodCuts.length, confidence, avgPower, commonGasType, avgGasPressure, avgFocus, avgNozzle };
}

export default function Suggest() {
  const [, setMachine] = useState<Machine | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialSearch, setMaterialSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [material, setMaterial] = useState("");
  const [thickness, setThickness] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionGroup[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFullParams, setShowFullParams] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<FeedbackType | null>(null);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);

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
    setFeedbackGiven(null);
    setShowFeedbackToast(false);
    setShowFullParams(false);

    const thicknessMm = parseFloat(thickness);
    const groups: SuggestionGroup[] = [];

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Own cuts (case-insensitive match)
    const { data: ownCuts } = await supabase
      .from("cuts")
      .select("*")
      .eq("user_id", user.id)
      .ilike("material", `%${searchMaterial}%`)
      .gte("thickness_mm", thicknessMm - 0.5)
      .lte("thickness_mm", thicknessMm + 0.5)
      .order("quality_rating", { ascending: false })
      .limit(10);

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

    // 2. AI Baseline data
    const { data: baselineCuts } = await supabase
      .from("cuts")
      .select("*")
      .ilike("material", `%${searchMaterial}%`)
      .eq("source", "ai_baseline")
      .gte("thickness_mm", thicknessMm - 0.5)
      .lte("thickness_mm", thicknessMm + 0.5)
      .order("quality_rating", { ascending: false })
      .limit(10);

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

    // 3. Community (real user shared cuts)
    const { data: communityCuts } = await supabase
      .from("cuts")
      .select("*")
      .neq("source", "ai_baseline")
      .ilike("material", `%${searchMaterial}%`)
      .eq("is_shared", true)
      .gte("thickness_mm", thicknessMm - 1)
      .lte("thickness_mm", thicknessMm + 1)
      .order("quality_rating", { ascending: false })
      .limit(10);

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

  function handleFeedback(type: FeedbackType) {
    const searchMaterial = material || materialSearch;
    const rec = computeSpeedRecommendation(suggestions);
    if (rec && searchMaterial) {
      saveFeedback(searchMaterial, thickness, type, rec.avgSpeed);
    }
    setFeedbackGiven(type);
    setShowFeedbackToast(true);
    setTimeout(() => setShowFeedbackToast(false), 3000);
  }

  function formatParam(value: number | null, unit: string): string {
    if (value === null || value === undefined) return "—";
    return `${value}${unit}`;
  }

  const speedRec = suggestions.length > 0 ? computeSpeedRecommendation(suggestions) : null;
  const searchMaterial = material || materialSearch;

  // Check for previous feedback on this material/thickness
  const previousFeedback = searched && searchMaterial && thickness
    ? getStoredFeedback(searchMaterial, thickness)
    : [];

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto pb-20">
      <div className="flex items-center gap-3 mb-2 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200 text-lg">&larr;</button>
        <h1 className="text-xl font-bold">How fast should I cut?</h1>
      </div>
      <p className="text-sm text-zinc-500 mb-6 ml-8">
        Enter your material and thickness. We&apos;ll tell you how fast to go.
      </p>

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
          {loading ? "Searching..." : "Get Speed Recommendation"}
        </button>
      </form>

      {/* No results state */}
      {searched && suggestions.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-zinc-500 text-lg mb-2">No data yet</p>
          <p className="text-zinc-600 text-sm">
            Be the first to log a cut for {searchMaterial} at {thickness}mm.
            <br />Your data helps the community!
          </p>
        </div>
      )}

      {/* Speed Hero Section */}
      {speedRec && (
        <div className="mb-6">
          {/* Main speed recommendation card */}
          <div className="bg-zinc-900 border border-emerald-800 rounded-2xl p-6 mb-4">
            <div className="text-center">
              <p className="text-sm text-zinc-400 mb-1 uppercase tracking-wide">Recommended Speed</p>
              <p className="text-4xl sm:text-5xl font-bold text-emerald-400 font-mono mb-1">
                {speedRec.avgSpeed.toLocaleString()}
              </p>
              <p className="text-sm text-emerald-300/70 mb-3">mm/min</p>

              {/* Confidence badge */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  speedRec.confidence === "HIGH"
                    ? "bg-emerald-900/60 text-emerald-300 border border-emerald-700"
                    : speedRec.confidence === "MEDIUM"
                    ? "bg-yellow-900/60 text-yellow-300 border border-yellow-700"
                    : "bg-red-900/60 text-red-300 border border-red-700"
                }`}>
                  {speedRec.confidence} confidence
                </span>
                <span className="text-xs text-zinc-500">
                  Based on {speedRec.dataPoints} similar cut{speedRec.dataPoints !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Speed range */}
              {speedRec.minSpeed !== speedRec.maxSpeed && (
                <p className="text-xs text-zinc-500">
                  Range: {speedRec.minSpeed.toLocaleString()} &ndash; {speedRec.maxSpeed.toLocaleString()} mm/min
                </p>
              )}
            </div>

            {/* Supporting parameters summary */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">Assumes typical parameters:</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
                {speedRec.avgPower !== null && (
                  <span>{speedRec.avgPower}% power</span>
                )}
                {speedRec.commonGasType && (
                  <span>{speedRec.commonGasType}{speedRec.avgGasPressure ? ` at ${speedRec.avgGasPressure} bar` : ""}</span>
                )}
                {speedRec.avgFocus !== null && (
                  <span>{speedRec.avgFocus}mm focus</span>
                )}
                {speedRec.avgNozzle !== null && (
                  <span>{speedRec.avgNozzle}mm nozzle</span>
                )}
              </div>
            </div>
          </div>

          {/* Previous feedback indicator */}
          {previousFeedback.length > 0 && !feedbackGiven && (
            <div className="text-xs text-zinc-500 text-center mb-3">
              You&apos;ve given {previousFeedback.length} feedback{previousFeedback.length !== 1 ? "s" : ""} for this combo previously.
              Last: &quot;{previousFeedback[previousFeedback.length - 1].feedback.replace("_", " ")}&quot;
            </div>
          )}

          {/* Quick Feedback Buttons */}
          <div className="mb-6">
            <p className="text-xs text-zinc-500 text-center mb-3">How did this speed work for you?</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleFeedback("too_slow")}
                disabled={feedbackGiven !== null}
                className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === "too_slow"
                    ? "bg-amber-700 text-amber-100 ring-2 ring-amber-400"
                    : feedbackGiven
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-amber-900/50 border border-amber-700 text-amber-300 hover:bg-amber-800/60 active:scale-95"
                }`}
              >
                <span className="block text-lg mb-1">&laquo;</span>
                Too Slow
              </button>
              <button
                onClick={() => handleFeedback("perfect")}
                disabled={feedbackGiven !== null}
                className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === "perfect"
                    ? "bg-emerald-700 text-emerald-100 ring-2 ring-emerald-400"
                    : feedbackGiven
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-emerald-900/50 border border-emerald-600 text-emerald-300 hover:bg-emerald-800/60 active:scale-95"
                }`}
              >
                <span className="block text-lg mb-1">&check;</span>
                Perfect
              </button>
              <button
                onClick={() => handleFeedback("too_fast")}
                disabled={feedbackGiven !== null}
                className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === "too_fast"
                    ? "bg-red-700 text-red-100 ring-2 ring-red-400"
                    : feedbackGiven
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-red-900/50 border border-red-700 text-red-300 hover:bg-red-800/60 active:scale-95"
                }`}
              >
                <span className="block text-lg mb-1">&raquo;</span>
                Too Fast
              </button>
            </div>
          </div>

          {/* Feedback toast */}
          {showFeedbackToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-900/40 border border-emerald-800 text-center text-sm text-emerald-300 animate-pulse">
              Thanks! This helps improve future recommendations.
            </div>
          )}

          {/* Collapsible full parameters section */}
          <div className="mb-6">
            <button
              onClick={() => setShowFullParams(!showFullParams)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800/50 transition-colors"
            >
              <span>Other parameters for reference</span>
              <span className="text-zinc-500">{showFullParams ? "▲" : "▼"}</span>
            </button>

            {showFullParams && (
              <div className="mt-2">
                <p className="text-xs text-zinc-500 mb-3 px-1">
                  These are typical values for this material. Adjust based on your machine setup.
                </p>

                {/* Tier-grouped detailed results */}
                {suggestions.map((group) => (
                  <div key={group.source} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
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
                            <span className="font-mono text-emerald-400">{formatParam(cut.speed_mm_min, " mm/min")}</span>
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
                            <span className="text-zinc-500 text-xs block">Nozzle</span>
                            <span className="font-mono">{formatParam(cut.nozzle_diameter_mm, "mm")}</span>
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
