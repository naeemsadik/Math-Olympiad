<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\Test;
use App\Models\Topic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionAndTestSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->seedQuestions();
            $this->seedTests();
        });
    }

    protected function seedQuestions(): void
    {
        $samples = [
            [
                'topic' => 'number-theory', 'difficulty' => 'Advanced', 'tier' => 'Advanced',
                'content' => 'Let $n$ be a positive integer. Find all $n$ such that $n^2 + 4$ and $n^2 + 100$ are both perfect squares.',
                'explanation' => 'Direct analysis shows no integer $n$ satisfies both conditions. For $n^2+100=b^2$: $(b-n)(b+n)=100$, only solutions: $n=0$ (trivial), $n=24$ (gives $24^2+4=580$ not square). Hence no solution exists.',
                'options' => ['n = 6', 'n = 3 only', 'n = 6 and n = 3', 'No solution exists'],
                'correct' => 3,
            ],
            [
                'topic' => 'inequalities', 'difficulty' => 'Advanced', 'tier' => 'Advanced',
                'content' => 'For all positive reals $a,b,c$ with $a+b+c=3$, find the minimum value of $\\frac{a^2}{b}+\\frac{b^2}{c}+\\frac{c^2}{a}$.',
                'explanation' => 'By Cauchy-Schwarz (Engel/Titu): $\\sum\\frac{a^2}{b}\\geq\\frac{(a+b+c)^2}{b+c+a}=a+b+c=3$. Equality at $a=b=c=1$.',
                'options' => ['1', '2', '3', '4'],
                'correct' => 2,
            ],
            [
                'topic' => 'combinatorics', 'difficulty' => 'Advanced', 'tier' => 'Advanced',
                'content' => 'How many ways can you 2-colour the edges of $K_4$ such that no monochromatic triangle exists?',
                'explanation' => 'For $K_4$: by exhaustive check, every 2-colouring of $K_4$\'s 6 edges contains at least one monochromatic triangle. Answer: 0.',
                'options' => ['0', '2', '6', '12'],
                'correct' => 0,
            ],
            [
                'topic' => 'number-theory', 'difficulty' => 'Intermediate', 'tier' => 'Intermediate',
                'content' => 'Using Fermat\'s Little Theorem, find the remainder when $3^{100}$ is divided by 7.',
                'explanation' => 'By Fermat\'s Little Theorem, $3^6\\equiv 1\\pmod{7}$. Since $100=16\\cdot6+4$, we get $3^{100}\\equiv 3^4=81\\equiv 4\\pmod{7}$.',
                'options' => ['1', '2', '3', '4'],
                'correct' => 3,
            ],
            [
                'topic' => 'geometry', 'difficulty' => 'Intermediate', 'tier' => 'Intermediate',
                'content' => 'In triangle $ABC$, $\\angle A=60°$. The internal angle bisectors from $B$ and $C$ meet at the incenter $I$. Find $\\angle BIC$.',
                'explanation' => '$\\angle BIC=90°+\\frac{\\angle A}{2}=90°+30°=120°$',
                'options' => ['100°', '110°', '120°', '130°'],
                'correct' => 2,
            ],
            [
                'topic' => 'algebra', 'difficulty' => 'Intermediate', 'tier' => 'Intermediate',
                'content' => 'The sum of roots of $x^2-5x+6=0$ equals the product of roots of $x^2+px+q=0$. If the roots of the second equation are consecutive integers, find $p$.',
                'explanation' => 'Roots of first equation: $2$ and $3$, sum $=5$. Consecutive integers with product $5$: $n(n+1)=6$, $n=2$. So roots $2,3$, sum $=5=-p$, thus $p=-5$.',
                'options' => ['-3', '-5', '-7', '-9'],
                'correct' => 1,
            ],
            [
                'topic' => 'number-theory', 'difficulty' => 'Intermediate', 'tier' => 'Beginner',
                'content' => 'Find all integer solutions to $6x+10y=14$.',
                'explanation' => '$\\gcd(6,10)=2$ divides $14$, so solutions exist. A particular solution is $(2,-1)$. The general solution is $x=2+5t, y=-1-3t$ for any integer $t$.',
                'options' => ['$(x,y)=(4,-1)$', '$(x,y)=(2,-1)$ and infinitely many others', 'No solution exists', '$(x,y)=(1,1)$ only'],
                'correct' => 1,
            ],
            [
                'topic' => 'algebra', 'difficulty' => 'Beginner', 'tier' => 'Beginner',
                'content' => 'If $f(x)=2x+3$ and $g(x)=x^2-1$, find $(f\\circ g)(2)$.',
                'explanation' => '$g(2)=4-1=3$. Then $f(g(2))=f(3)=2(3)+3=9$.',
                'options' => ['7', '9', '11', '13'],
                'correct' => 1,
            ],
            [
                'topic' => 'mathematical-logic', 'difficulty' => 'Beginner', 'tier' => 'Beginner',
                'content' => 'A class of 25 students must be split into 4 study groups. What is the minimum guaranteed size of the largest group?',
                'explanation' => 'By the Pigeonhole Principle, $\\lceil25/4\\rceil=\\lceil6.25\\rceil=7$. At least one group must contain at least 7 students.',
                'options' => ['5', '6', '7', '8'],
                'correct' => 2,
            ],
        ];

        foreach ($samples as $q) {
            $topic = Topic::where('slug', $q['topic'])->first();
            if (! $topic) continue;
            $question = Question::updateOrCreate(
                ['content' => $q['content']],
                [
                    'topic_id' => $topic->id,
                    'difficulty' => $q['difficulty'],
                    'tier' => $q['tier'],
                    'format' => 'text-to-text',
                    'status' => 'published',
                    'is_diagnostic_eligible' => true,
                    'explanation' => $q['explanation'],
                ]
            );
            // Sync options
            $question->options()->delete();
            foreach ($q['options'] as $i => $label) {
                QuestionOption::create([
                    'question_id' => $question->id,
                    'label' => chr(65 + $i),
                    'media_kind' => 'text',
                    'media_value' => $label,
                    'is_correct' => $i === $q['correct'],
                    'order' => $i,
                ]);
            }
        }
    }

    protected function seedTests(): void
    {
        $tests = [
            [
                'topic' => 'algebra', 'title' => 'Algebra Fundamentals', 'description' => 'Polynomials, factoring, and functional equations for beginners.',
                'duration' => 60, 'difficulty' => 'Beginner', 'tier' => 'Beginner', 'source' => 'UIU Internal',
                'tags' => ['Polynomials', 'Factoring', 'Functional Equations'],
            ],
            [
                'topic' => 'mathematical-logic', 'title' => 'Mathematical Logic Starter', 'description' => 'Introduction to sets, basic logic gates, and simple proof techniques.',
                'duration' => 45, 'difficulty' => 'Beginner', 'tier' => 'Beginner', 'source' => 'UIU Internal',
                'tags' => ['Sets', 'Logic', 'Proof Basics'],
            ],
            [
                'topic' => 'number-theory', 'title' => 'Number Theory Basics', 'description' => 'Divisibility rules, GCD, LCM, and an introduction to modular arithmetic.',
                'duration' => 30, 'difficulty' => 'Beginner', 'tier' => 'Beginner', 'source' => 'UIU Internal',
                'tags' => ['Divisibility', 'GCD', 'LCM'],
            ],
            [
                'topic' => 'algebra', 'title' => 'Algebra Sprint #1', 'description' => 'A 20-minute speed test on linear and quadratic equations.',
                'duration' => 20, 'difficulty' => 'Beginner', 'tier' => 'Beginner', 'source' => 'UIU Internal',
                'tags' => ['Quadratic', 'Speed', 'Sprint'],
            ],
            [
                'topic' => 'mathematical-logic', 'title' => 'Introduction to Proofs', 'description' => 'Direct proof, proof by contradiction, and basic mathematical induction.',
                'duration' => 60, 'difficulty' => 'Beginner', 'tier' => 'Beginner', 'source' => 'UIU Internal',
                'tags' => ['Proof Techniques', 'Induction', 'Contradiction'],
            ],
            [
                'topic' => 'combinatorics', 'title' => 'Combinatorics Masterclass #4', 'description' => 'Advanced combinatorics covering graph theory and generating functions.',
                'duration' => 90, 'difficulty' => 'Advanced', 'tier' => 'Intermediate', 'source' => 'UIU Internal',
                'tags' => ['Graph Theory', 'Generating Functions'],
            ],
            [
                'topic' => 'geometry', 'title' => 'Advanced Geometry Mock #4', 'description' => 'Full-length geometry test with circle theorems and projective geometry.',
                'duration' => 120, 'difficulty' => 'Advanced', 'tier' => 'Intermediate', 'source' => 'BdMO Style',
                'tags' => ['Circle Theorems', 'Projective Geometry'],
            ],
            [
                'topic' => 'combinatorics', 'title' => 'Combinatorics: Pigeonhole Problems', 'description' => 'Classic and tricky pigeonhole principle problems for college-level students.',
                'duration' => 60, 'difficulty' => 'Intermediate', 'tier' => 'Intermediate', 'source' => 'BdMO Style',
                'tags' => ['Pigeonhole', 'Counting', 'Coloring'],
            ],
            [
                'topic' => 'combinatorics', 'title' => 'BdMO 2023 Regional Practice', 'description' => 'Practice set modeled after BdMO 2023 regional round questions.',
                'duration' => 180, 'difficulty' => 'Advanced', 'tier' => 'Advanced', 'source' => 'BdMO 2023 Regionals',
                'tags' => ['BdMO', 'Regional', 'Competition'],
            ],
            [
                'topic' => 'inequalities', 'title' => 'Inequalities Masterclass', 'description' => 'Comprehensive coverage of AM-GM, Cauchy-Schwarz, Jensen\'s, and SOS techniques.',
                'duration' => 90, 'difficulty' => 'Advanced', 'tier' => 'Advanced', 'source' => 'BdMO Style',
                'tags' => ['AM-GM', 'Cauchy-Schwarz', 'Jensen'],
            ],
            [
                'topic' => 'number-theory', 'title' => 'Number Theory Grand Mock', 'description' => 'Full IMO-style mock covering primes, Diophantine equations, and modular arithmetic.',
                'duration' => 120, 'difficulty' => 'Elite', 'tier' => 'Advanced', 'source' => 'IMO Prep',
                'tags' => ['IMO Style', 'Diophantine', 'Primes'],
            ],
            [
                'topic' => 'combinatorics', 'title' => 'Advanced Combinatorics #5', 'description' => 'Graph coloring, Ramsey theory, and the probabilistic method.',
                'duration' => 75, 'difficulty' => 'Advanced', 'tier' => 'Advanced', 'source' => 'BdMO 2022',
                'tags' => ['Graph Coloring', 'Ramsey Theory', 'Probabilistic'],
            ],
        ];

        foreach ($tests as $t) {
            $topic = Topic::where('slug', $t['topic'])->first();
            $test = Test::updateOrCreate(
                ['title' => $t['title']],
                [
                    'description' => $t['description'],
                    'duration' => $t['duration'],
                    'difficulty' => $t['difficulty'],
                    'tier' => $t['tier'],
                    'topic_id' => $topic?->id,
                    'is_public' => true,
                    'source' => $t['source'],
                    'tags' => $t['tags'],
                    'test_type' => 'practice',
                    'question_count' => 10,
                ]
            );

            // Attach a few sample questions from the same topic
            $questions = Question::where('topic_id', $topic?->id)->take(3)->get();
            $sync = [];
            foreach ($questions as $i => $q) {
                $sync[$q->id] = ['order' => $i];
            }
            if (! empty($sync)) {
                $test->questions()->sync($sync);
                $test->update(['question_count' => $test->questions()->count()]);
            }
        }
    }
}
