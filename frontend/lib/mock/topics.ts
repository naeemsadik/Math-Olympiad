import type { Topic, Module, Lesson } from "@/types";

// ─── 30 Topics (10 per tier) ──────────────────────────────────────────────────

export const topics: Topic[] = [
  // ── Beginner (School / SSC) ───────────────────────────────────────────────────
  { id: "algebra", slug: "algebra", name: "Algebra", description: "Polynomials, functional equations, and quadratic structures. Master the language of variables and abstract mathematical reasoning.", tier: "Beginner", level: "Beginner", lessonCount: 12, problemCount: 120, color: "#d97706" },
  { id: "mathematical-logic", slug: "mathematical-logic", name: "Mathematical Logic", description: "The cornerstone of proof-based mathematics. Set theory, logical connectives, and the structural integrity of mathematical arguments.", tier: "Beginner", level: "Beginner", lessonCount: 9, problemCount: 60, color: "#be185d" },
  { id: "basic-arithmetic", slug: "basic-arithmetic", name: "Basic Arithmetic", description: "Fundamental number operations, fractions, percentages, and ratio — the foundation every olympiad student must command.", tier: "Beginner", level: "Beginner", lessonCount: 10, problemCount: 80, color: "#0891b2" },
  { id: "plane-geometry", slug: "plane-geometry", name: "Plane Geometry", description: "Triangles, circles, congruence, and similarity in the Euclidean plane. Visual intuition meets rigorous proof.", tier: "Beginner", level: "Beginner", lessonCount: 11, problemCount: 95, color: "#059669" },
  { id: "counting-permutations", slug: "counting-permutations", name: "Counting & Permutations", description: "The multiplication principle, permutations, combinations, and basic counting arguments used in olympiad problem-solving.", tier: "Beginner", level: "Beginner", lessonCount: 8, problemCount: 70, color: "#d97706" },
  { id: "sets-functions", slug: "sets-functions", name: "Sets & Functions", description: "Set operations, Venn diagrams, injective and surjective maps, and function composition — the alphabet of modern mathematics.", tier: "Beginner", level: "Beginner", lessonCount: 9, problemCount: 55, color: "#d97706" },
  { id: "basic-statistics", slug: "basic-statistics", name: "Basic Statistics & Probability", description: "Mean, median, mode, and introductory probability. Learn how randomness and data interact through olympiad-style problems.", tier: "Beginner", level: "Beginner", lessonCount: 8, problemCount: 50, color: "#ec4899" },
  { id: "number-patterns", slug: "number-patterns", name: "Number Patterns & Sequences", description: "Arithmetic and geometric progressions, triangular numbers, Fibonacci sequences, and pattern recognition in competitions.", tier: "Beginner", level: "Beginner", lessonCount: 9, problemCount: 65, color: "#0ea5e9" },
  { id: "word-problems", slug: "word-problems", name: "Word Problems & Puzzles", description: "Translate real-world scenarios into equations. Solve age, distance, work, and mixture problems with algebra and logic.", tier: "Beginner", level: "Beginner", lessonCount: 10, problemCount: 75, color: "#f59e0b" },
  { id: "divisibility-factors", slug: "divisibility-factors", name: "Divisibility & Factors", description: "GCD, LCM, prime factorization, and divisibility rules. The gateway to number theory for beginning olympiad students.", tier: "Beginner", level: "Beginner", lessonCount: 10, problemCount: 85, color: "#10b981" },

  // ── Intermediate (College / HSC) ──────────────────────────────────────────────
  { id: "geometry", slug: "geometry", name: "Geometry", description: "Euclidean constructions, projective geometry, and advanced circle theorems. Visualizing logic through spatial forms.", tier: "Intermediate", level: "Intermediate", lessonCount: 14, problemCount: 98, color: "#f59e0b" },
  { id: "combinatorics", slug: "combinatorics", name: "Combinatorics", description: "Graph theory, pigeonhole principle, and generating functions. Counting the infinite ways elements can be combined.", tier: "Intermediate", level: "Intermediate", lessonCount: 12, problemCount: 88, color: "#059669" },
  { id: "trigonometry", slug: "trigonometry", name: "Trigonometry", description: "Sine, cosine, tangent rules and identities. The bridge between geometry and analysis in olympiad competitions.", tier: "Intermediate", level: "Intermediate", lessonCount: 10, problemCount: 72, color: "#0891b2" },
  { id: "coordinate-geometry", slug: "coordinate-geometry", name: "Coordinate Geometry", description: "Analytic geometry: circles, parabolas, ellipses, and lines. Algebraic methods applied to geometric problems.", tier: "Intermediate", level: "Intermediate", lessonCount: 11, problemCount: 80, color: "#d97706" },
  { id: "probability-theory", slug: "probability-theory", name: "Probability Theory", description: "Conditional probability, Bayes' theorem, combinatorial probability, and expected value in competition problems.", tier: "Intermediate", level: "Intermediate", lessonCount: 10, problemCount: 68, color: "#d97706" },
  { id: "polynomials-equations", slug: "polynomials-equations", name: "Polynomials & Equations", description: "Vieta's formulas, polynomial roots, symmetric functions, and systems of equations for olympiad competition.", tier: "Intermediate", level: "Intermediate", lessonCount: 12, problemCount: 90, color: "#be185d" },
  { id: "complex-numbers", slug: "complex-numbers", name: "Complex Numbers", description: "The Argand plane, polar form, De Moivre's theorem, and roots of unity — powerful tools for geometry and number theory.", tier: "Intermediate", level: "Intermediate", lessonCount: 9, problemCount: 65, color: "#ec4899" },
  { id: "sequences-series", slug: "sequences-series", name: "Sequences & Series", description: "Convergence, telescoping sums, arithmetic-geometric hybrids, and recurrence relations for HSC and olympiad level.", tier: "Intermediate", level: "Intermediate", lessonCount: 11, problemCount: 78, color: "#0ea5e9" },
  { id: "functional-equations", slug: "functional-equations", name: "Functional Equations", description: "Cauchy-type equations, substitution strategies, and the interplay between algebra and analysis in classic olympiad problems.", tier: "Intermediate", level: "Intermediate", lessonCount: 10, problemCount: 74, color: "#f59e0b" },
  { id: "vectors-matrices", slug: "vectors-matrices", name: "Vectors & Matrices", description: "Vector operations, dot and cross products, linear transformations, and matrix algebra in olympiad geometry.", tier: "Intermediate", level: "Intermediate", lessonCount: 10, problemCount: 62, color: "#10b981" },

  // ── Advanced (University & above) ─────────────────────────────────────────────
  { id: "number-theory", slug: "number-theory", name: "Number Theory", description: "Modular arithmetic, Diophantine equations, and prime distribution — the profound properties of integers.", tier: "Advanced", level: "Advanced", lessonCount: 14, problemCount: 110, color: "#0891b2" },
  { id: "inequalities", slug: "inequalities", name: "Inequalities", description: "AM-GM, Cauchy-Schwarz, and Jensen's inequality. Mastery of bounds and extremal values.", tier: "Advanced", level: "Advanced", lessonCount: 10, problemCount: 72, color: "#d97706" },
  { id: "graph-theory", slug: "graph-theory", name: "Graph Theory", description: "Graphs, trees, coloring, Ramsey theory, and extremal graph problems used in BdMO and IMO shortlists.", tier: "Advanced", level: "Advanced", lessonCount: 12, problemCount: 85, color: "#d97706" },
  { id: "abstract-algebra", slug: "abstract-algebra", name: "Abstract Algebra", description: "Groups, rings, and fields. The algebraic structures underlying number theory and competition mathematics.", tier: "Advanced", level: "Advanced", lessonCount: 13, problemCount: 78, color: "#f59e0b" },
  { id: "real-analysis", slug: "real-analysis", name: "Real Analysis", description: "Limits, continuity, sequences of functions, and the epsilon-delta framework powering rigorous olympiad proofs.", tier: "Advanced", level: "Advanced", lessonCount: 11, problemCount: 65, color: "#be185d" },
  { id: "projective-geometry", slug: "projective-geometry", name: "Projective Geometry", description: "Cross-ratio, poles and polars, projective transformations, and inversive geometry in the hardest olympiad problems.", tier: "Advanced", level: "Advanced", lessonCount: 10, problemCount: 60, color: "#059669" },
  { id: "analytic-number-theory", slug: "analytic-number-theory", name: "Analytic Number Theory", description: "Multiplicative functions, Euler's totient, Möbius inversion, and asymptotics of prime counting functions.", tier: "Advanced", level: "Advanced", lessonCount: 12, problemCount: 70, color: "#ec4899" },
  { id: "advanced-combinatorics", slug: "advanced-combinatorics", name: "Advanced Combinatorics", description: "Extremal combinatorics, algebraic methods, probabilistic arguments, and combinatorial game theory.", tier: "Advanced", level: "Advanced", lessonCount: 13, problemCount: 90, color: "#0ea5e9" },
  { id: "proof-techniques", slug: "proof-techniques", name: "Olympiad Proof Techniques", description: "Contradiction, induction, construction, pigeonhole, monovariant, and invariant — every proof strategy for IMO-level problems.", tier: "Advanced", level: "Advanced", lessonCount: 14, problemCount: 100, color: "#f59e0b" },
  { id: "generating-functions", slug: "generating-functions", name: "Generating Functions", description: "Ordinary and exponential generating functions, partition theory, and combinatorial identities for advanced competition math.", tier: "Advanced", level: "Advanced", lessonCount: 10, problemCount: 68, color: "#10b981" },
];

