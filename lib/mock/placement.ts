import type { Question } from "@/types";

// Canonical order: indices 0-2 = Beginner, 3-5 = Intermediate, 6-8 = Advanced
// The placement page shuffles display order — difficulty is NEVER shown to students.
export const placementQuestions: Question[] = [
  // ── Beginner (0-2) ───────────────────────────────────────────────────
  {
    id: "pl-b1",
    content: "If f(x) = 3x − 2, find f(f(3)).",
    options: ["7", "19", "16", "21"],
    correctOption: 1,
    explanation: "f(3) = 9 − 2 = 7. Then f(7) = 21 − 2 = 19.",
    topicId: "algebra",
    difficulty: "Beginner",
    tier: "Beginner",
  },
  {
    id: "pl-b2",
    content: "Find the GCD of 48 and 36.",
    options: ["6", "12", "18", "24"],
    correctOption: 1,
    explanation: "48 = 4 × 12 and 36 = 3 × 12, so GCD = 12.",
    topicId: "number-theory",
    difficulty: "Beginner",
    tier: "Beginner",
  },
  {
    id: "pl-b3",
    content: "A triangle has angles in ratio 2 : 3 : 4. What is the largest angle?",
    options: ["60°", "80°", "90°", "100°"],
    correctOption: 1,
    explanation: "2x + 3x + 4x = 180° → x = 20°. Largest = 4 × 20 = 80°.",
    topicId: "geometry",
    difficulty: "Beginner",
    tier: "Beginner",
  },

  // ── Intermediate (3-5) ───────────────────────────────────────────────
  {
    id: "pl-i1",
    content: "Find the remainder when 2¹⁰⁰ is divided by 7.",
    options: ["1", "2", "3", "4"],
    correctOption: 1,
    explanation: "By Fermat's Little Theorem, 2⁶ ≡ 1 (mod 7). 100 = 16×6 + 4, so 2¹⁰⁰ ≡ 2⁴ = 16 ≡ 2 (mod 7).",
    topicId: "number-theory",
    difficulty: "Intermediate",
    tier: "Intermediate",
  },
  {
    id: "pl-i2",
    content: "In how many ways can 5 students sit in a row if 2 specific students must NOT sit adjacent?",
    options: ["48", "72", "96", "120"],
    correctOption: 1,
    explanation: "Total = 5! = 120. Adjacent arrangements = 4! × 2 = 48. Answer = 120 − 48 = 72.",
    topicId: "combinatorics",
    difficulty: "Intermediate",
    tier: "Intermediate",
  },
  {
    id: "pl-i3",
    content: "The product of two consecutive positive integers exceeds their sum by 209. Find the larger integer.",
    options: ["14", "15", "16", "17"],
    correctOption: 1,
    explanation: "n(n+1) − (2n+1) = 209 → n² − n − 210 = 0 → (n−15)(n+14) = 0 → n = 15. Larger = 15.",
    topicId: "algebra",
    difficulty: "Intermediate",
    tier: "Intermediate",
  },

  // ── Advanced (6-8) ───────────────────────────────────────────────────
  {
    id: "pl-a1",
    content: "For positive reals a, b, c with a + b + c = 1, find the minimum value of 1/a + 1/b + 1/c.",
    options: ["3", "6", "9", "12"],
    correctOption: 2,
    explanation: "By AM-HM: (a+b+c)/3 ≥ 3/(1/a+1/b+1/c), so 1/3 ≥ 3/S → S ≥ 9. Equality when a = b = c = 1/3.",
    topicId: "inequalities",
    difficulty: "Advanced",
    tier: "Advanced",
  },
  {
    id: "pl-a2",
    content: "How many non-negative integer solutions exist for x + y + z = 10?",
    options: ["55", "66", "78", "91"],
    correctOption: 1,
    explanation: "Stars and bars: C(10+2, 2) = C(12, 2) = 66.",
    topicId: "combinatorics",
    difficulty: "Advanced",
    tier: "Advanced",
  },
  {
    id: "pl-a3",
    content: "Which of the following best describes the integer solutions to x² − y² = 2025?",
    options: [
      "No integer solutions exist",
      "Exactly 2 pairs",
      "Exactly 8 pairs",
      "Infinitely many solutions",
    ],
    correctOption: 2,
    explanation: "(x−y)(x+y) = 2025 = 3⁴ × 5². Each odd factor-pair (d₁, d₂) with d₁ × d₂ = 2025 and d₁ ≤ d₂ gives a solution. There are 8 such ordered factor-pairs, yielding 8 integer solution pairs.",
    topicId: "number-theory",
    difficulty: "Advanced",
    tier: "Advanced",
  },
];
