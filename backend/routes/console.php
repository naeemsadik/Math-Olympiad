<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Olympiad scheduled jobs
|--------------------------------------------------------------------------
*/

Schedule::command('olympiad:expire-attempts')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('olympiad:sync-live-exams')
    ->everyMinute()
    ->withoutOverlapping()
    ->onOneServer();

Schedule::command('olympiad:leaderboard-snapshot')
    ->hourly()
    ->withoutOverlapping()
    ->onOneServer();
