<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * By default, is_correct is hidden until the attempt is submitted.
     * Pass ?reveal=1 or set $request->attributes->get('reveal') to include it.
     */
    public function toArray(Request $request): array
    {
        $reveal = $request->attributes->get('reveal_answers', false);

        $options = $this->whenLoaded('options') ?? $this->options;

        $answerOptions = $options->map(function ($opt) use ($reveal) {
            return [
                'id' => (string) $opt->id,
                'media' => [
                    'kind' => $opt->media_kind,
                    'value' => $opt->media_value,
                    'alt' => $opt->media_alt,
                ],
                'isCorrect' => $reveal ? (bool) $opt->is_correct : null,
            ];
        })->values();

        // Build a simple text array for the legacy `options` field
        $textOptions = $options->pluck('media_value')->values();

        return [
            'id' => (string) $this->id,
            'content' => $this->content,
            'options' => $textOptions,
            'correctOption' => $reveal
                ? $options->search(fn ($o) => $o->is_correct)
                : null,
            'explanation' => $reveal ? $this->explanation : null,
            'topicId' => $this->topic_id ? (string) $this->topic_id : null,
            'difficulty' => $this->difficulty,
            'tier' => $this->tier,
            'format' => $this->format,
            'prompt' => [
                'kind' => $this->prompt_kind,
                'value' => $this->prompt_kind === 'image' && $this->prompt_value
                    ? asset('storage/' . $this->prompt_value)
                    : $this->prompt_value,
                'alt' => $this->prompt_alt,
            ],
            'answerOptions' => $answerOptions,
            'timeLimitSeconds' => (int) $this->time_limit_seconds,
            'targetClassYear' => $this->target_class_year,
            'abilityLevel' => $this->ability_level,
            'marks' => (float) $this->marks,
            'subtopicTags' => $this->subtopic_tags ?? [],
            'source' => $this->source,
            'status' => $this->status,
            'isDiagnosticEligible' => (bool) $this->is_diagnostic_eligible,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
