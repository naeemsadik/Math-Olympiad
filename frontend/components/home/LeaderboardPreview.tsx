"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { leaderboard as mockLeaderboard } from "@/lib/mock/dashboard";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { LeaderboardEntry } from "@/types";

export default function LeaderboardPreview() {
  useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.public
      .getLeaderboard({ period: "monthly", limit: 7 })
      .then((res) => {
        if (!cancelled && Array.isArray(res)) setEntries(res);
      })
      .catch(() => {/* keep mock */});
    return () => {
      cancelled = true;
    };
  }, []);

  const displayData = (entries ?? mockLeaderboard).slice(0, 7);

  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="font-heading text-3xl font-bold text-slate-900">Global Leaderboard</h2>
            <p className="text-slate-500 text-sm mt-1">
              The brightest minds from UIU are already here. Track your progress against the best.
            </p>
          </div>
          <div className="flex gap-2">
            {["Monthly", "All Time"].map((t, i) => (
              <button
                key={t}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? "gradient-orange text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mt-6">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">Rank</th>
                <th className="text-left py-3 px-4 font-medium">Competitor</th>
                <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Department</th>
                <th className="text-right py-3 px-4 font-medium">Rating</th>
                <th className="text-right py-3 px-4 font-medium hidden sm:table-cell">Trend</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((entry) => (
                <tr
                  key={entry.rank}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span
                      className={`text-sm font-bold ${
                        entry.rank <= 3 ? "text-[#d97706]" : "text-slate-400"
                      }`}
                    >
                      {String(entry.rank).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-orange flex items-center justify-center text-white text-xs font-bold">
                        {entry.name[0]}
                      </div>
                      <span className="text-sm font-medium text-slate-900">{entry.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-500">{entry.department}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      {entry.rating.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right hidden sm:table-cell">
                    {entry.trend === "up" && <TrendingUp size={16} className="text-emerald-500 ml-auto" />}
                    {entry.trend === "down" && <TrendingDown size={16} className="text-red-400 ml-auto" />}
                    {entry.trend === "stable" && <Minus size={16} className="text-slate-400 ml-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 gradient-orange text-white text-sm font-bold px-8 py-3 rounded-full hover:scale-105 transition-all shadow-md shadow-amber-500/20"
          >
            View Full Leaderboard on Hall of Fame →
          </Link>
        </div>
      </div>
    </section>
  );
}
