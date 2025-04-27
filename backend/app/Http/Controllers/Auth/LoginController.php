<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    /**
     * ユーザーログイン処理
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // 新しいトークンを生成
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'ログインに成功しました',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token
            ]);
        }

        return response()->json([
            'message' => '認証に失敗しました'
        ], 401);
    }

    /**
     * ユーザーログアウト処理
     */
    public function logout(Request $request)
    {
        // 現在のユーザーのトークンを削除
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'ログアウトしました'
        ]);
    }
}
