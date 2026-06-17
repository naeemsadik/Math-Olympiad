<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\LiveExamResource;
use App\Models\LiveExam;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LiveExamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = LiveExam::query()->whereIn('status', ['upcoming', 'live']);
        if ($tier = $request->query('tier')) {
            $query->where('tier', $tier);
        }
        $exams = $query->orderBy('scheduled_at')->get();

        return response()->json([
            'data' => LiveExamResource::collection($exams),
        ]);
    }
}
