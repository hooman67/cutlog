"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MACHINE_BRANDS, GAS_TYPES, SPEED_PROFILES, LASER_SOURCE_TYPES } from "@/lib/types";
import type { Machine } from "@/lib/types";

export default function MachineSetup() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [wattage, setWattage] = useState("");
  const [sourceType, setSourceType] = useState("fiber");
  const [hours, setHours] = useState("");
  const [gasTypes, setGasTypes] = useState<string[]>([]);
  const [controller, setController] = useState("");
  const [country, setCountry] = useState("");
  const [nickname, setNickname] = useState("");
  const [lensFocalLength, setLensFocalLength] = useState("110");
  const [laserSourceType, setLaserSourceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [speedProfile, setSpeedProfile] = useState<'fast' | 'conservative' | 'auto'>('auto');
  // Feature 6: Multi-machine support
  const [allMachines, setAllMachines] = useState<Machine[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  // Per-machine delete (mirrors the cuts delete pattern on /history)
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadExisting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      // Feature 6: Load ALL machines for this user
      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (machines && machines.length > 0) {
        setAllMachines(machines as Machine[]);
        // Load the active machine into the form (is_active=true, or first one)
        const activeMachine = machines.find((m: any) => m.is_active !== false) || machines[0];
        loadMachineIntoForm(activeMachine);
      }
    }
    loadExisting();
  }, []);

  function loadMachineIntoForm(m: any) {
    setExistingId(m.id);
    setBrand(m.brand);
    setModel(m.model || "");
    setWattage(m.wattage_w ? String(m.wattage_w) : "");
    setSourceType(m.source_type);
    setHours(m.resonator_hours ? String(m.resonator_hours) : "");
    setGasTypes(m.gas_types || []);
    setController(m.controller || "");
    setCountry(m.location_country || "");
    setNickname(m.nickname || "");
    setLensFocalLength(m.lens_focal_length_mm ? String(m.lens_focal_length_mm) : "110");
    setLaserSourceType(m.laser_source_type || "");
    setSpeedProfile(m.speed_profile || 'auto');
  }

  async function handleSetActive(machineId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Set all machines to inactive
    await supabase
      .from("machines")
      .update({ is_active: false })
      .eq("user_id", user.id);

    // Set selected machine to active
    await supabase
      .from("machines")
      .update({ is_active: true })
      .eq("id", machineId);

    // Refresh the list
    const { data: machines } = await supabase
      .from("machines")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (machines) {
      setAllMachines(machines as Machine[]);
      const activeMachine = machines.find((m: any) => m.is_active !== false) || machines[0];
      loadMachineIntoForm(activeMachine);
    }
  }

  function handleAddNew() {
    setExistingId(null);
    setBrand("");
    setModel("");
    setWattage("");
    setSourceType("fiber");
    setHours("");
    setGasTypes([]);
    setController("");
    setCountry("");
    setNickname("");
    setLensFocalLength("110");
    setLaserSourceType("");
    setSpeedProfile('auto');
    setShowAddForm(true);
  }

  async function handleDeleteMachine(machineId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setDeletingId(machineId);

    const { error } = await supabase
      .from("machines")
      .delete()
      .eq("id", machineId)
      .eq("user_id", user.id);

    if (!error) {
      // Reload remaining machines and refresh the form / active selection
      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      const remaining = (machines || []) as Machine[];
      setAllMachines(remaining);

      // If we deleted the machine currently loaded in the form, load another (or reset)
      if (existingId === machineId) {
        if (remaining.length > 0) {
          const activeMachine = remaining.find((m: any) => m.is_active !== false) || remaining[0];
          loadMachineIntoForm(activeMachine);
        } else {
          handleAddNew();
          setShowAddForm(false);
        }
      }
    }

    setDeletingId(null);
    setConfirmDeleteId(null);
  }

  function toggleGas(gas: string) {
    setGasTypes(prev =>
      prev.includes(gas) ? prev.filter(g => g !== gas) : [...prev, gas]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const machineData = {
      user_id: user.id,
      brand,
      model: model || null,
      wattage_w: wattage ? parseInt(wattage) : null,
      source_type: sourceType,
      lens_focal_length_mm: lensFocalLength ? parseInt(lensFocalLength) : 110,
      laser_source_type: laserSourceType || null,
      resonator_hours: hours ? parseInt(hours) : null,
      gas_types: gasTypes,
      controller: controller || null,
      location_country: country || null,
      nickname: nickname || null,
      speed_profile: speedProfile,
      is_active: true,
    };

    if (existingId) {
      await supabase.from("machines").update(machineData).eq("id", existingId);
    } else {
      // For new machines, deactivate existing ones first
      if (allMachines.length > 0) {
        await supabase
          .from("machines")
          .update({ is_active: false })
          .eq("user_id", user.id);
      }
      await supabase.from("machines").insert(machineData);
      // Track first machine setup for nudge C
      if (typeof window !== "undefined") {
        localStorage.setItem("cutlog-machine-setup", "true");
      }
    }

    setShowAddForm(false);
    router.push("/");
    setLoading(false);
  }

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200">←</button>
        <h1 className="text-xl font-bold">
          {existingId ? "Machine Settings" : "Register Your Machine"}
        </h1>
      </div>

      {!existingId && !showAddForm && (
        <p className="text-zinc-400 text-sm mb-6">
          Takes 2 minutes. This helps CutLog match you with similar machines for better suggestions.
        </p>
      )}

      {/* Feature 6: Multi-machine list */}
      {allMachines.length > 1 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wide">Your Machines</h2>
          <div className="space-y-2 mb-4">
            {allMachines.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl border transition-colors ${
                  (m as any).is_active !== false
                    ? "bg-emerald-900/20 border-emerald-700"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-zinc-200">
                      {m.nickname || `${m.brand} ${m.model || ""}`}
                    </span>
                    <span className="text-xs text-zinc-500 ml-2">
                      {m.wattage_w ? (m.wattage_w >= 1000 ? `${m.wattage_w / 1000}kW` : `${m.wattage_w}W`) : ""}
                      {m.source_type ? ` ${m.source_type}` : ""}
                    </span>
                    {(m as any).is_active !== false && (
                      <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {(m as any).is_active === false && (
                      <button
                        onClick={() => handleSetActive(m.id)}
                        className="px-3 py-1 rounded-lg text-xs bg-emerald-900/50 border border-emerald-700 text-emerald-300 hover:bg-emerald-800/60 transition-colors"
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => loadMachineIntoForm(m)}
                      className="px-3 py-1 rounded-lg text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      Edit
                    </button>
                    {confirmDeleteId === m.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDeleteMachine(m.id)}
                          disabled={deletingId === m.id}
                          className="px-3 py-1 rounded-lg text-xs bg-red-900 border border-red-700 text-red-300 hover:bg-red-800 transition-colors disabled:opacity-50"
                        >
                          {deletingId === m.id ? "..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1 rounded-lg text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(m.id)}
                        className="px-3 py-1 rounded-lg text-xs bg-red-900/50 border border-red-800 text-red-400 hover:text-red-300 hover:border-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="w-full p-3 rounded-xl border-2 border-dashed border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium"
          >
            + Add Another Machine
          </button>
        </div>
      )}

      {/* Single machine - show Add Another button */}
      {allMachines.length === 1 && existingId && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleAddNew}
            className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
          >
            + Add Another Machine
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Brand *</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100"
            required
          >
            <option value="">Select brand...</option>
            {MACHINE_BRANDS.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Model</label>
          <input
            type="text"
            placeholder="e.g. TruLaser 3030 fiber"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Wattage (W)</label>
            <input
              type="number"
              placeholder="6000"
              value={wattage}
              onChange={(e) => setWattage(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Source Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100"
            >
              <option value="fiber">Fiber</option>
              <option value="co2">CO2</option>
              <option value="diode">Diode</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Lens Focal Length (mm)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {[40, 70, 100, 110, 150, 175, 200, 250, 300, 450].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setLensFocalLength(String(preset))}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  lensFocalLength === String(preset)
                    ? "bg-emerald-900/50 border-emerald-600 text-emerald-300"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {preset}mm
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="110"
            value={lensFocalLength}
            onChange={(e) => setLensFocalLength(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
          <p className="text-xs text-zinc-500 mt-1">Used to auto-scale speed recommendations for your lens.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Laser Source Type</label>
          <select
            value={laserSourceType}
            onChange={(e) => setLaserSourceType(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100"
          >
            <option value="">Select type...</option>
            {LASER_SOURCE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <p className="text-xs text-zinc-500 mt-1">Unlocks engraving fields on the log page when applicable.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Hours on Resonator</label>
          <input
            type="number"
            placeholder="e.g. 5000"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
          <p className="text-xs text-zinc-500 mt-1">Approximate is fine. Helps match with similar-age machines.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Gas Types Available</label>
          <div className="flex flex-wrap gap-2">
            {GAS_TYPES.map(gas => (
              <button
                key={gas}
                type="button"
                onClick={() => toggleGas(gas)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  gasTypes.includes(gas)
                    ? "bg-emerald-900/50 border-emerald-600 text-emerald-300"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {gas}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Controller Software</label>
          <input
            type="text"
            placeholder="e.g. TruTops, BySoft, RDWorks"
            value={controller}
            onChange={(e) => setController(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Country</label>
          <input
            type="text"
            placeholder="e.g. US, Canada, Germany"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Nickname</label>
          <input
            type="text"
            placeholder="e.g. Big Red, Shop Floor 1"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Speed Profile</label>
          <p className="text-xs text-zinc-500 mb-3">
            Choose how CutLog recommends speeds for your use case. Fast mode maximizes throughput; Conservative mode prioritizes edge quality.
          </p>
          <div className="space-y-2">
            {SPEED_PROFILES.map((profile) => (
              <button
                key={profile.value}
                type="button"
                onClick={() => setSpeedProfile(profile.value as 'fast' | 'conservative' | 'auto')}
                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                  speedProfile === profile.value
                    ? "bg-emerald-900/30 border-emerald-600"
                    : "bg-zinc-900 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg mt-0.5">{profile.icon}</div>
                  <div>
                    <div className="font-medium text-zinc-100">{profile.label}</div>
                    <div className="text-xs text-zinc-500">{profile.description}</div>
                  </div>
                  {speedProfile === profile.value && (
                    <div className="ml-auto text-emerald-400 text-lg">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !brand}
          className="w-full p-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-semibold text-lg transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? "Saving..." : existingId ? "Update Machine" : "Register Machine"}
        </button>
      </form>
    </div>
  );
}
