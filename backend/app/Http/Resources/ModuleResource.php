<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'topicId' => (string) $this->topic_id,
            'name' => $this->name,
            'description' => $this->description,
            'difficulty' => $this->difficulty,
            'lessonCount' => (int) $this->lesson_count,
            'order' => (int) $this->order,
            'lessons' => LessonResource::collection($this->whenLoaded('lessons')),
        ];
    }
}
