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
use App\Http\Controllers\Api\V1\Student\CommunityController;
use App\Http\Controllers\Api\V1\Student\DashboardController;
use App\Http\Controllers\Api\V1\Student\DiagnosticController;
use App\Http\Controllers\Api\V1\Student\EventRegistrationController;
use App\Http\Controllers\Api\V1\Student\LessonController;
use App\Http\Controllers\Api\V1\Student\PuzzleController;
use App\Http\Controllers\Api\V1\Student\TestController;
use App\Http\Controllers\Api\V1\Student\TopicController;
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

// ===== STUDENT (auth required) =====
Route::middleware('auth:sanctum')->group(function () {
    Route::get('student/dashboard', DashboardController::class);

    // Topics + lessons
    Route::get('topics', [TopicController::class, 'index']);
    Route::get('topics/{slug}', [TopicController::class, 'show']);
    Route::post('lessons/{id}/complete', [LessonController::class, 'complete']);

    // Tests (gated by placement.done for /start)
    Route::get('tests', [TestController::class, 'index']);
    Route::get('tests/{id}', [TestController::class, 'show']);
    Route::get('attempts', [TestController::class, 'attempts']);
    Route::get('attempts/{attemptId}/result', [TestController::class, 'result']);

    Route::middleware('placement.done')->group(function () {
        Route::post('tests/{id}/attempts/start', [TestController::class, 'start']);
        Route::patch('attempts/{attemptId}/answer', [TestController::class, 'answer']);
        Route::patch('attempts/{attemptId}/advance', [TestController::class, 'advance']);
        Route::post('attempts/{attemptId}/submit', [TestController::class, 'submit']);
    });

    // Diagnostic (placement is allowed without placement.done)
    Route::post('diagnostic/start', [DiagnosticController::class, 'start']);
    Route::get('diagnostic/{attemptId}/questions', [DiagnosticController::class, 'questions']);
    Route::post('diagnostic/{attemptId}/submit', [DiagnosticController::class, 'submit']);

    // Daily puzzle
    Route::get('puzzles/today', [PuzzleController::class, 'today']);
    Route::get('puzzles/{id}/submissions/me', [PuzzleController::class, 'mySubmissions']);
    Route::post('puzzles/{id}/submissions', [PuzzleController::class, 'submit'])->middleware('throttle:3,60');

    // Community
    Route::get('community/posts', [CommunityController::class, 'index']);
    Route::post('community/posts', [CommunityController::class, 'store']);
    Route::post('community/posts/{id}/like', [CommunityController::class, 'like']);
    Route::get('community/posts/{id}/replies', [CommunityController::class, 'replies']);
    Route::post('community/posts/{id}/replies', [CommunityController::class, 'storeReply']);

    // Event registrations
    Route::post('event-registrations', [EventRegistrationController::class, 'store']);
});
