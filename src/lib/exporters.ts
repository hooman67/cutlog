/**
 * exporters.ts — laser parameter library exporters.
 *
 * CutLog stores cuts in a normalized form (speed in mm/min, q-pulse in ns,
 * power as percent, etc.). Different laser software ecosystems want the data
 * in different shapes and units. This module centralizes the conversion logic
 * so it can be reused by the export API routes and unit-tested in isolation.
 *
 * Supported targets
 * ------------------
 *  - LightBurn (.clb)  : native XML "Material Library" file (importable).
 *  - EZCAD     (.csv)  : reference parameter sheet for EZCAD2/EZCAD3 galvo
 *                        users. EZCAD's native .ezd is an undocumented binary
 *                        blob with no open import format, so we emit a clean
 *                        human-readable CSV they can copy values from.
 *  - RDWorks   (.csv)  : reference parameter sheet for RDWorks/RDCAM (Ruida)
 *                        users. Same story — no open import format — so a CSV.
 *  - Universal (.csv)  : full dump of every CutLog field, lossless.
 *
 * Unit conventions
 * ----------------
 *  - CutLog stores speed as mm/min. LightBurn, EZCAD and RDWorks all express
 *    speed/marking-speed as mm/s, so we divide by 60 on export.
 *  - CutLog stores Q-pulse width in nanoseconds (ns). LightBurn's <QPulseWidth>
 *    is expressed in microseconds (us), so we divide ns by 1000.
 *
 * All functions are pure: given the same input they always produce the same
 * output and never touch I/O.
 */

/**
 * Minimal shape of a cut record the exporters need. This is intentionally a
 * structural subset of the full `Cut` type in `@/lib/types` so callers can
 * pass DB rows directly, but the exporters do not depend on the full schema.
 * Every field beyond material is optional/nullable to tolerate sparse rows.
 */
export interface ExportableCut {
  material: string;
  thickness_mm?: number | null;
  power_pct?: number | null;
  speed_mm_min?: number | null;
  gas_type?: string | null;
  gas_pressure_bar?: number | null;
  focus_position_mm?: number | null;
  nozzle_diameter_mm?: number | null;
  nozzle_distance_mm?: number | null;
  line_interval_mm?: number | null;
  frequency_hz?: number | null;
  /** Legacy alias for frequency used by some imported rows. */
  pulse_frequency_hz?: number | null;
  q_pulse_ns?: number | null;
  num_passes?: number | null;
  scan_angle_degrees?: number | null;
  operation_type?: string | null;
  quality_rating?: number | null;
  edge_quality?: string | null;
  source?: string | null;
  notes?: string | null;
}

/** Result of an exporter: the file body plus how it should be served/saved. */
export interface ExportResult {
  content: string;
  filename: string;
  mimeType: string;
}

export type ExportFormat = "clb" | "ezcad" | "rdworks" | "csv";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Today's date as YYYY-MM-DD, used in generated filenames. */
function todayStamp(): string {
  return new Date().toISOString().split("T")[0];
}

/** Effective marking/cutting frequency in Hz (prefers explicit, falls back to legacy). */
function frequencyHz(cut: ExportableCut): number | null {
  if (cut.frequency_hz !== null && cut.frequency_hz !== undefined) return cut.frequency_hz;
  if (cut.pulse_frequency_hz !== null && cut.pulse_frequency_hz !== undefined) return cut.pulse_frequency_hz;
  return null;
}

/** Convert stored mm/min to mm/s (the unit LightBurn/EZCAD/RDWorks use). */
function mmMinToMmS(mmMin: number): number {
  return mmMin / 60;
}

/** XML-escape a string for safe inclusion in attribute/text content. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Escape a single CSV field per RFC 4180: wrap in double quotes if it contains
 * a comma, double quote, CR or LF, and double any embedded quotes.
 */
