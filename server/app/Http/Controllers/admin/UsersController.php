<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\admin\usersServices;
use App\Models\User;

class UsersController extends Controller
{
    public function __construct(private usersServices $usersServices)
    {
    }
    public function index(Request $request)
    {
        $search = $request->query('search');
        return $this->usersServices->getAllUsers($search);
    }

    public function store(Request $request) {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:' . implode(',', User::ROLES),
        ]);
        return $this->usersServices->createUser($fields);
    }
}
