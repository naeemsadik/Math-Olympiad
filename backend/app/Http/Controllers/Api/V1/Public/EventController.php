<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\OlympiadEventResource;
use App\Models\OlympiadEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = OlympiadEvent::query();

        if ($type = $request->query('type')) {
            $query->where('type', $type);
        }
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }
        if ($request->boolean('internal')) {
            $query->where('is_internal', true);
        }

        $events = $query->orderBy('date')->get();

        return response()->json([
            'data' => OlympiadEventResource::collection($events),
        ]);
    }
}
