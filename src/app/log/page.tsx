"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { triggerHaptic } from "@/lib/native";
import { EDGE_QUALITIES, GAS_TYPES } from "@/lib/types";
import type { Machine, Material } from "@/lib/types";

export default function LogCut() {
  const [machine, setMachine] = useState<Machine | null>(null);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!machine || !material || !thickness || qualityRating === 0) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("cuts").insert({
      machine_id: machine.id,
      user_id: user.id,
      material,
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
    });

    if (!error) {
      setSuccess(true);
      // Haptic feedback on native devices when cut is saved successfully
      triggerHaptic();
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

          <div className="mt-3">
            <label className="block text-xs text-zinc-500 mb-1">Pulse Frequency (Hz)</label>
            <input
              type="number"
              placeholder="Leave blank for CW mode"
              value={pulseFreq}
              onChange={(e) => setPulseFreq(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
            />
          </div>
        </div>

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

        <button
          type="submit"
          disabled={loading || !material || !thickness || qualityRating === 0}
          className="w-full p-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-semibold text-lg transition-colors disabled:opacity-50 sticky bottom-4"
        >
          {loading ? "Saving..." : "Log Cut ✓"}
        </button>
      </form>
    </div>
  );
}
