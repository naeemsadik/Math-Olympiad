import type { Tier } from "@/types";

export interface Notice {
  id: string;
  title: string;
  body: string;
  tier: Tier | "All";
  priority: "high" | "normal" | "low";
  author: string;
  createdAt: string;
}

export const mockNotices: Notice[] = [
  {
    id: "n1",
    title: "BdMO 2025 Registration Now Open",
    body: "Bangladesh Mathematical Olympiad 2025 registration is now open. All eligible students must register before June 15, 2025. Visit the Events section for more details and eligibility criteria.",
    tier: "All",
    priority: "high",
    author: "Admin",
    createdAt: "2026-05-14",
  },
  {
    id: "n2",
    title: "Platform Maintenance — May 18",
    body: "The platform will undergo scheduled maintenance on May 18, 2026 from 2:00 AM to 5:00 AM (BST). All services including tests and live exams will be unavailable during this window.",
    tier: "All",
    priority: "normal",
    author: "Admin",
    createdAt: "2026-05-13",
  },
  {
    id: "n3",
    title: "Beginner Tier — New Topic Added: Basic Counting",
    body: "A new topic 'Basic Counting & Permutations' has been added for Beginner tier students. This topic includes 20 practice problems and a quiz. Access it from the Topics section.",
    tier: "Beginner",
    priority: "normal",
    author: "Admin",
    createdAt: "2026-05-12",
  },
  {
    id: "n4",
    title: "Intermediate Live Exam — May 20",
    body: "A live exam covering Geometry and Combinatorics is scheduled for Intermediate tier students on May 20, 2026 at 7:00 PM BST. Duration: 90 minutes. Make sure you are logged in 10 minutes before the start.",
    tier: "Intermediate",
    priority: "high",
    author: "Admin",
    createdAt: "2026-05-11",
  },
  {
    id: "n5",
    title: "Advanced Tier — Mock IMO Problem Set Released",
    body: "A curated set of 30 IMO-style problems has been released for Advanced tier students. These problems are categorized by difficulty and topic. Attempt them from the Tests section under 'Advanced Mock'.",
    tier: "Advanced",
    priority: "high",
    author: "Admin",
    createdAt: "2026-05-10",
  },
  {
    id: "n6",
    title: "Streak Reward — Top Streaks This Month",
    body: "Students with a 30-day or longer streak by May 31 will receive a special 'Dedicated Solver' badge on their profile. Keep your daily practice going!",
    tier: "All",
    priority: "low",
    author: "Admin",
    createdAt: "2026-05-09",
  },
  {
    id: "n7",
    title: "Beginner Tier — SSC Preparation Workshop",
    body: "An online workshop on SSC Math preparation is being organized for Beginner tier students on May 22 at 5:00 PM BST. Topics: Algebra basics, Number sense, and Geometry fundamentals. Registration link will be shared in the Community section.",
    tier: "Beginner",
    priority: "normal",
    author: "Admin",
    createdAt: "2026-05-08",
  },
  {
    id: "n8",
    title: "Intermediate — HSC Syllabus Alignment Update",
    body: "Topic content for Intermediate tier has been updated to align with the revised HSC 2025-26 curriculum. Please review the Topics section for newly tagged problems.",
    tier: "Intermediate",
    priority: "normal",
    author: "Admin",
    createdAt: "2026-05-07",
  },
  {
    id: "n9",
    title: "Advanced — BUET Math Fest Collaboration",
    body: "UIU CMOR is collaborating with BUET for the upcoming Math Fest 2026. Advanced tier students are invited to represent UIU. Interested students should contact the admin through the Community section by May 25.",
    tier: "Advanced",
    priority: "high",
    author: "Admin",
    createdAt: "2026-05-06",
  },
  {
    id: "n10",
    title: "Community Guidelines Updated",
    body: "The community posting guidelines have been updated to ensure a respectful and productive environment. All students are requested to read the updated guidelines pinned in the Community section.",
    tier: "All",
    priority: "low",
    author: "Admin",
    createdAt: "2026-05-05",
  },
];
