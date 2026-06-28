import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  parseClbXml,
  parseCsv,
  looksLikeCsv,
  type ParsedEntry,
} from "@/lib/clb-parser";

/**
 * POST /api/import-clb
 * Accepts an upload (multipart form data) of one of:
 *   - LightBurn library (.clb) / generic XML (.xml)
 *   - LightBurn settings export (.lbset) — same XML family as .clb
 *   - CSV (.csv / .txt) with material/thickness/power/speed columns
 * Parses it and returns parsed entries for user review before saving.
 *
 * Parsing logic lives in @/lib/clb-parser (route files may only export handlers).
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const lowerName = file.name.toLowerCase();
    const rawText = await file.text();
    // Strip UTF-8 BOM (both the literal char and the escaped form) and trim.
    const text = rawText.replace(/^﻿/, "").replace(/^﻿/, "").trim();

    if (!text) {
      return NextResponse.json(
        { error: "The file is empty. Please upload a non-empty LightBurn (.clb/.lbset/.xml) or CSV file." },
        { status: 400 }
      );
    }

    const isCsvExt =
      lowerName.endsWith(".csv") || lowerName.endsWith(".tsv") || lowerName.endsWith(".txt");
    const looksLikeXml =
      text.includes("<LightBurnLibrary") ||
      text.includes("<Material") ||
      text.includes("<CutSetting") ||
      text.trimStart().startsWith("<");
    const isXmlExt =
      lowerName.endsWith(".clb") ||
      lowerName.endsWith(".xml") ||
      lowerName.endsWith(".lbset");

    let entries: ParsedEntry[];
    let format: string;

    // Decide CSV vs XML by content first, falling back to extension.
    if ((isCsvExt && !looksLikeXml) || (!isXmlExt && !looksLikeXml && looksLikeCsv(text))) {
      entries = parseCsv(text);
      format = "csv";
      if (entries.length === 0) {
        return NextResponse.json(
          {
            error:
              "No rows could be parsed from the CSV. Expected a header row with at least a 'material' column, plus columns like thickness_mm, power_pct, speed_mm_min, line_interval_mm, frequency_hz, q_pulse_ns, num_passes, operation_type.",
          },
          { status: 400 }
        );
      }
    } else if (looksLikeXml || isXmlExt) {
      entries = parseClbXml(text);
      format = "clb";
      if (entries.length === 0) {
        return NextResponse.json(
          {
            error:
              "No cut settings found. The file looks like XML but no <Material>/<CutSetting> entries could be parsed. If this is a galvo/MOPA LightBurn file in a newer format, please share it with support so we can add it.",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error:
            "Unrecognized file. Upload a LightBurn library (.clb / .lbset / .xml) or a CSV of cut settings.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      filename: file.name,
      format,
      entry_count: entries.length,
      entries,
    });
  } catch (error) {
    console.error("Import CLB error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to parse file. Make sure it is a valid LightBurn library (.clb/.lbset/.xml) or CSV file.",
      },
      { status: 500 }
    );
  }
}
