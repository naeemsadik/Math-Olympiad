<?php

namespace App\Services;

use App\Models\TestAttempt;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class XpService
{
    public function awardForAttempt(TestAttempt $attempt): void
    {
        $user = $attempt->user;
        if (! $user) return;

        $xpGained = (int) round(($attempt->score * 0.5) + ($attempt->accuracy * 2));

        DB::transaction(function () use ($user, $xpGained) {
            $user->xp = (int) $user->xp + $xpGained;

            $today = Carbon::today();
            $last = $user->last_active_at;

            if (! $last) {
                $user->streak = 1;
            } else {
                $daysDiff = $last->diffInDays($today, false);
                if ($daysDiff === 0) {
                    // same day, no streak change
                } elseif ($daysDiff === 1) {
                    $user->streak = (int) $user->streak + 1;
                } else {
                    $user->streak = 1;
                }
            }
            $user->last_active_at = $today;
            $user->level = app(DiagnosticGrader::class)->levelForXp((int) $user->xp);
            $user->save();
        });
    }
}
