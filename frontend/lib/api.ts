/**
 * API client for the Laravel 11 backend.
 *
 * Set NEXT_PUBLIC_API_URL in `.env.local` (e.g. http://127.0.0.1:8000).
 * The client auto-prepends `/api/v1` if not already present.
 *
 * All write methods send `Authorization: Bearer <token>` when a token is
 * available in `useAuthStore`. Public endpoints set `auth: false`.
 *
 * If `NEXT_PUBLIC_API_URL` is unset, every call returns its `fallback`
 * synchronously, so the UI keeps working in mock mode.
 */

import { useAuthStore } from "@/store/authStore";
import type {
  CommunityPost,
  DiagnosticAttempt,
  Event,
  LeaderboardEntry,
  LiveExam,
  Notice,
  Question,
  Test,
  Topic,
  User,
  UserRole,
} from "@/types";

// Backend returns roles as "Admin"/"Student"/"Faculty" (capitalised); normalise
// to the uppercase enum the frontend expects.
function normalizeUser<T extends Partial<User>>(u: T): T {
  if (!u) return u;
  const role = u.role as unknown;
  let normalised: UserRole | undefined;
  if (role === "Admin" || role === "admin" || role === "ADMIN") normalised = "ADMIN";
  else if (role === "Faculty" || role === "faculty" || role === "FACULTY") normalised = "FACULTY";
  else if (role === "Student" || role === "student" || role === "STUDENT") normalised = "STUDENT";
  return { ...u, role: normalised ?? (role as UserRole) };
}

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";
const HAS_VERSION = RAW_BASE.endsWith("/api/v1") || RAW_BASE.includes("/api/v1/");
const ROOT = RAW_BASE ? `${RAW_BASE}${HAS_VERSION ? "" : "/api/v1"}` : "";
const ENABLED = ROOT.length > 0;

// --------------------------------------------------------------------------
// Error
// --------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;
  body: unknown;
  errors?: Record<string, string[]>;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    if (body && typeof body === "object" && "errors" in body) {
      this.errors = (body as { errors?: Record<string, string[]> }).errors;
    }
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// --------------------------------------------------------------------------
// Core request
// --------------------------------------------------------------------------

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  fallback?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
};

async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  if (!ENABLED) {
    if (opts.fallback === undefined) {
      throw new ApiError(0, null, "API not configured (set NEXT_PUBLIC_API_URL).");
    }
    return opts.fallback as T;
  }

  const headers = new Headers(opts.headers);
  headers.set("Accept", "application/json");

  let body: BodyInit | undefined;
  if (opts.body !== undefined && opts.body !== null) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  }

  if (opts.auth !== false) {
    const token = useAuthStore.getState().token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const search = opts.query
    ? "?" +
      Object.entries(opts.query)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";

  const res = await fetch(`${ROOT}${path}${search}`, { ...opts, headers, body });
  const text = await res.text();
  const parsed = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (parsed && typeof parsed === "object" && "message" in parsed && typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : null) ?? `${res.status} ${res.statusText}`;
    throw new ApiError(res.status, parsed, message);
  }

  // Laravel wraps in {data: ...} for collections, but auth responses use {user, token}.
  // Use `unwrapData: true` (default) to read `data` if present, otherwise return the payload as-is.
  if (parsed && typeof parsed === "object" && "data" in parsed) {
    return (parsed as { data: T }).data;
  }
  return parsed as T;
}

const get = <T>(path: string, fallback?: T, query?: RequestOptions["query"]) =>
  request<T>(path, { method: "GET", fallback, query });
const post = <T>(path: string, body?: unknown, fallback?: T) =>
  request<T>(path, { method: "POST", body, fallback });
const patch = <T>(path: string, body?: unknown, fallback?: T) =>
  request<T>(path, { method: "PATCH", body, fallback });
const del = <T>(path: string, fallback?: T) => request<T>(path, { method: "DELETE", fallback });

// --------------------------------------------------------------------------
// Auth
// --------------------------------------------------------------------------

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: "admin" | "student" | "faculty";
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  institutionType: "School" | "College" | "University" | "Graduate";
  classYear?: string;
  institute: string;
  university?: string;
  department?: string;
  dob?: string;
  whatsapp?: string;
  gender?: string;
  phone?: string;
}

