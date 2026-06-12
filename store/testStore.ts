"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Test } from "@/types";
import { tests as mockTests, sampleQuestions } from "@/lib/mock/tests";
import { placementQuestions } from "@/lib/mock/placement";
import { ALL_CLASS_YEARS, normalizeTest } from "@/lib/diagnostic";

const seedQuestionIds = [...sampleQuestions, ...placementQuestions].map((question) => question.id);

const seedTests: Test[] = [
  normalizeTest({
    id: "diagnostic-default",
    title: "Diagnostic Placement Test",
    description: "A class-aware diagnostic used after signup to personalize the student question feed.",
    duration: 15,
    difficulty: "Advanced",
    tier: "Beginner",
    topicId: "mixed",
    questionCount: 10,
    isPublic: true,
    source: "Admin Diagnostic Pool",
    tags: ["diagnostic", "placement"],
    testType: "diagnostic",
    targetClassYear: ALL_CLASS_YEARS,
    abilityLevel: "Beginner",
    questionIds: seedQuestionIds,
    randomQuestionCount: 10,
    advancedThreshold: 50,
    expertThreshold: 80,
  } as Test),
  ...mockTests.map((test): Test =>
    normalizeTest({
      ...test,
      testType: "practice",
      targetClassYear: ALL_CLASS_YEARS,
      questionIds: sampleQuestions.filter((question) => question.topicId === test.topicId).map((question) => question.id),
    })
  ),
];

interface TestsState {
  tests: Test[];
  addTest: (test: Test) => void;
  updateTest: (id: string, data: Partial<Test>) => void;
  removeTest: (id: string) => void;
}

export const useTestStore = create<TestsState>()(
  persist(
    (set) => ({
      tests: seedTests,
      addTest: (test) =>
        set((state) => ({
          tests: [normalizeTest(test), ...state.tests],
        })),
      updateTest: (id, data) =>
        set((state) => ({
          tests: state.tests.map((test) => (test.id === id ? normalizeTest({ ...test, ...data }) : test)),
        })),
      removeTest: (id) =>
        set((state) => ({
          tests: state.tests.filter((test) => test.id !== id),
        })),
    }),
    {
      name: "uiu-tests",
      version: 1,
      migrate: (persisted: unknown) => {
        const old = persisted as { tests?: Test[] } | undefined;
        return {
          tests: (old?.tests?.length ? old.tests : seedTests).map(normalizeTest),
        };
      },
    }
  )
);
