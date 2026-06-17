<?php

use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Public\AlbumController;
use App\Http\Controllers\Api\V1\Public\CertificateController;
use App\Http\Controllers\Api\V1\Public\ContentPageController;
use App\Http\Controllers\Api\V1\Public\EventController;
use App\Http\Controllers\Api\V1\Public\HallOfFameController;
use App\Http\Controllers\Api\V1\Public\HomeController;
use App\Http\Controllers\Api\V1\Public\LeaderboardController;
use App\Http\Controllers\Api\V1\Public\LiveExamController;
use App\Http\Controllers\Api\V1\Public\NoticeController;
use App\Http\Controllers\Api\V1\Public\SiteSettingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (v1)
|--------------------------------------------------------------------------
| Mounted under /api/v1 (configured in bootstrap/app.php)
*/

// ===== AUTH =====
Route::post('auth/register', RegisterController::class)->middleware('throttle:5,1');
Route::post('auth/login', LoginController::class)->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', LogoutController::class);
    Route::get('auth/me', [MeController::class, 'show']);
    Route::patch('auth/me', [MeController::class, 'update']);
});

// ===== PUBLIC READS =====
Route::get('home/bundles', [HomeController::class, 'bundles']);
Route::get('events', [EventController::class, 'index']);
Route::get('albums', [AlbumController::class, 'index']);
Route::get('hall-of-fame', [HallOfFameController::class, 'index']);
Route::get('leaderboard', [LeaderboardController::class, 'index']);
Route::get('notices', [NoticeController::class, 'index']);
Route::get('certificates/verify', [CertificateController::class, 'verify']);
Route::get('live-exams', [LiveExamController::class, 'index']);
Route::get('pages/{slug}', [ContentPageController::class, 'show']);
Route::get('settings', [SiteSettingController::class, 'index']);
