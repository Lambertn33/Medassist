<?php

namespace App\Services\auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthServices
{
    public function login( array $fields)
    {
        $user = User::where('email', $fields['email'])->first();

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if ($user->account_status === User::CLOSED_STATUS) {
            return response()->json(['message' => 'Your account is closed. Please contact the administrator.'], 401);
        }

        $token = $user->createToken($user->name)->plainTextToken;
        $user->update([
            'last_login_at' => now(),
        ]);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(User $user)
    {
        $user->tokens()->delete();
        return ['success' => true, 'message' => 'Logged out successfully'];
    }
}