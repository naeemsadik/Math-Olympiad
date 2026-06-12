"use client";

import { useParams } from "next/navigation";
import TestEngine from "@/components/test/TestEngine";
import { useQuestionStore } from "@/store/questionStore";
import { useTestStore } from "@/store/testStore";
import { abilityAllows, questionMatchesClass } from "@/lib/diagnostic";
import { useAuthStore } from "@/store/authStore";

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const { tests } = useTestStore();
  const { questions } = useQuestionStore();
  const { user } = useAuthStore();
  const test = tests.find((item) => item.id === id && item.testType !== "diagnostic");

  if (!test) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <p className="text-sm text-slate-500">Test not found.</p>
      </div>
    );
  }

  const ability = user?.diagnosticAbilityLevel ?? "Beginner";
  const testQuestions = questions
    .filter((question) => (test.questionIds?.length ? test.questionIds.includes(question.id) : question.topicId === test.topicId))
    .filter((question) => question.status !== "draft")
    .filter((question) => abilityAllows(ability, question.abilityLevel ?? "Beginner"))
    .filter((question) => questionMatchesClass(question, user?.classYear));

  return <TestEngine test={test} questions={testQuestions.length ? testQuestions : questions.slice(0, test.questionCount)} />;
}
