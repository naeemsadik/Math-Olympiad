<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HallOfFameResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'year' => $this->year,
            'achievement' => $this->achievement,
            'department' => $this->department,
            'details' => $this->details,
            'tier' => $this->tier,
        ];
    }
}
