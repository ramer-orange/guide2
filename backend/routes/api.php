<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


Route::post('/echo', function (Request $request) {
    return response()->json([
        'received' => true,
        'data' => $request->all(),
        'timestamp' => now()
    ]);
});
