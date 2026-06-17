import { NextRequest, NextResponse } from "next/server";

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
  frequency_hz: number | null;
  operation_type: string | null;
  cross_hatch: boolean | null;
  scan_angle_degrees: number | null;
}

/**
 * POST /api/import-clb
 * Accepts a .clb file upload (multipart form data), parses the LightBurn XML,
 * and returns parsed entries for user review before saving.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".clb") && !file.name.endsWith(".xml")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a .clb or .xml file." },
        { status: 400 }
      );
    }

    const text = await file.text();
    const entries = parseClbXml(text);

    if (entries.length === 0) {
      return NextResponse.json(
        { error: "No valid entries found in the file. Make sure it is a valid LightBurn library file." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      entry_count: entries.length,
      entries,
    });
  } catch (error) {
    console.error("Import CLB error:", error);
    return NextResponse.json(
      { error: "Failed to parse file. Make sure it is a valid LightBurn library (.clb) file." },
      { status: 500 }
    );
  }
}

/**
 * Parse LightBurn .clb XML content into structured entries.
 * The .clb format:
 * <LightBurnLibrary>
 *   <Material name="...">
 *     <Entry Thickness="3.0" Desc="..." NoThickTitle="">
 *       <CutSetting type="Cut">
 *         <speed Value="10"/>       (mm/s in file)
 *         <maxPower Value="65"/>    (percentage 0-100)
 *         <minPower Value="15"/>
 *         <numPasses Value="2"/>
 *         <interval Value="0.08"/>  (mm)
 *       </CutSetting>
 *     </Entry>
 *   </Material>
 * </LightBurnLibrary>
 */
function parseClbXml(xml: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];

  // Extract all Material blocks
  const materialRegex = /<Material\s+name="([^"]*)"[^>]*>([\s\S]*?)<\/Material>/gi;
  let materialMatch;

  while ((materialMatch = materialRegex.exec(xml)) !== null) {
    const materialName = materialMatch[1];
    const materialContent = materialMatch[2];

    // Extract all Entry blocks within this material
    const entryRegex = /<Entry\s+([^>]*)>([\s\S]*?)<\/Entry>/gi;
    let entryMatch;

    while ((entryMatch = entryRegex.exec(materialContent)) !== null) {
      const entryAttrs = entryMatch[1];
      const entryContent = entryMatch[2];

      // Parse Entry attributes
      const thicknessMatch = entryAttrs.match(/Thickness="([^"]*)"/i);
      const descMatch = entryAttrs.match(/Desc="([^"]*)"/i);

      let thickness: number | null = null;
      if (thicknessMatch) {
        const t = parseFloat(thicknessMatch[1]);
        // Thickness="-1.0" means "not specified"
        if (!isNaN(t) && t > 0) {
          thickness = t;
        }
      }

      // Extract CutSetting blocks
      const cutSettingRegex = /<CutSetting\s+type="([^"]*)"[^>]*>([\s\S]*?)<\/CutSetting>/gi;
      let cutMatch;

      while ((cutMatch = cutSettingRegex.exec(entryContent)) !== null) {
        const cutType = cutMatch[1];
        const cutContent = cutMatch[2];

        // Parse parameters from CutSetting
        const speed = extractValue(cutContent, "speed");
        const maxPower = extractValue(cutContent, "maxPower");
        const minPower = extractValue(cutContent, "minPower");
        const numPasses = extractValue(cutContent, "numPasses");
        const interval = extractValue(cutContent, "interval");

        // Convert speed from mm/s to mm/min
        const speedMmMin = speed !== null ? Math.round(speed * 60) : null;

        // Build description/notes
        const noteParts: string[] = [];
        if (descMatch && descMatch[1]) noteParts.push(descMatch[1]);
        if (cutType && cutType !== "Cut") noteParts.push(`Type: ${cutType}`);
        if (numPasses !== null && numPasses > 1) noteParts.push(`${numPasses} passes`);

        // Extract engraving-specific parameters if present
        const frequencyHz = extractValue(cutContent, "frequency");
        const scanAngle = extractValue(cutContent, "scanAngle");

        // Determine operation_type based on cutType
        let operationType: string | null = null;
        if (cutType) {
          const typeMap: Record<string, string> = {
            "Engrave": "engrave",
            "Mark": "mark",
            "Cut": "cut",
            "Score": "score",
            "Fill": "fill",
            "Outline": "outline",
          };
          operationType = typeMap[cutType] || null;
        }

        entries.push({
          material: materialName,
          thickness_mm: thickness,
          power_pct: maxPower,
          speed_mm_min: speedMmMin,
          line_interval_mm: interval,
          notes: noteParts.length > 0 ? noteParts.join(" | ") : null,
          cut_type: cutType,
          num_passes: numPasses !== null ? Math.round(numPasses) : null,
          min_power_pct: minPower,
          frequency_hz: frequencyHz !== null ? Math.round(frequencyHz) : null,
          operation_type: operationType,
          cross_hatch: null, // Not typically in LightBurn XML, can be set during import review
          scan_angle_degrees: scanAngle,
        });
      }
    }
  }

  return entries;
}

function extractValue(content: string, tagName: string): number | null {
  const regex = new RegExp(`<${tagName}\\s+Value="([^"]*)"`, "i");
  const match = content.match(regex);
  if (match) {
    const val = parseFloat(match[1]);
    return isNaN(val) ? null : val;
  }
  return null;
}
