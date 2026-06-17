<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoticeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'tier' => $this->tier,
            'priority' => $this->priority,
            'author' => $this->author?->name,
            'createdAt' => $this->published_at?->toIso8601String(),
        ];
    }
}
