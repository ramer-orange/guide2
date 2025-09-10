<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlanDetailController;

// 認証が必要なAPIルート（SPA認証）
Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // プラン概要
    Route::apiResource('plans', PlanController::class);

    // プランの詳細関連
    // 一括削除ルートを先に定義（より具体的なルートを先に）
    Route::delete('/plans/{plan}/details/bulk', [PlanDetailController::class, 'bulkDestroy'])
        ->name('plans.details.bulk-destroy');
    // スポット情報のみを取得するルート
    Route::get('/plans/{plan}/spots', [PlanDetailController::class, 'getSpots'])
        ->name('plans.spots');
    Route::apiResource('plans.details', PlanDetailController::class)
        ->scoped()
        ->only(['index', 'store', 'update', 'destroy']);
});

// 認証が不要なAPIルート（SPA認証）
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [RegisterController::class, 'register']);
});
