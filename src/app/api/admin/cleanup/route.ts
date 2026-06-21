import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: NextRequest) {
  try {
    // Get the auth token from the request
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Create a Supabase client with the user's token
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete all user data in order (respecting foreign keys)
    // Use select() to get back the deleted rows so we can count them
    const { data: deletedCuts } = await supabase
      .from("cuts")
      .delete()
      .eq("user_id", user.id)
      .select("id");

    const { data: deletedFeedback } = await supabase
      .from("feedback")
      .delete()
      .eq("user_id", user.id)
      .select("id");

    const { data: deletedMachines } = await supabase
      .from("machines")
      .delete()
      .eq("user_id", user.id)
      .select("id");

    // Clear localStorage feedback on the client side (handled by the client)
    return NextResponse.json({
      success: true,
      deleted: {
        cuts: deletedCuts?.length ?? 0,
        feedback: deletedFeedback?.length ?? 0,
        machines: deletedMachines?.length ?? 0,
      },
    });
  } catch (err: unknown) {
    console.error("Cleanup error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
