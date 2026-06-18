"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, ChevronDown, Lightbulb, FileText, ExternalLink, Download, Video, CheckCircle, Clock } from "lucide-react";
import type { Module, Lesson } from "@/types";

const difficultyColors: Record<string, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
  Elite: "#ef4444",
};

function ResourceIcon({ type }: { type: Lesson["resources"][0]["type"] }) {
  if (type === "video") return <Video size={13} />;
  if (type === "pdf") return <Download size={13} />;
  return <ExternalLink size={13} />;
}

function LessonPanel({ lesson, topicColor }: { lesson: Lesson; topicColor: string }) {
  return (
    <div className="mt-4 space-y-5 text-sm">
      {/* Content */}
      <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.05]">
        <p className="text-[#94a3b8] leading-relaxed whitespace-pre-line">{lesson.content}</p>
      </div>

      {/* Key Points */}
      <div>
        <h4 className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider mb-3">
          <Lightbulb size={14} style={{ color: topicColor }} /> Key Points
        </h4>
        <ul className="space-y-2">
          {lesson.keyPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-2 text-[#94a3b8]">
              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: topicColor }} />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Worked Example */}
      <div className="rounded-xl border" style={{ borderColor: `${topicColor}30`, backgroundColor: `${topicColor}08` }}>
        <div className="px-4 py-2.5 border-b flex items-center gap-2" style={{ borderColor: `${topicColor}20` }}>
          <FileText size={14} style={{ color: topicColor }} />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">Worked Example</span>
        </div>
        <div className="px-4 py-4 space-y-3">
          <div>
            <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Problem</p>
            <p className="text-white font-medium">{lesson.example.problem}</p>
          </div>
          <div>
            <p className="text-xs text-[#64748b] uppercase tracking-wider mb-1">Solution</p>
            <p className="text-[#94a3b8]">{lesson.example.solution}</p>
          </div>
        </div>
      </div>

      {/* Resources */}
      {lesson.resources.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Resources</h4>
          <div className="flex flex-wrap gap-2">
            {lesson.resources.map((res) => (
              <span
                key={res.title}
                className="flex items-center gap-1.5 text-xs text-[#94a3b8] bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full"
              >
                <ResourceIcon type={res.type} />
                {res.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface TopicContentViewerProps {
  modules: Module[];
  lessonsByModuleId: Record<string, Lesson[]>;
  topicColor: string;
}

export function TopicContentViewer({ modules, lessonsByModuleId, topicColor }: TopicContentViewerProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(modules[0]?.id ?? null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  if (modules.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <BookOpen size={32} className="mx-auto mb-3 text-[#64748b]" />
        <p className="text-[#94a3b8] text-sm">Lessons are being prepared for this topic. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" id="topic-syllabus">
      {modules.map((mod) => {
        const lessons = lessonsByModuleId[mod.id] ?? [];
        const isOpen = expandedModule === mod.id;

        return (
          <div
            key={mod.id}
            className="glass rounded-2xl overflow-hidden border"
            style={{ borderColor: isOpen ? `${topicColor}40` : "rgba(255,255,255,0.06)" }}
          >
            {/* Module header */}
            <button
              onClick={() => setExpandedModule(isOpen ? null : mod.id)}
              className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 font-bold"
                  style={{ backgroundColor: `${topicColor}20`, color: topicColor }}
                >
                  {mod.order}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-heading font-semibold text-white">{mod.name}</h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${difficultyColors[mod.difficulty]}15`, color: difficultyColors[mod.difficulty] }}
                    >
                      {mod.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-[#94a3b8]">{mod.description}</p>
                  <p className="text-xs text-[#64748b] mt-1">{mod.lessonCount} lessons</p>
                </div>
              </div>
              {isOpen ? (
                <ChevronDown size={18} className="text-[#64748b] shrink-0 mt-1" />
              ) : (
                <ChevronRight size={18} className="text-[#64748b] shrink-0 mt-1" />
              )}
            </button>

            {/* Lessons list */}
            {isOpen && (
              <div className="border-t border-white/[0.06] px-5 pb-5 pt-4 space-y-2">
                {lessons.length > 0 ? (
                  lessons.map((lesson) => {
                    const isActive = activeLesson === lesson.id;
                    return (
                      <div key={lesson.id} className="rounded-xl overflow-hidden">
                        <button
                          onClick={() => setActiveLesson(isActive ? null : lesson.id)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-left transition-all"
                          style={{
                            backgroundColor: isActive ? `${topicColor}15` : "rgba(255,255,255,0.03)",
                            borderLeft: isActive ? `3px solid ${topicColor}` : "3px solid transparent",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen size={14} style={{ color: isActive ? topicColor : "#64748b" }} />
                            <span className="text-sm font-medium" style={{ color: isActive ? "#fff" : "#94a3b8" }}>
                              {lesson.order}. {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="flex items-center gap-1 text-xs text-[#64748b]">
                              <Clock size={11} /> {lesson.estimatedMinutes}m
                            </span>
                            {isActive ? (
                              <ChevronDown size={14} className="text-[#64748b]" />
                            ) : (
                              <ChevronRight size={14} className="text-[#64748b]" />
                            )}
                          </div>
                        </button>
                        {isActive && <LessonPanel lesson={lesson} topicColor={topicColor} />}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-[#64748b] px-2 py-2">Lessons coming soon.</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
