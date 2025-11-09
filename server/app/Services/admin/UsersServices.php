<?php

namespace App\Services\admin;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UsersServices
{
    public function getAllUsers(?string $search = null)
    {
        $query = User::query()
            ->select('id', 'name', 'email', 'role', 'last_login_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    public function createUser(array $fields): User
    {
        return User::create($fields);
    }

    public function viewUser(int $id): ?User
    {
        return User::select('id', 'name', 'email', 'role', 'last_login_at')
            ->find($id);
    }
}