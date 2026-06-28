/**
 * Parsers for laser settings imports:
 *   - LightBurn library (.clb) / generic XML (.xml)
 *   - LightBurn settings export (.lbset) — same XML family as .clb
 *   - CSV (.csv / .tsv / .txt) with material/thickness/power/speed columns
 *
 * Extracted into a lib (not the API route) so it can be unit-tested and reused.
 * Next.js route files may only export HTTP handlers, so parsing helpers live here.
 */

export interface ParsedEntry {
  material: string;
  thickness_mm: number | null;
  power_pct: number | null;
  speed_mm_min: number | null;
  line_interval_mm: number | null;
  notes: string | null;
  cut_type: string;
  num_passes: number | null;
  min_power_pct: number | null;
  frequency_hz: number | null;
  operation_type: string | null;
  cross_hatch: boolean | null;
  scan_angle_degrees: number | null;
  q_pulse_ns: number | null;
}

/* ------------------------------------------------------------------ *
 * LightBurn XML (.clb / .lbset / .xml) parsing
 * ------------------------------------------------------------------ *
 *
 * The .clb / .lbset format (with many real-world variations):
 *
 * <LightBurnLibrary>            (or a raw <Material> / <CutSetting> fragment)
 *   <Material name="...">       (name may have &amp; &quot; etc.)
 *     <Entry Thickness="3.0" Desc="..." NoThickTitle="">  (Thickness may be -1 / absent)
 *       <CutSetting type="Cut"> (type Cut/Scan/Image/Mark/Score/Offset, any casing)
 *         <speed Value="10"/>        (mm/s in file)
 *         <maxPower Value="65"/>     (percentage 0-100)
 *         <minPower Value="15"/>
 *         <numPasses Value="2"/>
 *         <interval Value="0.08"/>   (mm — line interval)
 *         <frequency Value="20000"/> (Hz — galvo/fiber)
 *         <QPulseWidth Value="200"/> (microseconds — MOPA; 1us = 1000ns)
 *         <DPI Value="254"/>
 *         <scanAngle Value="45"/>
 *         <crossHatch Value="1"/>
 *         <bidir Value="1"/>
 *         <tabsEnabled Value="0"/>
 *       </CutSetting>
 *     </Entry>
 *   </Material>
 * </LightBurnLibrary>
 *
 * Values may also appear lowercase (`value="X"`) or nested (`<speed>X</speed>`),
 * with attributes in any order, self-closing or nested.
 */
export function parseClbXml(xml: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];

  // 1. Try the structured Material -> Entry -> CutSetting path.
  const materialRegex =
    /<Material\b([^>]*)>([\s\S]*?)<\/Material\s*>/gi;
  let materialMatch: RegExpExecArray | null;
  let sawMaterial = false;

  while ((materialMatch = materialRegex.exec(xml)) !== null) {
    sawMaterial = true;
    const materialName = decodeXml(getAttr(materialMatch[1], "name") ?? "Imported Material");
    const materialContent = materialMatch[2];

    const entryRegex = /<Entry\b([^>]*)>([\s\S]*?)<\/Entry\s*>/gi;
    let entryMatch: RegExpExecArray | null;
    let sawEntry = false;

    while ((entryMatch = entryRegex.exec(materialContent)) !== null) {
      sawEntry = true;
      const entryAttrs = entryMatch[1];
      const entryContent = entryMatch[2];

      const thickness = parseThickness(getAttr(entryAttrs, "Thickness"));
      const desc = decodeXml(getAttr(entryAttrs, "Desc") ?? "");
      const noThickTitle = decodeXml(getAttr(entryAttrs, "NoThickTitle") ?? "");

      parseCutSettings(entryContent, materialName, thickness, desc || noThickTitle, entries);
    }

    // Material with no <Entry> wrapper but direct <CutSetting> blocks.
    if (!sawEntry) {
      parseCutSettings(materialContent, materialName, null, "", entries);
    }
  }

  // 2. Permissive fallback: no <Material> blocks but there ARE <CutSetting>
  //    blocks (flat galvo/MOPA fragment). Parse them as one "Imported" material.
  if (!sawMaterial && /<CutSetting\b/i.test(xml)) {
    parseCutSettings(xml, "Imported", null, "", entries);
  }

  return entries;
}

