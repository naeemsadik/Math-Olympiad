<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Models\EventRegistration;
use App\Models\RegistrationEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventRegistrationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'registration_event_id' => 'required|integer|exists:registration_events,id',
            'name' => 'required|string|max:160',
            'student_id_str' => 'nullable|string|max:60',
            'dept' => 'nullable|string|max:120',
            'year' => 'nullable|string|max:60',
            'email' => 'required|email|max:190',
            'phone' => 'nullable|string|max:30',
        ]);

        $event = RegistrationEvent::findOrFail($data['registration_event_id']);
        if ($event->status === 'closed') {
            return response()->json(['message' => 'Registration is closed.'], 422);
        }

        $reg = EventRegistration::create([
            ...$data,
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        return response()->json(['data' => $reg], 201);
    }
}
