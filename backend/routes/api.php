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
    Route::apiResource('plans/details', PlanDetailController::class);
});

// 認証が不要なAPIルート
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);