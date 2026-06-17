<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiagnosticAttempt;
use App\Models\Question;
use App\Models\Test;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalStudents = User::where('role', 'student')->count();
        $activeStudents = User::where('role', 'student')->where('status', 'active')->count();
        $avgScore = (float) round(
            DiagnosticAttempt::where('status', 'submitted')->avg('score') ?? 0,
            2
        );
        $topicsCount = Topic::count();
        $testsCount = Test::count();
        $questionsCount = Question::count();

        $tierBreakdown = User::where('role', 'student')
            ->selectRaw('tier, COUNT(*) as count')
            ->groupBy('tier')
            ->pluck('count', 'tier');

        return response()->json([
            'data' => [
                'totalStudents' => $totalStudents,
                'activeStudents' => $activeStudents,
                'platformAvgScore' => $avgScore,
                'topicsAvailable' => $topicsCount,
                'testsAvailable' => $testsCount,
                'questionsAvailable' => $questionsCount,
                'tierBreakdown' => $tierBreakdown,
            ],
        ]);
    }
}
