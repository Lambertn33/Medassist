<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\admin\usersServices;

class UsersController extends Controller
{
    public function __construct(private usersServices $usersServices)
    {
    }
    public function getAllUsers(Request $request)
    {
        try {
            $search = $request->query('search');
            $users = $this->usersServices->getAllUsers($search);
            return response()->json([
                'users' => $users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
