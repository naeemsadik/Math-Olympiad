<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'moduleId' => (string) $this->module_id,
            'order' => (int) $this->order,
            'title' => $this->title,
            'estimatedMinutes' => (int) $this->estimated_minutes,
            'content' => $this->content,
            'keyPoints' => $this->key_points ?? [],
            'example' => [
                'problem' => $this->example_problem,
                'solution' => $this->example_solution,
            ],
            'resources' => $this->resources ?? [],
        ];
    }
}
