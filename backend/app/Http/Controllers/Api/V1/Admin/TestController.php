<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestResource;
use App\Models\Question;
use App\Models\Test;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Test::query();
        if ($type = $request->query('type')) {
            $query->where('test_type', $type);
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('description', 'like', "%{$search}%"));
        }
        $tests = $query->withCount('questions')->orderByDesc('id')->paginate(25);

        return response()->json([
            'data' => TestResource::collection($tests->items()),
            'meta' => [
                'current_page' => $tests->currentPage(),
                'last_page' => $tests->lastPage(),
                'total' => $tests->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateTest($request);
        $test = Test::create($data);
        if (! empty($data['question_ids'])) {
            $this->attachQuestions($test, $data['question_ids']);
        }
        return response()->json(['data' => new TestResource($test->load('questions'))], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $test = Test::findOrFail($id);
        $data = $this->validateTest($request, $test->id);
        $test->fill($data)->save();
        if (isset($data['question_ids'])) {
            $this->attachQuestions($test, $data['question_ids']);
        }
        return response()->json(['data' => new TestResource($test->fresh('questions'))]);
    }

    public function destroy(int $id): JsonResponse
    {
        Test::findOrFail($id)->delete();
        return response()->json(['message' => 'Test deleted.']);
    }

    public function attachQuestions(Test $test, array $questionIds): void
    {
        $sync = [];
        foreach ($questionIds as $i => $qid) {
            $sync[$qid] = ['order' => $i];
        }
        $test->questions()->sync($sync);
        $test->update(['question_count' => $test->questions()->count()]);
    }

    protected function validateTest(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'duration' => 'required|integer|min:1|max:600',
            'difficulty' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'tier' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced'])],
            'topic_id' => 'nullable|exists:topics,id',
            'is_public' => 'boolean',
            'source' => 'nullable|string|max:190',
            'tags' => 'nullable|array',
            'test_type' => ['required', Rule::in(['practice', 'diagnostic'])],
            'target_class_year' => 'nullable|string|max:60',
            'ability_level' => ['nullable', Rule::in(['Beginner', 'Advanced', 'Expert'])],
            'random_question_count' => 'nullable|integer|min:1',
            'advanced_threshold' => 'nullable|integer|min:0|max:100',
            'expert_threshold' => 'nullable|integer|min:0|max:100',
            'question_ids' => 'nullable|array',
            'question_ids.*' => 'exists:questions,id',
        ]);

        if (($data['test_type'] ?? null) === 'diagnostic') {
            $adv = (int) ($data['advanced_threshold'] ?? 0);
            $exp = (int) ($data['expert_threshold'] ?? 0);
            if ($adv >= $exp) {
                abort(response()->json([
                    'message' => 'advanced_threshold must be < expert_threshold.',
                    'errors' => ['advanced_threshold' => ['Must be less than expert_threshold.']],
                ], 422));
            }
            if (empty($data['random_question_count'])) {
                abort(response()->json([
                    'message' => 'Diagnostic tests require random_question_count.',
                ], 422));
            }
        }

        return $data;
    }
}
