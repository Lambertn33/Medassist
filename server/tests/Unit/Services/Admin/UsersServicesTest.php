<?php

namespace Tests\Unit\Services\admin;

use App\Services\admin\UsersServices;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UsersServicesTest extends TestCase
{
    use RefreshDatabase;

    protected UsersServices $usersServices;

    protected function setUp(): void
    {
        parent::setUp();
        $this->usersServices = $this->app->make(UsersServices::class);
    }
    public function test_get_all_users(): void
    {
        // Create test users
        User::factory()->create(['role' => User::NURSE_ROLE]);
        User::factory()->create(['role' => User::DOCTOR_ROLE]);
        User::factory()->create(['role' => User::ADMIN_ROLE]);
        
        $users = $this->usersServices->getAllUsers();
        $this->assertCount(3, $users);
    }
    public function test_create_user(): void
    {
        $user = $this->usersServices->createUser([
            'name' => 'Test User',
            'email' => 'testuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => User::NURSE_ROLE,
        ]);
        $this->assertNotNull($user);
        $this->assertEquals('Test User', $user->name);
        $this->assertEquals('testuser@example.com', $user->email);
        $this->assertEquals(User::NURSE_ROLE, $user->role);
    }
    public function test_view_user(): void
    {
        // Create a test user
        $createdUser = User::factory()->create([
            'name' => 'Test Admin',
            'email' => 'testadmin@example.com',
            'role' => User::ADMIN_ROLE,
        ]);
        
        $user = $this->usersServices->viewUser($createdUser->id);
        $this->assertNotNull($user);
        $this->assertEquals($createdUser->id, $user->id);
        $this->assertEquals('Test Admin', $user->name);
        $this->assertEquals('testadmin@example.com', $user->email);
        $this->assertEquals(User::ADMIN_ROLE, $user->role);
    }
}
