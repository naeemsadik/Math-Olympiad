"use client";

import { useState } from "react";
import { leaderboard } from "@/lib/mock/dashboard";
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Star, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import type { Tier } from "@/types";

const tierColors: Record<Tier, string> = {
  Beginner: "#059669",
  Intermediate: "#d97706",
  Advanced: "#d97706",
};

const tierBg: Record<Tier, string> = {
  Beginner: "rgba(5,150,105,0.1)",
  Intermediate: "rgba(217,119,6,0.1)",
  Advanced: "rgba(217, 119, 6,0.1)",
};

const allTimeData = leaderboard.map((e, i) => ({ ...e, rating: e.rating + 1200 - i * 30 }));

const VISIBLE_ROWS = 10;
type TierFilter = Tier | "All";

const rankIcon = (rank: number) => {
  if (rank === 1) return <Trophy size={16} className="text-[#d97706]" />;
  if (rank === 2) return <Medal size={16} className="text-slate-400" />;
  if (rank === 3) return <Medal size={16} className="text-[#b45309]" />;
  return null;
};

const podiumStyle = [
  { rank: "text-[#d97706]", bg: "from-[#fef3c7] to-white", border: "border-[#d97706]/25", shadow: "shadow-[0_4px_20px_rgba(217,119,6,0.12)]" },
  { rank: "text-slate-400",  bg: "from-slate-100 to-white",   border: "border-slate-200",       shadow: "shadow-[0_4px_12px_rgba(15,23,42,0.06)]" },
  { rank: "text-[#b45309]", bg: "from-[#fde8d0] to-white", border: "border-[#b45309]/20",  shadow: "shadow-[0_4px_16px_rgba(180,83,9,0.1)]" },
];

