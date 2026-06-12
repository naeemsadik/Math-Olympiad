"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Clock, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useDiagnosticStore } from "@/store/diagnosticStore";
import { useQuestionStore } from "@/store/questionStore";
import { useTestStore } from "@/store/testStore";
import { useUsersStore } from "@/store/usersStore";
import QuestionCard from "@/components/test/QuestionCard";
import {
  ALL_CLASS_YEARS,
  determineAbility,
  pickRandomIds,
  questionMatchesClass,
  testMatchesClass,
} from "@/lib/diagnostic";
import type { DiagnosticAttempt, Question } from "@/types";

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
};

export default function PlacementPage() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { users, updateUser } = useUsersStore();
  const { tests } = useTestStore();
  const { questions } = useQuestionStore();
  const { attempts, startAttempt, submitAttempt } = useDiagnosticStore();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.placementDone && !done) router.replace("/dashboard");
  }, [done, router, user]);

  const diagnosticTest = useMemo(() => {
    if (!user) return undefined;
    const publishedDiagnostics = tests.filter((test) => test.testType === "diagnostic" && test.isPublic);
    return (
      publishedDiagnostics.find((test) => test.targetClassYear === user.classYear) ??
      publishedDiagnostics.find((test) => test.targetClassYear === ALL_CLASS_YEARS || testMatchesClass(test, user.classYear))
    );
  }, [tests, user]);

  const attemptUserId = user?.email ?? "";
  const activeAttempt = useMemo(
    () => attempts.find((attempt) => attempt.userId === attemptUserId && attempt.status === "in-progress"),
    [attemptUserId, attempts]
  );

  const eligibleQuestionIds = useMemo(() => {
    if (!diagnosticTest || !user) return [];
    const pool = new Set(diagnosticTest.questionIds ?? []);
    return questions
      .filter((question) => pool.has(question.id))
      .filter((question) => question.status !== "draft" && question.isDiagnosticEligible)
      .filter((question) => questionMatchesClass(question, user.classYear))
      .map((question) => question.id);
  }, [diagnosticTest, questions, user]);

  useEffect(() => {
    if (!user || user.placementDone || !diagnosticTest || activeAttempt) return;
    const drawCount = diagnosticTest.randomQuestionCount ?? 10;
    if (eligibleQuestionIds.length < drawCount) return;

    const attempt: DiagnosticAttempt = {
      id: `diag-${Date.now()}`,
      userId: user.email,
      testId: diagnosticTest.id,
      testTitle: diagnosticTest.title,
      questionIds: pickRandomIds(eligibleQuestionIds, drawCount),
      answers: {},
      status: "in-progress",
      startedAt: new Date().toISOString(),
    };
    startAttempt(attempt);
  }, [activeAttempt, diagnosticTest, eligibleQuestionIds, startAttempt, user]);

  const attemptQuestions = useMemo(() => {
    if (!activeAttempt) return [];
    return activeAttempt.questionIds
      .map((id) => questions.find((question) => question.id === id))
      .filter((question): question is Question => Boolean(question));
  }, [activeAttempt, questions]);

  const currentQuestion = attemptQuestions[currentStep];
  const isLastQuestion = currentStep === attemptQuestions.length - 1;

  const submitDiagnostic = useCallback(
    (finalAnswers: Record<string, number>) => {
      if (!activeAttempt || !diagnosticTest || !user) return;
      const correctCount = attemptQuestions.reduce((total, question) => {
        const selected = finalAnswers[question.id];
        const correctIndex = question.answerOptions?.findIndex((option) => option.isCorrect) ?? question.correctOption;
        return total + (selected === correctIndex ? 1 : 0);
      }, 0);
      const score = Math.round((correctCount / Math.max(1, attemptQuestions.length)) * 100);
      const abilityLevel = determineAbility(score, diagnosticTest.advancedThreshold, diagnosticTest.expertThreshold);
      const submittedAt = new Date().toISOString();

      submitAttempt(activeAttempt.id, {
        answers: finalAnswers,
        correctCount,
        score,
        abilityLevel,
        submittedAt,
      });

      const diagnosticProfile = {
        placementDone: true,
        diagnosticAbilityLevel: abilityLevel,
        diagnosticScore: score,
        diagnosticCompletedAt: submittedAt,
        diagnosticAttemptId: activeAttempt.id,
      };
      updateProfile(diagnosticProfile);

      const adminUser = users.find((item) => item.email.toLowerCase() === user.email.toLowerCase());
      if (adminUser) updateUser(adminUser.id, diagnosticProfile);

      setDone(true);
      setTimeout(() => router.replace("/dashboard"), 1800);
    },
    [activeAttempt, attemptQuestions, diagnosticTest, router, submitAttempt, updateProfile, updateUser, user, users]
  );

  const handleNext = useCallback(
    (force = false) => {
      if (!currentQuestion) return;
      if (selectedOption === null && !force) return;
      const nextAnswers = selectedOption === null ? answers : { ...answers, [currentQuestion.id]: selectedOption };
      setAnswers(nextAnswers);
      setSelectedOption(null);

      if (isLastQuestion) {
        submitDiagnostic(nextAnswers);
      } else {
        const nextStep = currentStep + 1;
        const nextQuestion = attemptQuestions[nextStep];
        setCurrentStep(nextStep);
        setSelectedOption(nextQuestion ? nextAnswers[nextQuestion.id] ?? null : null);
        setTimeLeft(nextQuestion?.timeLimitSeconds ?? 90);
      }
    },
    [answers, attemptQuestions, currentQuestion, currentStep, isLastQuestion, selectedOption, submitDiagnostic]
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

  if (!diagnosticTest) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl bg-white border border-slate-200 p-8 text-center" style={cardStyle}>
          <ClipboardList size={34} className="text-[#d97706] mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-slate-900">Diagnostic is not ready</h1>
          <p className="text-sm text-slate-500 mt-2">An admin needs to publish a diagnostic test for your class before you can continue.</p>
        </div>
      </div>
    );
  }

  const drawCount = diagnosticTest.randomQuestionCount ?? 10;
  if (!activeAttempt && eligibleQuestionIds.length < drawCount) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl bg-white border border-slate-200 p-8 text-center" style={cardStyle}>
          <ClipboardList size={34} className="text-[#d97706] mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-slate-900">Question pool is incomplete</h1>
          <p className="text-sm text-slate-500 mt-2">This diagnostic needs {drawCount} eligible questions, but only {eligibleQuestionIds.length} are available for your class.</p>
        </div>
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
              Answer {activeAttempt?.questionIds.length ?? drawCount} questions so your practice feed can match your current preparation level.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { num: String(activeAttempt?.questionIds.length ?? drawCount), label: "Questions" },
                { num: `${diagnosticTest.duration}`, label: "Minutes" },
                { num: "1", label: "Attempt" },
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
                setSelectedOption(attemptQuestions[0] ? answers[attemptQuestions[0].id] ?? null : null);
                setTimeLeft(attemptQuestions[0]?.timeLimitSeconds ?? 90);
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
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Question {currentStep + 1} of {attemptQuestions.length}</p>
            <div className="mt-2 h-1.5 w-48 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full bg-linear-to-r from-[#d97706] to-[#f59e0b]" style={{ width: `${((currentStep + 1) / attemptQuestions.length) * 100}%` }} />
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
