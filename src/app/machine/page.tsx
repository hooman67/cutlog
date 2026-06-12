"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MACHINE_BRANDS, GAS_TYPES } from "@/lib/types";

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
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadExisting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

      if (machines && machines.length > 0) {
        const m = machines[0];
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
      }
    }
    loadExisting();
  }, []);

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
      resonator_hours: hours ? parseInt(hours) : null,
      gas_types: gasTypes,
      controller: controller || null,
      location_country: country || null,
      nickname: nickname || null,
    };

    if (existingId) {
      await supabase.from("machines").update(machineData).eq("id", existingId);
    } else {
      await supabase.from("machines").insert(machineData);
    }

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

      {!existingId && (
        <p className="text-zinc-400 text-sm mb-6">
          Takes 2 minutes. This helps CutLog match you with similar machines for better suggestions.
        </p>
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
