/**
 * API layer — currently returns mock data.
 * Set NEXT_PUBLIC_API_URL in .env to switch to the Laravel backend.
 */

import { topics, numberTheoryModules } from "./mock/topics";
import { tests, sampleQuestions } from "./mock/tests";
import { dashboardStats, leaderboard } from "./mock/dashboard";
import { events, internalEvents } from "./mock/events";
import { todaysPuzzle } from "./mock/puzzle";
import type { DiagnosticAttempt, Question, Test } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL;

async function get<T>(path: string, fallback: T): Promise<T> {
  if (!BASE) return fallback;
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) return fallback;
  return res.json();
}

async function send<T>(path: string, method: "POST" | "PUT" | "PATCH" | "DELETE", body: unknown, fallback: T): Promise<T> {
  if (!BASE) return fallback;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return fallback;
  return res.json();
}

export const api = {
  getTopics: () => get("/api/topics", topics),
  getTopicModules: (slug: string) =>
    get(`/api/topics/${slug}/modules`, slug === "number-theory" ? numberTheoryModules : []),
  getTests: () => get("/api/tests", tests),
  getTestQuestions: (id: string) => get(`/api/tests/${id}/questions`, sampleQuestions),
  getDashboardStats: () => get("/api/dashboard", dashboardStats),
  getLeaderboard: () => get("/api/leaderboard", leaderboard),
  getEvents: () => get("/api/events", events),
  getInternalEvents: () => get("/api/events/internal", internalEvents),
  getDailyPuzzle: () => get("/api/puzzle/today", todaysPuzzle),
  getQuestions: () => get<Question[]>("/api/questions", sampleQuestions),
  createQuestion: (question: Question) => send<Question>("/api/questions", "POST", question, question),
  updateQuestion: (id: string, question: Partial<Question>) => send<Partial<Question>>(`/api/questions/${id}`, "PATCH", question, question),
  deleteQuestion: (id: string) => send<{ id: string }>(`/api/questions/${id}`, "DELETE", { id }, { id }),
  createTest: (test: Test) => send<Test>("/api/tests", "POST", test, test),
  updateTest: (id: string, test: Partial<Test>) => send<Partial<Test>>(`/api/tests/${id}`, "PATCH", test, test),
  deleteTest: (id: string) => send<{ id: string }>(`/api/tests/${id}`, "DELETE", { id }, { id }),
  startDiagnosticAttempt: (attempt: DiagnosticAttempt) => send<DiagnosticAttempt>("/api/diagnostics/attempts", "POST", attempt, attempt),
  submitDiagnosticAttempt: (id: string, attempt: Partial<DiagnosticAttempt>) => send<Partial<DiagnosticAttempt>>(`/api/diagnostics/attempts/${id}`, "PATCH", attempt, attempt),
  getDiagnosticResults: () => get<DiagnosticAttempt[]>("/api/admin/diagnostics/results", []),
  resetDiagnosticPlacement: (userId: string) => send<{ userId: string }>("/api/admin/diagnostics/reset", "POST", { userId }, { userId }),
};
