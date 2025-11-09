<?php

namespace App\Services\admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class usersServices
{
    public function getAllUsers(string $search = null)
    {
        $users = User::where('name', 'like', "%$search%")
            ->orWhere('email', 'like', "%$search%")
            ->get(['id', 'name', 'email', 'role', 'last_login_at']);
        return $users;
    }
}