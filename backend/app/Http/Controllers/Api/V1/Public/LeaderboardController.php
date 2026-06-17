<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeaderboardEntryResource;
use App\Models\TestAttempt;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class LeaderboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $period = $request->query('period', 'alltime'); // monthly | alltime
        $tier = $request->query('tier');                 // optional
        $limit = (int) $request->query('limit', 45);

        $cacheKey = "leaderboard:{$period}:{$tier}:{$limit}";

        $entries = Cache::remember($cacheKey, 300, function () use ($period, $tier, $limit) {
            $query = User::query()
                ->where('role', 'student')
                ->where('status', 'active');

            if ($tier) {
                $query->where('tier', $tier);
            }

            // Compute XP score: each submitted attempt = score (out of 100) + accuracy bonus
            $query->withSum(['testAttempts as total_score' => function ($q) use ($period) {
                $q->where('status', 'submitted');
                if ($period === 'monthly') {
                    $days = (int) config('olympiad.leaderboard.monthly_window_days', 30);
                    $q->where('submitted_at', '>=', Carbon::now()->subDays($days));
                }
            }], 'score')
            ->withCount(['testAttempts as submitted_attempts_count' => function ($q) use ($period) {
                $q->where('status', 'submitted');
                if ($period === 'monthly') {
                    $days = (int) config('olympiad.leaderboard.monthly_window_days', 30);
                    $q->where('submitted_at', '>=', Carbon::now()->subDays($days));
                }
            }]);

            $users = $query->orderByDesc('xp')
                ->orderByDesc('total_score')
                ->limit($limit)
                ->get();

            return $users->map(function ($u, $idx) {
                return [
                    'rank' => $idx + 1,
                    'name' => $u->name,
                    'department' => $u->department,
                    'institute' => $u->institute,
                    'tier' => $u->tier,
                    'rating' => (int) ($u->xp + ($u->total_score ?? 0)),
                    'trend' => 'stable',
                    'avatar' => $u->avatar_path,
                ];
            })->values()->all();
        });

        return response()->json([
            'data' => collect($entries)->map(fn ($e) => new LeaderboardEntryResource((object) $e))->values(),
        ]);
    }
}
