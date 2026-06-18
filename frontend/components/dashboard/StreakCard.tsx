"use client";

import { Flame, AlertTriangle, Zap } from "lucide-react";
import { motion } from "framer-motion";

const MILESTONES = [7, 14, 30, 60, 100, 180, 365];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  streak: number;
}

export default function StreakCard({ streak }: Props) {
  const longest = Math.max(streak, streak + 3);

  // Mock: 6 days done this week, today pending — creates urgency
  const lastSeven = [true, true, true, true, true, true, false];
  const doneToday = lastSeven[6];
  const status: "active" | "warning" | "broken" =
    streak === 0 ? "broken" : doneToday ? "active" : "warning";

  const nextMilestone = MILESTONES.find((m) => m > streak) ?? 365;
  const prevMilestone = [...MILESTONES].reverse().find((m) => m <= streak) ?? 0;
  const progress = ((streak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
  const daysToNext = nextMilestone - streak;

  const xpMultiplier =
    streak >= 30 ? "2.5×" : streak >= 14 ? "2×" : streak >= 7 ? "1.5×" : "1×";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/80 overflow-hidden">
      <div
        className="h-1 w-full"
        style={{
          background:
            status === "broken"
              ? "#ef4444"
              : "linear-gradient(90deg, #d97706, #f59e0b)",
        }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Daily Streak</h3>
          {status === "warning" && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <AlertTriangle size={9} /> Act today!
            </span>
          )}
          {status === "active" && (
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              On fire!
            </span>
          )}
          {status === "broken" && (
            <span className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              Start fresh!
            </span>
          )}
        </div>

        {/* Flame + number */}
        <div className="flex items-center gap-4 mb-5">
          <motion.div
            animate={status !== "broken" ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background:
                status === "broken"
                  ? "#f1f5f9"
                  : "linear-gradient(135deg, #d97706, #f59e0b)",
              boxShadow:
                status !== "broken" ? "0 6px 20px rgba(217,119,6,0.35)" : "none",
            }}
          >
            <Flame
              size={26}
              className={status === "broken" ? "text-slate-300" : "text-white"}
            />
          </motion.div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-bold text-slate-900">
                {streak}
              </span>
              <span className="text-sm text-slate-400 font-medium">days</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Zap size={10} className="text-[#d97706]" />
              <span className="text-xs font-semibold text-[#d97706]">
                {xpMultiplier} XP multiplier
              </span>
            </div>
          </div>
        </div>

        {/* 7-day tracker */}
        <div className="mb-5">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-2">
            This week
          </p>
          <div className="flex gap-1.5">
            {lastSeven.map((active, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full h-7 rounded-lg transition-all"
                  style={{
                    background: active
                      ? "linear-gradient(180deg, #d97706, #f59e0b)"
                      : "transparent",
                    backgroundColor: !active && i !== 6 ? "#f1f5f9" : undefined,
                    border: i === 6 && !active ? "1.5px dashed #d97706" : "none",
                    opacity: i === 6 && !active ? 0.6 : 1,
                  }}
                />
                <span className="text-[9px] text-slate-400">{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 rounded-xl px-3 py-2">
            <p className="text-[9px] text-slate-400 uppercase tracking-wide">
              Best streak
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-slate-900">{longest}</span>
              <span className="text-[10px] text-slate-400">days</span>
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl px-3 py-2">
            <p className="text-[9px] text-amber-600 uppercase tracking-wide">
              Next badge
            </p>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-[#d97706]">
                {nextMilestone}
              </span>
              <span className="text-[10px] text-amber-600">day mark</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-slate-500">
              {streak} / {nextMilestone} days
            </span>
            <span className="text-[10px] font-medium text-[#d97706]">
              {daysToNext} to go
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #d97706, #f59e0b)" }}
            />
          </div>
        </div>

        {/* Rules hint */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Solve a puzzle, take a test, or study a topic daily to keep your streak.{" "}
            <span className="text-amber-500">Miss 1 day = warning.</span>{" "}
            <span className="text-red-400">Miss 2 in a row = streak resets.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
