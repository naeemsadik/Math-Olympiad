<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestAttemptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $breakdown = $this->relationLoaded('topicBreakdown')
            ? $this->topicBreakdown->map(fn ($b) => [
                'topic' => $b->topic?->name,
                'accuracy' => (float) $b->accuracy,
                'avgAccuracy' => 50.0, // TODO: compute from cohort
            ])->values()
            : [];

        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'testId' => (string) $this->test_id,
            'testTitle' => $this->test_title,
            'score' => (float) $this->score,
            'totalQuestions' => (int) $this->question_count_or_total(),
            'accuracy' => (float) $this->accuracy,
            'timeSpent' => (int) $this->time_spent_seconds,
            'submittedAt' => $this->submitted_at?->toIso8601String(),
            'topicBreakdown' => $breakdown,
            'status' => $this->status,
            'currentIndex' => (int) $this->current_index,
            'currentQuestionStartedAt' => $this->current_question_started_at?->toIso8601String(),
            'currentQuestionDeadline' => $this->current_question_deadline?->toIso8601String(),
            'answers' => $this->answers ?? new \stdClass(),
            'questionIds' => $this->question_ids ?? [],
        ];
    }

    private function question_count_or_total(): int
    {
        return is_array($this->question_ids) ? count($this->question_ids) : 0;
    }
}
