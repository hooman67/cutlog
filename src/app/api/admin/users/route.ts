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

    // Get all users from auth
    const { data: { users: authUsers }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (usersError) {
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Get all machines
    const { data: machines } = await supabaseAdmin
      .from("machines")
      .select("*")
      .limit(10000);

    // Get cut counts per user
    const { data: cuts } = await supabaseAdmin
      .from("cuts")
      .select("user_id, created_at")
      .limit(100000);

    // Build user data
    const cutCountMap: Record<string, number> = {};
    const lastActiveMap: Record<string, string> = {};
    cuts?.forEach(c => {
      cutCountMap[c.user_id] = (cutCountMap[c.user_id] || 0) + 1;
      if (!lastActiveMap[c.user_id] || c.created_at > lastActiveMap[c.user_id]) {
        lastActiveMap[c.user_id] = c.created_at;
      }
    });

    const machineMap: Record<string, { brand: string; model: string | null; wattage_w: number | null }> = {};
    machines?.forEach(m => {
      machineMap[m.user_id] = { brand: m.brand, model: m.model, wattage_w: m.wattage_w };
    });

    const userList = (authUsers ?? []).map(u => ({
      id: u.id,
      email: u.email ?? "Unknown",
      created_at: u.created_at,
      machine: machineMap[u.id] || null,
      cut_count: cutCountMap[u.id] || 0,
      last_active: lastActiveMap[u.id] || null,
    }));

    // Sort by most recent activity
    userList.sort((a, b) => {
      const dateA = a.last_active || a.created_at;
      const dateB = b.last_active || b.created_at;
      return dateB.localeCompare(dateA);
    });

    return NextResponse.json({ users: userList });
  } catch (err: unknown) {
    console.error("Admin users error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const deleteMachineUserId = searchParams.get("delete_machine");

    if (deleteMachineUserId) {
      const { error } = await supabaseAdmin
        .from("machines")
        .delete()
        .eq("user_id", deleteMachineUserId);

      if (error) {
        return NextResponse.json({ error: "Failed to delete machine" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Admin users DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