const auth = {
  register: (payload: RegisterPayload) =>
    post<AuthResponse>("/auth/register", payload).then((r) => ({ ...r, user: normalizeUser(r.user) })),
  login: (payload: LoginPayload) =>
    post<AuthResponse>("/auth/login", payload).then((r) => ({ ...r, user: normalizeUser(r.user) })),
  logout: () => post<{ message: string }>("/auth/logout"),
  me: () => get<{ user: User }>("/auth/me").then((r) => normalizeUser(r.user)),
  updateProfile: (patch$: Partial<User>) => patch<{ user: User }>("/auth/me", patch$).then((r) => normalizeUser(r.user)),
};

// --------------------------------------------------------------------------
// Public reads
// --------------------------------------------------------------------------

const publicApi = {
  getHomeBundles: () => get("/home/bundles"),
  getEvents: () => get<Event[]>("/events"),
  getAlbums: () => get("/albums"),
  getHallOfFame: () => get("/hall-of-fame"),
  getLeaderboard: (query: { period?: string; tier?: string; limit?: number } = {}) =>
    get<LeaderboardEntry[]>("/leaderboard", undefined, query),
  getNotices: () => get<Notice[]>("/notices"),
  verifyCertificate: (code: string) => get("/certificates/verify", undefined, { code }),
  getLiveExams: () => get<LiveExam[]>("/live-exams"),
  getPage: (slug: string) => get(`/pages/${encodeURIComponent(slug)}`),
  getSettings: () => get("/settings"),
  getTopics: () => get<Topic[]>("/topics"),
  getTopicBySlug: (slug: string) => get<Topic & { modules: unknown[] }>(`/topics/${encodeURIComponent(slug)}`),
};

// --------------------------------------------------------------------------
// Student (auth required)
// --------------------------------------------------------------------------

const dashboard = {
  get: () => get("/student/dashboard"),
  completeLesson: (lessonId: string | number) => post(`/lessons/${lessonId}/complete`),
};

const tests = {
  list: (query: { type?: "practice" | "diagnostic"; tier?: string; classYear?: string; ability?: string } = {}) =>
    get<Test[]>("/tests", undefined, query),
  get: (id: string | number) => get<Test & { questions: Question[] }>(`/tests/${id}`),
  getMyAttempts: () => get("/attempts"),
  getAttemptResult: (id: string | number) => get(`/attempts/${id}/result`),
  start: (id: string | number) => post<{ data: unknown; resumed?: boolean }>(`/tests/${id}/attempts/start`),
  answer: (attemptId: string | number, questionId: string | number, optionId: string | number | null) =>
    patch(`/attempts/${attemptId}/answer`, { question_id: questionId, option_id: optionId }),
  advance: (attemptId: string | number, currentIndex: number) =>
    patch(`/attempts/${attemptId}/advance`, { current_index: currentIndex }),
  submit: (attemptId: string | number) => post(`/attempts/${attemptId}/submit`),
};

const diagnostic = {
  start: () =>
    post<DiagnosticAttempt | { data: DiagnosticAttempt; resumed?: boolean }>("/diagnostic/start").then((r) => {
      if (r && typeof r === "object" && "data" in r) return r.data;
      return r as DiagnosticAttempt;
    }),
  getQuestions: (attemptId: string | number) =>
    get<{ data: Question[] }>(`/diagnostic/${attemptId}/questions`).then((r) => r.data),
  submit: (attemptId: string | number, answers: Record<string, number | null>) =>
    post<{ data: DiagnosticAttempt }>(`/diagnostic/${attemptId}/submit`, { answers }).then((r) => r.data),
};

const puzzles = {
  getToday: () => get("/puzzles/today"),
  getMySubmission: (puzzleId: string | number) => get(`/puzzles/${puzzleId}/submissions/me`),
  submit: (puzzleId: string | number, answer: string) =>
    post(`/puzzles/${puzzleId}/submissions`, { answer }),
};

const community = {
  listPosts: () => get<CommunityPost[]>("/community/posts"),
  createPost: (payload: { title: string; body: string; category: string; tags: string[] }) =>
    post<CommunityPost>("/community/posts", payload),
  likePost: (id: string | number) => post(`/community/posts/${id}/like`),
  listReplies: (postId: string | number) => get(`/community/posts/${postId}/replies`),
  createReply: (postId: string | number, body: string) =>
    post(`/community/posts/${postId}/replies`, { body }),
};