function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Build a CSV document from a header row and data rows. Uses CRLF line breaks. */
function buildCsv(headers: string[], rows: unknown[][], leadingComments: string[] = []): string {
  const lines: string[] = [];
  // Comment lines are prefixed with `#`; most spreadsheet importers let users
  // skip them, and they document the sheet for humans.
  for (const comment of leadingComments) {
    lines.push(`# ${comment}`);
  }
  lines.push(headers.map(escapeCsv).join(","));
  for (const row of rows) {
    lines.push(row.map(escapeCsv).join(","));
  }
  return lines.join("\r\n") + "\r\n";
}

// ---------------------------------------------------------------------------
// LightBurn (.clb)
// ---------------------------------------------------------------------------

function buildClbDescription(cut: ExportableCut): string {
  const parts: string[] = [];
  if (cut.quality_rating) parts.push(`${cut.quality_rating}/5 stars`);
  if (cut.edge_quality) parts.push(cut.edge_quality.replace("_", " "));
  if (cut.gas_type) parts.push(`${cut.gas_type}${cut.gas_pressure_bar ? ` ${cut.gas_pressure_bar}bar` : ""}`);
  if (cut.notes) parts.push(cut.notes);
  return parts.join(" | ") || "CutLog export";
}

/**
 * Generate a valid LightBurn `.clb` Material Library XML file.
 *
 * Groups cuts by material; within each material every cut becomes an <Entry>
 * with a <CutSetting>. Speed is converted mm/min → mm/s. minPower defaults to
 * 15% of maxPower (min 5). Galvo-relevant settings (frequency, Q-pulse width,
 * line interval, passes, scan angle) are emitted when present.
 */
