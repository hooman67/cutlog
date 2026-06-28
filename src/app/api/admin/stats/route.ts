import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ADMIN_EMAIL = "houman_sh2001@hotmail.com";

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.email !== ADMIN_EMAIL) {
    return null;
  }
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Total users (from auth.users via admin API)
    const { data: { users: allUsers }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const totalUsers = usersError ? 0 : (allUsers?.length ?? 0);

    // Users with machines configured
    const { data: machineUsers } = await supabaseAdmin
      .from("machines")
      .select("user_id")
      .limit(1000);
    const uniqueMachineUsers = new Set(machineUsers?.map(m => m.user_id) ?? []);

    // Users who have logged cuts (source='user_logged')
    const { data: cutUsers } = await supabaseAdmin
      .from("cuts")
      .select("user_id")
      .eq("source", "user_logged")
      .limit(10000);
    const uniqueCutUsers = new Set(cutUsers?.map(c => c.user_id) ?? []);

    // Users active in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentCutUsers } = await supabaseAdmin
      .from("cuts")
      .select("user_id")
      .gte("created_at", sevenDaysAgo)
      .limit(10000);
    const activeUsers7d = new Set(recentCutUsers?.map(c => c.user_id) ?? []);

    // Total cuts by source breakdown
    const { data: allCuts } = await supabaseAdmin
      .from("cuts")
      .select("source")
      .limit(100000);
    const cutsBySource: Record<string, number> = {};
    allCuts?.forEach(c => {
      cutsBySource[c.source] = (cutsBySource[c.source] || 0) + 1;
    });

    // Total materials
    const { count: materialCount } = await supabaseAdmin
      .from("materials")
      .select("*", { count: "exact", head: true });

    // Feedback summary (legacy feedback table)
    const { data: feedbackData } = await supabaseAdmin
      .from("feedback")
      .select("rating")
      .limit(100000);
    const feedbackSummary: Record<string, number> = {};
    feedbackData?.forEach(f => {
      feedbackSummary[f.rating] = (feedbackSummary[f.rating] || 0) + 1;
    });

    // User feedback (new user_feedback table)
    let userFeedbackCount = 0;
    let userFeedbackByCategory: Record<string, number> = {};
    let recentUserFeedback: Array<{ id: string; category: string; message: string; user_id: string; created_at: string; emoji_rating: string | null; importance: string | null; page: string | null }> = [];
    try {
      const { count } = await supabaseAdmin
        .from("user_feedback")
        .select("*", { count: "exact", head: true });
      userFeedbackCount = count ?? 0;

      const { data: ufData } = await supabaseAdmin
        .from("user_feedback")
        .select("category")
        .limit(100000);
      ufData?.forEach(f => {
        userFeedbackByCategory[f.category] = (userFeedbackByCategory[f.category] || 0) + 1;
      });

      const { data: recentUf } = await supabaseAdmin
        .from("user_feedback")
        .select("id, category, message, user_id, created_at, emoji_rating, importance, page")
        .order("created_at", { ascending: false })
        .limit(20);
      recentUserFeedback = recentUf ?? [];
    } catch {
      // user_feedback table might not exist yet
    }

    // Waitlist count
    let waitlistCount = 0;
    try {
      const { count } = await supabaseAdmin
        .from("waitlist")
        .select("*", { count: "exact", head: true });
      waitlistCount = count ?? 0;
    } catch {
      // waitlist table might not exist
    }

    // Cuts per day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentCuts } = await supabaseAdmin
      .from("cuts")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true })
      .limit(100000);

    const cutsPerDay: Record<string, number> = {};
    recentCuts?.forEach(c => {
      const day = c.created_at.split("T")[0];
      cutsPerDay[day] = (cutsPerDay[day] || 0) + 1;
    });

    return NextResponse.json({
      totalUsers,
      usersWithMachines: uniqueMachineUsers.size,
      usersWithCuts: uniqueCutUsers.size,
      activeUsersLast7Days: activeUsers7d.size,
      totalCuts: allCuts?.length ?? 0,
      cutsBySource,
      totalMaterials: materialCount ?? 0,
      feedbackSummary,
      waitlistCount,
      cutsPerDay,
      userFeedbackCount,
      userFeedbackByCategory,
      recentUserFeedback,
    });
  } catch (err: unknown) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
