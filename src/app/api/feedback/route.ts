import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { category, message, page, importance, emoji_rating } = body;

    if (!category || !message) {
      return NextResponse.json(
        { error: "Category and message are required" },
        { status: 400 }
      );
    }

    if (!["bug", "feature", "feedback"].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    if (importance && !["nice_to_have", "need_it", "dealbreaker"].includes(importance)) {
      return NextResponse.json(
        { error: "Invalid importance value" },
        { status: 400 }
      );
    }

    if (emoji_rating && !["angry", "neutral", "happy", "love"].includes(emoji_rating)) {
      return NextResponse.json(
        { error: "Invalid emoji_rating value" },
        { status: 400 }
      );
    }

    const { error: insertError } = await supabase
      .from("user_feedback")
      .insert({
        user_id: user.id,
        category,
        message,
        page: page || null,
        importance: importance || null,
        emoji_rating: emoji_rating || null,
      });

    if (insertError) {
      console.error("Feedback insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Feedback API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
