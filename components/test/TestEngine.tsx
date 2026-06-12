"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronRight, Clock, ShieldCheck } from "lucide-react";
import type { PracticeAttempt, Question, Test } from "@/types";
import { formatDuration, shuffleOnce, sumQuestionTimeSeconds } from "@/lib/diagnostic";
import { useAuthStore } from "@/store/authStore";
import { usePracticeAttemptStore } from "@/store/practiceAttemptStore";
import QuestionCard from "./QuestionCard";

interface Props {
  test: Test;
  questions: Question[];
}

const cardStyle = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.07)",
  boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
};

function buildDeadline(question: Question) {
  const startedAt = new Date();
  const deadline = new Date(startedAt.getTime() + (question.timeLimitSeconds ?? 90) * 1000);
  return {
    currentQuestionStartedAt: startedAt.toISOString(),
    currentQuestionDeadline: deadline.toISOString(),
  };
}

export default function TestEngine({ test, questions }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { attempts, startAttempt, saveAnswer, advanceQuestion, submitAttempt } = usePracticeAttemptStore();
  const [started, setStarted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const questionMap = useMemo(() => new Map(questions.map((question) => [question.id, question])), [questions]);
  const userId = user?.email ?? "guest";
  const activeAttempt = attempts.find(
    (attempt) => attempt.userId === userId && attempt.testId === test.id && attempt.status === "in-progress"
  );
  const orderedQuestions = useMemo(() => {
    if (!activeAttempt) return [];
    return activeAttempt.questionIds
      .map((id) => questionMap.get(id))
      .filter((question): question is Question => Boolean(question));
  }, [activeAttempt, questionMap]);

  const currentQuestion = activeAttempt ? orderedQuestions[activeAttempt.currentIndex] : undefined;
  const totalSeconds = sumQuestionTimeSeconds(questions);
  const remainingSeconds = activeAttempt
    ? Math.max(0, Math.ceil((new Date(activeAttempt.currentQuestionDeadline).getTime() - now) / 1000))
    : 0;
  const selectedOption = currentQuestion && activeAttempt ? activeAttempt.answers[currentQuestion.id] ?? null : null;
  const progressText = activeAttempt ? `${Math.min(activeAttempt.currentIndex + 1, orderedQuestions.length)} of ${orderedQuestions.length}` : `0 of ${questions.length}`;

  const finishAttempt = useCallback(
    (attempt: PracticeAttempt) => {
      submitAttempt(attempt.id, new Date().toISOString());
      router.push(`/student/tests/${test.id}/result`);
    },
    [router, submitAttempt, test.id]
  );

  const moveNext = useCallback(
    (attempt: PracticeAttempt) => {
      const nextIndex = attempt.currentIndex + 1;
      const nextQuestion = orderedQuestions[nextIndex];
      if (!nextQuestion) {
        finishAttempt(attempt);
        return;
      }
      advanceQuestion(attempt.id, {
        currentIndex: nextIndex,
        ...buildDeadline(nextQuestion),
      });
      setNow(Date.now());
    },
    [advanceQuestion, finishAttempt, orderedQuestions]
  );

  const startStrictAttempt = () => {
    if (!questions.length) return;
    if (activeAttempt) {
      setStarted(true);
      setNow(Date.now());
      return;
    }

    const orderedIds = shuffleOnce(questions.map((question) => question.id));
    const firstQuestion = questionMap.get(orderedIds[0]);
    if (!firstQuestion) return;
    const attempt: PracticeAttempt = {
      id: `practice-${Date.now()}`,
      userId,
      testId: test.id,
      testTitle: test.title,
      questionIds: orderedIds,
      currentIndex: 0,
      answers: {},
      status: "in-progress",
      startedAt: new Date().toISOString(),
      ...buildDeadline(firstQuestion),
    };
    startAttempt(attempt);
    setStarted(true);
    setNow(Date.now());
  };

  const handleSelect = (optionIndex: number) => {
    if (!activeAttempt || !currentQuestion) return;
    saveAnswer(activeAttempt.id, currentQuestion.id, optionIndex);
  };

  const handleNext = () => {
    if (!activeAttempt) return;
    moveNext(activeAttempt);
  };

  const handleBlockedEvent = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (!started || !activeAttempt || !currentQuestion) return;
    const id = window.setTimeout(() => {
      const deadline = new Date(activeAttempt.currentQuestionDeadline).getTime();
      const nextNow = Date.now();
      setNow(nextNow);
      if (nextNow >= deadline) moveNext(activeAttempt);
    }, 250);
    return () => window.clearTimeout(id);
  }, [activeAttempt, currentQuestion, moveNext, now, started]);

  if (!questions.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p className="text-sm text-slate-500">No questions are available for this test yet.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl bg-white p-8" style={cardStyle}>
          <div className="w-14 h-14 rounded-2xl gradient-orange flex items-center justify-center text-white mb-5 shadow-lg shadow-[#d97706]/25">
            <ShieldCheck size={26} />
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">{test.title}</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{test.description}</p>
          <div className="grid sm:grid-cols-3 gap-3 my-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <BookOpen size={16} className="text-[#d97706] mb-2" />
              <p className="text-lg font-bold text-slate-900">{questions.length}</p>
              <p className="text-xs text-slate-500">Questions</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <Clock size={16} className="text-[#d97706] mb-2" />
              <p className="text-lg font-bold text-slate-900">{formatDuration(totalSeconds)}</p>
              <p className="text-xs text-slate-500">Total time</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <ShieldCheck size={16} className="text-[#d97706] mb-2" />
              <p className="text-lg font-bold text-slate-900">One-way</p>
              <p className="text-xs text-slate-500">No backtracking</p>
            </div>
          </div>
          <p className="rounded-xl border border-[#d97706]/20 bg-[#d97706]/8 px-4 py-3 text-sm text-slate-600">
            Questions will appear once in a random order. Each question has its own timer, and unused time will not carry forward.
          </p>
          <button
            type="button"
            onClick={startStrictAttempt}
            className="mt-6 w-full gradient-orange text-white font-semibold py-3.5 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-sm flex items-center justify-center gap-2"
          >
            {activeAttempt ? "Resume Test" : "Start Test"} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (!activeAttempt || !currentQuestion) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p className="text-sm text-slate-500">Preparing your test attempt.</p>
      </div>
    );
  }

  return (
    <div
      className="select-none space-y-4"
      style={{ userSelect: "none" }}
      onCopy={handleBlockedEvent}
      onCut={handleBlockedEvent}
      onContextMenu={handleBlockedEvent}
      onDragStart={handleBlockedEvent}
    >
      <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-4" style={cardStyle}>
        <div className="min-w-0">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Question {progressText}</p>
          <div className="mt-2 h-1.5 w-52 max-w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#d97706] to-[#f59e0b]"
              style={{ width: `${((activeAttempt.currentIndex + 1) / orderedQuestions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-400">Total calculated time</p>
            <p className="text-sm font-semibold text-slate-700">{formatDuration(totalSeconds)}</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-mono font-bold ${remainingSeconds <= 10 ? "bg-red-50 border border-red-200 text-red-600" : "bg-[#d97706]/10 border border-[#d97706]/20 text-[#92400e]"}`}>
            <Clock size={15} />
            {formatDuration(remainingSeconds)}
          </div>
        </div>
      </div>

      <QuestionCard question={currentQuestion} selectedOption={selectedOption} onSelect={handleSelect} />

      <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-3" style={cardStyle}>
        <p className="text-xs text-slate-400">Once you continue, this question cannot be opened again.</p>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 gradient-orange text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:scale-105 transition-all"
        >
          {activeAttempt.currentIndex === orderedQuestions.length - 1 ? "Submit" : "Next"} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
