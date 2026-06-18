"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Clock, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import QuestionCard from "@/components/test/QuestionCard";
import { api, ApiError } from "@/lib/api";
import type { Question } from "@/types";

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
};

export default function PlacementPage() {
  const router = useRouter();
  const { user, fetchMe } = useAuthStore();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.placementDone && !done) router.replace("/student/dashboard");
  }, [done, router, user]);

  // Start (or resume) the diagnostic attempt.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.diagnostic
      .start()
      .then((res) => {
        if (cancelled) return;
        setAttemptId(Number(res.id));
        return api.diagnostic.getQuestions(res.id);
      })
      .then((qs) => {
        if (cancelled || !qs) return;
        setQuestions(qs);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError("No diagnostic test is currently available. Please contact the admin.");
          } else if (err.status === 422) {
            setError(err.message || "Not enough diagnostic questions are available for your class.");
          } else {
            setError(err.message);
          }
        } else {
          setError("Could not load the diagnostic test.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const submitDiagnostic = useCallback(
    async (finalAnswers: Record<string, number | null>) => {
      if (attemptId == null) return;
      try {
        const result = await api.diagnostic.submit(attemptId, finalAnswers);
        // The backend updated the user's profile (placementDone, abilityLevel, etc.).
        // Pull the fresh user to keep the in-memory store in sync.
        try {
          await fetchMe();
        } catch {
          /* even if /me fails, the placementDone flag is updated on the server */
        }
        setDone(true);
        // Brief delay so the success state is visible.
        setTimeout(() => router.replace("/student/dashboard"), 1800);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Could not submit your answers. Please try again.");
        }
      }
    },
    [attemptId, fetchMe, router]
  );

  const handleNext = useCallback(
    (force = false) => {
      if (!currentQuestion) return;
      if (selectedOption === null && !force) return;
      // Map displayed index → backend option ID (the diagnostic grader
      // matches against `question_options.id`, not the array index).
      const optionId =
        selectedOption === null
          ? null
          : Number(currentQuestion.answerOptions?.[selectedOption]?.id ?? NaN);
      const nextAnswers =
        selectedOption === null || Number.isNaN(optionId)
          ? answers
          : { ...answers, [currentQuestion.id]: optionId };
      setAnswers(nextAnswers);
      setSelectedOption(null);

      if (isLastQuestion) {
        submitDiagnostic(nextAnswers);
      } else {
        const nextStep = currentStep + 1;
        const nextQuestion = questions[nextStep];
        setCurrentStep(nextStep);
        // Restore selected option index from the stored option ID (if any).
        let resumeIdx: number | null = null;
        if (nextQuestion && nextAnswers[nextQuestion.id] != null) {
          const stored = nextAnswers[nextQuestion.id];
          resumeIdx =
            nextQuestion.answerOptions?.findIndex((opt) => String(opt.id) === String(stored)) ?? -1;
          if (resumeIdx === -1) resumeIdx = null;
        }
        setSelectedOption(resumeIdx);
        setTimeLeft(nextQuestion?.timeLimitSeconds ?? 90);
      }
    },
    [answers, currentQuestion, currentStep, isLastQuestion, questions, selectedOption, submitDiagnostic]
  );

  useEffect(() => {
    if (!started || !currentQuestion || done) return;
    const timer = window.setTimeout(() => {
      if (timeLeft <= 1) handleNext(true);
      else setTimeLeft((value) => value - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [currentQuestion, done, handleNext, started, timeLeft]);

  if (!user || (user.placementDone && !done)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl bg-white border border-slate-200 p-8 text-center" style={cardStyle}>
          <ClipboardList size={34} className="text-[#d97706] mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-slate-900">Diagnostic unavailable</h1>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full gradient-orange flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#d97706]/25">
            <CheckCircle2 size={34} className="text-white" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">All done</h2>
          <p className="text-slate-500 text-sm leading-relaxed">Your learning path has been personalised. Taking you to your dashboard.</p>
          <div className="mt-5 w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1.5 bg-linear-to-r from-[#d97706] via-[#f59e0b] to-[#fcd34d]" />
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#d97706]/25">
              <CheckCircle2 size={28} className="text-white" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">Diagnostic Test</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-2">
              Welcome, <span className="font-semibold text-slate-700">{user.name}</span>.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Answer {questions.length} questions so your practice feed can match your current preparation level.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { num: String(questions.length), label: "Questions" },
                { num: "1", label: "Attempt" },
                { num: "Personalised", label: "Result" },
              ].map(({ num, label }) => (
                <div key={label} className="bg-slate-50 rounded-xl px-3 py-3 border border-slate-100">
                  <p className="font-heading font-extrabold text-xl gradient-text-orange leading-none">{num}</p>
                  <p className="text-xs text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const first = questions[0];
                let resumeIdx: number | null = null;
                if (first && answers[first.id] != null) {
                  const stored = answers[first.id];
                  resumeIdx =
                    first.answerOptions?.findIndex((opt) => String(opt.id) === String(stored)) ?? -1;
                  if (resumeIdx === -1) resumeIdx = null;
                }
                setSelectedOption(resumeIdx);
                setTimeLeft(first?.timeLimitSeconds ?? 90);
                setStarted(true);
              }}
              className="w-full gradient-orange text-white font-semibold py-3.5 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2 shadow-md shadow-[#d97706]/20"
            >
              Begin Test <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#d97706] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-4">
        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between" style={cardStyle}>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Question {currentStep + 1} of {questions.length}</p>
            <div className="mt-2 h-1.5 w-48 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full bg-linear-to-r from-[#d97706] to-[#f59e0b]" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Clock size={15} className="text-[#d97706]" />
            {timeLeft}s
          </div>
        </div>

        <QuestionCard question={currentQuestion} selectedOption={selectedOption} onSelect={setSelectedOption} />

        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-end" style={cardStyle}>
          <button type="button" onClick={() => handleNext(false)} disabled={selectedOption === null} className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100">
            {isLastQuestion ? "Submit" : "Save & Next"} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
