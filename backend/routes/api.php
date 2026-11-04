<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BadgeController;
use App\Http\Controllers\Api\MediaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login'])->name('login');

// Healthcheck Route
Route::get('/health', fn () => response()->json(['status' => 'ok', 'app' => 'PorichoyID API']));

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user',         fn (Request $request) => $request->user());
    Route::put('/user',         [AuthController::class, 'updateUser']);

    // Badges CRUD
    Route::apiResource('badges', BadgeController::class);
    Route::post('badges/{badge}/duplicate', [BadgeController::class, 'duplicate']);

    // Media / Uploads
    Route::post('media/upload', [MediaController::class, 'store']);
});
