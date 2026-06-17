<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PuzzleResource;
use App\Http\Resources\PuzzleSubmissionResource;
use App\Models\Puzzle;
use App\Models\PuzzleSubmission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PuzzleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Puzzle::query();
        if ($difficulty = $request->query('difficulty')) {
            $query->where('difficulty', $difficulty);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%"));
        }
        $puzzles = $query->orderByDesc('id')->paginate(25);

        return response()->json([
            'data' => PuzzleResource::collection($puzzles->items()),
            'meta' => [
                'current_page' => $puzzles->currentPage(),
                'last_page' => $puzzles->lastPage(),
                'total' => $puzzles->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validatePuzzle($request);
        $puzzle = Puzzle::create($data);
        return response()->json(['data' => new PuzzleResource($puzzle)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $puzzle = Puzzle::findOrFail($id);
        $data = $this->validatePuzzle($request, $puzzle->id);
        $puzzle->fill($data)->save();
        return response()->json(['data' => new PuzzleResource($puzzle)]);
    }

    public function destroy(int $id): JsonResponse
    {
        Puzzle::findOrFail($id)->delete();
        return response()->json(['message' => 'Puzzle deleted.']);
    }

    public function submissionsIndex(Request $request): JsonResponse
    {
        $query = PuzzleSubmission::query();
        if ($puzzleId = $request->query('puzzle_id')) {
            $query->where('puzzle_id', $puzzleId);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        $submissions = $query->orderByDesc('submitted_at')->paginate(25);

        return response()->json([
            'data' => $submissions->getCollection()->map(fn ($s) => [
                'id' => (string) $s->id,
                'puzzle' => $s->puzzle ? [
                    'id' => (string) $s->puzzle->id,
                    'title' => $s->puzzle->title,
                ] : null,
                'user' => $s->user ? [
                    'id' => (string) $s->user->id,
                    'name' => $s->user->name,
                    'email' => $s->user->email,
                ] : null,
                'answer' => $s->answer,
                'autoMatched' => (bool) $s->auto_matched,
                'status' => $s->status,
                'adminNotes' => $s->admin_notes,
                'awardedPoints' => (int) $s->awarded_points,
                'submittedAt' => $s->submitted_at?->toIso8601String(),
                'reviewedAt' => $s->reviewed_at?->toIso8601String(),
                'reviewedBy' => $s->reviewed_by,
            ])->values(),
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'last_page' => $submissions->lastPage(),
                'total' => $submissions->total(),
            ],
        ]);
    }

    public function submissionReview(Request $request, int $id): JsonResponse
    {
        $submission = PuzzleSubmission::findOrFail($id);
        $data = $request->validate([
            'status' => ['required', Rule::in(['pending', 'correct', 'incorrect', 'partial'])],
            'admin_notes' => 'nullable|string|max:2000',
            'awarded_points' => 'nullable|integer|min:0',
        ]);
        $submission->fill([
            'status' => $data['status'],
            'admin_notes' => $data['admin_notes'] ?? $submission->admin_notes,
            'awarded_points' => $data['awarded_points'] ?? $submission->awarded_points,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()->id,
        ])->save();

        return response()->json(['data' => new PuzzleSubmissionResource($submission)]);
    }

    protected function validatePuzzle(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'required|string',
            'difficulty' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'category' => 'nullable|string|max:80',
            'points' => 'required|integer|min:0',
            'hint' => 'nullable|string',
            'status' => ['required', Rule::in(['draft', 'active', 'closed'])],
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'image_path' => 'nullable|string|max:255',
            'answers' => 'nullable|array',
            'answers.*' => 'string|max:500',
            'auto_match_mode' => ['required', Rule::in(['exact', 'contains', 'fuzzy', 'any'])],
        ]);
    }
}
