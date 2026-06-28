"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Category = "bug" | "feature" | "feedback" | null;
type EmojiRating = "angry" | "neutral" | "happy" | "love" | null;

const PAGES = ["Home", "Suggest", "Log", "History", "Import", "Machine Settings", "Other"];

const EMOJI_OPTIONS: { value: EmojiRating; icon: string }[] = [
  { value: "angry", icon: "😡" },
  { value: "neutral", icon: "😐" },
  { value: "happy", icon: "😊" },
  { value: "love", icon: "🤩" },
];

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState("");
  const [steps, setSteps] = useState("");
  const [importance, setImportance] = useState("");
  const [emojiRating, setEmojiRating] = useState<EmojiRating>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  async function handleSubmit() {
    if (submitting) return;

    // Build the message content based on category
    let fullMessage = message;
    if (category === "bug" && steps) {
      fullMessage = `${message}\n\nSteps to reproduce:\n${steps}`;
    }
    if (category === "feedback" && !message && emojiRating) {
      fullMessage = `[Emoji rating: ${emojiRating}]`;
    }

    if (!fullMessage.trim()) return;

    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth");
      return;
    }

    const body: Record<string, string> = {
      category: category!,
      message: fullMessage,
    };
    if (category === "bug" && page) body.page = page;
    if (category === "feature" && importance) body.importance = importance;
    if (category === "feedback" && emojiRating) body.emoji_rating = emojiRating;

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 max-w-lg mx-auto">
        <div className="text-center">
          <div className="text-5xl mb-4">{"✅"}</div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Thanks!</h2>
          <p className="text-zinc-400 mb-8">We read every submission.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-medium transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center gap-3 mb-8 pt-2">
        <button
          onClick={() => (category ? setCategory(null) : router.push("/"))}
          className="text-zinc-400 hover:text-zinc-200 text-lg"
        >
          &larr;
        </button>
        <h1 className="text-xl font-bold">Feedback & Ideas</h1>
      </header>

      {/* Step 1: Category Selection */}
      {!category && (
        <div className="space-y-3">
          <button
            onClick={() => setCategory("bug")}
            className="w-full p-5 rounded-xl bg-red-900/20 border border-red-900/50 hover:bg-red-900/30 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{"🐛"}</span>
              <div>
                <span className="font-semibold text-zinc-100">Report a Bug</span>
                <p className="text-sm text-zinc-500">Something broken?</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCategory("feature")}
            className="w-full p-5 rounded-xl bg-amber-900/20 border border-amber-900/50 hover:bg-amber-900/30 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{"💡"}</span>
              <div>
                <span className="font-semibold text-zinc-100">Request a Feature</span>
                <p className="text-sm text-zinc-500">What&apos;s missing?</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCategory("feedback")}
            className="w-full p-5 rounded-xl bg-blue-900/20 border border-blue-900/50 hover:bg-blue-900/30 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{"💬"}</span>
              <div>
                <span className="font-semibold text-zinc-100">Share Feedback</span>
                <p className="text-sm text-zinc-500">Love it? Hate it?</p>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Step 2: Bug Form */}
      {category === "bug" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              What happened? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe the bug..."
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              What page were you on?
            </label>
            <select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-600 focus:outline-none text-zinc-100"
            >
              <option value="">Select a page...</option>
              {PAGES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              Steps to reproduce (optional)
            </label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={3}
              placeholder="1. Go to...\n2. Click on...\n3. See error"
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-600 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!message.trim() || submitting}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Bug Report"}
          </button>
        </div>
      )}

      {/* Step 2: Feature Request Form */}
      {category === "feature" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              What would you like? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe the feature..."
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              How important is this to you?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "nice_to_have", label: "Nice to have" },
                { value: "need_it", label: "Need it" },
                { value: "dealbreaker", label: "Dealbreaker" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setImportance(opt.value)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                    importance === opt.value
                      ? "bg-emerald-900/50 border-emerald-700 text-emerald-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!message.trim() || submitting}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Feature Request"}
          </button>
        </div>
      )}

      {/* Step 2: Feedback Form */}
      {category === "feedback" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-3">
              How do you feel about CutLog?
            </label>
            <div className="flex justify-center gap-4">
              {EMOJI_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEmojiRating(opt.value)}
                  className={`text-4xl p-3 rounded-xl border transition-all ${
                    emojiRating === opt.value
                      ? "border-emerald-600 bg-emerald-900/30 scale-110"
                      : "border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              What&apos;s on your mind?{" "}
              {!emojiRating && <span className="text-red-400">*</span>}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Tell us what you think..."
              className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-emerald-600 focus:outline-none text-zinc-100 placeholder-zinc-600 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={(!message.trim() && !emojiRating) || submitting}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
