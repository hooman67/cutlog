"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Machine, Material, Cut } from "@/lib/types";
import { SPEED_PROFILE_MULTIPLIERS } from "@/lib/types";
import { DiscoveryHint, HintLink } from "@/components/DiscoveryHint";
import { scaleParameters, checkScalingWarning, canScaleBetweenTypes, formatScalingNote } from "@/lib/scaling";

interface ScaledCut extends Cut {
  scaled_power?: number
  scaled_speed?: number
  scaling_note?: string
  scaling_warning?: { level: 'warning' | 'danger'; message: string }
}

interface SuggestionGroup {
  source: "own" | "similar_machine" | "community";
  label: string;
  badge_color: string;
  cuts: ScaledCut[];
  avg_rating: number;
}

interface SpeedRecommendation {
  avgSpeed: number;
  fastSpeed: number;
  conservativeSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  dataPoints: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  avgPower: number | null;
  commonGasType: string | null;
  avgGasPressure: number | null;
  avgFocus: number | null;
  avgNozzle: number | null;
  // Scaling metadata
  scalingApplied: boolean;
  scalingWarning?: { level: 'warning' | 'danger'; message: string };
  scalingNote?: string;
  // Speed profile
  activeProfile: 'fast' | 'conservative' | 'auto';
}

type FeedbackType = "too_slow" | "perfect" | "too_fast";

interface StoredFeedback {
  material: string;
  thickness: string;
  feedback: FeedbackType;
  speed: number;
  timestamp: number;
}

/**
 * Apply parameter scaling to a cut if the user's machine has a different
 * lens/wattage than the stored cut data
 */
function scaleCutIfNeeded(
  cut: Cut,
  userMachine: Machine | null
): ScaledCut {
  const scaled: ScaledCut = { ...cut }

  if (!userMachine || !cut.speed_mm_min || cut.power_pct === null) {
    return scaled // No scaling possible
  }

  // Get the stored machine config from the cut
  const storedWattage = cut.recorded_wattage_w || userMachine.wattage_w || 100
  const storedLens = cut.recorded_lens_focal_length_mm || 110
  const userLens = userMachine.lens_focal_length_mm || 110
  const userWattage = userMachine.wattage_w || 100
  const laserType = (userMachine.source_type || 'fiber') as any

  // Skip scaling if types are incompatible
  if (!canScaleBetweenTypes(laserType, laserType)) {
    return scaled
  }

  // If lens/wattage match, no scaling needed
  if (storedLens === userLens && storedWattage === userWattage) {
    return scaled
  }

  // Apply scaling
  const result = scaleParameters(
    cut.power_pct,
    cut.speed_mm_min,
    storedWattage,
    userWattage,
    storedLens,
    userLens,
    laserType
  )

  scaled.scaled_power = result.power
  scaled.scaled_speed = result.speed
  scaled.scaling_note = formatScalingNote(
    { wattage: storedWattage, lens: storedLens },
    userLens,
    userWattage
  )

  // Check for scaling warnings
  const warning = checkScalingWarning(storedWattage, userWattage, storedLens, userLens)
  if (warning.level) {
    scaled.scaling_warning = { level: warning.level, message: warning.message }
  }

  return scaled
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

function computeSpeedRecommendation(groups: SuggestionGroup[], userMachine: Machine | null = null): SpeedRecommendation | null {
  // Collect all cuts with quality_rating >= 3 and valid speed
  const goodCuts: ScaledCut[] = [];
  for (const group of groups) {
    for (const cut of group.cuts) {
      if (cut.speed_mm_min && (cut.quality_rating === null || cut.quality_rating >= 3)) {
        goodCuts.push(cut);
      }
    }
  }

  if (goodCuts.length === 0) return null;

  // Use scaled speeds if available, otherwise original speeds
  const speeds = goodCuts.map((c) => c.scaled_speed || c.speed_mm_min!);
  const avgSpeed = Math.round(speeds.reduce((a, b) => a + b, 0) / speeds.length);
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);

  // Calculate profile-specific speeds
  const fastSpeed = avgSpeed; // Fast profile keeps original speed
  const conservativeSpeed = Math.round(avgSpeed * SPEED_PROFILE_MULTIPLIERS.conservative); // Conservative is ~50% of original

  // Determine active profile
  let activeProfile: 'fast' | 'conservative' | 'auto' = userMachine?.speed_profile || 'auto';

  // Confidence
  let confidence: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  if (goodCuts.length >= 10) confidence = "HIGH";
  else if (goodCuts.length >= 5) confidence = "MEDIUM";

  // Supporting params (use scaled power if available)
  const powers = goodCuts.filter((c) => (c.scaled_power !== undefined ? c.scaled_power : c.power_pct) !== null).map((c) => (c.scaled_power !== undefined ? c.scaled_power : c.power_pct)!);
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

  // Check for scaling warnings - use the first cut that has scaling applied
  let scalingApplied = false;
  let scalingWarning: { level: 'warning' | 'danger'; message: string } | undefined;
  let scalingNote: string | undefined;

  const scaledCut = goodCuts.find((c) => c.scaled_speed !== undefined);
  if (scaledCut) {
    scalingApplied = true;
    scalingWarning = scaledCut.scaling_warning;
    scalingNote = scaledCut.scaling_note;
  }

  return {
    avgSpeed,
    fastSpeed,
    conservativeSpeed,
    minSpeed,
    maxSpeed,
    dataPoints: goodCuts.length,
    confidence,
    avgPower,
    commonGasType,
    avgGasPressure,
    avgFocus,
    avgNozzle,
    scalingApplied,
    scalingWarning,
    scalingNote,
    activeProfile,
  };
}

