<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use App\Models\QuestionOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class QuestionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Question::query();
        foreach (['topic' => 'topic_id', 'ability' => 'ability_level', 'status' => 'status', 'classYear' => 'target_class_year'] as $param => $col) {
            if ($val = $request->query($param)) {
                $query->where($col, $val);
            }
        }
        if ($search = $request->query('search')) {
            $query->where(fn ($q) => $q->where('content', 'like', "%{$search}%")->orWhere('explanation', 'like', "%{$search}%"));
        }
        $questions = $query->with('options')->orderByDesc('id')->paginate(25);
        $request->attributes->set('reveal_answers', true);

        return response()->json([
            'data' => QuestionResource::collection($questions->items()),
            'meta' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'total' => $questions->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateQ($request);
        $question = DB::transaction(function () use ($data) {
            $q = Question::create($this->extractQuestionFields($data));
            $this->syncOptions($q, $data['options'] ?? []);
            return $q;
        });
        $request->attributes->set('reveal_answers', true);

        return response()->json(['data' => new QuestionResource($question->load('options'))], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $question = Question::findOrFail($id);
        $data = $this->validateQ($request);
        DB::transaction(function () use ($question, $data) {
            $question->update($this->extractQuestionFields($data));
            if (isset($data['options'])) {
                $this->syncOptions($question, $data['options']);
            }
        });
        $request->attributes->set('reveal_answers', true);

        return response()->json(['data' => new QuestionResource($question->fresh('options'))]);
    }

    public function destroy(int $id): JsonResponse
    {
        Question::findOrFail($id)->delete();
        return response()->json(['message' => 'Question deleted.']);
    }

    protected function validateQ(Request $request): array
    {
        return $request->validate([
            'content' => 'required|string',
            'topic_id' => 'nullable|exists:topics,id',
            'difficulty' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'tier' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced'])],
            'format' => ['required', Rule::in(['text-to-text', 'text-to-image', 'image-to-text', 'image-to-image'])],
            'prompt_kind' => ['nullable', Rule::in(['text', 'image'])],
            'prompt_value' => 'nullable|string',
            'prompt_alt' => 'nullable|string|max:255',
            'ability_level' => ['nullable', Rule::in(['Beginner', 'Advanced', 'Expert'])],
            'target_class_year' => 'nullable|string|max:60',
            'marks' => 'nullable|numeric|min:0',
            'time_limit_seconds' => 'nullable|integer|min:10|max:3600',
            'subtopic_tags' => 'nullable|array',
            'source' => 'nullable|string|max:190',
            'explanation' => 'nullable|string',
            'status' => ['required', Rule::in(['draft', 'published'])],
            'is_diagnostic_eligible' => 'boolean',
            'options' => 'nullable|array|min:2',
            'options.*.id' => 'nullable|integer|exists:question_options,id',
            'options.*.label' => 'required_with:options|string|max:4',
            'options.*.media_kind' => ['required_with:options', Rule::in(['text', 'image'])],
            'options.*.media_value' => 'nullable|string',
            'options.*.media_alt' => 'nullable|string|max:255',
            'options.*.is_correct' => 'required_with:options|boolean',
            'options.*.order' => 'nullable|integer',
        ]);
    }

    protected function extractQuestionFields(array $data): array
    {
        unset($data['options']);
        return $data;
    }

    protected function syncOptions(Question $question, array $options): void
    {
        $existingIds = $question->options()->pluck('id')->all();
        $kept = [];

        foreach ($options as $i => $opt) {
            if (! empty($opt['id']) && in_array($opt['id'], $existingIds, true)) {
                $qo = QuestionOption::find($opt['id']);
                $qo->update([
                    'label' => $opt['label'],
                    'media_kind' => $opt['media_kind'],
                    'media_value' => $opt['media_value'] ?? null,
                    'media_alt' => $opt['media_alt'] ?? null,
                    'is_correct' => (bool) ($opt['is_correct'] ?? false),
                    'order' => $opt['order'] ?? $i,
                ]);
                $kept[] = $opt['id'];
            } else {
                $qo = $question->options()->create([
                    'label' => $opt['label'],
                    'media_kind' => $opt['media_kind'],
                    'media_value' => $opt['media_value'] ?? null,
                    'media_alt' => $opt['media_alt'] ?? null,
                    'is_correct' => (bool) ($opt['is_correct'] ?? false),
                    'order' => $opt['order'] ?? $i,
                ]);
                $kept[] = $qo->id;
            }
        }

        // Remove any options not present in payload
        $toDelete = array_diff($existingIds, $kept);
        if (! empty($toDelete)) {
            QuestionOption::whereIn('id', $toDelete)->delete();
        }
    }
}
