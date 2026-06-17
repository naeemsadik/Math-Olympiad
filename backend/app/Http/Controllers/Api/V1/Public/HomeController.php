<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeSectionResource;
use App\Models\HomeSection;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function bundles(): JsonResponse
    {
        $sections = HomeSection::where('published', true)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => HomeSectionResource::collection($sections),
        ]);
    }
}
