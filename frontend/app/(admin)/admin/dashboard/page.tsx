"use client";

import { useEffect } from "react";
import { useUsersStore } from "@/store/usersStore";
import type { AdminUser } from "@/lib/mock/users";
import { api } from "@/lib/api";
import { Users, TrendingUp, Trophy, BookOpen, Search, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import type { Tier } from "@/types";

const levelColors: Record<string, string> = {
  Grandmaster: "#f59e0b",
  "Prime Master": "#d97706",
  Expert: "#10b981",
  Advanced: "#3b82f6",
  Intermediate: "#0891b2",
  Beginner: "#64748b",
};
const tierColors: Record<Tier, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706" };

export default function AdminDashboardPage() {
  const { users, removeUser, setUsers, hydrated } = useUsersStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (hydrated) return;
    let cancelled = false;
    api.admin.users
      .list()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : ((res as unknown as { data?: unknown[] })?.data ?? []);
        // Map backend User shape → AdminUser shape (best-effort; the dashboard
        // only uses a few fields).
        const mapped = (list as Array<Record<string, unknown>>).map((u) => ({
          id: String(u.id),
          name: String(u.name ?? ""),
          email: String(u.email ?? ""),
          dept: String(u.department ?? ""),
          institute: String(u.institute ?? ""),
          tier: ((u.tier as Tier) ?? "Beginner") as Tier,
          level: String(u.level ?? "Newcomer"),
          xp: Number(u.xp ?? 0),
          streak: Number(u.streak ?? 0),
          testsTaken: 0,
          avgScore: 0,
          joinedAt: String(u.joinedAt ?? ""),
          status: (u.status === "suspended" ? "inactive" : "active") as "active" | "inactive",
          institutionType: u.institutionType as AdminUser["institutionType"],
          classYear: u.classYear as string | undefined,
          placementDone: Boolean(u.placementDone),
        }));
        if (mapped.length) setUsers(mapped);
      })
      .catch(() => {/* keep mock */});
    return () => {
      cancelled = true;
    };
  }, [hydrated, setUsers]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.dept.toLowerCase().includes(search.toLowerCase()) ||
      u.tier.toLowerCase().includes(search.toLowerCase()) ||
      u.institute.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter((u) => u.status === "active").length;
  const avgScore = users.length > 0 ? Math.round(users.reduce((s, u) => s + u.avgScore, 0) / users.length) : 0;
  const beginnerCount = users.filter((u) => u.tier === "Beginner").length;
  const intermediateCount = users.filter((u) => u.tier === "Intermediate").length;
  const advancedCount = users.filter((u) => u.tier === "Advanced").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Faculty Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Full visibility into student performance, platform health, and competition management.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: users.length, icon: Users, color: "#d97706" },
          { label: "Active Students", value: activeCount, icon: TrendingUp, color: "#10b981" },
          { label: "Platform Avg. Score", value: `${avgScore}%`, icon: Trophy, color: "#f59e0b" },
          { label: "Topics Available", value: "6", icon: BookOpen, color: "#0891b2" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-5"
            style={{ border: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="font-heading text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {([
          { tier: "Beginner" as Tier, count: beginnerCount, subtitle: "School level" },
          { tier: "Intermediate" as Tier, count: intermediateCount, subtitle: "College level" },
          { tier: "Advanced" as Tier, count: advancedCount, subtitle: "University level" },
        ]).map(({ tier, count, subtitle }) => {
          const color = tierColors[tier];
          return (
            <div
              key={tier}
              className="bg-white rounded-xl p-5"
              style={{ border: `1px solid ${color}25`, boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}12`, color }}>{tier}</span>
                <span className="font-heading text-2xl font-bold text-slate-900">{count}</span>
              </div>
              <p className="text-xs text-slate-500">{subtitle}</p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${users.length ? (count / users.length) * 100 : 0}%`, backgroundColor: color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* All Users Table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h3 className="font-heading font-semibold text-slate-900">All Students</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, tier, institute..."
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-[#d97706]/50 focus:ring-2 focus:ring-[#d97706]/10 w-72 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
                <th className="text-left py-3.5 px-6 font-semibold">Student</th>
                <th className="text-left py-3.5 px-6 font-semibold hidden md:table-cell">Tier</th>
                <th className="text-left py-3.5 px-6 font-semibold hidden lg:table-cell">Institute</th>
                <th className="text-left py-3.5 px-6 font-semibold hidden xl:table-cell">Level</th>
                <th className="text-right py-3.5 px-6 font-semibold hidden sm:table-cell">XP</th>
                <th className="text-right py-3.5 px-6 font-semibold hidden md:table-cell">Streak</th>
                <th className="text-right py-3.5 px-6 font-semibold">Score</th>
                <th className="text-center py-3.5 px-6 font-semibold hidden sm:table-cell">Status</th>
                <th className="text-right py-3.5 px-6 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-slate-50 hover:bg-[#d97706]/2.5 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-amber-500/20">
                        {user.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate hidden sm:block">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 hidden md:table-cell">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[user.tier]}12`, color: tierColors[user.tier] }}>{user.tier}</span>
                  </td>
                  <td className="py-3.5 px-6 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{user.institute}</span>
                  </td>
                  <td className="py-3.5 px-6 hidden xl:table-cell">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${levelColors[user.level] ?? "#64748b"}12`, color: levelColors[user.level] ?? "#64748b" }}>
                      {user.level}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right hidden sm:table-cell">
                    <span className="text-sm text-[#d97706] font-semibold">{user.xp.toLocaleString()}</span>
                  </td>
                  <td className="py-3.5 px-6 text-right hidden md:table-cell">
                    <span className="text-sm text-[#f59e0b] font-semibold">{user.streak}d</span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className={`text-sm font-bold ${user.avgScore >= 80 ? "text-[#10b981]" : user.avgScore >= 65 ? "text-[#f59e0b]" : "text-red-500"}`}>
                      {user.avgScore}%
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      user.status === "active" ? "bg-[#10b981]/12 text-[#10b981]" : "bg-slate-100 text-slate-500"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors">
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => removeUser(user.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-10">No students match your search.</p>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50/50">
          Showing {filtered.length} of {users.length} students
        </div>
      </div>
    </div>
  );
}
