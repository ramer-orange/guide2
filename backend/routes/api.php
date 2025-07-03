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
    Route::get('/plan-details/{planId}', [PlanDetailController::class, 'index']);
    Route::post('/plan-details/{planId}', [PlanDetailController::class, 'store']);
    Route::post('/plan-details', [PlanDetailController::class, 'store']);
    Route::put('/plan-details/{planDetailId}', [PlanDetailController::class, 'update']);
    Route::delete('/plan-details/{planDetailId}', [PlanDetailController::class, 'destroy']);
    Route::delete('/plan-details/{planId}/bulk-delete-days', [PlanDetailController::class, 'bulkDestroy']);
});

// 認証が不要なAPIルート
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);