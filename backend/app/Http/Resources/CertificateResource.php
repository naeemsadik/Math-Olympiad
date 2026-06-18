<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'studentName' => $this->student_name,
            'studentId' => $this->student_id_str,
            'studentIdUser' => $this->user_id ? (string) $this->user_id : null,
            'dept' => $this->dept,
            'institute' => $this->institute,
            'achievement' => $this->achievement,
            'event' => $this->event,
            'eventType' => $this->event_type,
            'description' => $this->description,
            'issuedAt' => $this->issued_at?->format('Y-m-d'),
            'tier' => $this->tier,
            'signatoryName' => $this->signatory_name,
            'signatoryTitle' => $this->signatory_title,
            'status' => $this->status,
        ];
    }
}
