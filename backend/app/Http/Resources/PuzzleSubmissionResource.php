<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PuzzleSubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'puzzleId' => (string) $this->puzzle_id,
            'puzzleTitle' => $this->puzzle?->title,
            'studentName' => $this->user?->name,
            'studentInstitute' => $this->user?->institute,
            'studentTier' => $this->user?->tier,
            'answer' => $this->answer,
            'submittedAt' => $this->submitted_at?->toIso8601String(),
            'isCorrect' => $this->is_correct,
            'autoCorrect' => $this->auto_correct,
            'reviewedBy' => $this->reviewed_by ? (string) $this->reviewed_by : null,
            'reviewedAt' => $this->reviewed_at?->toIso8601String(),
        ];
    }
}
