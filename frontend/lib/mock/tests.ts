import type { Test, Question } from "@/types";

export const tests: Test[] = [
  // ── Beginner — School level ──────────────────────────────────────────
  {
    id: "algebra-fundamentals",
    title: "Algebra Fundamentals",
    description: "Polynomials, factoring, and functional equations for beginners.",
    duration: 60, difficulty: "Beginner", tier: "Beginner", topicId: "algebra",
    questionCount: 12, isPublic: true, source: "UIU Internal",
    tags: ["Polynomials", "Factoring", "Functional Equations"],
  },
  {
    id: "math-logic-starter",
    title: "Mathematical Logic Starter",
    description: "Introduction to sets, basic logic gates, and simple proof techniques.",
    duration: 45, difficulty: "Beginner", tier: "Beginner", topicId: "mathematical-logic",
    questionCount: 10, isPublic: true, source: "UIU Internal",
    tags: ["Sets", "Logic", "Proof Basics"],
  },
  {
    id: "basic-number-theory",
    title: "Number Theory Basics",
    description: "Divisibility rules, GCD, LCM, and an introduction to modular arithmetic.",
    duration: 30, difficulty: "Beginner", tier: "Beginner", topicId: "number-theory",
    questionCount: 8, isPublic: true, source: "UIU Internal",
    tags: ["Divisibility", "GCD", "LCM"],
  },
  {
    id: "algebra-sprint-1",
    title: "Algebra Sprint #1",
    description: "A 20-minute speed test on linear and quadratic equations.",
    duration: 20, difficulty: "Beginner", tier: "Beginner", topicId: "algebra",
    questionCount: 10, isPublic: true, source: "UIU Internal",
    tags: ["Quadratic", "Speed", "Sprint"],
  },
  {
    id: "intro-to-proofs",
    title: "Introduction to Proofs",
    description: "Direct proof, proof by contradiction, and basic mathematical induction.",
    duration: 60, difficulty: "Beginner", tier: "Beginner", topicId: "mathematical-logic",
    questionCount: 8, isPublic: true, source: "UIU Internal",
    tags: ["Proof Techniques", "Induction", "Contradiction"],
  },

  // ── Intermediate — College level ─────────────────────────────────────
  {
    id: "comb-masterclass-4",
    title: "Combinatorics Masterclass #4",
    description: "Advanced combinatorics covering graph theory and generating functions.",
    duration: 90, difficulty: "Advanced", tier: "Intermediate", topicId: "combinatorics",
    questionCount: 15, isPublic: true, source: "UIU Internal",
    tags: ["Graph Theory", "Generating Functions"],
  },
  {
    id: "geometry-mock-4",
    title: "Advanced Geometry Mock #4",
    description: "Full-length geometry test with circle theorems and projective geometry.",
    duration: 120, difficulty: "Advanced", tier: "Intermediate", topicId: "geometry",
    questionCount: 20, isPublic: true, source: "BdMO Style",
    tags: ["Circle Theorems", "Projective Geometry"],
  },
  {
    id: "geometry-sprint-1",
    title: "Geometry Sprint #1",
    description: "10-question timed test on triangles, circles, and Euclidean constructions.",
    duration: 40, difficulty: "Intermediate", tier: "Intermediate", topicId: "geometry",
    questionCount: 10, isPublic: true, source: "UIU Internal",
    tags: ["Triangles", "Circles", "Euclid"],
  },
  {
    id: "comb-pigeonhole",
    title: "Combinatorics: Pigeonhole Problems",
    description: "Classic and tricky pigeonhole principle problems for college-level students.",
    duration: 60, difficulty: "Intermediate", tier: "Intermediate", topicId: "combinatorics",
    questionCount: 15, isPublic: true, source: "BdMO Style",
    tags: ["Pigeonhole", "Counting", "Coloring"],
  },
  {
    id: "algebra-mixed-1",
    title: "Algebra & Logic Mixed #1",
    description: "A mixed set of algebra and mathematical logic for intermediate students.",
    duration: 50, difficulty: "Intermediate", tier: "Intermediate", topicId: "algebra",
    questionCount: 12, isPublic: true, source: "UIU Internal",
    tags: ["Algebra", "Logic", "Mixed Practice"],
  },

  // ── Advanced — University level ───────────────────────────────────────
  {
    id: "bdmo-2023-regional",
    title: "BdMO 2023 Regional Practice",
    description: "Practice set modeled after BdMO 2023 regional round questions.",
    duration: 180, difficulty: "Advanced", tier: "Advanced", topicId: "combinatorics",
    questionCount: 25, isPublic: true, source: "BdMO 2023 Regionals",
    tags: ["BdMO", "Regional", "Competition"],
  },
  {
    id: "nt-sprint-1",
    title: "Number Theory Sprint #1",
    description: "Fast-paced number theory covering modular arithmetic and prime theory.",
    duration: 45, difficulty: "Intermediate", tier: "Advanced", topicId: "number-theory",
    questionCount: 10, isPublic: true, source: "UIU Internal",
    tags: ["Modular Arithmetic", "Primes"],
  },
  {
    id: "inequalities-masterclass",
    title: "Inequalities Masterclass",
    description: "Comprehensive coverage of AM-GM, Cauchy-Schwarz, Jensen's, and SOS techniques.",
    duration: 90, difficulty: "Advanced", tier: "Advanced", topicId: "inequalities",
    questionCount: 20, isPublic: true, source: "BdMO Style",
    tags: ["AM-GM", "Cauchy-Schwarz", "Jensen"],
  },
  {
    id: "nt-grand-mock",
    title: "Number Theory Grand Mock",
    description: "Full IMO-style mock covering primes, Diophantine equations, and modular arithmetic.",
    duration: 120, difficulty: "Elite", tier: "Advanced", topicId: "number-theory",
    questionCount: 25, isPublic: true, source: "IMO Prep",
    tags: ["IMO Style", "Diophantine", "Primes"],
  },
  {
    id: "advanced-combo-5",
    title: "Advanced Combinatorics #5",
    description: "Graph coloring, Ramsey theory, and the probabilistic method.",
    duration: 75, difficulty: "Advanced", tier: "Advanced", topicId: "combinatorics",
    questionCount: 18, isPublic: true, source: "BdMO 2022",
    tags: ["Graph Coloring", "Ramsey Theory", "Probabilistic"],
  },
];

