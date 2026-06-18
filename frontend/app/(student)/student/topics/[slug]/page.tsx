"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Users, Trophy } from "lucide-react";
import { LoginWall } from "@/components/auth/LoginWall";
import { TopicHeroCTA } from "@/components/topics/TopicHeroCTA";
import { TopicContentViewer } from "@/components/topics/TopicContentViewer";
import { topics as mockTopics, topicModulesBySlug, lessonsByModuleId } from "@/lib/mock/topics";
import { api, ApiError } from "@/lib/api";
import type { Module, Topic } from "@/types";

const topContributors = [
  { name: "Alex Chen", solved: 326, level: "Grandmaster" },
  { name: "Sarah Jenkins", solved: 289, level: "Prime Master" },
];

export default function TopicDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const [topic, setTopic] = useState<Topic | null>(
    () => mockTopics.find((t) => t.slug === slug) ?? null
  );
  const [modules, setModules] = useState<Module[]>(topicModulesBySlug[slug] ?? []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.public
      .getTopicBySlug(slug)
      .then((t) => {
        if (cancelled) return;
        setTopic(t as Topic);
        // Modules come from the API; fall back to mock on shape mismatch.
        if (Array.isArray((t as { modules?: Module[] }).modules)) {
          setModules((t as { modules: Module[] }).modules);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setTopic(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading && !topic) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!topic) {
    notFound();
  }

  const lessonsByModule = lessonsByModuleId;

  return (
    <div className="space-y-6">
      {/* Hero — visible to all */}
      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-10 -right-10 w-72 h-72 rounded-full blur-3xl"
            style={{ backgroundColor: `${topic.color}15` }}
          />
        </div>
        <div className="relative">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
          >
            {topic.tier} • {modules.length} Modules • {topic.lessonCount} Lessons
          </span>
          <h1 className="font-heading text-5xl font-extrabold text-white mt-4 italic">
            {topic.name}
          </h1>
          <p className="text-[#94a3b8] text-sm mt-3 max-w-2xl leading-relaxed">
            {topic.description}
          </p>
          <div className="mt-5 flex gap-3 flex-wrap">
            <TopicHeroCTA />
            <Link
              href="/student/topics"
              className="bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-white/[0.1] transition-all"
            >
              ← All Topics
            </Link>
          </div>
        </div>
      </div>

      {/* Syllabus + Sidebar — gated for visitors */}
      <LoginWall
        title="Sign In to Access Lessons"
        description="Join free to unlock the full syllabus path, problem sets, progress tracking, and expert resources for this topic."
      >
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Syllabus Path */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-heading font-semibold text-white text-xl flex items-center gap-2">
              Syllabus Path
            </h2>

            <TopicContentViewer
              modules={modules}
              lessonsByModuleId={lessonsByModule}
              topicColor={topic.color}
            />
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-white mb-4">Topic Progress</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="40" fill="none"
                      stroke={topic.color} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.25} ${2 * Math.PI * 40}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading font-bold text-white text-xl">0%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#64748b] text-center mt-2">Start the first lesson to begin tracking</p>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-[#f59e0b]" /> Top Contributors
              </h3>
              <div className="space-y-3">
                {topContributors.map((c) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{c.name}</p>
                      <p className="text-xs text-[#94a3b8]">{c.solved} problems solved</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-gradient-to-br from-[#d97706]/30 to-[#f59e0b]/20 border border-[#d97706]/30">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-[#a78bfa]" />
                <h3 className="font-heading font-semibold text-white text-sm">Need a Mentor?</h3>
              </div>
              <p className="text-xs text-[#94a3b8] mb-4 leading-relaxed">
                Connect with Grandmasters for 1-on-1 sessions.
              </p>
              <button className="w-full bg-white text-[#d97706] font-bold text-sm py-2.5 rounded-xl hover:bg-white/90 transition-all">
                Find a Mentor
              </button>
            </div>

            <div
              className="glass rounded-xl p-4 border"
              style={{ borderColor: `${topic.color}30` }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: topic.color }}>
                Topic Stats
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Modules</span>
                  <span className="text-white font-medium">{modules.length}</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Lessons</span>
                  <span className="text-white font-medium">{topic.lessonCount}</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Problems</span>
                  <span className="text-white font-medium">{topic.problemCount}</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Level</span>
                  <span className="font-medium" style={{ color: topic.color }}>{topic.tier}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoginWall>
    </div>
  );
}