const registrations = {
  register: (eventId: string | number) => post("/event-registrations", { event_id: eventId }),
};

// --------------------------------------------------------------------------
// Admin (auth + role:admin required)
// --------------------------------------------------------------------------

const admin = {
  dashboardStats: () => get("/admin/dashboard/stats"),

  users: {
    list: (query: { search?: string; tier?: string; role?: string } = {}) =>
      get("/admin/users", undefined, query),
    get: (id: string | number) => get(`/admin/users/${id}`),
    create: (payload: Record<string, unknown>) => post("/admin/users", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/users/${id}`, payload),
    remove: (id: string | number) => del(`/admin/users/${id}`),
    resetDiagnostic: (id: string | number) => post(`/admin/users/${id}/reset-diagnostic`),
  },

  topics: {
    list: () => get("/admin/topics"),
    create: (payload: Record<string, unknown>) => post("/admin/topics", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/topics/${id}`, payload),
    remove: (id: string | number) => del(`/admin/topics/${id}`),
    modules: (topicId: string | number) => get(`/admin/topics/${topicId}/modules`),
    createModule: (topicId: string | number, payload: Record<string, unknown>) =>
      post(`/admin/topics/${topicId}/modules`, payload),
  },

  questions: {
    list: (query: { topicId?: string; difficulty?: string; status?: string } = {}) =>
      get<Question[]>("/admin/questions", undefined, query),
    create: (payload: Record<string, unknown>) => post("/admin/questions", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/questions/${id}`, payload),
    remove: (id: string | number) => del(`/admin/questions/${id}`),
  },

  tests: {
    list: () => get<Test[]>("/admin/tests"),
    create: (payload: Record<string, unknown>) => post("/admin/tests", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/tests/${id}`, payload),
    remove: (id: string | number) => del(`/admin/tests/${id}`),
  },

  notices: {
    list: (query: { status?: string } = {}) => get<Notice[]>("/admin/notices", undefined, query),
    create: (payload: Record<string, unknown>) => post("/admin/notices", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/notices/${id}`, payload),
    remove: (id: string | number) => del(`/admin/notices/${id}`),
    togglePin: (id: string | number) => post(`/admin/notices/${id}/toggle-pin`),
  },

  events: {
    olympiad: {
      list: () => get("/admin/events/olympiad"),
      create: (payload: Record<string, unknown>) => post("/admin/events/olympiad", payload),
      update: (id: string | number, payload: Record<string, unknown>) =>
        patch(`/admin/events/olympiad/${id}`, payload),
      remove: (id: string | number) => del(`/admin/events/olympiad/${id}`),
    },
    internal: {
      list: () => get("/admin/events/internal-sessions"),
      create: (payload: Record<string, unknown>) => post("/admin/events/internal-sessions", payload),
      update: (id: string | number, payload: Record<string, unknown>) =>
        patch(`/admin/events/internal-sessions/${id}`, payload),
      remove: (id: string | number) => del(`/admin/events/internal-sessions/${id}`),
    },
    live: {
      list: () => get("/admin/events/live-exams"),
      create: (payload: Record<string, unknown>) => post("/admin/events/live-exams", payload),
      update: (id: string | number, payload: Record<string, unknown>) =>
        patch(`/admin/events/live-exams/${id}`, payload),
      remove: (id: string | number) => del(`/admin/events/live-exams/${id}`),
    },
  },

  registrationEvents: {
    list: () => get("/admin/registration-events"),
    create: (payload: Record<string, unknown>) => post("/admin/registration-events", payload),
    update: (id: string | number, payload: Record<string, unknown>) =>
      patch(`/admin/registration-events/${id}`, payload),
    remove: (id: string | number) => del(`/admin/registration-events/${id}`),
    listRegistrations: (id: string | number) => get(`/admin/registration-events/${id}/registrations`),
    updateRegistration: (eventId: string | number, regId: string | number, payload: Record<string, unknown>) =>
      patch(`/admin/registration-events/${eventId}/registrations/${regId}`, payload),
    removeRegistration: (eventId: string | number, regId: string | number) =>
      del(`/admin/registration-events/${eventId}/registrations/${regId}`),
    exportRegistrationsCsv: (id: string | number) =>
      get(`/admin/registration-events/${id}/registrations/export`),
  },

  certificates: {
    list: () => get("/admin/certificates"),
    create: (payload: Record<string, unknown>) => post("/admin/certificates", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/certificates/${id}`, payload),
    remove: (id: string | number) => del(`/admin/certificates/${id}`),
    revoke: (id: string | number, reason: string) => post(`/admin/certificates/${id}/revoke`, { reason }),
    restore: (id: string | number) => post(`/admin/certificates/${id}/restore`),
    exportCsv: () => get("/admin/certificates/export"),
  },

  puzzles: {
    list: () => get("/admin/puzzles"),
    create: (payload: Record<string, unknown>) => post("/admin/puzzles", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/puzzles/${id}`, payload),
    remove: (id: string | number) => del(`/admin/puzzles/${id}`),
    listSubmissions: () => get("/admin/puzzle-submissions"),
    judgeSubmission: (id: string | number, payload: { isCorrect: boolean; note?: string }) =>
      patch(`/admin/puzzle-submissions/${id}`, payload),
  },

  community: {
    listPosts: (query: { status?: string } = {}) => get("/admin/community/posts", undefined, query),
    updatePost: (id: string | number, payload: Record<string, unknown>) =>
      patch(`/admin/community/posts/${id}`, payload),
    removePost: (id: string | number) => del(`/admin/community/posts/${id}`),
    togglePinPost: (id: string | number) => post(`/admin/community/posts/${id}/toggle-pin`),
    listReplies: (postId: string | number) => get(`/admin/community/posts/${postId}/replies`),
    removeReply: (postId: string | number, replyId: string | number) =>
      del(`/admin/community/posts/${postId}/replies/${replyId}`),
  },

  hallOfFame: {
    list: () => get("/admin/hall-of-fame"),
    create: (payload: Record<string, unknown>) => post("/admin/hall-of-fame", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/hall-of-fame/${id}`, payload),
    remove: (id: string | number) => del(`/admin/hall-of-fame/${id}`),
  },

  albums: {
    list: () => get("/admin/albums"),
    get: (id: string | number) => get(`/admin/albums/${id}`),
    create: (payload: Record<string, unknown>) => post("/admin/albums", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/albums/${id}`, payload),
    remove: (id: string | number) => del(`/admin/albums/${id}`),
    addPhoto: (id: string | number, payload: Record<string, unknown>) =>
      post(`/admin/albums/${id}/photos`, payload),
    removePhoto: (id: string | number, photoId: string | number) =>
      del(`/admin/albums/${id}/photos/${photoId}`),
  },

  pages: {
    list: () => get("/admin/pages"),
    get: (id: string | number) => get(`/admin/pages/${id}`),
    create: (payload: Record<string, unknown>) => post("/admin/pages", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/pages/${id}`, payload),
    remove: (id: string | number) => del(`/admin/pages/${id}`),
  },

  homeSections: {
    list: () => get("/admin/home-sections"),
    create: (payload: Record<string, unknown>) => post("/admin/home-sections", payload),
    update: (id: string | number, payload: Record<string, unknown>) => patch(`/admin/home-sections/${id}`, payload),
    reorder: (order: Array<{ id: string | number; position: number }>) =>
      post("/admin/home-sections/reorder", { order }),
  },

  settings: {
    list: () => get("/admin/settings"),
    get: (key: string) => get(`/admin/settings/${encodeURIComponent(key)}`),
    update: (key: string, payload: Record<string, unknown>) =>
      patch(`/admin/settings/${encodeURIComponent(key)}`, payload),
    remove: (key: string) => del(`/admin/settings/${encodeURIComponent(key)}`),
  },

  diagnosticResults: () => get("/admin/diagnostics/results"),
};

// --------------------------------------------------------------------------
// Public surface
// --------------------------------------------------------------------------

export const api = {
  enabled: ENABLED,
  auth,
  public: publicApi,
  dashboard,
  tests,
  diagnostic,
  puzzles,
  community,
  registrations,
  admin,
};

export default api;
