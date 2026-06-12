"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AbilityLevel, DiagnosticAttempt } from "@/types";

interface DiagnosticState {
  attempts: DiagnosticAttempt[];
  startAttempt: (attempt: DiagnosticAttempt) => void;
  submitAttempt: (
    id: string,
    data: {
      answers: Record<string, number>;
      correctCount: number;
      score: number;
      abilityLevel: AbilityLevel;
      submittedAt: string;
    }
  ) => void;
  resetUserAttempts: (userId: string) => void;
}

export const useDiagnosticStore = create<DiagnosticState>()(
  persist(
    (set) => ({
      attempts: [],
      startAttempt: (attempt) =>
        set((state) => ({
          attempts: [attempt, ...state.attempts.filter((item) => item.id !== attempt.id)],
        })),
      submitAttempt: (id, data) =>
        set((state) => ({
          attempts: state.attempts.map((attempt) =>
            attempt.id === id
              ? {
                  ...attempt,
                  ...data,
                  status: "submitted",
                }
              : attempt
          ),
        })),
      resetUserAttempts: (userId) =>
        set((state) => ({
          attempts: state.attempts.filter((attempt) => attempt.userId !== userId),
        })),
    }),
    {
      name: "uiu-diagnostic-attempts",
      version: 1,
    }
  )
);
