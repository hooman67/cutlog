"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Machine, Material, Cut } from "@/lib/types";
import { SPEED_PROFILE_MULTIPLIERS, isGalvoMode } from "@/lib/types";
import { DiscoveryHint, HintLink } from "@/components/DiscoveryHint";
import { scaleParameters, checkScalingWarning, canScaleBetweenTypes, formatScalingNote } from "@/lib/scaling";
import { linearEnergyDensity, crossMachineSpeed, formatEnergyDensity } from "@/lib/energy";

type Provenance =
  | "your_data"
  | "community_verified"
  | "community_reported"
  | "scraped_reference"
  | "ai_unverified";

const PROVENANCE_META: Record<Provenance, { label: string; cls: string }> = {
  your_data: { label: "Your data", cls: "bg-emerald-900/50 border-emerald-600 text-emerald-300" },
  community_verified: { label: "Community-verified", cls: "bg-blue-900/50 border-blue-600 text-blue-300" },
  community_reported: { label: "Community-reported", cls: "bg-teal-900/50 border-teal-600 text-teal-300" },
  scraped_reference: { label: "Scraped/reference", cls: "bg-zinc-800 border-zinc-600 text-zinc-400" },
  ai_unverified: { label: "AI starting point — unverified", cls: "bg-orange-900/50 border-orange-600 text-orange-300" },
};

/** Map a SuggestionGroup source to its provenance when a cut lacks an explicit tag. */
function fallbackProvenance(source: "own" | "similar_machine" | "community"): Provenance {
  if (source === "own") return "your_data";
  if (source === "similar_machine") return "ai_unverified";
  return "community_reported";
}

interface ScaledCut extends Cut {
  scaled_power?: number
  scaled_speed?: number
  scaling_note?: string
  scaling_warning?: { level: 'warning' | 'danger'; message: string }
  source_tier_weight?: number
  machine_wattage?: number | null
  machine_source_type?: string | null
  // Provenance / verification (from search API)
  provenance?: Provenance
  verified_count?: number
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
  confidence: "HIGH" | "MEDIUM" | "LOW" | "UNVERIFIED";
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
  // Thickness fallback
  thicknessToleranceUsed?: number;
  // Material alias resolution
  matchedAliases?: string[];
  // AI generation tracking
  isAiGenerated?: boolean;
  // Engraving/galvo params
  avgQPulseNs: number | null;
  // Interpolation metadata
  interpolated?: boolean;
  interpolationNote?: string;
  // Feedback correction
  feedbackCorrectionApplied?: boolean;
  feedbackCorrectionDirection?: 'faster' | 'slower';
  // Provenance / verification (honest trust signals)
  topProvenance?: Provenance;
  verifiedCount?: number;
  // J/mm energy normalization (honest cross-machine transfer)
  jPerMm?: number | null;
  sourceWattageW?: number | null;
  // Speed scaled to the user's machine via energy density (starting point)
  energyScaledSpeed?: number | null;
}

interface AiSuggestionResult {
  speed_mm_min: number;
  power_pct: number;
  gas_type: string | null;
  gas_pressure_bar: number | null;
  frequency_hz: number | null;
  // Pierce (piercing) parameters
  pierce_type: "blast" | "progressive" | "pulsed" | "none" | null;
  pierce_time_s: number | null;
  pierce_power_pct: number | null;
  pierce_height_mm: number | null;
  pierce_gas_pressure_bar: number | null;
  confidence_note: string;
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
  let all: StoredFeedback[] = [];
  try {
    all = JSON.parse(raw);
  } catch {
    return [];
  }
  return all.filter(
    (f) => f.material.toLowerCase() === material.toLowerCase() && f.thickness === thickness
  );
}

function saveFeedback(material: string, thickness: string, feedback: FeedbackType, speed: number) {
  const key = `cutlog_speed_feedback`;
  const raw = localStorage.getItem(key);
  let all: StoredFeedback[] = [];
  if (raw) {
    try {
      all = JSON.parse(raw);
    } catch {
      all = [];
    }
  }
  all.push({ material, thickness, feedback, speed, timestamp: Date.now() });
  localStorage.setItem(key, JSON.stringify(all));
}

