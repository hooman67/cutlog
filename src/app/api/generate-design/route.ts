import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A design description is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server" },
        { status: 500 }
      );
    }

    const systemPrompt =
      "Generate a simple SVG line art design suitable for laser engraving. " +
      "Only use strokes, no fills. Keep it clean and minimal. " +
      "The SVG should use a viewBox of 0 0 200 200. " +
      "Use stroke color #ffffff and stroke-width between 1 and 3. " +
      "Do not include any background rectangle. " +
      "Return ONLY the SVG code, no explanation, no markdown fences.";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nDesign: ${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Failed to generate design from AI service" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract SVG from the response (strip any markdown fences if present)
    let svg = text.trim();
    // Remove markdown code fences if present
    svg = svg.replace(/^```(?:svg|xml)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    svg = svg.trim();

    // Validate it looks like SVG
    if (!svg.startsWith("<svg") && !svg.startsWith("<?xml")) {
      return NextResponse.json(
        { error: "AI did not return valid SVG. Please try a different prompt." },
        { status: 422 }
      );
    }

    return NextResponse.json({ svg });
  } catch (err) {
    console.error("Generate design error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
