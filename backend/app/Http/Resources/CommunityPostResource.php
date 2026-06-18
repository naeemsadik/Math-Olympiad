<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommunityPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'category' => $this->category,
            'author' => $this->author?->name,
            'authorInstitute' => $this->author_institute,
            'tier' => $this->tier,
            'time' => $this->created_at?->diffForHumans(),
            'views' => (int) $this->views,
            'likes' => (int) $this->likes,
            'replies' => (int) $this->replies_count,
            'pinned' => (bool) $this->pinned,
            'tags' => $this->tags ?? [],
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
