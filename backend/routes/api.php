<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\PlanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlanDetailController;

// 認証が必要なAPIルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function(Request $request) {
        return $request->user();
    });
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::apiResource('plans', PlanController::class);

    // プランの詳細関連
    // 一括削除ルートを先に定義（より具体的なルートを先に）
    Route::delete('/plans/{plan}/details/bulk', [PlanDetailController::class, 'bulkDestroy'])
        ->name('plans.details.bulk-destroy');
    Route::apiResource('plans.details', PlanDetailController::class)
        ->scoped()
        ->only(['index', 'store', 'update', 'destroy']);
});

// 認証が不要なAPIルート
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);