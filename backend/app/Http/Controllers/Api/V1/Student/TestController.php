<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\PracticeAttemptResource;
use App\Http\Resources\QuestionResource;
use App\Http\Resources\TestAttemptResource;
use App\Http\Resources\TestResource;
use App\Models\Question;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Services\TestAttemptScorer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Test::where('test_type', $request->query('type', 'practice'))
            ->where('is_public', true);

        if ($tier = $request->query('tier')) {
            $query->where('tier', $tier);
        }
        if ($classYear = $request->query('classYear')) {
            $query->where(function ($q) use ($classYear) {
                $q->whereNull('target_class_year')
                    ->orWhere('target_class_year', $classYear)
                    ->orWhere('target_class_year', 'All Classes');
            });
        }
        if ($ability = $request->query('ability')) {
            $query->where(function ($q) use ($ability) {
                $q->whereNull('ability_level')->orWhere('ability_level', $ability);
            });
        }

        $tests = $query->orderBy('id')->get();

        return response()->json([
            'data' => TestResource::collection($tests),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $test = Test::with(['questions' => function ($q) {
            $q->orderBy('test_questions.order');
        }, 'questions.options'])->findOrFail($id);

        // Hide correct answers
        $request->attributes->set('reveal_answers', false);

        $payload = (new TestResource($test->load('questions.options')))->resolve();
        $payload['questions'] = QuestionResource::collection($test->questions->load('options'))->resolve();

        return response()->json(['data' => $payload]);
    }

    public function start(Request $request, int $id, TestAttemptScorer $scorer): JsonResponse
    {
        $test = Test::findOrFail($id);
        $user = $request->user();

        // Resume existing in-progress attempt
        $existing = TestAttempt::where('user_id', $user->id)
            ->where('test_id', $test->id)
            ->where('status', 'in-progress')
            ->latest('id')
            ->first();

        if ($existing) {
            return response()->json([
                'data' => (new PracticeAttemptResource($existing))->resolve(),
                'resumed' => true,
            ]);
        }

        $questionIds = $test->test_type === 'diagnostic'
            ? app(\App\Services\DiagnosticGrader::class)->pickQuestionsFor($test, $user)
            : $test->questions()->pluck('questions.id')->all();

        if (empty($questionIds)) {
            return response()->json(['message' => 'No questions available for this test.'], 422);
        }

        $attempt = TestAttempt::create([
            'user_id' => $user->id,
            'test_id' => $test->id,
            'test_title' => $test->title,
            'status' => 'in-progress',
            'started_at' => now(),
        ]);

        $scorer->startAttempt($attempt, $questionIds);

        return response()->json([
            'data' => (new PracticeAttemptResource($attempt->fresh()))->resolve(),
        ], 201);
    }

    public function advance(Request $request, int $attemptId, TestAttemptScorer $scorer): JsonResponse
    {
        $attempt = TestAttempt::where('user_id', $request->user()->id)
            ->where('id', $attemptId)
            ->firstOrFail();

        $request->validate(['current_index' => 'required|integer|min:0']);
        $scorer->advance($attempt, (int) $request->input('current_index'));

        return response()->json(['data' => (new PracticeAttemptResource($attempt->fresh()))->resolve()]);
    }

    public function answer(Request $request, int $attemptId, TestAttemptScorer $scorer): JsonResponse
    {
        $attempt = TestAttempt::where('user_id', $request->user()->id)
            ->where('id', $attemptId)
            ->firstOrFail();

        $data = $request->validate([
            'question_id' => 'required|integer|exists:questions,id',
            'option_id' => 'nullable|integer|exists:question_options,id',
        ]);

        $scorer->recordAnswer($attempt, (int) $data['question_id'], $data['option_id'] ?? null);

        return response()->json(['data' => (new PracticeAttemptResource($attempt->fresh()))->resolve()]);
    }

    public function submit(Request $request, int $attemptId, TestAttemptScorer $scorer): JsonResponse
    {
        $attempt = TestAttempt::where('user_id', $request->user()->id)
            ->where('id', $attemptId)
            ->firstOrFail();

        $scored = $scorer->submit($attempt);
        $request->attributes->set('reveal_answers', true);

        $attemptWithRelations = $scored->load(['topicBreakdown.topic', 'questionAnswers']);
        $payload = (new TestAttemptResource($attemptWithRelations))->resolve();

        return response()->json(['data' => $payload]);
    }

    public function result(Request $request, int $attemptId): JsonResponse
    {
        $attempt = TestAttempt::where('user_id', $request->user()->id)
            ->where('id', $attemptId)
            ->with(['topicBreakdown.topic', 'questionAnswers'])
            ->firstOrFail();

        $request->attributes->set('reveal_answers', true);

        return response()->json([
            'data' => (new TestAttemptResource($attempt))->resolve(),
        ]);
    }

    public function attempts(Request $request): JsonResponse
    {
        $attempts = TestAttempt::where('user_id', $request->user()->id)
            ->whereIn('status', ['submitted', 'expired'])
            ->orderByDesc('submitted_at')
            ->limit(50)
            ->get();

        return response()->json([
            'data' => TestAttemptResource::collection($attempts),
        ]);
    }
}
