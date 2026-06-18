<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\PuzzleResource;
use App\Http\Resources\PuzzleSubmissionResource;
use App\Models\Puzzle;
use App\Models\PuzzleSubmission;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PuzzleController extends Controller
{
    public function today(Request $request): JsonResponse
    {
        $user = $request->user();
        $tier = $request->query('tier', $user->tier) ?? 'Beginner';

        $puzzle = Puzzle::where('tier', $tier)
            ->where('date', Carbon::today())
            ->first();

        if (! $puzzle) {
            // Fallback: most recent puzzle for that tier
            $puzzle = Puzzle::where('tier', $tier)
                ->orderByDesc('date')
                ->first();
        }

        if (! $puzzle) {
            return response()->json(['data' => null]);
        }

        return response()->json([
            'data' => (new PuzzleResource($puzzle))->resolve(),
        ]);
    }

    public function mySubmissions(Request $request, int $puzzleId): JsonResponse
    {
        $sub = PuzzleSubmission::where('puzzle_id', $puzzleId)
            ->where('user_id', $request->user()->id)
            ->first();

        return response()->json([
            'data' => $sub ? (new PuzzleSubmissionResource($sub))->resolve() : null,
        ]);
    }

    public function submit(Request $request, int $puzzleId): JsonResponse
    {
        $data = $request->validate([
            'answer' => 'required|string|max:5000',
        ]);

        $puzzle = Puzzle::findOrFail($puzzleId);
        $normalized = $this->normalize($data['answer']);

        $autoCorrect = null;
        $isCorrect = null;
        if ($puzzle->auto_match_normalized !== null) {
            $autoCorrect = $normalized === $puzzle->auto_match_normalized;
            $isCorrect = $autoCorrect ? true : null; // null = pending review
        }

        $sub = PuzzleSubmission::updateOrCreate(
            ['puzzle_id' => $puzzle->id, 'user_id' => $request->user()->id],
            [
                'answer' => $data['answer'],
                'auto_correct' => $autoCorrect,
                'is_correct' => $isCorrect,
                'submitted_at' => now(),
            ]
        );

        if ($isCorrect === true) {
            $puzzle->increment('streak_count');
        }

        return response()->json([
            'data' => (new PuzzleSubmissionResource($sub))->resolve(),
            'status' => $isCorrect === true ? 'accepted' : 'pending_review',
        ], 201);
    }

    protected function normalize(string $value): string
    {
        return strtolower(trim(preg_replace('/\s+/', ' ', $value)));
    }
}
