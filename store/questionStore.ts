"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "@/types";
import { sampleQuestions } from "@/lib/mock/tests";
import { placementQuestions } from "@/lib/mock/placement";
import { normalizeQuestion } from "@/lib/diagnostic";

const seedQuestions = [...sampleQuestions, ...placementQuestions].map((question) =>
  normalizeQuestion({
    ...question,
    isDiagnosticEligible: true,
    status: "published",
  })
);

interface QuestionState {
  questions: Question[];
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, data: Partial<Question>) => void;
  removeQuestion: (id: string) => void;
}

export const useQuestionStore = create<QuestionState>()(
  persist(
    (set) => ({
      questions: seedQuestions,
      addQuestion: (question) =>
        set((state) => ({
          questions: [normalizeQuestion(question), ...state.questions],
        })),
      updateQuestion: (id, data) =>
        set((state) => ({
          questions: state.questions.map((question) =>
            question.id === id ? normalizeQuestion({ ...question, ...data }) : question
          ),
        })),
      removeQuestion: (id) =>
        set((state) => ({
          questions: state.questions.filter((question) => question.id !== id),
        })),
    }),
    {
      name: "uiu-question-bank",
      version: 1,
      migrate: (persisted: unknown) => {
        const old = persisted as { questions?: Question[] } | undefined;
        return {
          questions: (old?.questions?.length ? old.questions : seedQuestions).map(normalizeQuestion),
        };
      },
    }
  )
);