export function toLightBurnClb(
  cuts: ExportableCut[],
  displayName: string
): ExportResult {
  // Group cuts by material (stable: preserves first-seen order within a group).
  const materialGroups: Record<string, ExportableCut[]> = {};
  for (const cut of cuts) {
    if (!materialGroups[cut.material]) {
      materialGroups[cut.material] = [];
    }
    materialGroups[cut.material].push(cut);
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<LightBurnLibrary DisplayName="${escapeXml(displayName)}">\n`;

  const materialNames = Object.keys(materialGroups).sort();
  for (const material of materialNames) {
    const materialCuts = materialGroups[material];
    xml += `  <Material name="${escapeXml(material)}">\n`;

    for (const cut of materialCuts) {
      const thickness = cut.thickness_mm ?? -1;
      const desc = buildClbDescription(cut);
      xml += `    <Entry Thickness="${thickness.toFixed(1)}" Desc="${escapeXml(desc)}" NoThickTitle="">\n`;
      xml += `      <CutSetting type="Cut">\n`;
      xml += `        <index Value="0"/>\n`;
      xml += `        <name Value="C00"/>\n`;

      // Speed mm/min → mm/s for the .clb format.
      if (cut.speed_mm_min !== null && cut.speed_mm_min !== undefined) {
        const speedMmS = mmMinToMmS(cut.speed_mm_min).toFixed(2);
        xml += `        <speed Value="${speedMmS}"/>\n`;
      }

      // maxPower = power_pct; minPower defaults to 15% of max (floor 5).
      if (cut.power_pct !== null && cut.power_pct !== undefined) {
        xml += `        <maxPower Value="${cut.power_pct}"/>\n`;
        const minPower = Math.max(5, Math.round(cut.power_pct * 0.15));
        xml += `        <minPower Value="${minPower}"/>\n`;
      }

      // Number of passes (default 1 to match prior behavior).
      const passes = cut.num_passes && cut.num_passes > 0 ? cut.num_passes : 1;
      xml += `        <numPasses Value="${passes}"/>\n`;

      // Galvo / marking fields.
      const freq = frequencyHz(cut);
      if (freq !== null) {
        xml += `        <frequency Value="${freq}"/>\n`;
      }
      if (cut.q_pulse_ns !== null && cut.q_pulse_ns !== undefined) {
        // LightBurn <QPulseWidth> is in microseconds; CutLog stores ns.
        const qPulseUs = cut.q_pulse_ns / 1000;
        xml += `        <QPulseWidth Value="${qPulseUs}"/>\n`;
      }
      if (cut.line_interval_mm !== null && cut.line_interval_mm !== undefined) {
        xml += `        <interval Value="${cut.line_interval_mm}"/>\n`;
      }
      if (cut.scan_angle_degrees !== null && cut.scan_angle_degrees !== undefined) {
        xml += `        <angle Value="${cut.scan_angle_degrees}"/>\n`;
      }

      xml += `      </CutSetting>\n`;
      xml += `    </Entry>\n`;
    }

    xml += `  </Material>\n`;
  }

  xml += `</LightBurnLibrary>\n`;

  return {
    content: xml,
    filename: `CutLog_Export_${todayStamp()}.clb`,
    mimeType: "application/xml",
  };
}

// ---------------------------------------------------------------------------
// EZCAD (.csv reference sheet)
// ---------------------------------------------------------------------------

/**
 * Export an EZCAD-oriented reference parameter sheet (CSV).
 *
 * EZCAD2 / EZCAD3 (the dominant galvo-marking software) store parameters in a
 * proprietary binary `.ezd` document and offer no open/importable text format.
 * Rather than ship a fake binary, we emit a clean CSV with exactly the columns
 * an EZCAD operator copies into the "Pen" / "Mark Parameter" panel, so they can
 * transcribe values quickly. Speed is converted mm/min → mm/s.
 */
export function toEzcad(cuts: ExportableCut[]): ExportResult {
  const headers = [
    "Material",
    "Marking Speed (mm/s)",
    "Power (%)",
    "Frequency (kHz)",
    "Q-Pulse Width (ns)",
    "Loop Count (Passes)",
    "Hatch Spacing (mm)",
    "Hatch Angle (deg)",
  ];

  const rows: unknown[][] = cuts.map((cut) => {
    const freq = frequencyHz(cut);
    return [
      cut.material,
      cut.speed_mm_min != null ? round(mmMinToMmS(cut.speed_mm_min), 3) : "",
      cut.power_pct ?? "",
      freq != null ? round(freq / 1000, 3) : "", // Hz → kHz (EZCAD shows kHz)
      cut.q_pulse_ns ?? "",
      cut.num_passes ?? "",
      cut.line_interval_mm ?? "",
      cut.scan_angle_degrees ?? "",
    ];
  });

  const comments = [
    "CutLog EZCAD reference sheet — generated " + todayStamp() + ".",
    "EZCAD2/EZCAD3 has no open import format (.ezd is proprietary binary).",
    "Use these values as a reference when filling the EZCAD Mark Parameter / Pen panel.",
    "Marking Speed is in mm/s. Frequency shown in kHz. Q-Pulse Width in ns.",
  ];

  return {
    content: buildCsv(headers, rows, comments),
    filename: `CutLog_EZCAD_${todayStamp()}.csv`,
    mimeType: "text/csv",
  };
}

// ---------------------------------------------------------------------------
// RDWorks / Ruida (.csv reference sheet)
// ---------------------------------------------------------------------------

/**
 * Export an RDWorks/RDCAM (Ruida) oriented reference parameter sheet (CSV).
 *
 * RDWorks layer parameters live in the controller/project and there's no clean,
 * documented open import format either, so we emit a reference CSV mirroring the
 * RDWorks "Layer Parameter" dialog columns. RDWorks exposes both Max and Min
 * power per layer; we map Max = power_pct and derive a Min default (15%, floor
 * 5) consistent with the LightBurn export. Speed is converted mm/min → mm/s.
 */
export function toRdworks(cuts: ExportableCut[]): ExportResult {
  const headers = [
    "Layer/Material",
    "Speed (mm/s)",
    "Max Power (%)",
    "Min Power (%)",
    "Passes",
    "Line Interval (mm)",
  ];

  const rows: unknown[][] = cuts.map((cut) => {
    const maxPower = cut.power_pct;
    const minPower =
      maxPower != null && maxPower !== undefined
        ? Math.max(5, Math.round(maxPower * 0.15))
        : "";
    return [
      cut.material,
      cut.speed_mm_min != null ? round(mmMinToMmS(cut.speed_mm_min), 3) : "",
      maxPower ?? "",
      minPower,
      cut.num_passes ?? "",
      cut.line_interval_mm ?? "",
    ];
  });

  const comments = [
    "CutLog RDWorks/RDCAM (Ruida) reference sheet — generated " + todayStamp() + ".",
    "RDWorks has no open import format; transcribe these into the Layer Parameter dialog.",
    "Speed is in mm/s. Min Power is a 15% default when not separately recorded.",
  ];

  return {
    content: buildCsv(headers, rows, comments),
    filename: `CutLog_RDWorks_${todayStamp()}.csv`,
    mimeType: "text/csv",
  };
}

// ---------------------------------------------------------------------------
// Universal CSV (lossless dump)
// ---------------------------------------------------------------------------

/**
 * Universal CSV export — a lossless dump of every CutLog field. Useful for
 * spreadsheets, backups, or feeding into any other tool. Speed is kept in the
 * stored unit (mm/min) here since this is a faithful field dump, not a
 * software-specific sheet.
 */
export function toCsv(cuts: ExportableCut[]): ExportResult {
  const headers = [
    "material",
    "thickness_mm",
    "power_pct",
    "speed_mm_min",
    "gas_type",
    "gas_pressure_bar",
    "focus_position_mm",
    "nozzle_diameter_mm",
    "nozzle_distance_mm",
    "line_interval_mm",
    "frequency_hz",
    "q_pulse_ns",
    "num_passes",
    "operation_type",
    "quality_rating",
    "edge_quality",
    "source",
    "notes",
  ];

  const rows: unknown[][] = cuts.map((cut) => [
    cut.material,
    cut.thickness_mm ?? "",
    cut.power_pct ?? "",
    cut.speed_mm_min ?? "",
    cut.gas_type ?? "",
    cut.gas_pressure_bar ?? "",
    cut.focus_position_mm ?? "",
    cut.nozzle_diameter_mm ?? "",
    cut.nozzle_distance_mm ?? "",
    cut.line_interval_mm ?? "",
    frequencyHz(cut) ?? "",
    cut.q_pulse_ns ?? "",
    cut.num_passes ?? "",
    cut.operation_type ?? "",
    cut.quality_rating ?? "",
    cut.edge_quality ?? "",
    cut.source ?? "",
    cut.notes ?? "",
  ]);

  return {
    content: buildCsv(headers, rows),
    filename: `CutLog_Export_${todayStamp()}.csv`,
    mimeType: "text/csv",
  };
}

/** Round to n decimal places without trailing-zero noise. */
function round(value: number, places: number): number {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}

// ---------------------------------------------------------------------------
// Format registry
// ---------------------------------------------------------------------------

export interface FormatEntry {
  label: string;
  extension: string;
  mimeType: string;
  fn: (cuts: ExportableCut[], displayName: string) => ExportResult;
}

/**
 * Registry mapping a format key to its display metadata and exporter function.
 * Note `toLightBurnClb` needs a displayName; the others ignore the second arg,
 * so all entries share the `(cuts, displayName)` signature for uniformity.
 */
export const formats: Record<ExportFormat, FormatEntry> = {
  clb: {
    label: "LightBurn (.clb)",
    extension: "clb",
    mimeType: "application/xml",
    fn: (cuts, displayName) => toLightBurnClb(cuts, displayName),
  },
  ezcad: {
    label: "EZCAD (.csv)",
    extension: "csv",
    mimeType: "text/csv",
    fn: (cuts) => toEzcad(cuts),
  },
  rdworks: {
    label: "RDWorks (.csv)",
    extension: "csv",
    mimeType: "text/csv",
    fn: (cuts) => toRdworks(cuts),
  },
  csv: {
    label: "Universal CSV",
    extension: "csv",
    mimeType: "text/csv",
    fn: (cuts) => toCsv(cuts),
  },
};

/** Type guard: is the given string a supported export format key? */
export function isExportFormat(value: string | null): value is ExportFormat {
  return value === "clb" || value === "ezcad" || value === "rdworks" || value === "csv";
}
