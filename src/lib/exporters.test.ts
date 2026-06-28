/**
 * Test suite for the export formatters (exporters.ts).
 *
 * Covers LightBurn .clb (unit conversions, XML escaping), the EZCAD and
 * RDWorks reference CSVs, the universal CSV (escaping), and empty-input
 * handling, using both a cutting sample (gas/nozzle/focus) and a galvo
 * sample (q_pulse_ns, frequency, line interval).
 */

import {
  toLightBurnClb,
  toEzcad,
  toRdworks,
  toCsv,
  formats,
  isExportFormat,
  type ExportableCut,
} from "./exporters";

// A cutting cut: 3mm mild steel with gas/nozzle/focus fields populated.
const cuttingCut: ExportableCut = {
  material: "Mild Steel",
  thickness_mm: 3,
  power_pct: 80,
  speed_mm_min: 4200, // → 70 mm/s
  gas_type: "O2",
  gas_pressure_bar: 0.8,
  focus_position_mm: -1.5,
  nozzle_diameter_mm: 1.5,
  nozzle_distance_mm: 0.8,
  line_interval_mm: null,
  frequency_hz: null,
  q_pulse_ns: null,
  num_passes: 1,
  scan_angle_degrees: null,
  operation_type: "cut",
  quality_rating: 5,
  edge_quality: "clean",
  source: "user_logged",
  notes: "clean cut, no dross",
};

// A galvo/marking cut: fiber engraving with q-pulse, frequency, line interval.
const galvoCut: ExportableCut = {
  material: "Anodized Aluminum",
  thickness_mm: 1,
  power_pct: 60,
  speed_mm_min: 60000, // → 1000 mm/s
  gas_type: null,
  gas_pressure_bar: null,
  focus_position_mm: null,
  nozzle_diameter_mm: null,
  nozzle_distance_mm: null,
  line_interval_mm: 0.05,
  frequency_hz: 80000, // 80 kHz
  q_pulse_ns: 200, // → 0.2 us
  num_passes: 3,
  scan_angle_degrees: 45,
  operation_type: "mark",
  quality_rating: 4,
  edge_quality: null,
  source: "user_logged",
  notes: 'engrave, "deep" pass',
};

// A cut with tricky characters to exercise CSV/XML escaping.
const trickyCut: ExportableCut = {
  material: 'Acrylic, "clear"',
  thickness_mm: 5,
  power_pct: 50,
  speed_mm_min: 1200,
  notes: 'edge melted, see note: "reduce power", line2\nmore',
};

describe("toLightBurnClb", () => {
  it("converts speed from mm/min to mm/s", () => {
    const { content } = toLightBurnClb([cuttingCut], "Me");
    // 4200 / 60 = 70.00
    expect(content).toContain('<speed Value="70.00"/>');
  });

  it("converts q_pulse_ns to microseconds in QPulseWidth", () => {
    const { content } = toLightBurnClb([galvoCut], "Me");
    // 200 ns / 1000 = 0.2 us
    expect(content).toContain('<QPulseWidth Value="0.2"/>');
  });

  it("emits galvo fields: frequency, interval, numPasses, scan angle", () => {
    const { content } = toLightBurnClb([galvoCut], "Me");
    expect(content).toContain('<frequency Value="80000"/>');
    expect(content).toContain('<interval Value="0.05"/>');
    expect(content).toContain('<numPasses Value="3"/>');
    expect(content).toContain('<angle Value="45"/>');
  });

  it("sets maxPower to power_pct and a minPower default (15%, floor 5)", () => {
    const { content } = toLightBurnClb([cuttingCut], "Me");
    expect(content).toContain('<maxPower Value="80"/>');
    // round(80 * 0.15) = 12
    expect(content).toContain('<minPower Value="12"/>');
  });

  it("groups entries by material and sorts material names", () => {
    const { content } = toLightBurnClb([galvoCut, cuttingCut], "Me");
    const aluminumIdx = content.indexOf('<Material name="Anodized Aluminum">');
    const steelIdx = content.indexOf('<Material name="Mild Steel">');
    expect(aluminumIdx).toBeGreaterThan(-1);
    expect(steelIdx).toBeGreaterThan(-1);
    expect(aluminumIdx).toBeLessThan(steelIdx); // alphabetical
  });

  it("XML-escapes material names and descriptions", () => {
    const { content } = toLightBurnClb([trickyCut], "Me");
    expect(content).toContain('<Material name="Acrylic, &quot;clear&quot;">');
    // notes flows into Desc and must be escaped
    expect(content).toContain("&quot;reduce power&quot;");
  });

  it("returns a .clb filename and xml mime type", () => {
    const { filename, mimeType } = toLightBurnClb([cuttingCut], "Me");
    expect(filename).toMatch(/\.clb$/);
    expect(mimeType).toBe("application/xml");
  });

  it("handles empty input (valid empty library)", () => {
    const { content } = toLightBurnClb([], "Me");
    expect(content).toContain("<LightBurnLibrary");
    expect(content).toContain("</LightBurnLibrary>");
    expect(content).not.toContain("<Material");
  });
});

