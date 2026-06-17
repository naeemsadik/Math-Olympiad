<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\ModuleResource;
use App\Http\Resources\TopicResource;
use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Topic::query();
        if ($tier = $request->query('tier')) {
            $query->where('tier', $tier);
        }
        $topics = $query->orderBy('tier')->orderBy('name')->get();

        return response()->json([
            'data' => TopicResource::collection($topics),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $topic = Topic::where('slug', $slug)
            ->with(['modules.lessons'])
            ->firstOrFail();

        $payload = (new TopicResource($topic))->resolve();
        $payload['modules'] = ModuleResource::collection($topic->modules->load('lessons'))->resolve();

        return response()->json(['data' => $payload]);
    }
}
