"use client";

import { useState } from "react";
import Link from "next/link";
import { useUsersStore } from "@/store/usersStore";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import type { AbilityLevel, Tier } from "@/types";
import { Search, Trash2, Eye, Users, UserX, RotateCcw } from "lucide-react";
import { abilityColors } from "@/lib/diagnostic";
const tierColors: Record<Tier, string> = { Beginner: "#10b981", Intermediate: "#f59e0b", Advanced: "#d97706" };
const tiers: Tier[] = ["Beginner", "Intermediate", "Advanced"];

export default function AdminStudentsPage() {
  const { users, removeUser, resetDiagnostic } = useUsersStore();
  const { resetUserAttempts } = useDiagnosticStore();
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<Tier | "All">("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === "All" || u.tier === filterTier;
    return matchSearch && matchTier;
  });

  const doDelete = () => {
    if (deleteId) removeUser(deleteId);
    setDeleteId(null);
  };

  const doResetDiagnostic = (id: string, email: string) => {
    resetDiagnostic(id);
    resetUserAttempts(email);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Users size={24} className="text-[#d97706]" /> Students
        </h1>
        <p className="text-slate-500 text-sm mt-1">View and manage all registered students on the platform.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..."
            className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-500 placeholder-slate-400 outline-none focus:border-[#d97706]/50 w-60 transition-all" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterTier("All")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${filterTier === "All" ? "gradient-orange text-white" : "bg-slate-50 text-slate-500 hover:text-slate-900"}`}>
            All Tiers
          </button>
          {tiers.map((t) => (
            <button key={t} onClick={() => setFilterTier(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${filterTier === t ? "text-slate-900" : "bg-slate-50 text-slate-500 hover:text-slate-900"}`}
              style={filterTier === t ? { backgroundColor: tierColors[t] } : {}}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="glass rounded-2xl p-5 border border-red-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserX size={16} className="text-red-400" />
            <p className="text-sm text-slate-900">Remove <span className="text-red-400 font-semibold">{users.find(u => u.id === deleteId)?.name}</span> from the platform?</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
            <button onClick={doDelete} className="px-4 py-1.5 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium">Remove</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                <th className="text-left py-3 px-6 font-medium">Student</th>
                <th className="text-left py-3 px-6 font-medium hidden md:table-cell">Tier</th>
                <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Institute</th>
                <th className="text-left py-3 px-6 font-medium hidden xl:table-cell">Class / Year</th>
                <th className="text-left py-3 px-6 font-medium hidden lg:table-cell">Diagnostic</th>
                <th className="text-right py-3 px-6 font-medium hidden sm:table-cell">XP</th>
                <th className="text-right py-3 px-6 font-medium hidden md:table-cell">Streak</th>
                <th className="text-right py-3 px-6 font-medium">Score</th>
                <th className="text-center py-3 px-6 font-medium hidden sm:table-cell">Status</th>
                <th className="text-right py-3 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{u.name[0]}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{u.name}</p>
                        <p className="text-xs text-slate-400 truncate hidden sm:block">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 hidden md:table-cell">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tierColors[u.tier]}18`, color: tierColors[u.tier] }}>{u.tier}</span>
                  </td>
                  <td className="py-3.5 px-6 hidden lg:table-cell"><span className="text-xs text-slate-500">{u.institute}</span></td>
                  <td className="py-3.5 px-6 hidden xl:table-cell"><span className="text-xs text-slate-500">{u.classYear ?? <span className="text-slate-300">—</span>}</span></td>
                  <td className="py-3.5 px-6 hidden lg:table-cell">
                    {u.diagnosticAbilityLevel ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${abilityColors[u.diagnosticAbilityLevel as AbilityLevel]}18`, color: abilityColors[u.diagnosticAbilityLevel as AbilityLevel] }}>
                          {u.diagnosticAbilityLevel}
                        </span>
                        <span className="text-xs text-slate-400">{u.diagnosticScore ?? 0}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Pending</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-right hidden sm:table-cell"><span className="text-sm text-[#d97706] font-medium">{u.xp.toLocaleString()}</span></td>
                  <td className="py-3.5 px-6 text-right hidden md:table-cell"><span className="text-sm text-[#f59e0b]">{u.streak}d</span></td>
                  <td className="py-3.5 px-6 text-right"><span className={`text-sm font-semibold ${u.avgScore >= 80 ? "text-[#10b981]" : u.avgScore >= 65 ? "text-[#f59e0b]" : "text-red-400"}`}>{u.avgScore}%</span></td>
                  <td className="py-3.5 px-6 text-center hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === "active" ? "bg-[#10b981]/15 text-[#10b981]" : "bg-slate-50 text-slate-400"}`}>{u.status}</span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Link href={`/admin/students/${u.id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><Eye size={14} /></Link>
                      <button title="Reset diagnostic" onClick={() => doResetDiagnostic(u.id, u.email)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#d97706] hover:bg-[#d97706]/10 transition-colors"><RotateCcw size={14} /></button>
                      <button onClick={() => setDeleteId(u.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-slate-400 text-sm py-10">No students found.</p>}
        </div>
        <div className="px-6 py-3 border-t border-slate-50 text-xs text-slate-400">{filtered.length} of {users.length} students</div>
      </div>
    </div>
  );
}