function computeSpeedRecommendation(groups: SuggestionGroup[], userMachine: Machine | null = null, feedbackCorrection?: { direction: 'faster' | 'slower' } | null, interpolated?: boolean): SpeedRecommendation | null {
  // Collect all cuts with quality_rating >= 3 and valid speed
  // Assign source tier weights: user=3x, community=2x, AI baseline=1x
  const goodCuts: ScaledCut[] = [];
  for (const group of groups) {
    const tierWeight = group.source === "own" ? 3 : group.source === "community" ? 2 : 1;
    for (const cut of group.cuts) {
      if (cut.speed_mm_min && (cut.quality_rating === null || cut.quality_rating >= 3)) {
        cut.source_tier_weight = tierWeight;
        goodCuts.push(cut);
      }
    }
  }

  if (goodCuts.length === 0) return null;

  // --- Gas separation ---
  // Don't blend gas types into one recommendation: O2 and N2 cut at very different
  // energy/speed (e.g. N2 needs ~2x the energy). Pick the dominant gas among the good
  // cuts and base the speed + supporting params only on those rows. Rows with no gas
  // recorded are kept (they don't conflict). Falls back to all rows if no gas info.
  const gasTally: Record<string, number> = {};
  for (const c of goodCuts) { if (c.gas_type) gasTally[c.gas_type] = (gasTally[c.gas_type] || 0) + 1; }
  const dominantGas = Object.entries(gasTally).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const recCuts = dominantGas
    ? goodCuts.filter((c) => !c.gas_type || c.gas_type === dominantGas)
    : goodCuts;

  // Feature 4: Time-Decay Weighting
  // Apply exponential decay with half-life of 6 months (180 days)
  const now = Date.now();
  const HALF_LIFE_DAYS = 180;

  // Use scaled speeds if available, otherwise original speeds
  const speeds = recCuts.map((c) => c.scaled_speed || c.speed_mm_min!);
  const weights = recCuts.map((c) => {
    const baseTierWeight = c.source_tier_weight || 1;
    // Calculate age-based decay
    let decayWeight = 1;
    if (c.created_at) {
      const createdAt = new Date(c.created_at).getTime();
      const ageDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      decayWeight = Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
    }
    // Wattage-proximity weighting: trust rows whose SOURCE wattage is closest to the
    // user's machine. A row scaled 5x (e.g. 10kW -> 2kW) is far less reliable than a
    // real datapoint at the user's wattage, so weight by 1/scaleRatio.
    let proximityWeight = 1;
    const userW = userMachine?.wattage_w || null;
    const sourceW = c.recorded_wattage_w ?? c.machine_wattage ?? userW ?? null;
    if (userW && sourceW && userW > 0 && sourceW > 0) {
      const ratio = userW >= sourceW ? userW / sourceW : sourceW / userW;
      proximityWeight = 1 / ratio;
    }
    return baseTierWeight * decayWeight * proximityWeight;
  });

  // Weighted average speed
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let avgSpeed = Math.round(
    speeds.reduce((sum, speed, i) => sum + speed * weights[i], 0) / totalWeight
  );
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);

  // Weighted average speed
  // (weights already include tier * time-decay * wattage-proximity)

  // Feature 2: Apply feedback correction factor
  let feedbackCorrectionApplied = false;
  let feedbackCorrectionDirection: 'faster' | 'slower' | undefined;
  if (feedbackCorrection) {
    feedbackCorrectionApplied = true;
    feedbackCorrectionDirection = feedbackCorrection.direction;
    if (feedbackCorrection.direction === 'faster') {
      avgSpeed = Math.round(avgSpeed * 1.1); // Increase by 10%
    } else {
      avgSpeed = Math.round(avgSpeed * 0.9); // Decrease by 10%
    }
  }

  // Calculate profile-specific speeds
  const fastSpeed = avgSpeed; // Fast profile keeps original speed
  const conservativeSpeed = Math.round(avgSpeed * SPEED_PROFILE_MULTIPLIERS.conservative); // Conservative is ~50% of original

  // Determine active profile
  const activeProfile: 'fast' | 'conservative' | 'auto' = userMachine?.speed_profile || 'auto';

  // Confidence based on coefficient of variation (stddev / mean)
  const mean = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const variance = speeds.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / speeds.length;
  const stddev = Math.sqrt(variance);
  const cv = mean > 0 ? stddev / mean : 1;

  let confidence: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  // If user has their own verified cut (4-5 stars), that's HIGH confidence — they tested it on their machine
  const hasOwnVerifiedCut = recCuts.some(c => c.source_tier_weight === 3 && c.quality_rating && c.quality_rating >= 4);
  if (hasOwnVerifiedCut) confidence = "HIGH";
  else if (recCuts.length >= 5 && cv < 0.2) confidence = "HIGH";
  else if (recCuts.length >= 3 || cv < 0.4) confidence = "MEDIUM";

  // Feature 3: Reduce confidence by one level when interpolation is used
  if (interpolated) {
    if (confidence === "HIGH") confidence = "MEDIUM";
    else if (confidence === "MEDIUM") confidence = "LOW";
  }

  // Supporting params (use scaled power if available). Based on recCuts so they match
  // the dominant-gas speed recommendation (e.g. don't report N2 pressure for an O2 rec).
  const powers = recCuts.filter((c) => (c.scaled_power !== undefined ? c.scaled_power : c.power_pct) !== null).map((c) => (c.scaled_power !== undefined ? c.scaled_power : c.power_pct)!);
  const avgPower = powers.length > 0 ? Math.round(powers.reduce((a, b) => a + b, 0) / powers.length) : null;

  // Gas type for the recommendation is the dominant gas selected above.
  const commonGasType = dominantGas;

  const pressures = recCuts.filter((c) => c.gas_pressure_bar !== null).map((c) => c.gas_pressure_bar!);
  const avgGasPressure = pressures.length > 0 ? Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length * 10) / 10 : null;

  const focuses = recCuts.filter((c) => c.focus_position_mm !== null).map((c) => c.focus_position_mm!);
  const avgFocus = focuses.length > 0 ? Math.round(focuses.reduce((a, b) => a + b, 0) / focuses.length * 10) / 10 : null;

  const nozzles = recCuts.filter((c) => c.nozzle_diameter_mm !== null).map((c) => c.nozzle_diameter_mm!);
  const avgNozzle = nozzles.length > 0 ? Math.round(nozzles.reduce((a, b) => a + b, 0) / nozzles.length * 10) / 10 : null;

  const qPulses = recCuts.filter((c) => c.q_pulse_ns !== null && c.q_pulse_ns !== undefined).map((c) => c.q_pulse_ns!);
  const avgQPulseNs = qPulses.length > 0 ? Math.round(qPulses.reduce((a, b) => a + b, 0) / qPulses.length) : null;

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

  // --- Provenance / verification: surface the most authoritative source present ---
  // Priority: your_data > community_verified > community_reported > scraped > ai
  const provenanceRank: Record<Provenance, number> = {
    your_data: 5,
    community_verified: 4,
    community_reported: 3,
    scraped_reference: 2,
    ai_unverified: 1,
  };
  let topProvenance: Provenance | undefined;
  let verifiedCount = 0;
  for (const group of groups) {
    for (const cut of group.cuts) {
      const prov = cut.provenance || fallbackProvenance(group.source);
      if (!topProvenance || provenanceRank[prov] > provenanceRank[topProvenance]) {
        topProvenance = prov;
      }
      if (typeof cut.verified_count === "number") {
        verifiedCount = Math.max(verifiedCount, cut.verified_count);
      }
    }
  }

  // --- J/mm energy normalization (honest cross-machine transfer) ---
  // Representative data point: from the dominant-gas rows (recCuts), prefer the row
  // whose SOURCE wattage is closest to the user's machine, breaking ties by tier
  // weight. This makes the "scaled to your machine" note reflect the nearest real
  // datapoint of the right gas, not an arbitrary far-scaled row.
  const userWforRep = userMachine?.wattage_w || null;
  const wattDist = (c: ScaledCut): number => {
    const sw = c.recorded_wattage_w ?? c.machine_wattage ?? null;
    if (!userWforRep || !sw) return Number.POSITIVE_INFINITY;
    return Math.abs(sw - userWforRep);
  };
  const repCut = recCuts.reduce<ScaledCut | null>((best, c) => {
    if (!best) return c;
    const dc = wattDist(c), db = wattDist(best);
    if (dc !== db) return dc < db ? c : best;
    return (c.source_tier_weight || 0) > (best.source_tier_weight || 0) ? c : best;
  }, null);

  let jPerMm: number | null = null;
  let sourceWattageW: number | null = null;
  let energyScaledSpeed: number | null = null;

  if (repCut && repCut.power_pct !== null && repCut.speed_mm_min) {
    // The source wattage: recorded with the cut, else the community machine
    // wattage, else (for own cuts) the user's machine wattage.
    sourceWattageW =
      repCut.recorded_wattage_w ??
      repCut.machine_wattage ??
      userMachine?.wattage_w ??
      null;

    jPerMm = linearEnergyDensity({
      powerPct: repCut.power_pct,
      wattageW: sourceWattageW,
      speedMmMin: repCut.speed_mm_min,
      numPasses: repCut.num_passes ?? 1,
    });

    // If the user's machine wattage differs from the source, compute the speed
    // that achieves the same J/mm at the cut's power % on the user's machine.
    if (
      jPerMm !== null &&
      userMachine?.wattage_w &&
      sourceWattageW &&
      userMachine.wattage_w !== sourceWattageW
    ) {
      const transferred = crossMachineSpeed({
        sourcePowerPct: repCut.power_pct,
        sourceWattageW,
        sourceSpeedMmMin: repCut.speed_mm_min,
        sourceNumPasses: repCut.num_passes ?? 1,
        targetPowerPct: repCut.power_pct,
        targetWattageW: userMachine.wattage_w,
        targetNumPasses: repCut.num_passes ?? 1,
      });
      energyScaledSpeed = transferred !== null ? Math.round(transferred) : null;
    }
  }

  return {
    topProvenance,
    verifiedCount,
    jPerMm,
    sourceWattageW,
    energyScaledSpeed,
    avgSpeed,
    fastSpeed,
    conservativeSpeed,
    minSpeed,
    maxSpeed,
    dataPoints: recCuts.length,
    confidence,
    avgPower,
    commonGasType,
    avgGasPressure,
    avgFocus,
    avgNozzle,
    avgQPulseNs,
    scalingApplied,
    scalingWarning,
    scalingNote,
    activeProfile,
    feedbackCorrectionApplied,
    feedbackCorrectionDirection,
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
  const [thicknessToleranceUsed, setThicknessToleranceUsed] = useState<number>(0.5);
  const [matchedAliases, setMatchedAliases] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestionResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiHelpfulFeedback, setAiHelpfulFeedback] = useState<"yes" | "no" | null>(null);
  const [feedbackCorrection, setFeedbackCorrection] = useState<{ direction: 'faster' | 'slower' } | null>(null);
  const [interpolationNote, setInterpolationNote] = useState<string | null>(null);
  const [interpolationConfidenceReduced, setInterpolationConfidenceReduced] = useState(false);
  const [operationMismatch, setOperationMismatch] = useState<{
    available_operation: "cut" | "engrave";
    active_operation: "cut" | "engrave";
    material: string;
    thickness: number;
  } | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      // Feature 6: Query for the active machine
      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .order("is_active", { ascending: false, nullsFirst: false })
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
    setThicknessToleranceUsed(0.5);
    setMatchedAliases([]);
    setAiSuggestion(null);
    setAiLoading(false);
    setAiError(null);
    setAiHelpfulFeedback(null);
    setFeedbackCorrection(null);
    setInterpolationNote(null);
    setInterpolationConfidenceReduced(false);
    setOperationMismatch(null);

    const thicknessMm = parseFloat(thickness);

    // --- Fetch search data from server-side API route ---
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ material: searchMaterial, thickness: thicknessMm }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: 'Search failed' }));
      if (response.status === 401) {
        router.push("/auth");
        return;
      }
      console.error("Search API error:", errData.error);
      setSearched(true);
      setLoading(false);
      return;
    }

    const { groups: serverGroups, matchedAliases: serverAliases, tolerance: finalTolerance, feedbackData, userMachine: serverMachine, operation_mismatch: serverOperationMismatch } = await response.json();
    setOperationMismatch(serverOperationMismatch ?? null);

    // Update machine state if returned from server (keeps client in sync)
    if (serverMachine && !userMachine) {
      setUserMachine(serverMachine);
    }

    setMatchedAliases(serverAliases || []);

    // Apply client-side scaling to cuts (uses local machine state)
    const activeMachine = userMachine || serverMachine;
    let finalGroups: SuggestionGroup[] = (serverGroups || []).map((group: SuggestionGroup) => ({
      ...group,
      cuts: group.cuts.map((cut: any) => {
        const scaled = scaleCutIfNeeded(cut, activeMachine);
        // Preserve machine metadata from server for similarity scoring
        if (cut.machine_wattage !== undefined) {
          scaled.machine_wattage = cut.machine_wattage;
          scaled.machine_source_type = cut.machine_source_type;
        }
        return scaled;
      }),
    }));

    // Feature 1: Machine Similarity Scoring (client-side weighting)
    for (const group of finalGroups) {
      if (group.source === "community") {
        for (const cut of group.cuts) {
          if (cut.machine_wattage && activeMachine?.wattage_w) {
            const ratio = cut.machine_wattage / activeMachine.wattage_w;
            const sameSourceType = cut.machine_source_type === activeMachine.source_type;
            if (ratio >= 0.8 && ratio <= 1.2 && sameSourceType) {
              cut.source_tier_weight = 2.5; // Similar machine boost
            }
          }
        }
      }
    }

    // Feature 3: Thickness Interpolation
    if (finalGroups.length > 0 && finalTolerance > 0.5) {
      const allCuts = finalGroups.flatMap((g: SuggestionGroup) => g.cuts);
      const cutsBelow = allCuts.filter((c: any) => c.thickness_mm < thicknessMm && c.speed_mm_min);
      const cutsAbove = allCuts.filter((c: any) => c.thickness_mm > thicknessMm && c.speed_mm_min);

      if (cutsBelow.length > 0 && cutsAbove.length > 0) {
        const closestBelow = cutsBelow.reduce((prev: any, curr: any) =>
          Math.abs(curr.thickness_mm - thicknessMm) < Math.abs(prev.thickness_mm - thicknessMm) ? curr : prev
        );
        const closestAbove = cutsAbove.reduce((prev: any, curr: any) =>
          Math.abs(curr.thickness_mm - thicknessMm) < Math.abs(prev.thickness_mm - thicknessMm) ? curr : prev
        );

        const lowerThickness = closestBelow.thickness_mm;
        const upperThickness = closestAbove.thickness_mm;
        const lowerSpeed = closestBelow.scaled_speed || closestBelow.speed_mm_min!;
        const upperSpeed = closestAbove.scaled_speed || closestAbove.speed_mm_min!;

        const interpolatedSpeed = Math.round(
          lowerSpeed - (lowerSpeed - upperSpeed) * (thicknessMm - lowerThickness) / (upperThickness - lowerThickness)
        );

        setInterpolationNote(`Interpolated between ${lowerThickness}mm and ${upperThickness}mm data`);
        setInterpolationConfidenceReduced(true);

        if (finalGroups.length > 0) {
          const syntheticCut: ScaledCut = {
            ...closestBelow,
            id: 'interpolated',
            thickness_mm: thicknessMm,
            speed_mm_min: interpolatedSpeed,
            scaled_speed: interpolatedSpeed,
            notes: `Interpolated between ${lowerThickness}mm (${lowerSpeed} mm/min) and ${upperThickness}mm (${upperSpeed} mm/min)`,
            source_tier_weight: 1.5,
          };
          finalGroups[0].cuts.unshift(syntheticCut);
        }
      }
    }

    // Feature 2: Feedback correction from server-provided feedback data
    let dbFeedbackCorrection: { direction: 'faster' | 'slower' } | null = null;
    if (feedbackData && feedbackData.length >= 3) {
      const tooFastCount = feedbackData.filter((f: any) => f.feedback_type === 'too_fast').length;
      const tooSlowCount = feedbackData.filter((f: any) => f.feedback_type === 'too_slow').length;
      if (tooFastCount >= 3) {
        dbFeedbackCorrection = { direction: 'slower' };
      } else if (tooSlowCount >= 3) {
        dbFeedbackCorrection = { direction: 'faster' };
      }
    }
    setFeedbackCorrection(dbFeedbackCorrection);

    setThicknessToleranceUsed(finalTolerance);
    setSuggestions(finalGroups);
    setSearched(true);
    setLoading(false);

    // Restore previous feedback state for this material+thickness
    const searchMat = material || materialSearch;
    if (searchMat) {
      const prev = getStoredFeedback(searchMat, thickness);
      if (prev.length > 0) {
        setFeedbackGiven(prev[prev.length - 1].feedback);
      }
    }

    // Track if search returned no results for nudge D.
    // When the miss is an operation-type mismatch (data exists for this material +
    // thickness, but only under the OPPOSITE operation type), skip the AI fallback —
    // the AI would confidently hallucinate for the wrong operation. Show the
    // informative mismatch banner instead.
    if (finalGroups.length === 0 && !serverOperationMismatch && typeof window !== "undefined") {
      localStorage.setItem("cutlog-search-no-results", "true");

      // --- AI Fallback: call Gemini when all DB queries return empty ---
      setAiLoading(true);
      setAiSuggestion(null);
      setAiError(null);
      setAiHelpfulFeedback(null);

      // Check client-side cache first
      const aiCacheKey = `ai_suggest_${searchMaterial.toLowerCase()}_${thicknessMm}_${userMachine?.wattage_w || 100}_${userMachine?.lens_focal_length_mm || 110}_${userMachine?.source_type || "fiber"}`;
      const cachedAi = typeof window !== "undefined" ? localStorage.getItem(aiCacheKey) : null;

      if (cachedAi) {
        try {
          setAiSuggestion(JSON.parse(cachedAi));
          setAiLoading(false);
          return;
        } catch {
          // Invalid cache, proceed with fetch
        }
      }

      try {
        const aiResponse = await fetch("/api/ai-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            material: searchMaterial,
            thickness_mm: thicknessMm,
            wattage: userMachine?.wattage_w || 100,
            lens_mm: userMachine?.lens_focal_length_mm || 110,
            laser_type: userMachine?.source_type || "fiber",
          }),
        });

        if (aiResponse.ok) {
          const aiData: AiSuggestionResult = await aiResponse.json();
          setAiSuggestion(aiData);
          // Cache on client side
          if (typeof window !== "undefined") {
            localStorage.setItem(aiCacheKey, JSON.stringify(aiData));
          }
        } else {
          const errData = await aiResponse.json().catch(() => ({ error: "Unknown error" }));
          setAiError(errData.error || "AI suggestion failed");
        }
      } catch {
        setAiError("Could not reach AI service");
      } finally {
        setAiLoading(false);
      }
    }
  }

  async function handleAiHelpful(helpful: "yes" | "no") {
    setAiHelpfulFeedback(helpful);
    if (helpful === "yes" && aiSuggestion) {
      // Save the AI suggestion to the database as source='ai_suggestion'
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !userMachine) return;
      const searchMat = material || materialSearch;
      await supabase.from("cuts").insert({
        machine_id: userMachine.id,
        user_id: user.id,
        material: searchMat,
        thickness_mm: parseFloat(thickness),
        power_pct: aiSuggestion.power_pct,
        speed_mm_min: aiSuggestion.speed_mm_min,
        gas_type: aiSuggestion.gas_type,
        gas_pressure_bar: aiSuggestion.gas_pressure_bar,
        frequency_hz: aiSuggestion.frequency_hz,
        pierce_type: aiSuggestion.pierce_type ?? null,
        pierce_time_s: aiSuggestion.pierce_time_s ?? null,
        pierce_power_pct: aiSuggestion.pierce_power_pct ?? null,
        pierce_height_mm: aiSuggestion.pierce_height_mm ?? null,
        pierce_gas_pressure_bar: aiSuggestion.pierce_gas_pressure_bar ?? null,
        quality_rating: null,
        source: "ai_baseline",
        is_shared: false,
        notes: `AI suggestion: ${aiSuggestion.confidence_note}`,
      });
    }
  }

  async function handleFeedback(type: FeedbackType) {
    const searchMaterial = material || materialSearch;
    const rec = computeSpeedRecommendation(suggestions, userMachine, feedbackCorrection);
    if (rec && searchMaterial) {
      saveFeedback(searchMaterial, thickness, type, rec.avgSpeed);

      // Feature 2: Also save feedback to Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("feedback").insert({
            user_id: user.id,
            material: searchMaterial,
            thickness_mm: parseFloat(thickness),
            feedback_type: type,
            recommended_speed: rec.avgSpeed,
          });
        }
      } catch {
        // Feedback table may not exist yet, silently fail
      }
    }
    setFeedbackGiven(type);
    if (type !== feedbackGiven) {
      setShowFeedbackToast(true);
      setTimeout(() => setShowFeedbackToast(false), 3000);
    }
  }

  function formatParam(value: number | null, unit: string): string {
    if (value === null || value === undefined) return "—";
    return `${value}${unit}`;
  }

  const speedRec = suggestions.length > 0 ? computeSpeedRecommendation(suggestions, userMachine, feedbackCorrection, interpolationConfidenceReduced) : null;
  const searchMaterial = material || materialSearch;

  // Check for previous feedback on this material/thickness
  const previousFeedback = searched && searchMaterial && thickness
    ? getStoredFeedback(searchMaterial, thickness)
    : [];

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto pb-20">
      <div className="flex items-center gap-3 mb-2 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200 text-lg">&larr;</button>
        <h1 className="text-xl font-bold">{isGalvoMode(userMachine) ? "How fast should I engrave?" : "How fast should I cut?"}</h1>
      </div>
      <p className="text-sm text-zinc-500 mb-2 ml-8">
        Enter your material and thickness for a trusted starting point — so you run
        fewer test squares. Every machine is different; always confirm with a test cut.
      </p>
      <p className="text-xs ml-8 mb-4">
        <Link href="/tools/material-test" className="text-sky-400 hover:text-sky-300">
          Generate a LightBurn material-test grid →
        </Link>
      </p>

      {isGalvoMode(userMachine) && (
        <div className="mb-4 ml-8 px-3 py-2 rounded-xl bg-purple-900/30 border border-purple-700 inline-flex items-center gap-2">
          <span className="text-purple-300 text-sm font-medium">Galvo Mode</span>
          <span className="text-purple-400/70 text-xs">— showing engraving fields only</span>
        </div>
      )}

      {/* Contextual hint: no cuts yet - suggest import */}
      {!hasCuts && (
        <DiscoveryHint storageKey="suggest_import_clb">
          <p className="font-medium text-zinc-200 mb-1.5">New to CutLog?</p>
          <p className="text-xs text-zinc-300 mb-2">Have a LightBurn library? <HintLink href="/import">Import your .clb file</HintLink></p>
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

        {/* Thick-metal fiber cutting quick picks (hidden in galvo mode) */}
        {!isGalvoMode(userMachine) && (
          <div>
            <p className="text-xs text-zinc-500 mb-2">Common thick-metal cuts:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { m: "Mild Steel", t: "6" },
                { m: "Mild Steel", t: "10" },
                { m: "Mild Steel", t: "16" },
                { m: "Stainless Steel", t: "6" },
                { m: "Stainless Steel", t: "10" },
                { m: "Aluminum", t: "8" },
                { m: "Aluminum", t: "12" },
              ].map((q) => (
                <button
                  key={`${q.m}-${q.t}`}
                  type="button"
                  onClick={() => { setMaterial(q.m); setMaterialSearch(""); setShowDropdown(false); setThickness(q.t); }}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-medium hover:border-blue-600 hover:text-blue-300 transition-colors"
                >
                  {q.m} {q.t}mm
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!material && !materialSearch) || !thickness}
          className="w-full p-3 rounded-xl bg-blue-700 hover:bg-blue-600 font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? "Searching..." : "Get Speed Recommendation"}
        </button>
      </form>

      {/* Operation-type mismatch banner — data exists but for the opposite operation */}
      {searched && suggestions.length === 0 && !loading && operationMismatch && (
        <div className="border border-amber-800/50 bg-amber-900/20 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-amber-400 text-lg mt-0.5">⚠</span>
            <div>
              <p className="text-amber-200 font-medium mb-2">
                We have {operationMismatch.available_operation === "cut" ? "cutting" : "engraving"} data
                for {operationMismatch.material} at {operationMismatch.thickness}mm,
                but your active machine is set up for {operationMismatch.active_operation === "cut" ? "cutting" : "engraving"}.
              </p>
              <p className="text-sm text-amber-300/80">
                Switch to a {operationMismatch.available_operation === "cut" ? "cutting" : "engraving"} machine to see it.{" "}
                <Link href="/machine" className="text-sky-400 hover:text-sky-300 font-medium underline">
                  Manage machines
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Loading State */}
      {searched && suggestions.length === 0 && !loading && !operationMismatch && aiLoading && (
        <div className="border border-zinc-700 bg-zinc-900/50 rounded-xl p-6 text-center">
          <div className="animate-pulse">
            <div className="w-8 h-8 mx-auto mb-3 rounded-full bg-zinc-700"></div>
            <p className="text-zinc-300 font-medium">Asking AI for a starting point...</p>
            <p className="text-xs text-zinc-500 mt-2">Generating parameters based on your machine setup</p>
          </div>
        </div>
      )}

      {/* AI Suggestion Result */}
      {searched && suggestions.length === 0 && !loading && !operationMismatch && !aiLoading && aiSuggestion && (
        <div className="mb-6">
          {/* AI suggestion hero card */}
          <div className="bg-zinc-800 border border-zinc-600 rounded-2xl p-6 mb-4">
            <div className="text-center">
              {/* AI badge */}
              <div className="mb-3 flex items-center justify-center">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-zinc-700/60 border border-zinc-500 text-zinc-300">
                  AI SUGGESTION
                </span>
              </div>

              <p className="text-sm text-zinc-400 mb-1 uppercase tracking-wide">
                AI-Generated Speed
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-zinc-300 font-mono mb-1">
                {aiSuggestion.speed_mm_min.toLocaleString()}
              </p>
              <p className="text-sm text-zinc-400/70 mb-3">mm/min</p>

              {/* UNVERIFIED confidence badge */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-700/60 text-zinc-400 border border-zinc-600">
                  UNVERIFIED
                </span>
                <span className="text-xs text-zinc-500">Unverified &mdash; AI Generated</span>
              </div>

              {/* Warning disclaimer */}
              <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-300/80">
                  This is an AI-generated estimate. Always test on scrap material first.
                </p>
              </div>

              {/* Confidence note from Gemini */}
              {aiSuggestion.confidence_note && (
                <p className="text-xs text-zinc-400 italic mb-4">
                  &ldquo;{aiSuggestion.confidence_note}&rdquo;
                </p>
              )}
            </div>

            {/* Reference parameters */}
            <div className="border-t border-zinc-700 pt-4 mt-2">
              <p className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wide">Suggested Parameters</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-3 py-2">
                  <span className="text-zinc-400 text-xs">Power</span>
                  <span className="font-mono text-zinc-200">{aiSuggestion.power_pct}%</span>
                </div>
                {/* Gas - hidden in galvo mode */}
                {!isGalvoMode(userMachine) && aiSuggestion.gas_type && (
                  <div className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs">Gas</span>
                    <span className="font-mono text-zinc-200">
                      {aiSuggestion.gas_type}{aiSuggestion.gas_pressure_bar ? ` ${aiSuggestion.gas_pressure_bar}bar` : ""}
                    </span>
                  </div>
                )}
                {aiSuggestion.frequency_hz && (
                  <div className="flex items-center justify-between bg-zinc-900/50 rounded-lg px-3 py-2">
                    <span className={`text-xs ${isGalvoMode(userMachine) ? "text-emerald-400 font-medium" : "text-zinc-400"}`}>Frequency</span>
                    <span className="font-mono text-zinc-200">{aiSuggestion.frequency_hz} Hz</span>
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 pt-3 border-t border-zinc-700">
              <p className="text-xs text-zinc-500 text-center">
                Not verified by any operator. Use as a starting point only.
              </p>
            </div>
          </div>

          {/* Was this helpful? */}
          {aiHelpfulFeedback === null ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-sm text-zinc-400 mb-3">Was this helpful?</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleAiHelpful("yes")}
                  className="px-4 py-2 rounded-lg bg-emerald-900/50 border border-emerald-700 text-emerald-300 text-sm font-medium hover:bg-emerald-800/60 active:scale-95 transition-all"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleAiHelpful("no")}
                  className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-700/60 active:scale-95 transition-all"
                >
                  No
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-sm text-zinc-400">
                {aiHelpfulFeedback === "yes"
                  ? "Saved to your history for future reference."
                  : "Thanks for letting us know. Try logging a test cut for better results."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* No results state - enhanced empty state (shown when AI also fails or no AI) */}
      {searched && suggestions.length === 0 && !loading && !operationMismatch && !aiLoading && !aiSuggestion && (
        <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6">
          <p className="text-zinc-300 text-lg mb-2 font-medium">No exact match found for this combination.</p>
          {aiError && (
            <p className="text-xs text-amber-400 mb-3">AI suggestion unavailable: {aiError}</p>
          )}
          <p className="text-sm text-zinc-400 mb-5">Here&apos;s what you can do:</p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold mt-0.5">1.</span>
              <div>
                <Link href="/import" className="text-sky-400 hover:text-sky-300 font-medium">
                  Import your LightBurn library
                </Link>
                <p className="text-xs text-zinc-500 mt-0.5">Auto-scaled to your lens, engraving support included</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold mt-0.5">2.</span>
              <div>
                <button
                  type="button"
                  onClick={() => { router.push("/log"); }}
                  className="text-sky-400 hover:text-sky-300 font-medium text-sm text-left"
                >
                  Log your first test cut
                </button>
                <p className="text-xs text-zinc-500 mt-0.5">Build a personalized baseline for this material</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold mt-0.5">3.</span>
              <div>
                <p className="text-zinc-300">Try a broader search</p>
                <p className="text-xs text-zinc-500 mt-0.5">Search just the material name with any thickness to see what data exists</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-5 pt-4 border-t border-zinc-800">
            AI recommendations improve as more operators log cuts for this material.
          </p>
        </div>
      )}

      {/* Contextual hint: results found but no machine set up */}
      {searched && suggestions.length > 0 && !hasMachine && (
        <DiscoveryHint storageKey="suggest_setup_machine">
          <p className="text-sm text-zinc-300 mb-1.5"><HintLink href="/machine">Set up your machine profile</HintLink> for auto-scaled parameters.</p>
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
                {(() => {
                  const profile = speedRec.activeProfile;
                  if (profile === 'conservative') return speedRec.conservativeSpeed.toLocaleString();
                  if (profile === 'fast') return speedRec.fastSpeed.toLocaleString();
                  // auto: use conservative for engraving, fast otherwise
                  return speedRec.fastSpeed.toLocaleString();
                })()}
              </p>
              <p className="text-sm text-emerald-300/70 mb-1">
                mm/min
                {speedRec.scalingApplied && userMachine?.lens_focal_length_mm && (
                  <span className="block text-xs text-zinc-500 mt-1">
                    for {userMachine.lens_focal_length_mm}mm lens
                  </span>
                )}
              </p>

              {/* Thickness fallback indicator */}
              {thicknessToleranceUsed > 0.5 && (
                <p className="text-xs text-amber-400 mt-2">
                  Showing data for nearby thicknesses (&plusmn;{thicknessToleranceUsed}mm)
                </p>
              )}

              {/* Feature 3: Interpolation indicator */}
              {interpolationNote && (
                <p className="text-xs text-sky-400 mt-1">
                  {interpolationNote}
                </p>
              )}

              {/* Feature 2: Feedback correction indicator */}
              {speedRec.feedbackCorrectionApplied && (
                <p className="text-xs text-purple-400 mt-1">
                  Adjusted {speedRec.feedbackCorrectionDirection === 'faster' ? '+10%' : '-10%'} based on your feedback history
                </p>
              )}

              {/* Material alias resolution indicator */}
              {matchedAliases.length > 0 && (
                <p className="text-xs text-zinc-500 mt-1">
                  Also matched: {matchedAliases.slice(0, 5).join(", ")}
                </p>
              )}
              {speedRec.activeProfile === 'conservative' && (
                <p className="text-xs text-zinc-500 mb-2">
                  Fast speed: {speedRec.fastSpeed.toLocaleString()} mm/min
                </p>
              )}
              {speedRec.activeProfile === 'fast' && (
                <p className="text-xs text-zinc-500 mb-2">
                  Conservative: {speedRec.conservativeSpeed.toLocaleString()} mm/min
                </p>
              )}

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

              {/* Provenance + verification badges (honest trust signals) */}
              {(speedRec.topProvenance || (speedRec.verifiedCount ?? 0) > 0) && (
                <div className="flex items-center justify-center flex-wrap gap-2 mb-2">
                  {speedRec.topProvenance && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${PROVENANCE_META[speedRec.topProvenance].cls}`}>
                      {PROVENANCE_META[speedRec.topProvenance].label}
                    </span>
                  )}
                  {(speedRec.verifiedCount ?? 0) > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-emerald-900/50 border-emerald-700 text-emerald-300">
                      ✓ Verified by {speedRec.verifiedCount} operator{speedRec.verifiedCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              {/* J/mm energy density badge (honest, machine-independent) */}
              {speedRec.jPerMm != null && (
                <div className="flex items-center justify-center mb-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-zinc-800/70 border border-zinc-700 text-zinc-400" title="Linear energy density — transfers across machines of different wattage, unlike a raw power %.">
                    ⚡ {formatEnergyDensity(speedRec.jPerMm)}
                  </span>
                </div>
              )}

              {/* Energy-scaled speed for the user's machine wattage (starting point) */}
              {speedRec.energyScaledSpeed != null && userMachine?.wattage_w && speedRec.sourceWattageW && (
                <div className="bg-sky-900/20 border border-sky-800/50 rounded-lg p-3 mb-3 text-xs">
                  <p className="text-sky-300">
                    Scaled to your machine ({userMachine.wattage_w >= 1000 ? `${userMachine.wattage_w / 1000}kW` : `${userMachine.wattage_w}W`}):
                    <span className="font-mono font-semibold ml-1">~{speedRec.energyScaledSpeed.toLocaleString()} mm/min</span>
                  </p>
                  <p className="text-sky-400/60 mt-1">
                    Same energy per mm ({formatEnergyDensity(speedRec.jPerMm)}) as the source data
                    ({speedRec.sourceWattageW >= 1000 ? `${speedRec.sourceWattageW / 1000}kW` : `${speedRec.sourceWattageW}W`}) at the same power %.
                    Starting point — run a material test.
                  </p>
                </div>
              )}

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

          </div>

          {/* Reference parameters section - shown right after the recommendation card */}
          <div className="mb-4">
            {/* Always-visible top parameters */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wide">Reference Parameters</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {speedRec.avgPower !== null && (
                  <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs">Power</span>
                    <span className="font-mono text-zinc-200">{speedRec.avgPower}%</span>
                  </div>
                )}
                {/* Q-Pulse shown prominently for galvo users */}
                {isGalvoMode(userMachine) && speedRec.avgQPulseNs !== null && (
                  <div className="flex items-center justify-between bg-emerald-900/30 border border-emerald-800 rounded-lg px-3 py-2">
                    <span className="text-emerald-400 text-xs font-medium">Q-Pulse</span>
                    <span className="font-mono text-emerald-200">{speedRec.avgQPulseNs}ns</span>
                  </div>
                )}
                {/* Gas - hidden in galvo mode */}
                {!isGalvoMode(userMachine) && speedRec.commonGasType && (
                  <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs">Gas</span>
                    <span className="font-mono text-zinc-200">{speedRec.commonGasType}{speedRec.avgGasPressure ? ` ${speedRec.avgGasPressure}bar` : ""}</span>
                  </div>
                )}
                {/* Focus - hidden in galvo mode */}
                {!isGalvoMode(userMachine) && speedRec.avgFocus !== null && (
                  <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs">Focus</span>
                    <span className="font-mono text-zinc-200">{speedRec.avgFocus}mm</span>
                  </div>
                )}
                {/* Nozzle - hidden in galvo mode */}
                {!isGalvoMode(userMachine) && speedRec.avgNozzle !== null && (
                  <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs">Nozzle</span>
                    <span className="font-mono text-zinc-200">{speedRec.avgNozzle}mm</span>
                  </div>
                )}
                {/* Q-Pulse for non-galvo users (standard display) */}
                {!isGalvoMode(userMachine) && speedRec.avgQPulseNs !== null && (
                  <div className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-zinc-400 text-xs">Q-Pulse</span>
                    <span className="font-mono text-zinc-200">{speedRec.avgQPulseNs}ns</span>
                  </div>
                )}
              </div>

              {/* Expandable detailed cuts */}
              <button
                onClick={() => setShowFullParams(!showFullParams)}
                className="w-full flex items-center justify-center gap-2 mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <span>{showFullParams ? "Hide detailed cuts" : "Show all cuts & details"}</span>
                <span>{showFullParams ? "▲" : "▼"}</span>
              </button>

              {showFullParams && (
                <div className="mt-3">
                  <p className="text-xs text-zinc-500 mb-3">
                    Individual cut data used for this recommendation. Adjust based on your machine setup.
                  </p>

                  {/* Tier-grouped detailed results */}
                  {suggestions.map((group) => (
                    <div key={group.source} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        {(() => {
                          const prov = (group.cuts[0]?.provenance as Provenance) || fallbackProvenance(group.source);
                          return (
                            <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${PROVENANCE_META[prov].cls}`}>
                              {PROVENANCE_META[prov].label}
                            </span>
                          );
                        })()}
                        <span className="text-sm text-zinc-400">{group.label}</span>
                        <span className="text-sm text-yellow-400 ml-auto">
                          {"★".repeat(Math.round(group.avg_rating))} {group.avg_rating.toFixed(1)}
                        </span>
                      </div>

                      {group.cuts.map((cut, i) => {
                        // A row is excluded from the headline rec if it uses a different
                        // gas than the dominant one (see gas separation in compute).
                        const recGas = speedRec?.commonGasType || null;
                        const unusedForRec = !!(recGas && cut.gas_type && cut.gas_type !== recGas);
                        return (
                        <div key={cut.id || i} className={`bg-zinc-800/30 border border-zinc-700 rounded-xl p-4 mb-2 ${unusedForRec ? "opacity-60" : ""}`}>
                          {unusedForRec && (
                            <div className="mb-2 text-xs text-amber-400/90">
                              Not used for this {recGas} recommendation ({cut.gas_type} cut — different assist gas)
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-3 text-sm">
                            <div>
                              <span className="text-zinc-500 text-xs block">Power</span>
                              <span className="font-mono">{formatParam(cut.scaled_power !== undefined ? cut.scaled_power : cut.power_pct, "%")}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 text-xs block">Speed</span>
                              <span className="font-mono text-emerald-400">{formatParam(cut.scaled_speed !== undefined ? cut.scaled_speed : cut.speed_mm_min, " mm/min")}</span>
                            </div>
                            {!isGalvoMode(userMachine) && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Gas</span>
                                <span className="font-mono">{cut.gas_type || "—"} {cut.gas_pressure_bar ? `${cut.gas_pressure_bar}bar` : ""}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Focus</span>
                                <span className="font-mono">{formatParam(cut.focus_position_mm, "mm")}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Nozzle</span>
                                <span className="font-mono">{formatParam(cut.nozzle_diameter_mm, "mm")}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && cut.nozzle_distance_mm != null && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Nozzle Gap</span>
                                <span className="font-mono">{formatParam(cut.nozzle_distance_mm, "mm")}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && cut.num_passes != null && cut.num_passes > 1 && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Passes</span>
                                <span className="font-mono">{cut.num_passes}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && cut.pierce_type != null && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Pierce Type</span>
                                <span className="font-mono capitalize">{cut.pierce_type}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && cut.pierce_time_s != null && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Pierce Time</span>
                                <span className="font-mono">{formatParam(cut.pierce_time_s, " s")}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && cut.pierce_power_pct != null && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Pierce Power</span>
                                <span className="font-mono">{formatParam(cut.pierce_power_pct, "%")}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && cut.pierce_height_mm != null && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Pierce Height</span>
                                <span className="font-mono">{formatParam(cut.pierce_height_mm, "mm")}</span>
                              </div>
                            )}
                            {!isGalvoMode(userMachine) && cut.pierce_gas_pressure_bar != null && (
                              <div>
                                <span className="text-zinc-500 text-xs block">Pierce Pressure</span>
                                <span className="font-mono">{formatParam(cut.pierce_gas_pressure_bar, " bar")}</span>
                              </div>
                            )}
                            {(() => {
                              const wattage = cut.recorded_wattage_w ?? cut.machine_wattage ?? userMachine?.wattage_w ?? null;
                              const jmm = linearEnergyDensity({
                                powerPct: cut.power_pct,
                                wattageW: wattage,
                                speedMmMin: cut.speed_mm_min,
                                numPasses: cut.num_passes ?? 1,
                              });
                              return jmm != null ? (
                                <div>
                                  <span className="text-zinc-500 text-xs block">Energy</span>
                                  <span className="font-mono text-zinc-400">{formatEnergyDensity(jmm)}</span>
                                </div>
                              ) : null;
                            })()}
                            {cut.q_pulse_ns && (
                              <div>
                                <span className={`text-xs block ${isGalvoMode(userMachine) ? "text-emerald-400 font-medium" : "text-zinc-500"}`}>Q-Pulse</span>
                                <span className="font-mono">{cut.q_pulse_ns}ns</span>
                              </div>
                            )}
                            {isGalvoMode(userMachine) && cut.line_interval_mm && (
                              <div>
                                <span className="text-emerald-400 text-xs block font-medium">Line Interval</span>
                                <span className="font-mono">{cut.line_interval_mm}mm</span>
                              </div>
                            )}
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
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Speed Profile Explanation - now AFTER reference parameters */}
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
                  Change your speed profile
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
                className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === "too_slow"
                    ? "bg-amber-700 text-amber-100 ring-2 ring-amber-400"
                    : "bg-amber-900/50 border border-amber-700 text-amber-300 hover:bg-amber-800/60 active:scale-95"
                }`}
              >
                <span className="block text-lg mb-1">&laquo;</span>
                Too Slow
              </button>
              <button
                onClick={() => handleFeedback("perfect")}
                className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === "perfect"
                    ? "bg-emerald-700 text-emerald-100 ring-2 ring-emerald-400"
                    : "bg-emerald-900/50 border border-emerald-600 text-emerald-300 hover:bg-emerald-800/60 active:scale-95"
                }`}
              >
                <span className="block text-lg mb-1">✓</span>
                Perfect
              </button>
              <button
                onClick={() => handleFeedback("too_fast")}
                className={`p-4 rounded-xl font-semibold text-sm transition-all ${
                  feedbackGiven === "too_fast"
                    ? "bg-red-700 text-red-100 ring-2 ring-red-400"
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

          {/* Soft upsell — one tasteful nudge, not a nag */}
          <p className="text-xs text-zinc-600 text-center mt-2">
            <Link href="/pricing" className="text-emerald-500/80 hover:text-emerald-400 transition-colors">
              Unlock unlimited AI suggestions & the verified library → see Pro
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
