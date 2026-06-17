<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiagnosticAttemptResource;
use App\Http\Resources\QuestionResource;
use App\Models\DiagnosticAttempt;
use App\Services\DiagnosticGrader;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiagnosticController extends Controller
{
    public function start(Request $request, DiagnosticGrader $grader): JsonResponse
    {
        $user = $request->user();
        $test = $grader->findTestForUser($user);

        if (! $test) {
            return response()->json(['message' => 'No diagnostic test is currently available.'], 404);
        }

        // Resume existing in-progress attempt
        $existing = DiagnosticAttempt::where('user_id', $user->id)
            ->where('status', 'in-progress')
            ->latest('id')
            ->first();

        if ($existing) {
            return response()->json(['data' => (new DiagnosticAttemptResource($existing))->resolve(), 'resumed' => true]);
        }

        $questionIds = $grader->pickQuestionsFor($test, $user);
        if (empty($questionIds)) {
            return response()->json(['message' => 'No diagnostic questions available for this user.'], 422);
        }

        $attempt = DiagnosticAttempt::create([
            'user_id' => $user->id,
            'test_id' => $test->id,
            'test_title' => $test->title,
            'question_ids' => $questionIds,
            'status' => 'in-progress',
            'started_at' => now(),
        ]);

        return response()->json(['data' => (new DiagnosticAttemptResource($attempt))->resolve()], 201);
    }

    public function questions(Request $request, int $attemptId): JsonResponse
    {
        $attempt = DiagnosticAttempt::where('user_id', $request->user()->id)
            ->where('id', $attemptId)
            ->firstOrFail();

        $request->attributes->set('reveal_answers', false);
        $questions = \App\Models\Question::with('options')
            ->whereIn('id', $attempt->question_ids)
            ->get();

        return response()->json([
            'data' => QuestionResource::collection($questions),
        ]);
    }

    public function submit(Request $request, int $attemptId, DiagnosticGrader $grader): JsonResponse
    {
        $attempt = DiagnosticAttempt::where('user_id', $request->user()->id)
            ->where('id', $attemptId)
            ->firstOrFail();

        $data = $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'nullable|integer',
        ]);

        $graded = $grader->gradeAndApply($attempt, $data['answers']);

        return response()->json([
            'data' => (new DiagnosticAttemptResource($graded))->resolve(),
        ]);
    }

    public function adminResults(Request $request): JsonResponse
    {
        $results = DiagnosticAttempt::with('user')
            ->where('status', 'submitted')
            ->orderByDesc('submitted_at')
            ->limit(100)
            ->get();

        return response()->json([
            'data' => $results->map(fn ($a) => [
                'id' => (string) $a->id,
                'user' => $a->user?->name,
                'email' => $a->user?->email,
                'score' => $a->score,
                'ability_level' => $a->ability_level,
                'submitted_at' => $a->submitted_at?->toIso8601String(),
            ]),
        ]);
    }
}
