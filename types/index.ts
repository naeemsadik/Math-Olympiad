export type UserRole = "STUDENT" | "ADMIN" | "FACULTY";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Elite";
export type OlympiadType = "BdMO" | "AMC" | "IMO" | "INTERNAL";
export type QuestionState = "unanswered" | "answered" | "marked" | "skipped";
export type Tier = "Beginner" | "Intermediate" | "Advanced";
export type AbilityLevel = "Beginner" | "Advanced" | "Expert";
export type QuestionFormat = "text-to-text" | "text-to-image" | "image-to-text" | "image-to-image";
export type QuestionStatus = "draft" | "published";
export type TestType = "practice" | "diagnostic";

export type InstitutionType = "School" | "College" | "University" | "Graduate";

export interface QuestionMedia {
  kind: "text" | "image";
  value: string;
  alt?: string;
}

export interface QuestionOption {
  id: string;
  media: QuestionMedia;
  isCorrect: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier: Tier;
  institute: string;
  department?: string;
  xp: number;
  streak: number;
  level: string;
  avatar?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  address?: string;
  university?: string;
  about?: string;
  institutionType?: InstitutionType;
  classYear?: string;
  whatsapp?: string;
  placementDone?: boolean;
  diagnosticAbilityLevel?: AbilityLevel;
  diagnosticScore?: number;
  diagnosticCompletedAt?: string;
  diagnosticAttemptId?: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  tier: Tier;
  level: Difficulty;
  lessonCount: number;
  problemCount: number;
  color: string;
}

export interface Module {
  id: string;
  topicId: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  lessonCount: number;
  order: number;
}

export interface Question {
  id: string;
  content: string;
  options: string[];
  correctOption: number;
  explanation: string;
  topicId: string;
  difficulty: Difficulty;
  tier: Tier;
  format?: QuestionFormat;
  prompt?: QuestionMedia;
  answerOptions?: QuestionOption[];
  timeLimitSeconds?: number;
  targetClassYear?: string;
  abilityLevel?: AbilityLevel;
  marks?: number;
  subtopicTags?: string[];
  source?: string;
  status?: QuestionStatus;
  isDiagnosticEligible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: Difficulty;
  tier: Tier;
  topicId: string;
  questionCount: number;
  isPublic: boolean;
  source?: string;
  tags: string[];
  testType?: TestType;
  targetClassYear?: string;
  abilityLevel?: AbilityLevel;
  questionIds?: string[];
  randomQuestionCount?: number;
  advancedThreshold?: number;
  expertThreshold?: number;
}

export interface DiagnosticAttempt {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  questionIds: string[];
  answers: Record<string, number>;
  correctCount?: number;
  score?: number;
  abilityLevel?: AbilityLevel;
  status: "in-progress" | "submitted";
  startedAt: string;
  submittedAt?: string;
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, number>;
  status: "in-progress" | "submitted";
  startedAt: string;
  currentQuestionStartedAt: string;
  currentQuestionDeadline: string;
  submittedAt?: string;
}

export interface TestAttempt {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeSpent: number;
  submittedAt: string;
  topicBreakdown: { topic: string; accuracy: number; avgAccuracy: number }[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  estimatedMinutes: number;
  content: string;
  keyPoints: string[];
  example: { problem: string; solution: string };
  resources: { title: string; type: "video" | "pdf" | "article" }[];
}

export interface PuzzleSubmission {
  id: string;
  puzzleId: string;
  puzzleTitle: string;
  studentName: string;
  studentInstitute: string;
  studentTier: Tier;
  answer: string;
  submittedAt: string;
  isCorrect?: boolean;
}

export interface DailyPuzzle {
  id: string;
  date: string;
  content: string;
  difficulty: Difficulty;
  tier: Tier;
  topic: string;
  streakCount: number;
  topSolvers: { name: string; time: string; avatar?: string }[];
  previousPuzzles: { id: string; title: string; topic: string; date: string; content: string }[];
}

export interface CommunityPost {
  id: number;
  title: string;
  category: string;
  author: string;
  authorInstitute: string;
  tier: Tier;
  time: string;
  views: number;
  likes: number;
  replies: number;
  pinned: boolean;
  tags: string[];
}

export interface LiveExam {
  id: string;
  title: string;
  description: string;
  tier: Tier;
  scheduledAt: string;
  duration: number;
  topicId: string;
  testId?: string;
  questionCount: number;
  status: "upcoming" | "live" | "ended";
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  type: OlympiadType;
  date: string;
  location: string;
  officialLink?: string;
  registrationLink?: string;
  description: string;
  isInternal: boolean;
  time?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  department: string;
  institute: string;
  tier: Tier;
  rating: number;
  trend: "up" | "down" | "stable";
  avatar?: string;
}

export interface DashboardStats {
  testsTaken: number;
  averageScore: number;
  bestScore: number;
  totalTime: string;
  topicMastery: { topic: string; accuracy: number; speed: number }[];
  recentActivity: { type: string; title: string; score?: string; xp?: number; time: string }[];
  learningPath: { title: string; progress: number; status: string }[];
  recommendedNext: { title: string; topic: string; level: Difficulty };
}
