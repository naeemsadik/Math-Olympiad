"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { placementQuestions } from "@/lib/mock/placement";
import type { Tier } from "@/types";

// Advanced = canonical indices 6,7,8 — Intermediate = 3,4,5
function calculateTier(answers: Record<number, number>): Tier {
  let adv = 0, inter = 0;
  for (const i of [6, 7, 8]) {
    if (answers[i] !== undefined && answers[i] === placementQuestions[i].correctOption) adv++;
  }
  for (const i of [3, 4, 5]) {
    if (answers[i] !== undefined && answers[i] === placementQuestions[i].correctOption) inter++;
  }
  if (adv >= 2)   return "Advanced";
  if (inter >= 2) return "Intermediate";
  return "Beginner";
}

function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function PlacementPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
    setShuffledIndices(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]));
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!user) { router.replace("/login"); return; }
    if (user.placementDone) router.replace("/dashboard");
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (user.placementDone) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  const canonicalIdx = shuffledIndices[currentStep] ?? 0;
  const question = placementQuestions[canonicalIdx];
  const isLastQuestion = currentStep === 8;

  const handleNext = () => {
    if (selectedOption === null) return;
    const newAnswers = { ...answers, [canonicalIdx]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (isLastQuestion) {
      const tier = calculateTier(newAnswers);
      updateProfile({ tier, placementDone: true });
      setDone(true);
      setTimeout(() => router.replace("/dashboard"), 2200);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  // ── Completion screen ────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full gradient-orange flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#d97706]/25"
          >
            <Sparkles size={32} className="text-white" />
          </motion.div>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">All done!</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your learning path has been personalised. Taking you to your dashboard…
          </p>
          <div className="mt-5 w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  // ── Intro screen ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-linear-to-r from-[#d97706] via-[#f59e0b] to-[#fcd34d]" />
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#d97706]/25">
                <CheckCircle2 size={28} className="text-white" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">
                Quick Placement Quiz
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-2">
                Welcome, <span className="font-semibold text-slate-700">{user.name}</span>!
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Answer <strong>9 short questions</strong> to personalise your learning path.
                There are no right or wrong labels — just answer honestly and we&apos;ll set
                up the right content for you.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { num: "9", label: "Questions" },
                  { num: "~5", label: "Minutes" },
                  { num: "1×", label: "Attempt" },
                ].map(({ num, label }) => (
                  <div key={label} className="bg-slate-50 rounded-xl px-3 py-3 border border-slate-100">
                    <p className="font-heading font-extrabold text-xl gradient-text-orange leading-none">{num}</p>
                    <p className="text-xs text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="w-full gradient-orange text-white font-semibold py-3.5 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-[#d97706]/20"
              >
                Begin Quiz <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Question screen ──────────────────────────────────────────────────────
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">
              Question {currentStep + 1} of 9
            </span>
            <span className="text-xs text-slate-400">{Math.round((currentStep / 9) * 100)}% complete</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-[#d97706] to-[#f59e0b]"
              animate={{ width: `${(currentStep / 9) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-linear-to-r from-[#d97706] via-[#f59e0b] to-[#fcd34d]" />
              <div className="p-6 sm:p-8">
                {/* Question */}
                <div className="mb-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                    Question {currentStep + 1}
                  </p>
                  <p className="text-base font-semibold text-slate-800 leading-relaxed">
                    {question?.content}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5 mb-6">
                  {question?.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedOption(idx)}
                        whileHover={{ scale: 1.015, y: -1 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 flex items-center gap-3"
                        style={{
                          border: `2px solid ${isSelected ? "#d97706" : "#e2e8f0"}`,
                          backgroundColor: isSelected ? "rgba(217,119,6,0.07)" : "transparent",
                          color: isSelected ? "#92400e" : "#475569",
                        }}
                      >
                        <span
                          className="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            backgroundColor: isSelected ? "#d97706" : "#f1f5f9",
                            color: isSelected ? "white" : "#94a3b8",
                          }}
                        >
                          {OPTION_LABELS[idx]}
                        </span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Next / Submit */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className="w-full gradient-orange text-white font-semibold py-3 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 text-sm flex items-center justify-center gap-2 shadow-md shadow-[#d97706]/20"
                >
                  {isLastQuestion ? (
                    <><Sparkles size={15} /> Submit &amp; Finish</>
                  ) : (
                    <>Next <ChevronRight size={15} /></>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
