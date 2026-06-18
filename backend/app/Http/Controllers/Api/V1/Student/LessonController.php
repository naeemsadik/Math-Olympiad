<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function complete(Request $request, int $id): JsonResponse
    {
        $lesson = Lesson::findOrFail($id);
        LessonProgress::firstOrCreate(
            ['user_id' => $request->user()->id, 'lesson_id' => $lesson->id],
            ['completed_at' => now()]
        );

        return response()->json(['message' => 'Lesson marked complete.']);
    }
}
