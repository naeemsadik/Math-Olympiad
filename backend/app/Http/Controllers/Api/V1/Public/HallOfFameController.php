<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HallOfFameResource;
use App\Models\HallOfFameEntry;
use Illuminate\Http\JsonResponse;

class HallOfFameController extends Controller
{
    public function index(): JsonResponse
    {
        $entries = HallOfFameEntry::orderBy('sort_order')
            ->orderBy('year', 'desc')
            ->get();

        return response()->json([
            'data' => HallOfFameResource::collection($entries),
        ]);
    }
}
