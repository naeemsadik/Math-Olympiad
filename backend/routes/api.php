<?php

use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\MeController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (v1)
|--------------------------------------------------------------------------
| All endpoints mounted under /api/v1 (configured in bootstrap/app.php)
*/

// ===== AUTH =====
Route::post('auth/register', RegisterController::class)->middleware('throttle:5,1');
Route::post('auth/login', LoginController::class)->middleware('throttle:5,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', LogoutController::class);
    Route::get('auth/me', [MeController::class, 'show']);
    Route::patch('auth/me', [MeController::class, 'update']);
});
