<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\TopicResource;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TopicController extends Controller
{
    public function index(): JsonResponse
    {
        $topics = Topic::withCount('questions')->orderBy('tier')->orderBy('name')->get();
        return response()->json(['data' => TopicResource::collection($topics)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validateTopic($request);
        $topic = Topic::create($data);
        return response()->json(['data' => new TopicResource($topic)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $topic = Topic::findOrFail($id);
        $data = $this->validateTopic($request, $topic->id);
        $topic->fill($data)->save();
        return response()->json(['data' => new TopicResource($topic)]);
    }

    public function destroy(int $id): JsonResponse
    {
        Topic::findOrFail($id)->delete();
        return response()->json(['message' => 'Topic deleted.']);
    }

    public function modules(int $id): JsonResponse
    {
        $topic = Topic::with('modules')->findOrFail($id);
        return response()->json(['data' => ModuleResource::collection($topic->modules)]);
    }

    public function storeModule(Request $request, int $id): JsonResponse
    {
        $topic = Topic::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:160',
            'description' => 'nullable|string',
            'difficulty' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'order' => 'nullable|integer',
        ]);
        $data['topic_id'] = $topic->id;
        $module = \App\Models\Module::create($data);
        return response()->json(['data' => new ModuleResource($module)], 201);
    }

    protected function validateTopic(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => ['required', 'string', 'max:120', Rule::unique('topics', 'slug')->ignore($ignoreId)],
            'name' => 'required|string|max:160',
            'description' => 'nullable|string',
            'tier' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced'])],
            'level' => ['required', Rule::in(['Beginner', 'Intermediate', 'Advanced', 'Elite'])],
            'color' => 'nullable|string|max:20',
            'image_path' => 'nullable|string|max:255',
            'lesson_count' => 'nullable|integer',
            'problem_count' => 'nullable|integer',
        ]);
    }
}
