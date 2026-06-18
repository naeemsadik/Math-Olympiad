<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePlacementDone
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }
        if (! $user->placement_done) {
            return response()->json([
                'message' => 'Placement required.',
                'code' => 'PLACEMENT_REQUIRED',
            ], 403);
        }
        return $next($request);
    }
}