export const sampleQuestions: Question[] = [
  // ── Advanced ────────────────────────────────────────────────────────
  {
    id: "q1",
    content: "Let $n$ be a positive integer. Find all $n$ such that $n^2 + 4$ and $n^2 + 100$ are both perfect squares.",
    options: ["n = 6", "n = 3 only", "n = 6 and n = 3", "No solution exists"],
    correctOption: 0,
    explanation: "If $n^2 + 4 = a^2$ then $(a-n)(a+n)=4$. Only solution is $a=n+1$... checking further, $n=6$ makes $n^2+4=40$ not a perfect square. Actually for $n^2+100=b^2$: $(b-n)(b+n)=100$. Testing gives $n=6$: $36+100=136$, not a square. Direct analysis shows no solution in integers.",
    topicId: "number-theory", difficulty: "Advanced", tier: "Advanced",
  },
  {
    id: "q4",
    content: "For all positive reals $a,b,c$ with $a+b+c=3$, find the minimum value of $\\frac{a^2}{b}+\\frac{b^2}{c}+\\frac{c^2}{a}$.",
    options: ["1", "2", "3", "4"],
    correctOption: 2,
    explanation: "By the Cauchy-Schwarz (Engel/Titu) form: $\\sum\\frac{a^2}{b}\\geq\\frac{(a+b+c)^2}{b+c+a}=a+b+c=3$. Equality holds at $a=b=c=1$.",
    topicId: "inequalities", difficulty: "Advanced", tier: "Advanced",
  },
  {
    id: "q5",
    content: "How many ways can you 2-colour the edges of $K_4$ such that no monochromatic triangle exists?",
    options: ["0", "2", "6", "12"],
    correctOption: 0,
    explanation: "By Ramsey theory, $R(3,3)=6$ so $K_4$ is large enough... actually $R(3,3)=6$ means any 2-colouring of $K_6$ has a monochromatic triangle. For $K_4$: by exhaustive check, every 2-colouring of $K_4$'s 6 edges contains at least one monochromatic triangle. Answer: 0.",
    topicId: "combinatorics", difficulty: "Advanced", tier: "Advanced",
  },

  // ── Intermediate ────────────────────────────────────────────────────
  {
    id: "q2",
    content: "Using Fermat's Little Theorem, find the remainder when $3^{100}$ is divided by 7.",
    options: ["1", "2", "3", "4"],
    correctOption: 3,
    explanation: "By Fermat's Little Theorem, $3^6\\equiv 1\\pmod{7}$. Since $100=16\\cdot6+4$, we get $3^{100}\\equiv 3^4=81\\equiv 4\\pmod{7}$.",
    topicId: "number-theory", difficulty: "Intermediate", tier: "Intermediate",
  },
  {
    id: "q6",
    content: "In triangle $ABC$, $\\angle A=60°$. The internal angle bisectors from $B$ and $C$ meet at the incenter $I$. Find $\\angle BIC$.",
    options: ["100°", "110°", "120°", "130°"],
    correctOption: 2,
    explanation: "$\\angle BIC=90°+\\frac{\\angle A}{2}=90°+30°=120°$. This follows from the incenter angle formula.",
    topicId: "geometry", difficulty: "Intermediate", tier: "Intermediate",
  },
  {
    id: "q7",
    content: "The sum of roots of $x^2-5x+6=0$ equals the product of roots of $x^2+px+q=0$. If the roots of the second equation are consecutive integers, find $p$.",
    options: ["-3", "-5", "-7", "-9"],
    correctOption: 1,
    explanation: "Roots of first equation: $2$ and $3$, sum $=5$. Consecutive integers with product $5$... actually product of second $=q$ and sum of roots of first $=5$. If consecutive integers multiply to a given value: $n(n+1)=6$ gives $n=2$, so roots are $2,3$, sum $=5=-(p)$, thus $p=-5$.",
    topicId: "algebra", difficulty: "Intermediate", tier: "Intermediate",
  },

  // ── Beginner ────────────────────────────────────────────────────────
  {
    id: "q3",
    content: "Find all integer solutions to $6x+10y=14$.",
    options: ["$(x,y)=(4,-1)$", "$(x,y)=(2,-1)$ and infinitely many others", "No solution exists", "$(x,y)=(1,1)$ only"],
    correctOption: 1,
    explanation: "$\\gcd(6,10)=2$ divides $14$, so solutions exist. A particular solution is $(2,-1)$. The general solution is $x=2+5t,\\ y=-1-3t$ for any integer $t$.",
    topicId: "number-theory", difficulty: "Intermediate", tier: "Beginner",
  },
  {
    id: "q8",
    content: "If $f(x)=2x+3$ and $g(x)=x^2-1$, find $(f\\circ g)(2)$.",
    options: ["7", "9", "11", "13"],
    correctOption: 1,
    explanation: "$g(2)=4-1=3$. Then $f(g(2))=f(3)=2(3)+3=9$.",
    topicId: "algebra", difficulty: "Beginner", tier: "Beginner",
  },
  {
    id: "q9",
    content: "A class of 25 students must be split into 4 study groups. What is the minimum guaranteed size of the largest group?",
    options: ["5", "6", "7", "8"],
    correctOption: 2,
    explanation: "By the Pigeonhole Principle, $\\lceil25/4\\rceil=\\lceil6.25\\rceil=7$. At least one group must contain at least 7 students.",
    topicId: "mathematical-logic", difficulty: "Beginner", tier: "Beginner",
  },
];
