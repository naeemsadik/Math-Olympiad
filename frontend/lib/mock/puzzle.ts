import type { DailyPuzzle, Tier } from "@/types";

export const puzzlesByTier: Record<Tier, DailyPuzzle> = {
  Beginner: {
    id: "puzzle-beginner-2026-may-14",
    date: "May 14, 2026 • School Level",
    content: "A number leaves remainder 4 when divided by 6, and remainder 7 when divided by 9. Find the smallest such positive integer.",
    difficulty: "Beginner",
    tier: "Beginner",
    topic: "Number Theory",
    streakCount: 5,
    topSolvers: [
      { name: "Maliha Sultana", time: "03:21" },
      { name: "Arif Hasan",     time: "05:47" },
      { name: "Tasnim Rahman",  time: "07:12" },
    ],
    previousPuzzles: [
      { id: "pb1", title: "The Division Remainder",  topic: "Number Theory", date: "May 13", content: "When a positive integer N is divided by 7, the remainder is 3. When N is divided by 4, the remainder is 1. Find the smallest such N greater than 10." },
      { id: "pb2", title: "Sum of Digits Puzzle",    topic: "Algebra",       date: "May 12", content: "The sum of the digits of a two-digit number is 9. If the digits are reversed, the new number is 27 more than the original. Find the original number." },
      { id: "pb3", title: "Triangle Count",          topic: "Combinatorics", date: "May 11", content: "How many triangles can be formed by connecting 7 points on a circle (no 3 points are collinear)?" },
      { id: "pb4", title: "Factor Finder",           topic: "Number Theory", date: "May 10", content: "Find the number of positive divisors of 360. What is their sum?" },
      { id: "pb5", title: "Quadratic Roots",         topic: "Algebra",       date: "May 9",  content: "If the roots of x^2 - 5x + k = 0 are both positive integers, find all possible values of k and the corresponding roots." },
    ],
  },
  Intermediate: {
    id: "puzzle-intermediate-2026-may-14",
    date: "May 14, 2026 • College Level",
    content: "Find the number of positive integers a such that a+50 divides a^2+100. Prove your result using the property of modular arithmetic.",
    difficulty: "Intermediate",
    tier: "Intermediate",
    topic: "Combinatorics",
    streakCount: 12,
    topSolvers: [
      { name: "Fahim Hossain", time: "04:32" },
      { name: "Lamia Akter",   time: "07:18" },
      { name: "Tahmid Reza",   time: "09:55" },
    ],
    previousPuzzles: [
      { id: "pi1", title: "The Divisibility Paradox",  topic: "Number Theory", date: "May 13", content: "Prove that for any integer n, the expression n^3 - n is always divisible by 6. Show this holds for negative integers as well." },
      { id: "pi2", title: "The Pigeonhole Labyrinth",  topic: "Combinatorics", date: "May 12", content: "In a group of 13 people, prove that at least two were born in the same month. Now: among 367 people, prove at least two share the same birthday." },
      { id: "pi3", title: "Euclid's Trinity Mystery",  topic: "Number Theory", date: "May 11", content: "Find all triples (a, b, c) of positive integers satisfying 1/a + 1/b + 1/c = 1. Prove your list is complete." },
      { id: "pi4", title: "Circle Chord Count",        topic: "Geometry",      date: "May 10", content: "A circle has 8 points on its circumference, no three of which are concurrent inside. How many regions do all the chords divide the circle into?" },
      { id: "pi5", title: "Inclusion-Exclusion Dance", topic: "Combinatorics", date: "May 9",  content: "Among integers from 1 to 100, how many are divisible by 2 or 3 or 5? Use the Inclusion-Exclusion principle." },
    ],
  },
  Advanced: {
    id: "puzzle-advanced-2026-may-14",
    date: "May 14, 2026 • University Level",
    content: "Let p be an odd prime and a an integer not divisible by p. Prove that a^(p-1) is congruent to 1 (mod p), then use this to find the last two digits of 7^1000.",
    difficulty: "Advanced",
    tier: "Advanced",
    topic: "Number Theory",
    streakCount: 21,
    topSolvers: [
      { name: "Adnan Chowdhury", time: "02:47" },
      { name: "Sarah Jubaida",   time: "03:58" },
      { name: "Rahat Khan",      time: "05:23" },
    ],
    previousPuzzles: [
      { id: "pa1", title: "IMO 2023 NT Shortlist",     topic: "Number Theory", date: "May 13", content: "Find all functions f: Z → Z such that f(f(n)) = f(n) + n for all integers n. (Adapted from IMO 2023 shortlist N2.)" },
      { id: "pa2", title: "Diophantine System",         topic: "Number Theory", date: "May 12", content: "Find all pairs of positive integers (x, y) such that x^2 - y^2 = 2026. Prove your list is complete." },
      { id: "pa3", title: "Cauchy-Schwarz Marathon",   topic: "Inequalities",  date: "May 11", content: "For positive reals a, b, c with a+b+c=3, prove that a/(b^2+1) + b/(c^2+1) + c/(a^2+1) >= 3/2." },
      { id: "pa4", title: "Ramsey Graph Coloring",     topic: "Combinatorics", date: "May 10", content: "Prove that in any 2-coloring of the edges of K_6 (complete graph on 6 vertices), there exists a monochromatic triangle. Is K_5 sufficient?" },
      { id: "pa5", title: "Jensen's Inequality Chain", topic: "Inequalities",  date: "May 9",  content: "Using Jensen's inequality, prove that for positive reals summing to 1: x1*ln(x1) + x2*ln(x2) + ... + xn*ln(xn) >= -ln(n)." },
    ],
  },
};

export const todaysPuzzle: DailyPuzzle = puzzlesByTier.Intermediate;
