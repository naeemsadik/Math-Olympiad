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
            'startDate' => $this->start_date?->format('Y-m-d'),
            'endDate' => $this->end_date?->format('Y-m-d'),
            'registrationDeadline' => $this->registration_deadline?->format('Y-m-d'),
            'time' => $this->time,
            'location' => $this->location,
            'venue' => $this->venue,
            'city' => $this->city,
            'country' => $this->country,
            'officialLink' => $this->official_link,
            'registrationLink' => $this->registration_link,
            'registrationUrl' => $this->registration_url,
            'description' => $this->description,
            'status' => $this->status,
            'level' => $this->level,
            'isFeatured' => (bool) $this->is_featured,
            'isInternal' => (bool) $this->is_internal,
            'imagePath' => $this->image_path,
            'tags' => $this->tags ?? [],
        ];
    }
}