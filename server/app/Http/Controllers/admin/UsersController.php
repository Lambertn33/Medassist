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
        $search = $request->query('search');
        return $this->usersServices->getAllUsers($search);
    }
}
