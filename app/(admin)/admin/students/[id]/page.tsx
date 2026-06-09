"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useUsersStore } from "@/store/usersStore";
import type { AdminUser } from "@/lib/mock/users";
import type { Tier } from "@/types";
import {
  ArrowLeft, Trophy, Flame, BookOpen, Target,
  CheckCircle, XCircle, Clock, TrendingUp, BarChart2, Star,
} from "lucide-react";

const tierColors: Record<Tier, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
};

const levelColors: Record<string, string> = {
  Grandmaster: "#f59e0b",
  "Prime Master": "#d97706",
  Expert: "#10b981",
  Advanced: "#3b82f6",
  Intermediate: "#0891b2",
  Beginner: "#64748b",
};

const allTests = [
  { name: "Algebra Fundamentals Quiz", topic: "Algebra" },
  { name: "Number Theory Challenge", topic: "Number Theory" },
  { name: "Combinatorics Sprint", topic: "Combinatorics" },
  { name: "Geometry Proof Test", topic: "Geometry" },
  { name: "Inequalities Assessment", topic: "Inequalities" },
  { name: "Graph Theory Basics", topic: "Graph Theory" },
  { name: "Probability Drill", topic: "Probability" },
  { name: "Trigonometry Test", topic: "Trigonometry" },
  { name: "Sequences & Series", topic: "Sequences" },
  { name: "Modular Arithmetic", topic: "Number Theory" },
];

const allTopicNames = [
  "Algebra", "Number Theory", "Geometry", "Combinatorics",
  "Inequalities", "Probability", "Trigonometry",
];

function numSeed(student: AdminUser, i: number) {
  return student.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + i * 37;
}

function generateTestResults(student: AdminUser) {
  const count = Math.min(8, Math.max(4, student.testsTaken));
  return Array.from({ length: count }, (_, i) => {
    const s = numSeed(student, i);
    const variance = (s % 31) - 15;
    const score = Math.max(28, Math.min(100, student.avgScore + variance));
    const daysAgo = (i + 1) * 4 + (s % 6);
    const date = new Date(2026, 4, 15);
    date.setDate(date.getDate() - daysAgo);
    return {
      ...allTests[i % allTests.length],
      score,
      date: date.toLocaleDateString("en-BD", { day: "numeric", month: "short" }),
      passed: score >= 50,
      duration: `${20 + (s % 20)}m`,
    };
  });
}

