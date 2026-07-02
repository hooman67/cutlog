import { NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

/**
 * POST /api/search
 *
 * Server-side material/thickness search endpoint.
 * Moves the 3-tier query logic (own cuts, AI baseline, community) from the
 * client to the server, protecting Supabase credentials and enforcing auth.
 *
 * Request body: { material: string, thickness: number }
 * Response: { groups: SuggestionGroup[], matchedAliases: string[], tolerance: number }
 */

interface SearchRequest {
  material: string
  thickness: number
}

interface SuggestionGroup {
  source: "own" | "similar_machine" | "community"
  label: string
  badge_color: string
  cuts: any[]
  avg_rating: number
}

/**
 * Provenance classification for a cut. Drives the colored badge on the suggest
 * page so AI/scraped data NEVER looks as authoritative as verified data.
 */
type Provenance =
  | "your_data"            // green   — the operator's own logged cut
  | "community_verified"  // blue    — shared real-user cut, confirmed by operators
  | "community_reported"  // teal    — shared real-user cut, not yet confirmed
  | "scraped_reference"   // gray    — scraped/public reference data
  | "ai_unverified"       // orange  — AI starting point, unverified

/**
 * Map a cut's source + signals to a provenance tag.
 *   - own group        -> your_data
 *   - source ai_baseline -> ai_unverified
 *   - source scraped_public -> scraped_reference
 *   - real community cut -> community_verified if verified by operators, else community_reported
 */
function deriveProvenance(
  cut: any,
  groupSource: "own" | "similar_machine" | "community",
  verifiedCount: number
): Provenance {
  if (groupSource === "own") return "your_data"
  if (cut.source === "ai_baseline") return "ai_unverified"
  if (cut.source === "scraped_public") return "scraped_reference"
  // user_logged + shared (community)
  if (verifiedCount > 0) return "community_verified"
  return "community_reported"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body: SearchRequest = await request.json()
    const { material: searchMaterial, thickness: thicknessMm } = body

    // Validate required fields
    if (!searchMaterial || typeof searchMaterial !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'material' field" },
        { status: 400 }
      )
    }
    if (thicknessMm === undefined || thicknessMm === null || isNaN(Number(thicknessMm))) {
      return NextResponse.json(
        { error: "Missing or invalid 'thickness' field" },
        { status: 400 }
      )
    }

    // --- Material Alias Resolution ---
    const { data: matchedMaterials } = await supabase
      .from("materials")
      .select("name, aliases")
      .or(`name.ilike.%${searchMaterial}%,aliases.cs.{${searchMaterial}}`)

    const allNames = new Set<string>()
    const resolvedAliases: string[] = []
    if (matchedMaterials && matchedMaterials.length > 0) {
      for (const m of matchedMaterials) {
        allNames.add(m.name)
        if (m.aliases) m.aliases.forEach((a: string) => allNames.add(a))
      }
      const namesArray = Array.from(allNames)
      for (const name of namesArray) {
        if (name.toLowerCase() !== searchMaterial.toLowerCase()) {
          resolvedAliases.push(name)
        }
      }
    }
    if (allNames.size === 0) allNames.add(searchMaterial)

    // Build material filter
    const materialNames = Array.from(allNames)
    const materialFilter = materialNames.map(n => `material.ilike.%${n}%`).join(",")

    // --- Operation Type Awareness ---
    // Fetch user's active machine to determine operation type
    const { data: machines } = await supabase
      .from("machines")
      .select("*")
      .eq("user_id", user.id)
      .order("is_active", { ascending: false, nullsFirst: false })
      .limit(1)

    const userMachine = machines && machines.length > 0 ? machines[0] : null

    let operationType: string | null = null
    if (userMachine?.laser_source_type) {
      const sourceType = userMachine.laser_source_type
      if (sourceType.includes("engraving") || sourceType === "uv_marking") {
        operationType = "engrave"
      } else {
        operationType = "cut"
      }
    }

    // --- Progressive Thickness Tolerance ---
    const toleranceLevels = [0.5, 1.5, 3]
    let finalGroups: SuggestionGroup[] = []
    let finalTolerance = 0.5

    for (const tolerance of toleranceLevels) {
      const groups: SuggestionGroup[] = []

      // 1. Own cuts
      let ownQuery = supabase
        .from("cuts")
        .select("*")
        .eq("user_id", user.id)
        .or(materialFilter)
        .gte("thickness_mm", thicknessMm - tolerance)
        .lte("thickness_mm", thicknessMm + tolerance)
        .order("quality_rating", { ascending: false })
        .limit(10)

      if (operationType) {
        ownQuery = ownQuery.or(`operation_type.eq.${operationType},operation_type.is.null`)
      }

      const { data: ownCuts } = await ownQuery

      if (ownCuts && ownCuts.length > 0) {
        const avg = ownCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / ownCuts.length
        groups.push({
          source: "own",
          label: "Your History",
          badge_color: "bg-emerald-900/50 border-emerald-600 text-emerald-300",
          cuts: ownCuts,
          avg_rating: avg,
        })
      }

      // 2. AI Baseline data
      let baselineQuery = supabase
        .from("cuts")
        .select("*")
        .or(materialFilter)
        .eq("source", "ai_baseline")
        .gte("thickness_mm", thicknessMm - tolerance)
        .lte("thickness_mm", thicknessMm + tolerance)
        .order("quality_rating", { ascending: false })
        .limit(10)

      if (operationType) {
        baselineQuery = baselineQuery.or(`operation_type.eq.${operationType},operation_type.is.null`)
      }

      const { data: baselineCuts } = await baselineQuery

      if (baselineCuts && baselineCuts.length > 0) {
        const avg = baselineCuts.reduce((s, c) => s + (c.quality_rating || 0), 0) / baselineCuts.length
        groups.push({
          source: "similar_machine",
          label: "AI Starting Point",
          badge_color: "bg-orange-900/50 border-orange-600 text-orange-300",
          cuts: baselineCuts,
          avg_rating: avg,
        })
      }

      // 3. Community (real user shared cuts)
      const communityTolerance = Math.max(tolerance, 1)
      let communityQuery = supabase
        .from("cuts")
        .select("*, machines!cuts_machine_id_fkey(wattage_w, source_type)")
        .neq("source", "ai_baseline")
        .or(materialFilter)
        .eq("is_shared", true)
        .gte("thickness_mm", thicknessMm - communityTolerance)
        .lte("thickness_mm", thicknessMm + communityTolerance)
        .order("quality_rating", { ascending: false })
        .limit(10)

      if (operationType) {
        communityQuery = communityQuery.or(`operation_type.eq.${operationType},operation_type.is.null`)
      }

      const { data: communityCuts } = await communityQuery

      if (communityCuts && communityCuts.length > 0) {
        // Flatten the machines join into cut-level fields for the client
        const cutsWithMachineData = communityCuts.map((cut: any) => {
          const result = { ...cut }
          if (cut.machines) {
            result.machine_wattage = cut.machines.wattage_w
            result.machine_source_type = cut.machines.source_type
          }
          // Remove the nested machines object to keep response clean
          delete result.machines
          return result
        })

        const avg = communityCuts.reduce((s: number, c: any) => s + (c.quality_rating || 0), 0) / communityCuts.length
        groups.push({
          source: "community",
          label: "Shared Cuts",
          badge_color: "bg-blue-900/50 border-blue-600 text-blue-300",
          cuts: cutsWithMachineData,
          avg_rating: avg,
        })
      }

      if (groups.length > 0) {
        finalGroups = groups
        finalTolerance = tolerance
        break
      }
    }

    // --- Operation-type mismatch detection ---
    // If the operation-filtered search returned nothing but rows DO exist for the
    // same material + thickness under the OPPOSITE operation type, surface an
    // informative signal instead of letting the client hallucinate via /api/ai-suggest.
    let operationMismatch:
      | { available_operation: "cut" | "engrave"; active_operation: "cut" | "engrave"; material: string; thickness: number }
      | null = null
    if (finalGroups.length === 0 && operationType) {
      const oppositeOperation = operationType === "engrave" ? "cut" : "engrave"
      const probeTolerance = toleranceLevels[toleranceLevels.length - 1]
      const { data: oppositeRows } = await supabase
        .from("cuts")
        .select("operation_type")
        .or(materialFilter)
        .eq("operation_type", oppositeOperation)
        .gte("thickness_mm", thicknessMm - probeTolerance)
        .lte("thickness_mm", thicknessMm + probeTolerance)
        .limit(1)

      if (oppositeRows && oppositeRows.length > 0) {
        operationMismatch = {
          available_operation: oppositeOperation as "cut" | "engrave",
          active_operation: operationType as "cut" | "engrave",
          material: searchMaterial,
          thickness: thicknessMm,
        }
      }
    }

    // --- Verification counts ---
    // Count distinct operators who confirmed this material/thickness worked
    // (feedback_type = 'perfect'). Degrades gracefully if the feedback table or
    // columns are absent. We bucket thickness to nearest 0.5mm to match search.
    let verifiedCount = 0
    try {
      const { data: perfectFeedback } = await supabase
        .from("feedback")
        .select("user_id, thickness_mm")
        .eq("feedback_type", "perfect")
        .or(materialNames.map(n => `material.ilike.%${n}%`).join(","))
        .gte("thickness_mm", thicknessMm - Math.max(finalTolerance, 0.5))
        .lte("thickness_mm", thicknessMm + Math.max(finalTolerance, 0.5))

      if (perfectFeedback && perfectFeedback.length > 0) {
        verifiedCount = new Set(perfectFeedback.map((f: any) => f.user_id)).size
      }
    } catch {
      // feedback table may not exist yet — leave verifiedCount at 0
    }

    // Attach provenance + verification signals to every cut so the UI can show
    // honest, color-coded badges. AI/scraped entries are tagged distinctly.
    for (const group of finalGroups) {
      for (const cut of group.cuts) {
        // Per-cut cached count if the column exists (migration 013); else fall
        // back to the community-derived verifiedCount for shared real-user cuts.
        const cutVerified = typeof cut.verified_count === "number" ? cut.verified_count : 0
        const effectiveVerified =
          group.source === "community"
            ? Math.max(cutVerified, verifiedCount)
            : cutVerified
        cut.provenance = deriveProvenance(cut, group.source, effectiveVerified)
        cut.verified_count = effectiveVerified
      }
    }

    // Also fetch user feedback for this material+thickness (for feedback correction)
    let feedbackData: any[] = []
    try {
      const { data } = await supabase
        .from("feedback")
        .select("feedback_type")
        .eq("user_id", user.id)
        .ilike("material", `%${searchMaterial}%`)
        .gte("thickness_mm", thicknessMm - 0.5)
        .lte("thickness_mm", thicknessMm + 0.5)

      if (data) feedbackData = data
    } catch {
      // Feedback table may not exist yet, ignore errors
    }

    return NextResponse.json({
      groups: finalGroups,
      matchedAliases: resolvedAliases,
      tolerance: finalTolerance,
      feedbackData,
      verifiedCount,
      userMachine,
      operation_mismatch: operationMismatch,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
