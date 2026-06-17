<?php

namespace App\Console\Commands;

use App\Models\TestAttempt;
use App\Services\TestAttemptScorer;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class ExpireInProgressAttempts extends Command
{
    protected $signature = 'olympiad:expire-attempts {--dry-run : Show what would be expired without doing it}';
    protected $description = 'Auto-submit test attempts whose time has expired';

    public function handle(TestAttemptScorer $scorer): int
    {
        $now = Carbon::now();
        $candidates = TestAttempt::where('status', 'in_progress')
            ->whereNotNull('started_at')
            ->get()
            ->filter(fn ($a) => $a->started_at->copy()->addMinutes($a->test_duration_snapshot ?? 0)->isPast());

        $count = 0;
        foreach ($candidates as $attempt) {
            $this->line("Expiring attempt #{$attempt->id} for user #{$attempt->user_id}");
            if (! $this->option('dry-run')) {
                $scorer->submit($attempt, true);
                $count++;
            }
        }
        $this->info("Expired {$count} attempt(s).");
        return self::SUCCESS;
    }
}
