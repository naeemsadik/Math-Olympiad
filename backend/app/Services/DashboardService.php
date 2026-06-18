<?php

namespace App\Services;

use App\Models\AttemptTopicBreakdown;
use App\Models\Test;
use App\Models\TestAttempt;
use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
    public function build(User $user): array
    {
        $attempts = TestAttempt::where('user_id', $user->id)
            ->where('status', 'submitted')
            ->get();

        $testsTaken = $attempts->count();
        $avgScore = $testsTaken > 0 ? (float) round($attempts->avg('score'), 2) : 0;
        $bestScore = $testsTaken > 0 ? (float) round($attempts->max('score'), 2) : 0;
        $totalSeconds = (int) $attempts->sum('time_spent_seconds');
        $totalTime = sprintf('%dh %dm', intdiv($totalSeconds, 3600), intdiv($totalSeconds % 3600, 60));

        // Topic mastery
        $topicMastery = AttemptTopicBreakdown::query()
            ->selectRaw('topic_id, AVG(accuracy) as avg_accuracy, COUNT(*) as attempts_count')
            ->whereIn('test_attempt_id', $attempts->pluck('id'))
            ->groupBy('topic_id')
            ->with('topic')
            ->get()
            ->map(fn ($row) => [
                'topic' => $row->topic?->name ?? 'Mixed',
                'accuracy' => (float) round($row->avg_accuracy, 1),
                'speed' => 0,
            ])
            ->values()
            ->all();

        // Recent activity
        $recentActivity = $attempts->sortByDesc('submitted_at')->take(8)->map(function ($a) {
            return [
                'type' => 'test',
                'title' => $a->test_title ?? 'Test',
                'score' => round($a->score, 1) . '%',
                'xp' => (int) round($a->score * 0.5 + $a->accuracy * 2),
                'time' => $a->submitted_at?->diffForHumans(),
            ];
        })->values()->all();

        // Recommended next test (first test the user hasn't attempted, matching tier+ability)
        $attemptedTestIds = $attempts->pluck('test_id')->all();
        $recommended = Test::where('test_type', 'practice')
            ->where('is_public', true)
            ->whereNotIn('id', $attemptedTestIds)
            ->when($user->tier, fn ($q) => $q->where('tier', $user->tier))
            ->orderBy('id')
            ->limit(3)
            ->get()
            ->map(fn ($t) => [
                'title' => $t->title,
                'topic' => $t->topic?->name,
                'level' => $t->difficulty,
                'id' => (string) $t->id,
            ])
            ->values()
            ->all();

        // Learning path: completed modules + next module
        $learningPath = $this->buildLearningPath($user);

        return [
            'testsTaken' => $testsTaken,
            'averageScore' => $avgScore,
            'bestScore' => $bestScore,
            'totalTime' => $totalTime,
            'topicMastery' => $topicMastery,
            'recentActivity' => $recentActivity,
            'learningPath' => $learningPath,
            'recommendedNext' => $recommended,
        ];
    }

    protected function buildLearningPath(User $user): array
    {
        // Simple stub: list topics with completed=0 (or 1 if any lesson completed)
        $topics = \App\Models\Topic::orderBy('tier')->limit(6)->get();
        $completedTopicIds = \App\Models\LessonProgress::where('user_id', $user->id)
            ->join('lessons', 'lessons.id', '=', 'lesson_progress.lesson_id')
            ->join('modules', 'modules.id', '=', 'lessons.module_id')
            ->pluck('modules.topic_id')
            ->unique()
            ->all();

        $path = [];
        foreach ($topics as $i => $topic) {
            $isCompleted = in_array($topic->id, $completedTopicIds, true);
            $isLocked = $i > 0 && ! in_array($topics[$i - 1]->id, $completedTopicIds, true) && ! $isCompleted;
            $path[] = [
                'title' => $topic->name,
                'progress' => $isCompleted ? 100 : 0,
                'status' => $isCompleted ? 'completed' : ($isLocked ? 'locked' : 'in_progress'),
            ];
        }
        return $path;
    }
}
