<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PuzzleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'date' => $this->date?->format('Y-m-d'),
            'title' => $this->title,
            'content' => $this->content,
            'difficulty' => $this->difficulty,
            'tier' => $this->tier,
            'topic' => $this->topic,
            'streakCount' => (int) $this->streak_count,
        ];
    }
}
