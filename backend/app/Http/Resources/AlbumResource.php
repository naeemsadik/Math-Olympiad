<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AlbumResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'date' => $this->date?->format('Y-m-d'),
            'category' => $this->category,
            'color' => $this->color,
            'icon' => $this->icon,
            'coverGradient' => $this->cover_gradient,
            'description' => $this->description,
            'photoCount' => $this->photos_count ?? $this->photos?->count() ?? 0,
            'photos' => $this->whenLoaded('photos'),
        ];
    }
}
