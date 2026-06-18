<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TopicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'description' => $this->description,
            'imageUrl' => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'tier' => $this->tier,
            'level' => $this->level,
            'lessonCount' => (int) $this->lesson_count,
            'problemCount' => (int) $this->problem_count,
            'color' => $this->color,
            'modules' => ModuleResource::collection($this->whenLoaded('modules')),
        ];
    }
}
