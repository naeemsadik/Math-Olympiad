<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OlympiadEventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'date' => $this->date?->format('Y-m-d'),
            'location' => $this->location,
            'officialLink' => $this->official_link,
            'registrationLink' => $this->registration_link,
            'description' => $this->description,
            'isInternal' => (bool) $this->is_internal,
            'time' => $this->time,
        ];
    }
}
