<?php

use App\Http\Controllers\Api\V1\Admin\AlbumController as AdminAlbumController;
use App\Http\Controllers\Api\V1\Admin\CertificateController as AdminCertificateController;
use App\Http\Controllers\Api\V1\Admin\CommunityController as AdminCommunityController;
use App\Http\Controllers\Api\V1\Admin\ContentController as AdminContentController;
use App\Http\Controllers\Api\V1\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\V1\Admin\EventController as AdminEventController;
use App\Http\Controllers\Api\V1\Admin\HallOfFameController as AdminHallOfFameController;
use App\Http\Controllers\Api\V1\Admin\NoticeController as AdminNoticeController;
use App\Http\Controllers\Api\V1\Admin\PuzzleController as AdminPuzzleController;
use App\Http\Controllers\Api\V1\Admin\QuestionController as AdminQuestionController;
use App\Http\Controllers\Api\V1\Admin\RegistrationController as AdminRegistrationController;
use App\Http\Controllers\Api\V1\Admin\TestController as AdminTestController;
use App\Http\Controllers\Api\V1\Admin\TopicController as AdminTopicController;
use App\Http\Controllers\Api\V1\Admin\UserController as AdminUserController;
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
Route::get('topics', [TopicController::class, 'index']);
Route::get('topics/{slug}', [TopicController::class, 'show']);

