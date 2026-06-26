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
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    const { data: cuts, error } = await supabaseAdmin
      .from("cuts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch cuts" }, { status: 500 });
    }

    return NextResponse.json({ cuts: cuts ?? [] });
  } catch (err: unknown) {
    console.error("Admin cuts GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Cut id is required" }, { status: 400 });
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.user_id;
    delete updateData.created_at;

    const { data, error } = await supabaseAdmin
      .from("cuts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update cut" }, { status: 500 });
    }

    return NextResponse.json({ cut: data });
  } catch (err: unknown) {
    console.error("Admin cuts PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const cutId = searchParams.get("id");

    if (!cutId) {
      return NextResponse.json({ error: "Cut id is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("cuts")
      .delete()
      .eq("id", cutId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete cut" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Admin cuts DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
