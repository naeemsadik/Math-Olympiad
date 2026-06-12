"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PracticeAttempt } from "@/types";

interface PracticeAttemptState {
  attempts: PracticeAttempt[];
  startAttempt: (attempt: PracticeAttempt) => void;
  saveAnswer: (attemptId: string, questionId: string, optionIndex: number) => void;
  advanceQuestion: (
    attemptId: string,
    data: {
      currentIndex: number;
      currentQuestionStartedAt: string;
      currentQuestionDeadline: string;
    }
  ) => void;
  submitAttempt: (attemptId: string, submittedAt: string) => void;
}

export const usePracticeAttemptStore = create<PracticeAttemptState>()(
  persist(
    (set) => ({
      attempts: [],
      startAttempt: (attempt) =>
        set((state) => ({
          attempts: [attempt, ...state.attempts.filter((item) => item.id !== attempt.id)],
        })),
      saveAnswer: (attemptId, questionId, optionIndex) =>
        set((state) => ({
          attempts: state.attempts.map((attempt) =>
            attempt.id === attemptId
              ? { ...attempt, answers: { ...attempt.answers, [questionId]: optionIndex } }
              : attempt
          ),
        })),
      advanceQuestion: (attemptId, data) =>
        set((state) => ({
          attempts: state.attempts.map((attempt) =>
            attempt.id === attemptId ? { ...attempt, ...data } : attempt
          ),
        })),
      submitAttempt: (attemptId, submittedAt) =>
        set((state) => ({
          attempts: state.attempts.map((attempt) =>
            attempt.id === attemptId ? { ...attempt, status: "submitted", submittedAt } : attempt
          ),
        })),
    }),
    {
      name: "uiu-practice-attempts",
      version: 1,
    }
  )
);
