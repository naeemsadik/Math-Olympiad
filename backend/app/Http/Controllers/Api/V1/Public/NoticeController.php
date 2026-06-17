<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\NoticeResource;
use App\Models\Notice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Notice::with('author');
        if ($tier = $request->query('tier')) {
            $query->where(function ($q) use ($tier) {
                $q->where('tier', 'All')->orWhere('tier', $tier);
            });
        }
        $notices = $query->orderByDesc('published_at')->get();

        return response()->json([
            'data' => NoticeResource::collection($notices),
        ]);
    }
}
