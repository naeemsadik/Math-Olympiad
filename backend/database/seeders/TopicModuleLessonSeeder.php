<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Module;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TopicModuleLessonSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->seedTopics();
            $this->seedModules();
            $this->seedLessons();
        });
    }

    protected function seedTopics(): void
    {
        $topics = [
            ['slug' => 'algebra', 'name' => 'Algebra', 'description' => 'Polynomials, functional equations, and quadratic structures.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#d97706', 'lesson_count' => 12, 'problem_count' => 120],
            ['slug' => 'mathematical-logic', 'name' => 'Mathematical Logic', 'description' => 'Set theory, logical connectives, and proof structures.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#be185d', 'lesson_count' => 9, 'problem_count' => 60],
            ['slug' => 'basic-arithmetic', 'name' => 'Basic Arithmetic', 'description' => 'Number operations, fractions, percentages, and ratios.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#0891b2', 'lesson_count' => 10, 'problem_count' => 80],
            ['slug' => 'plane-geometry', 'name' => 'Plane Geometry', 'description' => 'Triangles, circles, congruence, and similarity.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#059669', 'lesson_count' => 11, 'problem_count' => 95],
            ['slug' => 'counting-permutations', 'name' => 'Counting & Permutations', 'description' => 'Multiplication principle, permutations, combinations.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#d97706', 'lesson_count' => 8, 'problem_count' => 70],
            ['slug' => 'sets-functions', 'name' => 'Sets & Functions', 'description' => 'Set operations and function composition.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#d97706', 'lesson_count' => 9, 'problem_count' => 55],
            ['slug' => 'basic-statistics', 'name' => 'Basic Statistics & Probability', 'description' => 'Mean, median, mode, and introductory probability.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#ec4899', 'lesson_count' => 8, 'problem_count' => 50],
            ['slug' => 'number-patterns', 'name' => 'Number Patterns & Sequences', 'description' => 'Arithmetic and geometric progressions and pattern recognition.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#0ea5e9', 'lesson_count' => 9, 'problem_count' => 65],
            ['slug' => 'word-problems', 'name' => 'Word Problems & Puzzles', 'description' => 'Age, distance, work, and mixture problems.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#f59e0b', 'lesson_count' => 10, 'problem_count' => 75],
            ['slug' => 'divisibility-factors', 'name' => 'Divisibility & Factors', 'description' => 'GCD, LCM, prime factorization, divisibility rules.', 'tier' => 'Beginner', 'level' => 'Beginner', 'color' => '#10b981', 'lesson_count' => 10, 'problem_count' => 85],
            ['slug' => 'geometry', 'name' => 'Geometry', 'description' => 'Euclidean constructions, projective geometry, advanced circle theorems.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#f59e0b', 'lesson_count' => 14, 'problem_count' => 98],
            ['slug' => 'combinatorics', 'name' => 'Combinatorics', 'description' => 'Graph theory, pigeonhole, generating functions.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#059669', 'lesson_count' => 12, 'problem_count' => 88],
            ['slug' => 'trigonometry', 'name' => 'Trigonometry', 'description' => 'Sine, cosine, tangent rules and identities.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#0891b2', 'lesson_count' => 10, 'problem_count' => 72],
            ['slug' => 'coordinate-geometry', 'name' => 'Coordinate Geometry', 'description' => 'Analytic geometry of circles, parabolas, ellipses.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#d97706', 'lesson_count' => 11, 'problem_count' => 80],
            ['slug' => 'probability-theory', 'name' => 'Probability Theory', 'description' => 'Conditional probability, Bayes, expected value.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#d97706', 'lesson_count' => 10, 'problem_count' => 68],
            ['slug' => 'polynomials-equations', 'name' => 'Polynomials & Equations', 'description' => 'Vieta, polynomial roots, systems of equations.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#be185d', 'lesson_count' => 12, 'problem_count' => 90],
            ['slug' => 'complex-numbers', 'name' => 'Complex Numbers', 'description' => 'Argand plane, polar form, De Moivre, roots of unity.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#ec4899', 'lesson_count' => 9, 'problem_count' => 65],
            ['slug' => 'sequences-series', 'name' => 'Sequences & Series', 'description' => 'Convergence, telescoping sums, recurrence relations.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#0ea5e9', 'lesson_count' => 11, 'problem_count' => 78],
            ['slug' => 'functional-equations', 'name' => 'Functional Equations', 'description' => 'Cauchy equations, substitution strategies.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#f59e0b', 'lesson_count' => 10, 'problem_count' => 74],
            ['slug' => 'vectors-matrices', 'name' => 'Vectors & Matrices', 'description' => 'Vector operations, dot and cross products, matrix algebra.', 'tier' => 'Intermediate', 'level' => 'Intermediate', 'color' => '#10b981', 'lesson_count' => 10, 'problem_count' => 62],
            ['slug' => 'number-theory', 'name' => 'Number Theory', 'description' => 'Modular arithmetic, Diophantine equations, prime distribution.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#0891b2', 'lesson_count' => 14, 'problem_count' => 110],
            ['slug' => 'inequalities', 'name' => 'Inequalities', 'description' => 'AM-GM, Cauchy-Schwarz, Jensen, SOS, Schur.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#d97706', 'lesson_count' => 10, 'problem_count' => 72],
            ['slug' => 'graph-theory', 'name' => 'Graph Theory', 'description' => 'Graphs, trees, coloring, Ramsey theory.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#d97706', 'lesson_count' => 12, 'problem_count' => 85],
            ['slug' => 'abstract-algebra', 'name' => 'Abstract Algebra', 'description' => 'Groups, rings, fields, and algebraic structures.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#f59e0b', 'lesson_count' => 13, 'problem_count' => 78],
            ['slug' => 'real-analysis', 'name' => 'Real Analysis', 'description' => 'Limits, continuity, epsilon-delta, sequences of functions.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#be185d', 'lesson_count' => 11, 'problem_count' => 65],
            ['slug' => 'projective-geometry', 'name' => 'Projective Geometry', 'description' => 'Cross-ratio, poles and polars, projective transformations.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#059669', 'lesson_count' => 10, 'problem_count' => 60],
            ['slug' => 'analytic-number-theory', 'name' => 'Analytic Number Theory', 'description' => 'Multiplicative functions, Möbius inversion, prime asymptotics.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#ec4899', 'lesson_count' => 12, 'problem_count' => 70],
            ['slug' => 'advanced-combinatorics', 'name' => 'Advanced Combinatorics', 'description' => 'Extremal combinatorics, probabilistic method, game theory.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#0ea5e9', 'lesson_count' => 13, 'problem_count' => 90],
            ['slug' => 'proof-techniques', 'name' => 'Olympiad Proof Techniques', 'description' => 'Contradiction, induction, construction, pigeonhole, invariants.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#f59e0b', 'lesson_count' => 14, 'problem_count' => 100],
            ['slug' => 'generating-functions', 'name' => 'Generating Functions', 'description' => 'OGFs, EGFs, partition theory, combinatorial identities.', 'tier' => 'Advanced', 'level' => 'Advanced', 'color' => '#10b981', 'lesson_count' => 10, 'problem_count' => 68],
        ];

        foreach ($topics as $i => $t) {
            Topic::updateOrCreate(['slug' => $t['slug']], $t);
        }
    }

    protected function seedModules(): void
    {
        $modules = [
            ['slug' => 'algebra', 'name' => 'Variables & Expressions', 'description' => 'Simplifying expressions, evaluating substitutions, and polynomials.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'algebra', 'name' => 'Linear Equations & Inequalities', 'description' => 'Solving equations, graphing solutions, and word-problem translation.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'algebra', 'name' => 'Quadratics & Factoring', 'description' => 'Factoring techniques, the quadratic formula, discriminant analysis.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'algebra', 'name' => 'Systems of Equations', 'description' => 'Substitution, elimination, Cramer\'s rule for variable systems.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 4],
            ['slug' => 'mathematical-logic', 'name' => 'Propositional Logic', 'description' => 'Truth tables, logical connectives, tautologies, formal proofs.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'mathematical-logic', 'name' => 'Set Theory Basics', 'description' => 'Union, intersection, complement, Venn diagrams, De Morgan.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'mathematical-logic', 'name' => 'Proof by Induction', 'description' => 'Weak and strong induction, base cases, inductive steps.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'basic-arithmetic', 'name' => 'Fractions & Decimals', 'description' => 'Operations with fractions, conversions, LCM simplification.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'basic-arithmetic', 'name' => 'Percentages & Ratios', 'description' => 'Percent change, profit and loss, mixture ratios.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'basic-arithmetic', 'name' => 'Mental Math Strategies', 'description' => 'Estimation tricks, squaring shortcuts, calculation speed.', 'difficulty' => 'Beginner', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'plane-geometry', 'name' => 'Triangles & Congruence', 'description' => 'SSS, SAS, ASA congruence, triangle inequality, interior angles.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'plane-geometry', 'name' => 'Circles & Angles', 'description' => 'Central, inscribed, and arc angles; tangents, chords, secants.', 'difficulty' => 'Beginner', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'plane-geometry', 'name' => 'Area & Perimeter', 'description' => 'Areas of polygons, composite figures, similar-shape ratios.', 'difficulty' => 'Beginner', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'counting-permutations', 'name' => 'Multiplication Principle', 'description' => 'Fundamental counting principle, tree diagrams.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'counting-permutations', 'name' => 'Permutations', 'description' => 'Arrangements with and without repetition, circular permutations.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'counting-permutations', 'name' => 'Combinations & Binomial', 'description' => 'Choosing subsets, Pascal\'s triangle, binomial coefficients.', 'difficulty' => 'Intermediate', 'lesson_count' => 2, 'order' => 3],
            ['slug' => 'sets-functions', 'name' => 'Set Operations', 'description' => 'Union, intersection, difference, Venn diagrams.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'sets-functions', 'name' => 'Functions & Mappings', 'description' => 'Domain, codomain, injective, surjective, bijective functions.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'sets-functions', 'name' => 'Composition & Inverse', 'description' => 'Composing functions, inverses, function iteration.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'number-patterns', 'name' => 'Arithmetic Sequences', 'description' => 'Common difference, nth term, sum formulas for APs.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'number-patterns', 'name' => 'Geometric Sequences', 'description' => 'Common ratio, nth term, infinite geometric series.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'number-patterns', 'name' => 'Special Sequences', 'description' => 'Fibonacci, triangular numbers, pattern recognition.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'word-problems', 'name' => 'Age & Work Problems', 'description' => 'Equations from verbal descriptions of age, work, shared tasks.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'word-problems', 'name' => 'Distance & Speed', 'description' => 'Speed-time-distance, meeting problems, river-boat scenarios.', 'difficulty' => 'Beginner', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'word-problems', 'name' => 'Mixture & Coin Problems', 'description' => 'Alligation, mixture ratios, coin denomination problems.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'divisibility-factors', 'name' => 'Divisibility Rules', 'description' => 'Rules for 2, 3, 4, 5, 6, 9, 11 and their proofs.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'divisibility-factors', 'name' => 'GCD & LCM', 'description' => 'Euclidean algorithm, prime factorization, fraction simplification.', 'difficulty' => 'Beginner', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'divisibility-factors', 'name' => 'Primes & Factorization', 'description' => 'Sieve of Eratosthenes, unique factorization, prime counting.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'geometry', 'name' => 'Circle Theorems', 'description' => 'Power of a point, radical axis, cyclic quadrilaterals.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'geometry', 'name' => 'Triangle Centers', 'description' => 'Centroid, incenter, circumcenter, orthocenter.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'geometry', 'name' => 'Similarity & Ratios', 'description' => 'Similar triangles, trigonometric cevians, cross-ratio.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'geometry', 'name' => 'Constructions & Proofs', 'description' => 'Compass-and-straightedge constructions and proof strategies.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 4],
            ['slug' => 'combinatorics', 'name' => 'Pigeonhole Principle', 'description' => 'Basic and generalized PHP, applications in coloring and geometry.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'combinatorics', 'name' => 'Inclusion-Exclusion', 'description' => 'The inclusion-exclusion principle in counting problems.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'combinatorics', 'name' => 'Graph Theory Intro', 'description' => 'Graphs, trees, bipartite graphs, handshaking lemma.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'combinatorics', 'name' => 'Generating Functions Intro', 'description' => 'Ordinary generating functions for sequence counting.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 4],
            ['slug' => 'trigonometry', 'name' => 'Trigonometric Ratios', 'description' => 'Sin, cos, tan for acute/obtuse angles, unit circle, special values.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'trigonometry', 'name' => 'Identities & Formulas', 'description' => 'Pythagorean, sum/difference, double/half angle formulas.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'trigonometry', 'name' => 'Solving Triangles', 'description' => 'Sine rule, cosine rule, area formula in olympiad geometry.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'coordinate-geometry', 'name' => 'Lines & Distances', 'description' => 'Slope, midpoint, distance formula, equations of lines.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'coordinate-geometry', 'name' => 'Circles & Conics', 'description' => 'Equations of circles, parabolas, ellipses, and properties.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'coordinate-geometry', 'name' => 'Intersections & Tangents', 'description' => 'Finding intersections and tangent lines via coordinates.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'probability-theory', 'name' => 'Conditional Probability', 'description' => 'Conditional probability, independence, multiplication rule.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'probability-theory', 'name' => 'Bayes\' Theorem', 'description' => 'Bayes\' formula, prior/posterior probabilities, applications.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'probability-theory', 'name' => 'Expected Value', 'description' => 'Expectation, linearity, indicator random variables.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'polynomials-equations', 'name' => 'Roots & Vieta\'s Formulas', 'description' => 'Vieta\'s relations, symmetric functions of roots.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'polynomials-equations', 'name' => 'Polynomial Division', 'description' => 'Remainder theorem, factor theorem, synthetic division.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'polynomials-equations', 'name' => 'Systems & Substitution', 'description' => 'Solving symmetric/cyclic systems using substitution and Vieta.', 'difficulty' => 'Advanced', 'lesson_count' => 5, 'order' => 3],
            ['slug' => 'complex-numbers', 'name' => 'Polar Form & Argand Plane', 'description' => 'Modulus, argument, geometric interpretation.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'complex-numbers', 'name' => 'De Moivre\'s Theorem', 'description' => 'Powers/roots of complex numbers, nth roots of unity.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'complex-numbers', 'name' => 'Applications in Geometry', 'description' => 'Complex number proofs for triangle geometry and rotation.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'sequences-series', 'name' => 'Recurrence Relations', 'description' => 'Linear recurrences, characteristic equations, Fibonacci-type sequences.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'sequences-series', 'name' => 'Telescoping Sums', 'description' => 'Partial fractions and telescoping for evaluating sums.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'sequences-series', 'name' => 'Convergence & Limits', 'description' => 'Squeeze theorem, ratio test, convergence of series.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'functional-equations', 'name' => 'Cauchy\'s Equation', 'description' => 'f(x+y) = f(x)+f(y) and its variants.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'functional-equations', 'name' => 'Substitution Strategies', 'description' => 'Systematic substitutions: x=y, x=0, swapping variables.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'functional-equations', 'name' => 'Olympiad Problems', 'description' => 'Classic BdMO and IMO functional equation problems.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'vectors-matrices', 'name' => 'Vector Operations', 'description' => 'Addition, scalar multiplication, dot/cross product, geometry.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'vectors-matrices', 'name' => 'Matrix Algebra', 'description' => 'Matrix multiplication, determinants, inverses for 2x2/3x3 matrices.', 'difficulty' => 'Intermediate', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'vectors-matrices', 'name' => 'Linear Transformations', 'description' => 'Rotation, reflection, scaling matrices and their meaning.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'number-theory', 'name' => 'Modular Arithmetic', 'description' => 'Congruences, Fermat\'s Little Theorem, Chinese Remainder Theorem.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'number-theory', 'name' => 'Primes & Factorization', 'description' => 'Fundamental Theorem of Arithmetic, Sieve of Eratosthenes.', 'difficulty' => 'Intermediate', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'number-theory', 'name' => 'Diophantine Equations', 'description' => 'Integer-solution equations: Pell, Pythagorean triples.', 'difficulty' => 'Elite', 'lesson_count' => 5, 'order' => 3],
            ['slug' => 'number-theory', 'name' => 'Advanced NT Techniques', 'description' => 'Lifting the Exponent Lemma, order mod p, quadratic residues.', 'difficulty' => 'Elite', 'lesson_count' => 4, 'order' => 4],
            ['slug' => 'inequalities', 'name' => 'AM-GM Inequality', 'description' => 'AM-GM, weighted AM-GM, applications in bounding.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'inequalities', 'name' => 'Cauchy-Schwarz & Holders', 'description' => 'Cauchy-Schwarz in Engel/Sedrakyan form and Holder.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'inequalities', 'name' => 'SOS & Schur', 'description' => 'Sum of squares method, Schur\'s inequality, substitution.', 'difficulty' => 'Elite', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'graph-theory', 'name' => 'Graphs & Trees', 'description' => 'Connectivity, spanning trees, graph coloring, Euler\'s formula.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'graph-theory', 'name' => 'Ramsey Theory', 'description' => 'Ramsey numbers, graph coloring, complete subgraphs.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'graph-theory', 'name' => 'Extremal Graph Theory', 'description' => 'Turán\'s theorem, bipartite graphs, extremal problems.', 'difficulty' => 'Elite', 'lesson_count' => 5, 'order' => 3],
            ['slug' => 'abstract-algebra', 'name' => 'Group Theory', 'description' => 'Groups, subgroups, cosets, Lagrange\'s theorem, cyclic groups.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'abstract-algebra', 'name' => 'Rings & Fields', 'description' => 'Ring axioms, ideals, quotient rings, field extensions.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'abstract-algebra', 'name' => 'Applications in NT', 'description' => 'Group-theoretic proofs of Fermat\'s little theorem, Galois intro.', 'difficulty' => 'Elite', 'lesson_count' => 5, 'order' => 3],
            ['slug' => 'real-analysis', 'name' => 'Sequences & Limits', 'description' => 'Epsilon-delta, Cauchy sequences, completeness of reals.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'real-analysis', 'name' => 'Continuity & Derivatives', 'description' => 'IVT, MVT, uniform continuity.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 2],
            ['slug' => 'real-analysis', 'name' => 'Series & Convergence', 'description' => 'Absolute/conditional convergence, power series, Taylor.', 'difficulty' => 'Elite', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'projective-geometry', 'name' => 'Cross-Ratio & Projective Maps', 'description' => 'Cross-ratio invariance, projective transformations, harmonic conjugates.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'projective-geometry', 'name' => 'Poles, Polars & Inversions', 'description' => 'Pole-polar duality, inversion in circles, radical axes.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'projective-geometry', 'name' => 'Projective Proofs', 'description' => 'Proving classical theorems with projective methods.', 'difficulty' => 'Elite', 'lesson_count' => 3, 'order' => 3],
            ['slug' => 'analytic-number-theory', 'name' => 'Multiplicative Functions', 'description' => 'Euler totient, divisors, Möbius function, multiplicativity.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'analytic-number-theory', 'name' => 'Möbius Inversion', 'description' => 'Dirichlet convolution, Möbius inversion formula.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'analytic-number-theory', 'name' => 'Prime Distribution', 'description' => 'PNT heuristics, Bertrand\'s postulate, prime gaps.', 'difficulty' => 'Elite', 'lesson_count' => 4, 'order' => 3],
            ['slug' => 'advanced-combinatorics', 'name' => 'Probabilistic Method', 'description' => 'Erdos-Renyi and first-moment method existence proofs.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'advanced-combinatorics', 'name' => 'Algebraic Combinatorics', 'description' => 'Linear algebra over finite fields in combinatorics.', 'difficulty' => 'Elite', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'advanced-combinatorics', 'name' => 'Combinatorial Game Theory', 'description' => 'Sprague-Grundy, Nim, impartial game analysis.', 'difficulty' => 'Elite', 'lesson_count' => 5, 'order' => 3],
            ['slug' => 'proof-techniques', 'name' => 'Direct & Indirect Proofs', 'description' => 'Direct, contradiction, contrapositive, vacuous truth.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 1],
            ['slug' => 'proof-techniques', 'name' => 'Invariants & Monovariants', 'description' => 'Finding invariants and monovariants in olympiad problems.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'proof-techniques', 'name' => 'Construction & Extremal', 'description' => 'Explicit construction, extremal principle, greedy proofs.', 'difficulty' => 'Elite', 'lesson_count' => 6, 'order' => 3],
            ['slug' => 'generating-functions', 'name' => 'Ordinary Generating Functions', 'description' => 'OGFs for sequences, convolution, coin-change problems.', 'difficulty' => 'Advanced', 'lesson_count' => 3, 'order' => 1],
            ['slug' => 'generating-functions', 'name' => 'Exponential Generating Functions', 'description' => 'EGFs for labeled structures, exponential formula, set partitions.', 'difficulty' => 'Advanced', 'lesson_count' => 4, 'order' => 2],
            ['slug' => 'generating-functions', 'name' => 'Partition Theory', 'description' => 'Integer partitions, Euler pentagonal theorem, Rogers-Ramanujan.', 'difficulty' => 'Elite', 'lesson_count' => 3, 'order' => 3],
        ];

        foreach ($modules as $m) {
            $topic = Topic::where('slug', $m['slug'])->first();
            if (! $topic) continue;
            Module::updateOrCreate(
                ['topic_id' => $topic->id, 'name' => $m['name']],
                [
                    'description' => $m['description'],
                    'difficulty' => $m['difficulty'],
                    'lesson_count' => $m['lesson_count'],
                    'order' => $m['order'],
                ]
            );
        }
    }

    protected function seedLessons(): void
    {
        $lessons = [
            // algebra modules
            ['topic' => 'algebra', 'module' => 'Variables & Expressions', 'title' => 'What is a Variable?', 'minutes' => 15, 'order' => 1, 'content' => "A variable is a symbol (usually a letter) that represents an unknown or changing quantity. We simplify expressions by combining like terms — terms that share the same variable part — and applying the distributive law a(b+c) = ab+ac.\n\nFor example, 3x + 2x = 5x. When expressions have multiple variables like 2x + 3y - x + y, group like terms: (2x-x) + (3y+y) = x + 4y."],
            ['topic' => 'algebra', 'module' => 'Variables & Expressions', 'title' => 'Polynomial Expressions', 'minutes' => 20, 'order' => 2, 'content' => "A polynomial is a sum of terms axⁿ with non-negative integer exponents. The degree is the highest exponent. Operations follow arithmetic rules. For binomials: (a+b)(c+d) = ac+ad+bc+bd (FOIL).\n\nKey identities: (a+b)² = a²+2ab+b², (a-b)² = a²-2ab+b², a²-b² = (a+b)(a-b). Memorize these — they appear constantly in olympiad problems."],
            ['topic' => 'algebra', 'module' => 'Variables & Expressions', 'title' => 'Substitution & Evaluation', 'minutes' => 15, 'order' => 3, 'content' => "Substitution means replacing a variable with a value. Always wrap the substituted value in parentheses to handle negatives safely. This is critical in olympiad problems where evaluating f(a) - f(b) or finding f given specific conditions.\n\nFor function notation: if f(x) = x²-3x then f(-2) = (-2)²-3(-2) = 4+6 = 10."],
            // number theory
            ['topic' => 'number-theory', 'module' => 'Modular Arithmetic', 'title' => 'Congruences & Residues', 'minutes' => 25, 'order' => 1, 'content' => "a ≡ b (mod m) means m divides a-b. Congruences behave like equalities under addition and multiplication: if a≡b and c≡d (mod m), then a+c≡b+d and ac≡bd (mod m).\n\nResidues mod m form the set {0,1,...,m-1}. Always reduce large numbers to their residue before computing. Powers are computed by reducing exponents using periodicity."],
            ['topic' => 'number-theory', 'module' => 'Modular Arithmetic', 'title' => 'Fermat\'s Little Theorem', 'minutes' => 25, 'order' => 2, 'content' => "Fermat's Little Theorem (FLT): If p is prime and p∤a, then a^(p-1) ≡ 1 (mod p). This dramatically reduces power computations mod p: to find a^n mod p, reduce n mod (p-1).\n\nEuler's generalization: a^φ(m) ≡ 1 (mod m) when gcd(a,m)=1. Here φ(m) is Euler's totient — count of integers from 1 to m coprime to m."],
            ['topic' => 'number-theory', 'module' => 'Modular Arithmetic', 'title' => 'Chinese Remainder Theorem', 'minutes' => 30, 'order' => 3, 'content' => "CRT: If m₁,...,mₖ are pairwise coprime, then x≡aᵢ(mod mᵢ) has a unique solution mod M=m₁⋯mₖ. Construction: Mᵢ=M/mᵢ, find yᵢ s.t. Mᵢyᵢ≡1(mod mᵢ), then x=Σaᵢ Mᵢyᵢ.\n\nCRT splits hard problems mod M into easier ones mod each mᵢ."],
            ['topic' => 'number-theory', 'module' => 'Modular Arithmetic', 'title' => 'Primitive Roots & Order', 'minutes' => 30, 'order' => 4, 'content' => "The order of a mod m is the smallest d>0 with a^d≡1(mod m). By FLT, this order divides p-1 for prime p. A primitive root g mod p has order exactly p-1 — every nonzero residue is a power of g.\n\nPrimitive roots exist for primes p, prime powers pᵏ, 2pᵏ, 1, 2, and 4. They are the basis for discrete logarithms."],
            // inequalities
            ['topic' => 'inequalities', 'module' => 'AM-GM Inequality', 'title' => 'AM-GM Inequality', 'minutes' => 25, 'order' => 1, 'content' => "AM-GM: For non-negative reals a₁,...,aₙ, (a₁+⋯+aₙ)/n ≥ (a₁⋯aₙ)^(1/n), with equality iff all aᵢ are equal.\n\nWhen minimizing a sum, try to write it so AM-GM applies and the equality condition is achievable. The equality condition tells you when the minimum is achieved."],
            ['topic' => 'inequalities', 'module' => 'AM-GM Inequality', 'title' => 'Applying AM-GM Strategically', 'minutes' => 30, 'order' => 2, 'content' => "The key is grouping terms so the equality condition is compatible with constraints. Reverse-engineer the grouping from the desired bound. Sometimes adding a constant term is needed.\n\nFor symmetric expressions with a+b+c=1 type constraints, apply AM-GM on individual terms. Always verify by checking equality holds at the claimed point."],
            ['topic' => 'inequalities', 'module' => 'AM-GM Inequality', 'title' => 'Weighted AM-GM & Young\'s Inequality', 'minutes' => 25, 'order' => 3, 'content' => "Weighted AM-GM: if wᵢ>0, Σwᵢ=1, then Σwᵢaᵢ ≥ Πaᵢ^wᵢ. Special case p=q=1/2 gives standard AM-GM.\n\nYoung's inequality: for 1/p+1/q=1, ab ≤ a^p/p + b^q/q. This is foundational in analysis (Lp spaces) and is used to prove Hölder's inequality."],
            // geometry
            ['topic' => 'geometry', 'module' => 'Circle Theorems', 'title' => 'Power of a Point', 'minutes' => 25, 'order' => 1, 'content' => "Power of a Point: for point P and a circle, if two lines through P intersect the circle at A,B and C,D, then PA·PB = PC·PD. This product is the 'power' of P.\n\nFor external point: power = d²-r² > 0. Tangent from P: PT² = PA·PB. The radical axis is where powers of two circles are equal."],
            ['topic' => 'geometry', 'module' => 'Circle Theorems', 'title' => 'Cyclic Quadrilaterals', 'minutes' => 25, 'order' => 2, 'content' => "A quadrilateral is cyclic iff opposite angles are supplementary: ∠A+∠C = ∠B+∠D = 180°. Ptolemy's theorem: AC·BD = AB·CD + AD·BC for cyclic ABCD.\n\nPtolemy's inequality holds for general quadrilaterals with ≤ instead of =. Equality iff cyclic."],
            ['topic' => 'geometry', 'module' => 'Circle Theorems', 'title' => 'Radical Axis Theorem', 'minutes' => 30, 'order' => 3, 'content' => "The radical axis of two circles is the set of points with equal power to both circles. It is a line perpendicular to the line joining the centers.\n\nFor three circles, the three pairwise radical axes meet at one point — the radical center. This is a powerful tool for proving concurrency in olympiad geometry."],
            ['topic' => 'geometry', 'module' => 'Circle Theorems', 'title' => 'Inversion in Circles', 'minutes' => 35, 'order' => 4, 'content' => "Inversion with center O and radius r maps point P to P' on ray OP with OP·OP'=r². It converts circles to lines and vice versa when they pass through O, drastically simplifying tangency configurations.\n\nKey: inversion is angle-preserving (conformal). Circles not through O map to circles. Used to eliminate tangency conditions in IMO-level geometry problems."],
            // combinatorics
            ['topic' => 'combinatorics', 'module' => 'Pigeonhole Principle', 'title' => 'The Pigeonhole Principle', 'minutes' => 20, 'order' => 1, 'content' => "If n+1 objects are placed into n boxes, at least one box contains ≥ 2 objects. Generalized: m objects into n boxes → some box has ≥ ⌈m/n⌉ objects.\n\nThe hard part in olympiad problems is identifying the correct 'pigeons' and 'holes'. PHP proves existence without constructing the example."],
            ['topic' => 'combinatorics', 'module' => 'Pigeonhole Principle', 'title' => 'PHP in Number Theory', 'minutes' => 25, 'order' => 2, 'content' => "Among n+1 integers, two have the same residue mod n, so their difference is divisible by n. This powers many divisibility results.\n\nAmong 2n-1 integers, n have sum divisible by n (Erdős–Ginzburg–Ziv theorem). This is a deeper PHP application."],
            ['topic' => 'combinatorics', 'module' => 'Pigeonhole Principle', 'title' => 'PHP in Geometry', 'minutes' => 25, 'order' => 3, 'content' => "Divide a region into n sub-regions. Any n+1 points have two in the same sub-region, at most diameter d apart. This proves existence of close points or specific configurations.\n\nAngular version: divide angles into arcs; PHP guarantees two points in the same arc."],
            // divisibility
            ['topic' => 'divisibility-factors', 'module' => 'GCD & LCM', 'title' => 'GCD and the Euclidean Algorithm', 'minutes' => 20, 'order' => 1, 'content' => "GCD(a, b) is the largest integer dividing both. Euclidean algorithm: gcd(a,b) = gcd(b, a mod b), stop when remainder is 0. Runs in O(log min(a,b)) steps.\n\nBézout's theorem: there exist integers x, y with ax+by = gcd(a,b). The Extended Euclidean Algorithm finds these x, y."],
            ['topic' => 'divisibility-factors', 'module' => 'GCD & LCM', 'title' => 'LCM and Prime Factorization', 'minutes' => 20, 'order' => 2, 'content' => "LCM(a, b) is the smallest positive multiple of both. From prime factorizations: GCD takes minimum exponents, LCM takes maximum. So gcd·lcm = a·b.\n\nLCM appears in problems about periodic events coinciding (clock problems) and proving certain expressions are integers."],
            ['topic' => 'divisibility-factors', 'module' => 'GCD & LCM', 'title' => 'GCD/LCM in Olympiad Problems', 'minutes' => 25, 'order' => 3, 'content' => "Key olympiad tools: (1) If gcd(a,b)=1, then a|c and b|c imply ab|c. (2) gcd(a^n-1, a^m-1) = a^(gcd(n,m))-1 for a≥2. (3) Linear combinations: gcd(a,b) is the smallest positive value of ax+by.\n\nProperty (2) appears in BdMO and IMO problems involving perfect powers."],
        ];

        foreach ($lessons as $l) {
            $topic = Topic::where('slug', $l['topic'])->first();
            if (! $topic) continue;
            $module = Module::where('topic_id', $topic->id)->where('name', $l['module'])->first();
            if (! $module) continue;
            Lesson::updateOrCreate(
                ['module_id' => $module->id, 'title' => $l['title']],
                [
                    'order' => $l['order'],
                    'estimated_minutes' => $l['minutes'],
                    'content' => $l['content'],
                ]
            );
        }
    }
}
