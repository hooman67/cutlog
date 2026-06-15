import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Cut } from "@/lib/types";

/**
 * GET /api/export-clb
 * Query params:
 *   - machine_id (optional): filter cuts by machine
 *   - material (optional): filter by material (case-insensitive partial match)
 *   - source (optional): filter by source type
 *
 * Returns a downloadable .clb (XML) file.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to export cuts." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const machineId = searchParams.get("machine_id");
    const materialFilter = searchParams.get("material");
    const sourceFilter = searchParams.get("source");

    // Build query
    let query = supabase
      .from("cuts")
      .select("*")
      .eq("user_id", user.id)
      .order("material", { ascending: true })
      .order("thickness_mm", { ascending: true });

    if (machineId) {
      query = query.eq("machine_id", machineId);
    }
    if (materialFilter) {
      query = query.ilike("material", `%${materialFilter}%`);
    }
    if (sourceFilter) {
      query = query.eq("source", sourceFilter);
    }

    const { data: cuts, error } = await query.limit(500);

    if (error) {
      console.error("Export query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch cuts from database." },
        { status: 500 }
      );
    }

    if (!cuts || cuts.length === 0) {
      return NextResponse.json(
        { error: "No cuts found matching your criteria." },
        { status: 404 }
      );
    }

    const xml = generateClbXml(cuts, user.email || "CutLog User");

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Content-Disposition": `attachment; filename="CutLog_Export_${new Date().toISOString().split("T")[0]}.clb"`,
      },
    });
  } catch (error) {
    console.error("Export CLB error:", error);
    return NextResponse.json(
      { error: "Failed to generate export file." },
      { status: 500 }
    );
  }
}

/**
 * Generate a valid LightBurn .clb XML file from cuts data.
 * Groups cuts by material, then by thickness within each material.
 */
function generateClbXml(cuts: Cut[], displayName: string): string {
  // Group cuts by material
  const materialGroups: Record<string, Cut[]> = {};
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
      const thickness = cut.thickness_mm || -1;
      const desc = buildDescription(cut);
      xml += `    <Entry Thickness="${thickness.toFixed(1)}" Desc="${escapeXml(desc)}" NoThickTitle="">\n`;
      xml += `      <CutSetting type="Cut">\n`;
      xml += `        <index Value="0"/>\n`;
      xml += `        <name Value="C00"/>\n`;

      // Convert speed from mm/min back to mm/s for .clb format
      if (cut.speed_mm_min !== null) {
        const speedMmS = (cut.speed_mm_min / 60).toFixed(2);
        xml += `        <speed Value="${speedMmS}"/>\n`;
      }

      // maxPower = power_pct
      if (cut.power_pct !== null) {
        xml += `        <maxPower Value="${cut.power_pct}"/>\n`;
        // Set minPower to 10% of maxPower as reasonable default
        const minPower = Math.max(5, Math.round(cut.power_pct * 0.15));
        xml += `        <minPower Value="${minPower}"/>\n`;
      }

      xml += `        <numPasses Value="1"/>\n`;

      if (cut.line_interval_mm !== null) {
        xml += `        <interval Value="${cut.line_interval_mm}"/>\n`;
      }

      xml += `      </CutSetting>\n`;
      xml += `    </Entry>\n`;
    }

    xml += `  </Material>\n`;
  }

  xml += `</LightBurnLibrary>\n`;
  return xml;
}

function buildDescription(cut: Cut): string {
  const parts: string[] = [];
  if (cut.quality_rating) parts.push(`${cut.quality_rating}/5 stars`);
  if (cut.edge_quality) parts.push(cut.edge_quality.replace("_", " "));
  if (cut.gas_type) parts.push(`${cut.gas_type}${cut.gas_pressure_bar ? ` ${cut.gas_pressure_bar}bar` : ""}`);
  if (cut.notes) parts.push(cut.notes);
  return parts.join(" | ") || "CutLog export";
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
