<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PracticeAttemptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'testId' => (string) $this->test_id,
            'testTitle' => $this->test_title,
            'questionIds' => $this->question_ids ?? [],
            'currentIndex' => (int) $this->current_index,
            'answers' => $this->answers ?? new \stdClass(),
            'status' => $this->status,
            'startedAt' => $this->started_at?->toIso8601String(),
            'currentQuestionStartedAt' => $this->current_question_started_at?->toIso8601String(),
            'currentQuestionDeadline' => $this->current_question_deadline?->toIso8601String(),
            'submittedAt' => $this->submitted_at?->toIso8601String(),
        ];
    }
}
