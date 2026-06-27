"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { EDGE_QUALITIES, GAS_TYPES, OPERATION_TYPES } from "@/lib/types";
import type { Machine, Material } from "@/lib/types";

export default function LogCut() {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialSearch, setMaterialSearch] = useState("");
  const [showMaterialDropdown, setShowMaterialDropdown] = useState(false);

  const [material, setMaterial] = useState("");
  const [thickness, setThickness] = useState("");
  const [powerPct, setPowerPct] = useState("");
  const [speed, setSpeed] = useState("");
  const [gasType, setGasType] = useState("");
  const [gasPressure, setGasPressure] = useState("");
  const [focusPosition, setFocusPosition] = useState("");
  const [nozzleDiameter, setNozzleDiameter] = useState("");
  const [nozzleDistance, setNozzleDistance] = useState("");
  const [lineInterval, setLineInterval] = useState("");
  const [pulseFreq, setPulseFreq] = useState("");
  const [qualityRating, setQualityRating] = useState<number>(0);
  const [edgeQuality, setEdgeQuality] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Engraving-specific fields
  const [frequencyHz, setFrequencyHz] = useState("");
  const [numPasses, setNumPasses] = useState("");
  const [operationType, setOperationType] = useState("");
  const [crossHatch, setCrossHatch] = useState(false);
  const [scanAngle, setScanAngle] = useState("");
  const [qPulseNs, setQPulseNs] = useState("");

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      // Feature 6: Load all machines, default to active
      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .order("is_active", { ascending: false, nullsFirst: false });

      if (machines && machines.length > 0) {
        setAllMachines(machines as Machine[]);
        setMachine(machines[0]); // First one is active (sorted by is_active desc)
      }

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

  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    // Use materialSearch as fallback if material wasn't selected from dropdown
    const finalMaterial = material || materialSearch;

    if (!machine) { setSubmitError("Please set up your machine first (go to Settings)"); return; }
    if (!finalMaterial) { setSubmitError("Please select or type a material"); return; }
    if (!thickness) { setSubmitError("Please enter a thickness"); return; }
    if (qualityRating === 0) { setSubmitError("Please rate the cut quality (1-5 stars)"); return; }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("cuts").insert({
      machine_id: machine.id,
      user_id: user.id,
      material: finalMaterial,
      thickness_mm: parseFloat(thickness),
      power_pct: powerPct ? parseFloat(powerPct) : null,
      speed_mm_min: speed ? parseFloat(speed) : null,
      gas_type: gasType || null,
      gas_pressure_bar: gasPressure ? parseFloat(gasPressure) : null,
      focus_position_mm: focusPosition ? parseFloat(focusPosition) : null,
      nozzle_diameter_mm: nozzleDiameter ? parseFloat(nozzleDiameter) : null,
      nozzle_distance_mm: nozzleDistance ? parseFloat(nozzleDistance) : null,
      line_interval_mm: lineInterval ? parseFloat(lineInterval) : null,
      pulse_frequency_hz: pulseFreq ? parseFloat(pulseFreq) : null,
      quality_rating: qualityRating,
      edge_quality: edgeQuality || null,
      notes: notes || null,
      is_shared: true,
      // Engraving-specific fields
      frequency_hz: frequencyHz ? parseInt(frequencyHz) : null,
      num_passes: numPasses ? parseInt(numPasses) : null,
      operation_type: operationType || null,
      cross_hatch: crossHatch || null,
      scan_angle_degrees: scanAngle ? parseFloat(scanAngle) : null,
      q_pulse_ns: qPulseNs ? parseFloat(qPulseNs) : null,
    });

    if (!error) {
      setSuccess(true);

      // Track if user is logging engraving (frequency/passes/scan angle)
      if ((frequencyHz || numPasses || scanAngle) && typeof window !== "undefined") {
        const prefs = JSON.parse(localStorage.getItem("cutlog_user_prefs") || "{}");
        prefs.hasGalvo = true;
        localStorage.setItem("cutlog_user_prefs", JSON.stringify(prefs));
      }

      // Track cut logging count
      const cutsLogged = parseInt(localStorage.getItem("cutlog-cuts-logged") || "0", 10);
      localStorage.setItem("cutlog-cuts-logged", String(cutsLogged + 1));

      setTimeout(() => router.push("/"), 1500);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-5xl mb-4">✓</div>
        <p className="text-xl font-semibold text-emerald-400">Cut logged!</p>
        <p className="text-zinc-500 mt-2">Your machine just got smarter.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto pb-20">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200">←</button>
        <h1 className="text-xl font-bold">Log a Cut</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Material */}
        <div className="relative">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Material *</label>
          <input
            type="text"
            placeholder="Search materials..."
            value={materialSearch || material}
            onChange={(e) => {
              setMaterialSearch(e.target.value);
              setMaterial("");
              setShowMaterialDropdown(true);
            }}
            onFocus={() => setShowMaterialDropdown(true)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
            required
          />
          {showMaterialDropdown && materialSearch && filteredMaterials.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-lg max-h-64 overflow-y-auto">
              {filteredMaterials.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMaterial(m.name);
                    setMaterialSearch("");
                    setShowMaterialDropdown(false);
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

        {/* Feature 6: Machine selector (shown if user has >1 machine) */}
        {allMachines.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Machine</label>
            <select
              value={machine?.id || ""}
              onChange={(e) => {
                const selected = allMachines.find(m => m.id === e.target.value);
                if (selected) setMachine(selected);
              }}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100"
            >
              {allMachines.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nickname || `${m.brand} ${m.model || ""}`} ({m.wattage_w ? `${m.wattage_w}W` : ""}){(m as any).is_active !== false ? " (Active)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Thickness */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Thickness (mm) *</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 3.0"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
            required
          />
        </div>

        {/* Parameters section */}
        <div className="border-t border-zinc-800 pt-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">PARAMETERS</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Power (%)</label>
              <input
                type="number"
                step="1"
                placeholder="85"
                value={powerPct}
                onChange={(e) => setPowerPct(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Speed (mm/min)</label>
              <input
                type="number"
                step="10"
                placeholder="4200"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Gas Type</label>
              <select
                value={gasType}
                onChange={(e) => setGasType(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100"
              >
                <option value="">—</option>
                {GAS_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Gas Pressure (bar)</label>
              <input
                type="number"
                step="0.5"
                placeholder="14"
                value={gasPressure}
                onChange={(e) => setGasPressure(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Focus Position (mm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="-1.5"
                value={focusPosition}
                onChange={(e) => setFocusPosition(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Line Interval (mm)</label>
              <input
                type="number"
                step="0.001"
                placeholder="0.05"
                value={lineInterval}
                onChange={(e) => setLineInterval(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Nozzle Diameter (mm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="2.0"
                value={nozzleDiameter}
                onChange={(e) => setNozzleDiameter(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Nozzle Distance (mm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0.8"
                value={nozzleDistance}
                onChange={(e) => setNozzleDistance(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Pulse Frequency (Hz)</label>
              <input
                type="number"
                placeholder="CW = blank"
                value={pulseFreq}
                onChange={(e) => setPulseFreq(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Q-Pulse (ns)</label>
              <input
                type="number"
                step="1"
                placeholder="e.g. 20"
                value={qPulseNs}
                onChange={(e) => setQPulseNs(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>
        </div>

        {/* Engraving parameters section - only show for engraving machines */}
        {machine?.laser_source_type?.includes('engraving') && (
          <div className="border-t border-zinc-800 pt-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-3">ENGRAVING (optional)</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Operation Type</label>
                <select
                  value={operationType}
                  onChange={(e) => setOperationType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100"
                >
                  <option value="">—</option>
                  {OPERATION_TYPES.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Frequency (Hz)</label>
                <input
                  type="number"
                  placeholder="e.g. 80000"
                  value={frequencyHz}
                  onChange={(e) => setFrequencyHz(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Number of Passes</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="1"
                  value={numPasses}
                  onChange={(e) => setNumPasses(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Scan Angle (degrees)</label>
                <input
                  type="number"
                  step="1"
                  placeholder="0"
                  min="-90"
                  max="90"
                  value={scanAngle}
                  onChange={(e) => setScanAngle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={crossHatch}
                  onChange={(e) => setCrossHatch(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-900 border border-zinc-700 checked:bg-emerald-600 checked:border-emerald-600"
                />
                <span className="text-xs text-zinc-500">Cross-hatch fill used</span>
              </label>
            </div>
          </div>
        )}

        {/* Result section */}
        <div className="border-t border-zinc-800 pt-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">RESULT *</h3>

          {/* Star rating */}
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 mb-2">Quality Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setQualityRating(star)}
                  className={`text-3xl transition-transform ${
                    star <= qualityRating
                      ? "text-yellow-400 scale-110"
                      : "text-zinc-700 hover:text-zinc-500"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Edge quality */}
          <div className="mb-4">
            <label className="block text-xs text-zinc-500 mb-2">Edge Quality</label>
            <div className="grid grid-cols-2 gap-2">
              {EDGE_QUALITIES.map(eq => (
                <button
                  key={eq.value}
                  type="button"
                  onClick={() => setEdgeQuality(eq.value === edgeQuality ? "" : eq.value)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                    edgeQuality === eq.value
                      ? "bg-emerald-900/50 border-emerald-600 text-emerald-300"
                      : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {eq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. Slight dross on bottom edge at corners"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
            />
          </div>
        </div>

        {submitError && (
          <p className="text-red-400 text-sm text-center mb-2">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-semibold text-lg transition-colors disabled:opacity-50 sticky bottom-4"
        >
          {loading ? "Saving..." : "Log Cut ✓"}
        </button>
      </form>
    </div>
  );
}
