"use client";

import Link from "next/link";
import { Dumbbell, BookOpen, CheckCircle2, Lock, ChevronRight, Clock, Star } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { abilityAllows } from "@/lib/diagnostic";
import type { AbilityLevel } from "@/types";

const levels = [
  {
    level: "Foundation",
    abilityLevel: "Beginner" as AbilityLevel,
    subtitle: "For Beginners",
    color: "#059669",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    modules: [
      { title: "Basic Number Theory", sessions: 6, completed: 6, locked: false },
      { title: "Introduction to Combinatorics", sessions: 5, completed: 4, locked: false },
      { title: "Euclidean Geometry Basics", sessions: 7, completed: 2, locked: false },
      { title: "Elementary Algebra", sessions: 5, completed: 0, locked: false },
    ],
  },
  {
    level: "Intermediate",
    abilityLevel: "Advanced" as AbilityLevel,
    subtitle: "Regional Round Prep",
    color: "#d97706",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    modules: [
      { title: "Divisibility & Modular Arithmetic", sessions: 6, completed: 0, locked: false },
      { title: "Counting Techniques", sessions: 7, completed: 0, locked: false },
      { title: "Triangle & Circle Theorems", sessions: 8, completed: 0, locked: true },
      { title: "Polynomial Algebra", sessions: 6, completed: 0, locked: true },
    ],
  },
  {
    level: "Advanced",
    abilityLevel: "Expert" as AbilityLevel,
    subtitle: "National Round Prep",
    color: "#dc2626",
    bg: "bg-red-50",
    border: "border-red-100",
    badge: "bg-red-50 text-red-600 border-red-200",
    modules: [
      { title: "Olympiad Number Theory", sessions: 8, completed: 0, locked: true },
      { title: "Combinatorial Game Theory", sessions: 6, completed: 0, locked: true },
      { title: "Advanced Projective Geometry", sessions: 9, completed: 0, locked: true },
      { title: "Functional Equations", sessions: 7, completed: 0, locked: true },
    ],
  },
];

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
};

export default function TrainingPage() {
  const { user } = useAuthStore();
  const userAbility = user?.diagnosticAbilityLevel ?? "Beginner";
  const visibleLevels = levels.filter((level) => abilityAllows(userAbility, level.abilityLevel));
  const totalModules = visibleLevels.flatMap(l => l.modules).length;
  const completedModules = visibleLevels.flatMap(l => l.modules).filter(m => m.completed === m.sessions).length;
  const inProgressModules = visibleLevels.flatMap(l => l.modules).filter(m => m.completed > 0 && m.completed < m.sessions).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-slate-900">Training Program</h1>
        <p className="text-slate-500 text-sm mt-1">Structured curriculum from foundation to advanced olympiad level.</p>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Modules", value: totalModules, color: "#d97706" },
          { label: "In Progress", value: inProgressModules, color: "#f59e0b" },
          { label: "Completed", value: completedModules, color: "#059669" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-5 text-center" style={cardStyle}>
            <p className="font-heading text-3xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Levels */}
      {visibleLevels.map(({ level, subtitle, color, bg, border, badge, modules }) => (
        <div key={level} className="rounded-2xl p-6" style={cardStyle}>
          {/* Level header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}14`, border: `1px solid ${color}28` }}
            >
              <Dumbbell size={18} style={{ color }} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-slate-900 text-base">{level}</h2>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
            <span className={`ml-auto text-xs px-2.5 py-1 rounded-full border font-medium ${badge}`}>{level}</span>
          </div>

          {/* Modules */}
          <div className="space-y-3">
            {modules.map(({ title, sessions, completed, locked }) => {
              const pct = Math.round((completed / sessions) * 100);
              return (
                <div
                  key={title}
                  className={`rounded-xl p-4 border flex items-center gap-4 ${locked ? "opacity-60" : ""} ${bg} ${border}`}
                >
                  <div className="shrink-0">
                    {locked ? (
                      <Lock size={16} className="text-slate-400" />
                    ) : completed === sessions ? (
                      <CheckCircle2 size={16} style={{ color }} />
                    ) : (
                      <BookOpen size={16} style={{ color }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
                      <span className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
                        <Clock size={11} /> {sessions} sessions
                      </span>
                    </div>
                    {!locked && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{completed}/{sessions} completed</span>
                          <span className="font-semibold" style={{ color }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/80 border border-slate-200">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    )}
                    {locked && (
                      <p className="text-xs text-slate-400 mt-1">Complete earlier modules to unlock</p>
                    )}
                  </div>
                  {!locked && (
                    <Link
                      href="/tests"
                      className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                      style={{ backgroundColor: `${color}14`, color, border: `1px solid ${color}28` }}
                    >
                      {completed === 0 ? "Start" : "Continue"}
                      <ChevronRight size={11} className="inline ml-0.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Tips */}
      <div
        className="rounded-2xl p-6 border relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d97706, #b45309)", boxShadow: "0 4px 20px rgba(217,119,6,0.25)" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-15"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative flex items-start gap-4">
          <Star size={22} className="text-white/80 mt-0.5 shrink-0" />
          <div>
            <p className="font-heading font-bold text-white text-base">Pro Tip</p>
            <p className="text-white/80 text-sm mt-1 leading-relaxed">
              Complete at least 2 Foundation modules before attempting practice tests. Consistent daily practice beats intensive cramming — aim for 30 minutes a day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