// ===== STUDENT (auth required) =====
Route::middleware('auth:sanctum')->group(function () {
    Route::get('student/dashboard', DashboardController::class);

    // Lessons (still require auth to track progress)
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

// ===== ADMIN =====
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('dashboard/stats', [AdminDashboardController::class, 'stats']);

    // Users
    Route::get('users', [AdminUserController::class, 'index']);
    Route::post('users', [AdminUserController::class, 'store']);
    Route::get('users/{id}', [AdminUserController::class, 'show']);
    Route::patch('users/{id}', [AdminUserController::class, 'update']);
    Route::delete('users/{id}', [AdminUserController::class, 'destroy']);
    Route::post('users/{id}/reset-diagnostic', [AdminUserController::class, 'resetDiagnostic']);

    // Topics + modules
    Route::get('topics', [AdminTopicController::class, 'index']);
    Route::post('topics', [AdminTopicController::class, 'store']);
    Route::patch('topics/{id}', [AdminTopicController::class, 'update']);
    Route::delete('topics/{id}', [AdminTopicController::class, 'destroy']);
    Route::get('topics/{id}/modules', [AdminTopicController::class, 'modules']);
    Route::post('topics/{id}/modules', [AdminTopicController::class, 'storeModule']);

    // Questions
    Route::get('questions', [AdminQuestionController::class, 'index']);
    Route::post('questions', [AdminQuestionController::class, 'store']);
    Route::patch('questions/{id}', [AdminQuestionController::class, 'update']);
    Route::delete('questions/{id}', [AdminQuestionController::class, 'destroy']);

    // Tests
    Route::get('tests', [AdminTestController::class, 'index']);
    Route::post('tests', [AdminTestController::class, 'store']);
    Route::patch('tests/{id}', [AdminTestController::class, 'update']);
    Route::delete('tests/{id}', [AdminTestController::class, 'destroy']);

    // Notices
    Route::get('notices', [AdminNoticeController::class, 'index']);
    Route::post('notices', [AdminNoticeController::class, 'store']);
    Route::patch('notices/{id}', [AdminNoticeController::class, 'update']);
    Route::delete('notices/{id}', [AdminNoticeController::class, 'destroy']);
    Route::post('notices/{id}/toggle-pin', [AdminNoticeController::class, 'togglePin']);

    // Olympiad events
    Route::get('events/olympiad', [AdminEventController::class, 'olympiadIndex']);
    Route::post('events/olympiad', [AdminEventController::class, 'olympiadStore']);
    Route::patch('events/olympiad/{id}', [AdminEventController::class, 'olympiadUpdate']);
    Route::delete('events/olympiad/{id}', [AdminEventController::class, 'olympiadDestroy']);

    // Internal sessions
    Route::get('events/internal-sessions', [AdminEventController::class, 'internalIndex']);
    Route::post('events/internal-sessions', [AdminEventController::class, 'internalStore']);
    Route::patch('events/internal-sessions/{id}', [AdminEventController::class, 'internalUpdate']);
    Route::delete('events/internal-sessions/{id}', [AdminEventController::class, 'internalDestroy']);

    // Live exams
    Route::get('events/live-exams', [AdminEventController::class, 'liveIndex']);
    Route::post('events/live-exams', [AdminEventController::class, 'liveStore']);
    Route::patch('events/live-exams/{id}', [AdminEventController::class, 'liveUpdate']);
    Route::delete('events/live-exams/{id}', [AdminEventController::class, 'liveDestroy']);

    // Registration events
    Route::get('registration-events', [AdminRegistrationController::class, 'eventIndex']);
    Route::post('registration-events', [AdminRegistrationController::class, 'eventStore']);
    Route::patch('registration-events/{id}', [AdminRegistrationController::class, 'eventUpdate']);
    Route::delete('registration-events/{id}', [AdminRegistrationController::class, 'eventDestroy']);
    Route::get('registration-events/{id}/registrations', [AdminRegistrationController::class, 'registrationIndex']);
    Route::patch('registration-events/{eventId}/registrations/{regId}', [AdminRegistrationController::class, 'registrationUpdate']);
    Route::delete('registration-events/{eventId}/registrations/{regId}', [AdminRegistrationController::class, 'registrationDestroy']);
    Route::get('registration-events/{id}/registrations/export', [AdminRegistrationController::class, 'exportCsv']);

    // Certificates
    Route::get('certificates', [AdminCertificateController::class, 'index']);
    Route::post('certificates', [AdminCertificateController::class, 'store']);
    Route::patch('certificates/{id}', [AdminCertificateController::class, 'update']);
    Route::delete('certificates/{id}', [AdminCertificateController::class, 'destroy']);
    Route::post('certificates/{id}/revoke', [AdminCertificateController::class, 'revoke']);
    Route::post('certificates/{id}/restore', [AdminCertificateController::class, 'restore']);
    Route::get('certificates/export', [AdminCertificateController::class, 'exportCsv']);

    // Puzzles + submissions review
    Route::get('puzzles', [AdminPuzzleController::class, 'index']);
    Route::post('puzzles', [AdminPuzzleController::class, 'store']);
    Route::patch('puzzles/{id}', [AdminPuzzleController::class, 'update']);
    Route::delete('puzzles/{id}', [AdminPuzzleController::class, 'destroy']);
    Route::get('puzzle-submissions', [AdminPuzzleController::class, 'submissionsIndex']);
    Route::patch('puzzle-submissions/{id}', [AdminPuzzleController::class, 'submissionReview']);

    // Community moderation
    Route::get('community/posts', [AdminCommunityController::class, 'postIndex']);
    Route::patch('community/posts/{id}', [AdminCommunityController::class, 'postUpdate']);
    Route::delete('community/posts/{id}', [AdminCommunityController::class, 'postDestroy']);
    Route::post('community/posts/{id}/toggle-pin', [AdminCommunityController::class, 'togglePin']);
    Route::get('community/posts/{id}/replies', [AdminCommunityController::class, 'replyIndex']);
    Route::delete('community/posts/{postId}/replies/{replyId}', [AdminCommunityController::class, 'replyDestroy']);

    // Hall of Fame
    Route::get('hall-of-fame', [AdminHallOfFameController::class, 'index']);
    Route::post('hall-of-fame', [AdminHallOfFameController::class, 'store']);
    Route::patch('hall-of-fame/{id}', [AdminHallOfFameController::class, 'update']);
    Route::delete('hall-of-fame/{id}', [AdminHallOfFameController::class, 'destroy']);

    // Albums
    Route::get('albums', [AdminAlbumController::class, 'index']);
    Route::post('albums', [AdminAlbumController::class, 'store']);
    Route::get('albums/{id}', [AdminAlbumController::class, 'show']);
    Route::patch('albums/{id}', [AdminAlbumController::class, 'update']);
    Route::delete('albums/{id}', [AdminAlbumController::class, 'destroy']);
    Route::post('albums/{id}/photos', [AdminAlbumController::class, 'addPhoto']);
    Route::delete('albums/{id}/photos/{photoId}', [AdminAlbumController::class, 'removePhoto']);

    // CMS
    Route::get('pages', [AdminContentController::class, 'pageIndex']);
    Route::post('pages', [AdminContentController::class, 'pageStore']);
    Route::get('pages/{id}', [AdminContentController::class, 'pageShow']);
    Route::patch('pages/{id}', [AdminContentController::class, 'pageUpdate']);
    Route::delete('pages/{id}', [AdminContentController::class, 'pageDestroy']);
    Route::get('home-sections', [AdminContentController::class, 'homeSectionIndex']);
    Route::post('home-sections', [AdminContentController::class, 'homeSectionStore']);
    Route::patch('home-sections/{id}', [AdminContentController::class, 'homeSectionUpdate']);
    Route::post('home-sections/reorder', [AdminContentController::class, 'homeSectionReorder']);
    Route::get('settings', [AdminContentController::class, 'settingsIndex']);
    Route::get('settings/{key}', [AdminContentController::class, 'settingsShow']);
    Route::patch('settings/{key}', [AdminContentController::class, 'settingsUpdate']);
    Route::delete('settings/{key}', [AdminContentController::class, 'settingsDestroy']);
});