describe("toEzcad", () => {
  it("converts speed mm/min → mm/s and frequency Hz → kHz", () => {
    const { content } = toEzcad([galvoCut]);
    const lines = content.split("\r\n");
    const dataLine = lines.find((l) => l.startsWith("Anodized Aluminum"))!;
    const cols = dataLine.split(",");
    // Marking Speed mm/s: 60000/60 = 1000
    expect(cols[1]).toBe("1000");
    // Frequency kHz: 80000/1000 = 80
    expect(cols[3]).toBe("80");
    // Q-Pulse Width in ns stays 200
    expect(cols[4]).toBe("200");
  });

  it("includes the documented header columns and a comment header", () => {
    const { content } = toEzcad([galvoCut]);
    expect(content).toContain("Material,Marking Speed (mm/s),Power (%),Frequency (kHz)");
    expect(content).toContain("Q-Pulse Width (ns)");
    expect(content).toContain("Hatch Spacing (mm)");
    expect(content).toContain("Hatch Angle (deg)");
    expect(content).toContain("# CutLog EZCAD reference sheet");
    expect(content).toContain("no open import format");
  });

  it("returns a .csv filename and csv mime type", () => {
    const { filename, mimeType } = toEzcad([galvoCut]);
    expect(filename).toMatch(/\.csv$/);
    expect(mimeType).toBe("text/csv");
  });

  it("handles empty input (header only)", () => {
    const { content } = toEzcad([]);
    expect(content).toContain("Material,Marking Speed (mm/s)");
  });
});

describe("toRdworks", () => {
  it("emits Max Power = power_pct and a Min Power default", () => {
    const { content } = toRdworks([cuttingCut]);
    const dataLine = content.split("\r\n").find((l) => l.startsWith("Mild Steel"))!;
    const cols = dataLine.split(",");
    // Speed mm/s: 4200/60 = 70
    expect(cols[1]).toBe("70");
    expect(cols[2]).toBe("80"); // max power
    expect(cols[3]).toBe("12"); // round(80*0.15) min power
  });

  it("includes RDWorks layer columns and comment header", () => {
    const { content } = toRdworks([cuttingCut]);
    expect(content).toContain("Layer/Material,Speed (mm/s),Max Power (%),Min Power (%),Passes,Line Interval (mm)");
    expect(content).toContain("# CutLog RDWorks/RDCAM (Ruida) reference sheet");
  });

  it("returns a .csv filename and csv mime type", () => {
    const { filename, mimeType } = toRdworks([cuttingCut]);
    expect(filename).toMatch(/\.csv$/);
    expect(mimeType).toBe("text/csv");
  });

  it("handles empty input", () => {
    const { content } = toRdworks([]);
    expect(content).toContain("Layer/Material,Speed (mm/s)");
  });
});

describe("toCsv (universal)", () => {
  it("has all expected headers in order", () => {
    const { content } = toCsv([cuttingCut]);
    const header = content.split("\r\n")[0];
    expect(header).toBe(
      "material,thickness_mm,power_pct,speed_mm_min,gas_type,gas_pressure_bar," +
        "focus_position_mm,nozzle_diameter_mm,nozzle_distance_mm,line_interval_mm," +
        "frequency_hz,q_pulse_ns,num_passes,operation_type,quality_rating," +
        "edge_quality,source,notes"
    );
  });

  it("keeps speed in mm/min (lossless field dump)", () => {
    const { content } = toCsv([cuttingCut]);
    const dataLine = content.split("\r\n")[1];
    expect(dataLine.split(",")[3]).toBe("4200");
  });

  it("escapes commas, quotes, and newlines per RFC 4180", () => {
    const { content } = toCsv([trickyCut]);
    // material "Acrylic, \"clear\"" → "Acrylic, ""clear"""
    expect(content).toContain('"Acrylic, ""clear"""');
    // notes contain a comma, quotes and a newline → fully quoted, quotes doubled
    expect(content).toContain('"edge melted, see note: ""reduce power"", line2\nmore"');
  });

  it("renders nulls/undefined as empty fields", () => {
    const { content } = toCsv([galvoCut]);
    const dataLine = content.split("\r\n").find((l) => l.startsWith("Anodized Aluminum"))!;
    const cols = dataLine.split(",");
    // gas_type is null (index 4) → empty
    expect(cols[4]).toBe("");
  });

  it("falls back to pulse_frequency_hz for frequency_hz column", () => {
    const legacy: ExportableCut = {
      material: "Wood",
      pulse_frequency_hz: 1000,
      frequency_hz: null,
    };
    const { content } = toCsv([legacy]);
    const dataLine = content.split("\r\n").find((l) => l.startsWith("Wood"))!;
    expect(dataLine.split(",")[10]).toBe("1000"); // frequency_hz column
  });

  it("handles empty input (header only)", () => {
    const { content } = toCsv([]);
    const lines = content.trim().split("\r\n");
    expect(lines.length).toBe(1);
  });
});

describe("formats registry", () => {
  it("maps each format key to label/extension/mimeType/fn", () => {
    expect(formats.clb.extension).toBe("clb");
    expect(formats.ezcad.extension).toBe("csv");
    expect(formats.rdworks.extension).toBe("csv");
    expect(formats.csv.extension).toBe("csv");
    for (const key of ["clb", "ezcad", "rdworks", "csv"] as const) {
      expect(typeof formats[key].fn).toBe("function");
      expect(formats[key].label.length).toBeGreaterThan(0);
    }
  });

  it("fn invocation routes to the right exporter", () => {
    const clb = formats.clb.fn([cuttingCut], "Me");
    expect(clb.filename).toMatch(/\.clb$/);
    const csv = formats.csv.fn([cuttingCut], "Me");
    expect(csv.filename).toMatch(/\.csv$/);
  });

  it("isExportFormat validates keys", () => {
    expect(isExportFormat("clb")).toBe(true);
    expect(isExportFormat("ezcad")).toBe(true);
    expect(isExportFormat("nope")).toBe(false);
    expect(isExportFormat(null)).toBe(false);
  });
});