function generateTopicProgress(student: AdminUser) {
  const count = Math.min(5, Math.max(3, Math.floor(student.testsTaken / 7)));
  return allTopicNames.slice(0, count).map((name, i) => {
    const s = numSeed(student, i + 100);
    const variance = (s % 25) - 10;
    return { name, pct: Math.max(10, Math.min(100, student.avgScore + variance)) };
  });
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { users } = useUsersStore();
  const student = users.find((u) => u.id === id);

  if (!student) {
    return (
      <div className="glass rounded-2xl p-12 text-center space-y-4">
        <p className="text-slate-500">Student not found.</p>
        <Link href="/admin/students" className="text-[#d97706] text-sm hover:underline">
          ← Back to Students
        </Link>
      </div>
    );
  }

  const results = generateTestResults(student);
  const topicProgress = generateTopicProgress(student);
  const tierColor = tierColors[student.tier] ?? "#d97706";
  const levelColor = levelColors[student.level] ?? "#64748b";
  const circum = 2 * Math.PI * 40;
  const passed = results.filter((r) => r.passed).length;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/students"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-500 transition-colors"
      >
        <ArrowLeft size={13} /> Back to Students
      </Link>

      {/* Profile header */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: `${tierColor}12` }}
          />
        </div>
        <div className="relative flex items-start gap-5 flex-wrap">
          <div className="w-16 h-16 gradient-orange rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0">
            {student.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-heading text-2xl font-bold text-slate-900">{student.name}</h1>
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${tierColor}20`, color: tierColor }}
              >
                {student.tier}
              </span>
              <span
                className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${levelColor}18`, color: levelColor }}
              >
                {student.level}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  student.status === "active"
                    ? "bg-[#10b981]/15 text-[#10b981]"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                {student.status}
              </span>
            </div>
            <p className="text-sm text-slate-400">{student.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              {student.institute} · {student.dept || "—"} · Joined {student.joinedAt}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: student.xp.toLocaleString(), icon: Star, color: "#a78bfa" },
          { label: "Streak", value: `${student.streak} days`, icon: Flame, color: "#f59e0b" },
          { label: "Tests Taken", value: student.testsTaken, icon: BookOpen, color: "#10b981" },
          {
            label: "Avg Score",
            value: `${student.avgScore}%`,
            icon: Target,
            color: student.avgScore >= 80 ? "#10b981" : student.avgScore >= 65 ? "#f59e0b" : "#ef4444",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={15} style={{ color }} />
              <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
            </div>
            <p className="font-heading text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: tests + topic progress */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recent Tests */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <BarChart2 size={15} className="text-[#d97706]" />
              <h2 className="font-heading font-semibold text-slate-900">Recent Test Results</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-50">
                    <th className="text-left py-3 px-5 font-medium">Test</th>
                    <th className="text-left py-3 px-5 font-medium hidden sm:table-cell">Topic</th>
                    <th className="text-center py-3 px-5 font-medium">Score</th>
                    <th className="text-center py-3 px-5 font-medium hidden md:table-cell">Duration</th>
                    <th className="text-center py-3 px-5 font-medium hidden sm:table-cell">Date</th>
                    <th className="text-center py-3 px-5 font-medium">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} className="border-t border-slate-50 hover:bg-slate-100/50 transition-colors">
                      <td className="py-3 px-5 text-sm text-slate-900 font-medium">{r.name}</td>
                      <td className="py-3 px-5 hidden sm:table-cell">
                        <span className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                          {r.topic}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center">
                        <span
                          className={`text-sm font-bold ${
                            r.score >= 80
                              ? "text-[#10b981]"
                              : r.score >= 50
                              ? "text-[#f59e0b]"
                              : "text-red-400"
                          }`}
                        >
                          {r.score}%
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center hidden md:table-cell">
                        <span className="flex items-center justify-center gap-1 text-xs text-slate-400">
                          <Clock size={11} /> {r.duration}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-center hidden sm:table-cell text-xs text-slate-400">
                        {r.date}
                      </td>
                      <td className="py-3 px-5 text-center">
                        {r.passed ? (
                          <CheckCircle size={15} className="text-[#10b981] mx-auto" />
                        ) : (
                          <XCircle size={15} className="text-red-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Topic Progress */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-[#d97706]" />
              <h2 className="font-heading font-semibold text-slate-900">Topic Progress</h2>
            </div>
            <div className="space-y-4">
              {topicProgress.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">{t.name}</span>
                    <span className="text-slate-900 font-medium">{t.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-50">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${t.pct}%`, backgroundColor: tierColor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Score ring */}
          <div className="glass rounded-2xl p-5 text-center">
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Overall Score</h3>
            <div className="flex justify-center">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48" cy="48" r="40"
                    fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
                  />
                  <circle
                    cx="48" cy="48" r="40"
                    fill="none" stroke={tierColor} strokeWidth="8"
                    strokeDasharray={`${circum * student.avgScore / 100} ${circum}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading font-bold text-slate-900 text-2xl">{student.avgScore}%</span>
                  <span className="text-[10px] text-slate-400">average</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Based on {student.testsTaken} tests taken
            </p>
          </div>

          {/* 7-day activity */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-[#f59e0b]" />
              <h3 className="font-heading font-semibold text-slate-900">7-Day Activity</h3>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 7 }, (_, i) => {
                const active = student.streak > 0 && i < Math.min(7, student.streak);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full h-8 rounded-lg ${active ? "" : "bg-slate-50"}`}
                      style={active ? { backgroundColor: `${tierColor}40` } : {}}
                    />
                    <span className="text-[10px] text-slate-400">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">{student.streak} day streak</p>
          </div>

          {/* Details */}
          <div className="glass rounded-2xl p-5 space-y-3">
            <h3 className="font-heading font-semibold text-slate-900">Details</h3>
            {[
              { label: "Department", value: student.dept || "—" },
              { label: "Institute", value: student.institute },
              { label: "Joined", value: student.joinedAt },
              { label: "XP Rank", value: `#${Math.max(1, 32 - Math.floor(student.xp / 200))}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-900 font-medium text-right max-w-[60%] truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Test summary */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={14} className="text-[#f59e0b]" />
              <h3 className="font-heading font-semibold text-slate-900">Test Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Passed</span>
                <span className="text-[#10b981] font-medium">{passed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Failed</span>
                <span className="text-red-400 font-medium">{results.length - passed}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 mt-1">
                <span className="text-slate-400">Pass Rate</span>
                <span className="text-slate-900 font-semibold">
                  {Math.round((passed / results.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
