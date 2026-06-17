<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardStatsResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request, DashboardService $service): JsonResponse
    {
        $stats = $service->build($request->user());
        return response()->json(['data' => (new DashboardStatsResource($stats))->resolve()]);
    }
}