export default function Suggest() {
  const [userMachine, setUserMachine] = useState<Machine | null>(null);
  const [hasMachine, setHasMachine] = useState(true); // default true to avoid flash
  const [hasCuts, setHasCuts] = useState(true); // default true to avoid flash
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

      if (machines && machines.length > 0) {
        setUserMachine(machines[0]);
        setHasMachine(true);
      } else {
        setHasMachine(false);
      }

      // Check if user has any cuts at all
      const { count } = await supabase
        .from("cuts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setHasCuts((count ?? 0) > 0);

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
      const scaledCuts = ownCuts.map((cut) => scaleCutIfNeeded(cut, userMachine));
      const avg = ownCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / ownCuts.length;
      groups.push({
        source: "own",
        label: "Your History",
        badge_color: "bg-emerald-900/50 border-emerald-600 text-emerald-300",
        cuts: scaledCuts,
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
      const scaledCuts = baselineCuts.map((cut) => scaleCutIfNeeded(cut, userMachine));
      const avg = baselineCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / baselineCuts.length;
      groups.push({
        source: "similar_machine",
        label: "AI Starting Point",
        badge_color: "bg-orange-900/50 border-orange-600 text-orange-300",
        cuts: scaledCuts,
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
      const scaledCuts = communityCuts.map((cut) => scaleCutIfNeeded(cut, userMachine));
      const avg = communityCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / communityCuts.length;
      groups.push({
        source: "community",
        label: "Community",
        badge_color: "bg-blue-900/50 border-blue-600 text-blue-300",
        cuts: scaledCuts,
        avg_rating: avg,
      });
    }

    setSuggestions(groups);
    setSearched(true);
    setLoading(false);

    // Track if search returned no results for nudge D
    if (groups.length === 0 && typeof window !== "undefined") {
      localStorage.setItem("cutlog-search-no-results", "true");
    }
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

  const speedRec = suggestions.length > 0 ? computeSpeedRecommendation(suggestions, userMachine) : null;
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

      {/* Contextual hint: no cuts yet - suggest import */}
      {!hasCuts && (
        <DiscoveryHint storageKey="suggest_import_clb">
          <p className="font-medium text-zinc-200 mb-1.5">New to CutLog?</p>
          <p className="text-xs text-zinc-300 mb-2">Have a LightBurn library? <HintLink href="/import">Import your .clb file &rarr;</HintLink></p>
          <p className="text-xs text-zinc-400">All recommendations auto-scale for your lens, and are validated against expert Etsy data.</p>
        </DiscoveryHint>
      )}

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

      {/* No results state - enhanced empty state */}
      {searched && suggestions.length === 0 && !loading && (
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 text-center">
          <p className="text-zinc-400 text-lg mb-3">No results for {searchMaterial} at {thickness}mm.</p>
          <p className="text-sm text-zinc-500 mb-4">You can:</p>
          <div className="space-y-2.5 text-sm">
            <p>
              <Link href="/import" className="text-sky-400 hover:text-sky-300">
                Import a LightBurn .clb file &rarr;
              </Link>
            </p>
            <p className="text-xs text-zinc-600">
              (Auto-scaled to your lens, engraving support included)
            </p>
            <p className="text-zinc-600 text-xs">
              Or log your first cut for this material to build a personalized baseline.
            </p>
            <p>
              <button
                type="button"
                onClick={() => { router.push("/log"); }}
                className="text-sky-400 hover:text-sky-300 text-sm"
              >
                Log a cut &rarr;
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Contextual hint: results found but no machine set up */}
      {searched && suggestions.length > 0 && !hasMachine && (
        <DiscoveryHint storageKey="suggest_setup_machine">
          <p className="text-sm text-zinc-300 mb-1.5"><HintLink href="/machine">Set up your machine profile &rarr;</HintLink> for auto-scaled parameters.</p>
          <p className="text-xs text-zinc-400">We'll scale recommendations to your specific lens focal length for more accurate cuts.</p>
        </DiscoveryHint>
      )}

      {/* Speed Hero Section */}
      {speedRec && (
        <div className="mb-6">
          {/* Scaling warning banner */}
          {speedRec.scalingWarning && (
            <div className={`mb-4 p-3 rounded-xl border text-sm ${
              speedRec.scalingWarning.level === 'danger'
                ? 'bg-red-900/30 border-red-700 text-red-300'
                : 'bg-yellow-900/30 border-yellow-700 text-yellow-300'
            }`}>
              ⚠️ {speedRec.scalingWarning.message}
            </div>
          )}

          {/* Main speed recommendation card */}
          <div className="bg-zinc-900 border border-emerald-800 rounded-2xl p-6 mb-4">
            <div className="text-center">
              {/* Profile badge */}
              <div className="mb-3 flex items-center justify-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  speedRec.activeProfile === 'fast'
                    ? 'bg-blue-900/40 border border-blue-600 text-blue-300'
                    : speedRec.activeProfile === 'conservative'
                    ? 'bg-purple-900/40 border border-purple-600 text-purple-300'
                    : 'bg-slate-900/40 border border-slate-600 text-slate-300'
                }`}>
                  {speedRec.activeProfile === 'fast' ? '⚡ Fast Production' : speedRec.activeProfile === 'conservative' ? '🎯 Conservative Quality' : 'ℹ️ Auto Profile'}
                </span>
              </div>

              <p className="text-sm text-zinc-400 mb-1 uppercase tracking-wide">
                Recommended Speed
                {speedRec.scalingApplied && (
                  <span className="ml-2 text-emerald-300 text-xs">(auto-scaled)</span>
                )}
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-emerald-400 font-mono mb-1">
                {speedRec.avgSpeed.toLocaleString()}
              </p>
              <p className="text-sm text-emerald-300/70 mb-3">
                mm/min
                {speedRec.scalingApplied && userMachine?.lens_focal_length_mm && (
                  <span className="block text-xs text-zinc-500 mt-1">
                    for {userMachine.lens_focal_length_mm}mm lens
                  </span>
                )}
              </p>

              {/* Speed profile comparison */}
              <div className="bg-zinc-800/50 rounded-xl p-3 mb-3 text-xs text-zinc-300">
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <span className="text-zinc-500">Fast:</span>
                    <span className="ml-2 font-mono text-blue-300">{speedRec.fastSpeed.toLocaleString()} mm/min</span>
                  </div>
                  <div className="text-zinc-600">|</div>
                  <div>
                    <span className="text-zinc-500">Conservative:</span>
                    <span className="ml-2 font-mono text-purple-300">{speedRec.conservativeSpeed.toLocaleString()} mm/min</span>
                  </div>
                </div>
              </div>

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

              {/* Scaling note */}
              {speedRec.scalingNote && (
                <p className="text-xs text-zinc-500 mt-2">
                  {speedRec.scalingNote}
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

          {/* Speed Profile Explanation */}
          <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-4 mb-6 text-xs text-zinc-300">
            <p className="font-medium text-slate-200 mb-2">About Speed Profiles:</p>
            <div className="space-y-2">
              <div>
                <span className="text-blue-300">⚡ Fast Production:</span>
                <span className="text-zinc-400"> Maximizes cutting speed for high throughput (current active if selected)</span>
              </div>
              <div>
                <span className="text-purple-300">🎯 Conservative Quality:</span>
                <span className="text-zinc-400"> Reduces speed by ~50% to prioritize edge quality and material durability</span>
              </div>
            </div>
            {hasMachine && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <Link href="/machine" className="text-slate-300 hover:text-slate-100 text-xs font-medium">
                  Change your speed profile &rarr;
                </Link>
              </div>
            )}
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
                            <span className="font-mono">{formatParam(cut.scaled_power !== undefined ? cut.scaled_power : cut.power_pct, "%")}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 text-xs block">Speed</span>
                            <span className="font-mono text-emerald-400">{formatParam(cut.scaled_speed !== undefined ? cut.scaled_speed : cut.speed_mm_min, " mm/min")}</span>
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
                        {cut.scaling_note && (
                          <p className="text-xs text-zinc-400 mt-2">
                            {cut.scaling_note}
                          </p>
                        )}
                        {cut.notes && (
                          <p className="text-xs text-zinc-500 mt-1 italic">&ldquo;{cut.notes}&rdquo;</p>
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
