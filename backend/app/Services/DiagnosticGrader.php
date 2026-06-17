<?php

namespace App\Services;

use App\Models\DiagnosticAttempt;
use App\Models\Question;
use App\Models\Test;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Diagnostic placement logic. Port of the frontend's lib/diagnostic.ts.
 */
class DiagnosticGrader
{
    public function __construct(
        protected int $advancedThreshold = 50,
        protected int $expertThreshold = 80,
    ) {}

    public static function fromConfig(): self
    {
        return new self(
            (int) config('olympiad.diagnostic.advanced_threshold', 50),
            (int) config('olympiad.diagnostic.expert_threshold', 80),
        );
    }

    /**
     * Determine the placement test for a user.
     */
    public function findTestForUser(User $user): ?Test
    {
        $query = Test::query()
            ->where('test_type', 'diagnostic')
            ->where('is_public', true);

        if ($user->class_year) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('target_class_year')
                    ->orWhere('target_class_year', $user->class_year)
                    ->orWhere('target_class_year', 'All Classes');
            });
        }

        return $query->latest('id')->first()
            ?? Test::where('test_type', 'diagnostic')->latest('id')->first();
    }

    /**
     * Build the list of question IDs for a new attempt.
     *
     * @return array<int, int>
     */
    public function pickQuestionsFor(Test $test, User $user): array
    {
        $count = $test->random_question_count ?? 9;

        $query = Question::query()
            ->where('status', 'published')
            ->where('is_diagnostic_eligible', true);

        if ($test->ability_level) {
            $query->where('ability_level', $test->ability_level);
        }
        if ($test->tier) {
            $query->where('tier', $test->tier);
        }
        if ($user->class_year) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('target_class_year')
                    ->orWhere('target_class_year', $user->class_year)
                    ->orWhere('target_class_year', 'All Classes');
            });
        }

        return $query->inRandomOrder()->limit($count)->pluck('id')->all();
    }

    /**
     * Score the attempt and update user profile.
     */
    public function gradeAndApply(DiagnosticAttempt $attempt, array $answers): DiagnosticAttempt
    {
        $questions = Question::with('options')->whereIn('id', $attempt->question_ids)->get()->keyBy('id');

        $correct = 0;
        $total = $questions->count();

        foreach ($attempt->question_ids as $qid) {
            $question = $questions->get($qid);
            if (! $question) continue;

            $selectedOptionId = $answers[$qid] ?? null;
            $isCorrect = $question->options->where('id', $selectedOptionId)->where('is_correct', true)->isNotEmpty();
            if ($isCorrect) $correct++;
        }

        $score = $total > 0 ? (int) round($correct / $total * 100) : 0;
        $abilityLevel = $this->determineAbility($score);

        $attempt->update([
            'answers' => $answers,
            'correct_count' => $correct,
            'score' => $score,
            'ability_level' => $abilityLevel,
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        // Derive the user's tier
        $tier = match ($abilityLevel) {
            'Expert'   => 'Advanced',
            'Advanced' => 'Intermediate',
            default    => 'Beginner',
        };

        $attempt->user->update([
            'placement_done' => true,
            'diagnostic_ability_level' => $abilityLevel,
            'diagnostic_score' => $score,
            'diagnostic_completed_at' => now(),
            'diagnostic_attempt_id' => $attempt->id,
            'tier' => $tier,
            'level' => $this->levelForXp($attempt->user->xp),
        ]);

        return $attempt->fresh();
    }

    public function determineAbility(int $score): string
    {
        if ($score >= $this->expertThreshold) return 'Expert';
        if ($score >= $this->advancedThreshold) return 'Advanced';
        return 'Beginner';
    }

    public function levelForXp(int $xp): string
    {
        return match (true) {
            $xp >= 6000 => 'Elite Mathematician',
            $xp >= 3000 => 'BdMO Finalist',
            $xp >= 1500 => 'Olympiad Contender',
            $xp >= 700  => 'Problem Solver',
            $xp >= 300  => 'Math Enthusiast',
            default     => 'Newcomer',
        };
    }
}