/** Parse every <CutSetting> block in `content` into entries. */
function parseCutSettings(
  content: string,
  materialName: string,
  thickness: number | null,
  baseDesc: string,
  out: ParsedEntry[]
): void {
  const cutSettingRegex = /<CutSetting\b([^>]*)>([\s\S]*?)<\/CutSetting\s*>/gi;
  let cutMatch: RegExpExecArray | null;

  while ((cutMatch = cutSettingRegex.exec(content)) !== null) {
    try {
      const cutAttrs = cutMatch[1];
      const cutContent = cutMatch[2];
      // type may be an attribute on the tag, or a nested <type Value="..."/>.
      const cutType =
        getAttr(cutAttrs, "type") ?? extractString(cutContent, "type") ?? "Cut";

      const settingName = extractString(cutContent, "name");

      const speed = extractValue(cutContent, "speed");
      const maxPower =
        extractValue(cutContent, "maxPower") ?? extractValue(cutContent, "power");
      const minPower = extractValue(cutContent, "minPower");
      const numPasses = extractValue(cutContent, "numPasses");
      const interval = extractValue(cutContent, "interval");
      const frequencyHz = extractValue(cutContent, "frequency");
      const scanAngle = extractValue(cutContent, "scanAngle");
      const qPulseWidth = extractValue(cutContent, "QPulseWidth"); // microseconds
      const dpi = extractValue(cutContent, "DPI");
      const bidir = extractValue(cutContent, "bidir");
      const crossHatchVal = extractValue(cutContent, "crossHatch");
      const overscanning = extractValue(cutContent, "overscanning");
      const tabsEnabled = extractValue(cutContent, "tabsEnabled");

      // Speed in LightBurn .clb is mm/s; CutLog stores mm/min.
      const speedMmMin = speed !== null ? Math.round(speed * 60) : null;

      const noteParts: string[] = [];
      if (baseDesc) noteParts.push(baseDesc);
      if (settingName && settingName !== baseDesc) noteParts.push(settingName);
      if (cutType && cutType.toLowerCase() !== "cut") noteParts.push(`Type: ${cutType}`);
      if (numPasses !== null && numPasses > 1) noteParts.push(`${Math.round(numPasses)} passes`);
      // QPulseWidth in .clb is microseconds; q_pulse_ns = us * 1000.
      if (qPulseWidth !== null) noteParts.push(`Q-Pulse: ${qPulseWidth}us`);
      if (dpi !== null) noteParts.push(`DPI: ${dpi}`);
      if (bidir === 1) noteParts.push("Bidirectional");
      if (crossHatchVal === 1) noteParts.push("Cross-hatch");
      if (tabsEnabled === 1) noteParts.push("Tabs enabled");
      if (overscanning !== null && overscanning > 0) noteParts.push(`Overscan: ${overscanning}%`);

      out.push({
        material: materialName,
        thickness_mm: thickness,
        power_pct: maxPower,
        speed_mm_min: speedMmMin,
        line_interval_mm: interval,
        notes: noteParts.length > 0 ? dedupeJoin(noteParts) : null,
        cut_type: cutType,
        num_passes: numPasses !== null ? Math.round(numPasses) : null,
        min_power_pct: minPower,
        frequency_hz: frequencyHz !== null ? Math.round(frequencyHz) : null,
        operation_type: mapOperationType(cutType),
        cross_hatch: crossHatchVal !== null ? crossHatchVal === 1 : null,
        scan_angle_degrees: scanAngle,
        q_pulse_ns: qPulseWidth !== null ? Math.round(qPulseWidth * 1000) : null,
      });
    } catch {
      // Skip a single malformed CutSetting; keep the rest.
      continue;
    }
  }
}

/**
 * Map a LightBurn CutSetting type to a CutLog operation_type.
 * Scan/Image (raster fill) -> engrave, Mark -> mark, Offset -> cut, etc.
 */
function mapOperationType(cutType: string): string | null {
  if (!cutType) return null;
  const typeMap: Record<string, string> = {
    engrave: "engrave",
    mark: "mark",
    cut: "cut",
    score: "score",
    fill: "fill",
    outline: "outline",
    scan: "engrave",
    image: "engrave",
    offset: "cut",
  };
  const key = cutType.trim().toLowerCase();
  return typeMap[key] ?? key;
}

