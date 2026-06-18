<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventRegistration;
use App\Models\RegistrationEvent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RegistrationController extends Controller
{
    public function eventIndex(Request $request): JsonResponse
    {
        $query = RegistrationEvent::query();
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        $events = $query->orderByDesc('start_at')->paginate(25);

        return response()->json([
            'data' => $events->getCollection()->map(fn ($e) => $this->serializeEvent($e))->values(),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
            ],
        ]);
    }

    public function eventStore(Request $request): JsonResponse
    {
        $data = $this->validateEvent($request);
        $event = RegistrationEvent::create($data);
        return response()->json(['data' => $this->serializeEvent($event)], 201);
    }

    public function eventUpdate(Request $request, int $id): JsonResponse
    {
        $event = RegistrationEvent::findOrFail($id);
        $data = $this->validateEvent($request, $event->id);
        $event->fill($data)->save();
        return response()->json(['data' => $this->serializeEvent($event)]);
    }

    public function eventDestroy(int $id): JsonResponse
    {
        RegistrationEvent::findOrFail($id)->delete();
        return response()->json(['message' => 'Registration event deleted.']);
    }

    public function registrationIndex(Request $request, int $eventId): JsonResponse
    {
        $event = RegistrationEvent::findOrFail($eventId);
        $query = EventRegistration::where('registration_event_id', $event->id);
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        $regs = $query->orderByDesc('id')->paginate(25);

        return response()->json([
            'data' => $regs->getCollection()->map(fn ($r) => $this->serializeRegistration($r))->values(),
            'meta' => [
                'current_page' => $regs->currentPage(),
                'last_page' => $regs->lastPage(),
                'total' => $regs->total(),
            ],
        ]);
    }

    public function registrationUpdate(Request $request, int $eventId, int $regId): JsonResponse
    {
        $reg = EventRegistration::where('registration_event_id', $eventId)->findOrFail($regId);
        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'confirmed', 'waitlist', 'cancelled', 'attended'])],
            'payment_status' => ['nullable', Rule::in(['unpaid', 'paid', 'refunded', 'waived'])],
            'notes' => 'nullable|string',
        ]);
        $reg->fill($data)->save();
        return response()->json(['data' => $this->serializeRegistration($reg)]);
    }

    public function registrationDestroy(int $eventId, int $regId): JsonResponse
    {
        EventRegistration::where('registration_event_id', $eventId)->findOrFail($regId)->delete();
        return response()->json(['message' => 'Registration deleted.']);
    }

    public function exportCsv(Request $request, int $eventId): StreamedResponse
    {
        $event = RegistrationEvent::findOrFail($eventId);
        $regs = EventRegistration::where('registration_event_id', $event->id)->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="registrations_'.$event->id.'_'.now()->format('Ymd_His').'.csv"',
        ];

        return response()->stream(function () use ($regs, $event) {
            $out = fopen('php://output', 'w');
            fputcsv($out, [
                'Event', 'User', 'Email', 'Institute', 'Status', 'Payment',
                'Registered At', 'Notes',
            ]);
            foreach ($regs as $r) {
                $user = User::find($r->user_id);
                fputcsv($out, [
                    $event->title,
                    $user?->name,
                    $user?->email,
                    $user?->institute,
                    $r->status,
                    $r->payment_status,
                    $r->created_at?->toIso8601String(),
                    $r->notes,
                ]);
            }
            fclose($out);
        }, 200, $headers);
    }

    protected function validateEvent(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'venue' => 'nullable|string|max:200',
            'start_at' => 'required|date',
            'end_at' => 'nullable|date|after:start_at',
            'registration_deadline' => 'nullable|date|before:start_at',
            'capacity' => 'nullable|integer|min:0',
            'fee' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:8',
            'status' => ['required', Rule::in(['draft', 'open', 'closed', 'completed', 'cancelled'])],
            'requires_approval' => 'boolean',
            'cover_image' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:80',
        ]);
    }

    protected function serializeEvent(RegistrationEvent $e): array
    {
        $registered = EventRegistration::where('registration_event_id', $e->id)
            ->whereNotIn('status', ['cancelled'])->count();
        return [
            'id' => (string) $e->id,
            'title' => $e->title,
            'description' => $e->description,
            'venue' => $e->venue,
            'startAt' => $e->start_at?->toIso8601String(),
            'endAt' => $e->end_at?->toIso8601String(),
            'registrationDeadline' => $e->registration_deadline?->toIso8601String(),
            'capacity' => (int) $e->capacity,
            'fee' => (float) $e->fee,
            'currency' => $e->currency,
            'status' => $e->status,
            'requiresApproval' => (bool) $e->requires_approval,
            'coverImage' => $e->cover_image,
            'category' => $e->category,
            'registered' => $registered,
        ];
    }

    protected function serializeRegistration(EventRegistration $r): array
    {
        $user = User::find($r->user_id);
        return [
            'id' => (string) $r->id,
            'eventId' => (string) $r->registration_event_id,
            'user' => $user ? [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'institute' => $user->institute,
            ] : null,
            'status' => $r->status,
            'paymentStatus' => $r->payment_status,
            'notes' => $r->notes,
            'registeredAt' => $r->created_at?->toIso8601String(),
        ];
    }
}
