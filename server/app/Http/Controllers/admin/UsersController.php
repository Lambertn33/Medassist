<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\admin\UsersServices;
use App\Http\Requests\admin\users\StoreUserRequest;
use Illuminate\Validation\ValidationException;
use Exception;

class UsersController extends Controller
{
    public function __construct(private UsersServices $usersServices)
    {
    }
    public function index(Request $request)
    {
        try {
            $search = $request->query('search');
            $users  = $this->usersServices->getAllUsers($search);

            return response()->json([
                'users' => $users,
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while fetching users.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    
    public function store(StoreUserRequest $request)
    {
        try {
            $user = $this->usersServices->createUser($request->validated());

            return response()->json([
                'message' => 'User created successfully',
                'user'    => $user,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors'  => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while creating the user.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    
    public function show(int $id)
    {
        try {
            $user = $this->usersServices->viewUser($id);

            if (! $user) {
                return response()->json([
                    'message' => 'User not found',
                ], 404);
            }

            return response()->json([
                'user' => $user,
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving user information.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function updateAccountStatus(int $id)
    {
        try {
            $user = $this->usersServices->viewUser($id);
            if (! $user) {
                return response()->json([
                    'message' => 'User not found',
                ], 404);
            }
            $user = $this->usersServices->activateOrCloseAccount($user);

            return response()->json([
                'message' => 'User account status updated successfully',
                'user'    => $user,
            ], 200);
        } catch (Exception $e) {
            return response()->json([   
                'message' => 'An error occurred while updating the user account status.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
    
}
