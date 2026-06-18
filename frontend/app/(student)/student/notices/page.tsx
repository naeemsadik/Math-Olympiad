"use client";

import { useState } from "react";
import { useNoticesStore } from "@/store/noticesStore";
import { useAuthStore } from "@/store/authStore";
import type { Tier } from "@/types";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";

const priorityConfig = {
  high: { label: "Important", color: "#ef4444", bg: "bg-red-50 text-red-500 border border-red-100" },
  normal: { label: "Notice", color: "#3b82f6", bg: "bg-blue-50 text-blue-500 border border-blue-100" },
  low: { label: "Info", color: "#64748b", bg: "bg-slate-100 text-slate-500 border border-slate-200" },
};

const tierColors: Record<Tier | "All", string> = {
  All: "#d97706",
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
};

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
};

export default function StudentNoticesPage() {
  const { notices } = useNoticesStore();
  const { user } = useAuthStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"mine" | "all">("mine");

  const userTier = user?.tier as Tier | undefined;

  const filtered = notices.filter((n) => {
    if (filter === "all") return true;
    return n.tier === "All" || n.tier === userTier;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Bell size={24} className="text-[#d97706]" /> Notices
        </h1>
        <p className="text-slate-500 text-sm mt-1">Important announcements and updates from the admin team.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["mine", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              filter === f ? "gradient-orange text-white border-transparent" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "mine" ? "My Tier" : "All Notices"}
          </button>
        ))}
      </div>

      {/* Notices list */}
      <div className="space-y-3">
        {sorted.map((notice) => {
          const pCfg = priorityConfig[notice.priority];
          const tierColor = tierColors[notice.tier];
          const isOpen = expanded === notice.id;

          return (
            <div
              key={notice.id}
              className="bg-white rounded-2xl overflow-hidden transition-all"
              style={{ ...cardStyle, borderColor: notice.priority === "high" ? "#ef444425" : "rgba(15,23,42,0.07)" }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : notice.id)}
                className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: pCfg.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900">{notice.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${pCfg.bg}`}>
                      {pCfg.label}
                    </span>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: `${tierColor}12`, color: tierColor }}
                    >
                      {notice.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{notice.createdAt}</p>
                </div>
                {isOpen
                  ? <ChevronUp size={15} className="text-slate-400 shrink-0 mt-1" />
                  : <ChevronDown size={15} className="text-slate-400 shrink-0 mt-1" />
                }
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed pt-4">{notice.body}</p>
                  <p className="text-xs text-slate-400 mt-3">Posted by {notice.author}</p>
                </div>
              )}
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center" style={cardStyle}>
            <p className="text-slate-400 text-sm">No notices found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
