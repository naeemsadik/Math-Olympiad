"use client";

import Link from "next/link";
import { topics } from "@/lib/mock/topics";
import { BookOpen, ArrowRight, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { Tier } from "@/types";

const difficultyColors: Record<string, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
  Elite: "#ef4444",
};

const tierColors: Record<Tier, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
};

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
};

export default function TopicsPage() {
  const { user } = useAuthStore();
  const filteredTopics = user ? topics.filter((t) => t.tier === user.tier) : topics;

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)", boxShadow: "0 8px 32px rgba(217,119,6,0.3), 0 2px 8px rgba(217,119,6,0.2)" }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#fcd34d]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d97706]/20 rounded-full blur-2xl" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative">
          <p className="text-xs text-amber-200/60 uppercase tracking-widest mb-3 font-semibold">Academic Syllabus 2024</p>
          <h1 className="font-heading text-4xl font-extrabold text-white leading-tight">
            Master the <span className="text-amber-300">Foundations</span>
          </h1>
          <p className="text-amber-100/60 mt-3 max-w-lg text-sm leading-relaxed">
            Explore the core pillars of competitive mathematics. Our curated syllabus is designed to
            take you from fundamental principles to world-class problem-solving techniques.
          </p>
          {user && (
            <div className="mt-4 flex items-center gap-2">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ color: tierColors[user.tier], backgroundColor: `${tierColors[user.tier]}30`, border: `1px solid ${tierColors[user.tier]}50` }}
              >
                {user.tier} Topics
              </span>
              <span className="text-xs text-amber-200/50">Showing content for your level</span>
            </div>
          )}
        </div>
      </div>

      {/* Topic grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/topics/${topic.slug}`}
            className="bg-white rounded-2xl p-6 flex flex-col gap-4 group transition-all hover:-translate-y-1"
            style={cardStyle}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `${topic.color}30`;
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 24px rgba(15,23,42,0.09), 0 0 0 1px ${topic.color}25`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(15,23,42,0.07)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)";
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${topic.color}18`, color: topic.color }}>
              {topic.name[0]}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-heading font-semibold text-slate-900 text-lg">{topic.name}</h3>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${difficultyColors[topic.level]}12`, color: difficultyColors[topic.level] }}
                >
                  {topic.level}
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{topic.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><BookOpen size={12} /> {topic.lessonCount} Lessons</span>
              <span className="flex items-center gap-1.5 font-semibold group-hover:text-[#d97706] transition-colors" style={{ color: topic.color }}>
                View Problems <ArrowRight size={12} />
              </span>
            </div>
          </Link>
        ))}

        {filteredTopics.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-10 text-center" style={cardStyle}>
            <p className="text-slate-400 text-sm">No topics found for your tier.</p>
          </div>
        )}
      </div>

      {/* CTA — only for visitors */}
      {!user && (
        <div className="bg-white rounded-2xl p-8 text-center" style={cardStyle}>
          <Lock size={20} className="text-[#d97706] mx-auto mb-3" />
          <h3 className="font-heading font-bold text-slate-900 text-2xl mb-2">Ready to Start Learning?</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Sign in to access full lessons, problem sets, progress tracking, and personalized
            recommendations across all topics.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="gradient-orange glow-orange text-white font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition-all text-sm">
              Sign In to Start
            </Link>
            <Link href="/about" className="bg-slate-100 border border-slate-200 text-slate-700 font-medium px-6 py-2.5 rounded-full hover:bg-slate-200 transition-all text-sm">
              Learn More
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
