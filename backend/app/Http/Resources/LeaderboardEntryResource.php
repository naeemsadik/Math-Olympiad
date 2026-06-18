<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaderboardEntryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'rank' => (int) ($this->rank ?? 0),
            'name' => $this->name,
            'department' => $this->department,
            'institute' => $this->institute,
            'tier' => $this->tier,
            'rating' => (int) ($this->rating ?? 0),
            'trend' => $this->trend ?? 'stable',
            'avatar' => $this->avatar,
        ];
    }
}
