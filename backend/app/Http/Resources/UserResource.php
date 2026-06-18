<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => strtoupper($this->role ?? 'student'),
            'tier' => $this->tier,
            'institute' => $this->institute,
            'department' => $this->department,
            'university' => $this->university,
            'xp' => (int) $this->xp,
            'streak' => (int) $this->streak,
            'level' => $this->level,
            'avatar' => $this->avatar_path ? asset('storage/' . $this->avatar_path) : null,
            'gender' => $this->gender,
            'dob' => $this->dob?->format('Y-m-d'),
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'address' => $this->address,
            'about' => $this->about,
            'institutionType' => $this->institution_type,
            'classYear' => $this->class_year,
            'placementDone' => (bool) $this->placement_done,
            'diagnosticAbilityLevel' => $this->diagnostic_ability_level,
            'diagnosticScore' => $this->diagnostic_score,
            'diagnosticCompletedAt' => $this->diagnostic_completed_at?->toIso8601String(),
            'diagnosticAttemptId' => $this->diagnostic_attempt_id ? (string) $this->diagnostic_attempt_id : null,
            'joinedAt' => $this->joined_at?->toIso8601String(),
            'status' => $this->status,
            'emailVerifiedAt' => $this->email_verified_at?->toIso8601String(),
        ];
    }
}
