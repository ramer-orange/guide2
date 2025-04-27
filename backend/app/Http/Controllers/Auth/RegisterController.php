<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request) {
        // password_repeatをpassword_confirmationに変換
        $data = $request->all();
        if (isset($data['password_repeat'])) {
            $data['password_confirmation'] = $data['password_repeat'];
        }

        $validator = Validator::make($data, [
            'name' => ['required', 'max:255'],
            'email' => ['required', 'email:rfc,dns', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password), // パスワードをハッシュ化
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;
        return response()->json([
            'message' => 'ユーザーが正常に登録されました',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token
        ], 201);
    }
}
