import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

interface AiSuggestRequest {
  material: string;
  thickness_mm: number;
  wattage: number;
  lens_mm: number;
  laser_type: string;
}

interface AiSuggestResponse {
  speed_mm_min: number;
  power_pct: number;
  gas_type: string | null;
  gas_pressure_bar: number | null;
  frequency_hz: number | null;
  confidence_note: string;
}

// Simple in-memory cache to avoid repeated calls for same params
const responseCache = new Map<string, { data: AiSuggestResponse; timestamp: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCacheKey(params: AiSuggestRequest): string {
  return `${params.material.toLowerCase()}|${params.thickness_mm}|${params.wattage}|${params.lens_mm}|${params.laser_type}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI suggestion service not configured" },
        { status: 500 }
      );
    }

    const body: AiSuggestRequest = await request.json();
    const { material, thickness_mm, wattage, lens_mm, laser_type } = body;

    // Validate required fields
    if (!material || !thickness_mm || !wattage || !lens_mm || !laser_type) {
      return NextResponse.json(
        { error: "Missing required fields: material, thickness_mm, wattage, lens_mm, laser_type" },
        { status: 400 }
      );
    }

    // Check cache
    const cacheKey = getCacheKey(body);
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.data);
    }

    const prompt = `You are a laser cutting/engraving parameter expert. Given the following setup, recommend cutting/engraving parameters as a JSON object.

Machine: ${wattage}W ${laser_type} laser with ${lens_mm}mm lens
Material: ${material}
Thickness: ${thickness_mm}mm

Return ONLY a JSON object with these fields (no markdown, no explanation):
{
  "speed_mm_min": <recommended speed in mm/min>,
  "power_pct": <recommended power as percentage 0-100>,
  "gas_type": <recommended gas type or null if engraving>,
  "gas_pressure_bar": <gas pressure in bar or null>,
  "frequency_hz": <frequency in Hz or null if cutting>,
  "confidence_note": <one sentence explaining your reasoning>
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
    const geminiBody = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
      },
    });

    let response: Response | null = null;
    const MAX_RETRIES = 3;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        response = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: geminiBody,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.status === 429 && attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, (attempt + 1) * 3000));
          continue;
        }
        break;
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (attempt === MAX_RETRIES - 1) {
          if (err instanceof Error && err.name === "AbortError") {
            return NextResponse.json(
              { error: "AI service timed out. Please try again." },
              { status: 504 }
            );
          }
          return NextResponse.json(
            { error: "Failed to reach AI service" },
            { status: 502 }
          );
        }
        await new Promise(r => setTimeout(r, (attempt + 1) * 2000));
      }
    }

    if (!response) {
      return NextResponse.json(
        { error: "Failed to reach AI service after retries" },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const status = response.status;
      let errorDetail = "";
      try {
        const errBody = await response.json();
        errorDetail = errBody?.error?.message || JSON.stringify(errBody).slice(0, 200);
        console.error("Gemini API error:", status, errorDetail);
      } catch {
        console.error("Gemini API error:", status, "(could not parse error body)");
      }
      if (status === 429) {
        return NextResponse.json(
          { error: "AI service rate limited. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `AI service returned error (${status}): ${errorDetail || "unknown"}` },
        { status: 502 }
      );
    }

    const geminiResponse = await response.json();

    // Extract text from Gemini response
    const text =
      geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "AI returned an empty response" },
        { status: 502 }
      );
    }

    // Parse JSON from the response (strip potential markdown fences)
    let parsed: AiSuggestResponse;
    try {
      const jsonStr = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "AI returned invalid response format" },
        { status: 502 }
      );
    }

    // Validate the parsed response has required numeric fields
    if (
      typeof parsed.speed_mm_min !== "number" ||
      typeof parsed.power_pct !== "number"
    ) {
      return NextResponse.json(
        { error: "AI returned incomplete parameters" },
        { status: 502 }
      );
    }

    // Clamp values to reasonable ranges
    parsed.speed_mm_min = Math.max(1, Math.min(100000, parsed.speed_mm_min));
    parsed.power_pct = Math.max(1, Math.min(100, parsed.power_pct));
    if (parsed.gas_pressure_bar !== null && parsed.gas_pressure_bar !== undefined) {
      parsed.gas_pressure_bar = Math.max(0, Math.min(50, parsed.gas_pressure_bar));
    }

    // Cache the result
    responseCache.set(cacheKey, { data: parsed, timestamp: Date.now() });

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("AI suggest error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