/** Read an XML attribute value (case-insensitive name, single or double quotes). */
function getAttr(attrs: string, name: string): string | null {
  const re = new RegExp(`\\b${escapeRe(name)}\\s*=\\s*"([^"]*)"`, "i");
  const m = attrs.match(re);
  if (m) return m[1];
  const re2 = new RegExp(`\\b${escapeRe(name)}\\s*=\\s*'([^']*)'`, "i");
  const m2 = attrs.match(re2);
  return m2 ? m2[1] : null;
}

/**
 * Extract a numeric param expressed as any of:
 *   <tag Value="X"/>  <tag value="X"/>  <tag>X</tag>
 * Tag name match is case-insensitive.
 */
export function extractValue(content: string, tagName: string): number | null {
  const raw = extractString(content, tagName);
  if (raw === null) return null;
  const val = parseFloat(raw);
  return isNaN(val) ? null : val;
}

/** Like extractValue but returns the raw string (for name/type). */
function extractString(content: string, tagName: string): string | null {
  const t = escapeRe(tagName);
  // <tag Value="X"/> or <tag value='X'> (attribute, any order tolerated since we
  // only look for the Value attr on this specific tag)
  const attrRe = new RegExp(`<${t}\\b[^>]*\\bvalue\\s*=\\s*"([^"]*)"`, "i");
  const m = content.match(attrRe);
  if (m) return m[1];
  const attrRe2 = new RegExp(`<${t}\\b[^>]*\\bvalue\\s*=\\s*'([^']*)'`, "i");
  const m2 = content.match(attrRe2);
  if (m2) return m2[1];
  // Nested text node: <tag>X</tag>
  const nestedRe = new RegExp(`<${t}\\b[^>]*>([^<]*)</${t}\\s*>`, "i");
  const m3 = content.match(nestedRe);
  if (m3) {
    const v = decodeXml(m3[1]).trim();
    return v.length > 0 ? v : null;
  }
  return null;
}

