"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Test, Question, QuestionState } from "@/types";
import { Flag, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Timer from "./Timer";
import QuestionCard from "./QuestionCard";
import QuestionPalette from "./QuestionPalette";

interface Props {
  test: Test;
  questions: Question[];
}

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
};

export default function TestEngine({ test, questions }: Props) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [states, setStates] = useState<Record<string, QuestionState>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, "unanswered"]))
  );
  const [submitted, setSubmitted] = useState(false);

  const currentQ = questions[currentIdx];

  const selectAnswer = (qId: string, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setStates((prev) => ({ ...prev, [qId]: "answered" }));
  };

  const toggleMark = () => {
    if (!currentQ) return;
    setStates((prev) => ({
      ...prev,
      [currentQ.id]:
        prev[currentQ.id] === "marked"
          ? answers[currentQ.id] !== undefined ? "answered" : "unanswered"
          : "marked",
    }));
  };

  const clearResponse = () => {
    if (!currentQ) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
    setStates((prev) => ({ ...prev, [currentQ.id]: "unanswered" }));
  };

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    router.push(`/tests/${test.id}/result`);
  }, [router, test.id]);

  useEffect(() => {
    if (submitted) return;
  }, [submitted]);

  const answeredCount = Object.values(states).filter((s) => s === "answered").length;
  const markedCount = Object.values(states).filter((s) => s === "marked").length;

  if (!questions.length || !currentQ) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p className="text-sm text-slate-500">No questions are available for this test yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 -m-6 p-6">
      {/* Left: Question area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top bar */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between" style={cardStyle}>
          <div className="text-sm text-slate-500">
            <span className="text-slate-900 font-semibold">QUESTION: NUMBER THEORY</span>
            <span className="mx-2 text-slate-300">›</span>
            <span>Question {currentIdx + 1}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMark}
              className={cn(
                "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors",
                states[currentQ.id] === "marked"
                  ? "bg-[#f59e0b]/15 border-[#f59e0b]/35 text-[#f59e0b]"
                  : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800"
              )}
            >
              <Flag size={12} /> MARK FOR REVIEW
            </button>
            <Timer durationMinutes={test.duration} onExpire={handleSubmit} />
          </div>
        </div>

        {/* Question card */}
        <QuestionCard
          question={currentQ}
          selectedOption={answers[currentQ.id] ?? null}
          onSelect={(idx) => selectAnswer(currentQ.id, idx)}
        />

        {/* Navigation */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between" style={cardStyle}>
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => i - 1)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div className="flex items-center gap-3">
            <button onClick={clearResponse} className="flex items-center gap-1.5 text-xs text-[#f59e0b] hover:text-[#d97706] transition-colors font-semibold">
              <RotateCcw size={12} /> Clear Response
            </button>
            <button
              onClick={() => {
                if (answers[currentQ.id] !== undefined) {
                  setStates((prev) => ({ ...prev, [currentQ.id]: "answered" }));
                }
                setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
              }}
              className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all"
            >
              Save &amp; Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Palette */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
        <QuestionPalette
          questions={questions}
          states={states}
          currentIdx={currentIdx}
          onJump={setCurrentIdx}
        />

        {/* Summary */}
        <div className="bg-white rounded-xl p-4 space-y-2 text-sm" style={cardStyle}>
          {[
            { label: "Answered", count: answeredCount, color: "#10b981" },
            { label: "Marked", count: markedCount, color: "#f59e0b" },
            { label: "Unvisited", count: questions.length - answeredCount - markedCount, color: "#64748b" },
            { label: "Not Answered", count: questions.length - answeredCount, color: "#ef4444" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-slate-600 font-medium">{label}</span>
              </div>
              <span className="text-slate-900 font-bold">{count}</span>
            </div>
          ))}
        </div>

        {/* Student + Submit */}
        <div className="bg-white rounded-xl p-4" style={cardStyle}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-amber-500/20">
              R
            </div>
            <div>
              <p className="text-sm text-slate-900 font-semibold">Rahat Ahmed</p>
              <p className="text-xs text-slate-400">Level: Grandmaster</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full gradient-orange glow-orange text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition-all text-sm tracking-wide"
          >
            FINAL SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
