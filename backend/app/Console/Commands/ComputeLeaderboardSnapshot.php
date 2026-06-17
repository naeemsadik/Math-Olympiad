<?php

namespace App\Console\Commands;

use App\Models\SiteSetting;
use App\Models\TestAttempt;
use App\Models\User;
use Illuminate\Console\Command;

class ComputeLeaderboardSnapshot extends Command
{
    protected $signature = 'olympiad:leaderboard-snapshot {--window=30 : Days back to consider}';
    protected $description = 'Cache a leaderboard snapshot (read-only log, not a separate table)';

    public function handle(): int
    {
        $window = (int) $this->option('window') ?: (int) SiteSetting::get('leaderboard.window_days', 30);
        $max = (int) SiteSetting::get('leaderboard.max_entries', 50);

        $since = now()->subDays($window);

        $rows = TestAttempt::where('status', 'submitted')
            ->where('submitted_at', '>=', $since)
            ->selectRaw('user_id, AVG(score) as avg_score, AVG(accuracy) as avg_accuracy, COUNT(*) as attempts_taken, SUM(score) as total_score')
            ->groupBy('user_id')
            ->orderByDesc('total_score')
            ->limit($max)
            ->get();

        $this->info("Computed leaderboard snapshot for {$rows->count()} active users (window: {$window} days).");
        foreach ($rows as $row) {
            $user = User::find($row->user_id);
            $this->line(sprintf(
                "  #%-3d %-25s score=%.1f acc=%.1f%% attempts=%d",
                $rows->search($row) + 1,
                $user?->name ?? '?',
                $row->total_score,
                $row->avg_accuracy,
                $row->attempts_taken
            ));
        }
        return self::SUCCESS;
    }
}
