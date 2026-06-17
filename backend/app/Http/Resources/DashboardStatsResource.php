<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'testsTaken' => (int) ($this['testsTaken'] ?? 0),
            'averageScore' => (float) ($this['averageScore'] ?? 0),
            'bestScore' => (float) ($this['bestScore'] ?? 0),
            'totalTime' => $this['totalTime'] ?? '0h 0m',
            'topicMastery' => $this['topicMastery'] ?? [],
            'recentActivity' => $this['recentActivity'] ?? [],
            'learningPath' => $this['learningPath'] ?? [],
            'recommendedNext' => $this['recommendedNext'] ?? [],
        ];
    }
}
