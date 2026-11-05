<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BadgeController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\SubscriptionController;
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

    // Subscriptions & Plans (Customer Profile)
    Route::get('/subscription',          [SubscriptionController::class, 'index']);
    Route::post('/subscription/renew',   [SubscriptionController::class, 'renew']);
    Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade']);
    Route::post('/subscription/refund',  [SubscriptionController::class, 'requestRefund']);

    // Super Admin Management
    Route::prefix('admin')->group(function () {
        Route::get('/stats',                  [AdminController::class, 'stats']);
        Route::get('/users',                  [AdminController::class, 'users']);
        Route::put('/users/{id}',             [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}',          [AdminController::class, 'deleteUser']);
        Route::get('/subscriptions',          [AdminController::class, 'subscriptions']);
        Route::get('/refunds',                [AdminController::class, 'refunds']);
        Route::post('/refunds/{id}/status',   [AdminController::class, 'updateRefundStatus']);
        Route::get('/badges',                 [AdminController::class, 'badges']);
    });
});