export default function LeaderboardPage() {
  const [tab, setTab] = useState<"monthly" | "alltime">("monthly");
  const { user } = useAuthStore();
  const [tierFilter, setTierFilter] = useState<TierFilter>("All");

  const rawData = tab === "monthly" ? leaderboard : allTimeData;
  const data = tierFilter === "All" ? rawData : rawData.filter((e) => e.tier === tierFilter);
  const visibleData = user ? data : data.slice(0, VISIBLE_ROWS);
  const hiddenCount = user ? 0 : Math.max(0, data.length - VISIBLE_ROWS);
  const podiumData = data.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
        {/* Header card */}
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
            boxShadow: "0 8px 32px rgba(217, 119, 6,0.3), 0 2px 8px rgba(217, 119, 6,0.2)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-yellow-300" />
                <p className="text-xs text-white/70 uppercase tracking-widest font-medium">Hall of Fame</p>
              </div>
              <h1 className="font-heading text-4xl font-extrabold text-white leading-tight">
                Global <span className="text-yellow-300">Leaderboard</span>
              </h1>
              <p className="text-white/65 mt-2 text-sm">
                The brightest minds from Bangladesh. Track your rank against the best.
              </p>
            </div>
            <div className="flex gap-2">
              {(["monthly", "alltime"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    tab === t
                      ? "bg-white text-[#d97706] shadow-sm"
                      : "bg-white/15 text-white/80 hover:bg-white/25 border border-white/20"
                  }`}
                >
                  {t === "monthly" ? "Monthly" : "All Time"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tier filter tabs */}
        <div className="flex flex-wrap gap-2">
          {(["All", "Beginner", "Intermediate", "Advanced"] as TierFilter[]).map((t) => {
            const isActive = tierFilter === t;
            const color = t === "All" ? "#64748b" : tierColors[t as Tier];
            const bg = t === "All" ? "rgba(100,116,139,0.1)" : tierBg[t as Tier];
            return (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
                style={isActive
                  ? { backgroundColor: bg, borderColor: `${color}35`, color }
                  : { backgroundColor: "transparent", borderColor: "rgba(15,23,42,0.1)", color: "#64748b" }
                }
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Top 3 podium */}
        {podiumData.length >= 3 && (
          <div className="grid grid-cols-3 gap-4">
            {[1, 0, 2].map((order) => {
              const entry = podiumData[order];
              if (!entry) return null;
              const style = podiumStyle[order];
              return (
                <div
                  key={entry.rank}
                  className={`rounded-2xl p-5 border text-center bg-linear-to-b ${style.bg} ${style.border} ${style.shadow}`}
                >
                  <div className={`text-2xl font-heading font-extrabold mb-2 ${style.rank}`}>
                    #{entry.rank}
                  </div>
                  <div className="w-12 h-12 gradient-orange rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-md shadow-amber-500/25">
                    {entry.name[0]}
                  </div>
                  <p className="text-slate-900 font-semibold text-sm">{entry.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{entry.institute || entry.department}</p>
                  <span
                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-2"
                    style={{ color: tierColors[entry.tier], backgroundColor: tierBg[entry.tier] }}
                  >
                    {entry.tier}
                  </span>
                  <p className={`text-xl font-heading font-bold mt-2 ${style.rank}`}>
                    {entry.rating.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Full table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid rgba(15,23,42,0.07)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
          }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left py-4 px-6 text-xs text-slate-400 uppercase tracking-wider font-semibold">Rank</th>
                <th className="text-left py-4 px-6 text-xs text-slate-400 uppercase tracking-wider font-semibold">Competitor</th>
                <th className="text-left py-4 px-6 text-xs text-slate-400 uppercase tracking-wider font-semibold hidden sm:table-cell">Tier</th>
                <th className="text-right py-4 px-6 text-xs text-slate-400 uppercase tracking-wider font-semibold">Rating</th>
                <th className="text-right py-4 px-6 text-xs text-slate-400 uppercase tracking-wider font-semibold hidden sm:table-cell">Trend</th>
              </tr>
            </thead>
            <tbody>
              {visibleData.map((entry) => (
                <tr key={entry.rank} className="border-t border-slate-50 hover:bg-[#d97706]/[0.025] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {rankIcon(entry.rank)}
                      <span className={`text-sm font-bold ${entry.rank <= 3 ? "text-[#d97706]" : "text-slate-400"}`}>
                        {String(entry.rank).padStart(2, "0")}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-orange flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-amber-500/20">
                        {entry.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{entry.name}</p>
                        <p className="text-xs text-slate-400">{entry.institute || entry.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ color: tierColors[entry.tier], backgroundColor: tierBg[entry.tier] }}
                    >
                      {entry.tier}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-sm font-bold text-slate-900">{entry.rating.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-right hidden sm:table-cell">
                    {entry.trend === "up" && <TrendingUp size={16} className="text-emerald-500 ml-auto" />}
                    {entry.trend === "down" && <TrendingDown size={16} className="text-red-400 ml-auto" />}
                    {entry.trend === "stable" && <Minus size={16} className="text-slate-300 ml-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Visitor lock */}
          {!user && hiddenCount > 0 && (
            <div className="relative">
              <div className="pointer-events-none select-none" style={{ filter: "blur(5px)", opacity: 0.25 }}>
                {data.slice(VISIBLE_ROWS).map((entry) => (
                  <div key={entry.rank} className="flex items-center gap-4 border-t border-slate-50 px-6 py-4">
                    <span className="text-sm font-bold text-slate-300 w-8">{String(entry.rank).padStart(2, "0")}</span>
                    <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">{entry.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{entry.rating.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white border border-slate-200 rounded-2xl px-8 py-5 text-center shadow-xl shadow-slate-200/80">
                  <Lock size={20} className="text-[#d97706] mx-auto mb-2" />
                  <p className="text-slate-900 font-semibold text-sm">
                    {hiddenCount} more competitors hidden
                  </p>
                  <p className="text-slate-400 text-xs mt-1 mb-4">Sign in to see the full rankings and your own position</p>
                  <Link
                    href="/login"
                    className="gradient-orange glow-orange text-white text-sm font-semibold px-6 py-2 rounded-full hover:scale-105 transition-all inline-block"
                  >
                    Sign In to See Your Rank
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
