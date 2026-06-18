"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ParsedEntry {
  material: string;
  thickness_mm: number | null;
  power_pct: number | null;
  speed_mm_min: number | null;
  line_interval_mm: number | null;
  notes: string | null;
  cut_type: string;
  num_passes: number | null;
  min_power_pct: number | null;
}

export default function ImportPage() {
  const [entries, setEntries] = useState<ParsedEntry[]>([]);
  const [filename, setFilename] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());

  const router = useRouter();
  const supabase = createClient();

  const handleFile = useCallback(async (file: File) => {
    setError("");
    setSuccess("");
    setEntries([]);
    setParsing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/import-clb", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to parse file");
        setParsing(false);
        return;
      }

      setEntries(data.entries);
      setFilename(data.filename);
      // Select all entries by default
      setSelectedEntries(new Set(data.entries.map((_: ParsedEntry, i: number) => i)));
    } catch {
      setError("Failed to upload file. Please try again.");
    }
    setParsing(false);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function toggleEntry(idx: number) {
    setSelectedEntries(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  function toggleAll() {
    if (selectedEntries.size === entries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(entries.map((_, i) => i)));
    }
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be signed in to save entries. Please sign in first.");
      return;
    }

    // Get user's machine
    const { data: machines } = await supabase
      .from("machines")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    const machineId = machines && machines.length > 0 ? machines[0].id : null;

    const selectedCuts = entries.filter((_, i) => selectedEntries.has(i));
    if (selectedCuts.length === 0) {
      setError("Please select at least one entry to import.");
      return;
    }

    setSaving(true);

    const rows = selectedCuts.map(entry => ({
      machine_id: machineId,
      user_id: user.id,
      material: entry.material,
      thickness_mm: entry.thickness_mm || 0,
      power_pct: entry.power_pct,
      speed_mm_min: entry.speed_mm_min,
      line_interval_mm: entry.line_interval_mm,
      notes: entry.notes,
      source: "user_logged" as const,
      is_shared: true,
      quality_rating: 3,
    }));

    const { error: insertError } = await supabase.from("cuts").insert(rows);

    if (insertError) {
      setError(`Failed to save: ${insertError.message}`);
    } else {
      setSuccess(`Successfully imported ${selectedCuts.length} cut${selectedCuts.length > 1 ? "s" : ""} to your library!`);
      setEntries([]);
      setSelectedEntries(new Set());
      if (typeof window !== "undefined") {
        localStorage.setItem("cutlog-has-imported", "true");
      }
    }
    setSaving(false);
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-zinc-200">
          ←
        </button>
        <h1 className="text-xl font-bold">Import LightBurn Library</h1>
      </div>

      <p className="text-sm text-zinc-400 mb-6">
        Upload a LightBurn .clb file to import cutting parameters into your CutLog library.
        You can preview and select which entries to import before saving.
      </p>

      {/* File Upload Area */}
      {entries.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
            dragActive
              ? "border-emerald-500 bg-emerald-900/20"
              : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
          }`}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <div className="text-4xl mb-4">📂</div>
          {parsing ? (
            <p className="text-zinc-300">Parsing file...</p>
          ) : (
            <>
              <p className="text-zinc-300 font-medium mb-2">
                Drop your .clb file here
              </p>
              <p className="text-zinc-500 text-sm">
                or click to browse
              </p>
            </>
          )}
          <input
            id="file-input"
            type="file"
            accept=".clb,.xml"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* Error / Success Messages */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-900/30 border border-red-800 text-red-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-900/30 border border-emerald-800 text-emerald-300 text-sm">
          {success}
          <button
            onClick={() => router.push("/history")}
            className="block mt-2 text-emerald-400 hover:text-emerald-300 underline"
          >
            View in Cut History →
          </button>
        </div>
      )}

      {/* Preview Table */}
      {entries.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Preview: {filename}</h2>
              <p className="text-sm text-zinc-500">
                {entries.length} entries found · {selectedEntries.size} selected
              </p>
            </div>
            <button
              onClick={toggleAll}
              className="text-sm text-zinc-400 hover:text-zinc-200 px-3 py-1 rounded-lg border border-zinc-700 hover:border-zinc-500"
            >
              {selectedEntries.size === entries.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {entries.map((entry, idx) => (
              <div
                key={idx}
                onClick={() => toggleEntry(idx)}
                className={`rounded-xl p-4 border cursor-pointer transition-colors ${
                  selectedEntries.has(idx)
                    ? "bg-emerald-900/20 border-emerald-800"
                    : "bg-zinc-900 border-zinc-800 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedEntries.has(idx)
                      ? "border-emerald-500 bg-emerald-600"
                      : "border-zinc-600"
                  }`}>
                    {selectedEntries.has(idx) && (
                      <span className="text-xs text-white font-bold">✓</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-zinc-100 truncate">{entry.material}</span>
                      {entry.thickness_mm && (
                        <span className="text-zinc-500 text-sm flex-shrink-0">{entry.thickness_mm}mm</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                        entry.cut_type === "Cut"
                          ? "bg-blue-900/50 text-blue-300"
                          : entry.cut_type === "Scan"
                          ? "bg-purple-900/50 text-purple-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}>
                        {entry.cut_type}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-zinc-400">
                      <span>{entry.power_pct !== null ? `${entry.power_pct}%` : "—"}</span>
                      <span>{entry.speed_mm_min !== null ? `${entry.speed_mm_min} mm/min` : "—"}</span>
                      <span>{entry.line_interval_mm !== null ? `${entry.line_interval_mm}mm int.` : "—"}</span>
                      <span>{entry.num_passes !== null && entry.num_passes > 1 ? `${entry.num_passes} passes` : "1 pass"}</span>
                    </div>
                    {entry.notes && (
                      <p className="text-xs text-zinc-500 mt-1 truncate">{entry.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 sticky bottom-4">
            <button
              onClick={() => {
                setEntries([]);
                setSelectedEntries(new Set());
                setFilename("");
              }}
              className="flex-1 p-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || selectedEntries.size === 0}
              className="flex-[2] p-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-semibold transition-colors disabled:opacity-50"
            >
              {saving
                ? "Importing..."
                : `Import ${selectedEntries.size} Cut${selectedEntries.size !== 1 ? "s" : ""} to Library`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
