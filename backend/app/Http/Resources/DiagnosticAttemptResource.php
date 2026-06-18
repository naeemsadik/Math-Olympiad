<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiagnosticAttemptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'userId' => (string) $this->user_id,
            'testId' => (string) $this->test_id,
            'testTitle' => $this->test_title,
            'questionIds' => $this->question_ids ?? [],
            'answers' => $this->answers ?? new \stdClass(),
            'correctCount' => $this->correct_count,
            'score' => $this->score,
            'abilityLevel' => $this->ability_level,
            'status' => $this->status,
            'startedAt' => $this->started_at?->toIso8601String(),
            'submittedAt' => $this->submitted_at?->toIso8601String(),
        ];
    }
}
