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
      userMachine,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
