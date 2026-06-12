"use client";

import { useState } from "react";
import { puzzlesByTier } from "@/lib/mock/puzzle";
import { Flame, Clock, ChevronRight, X, CheckCircle, Trophy } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { Tier } from "@/types";

const tierColors: Record<Tier, string> = {
  Beginner: "#10b981",
  Intermediate: "#f59e0b",
  Advanced: "#d97706",
};

interface PuzzleResult {
  id: string;
  title: string;
  topic: string;
  date: string;
  submittedAt: string;
  answerSnippet: string;
}

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05), 0 0 0 1px rgba(15,23,42,0.03)",
};

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#d97706]/50 focus:ring-2 focus:ring-[#d97706]/10 transition-all resize-none";

export default function DailyPuzzlePage() {
  const { user } = useAuthStore();
  const userTier = user?.tier ?? "Beginner";
  const puzzle = puzzlesByTier[userTier];
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [attemptPuzzle, setAttemptPuzzle] = useState<(typeof puzzle.previousPuzzles)[0] | null>(null);
  const [prevAnswer, setPrevAnswer] = useState("");
  const [prevSubmitted, setPrevSubmitted] = useState(false);

  const [results, setResults] = useState<PuzzleResult[]>([]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmitted(true);
    setResults((prev) => [
      {
        id: puzzle.id,
        title: `Today's Puzzle (${puzzle.topic})`,
        topic: puzzle.topic,
        date: puzzle.date,
        submittedAt: new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" }),
        answerSnippet: answer.trim().slice(0, 60) + (answer.length > 60 ? "…" : ""),
      },
      ...prev,
    ]);
  };

  const openAttempt = (p: (typeof puzzle.previousPuzzles)[0]) => {
    setAttemptPuzzle(p);
    setPrevAnswer("");
    setPrevSubmitted(false);
  };

  const submitPrevAttempt = () => {
    if (!prevAnswer.trim() || !attemptPuzzle) return;
    setPrevSubmitted(true);
    setResults((prev) => [
      {
        id: attemptPuzzle.id,
        title: attemptPuzzle.title,
        topic: attemptPuzzle.topic,
        date: attemptPuzzle.date,
        submittedAt: new Date().toLocaleTimeString("en-BD", { hour: "2-digit", minute: "2-digit" }),
        answerSnippet: prevAnswer.trim().slice(0, 60) + (prevAnswer.length > 60 ? "…" : ""),
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Previous Puzzle Attempt Modal */}
      {attemptPuzzle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl shadow-slate-900/20" style={{ border: "1px solid rgba(15,23,42,0.08)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">{attemptPuzzle.topic} • {attemptPuzzle.date}</p>
                <h3 className="font-heading font-bold text-slate-900 text-lg">{attemptPuzzle.title}</h3>
              </div>
              <button onClick={() => setAttemptPuzzle(null)} className="text-slate-400 hover:text-slate-700 transition-colors shrink-0 mt-1">
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-slate-800 text-sm leading-relaxed">{attemptPuzzle.content}</p>
            </div>

            {!prevSubmitted ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Solution</label>
                  <textarea value={prevAnswer} onChange={(e) => setPrevAnswer(e.target.value)} rows={4} placeholder="Write your solution or proof here..." className={inputCls} />
                </div>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setAttemptPuzzle(null)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                  <button onClick={submitPrevAttempt} disabled={!prevAnswer.trim()} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
                    Submit <ChevronRight size={14} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/25">
                <CheckCircle size={18} className="text-[#10b981] shrink-0" />
                <p className="text-sm text-[#10b981] font-semibold">Solution submitted! It has been sent to the admin for review.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold text-slate-900">Problem of the Day</h1>
          <p className="text-slate-500 text-sm mt-1">{puzzle.date}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full border" style={{ color: tierColors[puzzle.tier], backgroundColor: `${tierColors[puzzle.tier]}12`, borderColor: `${tierColors[puzzle.tier]}35` }}>
            {puzzle.tier}
          </span>
          <div className="flex items-center gap-2 bg-[#f59e0b]/15 border border-[#f59e0b]/25 px-4 py-2 rounded-full">
            <Flame size={15} className="text-[#f59e0b]" />
            <span className="text-[#f59e0b] font-bold text-sm">{puzzle.streakCount} Days</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main puzzle area */}
        <div className="lg:col-span-2 space-y-5">
          {/* Today's Puzzle */}
          <div className="bg-white rounded-2xl p-7" style={cardStyle}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] uppercase border border-[#f59e0b]/25">
                {puzzle.difficulty}
              </span>
              <span className="text-xs text-slate-500 font-medium">{puzzle.topic}</span>
            </div>

            <p className="text-slate-800 text-base leading-relaxed font-medium">{puzzle.content}</p>

            <div className="mt-6 space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Solution</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitted}
                rows={4}
                placeholder="Enter your mathematical proof or answer here..."
                className={inputCls + (submitted ? " opacity-60 cursor-not-allowed" : "")}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-slate-400">Solve correctly to earn 1 point and maintain your streak</p>
              <button onClick={handleSubmit} disabled={!answer.trim() || submitted} className="flex items-center gap-2 gradient-orange glow-orange text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                Submit Solution <ChevronRight size={14} />
              </button>
            </div>

            {submitted && (
              <div className="mt-4 p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/25">
                <p className="text-sm text-[#10b981] font-semibold">✓ Solution submitted! Results will be reviewed by the admin within 24 hours.</p>
              </div>
            )}
          </div>

          {/* Previous Puzzles */}
          <div className="bg-white rounded-2xl p-6" style={cardStyle}>
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Previous Puzzles</h3>
            <div className="space-y-2">
              {puzzle.previousPuzzles.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm text-slate-800 font-semibold">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.topic} • {p.date}</p>
                  </div>
                  <button onClick={() => openAttempt(p)} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg gradient-orange text-white hover:scale-105 transition-all">
                    Attempt <ChevronRight size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* My Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl p-6" style={cardStyle}>
              <h3 className="font-heading font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy size={16} className="text-[#f59e0b]" /> My Submissions
              </h3>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={14} className="text-[#10b981] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-slate-800 font-semibold">{r.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{r.answerSnippet}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{r.submittedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Streak tracker */}
          <div className="bg-white rounded-2xl p-5" style={cardStyle}>
            <h3 className="font-heading font-semibold text-slate-900 mb-3">Streak Status</h3>
            <p className="text-3xl font-heading font-bold text-slate-900">{puzzle.streakCount} <span className="text-lg text-slate-500 font-medium">Days</span></p>
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i < puzzle.streakCount % 7 ? "bg-[#f59e0b]" : "bg-slate-100"}`} />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">Keep solving to maintain your streak!</p>
          </div>

          {/* Top Solvers */}
          <div className="bg-white rounded-2xl p-5" style={cardStyle}>
            <h3 className="font-heading font-semibold text-slate-900 mb-4">Top Solvers Today</h3>
            <div className="space-y-3">
              {puzzle.topSolvers.map((solver, i) => (
                <div key={solver.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#f59e0b] w-4">{i + 1}</span>
                  <div className="w-8 h-8 gradient-orange rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-amber-500/20">
                    {solver.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-semibold">{solver.name}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} /> {solver.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="bg-white rounded-xl p-4 border border-[#d97706]/20" style={{ boxShadow: "0 2px 8px rgba(217, 119, 6,0.06)" }}>
            <p className="text-xs text-slate-500 italic leading-relaxed">
              &ldquo;Mathematics is the most beautiful and most powerful creation of the human spirit.&rdquo;
            </p>
            <p className="text-xs text-slate-400 mt-2">— Stefan Banach</p>
          </div>
        </div>
      </div>
    </div>
  );
}
