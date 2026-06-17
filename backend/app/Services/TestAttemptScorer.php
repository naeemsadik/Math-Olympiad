<?php

namespace App\Services;

use App\Models\AttemptQuestionAnswer;
use App\Models\AttemptTopicBreakdown;
use App\Models\Question;
use App\Models\TestAttempt;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Test engine + scoring. Port of components/test/TestEngine.tsx logic.
 */
class TestAttemptScorer
{
    public function startAttempt(TestAttempt $attempt, array $questionIds): void
    {
        $shuffled = $questionIds; // Server shuffles via pickQuestions(); preserve order
        $firstQuestion = Question::find($shuffled[0] ?? null);

        $attempt->update([
            'question_ids' => $shuffled,
            'current_index' => 0,
            'status' => 'in-progress',
            'started_at' => $attempt->started_at ?? now(),
            'current_question_started_at' => now(),
            'current_question_deadline' => $firstQuestion
                ? now()->addSeconds($firstQuestion->time_limit_seconds ?? 90)
                : now()->addMinutes($attempt->test->duration ?? 30),
        ]);
    }

    public function advance(TestAttempt $attempt, int $nextIndex): void
    {
        $qid = $attempt->question_ids[$nextIndex] ?? null;
        $next = $qid ? Question::find($qid) : null;

        $attempt->update([
            'current_index' => $nextIndex,
            'current_question_started_at' => now(),
            'current_question_deadline' => $next
                ? now()->addSeconds($next->time_limit_seconds ?? 90)
                : null,
        ]);
    }

    public function recordAnswer(TestAttempt $attempt, int $questionId, ?int $optionId): void
    {
        $question = Question::with('options')->findOrFail($questionId);
        $isCorrect = false;
        if ($optionId) {
            $isCorrect = $question->options->where('id', $optionId)->where('is_correct', true)->isNotEmpty();
        }

        AttemptQuestionAnswer::updateOrCreate(
            ['test_attempt_id' => $attempt->id, 'question_id' => $questionId],
            [
                'selected_option_id' => $optionId,
                'is_correct' => $isCorrect,
                'time_taken_seconds' => $attempt->current_question_started_at
                    ? (int) $attempt->current_question_started_at->diffInSeconds(now())
                    : null,
            ]
        );

        $answers = $attempt->answers ?? [];
        $answers[(string) $questionId] = $optionId;
        $attempt->update(['answers' => $answers]);
    }

    public function submit(TestAttempt $attempt): TestAttempt
    {
        $attempt->refresh();

        $questions = Question::with('options')
            ->whereIn('id', $attempt->question_ids ?? [])
            ->get()
            ->keyBy('id');

        $correct = 0;
        $totalMarks = 0;
        $earned = 0;
        $topicStats = [];

        foreach ($attempt->question_ids as $qid) {
            $question = $questions->get($qid);
            if (! $question) continue;

            $marks = (float) $question->marks;
            $totalMarks += $marks;

            $answer = AttemptQuestionAnswer::where('test_attempt_id', $attempt->id)
                ->where('question_id', $qid)
                ->first();

            if ($answer && $answer->is_correct) {
                $correct++;
                $earned += $marks;
            }

            // If now > current_question_deadline, mark remaining as expired (force-submit)
            if (! $answer && $attempt->current_question_deadline
                && now()->greaterThan($attempt->current_question_deadline)) {
                // no-op: leave as unanswered (counts as incorrect)
            }

            // Tally per-topic
            $tid = $question->topic_id ?? 0;
            if ($tid) {
                if (! isset($topicStats[$tid])) {
                    $topicStats[$tid] = ['correct' => 0, 'total' => 0];
                }
                $topicStats[$tid]['total']++;
                if ($answer && $answer->is_correct) {
                    $topicStats[$tid]['correct']++;
                }
            }
        }

        $accuracy = $questions->count() > 0 ? ($correct / $questions->count()) * 100 : 0;
        $score = $totalMarks > 0 ? ($earned / $totalMarks) * 100 : 0;
        $timeSpent = $attempt->started_at ? (int) $attempt->started_at->diffInSeconds(now()) : 0;

        $status = $attempt->current_question_deadline && now()->greaterThan($attempt->current_question_deadline)
            ? 'expired' : 'submitted';

        DB::transaction(function () use ($attempt, $correct, $score, $accuracy, $totalMarks, $earned, $timeSpent, $status, $topicStats) {
            $attempt->update([
                'status' => $status,
                'submitted_at' => now(),
                'score' => round($score, 2),
                'total_marks' => round($totalMarks, 2),
                'accuracy' => round($accuracy, 2),
                'time_spent_seconds' => $timeSpent,
            ]);

            // Persist topic breakdown
            foreach ($topicStats as $topicId => $stats) {
                AttemptTopicBreakdown::updateOrCreate(
                    ['test_attempt_id' => $attempt->id, 'topic_id' => $topicId],
                    [
                        'correct' => $stats['correct'],
                        'total' => $stats['total'],
                        'accuracy' => $stats['total'] > 0 ? round(($stats['correct'] / $stats['total']) * 100, 2) : 0,
                    ]
                );
            }
        });

        // Award XP via the XpService
        app(XpService::class)->awardForAttempt($attempt->fresh());

        return $attempt->fresh(['topicBreakdown.topic', 'questionAnswers']);
    }
}