function parseThickness(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const t = parseFloat(raw);
  // Thickness="-1" / "0" / NaN all mean "not specified".
  if (isNaN(t) || t <= 0) return null;
  return t;
}

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(parseInt(d, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function dedupeJoin(parts: string[]): string {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      result.push(p);
    }
  }
  return result.join(" | ");
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ------------------------------------------------------------------ *
 * CSV parsing
 * ------------------------------------------------------------------ */

/** Heuristic: does this text look like CSV (header with known columns)? */
export function looksLikeCsv(text: string): boolean {
  const firstLine = text.split(/\r?\n/, 1)[0]?.toLowerCase() ?? "";
  if (!firstLine.includes(",") && !firstLine.includes("\t")) return false;
  return /\bmaterial\b/.test(firstLine);
}

// Maps a normalized header to a canonical field. Keys are header text with
// spaces/punctuation stripped and lowercased.
const CSV_ALIASES: Record<string, string> = {
  material: "material",
  materialname: "material",
  name: "material",
  thicknessmm: "thickness_mm",
  thickness: "thickness_mm",
  thicknessinmm: "thickness_mm",
  mm: "thickness_mm",
  powerpct: "power_pct",
  power: "power_pct",
  powerpercent: "power_pct",
  maxpower: "power_pct",
  watts: "power_pct",
  w: "power_pct",
  minpowerpct: "min_power_pct",
  minpower: "min_power_pct",
  speedmmmin: "speed_mm_min",
  speedmmminute: "speed_mm_min",
  speedmmmin1: "speed_mm_min",
  speed: "speed_mm_min",
  speedmms: "speed_mm_s",
  speedmmsec: "speed_mm_s",
  lineintervalmm: "line_interval_mm",
  lineinterval: "line_interval_mm",
  interval: "line_interval_mm",
  intervalmm: "line_interval_mm",
  frequencyhz: "frequency_hz",
  frequency: "frequency_hz",
  freq: "frequency_hz",
  freqhz: "frequency_hz",
  qpulsens: "q_pulse_ns",
  qpulse: "q_pulse_ns",
  qpulsewidth: "q_pulse_us",
  qpulseus: "q_pulse_us",
  qpulsewidthus: "q_pulse_us",
  numpasses: "num_passes",
  passes: "num_passes",
  operationtype: "operation_type",
  operation: "operation_type",
  type: "operation_type",
  optype: "operation_type",
  scanangle: "scan_angle_degrees",
  scanangldegrees: "scan_angle_degrees",
  angle: "scan_angle_degrees",
  crosshatch: "cross_hatch",
  notes: "notes",
  note: "notes",
  description: "notes",
  desc: "notes",
};

function normHeader(h: string): string {
  return h
    .toLowerCase()
    .replace(/\(mm\/min\)/g, "mmmin")
    .replace(/\(mm\/s\)/g, "mms")
    .replace(/\(hz\)/g, "hz")
    .replace(/\(ns\)/g, "ns")
    .replace(/\(us\)/g, "us")
    .replace(/[^a-z0-9]/g, "");
}

export function parseCsv(text: string): ParsedEntry[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes("\t") && !lines[0].includes(",") ? "\t" : ",";

  const rawHeaders = splitCsvLine(lines[0], delimiter);
  const fields = rawHeaders.map((h) => CSV_ALIASES[normHeader(h)] ?? null);

  const hasMaterial = fields.includes("material");
  if (!hasMaterial) return [];

  const entries: ParsedEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const cells = splitCsvLine(lines[i], delimiter);
      const row: Record<string, string> = {};
      for (let c = 0; c < fields.length; c++) {
        const f = fields[c];
        if (f && cells[c] !== undefined) row[f] = cells[c].trim();
      }

      const material = (row.material ?? "").trim();
      if (!material) continue;

      const numOrNull = (s: string | undefined): number | null => {
        if (s === undefined || s === "") return null;
        const v = parseFloat(s.replace(/[^0-9.eE+-]/g, ""));
        return isNaN(v) ? null : v;
      };

      const thickness = ((): number | null => {
        const t = numOrNull(row.thickness_mm);
        return t !== null && t > 0 ? t : null;
      })();

      // Speed: prefer explicit mm/min column; else mm/s -> *60.
      let speedMmMin: number | null = numOrNull(row.speed_mm_min);
      const speedMmS = numOrNull(row.speed_mm_s);
      if (speedMmMin === null && speedMmS !== null) {
        speedMmMin = Math.round(speedMmS * 60);
      } else if (speedMmMin !== null) {
        speedMmMin = Math.round(speedMmMin);
      }

      // Q-pulse: prefer explicit ns; else us -> *1000.
      let qPulseNs: number | null = numOrNull(row.q_pulse_ns);
      const qPulseUs = numOrNull(row.q_pulse_us);
      if (qPulseNs === null && qPulseUs !== null) {
        qPulseNs = Math.round(qPulseUs * 1000);
      } else if (qPulseNs !== null) {
        qPulseNs = Math.round(qPulseNs);
      }

      const numPasses = numOrNull(row.num_passes);
      const freq = numOrNull(row.frequency_hz);
      const opTypeRaw = (row.operation_type ?? "").trim();
      const crossHatchRaw = (row.cross_hatch ?? "").trim().toLowerCase();
      const crossHatch =
        crossHatchRaw === ""
          ? null
          : ["1", "true", "yes", "y"].includes(crossHatchRaw);

      entries.push({
        material,
        thickness_mm: thickness,
        power_pct: numOrNull(row.power_pct),
        speed_mm_min: speedMmMin,
        line_interval_mm: numOrNull(row.line_interval_mm),
        notes: row.notes ? row.notes.trim() : null,
        cut_type: opTypeRaw || "Cut",
        num_passes: numPasses !== null ? Math.round(numPasses) : null,
        min_power_pct: numOrNull(row.min_power_pct),
        frequency_hz: freq !== null ? Math.round(freq) : null,
        operation_type: opTypeRaw ? mapOperationType(opTypeRaw) : null,
        cross_hatch: crossHatch,
        scan_angle_degrees: numOrNull(row.scan_angle_degrees),
        q_pulse_ns: qPulseNs,
      });
    } catch {
      // Skip a malformed CSV row; keep the rest.
      continue;
    }
  }

  return entries;
}

/** Minimal CSV line splitter with quoted-field support. */
function splitCsvLine(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}
