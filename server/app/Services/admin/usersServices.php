<?php

namespace App\Services\admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class usersServices
{
    public function getAllUsers(string $search = null)
    {
        try {
            $users = User::where('name', 'like', "%$search%")
            ->orWhere('email', 'like', "%$search%")
            ->get(['id', 'name', 'email', 'role', 'last_login_at']);
            return response()->json([
                'users' => $users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function createUser(array $fields)
    {
        try {
            $user = User::create($fields);
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function viewUser(int $id)
    {
        try {
            $user = User::find($id)->select('id', 'name', 'email', 'role', 'last_login_at')->first();
            if(!$user) {
                return response()->json([
                    'message' => 'User not found',
                ], 404);
            }
            return response()->json([
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}