<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\LiveExamResource;
use App\Http\Resources\OlympiadEventResource;
use App\Models\InternalSession;
use App\Models\LiveExam;
use App\Models\OlympiadEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    public function olympiadIndex(Request $request): JsonResponse
    {
        $query = OlympiadEvent::query();
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('venue', 'like', "%{$search}%"));
        }
        $events = $query->orderByDesc('start_date')->paginate(25);

        return response()->json([
            'data' => OlympiadEventResource::collection($events->items()),
            'meta' => [
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'total' => $events->total(),
            ],
        ]);
    }

    public function olympiadStore(Request $request): JsonResponse
    {
        $data = $this->validateOlympiadEvent($request);
        $event = OlympiadEvent::create($data);
        return response()->json(['data' => new OlympiadEventResource($event)], 201);
    }

    public function olympiadUpdate(Request $request, int $id): JsonResponse
    {
        $event = OlympiadEvent::findOrFail($id);
        $data = $this->validateOlympiadEvent($request, $event->id);
        $event->fill($data)->save();
        return response()->json(['data' => new OlympiadEventResource($event)]);
    }

    public function olympiadDestroy(int $id): JsonResponse
    {
        OlympiadEvent::findOrFail($id)->delete();
        return response()->json(['message' => 'Olympiad event deleted.']);
    }

    public function internalIndex(Request $request): JsonResponse
    {
        $query = InternalSession::query();
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        $sessions = $query->orderByDesc('scheduled_at')->paginate(25);
        return response()->json([
            'data' => $sessions->getCollection()->map(fn ($s) => [
                'id' => (string) $s->id,
                'title' => $s->title,
                'topic' => $s->topic,
                'speaker' => $s->speaker,
                'scheduledAt' => $s->scheduled_at?->toIso8601String(),
                'durationMinutes' => (int) $s->duration_minutes,
                'meetingUrl' => $s->meeting_url,
                'status' => $s->status,
                'capacity' => (int) $s->capacity,
                'registered' => (int) $s->registered_count,
            ])->values(),
            'meta' => [
                'current_page' => $sessions->currentPage(),
                'last_page' => $sessions->lastPage(),
                'total' => $sessions->total(),
            ],
        ]);
    }

    public function internalStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:200',
            'topic' => 'required|string|max:200',
            'speaker' => 'required|string|max:160',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'required|integer|min:10|max:600',
            'meeting_url' => 'nullable|url',
            'status' => ['required', Rule::in(['scheduled', 'live', 'completed', 'cancelled'])],
            'capacity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);
        $session = InternalSession::create($data);
        return response()->json(['data' => $session], 201);
    }

    public function internalUpdate(Request $request, int $id): JsonResponse
    {
        $session = InternalSession::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string|max:200',
            'topic' => 'sometimes|string|max:200',
            'speaker' => 'sometimes|string|max:160',
            'scheduled_at' => 'sometimes|date',
            'duration_minutes' => 'sometimes|integer|min:10|max:600',
            'meeting_url' => 'nullable|url',
            'status' => ['sometimes', Rule::in(['scheduled', 'live', 'completed', 'cancelled'])],
            'capacity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);
        $session->fill($data)->save();
        return response()->json(['data' => $session]);
    }

    public function internalDestroy(int $id): JsonResponse
    {
        InternalSession::findOrFail($id)->delete();
        return response()->json(['message' => 'Session deleted.']);
    }

    public function liveIndex(Request $request): JsonResponse
    {
        $query = LiveExam::query();
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        $exams = $query->orderByDesc('scheduled_at')->paginate(25);
        return response()->json([
            'data' => LiveExamResource::collection($exams->items()),
            'meta' => [
                'current_page' => $exams->currentPage(),
                'last_page' => $exams->lastPage(),
                'total' => $exams->total(),
            ],
        ]);
    }

    public function liveStore(Request $request): JsonResponse
    {
        $data = $this->validateLiveExam($request);
        $exam = LiveExam::create($data);
        return response()->json(['data' => new LiveExamResource($exam)], 201);
    }

    public function liveUpdate(Request $request, int $id): JsonResponse
    {
        $exam = LiveExam::findOrFail($id);
        $data = $this->validateLiveExam($request, $exam->id);
        $exam->fill($data)->save();
        return response()->json(['data' => new LiveExamResource($exam)]);
    }

    public function liveDestroy(int $id): JsonResponse
    {
        LiveExam::findOrFail($id)->delete();
        return response()->json(['message' => 'Live exam deleted.']);
    }

    protected function validateOlympiadEvent(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'venue' => 'nullable|string|max:200',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'registration_deadline' => 'nullable|date|before:start_date',
            'registration_url' => 'nullable|url',
            'status' => ['required', Rule::in(['upcoming', 'open', 'closed', 'completed'])],
            'level' => ['nullable', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'is_featured' => 'boolean',
            'image_path' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
        ]);
    }

    protected function validateLiveExam(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'test_id' => 'nullable|exists:tests,id',
            'scheduled_at' => 'required|date',
            'duration_minutes' => 'required|integer|min:10|max:600',
            'status' => ['required', Rule::in(['scheduled', 'live', 'completed', 'cancelled'])],
            'capacity' => 'nullable|integer|min:0',
            'meeting_url' => 'nullable|url',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'time_limit_seconds' => 'nullable|integer|min:60',
        ]);
    }
}
