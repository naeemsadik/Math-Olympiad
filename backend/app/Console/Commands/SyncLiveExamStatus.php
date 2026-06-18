<?php

namespace App\Console\Commands;

use App\Models\LiveExam;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class SyncLiveExamStatus extends Command
{
    protected $signature = 'olympiad:sync-live-exams {--dry-run}';
    protected $description = 'Transition live_exams to live/finished based on the clock';

    public function handle(): int
    {
        $now = Carbon::now();
        $transitions = 0;

        // Scheduled → live (window opened)
        $toStart = LiveExam::where('status', 'scheduled')
            ->where('scheduled_at', '<=', $now)
            ->get();
        foreach ($toStart as $exam) {
            $this->line("Starting live exam #{$exam->id}: {$exam->title}");
            if (! $this->option('dry-run')) {
                $exam->update(['status' => 'live']);
                $transitions++;
            }
        }

        // Live → completed (window closed)
        $toFinish = LiveExam::where('status', 'live')->get();
        foreach ($toFinish as $exam) {
            $endAt = $exam->scheduled_at?->copy()->addMinutes($exam->duration_minutes);
            if ($endAt && $endAt->isPast()) {
                $this->line("Finishing live exam #{$exam->id}: {$exam->title}");
                if (! $this->option('dry-run')) {
                    $exam->update(['status' => 'completed']);
                    $transitions++;
                }
            }
        }

        $this->info("Synced {$transitions} live exam(s).");
        return self::SUCCESS;
    }
}
