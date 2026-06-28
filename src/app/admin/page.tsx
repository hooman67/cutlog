"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Cut } from "@/lib/types";

const ADMIN_EMAIL = "houman_sh2001@hotmail.com";

interface UserFeedbackItem {
  id: string;
  category: string;
  message: string;
  user_id: string;
  created_at: string;
  emoji_rating: string | null;
  importance: string | null;
  page: string | null;
}

interface AdminStats {
  totalUsers: number;
  usersWithMachines: number;
  usersWithCuts: number;
  activeUsersLast7Days: number;
  totalCuts: number;
  cutsBySource: Record<string, number>;
  totalMaterials: number;
  feedbackSummary: Record<string, number>;
  waitlistCount: number;
  cutsPerDay: Record<string, number>;
  userFeedbackCount: number;
  userFeedbackByCategory: Record<string, number>;
  recentUserFeedback: UserFeedbackItem[];
}

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  machine: { brand: string; model: string | null; wattage_w: number | null } | null;
  cut_count: number;
  last_active: string | null;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userCuts, setUserCuts] = useState<Cut[]>([]);
  const [loadingCuts, setLoadingCuts] = useState(false);
  const [editingCut, setEditingCut] = useState<Cut | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string | number | null>>({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingCutId, setDeletingCutId] = useState<string | null>(null);
  const [confirmDeleteCutId, setConfirmDeleteCutId] = useState<string | null>(null);
  const [deletingMachineUserId, setDeletingMachineUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "users" | "feedback">("stats");
  const [feedbackFilter, setFeedbackFilter] = useState<string>("all");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/auth");
        return;
      }

      if (session.user.email !== ADMIN_EMAIL) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      const token = session.access_token;

      // Fetch stats and users in parallel
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      setLoading(false);
    }
    init();
  }, []);

  async function loadUserCuts(userId: string) {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setUserCuts([]);
      return;
    }

    setExpandedUserId(userId);
    setLoadingCuts(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`/api/admin/cuts?user_id=${userId}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setUserCuts(data.cuts || []);
    }
    setLoadingCuts(false);
  }

  function startEditCut(cut: Cut) {
    setEditingCut(cut);
    setEditForm({
      material: cut.material,
      thickness_mm: cut.thickness_mm,
      speed_mm_min: cut.speed_mm_min ?? "",
      power_pct: cut.power_pct ?? "",
      gas_type: cut.gas_type ?? "",
      gas_pressure_bar: cut.gas_pressure_bar ?? "",
      focus_position_mm: cut.focus_position_mm ?? "",
      nozzle_diameter_mm: cut.nozzle_diameter_mm ?? "",
      line_interval_mm: cut.line_interval_mm ?? "",
      num_passes: cut.num_passes ?? "",
      notes: cut.notes ?? "",
      quality_rating: cut.quality_rating ?? "",
      operation_type: cut.operation_type ?? "",
    });
  }

  async function handleSaveEdit() {
    if (!editingCut) return;
    setSavingEdit(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const updateData: Record<string, unknown> = { id: editingCut.id };
    if (editForm.material) updateData.material = editForm.material;
    if (editForm.thickness_mm !== "") updateData.thickness_mm = Number(editForm.thickness_mm);
    updateData.speed_mm_min = editForm.speed_mm_min !== "" ? Number(editForm.speed_mm_min) : null;
    updateData.power_pct = editForm.power_pct !== "" ? Number(editForm.power_pct) : null;
    updateData.gas_type = editForm.gas_type || null;
    updateData.gas_pressure_bar = editForm.gas_pressure_bar !== "" ? Number(editForm.gas_pressure_bar) : null;
    updateData.focus_position_mm = editForm.focus_position_mm !== "" ? Number(editForm.focus_position_mm) : null;
    updateData.nozzle_diameter_mm = editForm.nozzle_diameter_mm !== "" ? Number(editForm.nozzle_diameter_mm) : null;
    updateData.line_interval_mm = editForm.line_interval_mm !== "" ? Number(editForm.line_interval_mm) : null;
    updateData.num_passes = editForm.num_passes !== "" ? Number(editForm.num_passes) : null;
    updateData.notes = editForm.notes || null;
    updateData.quality_rating = editForm.quality_rating !== "" ? Number(editForm.quality_rating) : null;
    updateData.operation_type = editForm.operation_type || null;

    const res = await fetch("/api/admin/cuts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (res.ok) {
      const data = await res.json();
      setUserCuts(prev => prev.map(c => c.id === editingCut.id ? data.cut : c));
      setEditingCut(null);
    }
    setSavingEdit(false);
  }

  async function handleDeleteCut(cutId: string) {
    setDeletingCutId(cutId);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch(`/api/admin/cuts?id=${cutId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      setUserCuts(prev => prev.filter(c => c.id !== cutId));
      // Update user cut count in the list
      if (expandedUserId) {
        setUsers(prev => prev.map(u =>
          u.id === expandedUserId ? { ...u, cut_count: u.cut_count - 1 } : u
        ));
      }
    }
    setDeletingCutId(null);
    setConfirmDeleteCutId(null);
  }

  async function handleDeleteMachine(userId: string) {
    setDeletingMachineUserId(userId);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Use a custom endpoint or direct supabase admin call
    // For simplicity, we'll call the admin cuts route pattern but for machines
    // Actually, let's use a fetch to a special endpoint. Since we don't have one,
    // we'll add machine deletion to the cuts route logic.
    // For now, use direct supabase call with service role via API
    const res = await fetch(`/api/admin/users?delete_machine=${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, machine: null } : u
      ));
    }
    setDeletingMachineUserId(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-zinc-500">Loading admin dashboard...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h1>
        <p className="text-zinc-400 mb-6">You do not have admin privileges.</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-zinc-400 hover:text-zinc-200">
            &larr;
          </button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
          {ADMIN_EMAIL}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "stats"
              ? "bg-emerald-900/50 border border-emerald-700 text-emerald-300"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "bg-emerald-900/50 border border-emerald-700 text-emerald-300"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "feedback"
              ? "bg-emerald-900/50 border border-emerald-700 text-emerald-300"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Feedback ({stats?.userFeedbackCount ?? 0})
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === "stats" && stats && (
        <div className="space-y-6">
          {/* User Statistics */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-zinc-200">User Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Users" value={stats.totalUsers} />
              <StatCard label="With Machines" value={stats.usersWithMachines} />
              <StatCard label="Have Logged Cuts" value={stats.usersWithCuts} />
              <StatCard label="Active (7 days)" value={stats.activeUsersLast7Days} />
            </div>
          </section>

          {/* Site Statistics */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-zinc-200">Site Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Total Cuts" value={stats.totalCuts} />
              <StatCard label="Total Materials" value={stats.totalMaterials} />
              <StatCard label="Waitlist Signups" value={stats.waitlistCount} />
              <StatCard
                label="Feedback Total"
                value={Object.values(stats.feedbackSummary).reduce((a, b) => a + b, 0)}
              />
              <StatCard label="User Feedback" value={stats.userFeedbackCount} />
            </div>
          </section>

          {/* Cuts by Source */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-zinc-200">Cuts by Source</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(stats.cutsBySource).map(([source, count]) => (
                <div key={source} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 mb-1">{source.replace(/_/g, " ")}</p>
                  <p className="text-2xl font-bold text-zinc-100">{count}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Feedback Summary */}
          {Object.keys(stats.feedbackSummary).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-zinc-200">Feedback Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(stats.feedbackSummary).map(([rating, count]) => (
                  <div key={rating} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">{rating.replace(/_/g, " ")}</p>
                    <p className="text-2xl font-bold text-zinc-100">{count}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cuts Per Day (last 30 days) */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-zinc-200">Cuts Per Day (Last 30 Days)</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
              {Object.keys(stats.cutsPerDay).length === 0 ? (
                <p className="text-zinc-500 text-sm">No cuts in the last 30 days.</p>
              ) : (
                <div className="flex items-end gap-1 h-32 min-w-[600px]">
                  {(() => {
                    const maxCount = Math.max(...Object.values(stats.cutsPerDay), 1);
                    return Object.entries(stats.cutsPerDay).map(([day, count]) => (
                      <div key={day} className="flex flex-col items-center flex-1 min-w-[16px]">
                        <span className="text-[9px] text-zinc-500 mb-1">{count}</span>
                        <div
                          className="w-full bg-emerald-700 rounded-t"
                          style={{ height: `${(count / maxCount) * 100}%`, minHeight: "2px" }}
                        />
                        <span className="text-[8px] text-zinc-600 mt-1 rotate-[-45deg] origin-top-left whitespace-nowrap">
                          {day.slice(5)}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === "feedback" && stats && (
        <div className="space-y-4">
          {/* Category breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Bugs" value={stats.userFeedbackByCategory?.bug ?? 0} />
            <StatCard label="Features" value={stats.userFeedbackByCategory?.feature ?? 0} />
            <StatCard label="Feedback" value={stats.userFeedbackByCategory?.feedback ?? 0} />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {["all", "bug", "feature", "feedback"].map((f) => (
              <button
                key={f}
                onClick={() => setFeedbackFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  feedbackFilter === f
                    ? "bg-emerald-900/50 border border-emerald-700 text-emerald-300"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
              </button>
            ))}
          </div>

          {/* Recent submissions */}
          <div className="space-y-2">
            {(stats.recentUserFeedback ?? [])
              .filter((item) => feedbackFilter === "all" || item.category === feedbackFilter)
              .map((item) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        item.category === "bug"
                          ? "bg-red-900/50 text-red-300"
                          : item.category === "feature"
                          ? "bg-amber-900/50 text-amber-300"
                          : "bg-blue-900/50 text-blue-300"
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-200 whitespace-pre-wrap mb-2">{item.message}</p>
                  <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500">
                    <span>{item.user_id.slice(0, 8)}...</span>
                    {item.page && <span>Page: {item.page}</span>}
                    {item.importance && <span>Importance: {item.importance.replace(/_/g, " ")}</span>}
                    {item.emoji_rating && <span>Rating: {item.emoji_rating}</span>}
                  </div>
                </div>
              ))}
            {(stats.recentUserFeedback ?? []).filter(
              (item) => feedbackFilter === "all" || item.category === feedbackFilter
            ).length === 0 && (
              <p className="text-zinc-500 text-center py-8">No feedback submissions yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-2">
          {users.length === 0 ? (
            <p className="text-zinc-500 text-center py-12">No users found.</p>
          ) : (
            users.map(u => (
              <div key={u.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                {/* User Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200 truncate">{u.email}</p>
                    <p className="text-xs text-zinc-500">
                      Joined {formatDate(u.created_at)}
                      {u.last_active && ` | Last active ${formatDate(u.last_active)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 flex-shrink-0">
                    {u.machine ? (
                      <span className="bg-zinc-800 px-2 py-1 rounded">
                        {u.machine.brand} {u.machine.model || ""} {u.machine.wattage_w ? `${u.machine.wattage_w}W` : ""}
                      </span>
                    ) : (
                      <span className="text-zinc-600">No machine</span>
                    )}
                    <span className="bg-zinc-800 px-2 py-1 rounded">{u.cut_count} cuts</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => loadUserCuts(u.id)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-blue-900/50 border border-blue-800 text-blue-300 hover:bg-blue-900/80 transition-colors"
                    >
                      {expandedUserId === u.id ? "Collapse" : "View Details"}
                    </button>
                    {u.machine && (
                      <button
                        onClick={() => handleDeleteMachine(u.id)}
                        disabled={deletingMachineUserId === u.id}
                        className="px-3 py-1.5 rounded-lg text-xs bg-red-900/50 border border-red-800 text-red-400 hover:bg-red-900/80 transition-colors disabled:opacity-50"
                      >
                        {deletingMachineUserId === u.id ? "..." : "Del Machine"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded User Cuts */}
                {expandedUserId === u.id && (
                  <div className="border-t border-zinc-800 p-4 bg-zinc-950/50">
                    {loadingCuts ? (
                      <p className="text-zinc-500 text-sm animate-pulse">Loading cuts...</p>
                    ) : userCuts.length === 0 ? (
                      <p className="text-zinc-500 text-sm">No cuts logged.</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {userCuts.map(cut => (
                          <div key={cut.id} className="bg-zinc-900 border border-zinc-700 rounded-lg p-3">
                            {editingCut?.id === cut.id ? (
                              /* Edit Form */
                              <div className="space-y-3">
                                <p className="text-sm font-medium text-zinc-300 mb-2">
                                  Editing cut: {cut.material}
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  <EditField
                                    label="Material"
                                    value={String(editForm.material ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, material: v }))}
                                  />
                                  <EditField
                                    label="Thickness (mm)"
                                    value={String(editForm.thickness_mm ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, thickness_mm: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Speed (mm/min)"
                                    value={String(editForm.speed_mm_min ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, speed_mm_min: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Power (%)"
                                    value={String(editForm.power_pct ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, power_pct: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Gas Type"
                                    value={String(editForm.gas_type ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, gas_type: v }))}
                                  />
                                  <EditField
                                    label="Gas Pressure (bar)"
                                    value={String(editForm.gas_pressure_bar ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, gas_pressure_bar: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Focus Pos (mm)"
                                    value={String(editForm.focus_position_mm ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, focus_position_mm: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Nozzle Dia (mm)"
                                    value={String(editForm.nozzle_diameter_mm ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, nozzle_diameter_mm: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Line Interval (mm)"
                                    value={String(editForm.line_interval_mm ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, line_interval_mm: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Passes"
                                    value={String(editForm.num_passes ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, num_passes: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Quality (1-5)"
                                    value={String(editForm.quality_rating ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, quality_rating: v }))}
                                    type="number"
                                  />
                                  <EditField
                                    label="Operation Type"
                                    value={String(editForm.operation_type ?? "")}
                                    onChange={(v) => setEditForm(f => ({ ...f, operation_type: v }))}
                                  />
                                </div>
                                <EditField
                                  label="Notes"
                                  value={String(editForm.notes ?? "")}
                                  onChange={(v) => setEditForm(f => ({ ...f, notes: v }))}
                                  fullWidth
                                />
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={handleSaveEdit}
                                    disabled={savingEdit}
                                    className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-sm font-medium transition-colors disabled:opacity-50"
                                  >
                                    {savingEdit ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    onClick={() => setEditingCut(null)}
                                    className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Cut Display */
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <div>
                                    <span className="font-medium text-sm text-zinc-200">{cut.material}</span>
                                    <span className="text-zinc-500 text-xs ml-2">{cut.thickness_mm}mm</span>
                                    {cut.operation_type && (
                                      <span className="text-zinc-500 text-xs ml-2">({cut.operation_type})</span>
                                    )}
                                  </div>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                                    {cut.source}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400 mb-2">
                                  {cut.power_pct != null && <span>{cut.power_pct}%</span>}
                                  {cut.speed_mm_min != null && <span>{cut.speed_mm_min} mm/min</span>}
                                  {cut.gas_type && <span>{cut.gas_type} {cut.gas_pressure_bar}bar</span>}
                                  {cut.focus_position_mm != null && <span>F:{cut.focus_position_mm}mm</span>}
                                  {cut.quality_rating != null && (
                                    <span className="text-yellow-400">{"★".repeat(cut.quality_rating)}</span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] text-zinc-600">{formatDateTime(cut.created_at)}</span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => startEditCut(cut)}
                                      className="px-2 py-1 rounded text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                                    >
                                      Edit
                                    </button>
                                    {confirmDeleteCutId === cut.id ? (
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleDeleteCut(cut.id)}
                                          disabled={deletingCutId === cut.id}
                                          className="px-2 py-1 rounded text-xs bg-red-900 border border-red-700 text-red-300 hover:bg-red-800 transition-colors disabled:opacity-50"
                                        >
                                          {deletingCutId === cut.id ? "..." : "Confirm"}
                                        </button>
                                        <button
                                          onClick={() => setConfirmDeleteCutId(null)}
                                          className="px-2 py-1 rounded text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 transition-colors"
                                        >
                                          No
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setConfirmDeleteCutId(cut.id)}
                                        className="px-2 py-1 rounded text-xs bg-red-900/50 border border-red-800 text-red-400 hover:text-red-300 transition-colors"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "col-span-full" : ""}>
      <label className="block text-[10px] text-zinc-500 mb-0.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-emerald-600 focus:outline-none text-zinc-100 text-xs"
      />
    </div>
  );
}