// ─── Modules by topic slug ────────────────────────────────────────────────────

export const topicModulesBySlug: Record<string, Module[]> = {
  "algebra": [
    { id: "alg-m1", topicId: "algebra", name: "Variables & Expressions", description: "Simplifying algebraic expressions, evaluating substitutions, and working with polynomials.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "alg-m2", topicId: "algebra", name: "Linear Equations & Inequalities", description: "Solving one and two-variable equations, graphing solutions, and word-problem translation.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "alg-m3", topicId: "algebra", name: "Quadratics & Factoring", description: "Factoring techniques, the quadratic formula, and discriminant analysis.", difficulty: "Intermediate", lessonCount: 3, order: 3 },
    { id: "alg-m4", topicId: "algebra", name: "Systems of Equations", description: "Substitution, elimination, and Cramer's rule for two and three variable systems.", difficulty: "Intermediate", lessonCount: 3, order: 4 },
  ],
  "mathematical-logic": [
    { id: "ml-m1", topicId: "mathematical-logic", name: "Propositional Logic", description: "Truth tables, logical connectives, tautologies, and formal proof structures.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "ml-m2", topicId: "mathematical-logic", name: "Set Theory Basics", description: "Union, intersection, complement, Venn diagrams, and De Morgan's laws.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "ml-m3", topicId: "mathematical-logic", name: "Proof by Induction", description: "Weak and strong induction, base cases, and inductive step construction.", difficulty: "Intermediate", lessonCount: 3, order: 3 },
  ],
  "basic-arithmetic": [
    { id: "ba-m1", topicId: "basic-arithmetic", name: "Fractions & Decimals", description: "Operations with fractions, converting between forms, and LCM-based simplification.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "ba-m2", topicId: "basic-arithmetic", name: "Percentages & Ratios", description: "Percent change, profit and loss, mixture ratios, and proportion problems.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "ba-m3", topicId: "basic-arithmetic", name: "Mental Math Strategies", description: "Estimation tricks, squaring shortcuts, and calculation under time pressure.", difficulty: "Beginner", lessonCount: 4, order: 3 },
  ],
  "plane-geometry": [
    { id: "pg-m1", topicId: "plane-geometry", name: "Triangles & Congruence", description: "SSS, SAS, ASA congruence, triangle inequality, and interior angles.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "pg-m2", topicId: "plane-geometry", name: "Circles & Angles", description: "Central, inscribed, and arc angles. Tangents, chords, and secants.", difficulty: "Beginner", lessonCount: 4, order: 2 },
    { id: "pg-m3", topicId: "plane-geometry", name: "Area & Perimeter", description: "Areas of polygons and circles, composite figures, and ratio of similar shapes.", difficulty: "Beginner", lessonCount: 4, order: 3 },
  ],
  "counting-permutations": [
    { id: "cp-m1", topicId: "counting-permutations", name: "Multiplication Principle", description: "Fundamental counting principle, tree diagrams, and ordered selections.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "cp-m2", topicId: "counting-permutations", name: "Permutations", description: "Arrangements with and without repetition, circular permutations.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "cp-m3", topicId: "counting-permutations", name: "Combinations & Binomial", description: "Choosing subsets, Pascal's triangle, and basic binomial coefficients.", difficulty: "Intermediate", lessonCount: 2, order: 3 },
  ],
  "sets-functions": [
    { id: "sf-m1", topicId: "sets-functions", name: "Set Operations", description: "Union, intersection, difference, Venn diagrams with 2 and 3 sets.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "sf-m2", topicId: "sets-functions", name: "Functions & Mappings", description: "Domain, codomain, injective, surjective, bijective functions.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "sf-m3", topicId: "sets-functions", name: "Composition & Inverse", description: "Composing functions, inverse functions, and function iteration.", difficulty: "Intermediate", lessonCount: 3, order: 3 },
  ],
  "basic-statistics": [
    { id: "bs-m1", topicId: "basic-statistics", name: "Descriptive Statistics", description: "Mean, median, mode, range, and standard deviation — computing and interpreting.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "bs-m2", topicId: "basic-statistics", name: "Basic Probability", description: "Sample spaces, events, complementary probability, and equally likely outcomes.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "bs-m3", topicId: "basic-statistics", name: "Probability in Counting", description: "Counting favorable outcomes, classical probability, and simple experiments.", difficulty: "Intermediate", lessonCount: 2, order: 3 },
  ],
  "number-patterns": [
    { id: "np-m1", topicId: "number-patterns", name: "Arithmetic Sequences", description: "Common difference, nth term, and sum formulas for arithmetic progressions.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "np-m2", topicId: "number-patterns", name: "Geometric Sequences", description: "Common ratio, nth term, and sum formulas including infinite geometric series.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "np-m3", topicId: "number-patterns", name: "Special Sequences", description: "Fibonacci, triangular numbers, and pattern recognition for olympiad problems.", difficulty: "Intermediate", lessonCount: 3, order: 3 },
  ],
  "word-problems": [
    { id: "wp-m1", topicId: "word-problems", name: "Age & Work Problems", description: "Setting up equations from verbal descriptions of age, work rate, and shared tasks.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "wp-m2", topicId: "word-problems", name: "Distance & Speed", description: "Speed-time-distance problems, meeting problems, and river-boat scenarios.", difficulty: "Beginner", lessonCount: 4, order: 2 },
    { id: "wp-m3", topicId: "word-problems", name: "Mixture & Coin Problems", description: "Alligation, mixture ratios, and coin denomination problems.", difficulty: "Intermediate", lessonCount: 3, order: 3 },
  ],
  "divisibility-factors": [
    { id: "df-m1", topicId: "divisibility-factors", name: "Divisibility Rules", description: "Rules for 2, 3, 4, 5, 6, 9, 11 and their proofs using modular arithmetic.", difficulty: "Beginner", lessonCount: 3, order: 1 },
    { id: "df-m2", topicId: "divisibility-factors", name: "GCD & LCM", description: "Euclidean algorithm, prime factorization, and applications in fraction simplification.", difficulty: "Beginner", lessonCount: 3, order: 2 },
    { id: "df-m3", topicId: "divisibility-factors", name: "Primes & Factorization", description: "Sieve of Eratosthenes, unique factorization theorem, and prime counting.", difficulty: "Intermediate", lessonCount: 4, order: 3 },
  ],
  "geometry": [
    { id: "geo-m1", topicId: "geometry", name: "Circle Theorems", description: "Power of a point, radical axis, and cyclic quadrilaterals.", difficulty: "Intermediate", lessonCount: 4, order: 1 },
    { id: "geo-m2", topicId: "geometry", name: "Triangle Centers", description: "Centroid, incenter, circumcenter, orthocenter, and their remarkable properties.", difficulty: "Intermediate", lessonCount: 4, order: 2 },
    { id: "geo-m3", topicId: "geometry", name: "Similarity & Ratios", description: "Similar triangles, trigonometric cevians, and cross-ratio in geometry.", difficulty: "Intermediate", lessonCount: 3, order: 3 },
    { id: "geo-m4", topicId: "geometry", name: "Constructions & Proofs", description: "Compass-and-straightedge constructions and geometric proof strategies.", difficulty: "Advanced", lessonCount: 3, order: 4 },
  ],
  "combinatorics": [
    { id: "comb-m1", topicId: "combinatorics", name: "Pigeonhole Principle", description: "Basic and generalized pigeonhole, applications in coloring and geometry.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "comb-m2", topicId: "combinatorics", name: "Inclusion-Exclusion", description: "The inclusion-exclusion principle and its applications in counting problems.", difficulty: "Intermediate", lessonCount: 3, order: 2 },
    { id: "comb-m3", topicId: "combinatorics", name: "Graph Theory Intro", description: "Graphs, trees, bipartite graphs, and the handshaking lemma.", difficulty: "Intermediate", lessonCount: 3, order: 3 },
    { id: "comb-m4", topicId: "combinatorics", name: "Generating Functions Intro", description: "Ordinary generating functions and their use in sequence counting.", difficulty: "Advanced", lessonCount: 3, order: 4 },
  ],
  "trigonometry": [
    { id: "trig-m1", topicId: "trigonometry", name: "Trigonometric Ratios", description: "Sin, cos, tan for acute and obtuse angles, unit circle, and special values.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "trig-m2", topicId: "trigonometry", name: "Identities & Formulas", description: "Pythagorean identity, sum and difference formulas, double and half angle.", difficulty: "Intermediate", lessonCount: 3, order: 2 },
    { id: "trig-m3", topicId: "trigonometry", name: "Solving Triangles", description: "Sine rule, cosine rule, and area formula applied to olympiad geometry.", difficulty: "Intermediate", lessonCount: 4, order: 3 },
  ],
  "coordinate-geometry": [
    { id: "cg-m1", topicId: "coordinate-geometry", name: "Lines & Distances", description: "Slope, midpoint, distance formula, and equations of lines.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "cg-m2", topicId: "coordinate-geometry", name: "Circles & Conics", description: "Equations of circles, parabolas, ellipses, and their geometric properties.", difficulty: "Intermediate", lessonCount: 4, order: 2 },
    { id: "cg-m3", topicId: "coordinate-geometry", name: "Intersections & Tangents", description: "Finding intersections of curves and tangent lines using coordinate methods.", difficulty: "Advanced", lessonCount: 4, order: 3 },
  ],
  "probability-theory": [
    { id: "pt-m1", topicId: "probability-theory", name: "Conditional Probability", description: "Conditional probability, independence, and the multiplication rule.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "pt-m2", topicId: "probability-theory", name: "Bayes' Theorem", description: "Bayes' formula, prior and posterior probabilities, and classic applications.", difficulty: "Intermediate", lessonCount: 3, order: 2 },
    { id: "pt-m3", topicId: "probability-theory", name: "Expected Value", description: "Expectation, linearity of expectation, and indicator random variables.", difficulty: "Advanced", lessonCount: 4, order: 3 },
  ],
  "polynomials-equations": [
    { id: "pe-m1", topicId: "polynomials-equations", name: "Roots & Vieta's Formulas", description: "Vieta's relations, symmetric functions of roots, and sum/product identities.", difficulty: "Intermediate", lessonCount: 4, order: 1 },
    { id: "pe-m2", topicId: "polynomials-equations", name: "Polynomial Division", description: "Remainder theorem, factor theorem, and synthetic division.", difficulty: "Intermediate", lessonCount: 3, order: 2 },
    { id: "pe-m3", topicId: "polynomials-equations", name: "Systems & Substitution", description: "Solving symmetric and cyclic systems using substitution and Vieta's formulas.", difficulty: "Advanced", lessonCount: 5, order: 3 },
  ],
  "complex-numbers": [
    { id: "cn-m1", topicId: "complex-numbers", name: "Polar Form & Argand Plane", description: "Modulus, argument, and geometric interpretation of complex numbers.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "cn-m2", topicId: "complex-numbers", name: "De Moivre's Theorem", description: "Powers and roots of complex numbers, nth roots of unity.", difficulty: "Intermediate", lessonCount: 3, order: 2 },
    { id: "cn-m3", topicId: "complex-numbers", name: "Applications in Geometry", description: "Complex number proofs for triangle geometry and rotation arguments.", difficulty: "Advanced", lessonCount: 3, order: 3 },
  ],
  "sequences-series": [
    { id: "ss-m1", topicId: "sequences-series", name: "Recurrence Relations", description: "Linear recurrences, characteristic equations, and Fibonacci-type sequences.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "ss-m2", topicId: "sequences-series", name: "Telescoping Sums", description: "Partial fractions decomposition and telescoping techniques for evaluating sums.", difficulty: "Intermediate", lessonCount: 4, order: 2 },
    { id: "ss-m3", topicId: "sequences-series", name: "Convergence & Limits", description: "Squeeze theorem, ratio test, and convergence of infinite series.", difficulty: "Advanced", lessonCount: 4, order: 3 },
  ],
  "functional-equations": [
    { id: "fe-m1", topicId: "functional-equations", name: "Cauchy's Equation", description: "f(x+y) = f(x)+f(y) and its variants — the classic functional equation family.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "fe-m2", topicId: "functional-equations", name: "Substitution Strategies", description: "Systematic substitution methods: setting x=y, x=0, swapping variables.", difficulty: "Intermediate", lessonCount: 4, order: 2 },
    { id: "fe-m3", topicId: "functional-equations", name: "Olympiad Problems", description: "Classic BdMO and IMO functional equation problems with full solution discussions.", difficulty: "Advanced", lessonCount: 3, order: 3 },
  ],
  "vectors-matrices": [
    { id: "vm-m1", topicId: "vectors-matrices", name: "Vector Operations", description: "Addition, scalar multiplication, dot product, cross product, and geometric interpretation.", difficulty: "Intermediate", lessonCount: 3, order: 1 },
    { id: "vm-m2", topicId: "vectors-matrices", name: "Matrix Algebra", description: "Matrix multiplication, determinants, and inverses for 2×2 and 3×3 matrices.", difficulty: "Intermediate", lessonCount: 4, order: 2 },
    { id: "vm-m3", topicId: "vectors-matrices", name: "Linear Transformations", description: "Rotation, reflection, scaling matrices and their geometric meaning.", difficulty: "Advanced", lessonCount: 3, order: 3 },
  ],
  "number-theory": [
    { id: "mod-arithmetic", topicId: "number-theory", name: "Modular Arithmetic", description: "Master congruences, Fermat's Little Theorem, and the Chinese Remainder Theorem.", difficulty: "Advanced", lessonCount: 4, order: 1 },
    { id: "primes", topicId: "number-theory", name: "Primes & Factorization", description: "Fundamental Theorem of Arithmetic, Sieve of Eratosthenes, and distribution of primes.", difficulty: "Intermediate", lessonCount: 3, order: 2 },
    { id: "diophantine", topicId: "number-theory", name: "Diophantine Equations", description: "Linear and non-linear equations with integer solutions — Pell's Equation and Pythagorean triples.", difficulty: "Elite", lessonCount: 5, order: 3 },
    { id: "nt-adv", topicId: "number-theory", name: "Advanced NT Techniques", description: "Lifting the Exponent Lemma, order of elements mod p, and quadratic residues.", difficulty: "Elite", lessonCount: 4, order: 4 },
  ],
  "inequalities": [
    { id: "ineq-m1", topicId: "inequalities", name: "AM-GM Inequality", description: "AM-GM, weighted AM-GM, and their applications in bounding expressions.", difficulty: "Advanced", lessonCount: 3, order: 1 },
    { id: "ineq-m2", topicId: "inequalities", name: "Cauchy-Schwarz & Holders", description: "Cauchy-Schwarz in Engel/Sedrakyan form and Hölder's inequality.", difficulty: "Advanced", lessonCount: 4, order: 2 },
    { id: "ineq-m3", topicId: "inequalities", name: "SOS & Schur", description: "Sum of squares method, Schur's inequality, and substitution approaches.", difficulty: "Elite", lessonCount: 3, order: 3 },
  ],
  "graph-theory": [
    { id: "gt-m1", topicId: "graph-theory", name: "Graphs & Trees", description: "Connectivity, spanning trees, graph coloring, and Euler's formula.", difficulty: "Advanced", lessonCount: 4, order: 1 },
    { id: "gt-m2", topicId: "graph-theory", name: "Ramsey Theory", description: "Ramsey numbers, graph coloring arguments, and complete subgraph existence.", difficulty: "Advanced", lessonCount: 3, order: 2 },
    { id: "gt-m3", topicId: "graph-theory", name: "Extremal Graph Theory", description: "Turán's theorem, bipartite graphs, and extremal problems in olympiad mathematics.", difficulty: "Elite", lessonCount: 5, order: 3 },
  ],
  "abstract-algebra": [
    { id: "aa-m1", topicId: "abstract-algebra", name: "Group Theory", description: "Groups, subgroups, cosets, Lagrange's theorem, and cyclic groups.", difficulty: "Advanced", lessonCount: 4, order: 1 },
    { id: "aa-m2", topicId: "abstract-algebra", name: "Rings & Fields", description: "Ring axioms, ideals, quotient rings, and field extensions.", difficulty: "Advanced", lessonCount: 4, order: 2 },
    { id: "aa-m3", topicId: "abstract-algebra", name: "Applications in NT", description: "Group-theoretic proofs of Fermat's little theorem, and Galois theory intro.", difficulty: "Elite", lessonCount: 5, order: 3 },
  ],
  "real-analysis": [
    { id: "ra-m1", topicId: "real-analysis", name: "Sequences & Limits", description: "Epsilon-delta definitions, Cauchy sequences, and completeness of the reals.", difficulty: "Advanced", lessonCount: 4, order: 1 },
    { id: "ra-m2", topicId: "real-analysis", name: "Continuity & Derivatives", description: "Intermediate value theorem, mean value theorem, and uniform continuity.", difficulty: "Advanced", lessonCount: 3, order: 2 },
    { id: "ra-m3", topicId: "real-analysis", name: "Series & Convergence", description: "Absolute and conditional convergence, power series, and Taylor's theorem.", difficulty: "Elite", lessonCount: 4, order: 3 },
  ],
  "projective-geometry": [
    { id: "proj-m1", topicId: "projective-geometry", name: "Cross-Ratio & Projective Maps", description: "Cross-ratio invariance, projective transformations, and harmonic conjugates.", difficulty: "Advanced", lessonCount: 3, order: 1 },
    { id: "proj-m2", topicId: "projective-geometry", name: "Poles, Polars & Inversions", description: "Pole-polar duality, inversion in circles, and radical axes.", difficulty: "Advanced", lessonCount: 4, order: 2 },
    { id: "proj-m3", topicId: "projective-geometry", name: "Projective Proofs", description: "Proving classical theorems (Desargues, Pascal, Menelaus) using projective methods.", difficulty: "Elite", lessonCount: 3, order: 3 },
  ],
  "analytic-number-theory": [
    { id: "ant-m1", topicId: "analytic-number-theory", name: "Multiplicative Functions", description: "Euler's totient, number-of-divisors, Möbius function, and multiplicativity.", difficulty: "Advanced", lessonCount: 4, order: 1 },
    { id: "ant-m2", topicId: "analytic-number-theory", name: "Möbius Inversion", description: "Dirichlet convolution, Möbius inversion formula, and applications.", difficulty: "Advanced", lessonCount: 4, order: 2 },
    { id: "ant-m3", topicId: "analytic-number-theory", name: "Prime Distribution", description: "Prime number theorem (heuristics), Bertrand's postulate, and prime gaps.", difficulty: "Elite", lessonCount: 4, order: 3 },
  ],
  "advanced-combinatorics": [
    { id: "ac-m1", topicId: "advanced-combinatorics", name: "Probabilistic Method", description: "Existence proofs using probability: Erdős–Rényi and first-moment method.", difficulty: "Advanced", lessonCount: 4, order: 1 },
    { id: "ac-m2", topicId: "advanced-combinatorics", name: "Algebraic Combinatorics", description: "Linear algebra over finite fields applied to combinatorial problems.", difficulty: "Elite", lessonCount: 4, order: 2 },
    { id: "ac-m3", topicId: "advanced-combinatorics", name: "Combinatorial Game Theory", description: "Sprague-Grundy theorem, Nim, and impartial game analysis.", difficulty: "Elite", lessonCount: 5, order: 3 },
  ],
  "proof-techniques": [
    { id: "pf-m1", topicId: "proof-techniques", name: "Direct & Indirect Proofs", description: "Direct proof, proof by contradiction, contrapositive, and vacuous truth.", difficulty: "Advanced", lessonCount: 4, order: 1 },
    { id: "pf-m2", topicId: "proof-techniques", name: "Invariants & Monovariants", description: "Finding invariants and monovariants in olympiad competition problems.", difficulty: "Advanced", lessonCount: 4, order: 2 },
    { id: "pf-m3", topicId: "proof-techniques", name: "Construction & Extremal", description: "Explicit construction, extremal principle, and greedy algorithm proofs.", difficulty: "Elite", lessonCount: 6, order: 3 },
  ],
  "generating-functions": [
    { id: "gf-m1", topicId: "generating-functions", name: "Ordinary Generating Functions", description: "OGFs for sequences, convolution, and coin-change type problems.", difficulty: "Advanced", lessonCount: 3, order: 1 },
    { id: "gf-m2", topicId: "generating-functions", name: "Exponential Generating Functions", description: "EGFs for labeled structures, exponential formula, and set partitions.", difficulty: "Advanced", lessonCount: 4, order: 2 },
    { id: "gf-m3", topicId: "generating-functions", name: "Partition Theory", description: "Partitions of integers, Euler's pentagonal theorem, and Rogers-Ramanujan.", difficulty: "Elite", lessonCount: 3, order: 3 },
  ],
};

// ─── Lessons by module id ─────────────────────────────────────────────────────

export const lessonsByModuleId: Record<string, Lesson[]> = {
  "alg-m1": [
    {
      id: "alg-m1-l1", moduleId: "alg-m1", order: 1, title: "What is a Variable?", estimatedMinutes: 15,
      content: "A variable is a symbol (usually a letter) that represents an unknown or changing quantity. We simplify expressions by combining like terms — terms that share the same variable part — and applying the distributive law a(b+c) = ab+ac.\n\nFor example, 3x + 2x = 5x. When expressions have multiple variables like 2x + 3y - x + y, group like terms: (2x-x) + (3y+y) = x + 4y.",
      keyPoints: ["Variables represent unknown quantities.", "Like terms share the same variable(s) and can be combined.", "Distributive law: a(b+c) = ab+ac.", "Always simplify fully before solving.", "Evaluate by replacing variables with given values."],
      example: { problem: "Simplify: 4(2x - 3) - 2(x + 5)", solution: "Expand: 8x - 12 - 2x - 10. Combine: 6x - 22." },
      resources: [{ title: "AoPS: Introduction to Algebra", type: "article" }, { title: "Khan Academy: Simplifying Expressions", type: "video" }],
    },
    {
      id: "alg-m1-l2", moduleId: "alg-m1", order: 2, title: "Polynomial Expressions", estimatedMinutes: 20,
      content: "A polynomial is a sum of terms axⁿ with non-negative integer exponents. The degree is the highest exponent. Operations follow arithmetic rules. For binomials: (a+b)(c+d) = ac+ad+bc+bd (FOIL).\n\nKey identities: (a+b)² = a²+2ab+b², (a-b)² = a²-2ab+b², a²-b² = (a+b)(a-b). Memorize these — they appear constantly in olympiad problems.",
      keyPoints: ["Degree = largest exponent.", "FOIL: (a+b)(c+d) = ac+ad+bc+bd.", "Perfect square: (a+b)² = a²+2ab+b².", "Difference of squares: a²-b² = (a+b)(a-b).", "Collect like terms after every multiplication."],
      example: { problem: "Expand: (2x+3)(x-4) + x²", solution: "= 2x²-8x+3x-12+x² = 3x²-5x-12." },
      resources: [{ title: "AoPS Wiki: Polynomials", type: "article" }, { title: "Brilliant: Polynomial Arithmetic", type: "article" }],
    },
    {
      id: "alg-m1-l3", moduleId: "alg-m1", order: 3, title: "Substitution & Evaluation", estimatedMinutes: 15,
      content: "Substitution means replacing a variable with a value. Always wrap the substituted value in parentheses to handle negatives safely. This is critical in olympiad problems where evaluating f(a) - f(b) or finding f given specific conditions.\n\nFor function notation: if f(x) = x²-3x then f(-2) = (-2)²-3(-2) = 4+6 = 10.",
      keyPoints: ["Wrap substituted values in parentheses.", "Evaluate step by step following PEMDAS.", "Look for clever substitutions that simplify.", "f(a)=f(b) may imply a=b or a specific relationship."],
      example: { problem: "If f(x) = x²+2x-1, find f(3)-f(-1).", solution: "f(3) = 9+6-1=14. f(-1) = 1-2-1=-2. Answer: 14-(-2) = 16." },
      resources: [{ title: "Art of Problem Solving: Function Evaluation", type: "article" }],
    },
  ],
  "alg-m3": [
    {
      id: "alg-m3-l1", moduleId: "alg-m3", order: 1, title: "Factoring Quadratics", estimatedMinutes: 20,
      content: "Factoring reverses expansion. For x²+bx+c, find p, q where p+q=b and p·q=c. For ax²+bx+c, find p, q where p+q=b and p·q=ac, then split the middle term.\n\nAlways factor out the GCF first. Verify every factoring by re-expanding. Common patterns: difference of squares a²-b²=(a+b)(a-b), perfect square trinomials.",
      keyPoints: ["Find p+q=b, p·q=c for monic quadratics.", "For ax²+bx+c: find p·q=ac, p+q=b.", "Always pull out GCF first.", "Difference of squares: a²-b²=(a+b)(a-b).", "Verify by expanding."],
      example: { problem: "Factor completely: 2x²-8x-24", solution: "Pull GCF 2: 2(x²-4x-12). Find p+q=-4, pq=-12: p=-6, q=2. Answer: 2(x-6)(x+2)." },
      resources: [{ title: "Khan Academy: Factoring Quadratics", type: "video" }, { title: "AoPS: Factoring Techniques", type: "article" }],
    },
    {
      id: "alg-m3-l2", moduleId: "alg-m3", order: 2, title: "The Quadratic Formula & Discriminant", estimatedMinutes: 20,
      content: "When factoring is hard, use: x = (-b ± √(b²-4ac)) / 2a. The discriminant D = b²-4ac determines root type: D>0 → two distinct reals, D=0 → one repeated root, D<0 → no real roots.\n\nVieta's shortcut: sum of roots = -b/a, product = c/a. For olympiad integer-solution problems, check whether D is a perfect square.",
      keyPoints: ["Quadratic formula: x = (-b ± √D)/2a where D=b²-4ac.", "D>0: two real roots, D=0: repeated, D<0: complex.", "Integer solutions require D to be a perfect square ≥ 0.", "Sum of roots = -b/a, product = c/a."],
      example: { problem: "For which integers k does kx²-6x+3=0 have integer solutions?", solution: "D=36-12k must be a perfect square ≥ 0. k=0: D=36, x=3. k=3: D=0, x=1. Answers: k=0, k=3." },
      resources: [{ title: "AoPS: Quadratic Equations", type: "article" }, { title: "Brilliant: Discriminant", type: "article" }],
    },
    {
      id: "alg-m3-l3", moduleId: "alg-m3", order: 3, title: "Completing the Square", estimatedMinutes: 20,
      content: "Completing the square converts ax²+bx+c to a(x+h)²+k, revealing the vertex and minimum/maximum. For x²+bx: add (b/2)² and subtract it to get (x+b/2)²-(b/2)².\n\nThis technique is key for olympiad optimization: finding the minimum of a quadratic expression. It also proves the AM-GM inequality for two terms.",
      keyPoints: ["x²+bx = (x+b/2)²-(b/2)²", "Minimum of x²+bx+c is c-b²/4 at x=-b/2.", "a>0: (x-h)²+k has minimum k at x=h.", "Used to derive the quadratic formula.", "In olympiads: identify quadratics to find bounds."],
      example: { problem: "Find the minimum value of x²-6x+11.", solution: "(x-3)²-9+11 = (x-3)²+2. Minimum is 2 at x=3." },
      resources: [{ title: "Khan Academy: Completing the Square", type: "video" }],
    },
  ],
  "mod-arithmetic": [
    {
      id: "nt-l1", moduleId: "mod-arithmetic", order: 1, title: "Congruences & Residues", estimatedMinutes: 25,
      content: "a ≡ b (mod m) means m divides a-b. Congruences behave like equalities under addition and multiplication: if a≡b and c≡d (mod m), then a+c≡b+d and ac≡bd (mod m).\n\nResidues mod m form the set {0,1,...,m-1}. Always reduce large numbers to their residue before computing. Powers are computed by reducing exponents using periodicity.",
      keyPoints: ["a≡b (mod m) iff m|(a-b).", "Preserved under +, -, ×.", "Division requires gcd(divisor, m)=1.", "Chinese Remainder Theorem: solve simultaneous congruences.", "Residues cycle; find the period to compute large powers."],
      example: { problem: "Find the last digit of 7^2026.", solution: "7^n mod 10 cycles: 7,9,3,1 (period 4). 2026 mod 4 = 2, so 7^2026 ≡ 7² ≡ 9 (mod 10). Last digit: 9." },
      resources: [{ title: "AoPS Wiki: Modular Arithmetic", type: "article" }, { title: "Brilliant: Congruences", type: "article" }],
    },
    {
      id: "nt-l2", moduleId: "mod-arithmetic", order: 2, title: "Fermat's Little Theorem", estimatedMinutes: 25,
      content: "Fermat's Little Theorem (FLT): If p is prime and p∤a, then a^(p-1) ≡ 1 (mod p). This dramatically reduces power computations mod p: to find a^n mod p, reduce n mod (p-1).\n\nEuler's generalization: a^φ(m) ≡ 1 (mod m) when gcd(a,m)=1. Here φ(m) is Euler's totient — count of integers from 1 to m coprime to m.",
      keyPoints: ["FLT: a^(p-1) ≡ 1 (mod p) for prime p with p∤a.", "To compute a^n mod p: reduce n mod (p-1).", "Euler: a^φ(m) ≡ 1 (mod m) when gcd(a,m)=1.", "φ(p)=p-1, φ(p^k)=p^(k-1)(p-1).", "Wilson: (p-1)! ≡ -1 (mod p)."],
      example: { problem: "Compute 3^100 (mod 7).", solution: "FLT: 3^6≡1 (mod 7). 100=6·16+4, so 3^100≡3^4=81≡4 (mod 7)." },
      resources: [{ title: "AoPS: Fermat's Little Theorem", type: "article" }, { title: "Evan Chen: Number Theory Notes", type: "pdf" }],
    },
    {
      id: "nt-l3", moduleId: "mod-arithmetic", order: 3, title: "Chinese Remainder Theorem", estimatedMinutes: 30,
      content: "CRT: If m₁,...,mₖ are pairwise coprime, then x≡aᵢ(mod mᵢ) has a unique solution mod M=m₁⋯mₖ. Construction: Mᵢ=M/mᵢ, find yᵢ s.t. Mᵢyᵢ≡1(mod mᵢ), then x=Σaᵢ Mᵢyᵢ.\n\nCRT splits hard problems mod M into easier ones mod each mᵢ.",
      keyPoints: ["CRT requires pairwise coprime moduli.", "Unique solution exists mod M=product of moduli.", "Constructive: build x from individual solutions.", "If moduli share factors, solutions may not exist.", "Used extensively in RSA and competitive programming."],
      example: { problem: "Find smallest x: x≡2(mod 3) and x≡3(mod 5).", solution: "x=3k+2. 3k+2≡3(mod 5)→k≡2(mod 5). k=5j+2, x=15j+8. Smallest: x=8." },
      resources: [{ title: "AoPS Wiki: CRT", type: "article" }, { title: "MIT OCW: Number Theory Notes", type: "pdf" }],
    },
    {
      id: "nt-l4", moduleId: "mod-arithmetic", order: 4, title: "Primitive Roots & Order", estimatedMinutes: 30,
      content: "The order of a mod m is the smallest d>0 with a^d≡1(mod m). By FLT, this order divides p-1 for prime p. A primitive root g mod p has order exactly p-1 — every nonzero residue is a power of g.\n\nPrimitive roots exist for primes p, prime powers pᵏ, 2pᵏ, 1, 2, and 4. They are the basis for discrete logarithms.",
      keyPoints: ["ord_m(a) = smallest d with a^d≡1(mod m).", "ord_m(a) divides φ(m).", "g is a primitive root mod p if ord_p(g)=p-1.", "Every prime has a primitive root.", "Used for discrete log — basis of Diffie-Hellman cryptography."],
      example: { problem: "Show 2 is a primitive root mod 5.", solution: "2^1=2, 2^2=4, 2^3=3, 2^4=1 (mod 5). Order=4=φ(5), so 2 is a primitive root." },
      resources: [{ title: "AoPS: Primitive Roots", type: "article" }],
    },
  ],
  "ineq-m1": [
    {
      id: "ineq-l1", moduleId: "ineq-m1", order: 1, title: "AM-GM Inequality", estimatedMinutes: 25,
      content: "AM-GM: For non-negative reals a₁,...,aₙ, (a₁+⋯+aₙ)/n ≥ (a₁⋯aₙ)^(1/n), with equality iff all aᵢ are equal.\n\nWhen minimizing a sum, try to write it so AM-GM applies and the equality condition is achievable. The equality condition tells you when the minimum is achieved.",
      keyPoints: ["AM-GM: (a+b)/2 ≥ √(ab) for non-negative a,b.", "n-variable: arithmetic mean ≥ geometric mean.", "Equality iff all terms are equal.", "To minimize: write so AM-GM applies with achievable equality.", "Weighted AM-GM handles non-symmetric situations."],
      example: { problem: "Show x + 1/x ≥ 2 for x>0.", solution: "AM-GM: x+1/x ≥ 2√(x·1/x) = 2. Equality at x=1." },
      resources: [{ title: "AoPS: AM-GM Inequality", type: "article" }, { title: "Olympiad Inequalities by Thomas Mildorf", type: "pdf" }],
    },
    {
      id: "ineq-l2", moduleId: "ineq-m1", order: 2, title: "Applying AM-GM Strategically", estimatedMinutes: 30,
      content: "The key is grouping terms so the equality condition is compatible with constraints. Reverse-engineer the grouping from the desired bound. Sometimes adding a constant term is needed.\n\nFor symmetric expressions with a+b+c=1 type constraints, apply AM-GM on individual terms. Always verify by checking equality holds at the claimed point.",
      keyPoints: ["Choose groupings compatible with the constraints.", "Adding constants sometimes makes AM-GM sharp.", "Multiple applications: apply AM-GM several times and sum.", "Check equality at the proposed optimal point.", "If equality is impossible, try a different grouping."],
      example: { problem: "For positive reals a+b=1, find minimum of a²+b².", solution: "Since (a+b)²=a²+2ab+b²=1, we have a²+b²=1-2ab. Maximize ab: AM-GM gives ab≤1/4. So min a²+b²=1/2, achieved at a=b=1/2." },
      resources: [{ title: "AoPS: Inequalities Collection", type: "article" }],
    },
    {
      id: "ineq-l3", moduleId: "ineq-m1", order: 3, title: "Weighted AM-GM & Young's Inequality", estimatedMinutes: 25,
      content: "Weighted AM-GM: if wᵢ>0, Σwᵢ=1, then Σwᵢaᵢ ≥ Πaᵢ^wᵢ. Special case p=q=1/2 gives standard AM-GM.\n\nYoung's inequality: for 1/p+1/q=1, ab ≤ a^p/p + b^q/q. This is foundational in analysis (Lp spaces) and is used to prove Hölder's inequality.",
      keyPoints: ["Weighted AM-GM: w₁a₁+⋯+wₙaₙ ≥ a₁^w₁⋯aₙ^wₙ (Σwᵢ=1).", "Young's: ab≤a^p/p+b^q/q for 1/p+1/q=1.", "Weighted AM-GM handles non-symmetric problems.", "Path to Hölder's and Lp norm inequalities."],
      example: { problem: "Prove: ab ≤ a^p/p + b^q/q for 1/p+1/q=1.", solution: "Weighted AM-GM with weights 1/p, 1/q: (1/p)a^p+(1/q)b^q ≥ (a^p)^(1/p)(b^q)^(1/q) = ab." },
      resources: [{ title: "AoPS: Hölder's Inequality", type: "article" }, { title: "Real Analysis Inequalities", type: "pdf" }],
    },
  ],
  "geo-m1": [
    {
      id: "geo-l1", moduleId: "geo-m1", order: 1, title: "Power of a Point", estimatedMinutes: 25,
      content: "Power of a Point: for point P and a circle, if two lines through P intersect the circle at A,B and C,D, then PA·PB = PC·PD. This product is the 'power' of P.\n\nFor external point: power = d²-r² > 0. Tangent from P: PT² = PA·PB. The radical axis is where powers of two circles are equal.",
      keyPoints: ["PA·PB = PC·PD for any two chords through P.", "Tangent-secant: PT² = PA·PB.", "Power = (dist to center)² - r².", "Radical axis: equal power w.r.t. two circles.", "Three circles' radical axes are concurrent (radical center)."],
      example: { problem: "From external P, secant hits circle at A (near, PA=3) and B (far, PB=12). Find PT (tangent length).", solution: "PT² = PA·PB = 36. PT = 6." },
      resources: [{ title: "AoPS: Power of a Point", type: "article" }, { title: "EGMO by Evan Chen", type: "pdf" }],
    },
    {
      id: "geo-l2", moduleId: "geo-m1", order: 2, title: "Cyclic Quadrilaterals", estimatedMinutes: 25,
      content: "A quadrilateral is cyclic iff opposite angles are supplementary: ∠A+∠C = ∠B+∠D = 180°. Ptolemy's theorem: AC·BD = AB·CD + AD·BC for cyclic ABCD.\n\nPtolemy's inequality holds for general quadrilaterals with ≤ instead of =. Equality iff cyclic.",
      keyPoints: ["Cyclic: opposite angles sum to 180°.", "Converse: opposite angles supplementary ⟹ cyclic.", "Ptolemy: AC·BD = AB·CD + AD·BC.", "Ptolemy's inequality for non-cyclic quads.", "Inscribed angle = half central angle on same arc."],
      example: { problem: "Cyclic ABCD with ∠A=110°. Find ∠C.", solution: "∠A+∠C=180°, so ∠C=70°." },
      resources: [{ title: "AoPS: Cyclic Quadrilaterals", type: "article" }, { title: "EGMO Chapter 2", type: "pdf" }],
    },
    {
      id: "geo-l3", moduleId: "geo-m1", order: 3, title: "Radical Axis Theorem", estimatedMinutes: 30,
      content: "The radical axis of two circles is the set of points with equal power to both circles. It is a line perpendicular to the line joining the centers.\n\nFor three circles, the three pairwise radical axes meet at one point — the radical center. This is a powerful tool for proving concurrency in olympiad geometry.",
      keyPoints: ["Radical axis = {P : pow(P,C₁)=pow(P,C₂)}, ⊥ to center line.", "Intersecting circles: radical axis = common chord.", "Tangent circles: radical axis = common tangent.", "Radical center of three circles exists and is unique.", "Used to prove collinearity and concurrency."],
      example: { problem: "Circles C₁ (center (0,0), r=3) and C₂ (center (6,0), r=5). Find the radical axis.", solution: "Power at (x,y): x²+y²-9 = x²-12x+36+y²-25 → 12x=20 → x=5/3. Radical axis: x=5/3." },
      resources: [{ title: "AoPS: Radical Axis", type: "article" }],
    },
    {
      id: "geo-l4", moduleId: "geo-m1", order: 4, title: "Inversion in Circles", estimatedMinutes: 35,
      content: "Inversion with center O and radius r maps point P to P' on ray OP with OP·OP'=r². It converts circles to lines and vice versa when they pass through O, drastically simplifying tangency configurations.\n\nKey: inversion is angle-preserving (conformal). Circles not through O map to circles. Used to eliminate tangency conditions in IMO-level geometry problems.",
      keyPoints: ["P maps to P' with OP·OP'=r².", "Circles through O → lines; not through O → circles.", "Conformal: preserves angles.", "Kills tangency conditions — choose inversion center at tangent point.", "After inverting, prove simpler statement and invert back."],
      example: { problem: "Three mutually tangent circles all tangent to a line. Describe the configuration after inversion at the tangent point of two of them.", solution: "The tangent point maps to infinity; the two tangent circles become parallel lines. The third circle becomes a circle between the two lines — the problem reduces to a simple configuration." },
      resources: [{ title: "AoPS: Inversion", type: "article" }, { title: "EGMO: Inversion Chapter", type: "pdf" }],
    },
  ],
  "comb-m1": [
    {
      id: "comb-l1", moduleId: "comb-m1", order: 1, title: "The Pigeonhole Principle", estimatedMinutes: 20,
      content: "If n+1 objects are placed into n boxes, at least one box contains ≥ 2 objects. Generalized: m objects into n boxes → some box has ≥ ⌈m/n⌉ objects.\n\nThe hard part in olympiad problems is identifying the correct 'pigeons' and 'holes'. PHP proves existence without constructing the example.",
      keyPoints: ["n+1 objects, n boxes → some box has ≥ 2.", "Generalized: m objects, n boxes → some box has ≥ ⌈m/n⌉.", "Identify the pigeons and holes creatively.", "PHP proves existence — no construction needed.", "Often combined with coloring or residue arguments."],
      example: { problem: "Among 13 people, show at least two share a birth month.", solution: "12 months (holes), 13 people (pigeons). By PHP, two share a month." },
      resources: [{ title: "AoPS: Pigeonhole Principle", type: "article" }, { title: "Brilliant: Pigeonhole", type: "article" }],
    },
    {
      id: "comb-l2", moduleId: "comb-m1", order: 2, title: "PHP in Number Theory", estimatedMinutes: 25,
      content: "Among n+1 integers, two have the same residue mod n, so their difference is divisible by n. This powers many divisibility results.\n\nAmong 2n-1 integers, n have sum divisible by n (Erdős–Ginzburg–Ziv theorem). This is a deeper PHP application.",
      keyPoints: ["Among n+1 integers, two share a residue mod n.", "Among m consecutive integers, exactly one divisible by m.", "EGZ: among 2n-1 integers, n sum to 0 mod n.", "Residue classes are the 'holes' in number-theoretic PHP."],
      example: { problem: "Among any 6 integers, two have difference divisible by 5.", solution: "5 residue classes mod 5. With 6 integers, two share a class. Their difference is divisible by 5." },
      resources: [{ title: "AoPS: PHP in Number Theory", type: "article" }],
    },
    {
      id: "comb-l3", moduleId: "comb-m1", order: 3, title: "PHP in Geometry", estimatedMinutes: 25,
      content: "Divide a region into n sub-regions. Any n+1 points have two in the same sub-region, at most diameter d apart. This proves existence of close points or specific configurations.\n\nAngular version: divide angles into arcs; PHP guarantees two points in the same arc.",
      keyPoints: ["Divide region into n pieces; n+1 points → two in same piece.", "Distance bound: sub-region diameter bounds distance.", "Angular PHP for point distribution on circles.", "PHP + convexity gives strong geometric results."],
      example: { problem: "5 points inside unit equilateral triangle. Show two are within 1/2 of each other.", solution: "Divide into 4 equilateral triangles of side 1/2. PHP: two of 5 points share a small triangle. Diameter = 1/2, so they're at most 1/2 apart." },
      resources: [{ title: "AoPS: PHP in Geometry", type: "article" }, { title: "Brilliant: Geometric PHP", type: "article" }],
    },
  ],
  "df-m2": [
    {
      id: "df-l1", moduleId: "df-m2", order: 1, title: "GCD and the Euclidean Algorithm", estimatedMinutes: 20,
      content: "GCD(a, b) is the largest integer dividing both. Euclidean algorithm: gcd(a,b) = gcd(b, a mod b), stop when remainder is 0. Runs in O(log min(a,b)) steps.\n\nBézout's theorem: there exist integers x, y with ax+by = gcd(a,b). The Extended Euclidean Algorithm finds these x, y.",
      keyPoints: ["gcd(a,b) = gcd(b, a mod b); stop when remainder 0.", "Bézout: ax+by=gcd(a,b) has integer solutions.", "Extended Euclidean finds x, y explicitly.", "gcd(a,b)·lcm(a,b) = a·b.", "gcd(a,0) = a."],
      example: { problem: "Find gcd(252, 105).", solution: "252=2·105+42 → gcd(105,42). 105=2·42+21 → gcd(42,21). 42=2·21+0. GCD = 21." },
      resources: [{ title: "AoPS: Euclidean Algorithm", type: "article" }, { title: "Khan Academy: GCD", type: "video" }],
    },
    {
      id: "df-l2", moduleId: "df-m2", order: 2, title: "LCM and Prime Factorization", estimatedMinutes: 20,
      content: "LCM(a, b) is the smallest positive multiple of both. From prime factorizations: GCD takes minimum exponents, LCM takes maximum. So gcd·lcm = a·b.\n\nLCM appears in problems about periodic events coinciding (clock problems) and proving certain expressions are integers.",
      keyPoints: ["lcm(a,b) = a·b/gcd(a,b).", "From factorization: GCD=min exponents, LCM=max exponents.", "lcm is associative.", "Clock problems: when do events next coincide? Answer: their LCM.", "n!/k!(n-k)! is integer because of LCM relationships."],
      example: { problem: "Find lcm(18, 24).", solution: "18=2·3², 24=2³·3. gcd=2·3=6. lcm=2³·3²=72. Or: lcm=18·24/6=72." },
      resources: [{ title: "AoPS: LCM", type: "article" }],
    },
    {
      id: "df-l3", moduleId: "df-m2", order: 3, title: "GCD/LCM in Olympiad Problems", estimatedMinutes: 25,
      content: "Key olympiad tools: (1) If gcd(a,b)=1, then a|c and b|c imply ab|c. (2) gcd(a^n-1, a^m-1) = a^(gcd(n,m))-1 for a≥2. (3) Linear combinations: gcd(a,b) is the smallest positive value of ax+by.\n\nProperty (2) appears in BdMO and IMO problems involving perfect powers.",
      keyPoints: ["gcd(a,b)=1, a|c, b|c ⟹ ab|c.", "gcd(a^n-1, a^m-1) = a^(gcd(n,m))-1.", "gcd is smallest positive linear combination of a,b.", "Chicken McNugget: largest non-representable as pa+qb is ab-a-b.", "If gcd(a,b)=1, then a and b are 'independent' in divisibility."],
      example: { problem: "Prove gcd(5^m-1, 5^n-1) = 5^(gcd(m,n))-1.", solution: "Let d=gcd(m,n). 5^d-1 divides both (since x^a-1 divides x^(ab)-1). Any common divisor divides 5^d-1 by the Euclidean property on exponents." },
      resources: [{ title: "AoPS: GCD Applications", type: "article" }, { title: "BdMO Number Theory Archive", type: "pdf" }],
    },
  ],
};

// backward compat — number-theory had a named export
export const numberTheoryModules = topicModulesBySlug["number-theory"];
