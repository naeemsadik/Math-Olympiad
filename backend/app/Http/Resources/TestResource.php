<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $questions = null;
        if ($this->resource->relationLoaded('questions')) {
            $questions = QuestionResource::collection($this->questions);
        }

        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'duration' => (int) $this->duration,
            'difficulty' => $this->difficulty,
            'tier' => $this->tier,
            'topicId' => $this->topic_id ? (string) $this->topic_id : null,
            'questionCount' => (int) $this->question_count,
            'isPublic' => (bool) $this->is_public,
            'source' => $this->source,
            'tags' => $this->tags ?? [],
            'testType' => $this->test_type,
            'targetClassYear' => $this->target_class_year,
            'abilityLevel' => $this->ability_level,
            'questionIds' => $this->when(
                $this->question_ids !== null,
                fn () => $this->question_ids
            ),
            'randomQuestionCount' => $this->random_question_count,
            'advancedThreshold' => $this->advanced_threshold,
            'expertThreshold' => $this->expert_threshold,
            'questions' => $questions,
        ];
    }
}
