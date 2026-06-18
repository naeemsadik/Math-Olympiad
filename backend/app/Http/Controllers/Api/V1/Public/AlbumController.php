<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\AlbumResource;
use App\Models\Album;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AlbumController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Album::query();
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        $albums = $query->orderBy('sort_order')->withCount('photos')->get();

        return response()->json([
            'data' => AlbumResource::collection($albums),
        ]);
    }
}
