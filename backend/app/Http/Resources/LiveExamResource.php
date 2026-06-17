<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LiveExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'tier' => $this->tier,
            'scheduledAt' => $this->scheduled_at?->toIso8601String(),
            'duration' => (int) $this->duration,
            'topicId' => $this->topic_id ? (string) $this->topic_id : null,
            'testId' => $this->test_id ? (string) $this->test_id : null,
            'questionCount' => (int) $this->question_count,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
