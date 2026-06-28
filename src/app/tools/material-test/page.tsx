"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Machine } from "@/lib/types";
import { GAS_TYPES, isGalvoMode } from "@/lib/types";

/**
 * One-click LightBurn material-test grid generator.
 *
 * Every operator runs a "material test" before trusting a setting — sweeping
 * one parameter (speed or power) across a range while holding the others fixed,
 * cutting the grid, and picking the cleanest result. This page builds a .clb
 * library with one CutSetting entry per step of the sweep so the operator can
 * import it into LightBurn and run the whole grid in one job.
 *
 * Generated entirely client-side (Blob download) — no API route.
 */

type SweepParam = "speed" | "power";

interface Preset {
  label: string;
  material: string;
  thickness: string;
  sweepParam: SweepParam;
  min: string;
  max: string;
  steps: string;
  fixedPower: string;
  fixedSpeed: string;
  gasType: string;
  gasPressure: string;
  numPasses: string;
}

// Labeled presets — leading with thick-metal fiber cutting (the primary segment).
const PRESETS: Preset[] = [
  {
    label: "10mm Mild Steel — O₂ speed sweep",
    material: "Mild Steel",
    thickness: "10",
    sweepParam: "speed",
    min: "600",
    max: "1400",
    steps: "9",
    fixedPower: "90",
    fixedSpeed: "1000",
    gasType: "O2",
    gasPressure: "0.8",
    numPasses: "1",
  },
  {
    label: "6mm Stainless — N₂ speed sweep",
    material: "Stainless Steel",
    thickness: "6",
    sweepParam: "speed",
    min: "1500",
    max: "3500",
    steps: "9",
    fixedPower: "100",
    fixedSpeed: "2500",
    gasType: "N2",
    gasPressure: "15",
    numPasses: "1",
  },
  {
    label: "12mm Aluminum — N₂ power sweep",
    material: "Aluminum",
    thickness: "12",
    sweepParam: "power",
    min: "70",
    max: "100",
    steps: "7",
    fixedPower: "90",
    fixedSpeed: "1200",
    gasType: "N2",
    gasPressure: "18",
    numPasses: "1",
  },
  {
    label: "3mm Acrylic — CO₂ speed sweep",
    material: "Acrylic",
    thickness: "3",
    sweepParam: "speed",
    min: "300",
    max: "900",
    steps: "7",
    fixedPower: "70",
    fixedSpeed: "600",
    gasType: "Air",
    gasPressure: "1",
    numPasses: "1",
  },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface SweepStep {
  index: number;
  powerPct: number;
  speedMmMin: number;
  label: string;
}

/**
 * Build the sweep steps. Returns an evenly-spaced series from min..max inclusive.
 */
function buildSteps(
  sweepParam: SweepParam,
  min: number,
  max: number,
  steps: number,
  fixedPower: number,
  fixedSpeed: number
): SweepStep[] {
  const n = Math.max(2, Math.min(50, Math.round(steps)));
  const result: SweepStep[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    const value = Math.round(min + (max - min) * t);
    if (sweepParam === "speed") {
      result.push({
        index: i,
        powerPct: fixedPower,
        speedMmMin: value,
        label: `${value} mm/min`,
      });
    } else {
      result.push({
        index: i,
        powerPct: value,
        speedMmMin: fixedSpeed,
        label: `${value}%`,
      });
    }
  }
  return result;
}

/**
 * Generate a LightBurn .clb library XML for the sweep.
 * Speed in .clb is mm/s (= mm_min / 60), matching the export-clb route.
 */
function generateMaterialTestClb(params: {
  material: string;
  thickness: number;
  sweepParam: SweepParam;
  steps: SweepStep[];
  numPasses: number;
  gasType: string;
  gasPressure: string;
}): string {
  const { material, thickness, sweepParam, steps, numPasses, gasType, gasPressure } = params;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<LightBurnLibrary DisplayName="CutLog Material Test">\n`;
  xml += `  <Material name="${escapeXml(material)} (test grid)">\n`;

  for (const step of steps) {
    const descParts: string[] = [
      `${sweepParam === "speed" ? "Speed" : "Power"} test ${step.index + 1}`,
      step.label,
    ];
    if (gasType) descParts.push(`${gasType}${gasPressure ? ` ${gasPressure}bar` : ""}`);
    const desc = descParts.join(" | ");

    const thicknessVal = thickness > 0 ? thickness : -1;
    xml += `    <Entry Thickness="${thicknessVal.toFixed(1)}" Desc="${escapeXml(desc)}" NoThickTitle="">\n`;
    xml += `      <CutSetting type="Cut">\n`;
    xml += `        <index Value="${step.index}"/>\n`;
    // C00, C01, ... so each row maps to a distinct LightBurn layer color.
    xml += `        <name Value="C${String(step.index).padStart(2, "0")}"/>\n`;

    const speedMmS = (step.speedMmMin / 60).toFixed(2);
    xml += `        <speed Value="${speedMmS}"/>\n`;

    xml += `        <maxPower Value="${step.powerPct}"/>\n`;
    const minPower = Math.max(5, Math.round(step.powerPct * 0.15));
    xml += `        <minPower Value="${minPower}"/>\n`;

    xml += `        <numPasses Value="${Math.max(1, numPasses)}"/>\n`;
    xml += `      </CutSetting>\n`;
    xml += `    </Entry>\n`;
  }

  xml += `  </Material>\n`;
  xml += `</LightBurnLibrary>\n`;
  return xml;
}

export default function MaterialTestGenerator() {
  const router = useRouter();
  const supabase = createClient();
  const [machine, setMachine] = useState<Machine | null>(null);

  const [material, setMaterial] = useState("Mild Steel");
  const [thickness, setThickness] = useState("10");
  const [sweepParam, setSweepParam] = useState<SweepParam>("speed");
  const [min, setMin] = useState("600");
  const [max, setMax] = useState("1400");
  const [steps, setSteps] = useState("9");
  const [fixedPower, setFixedPower] = useState("90");
  const [fixedSpeed, setFixedSpeed] = useState("1000");
  const [gasType, setGasType] = useState("O2");
  const [gasPressure, setGasPressure] = useState("0.8");
  const [numPasses, setNumPasses] = useState("1");
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }
      const { data: machines } = await supabase
        .from("machines")
        .select("*")
        .eq("user_id", user.id)
        .order("is_active", { ascending: false, nullsFirst: false })
        .limit(1);
      if (machines && machines.length > 0) setMachine(machines[0]);
    }
    init();
  }, []);

  function applyPreset(p: Preset) {
    setMaterial(p.material);
    setThickness(p.thickness);
    setSweepParam(p.sweepParam);
    setMin(p.min);
    setMax(p.max);
    setSteps(p.steps);
    setFixedPower(p.fixedPower);
    setFixedSpeed(p.fixedSpeed);
    setGasType(p.gasType);
    setGasPressure(p.gasPressure);
    setNumPasses(p.numPasses);
    setGenerated(false);
  }

  const previewSteps = useMemo(() => {
    const minN = parseFloat(min);
    const maxN = parseFloat(max);
    const stepsN = parseInt(steps, 10);
    const fp = parseFloat(fixedPower);
    const fs = parseFloat(fixedSpeed);
    if (isNaN(minN) || isNaN(maxN) || isNaN(stepsN) || minN >= maxN) return [];
    return buildSteps(sweepParam, minN, maxN, stepsN, isNaN(fp) ? 90 : fp, isNaN(fs) ? 1000 : fs);
  }, [sweepParam, min, max, steps, fixedPower, fixedSpeed]);

  const galvo = isGalvoMode(machine);

  function handleDownload() {
    if (previewSteps.length === 0) return;
    const xml = generateMaterialTestClb({
      material: material || "Material",
      thickness: parseFloat(thickness) || 0,
      sweepParam,
      steps: previewSteps,
      numPasses: parseInt(numPasses, 10) || 1,
      gasType: galvo ? "" : gasType,
      gasPressure: galvo ? "" : gasPressure,
    });

    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeMat = (material || "material").replace(/[^a-z0-9]+/gi, "_").toLowerCase();
    a.href = url;
    a.download = `cutlog_test_${safeMat}_${thickness}mm_${sweepParam}.clb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setGenerated(true);
  }

  const inputCls =
    "w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-blue-600 focus:outline-none text-zinc-100 placeholder-zinc-500";
  const smallInputCls =
    "w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 focus:border-blue-600 focus:outline-none text-zinc-100 placeholder-zinc-500 text-sm";

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto pb-20">
      <div className="flex items-center gap-3 mb-2 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200 text-lg">&larr;</button>
        <h1 className="text-xl font-bold">Material Test Generator</h1>
      </div>
      <p className="text-sm text-zinc-500 mb-5 ml-8">
        Build a LightBurn test grid that sweeps one parameter. Import it, run the
        grid, and pick the cleanest row — the fastest path to a trusted setting.
      </p>

      {/* Presets — lead with thick-metal fiber cutting */}
      <div className="mb-6">
        <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Quick presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-medium hover:border-blue-600 hover:text-blue-300 transition-colors text-left"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Material + thickness */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Material</label>
            <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className={inputCls} placeholder="Mild Steel" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Thickness (mm)</label>
            <input type="number" step="0.1" value={thickness} onChange={(e) => setThickness(e.target.value)} className={inputCls} placeholder="10" />
          </div>
        </div>

        {/* Sweep parameter toggle */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Sweep which parameter?</label>
          <div className="grid grid-cols-2 gap-3">
            {(["speed", "power"] as SweepParam[]).map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => { setSweepParam(sp); setGenerated(false); }}
                className={`p-3 rounded-xl border font-medium text-sm transition-colors ${
                  sweepParam === sp
                    ? "bg-blue-900/40 border-blue-600 text-blue-300"
                    : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
                }`}
              >
                {sp === "speed" ? "Speed (mm/min)" : "Power (%)"}
              </button>
            ))}
          </div>
        </div>

        {/* Sweep range */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Min</label>
            <input type="number" value={min} onChange={(e) => setMin(e.target.value)} className={smallInputCls} />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Max</label>
            <input type="number" value={max} onChange={(e) => setMax(e.target.value)} className={smallInputCls} />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Steps</label>
            <input type="number" min="2" max="50" value={steps} onChange={(e) => setSteps(e.target.value)} className={smallInputCls} />
          </div>
        </div>

        {/* Fixed values for the non-swept params */}
        <div className="border-t border-zinc-800 pt-4">
          <h3 className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wide">Fixed values</h3>
          <div className="grid grid-cols-2 gap-3">
            {sweepParam === "speed" ? (
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Power (%)</label>
                <input type="number" value={fixedPower} onChange={(e) => setFixedPower(e.target.value)} className={smallInputCls} />
              </div>
            ) : (
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Speed (mm/min)</label>
                <input type="number" value={fixedSpeed} onChange={(e) => setFixedSpeed(e.target.value)} className={smallInputCls} />
              </div>
            )}
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Number of Passes</label>
              <input type="number" min="1" value={numPasses} onChange={(e) => setNumPasses(e.target.value)} className={smallInputCls} />
            </div>
          </div>

          {/* Gas — cutting only (hidden for galvo/engraving) */}
          {!galvo && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Assist Gas</label>
                <select value={gasType} onChange={(e) => setGasType(e.target.value)} className={smallInputCls}>
                  <option value="">—</option>
                  {GAS_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Gas Pressure (bar)</label>
                <input type="number" step="0.1" value={gasPressure} onChange={(e) => setGasPressure(e.target.value)} className={smallInputCls} />
              </div>
            </div>
          )}
          <p className="text-xs text-zinc-600 mt-2">
            Gas/passes are recorded in each entry&apos;s description for reference; set them on your machine when you run the grid.
          </p>
        </div>

        {/* Preview */}
        {previewSteps.length > 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">
              Preview — {previewSteps.length} test {sweepParam === "speed" ? "speeds" : "powers"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {previewSteps.map((s) => (
                <span key={s.index} className="px-2 py-1 rounded-md bg-zinc-800/70 border border-zinc-700 text-xs font-mono text-zinc-300">
                  {s.label}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-3">
              {sweepParam === "speed"
                ? `Each row cuts at ${fixedPower}% power.`
                : `Each row cuts at ${fixedSpeed} mm/min.`}{" "}
              Imported as layers C00–C{String(previewSteps.length - 1).padStart(2, "0")}.
            </p>
          </div>
        ) : (
          <div className="bg-amber-900/20 border border-amber-800/50 rounded-xl p-4">
            <p className="text-xs text-amber-300/80">Enter a valid range (min must be less than max) to preview the grid.</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleDownload}
          disabled={previewSteps.length === 0}
          className="w-full p-4 rounded-xl bg-blue-700 hover:bg-blue-600 font-semibold text-lg transition-colors disabled:opacity-50"
        >
          Download .clb test grid
        </button>

        {generated && (
          <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-800 text-center text-sm text-emerald-300">
            Downloaded. Import it in LightBurn (Window → Cuts/Layers → Import), arrange the grid, and run it.
          </div>
        )}

        <div className="bg-slate-900/30 border border-slate-700 rounded-xl p-4 text-xs text-zinc-400">
          <p className="font-medium text-slate-200 mb-1">Why run a material test?</p>
          <p>
            Every machine is different — beam quality, resonator age, optics and gas
            all shift the result. A starting point from CutLog gets you close; the
            test grid confirms the exact setting for <em>your</em> machine in one job
            instead of many trial cuts.
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600">
          <Link href="/suggest" className="text-sky-400 hover:text-sky-300">Need a starting point first? Get a recommendation →</Link>
        </p>
      </div>
    </div>
  );
}
