<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContentPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'intro' => $this->intro,
            'body' => $this->body,
            'meta' => $this->meta ?? new \stdClass(),
            'publishedAt' => $this->published_at?->toIso8601String(),
            'widgets' => $this->whenLoaded('widgets'),
        ];
    }
}
