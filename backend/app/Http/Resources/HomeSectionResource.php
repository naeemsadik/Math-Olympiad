<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'key' => $this->section_key,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'data' => $this->data ?? new \stdClass(),
            'sortOrder' => (int) $this->sort_order,
            'published' => (bool) $this->published,
        ];
    }
}
