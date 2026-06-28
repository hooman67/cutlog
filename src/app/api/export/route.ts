import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { formats, isExportFormat } from "@/lib/exporters";

/**
 * GET /api/export
 *
 * Multi-format export of the authenticated user's cuts.
 *
 * Query params:
 *   - format (required): one of clb | ezcad | rdworks | csv. Defaults to "clb".
 *   - machine_id (optional): filter cuts by machine
 *   - material (optional): filter by material (case-insensitive partial match)
 *   - source (optional): filter by source type
 *
 * Returns a downloadable file with the appropriate Content-Type and filename
 * extension for the requested format. Mirrors /api/export-clb's auth + query.
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
    const formatParam = searchParams.get("format") || "clb";

    if (!isExportFormat(formatParam)) {
      return NextResponse.json(
        { error: `Unsupported export format "${formatParam}". Use one of: clb, ezcad, rdworks, csv.` },
        { status: 400 }
      );
    }

    const machineId = searchParams.get("machine_id");
    const materialFilter = searchParams.get("material");
    const sourceFilter = searchParams.get("source");

    // Mirror export-clb's query: user-scoped, grouped/ordered by material+thickness.
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

    const { fn } = formats[formatParam];
    const { content, filename, mimeType } = fn(cuts, user.email || "CutLog User");

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate export file." },
      { status: 500 }
    );
  }
}
