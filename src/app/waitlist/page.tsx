"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const MACHINE_TYPES = ["30W Fiber", "50W Raycus", "60W PMAG", "Other"];
const APPLICATION_TYPES = ["Engraving", "Cutting", "Both"];

type FormState = {
  email: string;
  machineType: string;
  applicationType: string;
  interestedInUpdates: boolean;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function WaitlistPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    machineType: "",
    applicationType: "",
    interestedInUpdates: true,
  });

  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const supabase = createClient();

  // Fetch current waitlist size on mount
  useEffect(() => {
    async function fetchWaitlistCount() {
      const { count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });
      setWaitlistCount(count ?? 0);
    }
    fetchWaitlistCount();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setErrorMessage("Email is required");
      setSubmitState("error");
      return;
    }

    if (!validateEmail(form.email)) {
      setErrorMessage("Please enter a valid email address");
      setSubmitState("error");
      return;
    }

    setSubmitState("loading");
    setErrorMessage("");

    try {
      const { data, error } = await supabase.from("waitlist").insert([
        {
          email: form.email.toLowerCase().trim(),
          machine_type: form.machineType || null,
          application_type: form.applicationType || null,
          interested_in_updates: form.interestedInUpdates,
        },
      ]).select();

      if (error) {
        if (error.code === "23505" || error.message.includes("unique")) {
          setErrorMessage("This email is already on the waitlist");
        } else {
          setErrorMessage("Failed to join the waitlist. Please try again.");
        }
        setSubmitState("error");
        return;
      }

      // Calculate new position
      const { count: newCount } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });
      setWaitlistCount(newCount ?? (waitlistCount || 0) + 1);
      setUserPosition(newCount ?? 0);

      setSubmitState("success");
      // Keep form filled for reference but disable further submission
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred");
      setSubmitState("error");
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Waitlist link copied to clipboard!");
    }
  };

  if (submitState === "success") {
    return (
      <div className="flex flex-col min-h-screen p-4 max-w-lg mx-auto">
        <header className="flex items-center justify-between mb-8 pt-2">
          <Link href="/" className="text-2xl font-bold hover:text-zinc-300 transition-colors">
            CutLog
          </Link>
          <span className="text-xs text-zinc-500">Beta Waitlist</span>
        </header>

        <div className="flex-grow flex items-center justify-center mb-8">
          <div className="text-center space-y-6">
            <div className="text-6xl">✓</div>
            <div>
              <h1 className="text-2xl font-bold mb-2">You're on the list!</h1>
              <p className="text-zinc-400 mb-4">
                Check your email for next steps and updates.
              </p>
              {userPosition !== null && (
                <p className="text-lg font-semibold text-emerald-400 mb-4">
                  You're #{userPosition} on the waitlist
                </p>
              )}
              {waitlistCount !== null && (
                <p className="text-sm text-zinc-500">
                  {waitlistCount} people are waiting for CutLog
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700/80 transition-colors font-medium"
          >
            📤 Share this page
          </button>
          <Link href="/" className="block">
            <button className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition-colors font-medium">
              ← Back to home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4 max-w-lg mx-auto">
      <header className="flex items-center justify-between mb-8 pt-2">
        <Link href="/" className="text-2xl font-bold hover:text-zinc-300 transition-colors">
          CutLog
        </Link>
        <span className="text-xs text-zinc-500">Beta Waitlist</span>
      </header>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Join the Beta</h1>
        <p className="text-zinc-400">
          Be the first to use CutLog. Get early access and shape the future of parameter management for laser cutters.
        </p>
      </div>

      {waitlistCount !== null && (
        <div className="mb-6 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-sm text-zinc-300">
            <span className="font-semibold text-emerald-400">{waitlistCount}</span> people have already joined
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 mb-8">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (submitState === "error") setSubmitState("idle");
            }}
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-zinc-100 placeholder:text-zinc-600"
            disabled={submitState === "loading"}
          />
        </div>

        {/* Machine Type Field */}
        <div>
          <label className="block text-sm font-medium mb-2">Machine Type (optional)</label>
          <select
            value={form.machineType}
            onChange={(e) => setForm({ ...form, machineType: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:border-emerald-500 focus:outline-none transition-colors text-zinc-100"
            disabled={submitState === "loading"}
          >
            <option value="">Select a machine...</option>
            {MACHINE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Application Type Field */}
        <div>
          <label className="block text-sm font-medium mb-3">Application Type (optional)</label>
          <div className="space-y-2">
            {APPLICATION_TYPES.map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="applicationType"
                  value={type}
                  checked={form.applicationType === type}
                  onChange={(e) => setForm({ ...form, applicationType: e.target.value })}
                  className="w-4 h-4 cursor-pointer"
                  disabled={submitState === "loading"}
                />
                <span className="ml-3 text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Updates Checkbox */}
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={form.interestedInUpdates}
            onChange={(e) => setForm({ ...form, interestedInUpdates: e.target.checked })}
            className="w-4 h-4 cursor-pointer"
            disabled={submitState === "loading"}
          />
          <span className="ml-3 text-sm text-zinc-400">
            I'm interested in regular updates about CutLog
          </span>
        </label>

        {/* Error Message */}
        {submitState === "error" && errorMessage && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-800">
            <p className="text-sm text-red-300">{errorMessage}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitState === "loading"}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            submitState === "loading"
              ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          {submitState === "loading" ? "Joining..." : "Join the Beta"}
        </button>
      </form>

      <div className="text-center text-xs text-zinc-500">
        <p>Your privacy is important. We'll only contact you about CutLog.</p>
      </div>
    </div>
  );
}
