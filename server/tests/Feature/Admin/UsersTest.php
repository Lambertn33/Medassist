<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class UsersTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        $admin = User::factory()->create([
            'role' => User::ADMIN_ROLE,
        ]);

        Sanctum::actingAs($admin);

        return $admin;
    }

    private function actingAsDoctor(): User
    {
        $doctor = User::factory()->create([
            'role' => User::DOCTOR_ROLE,
        ]);

        Sanctum::actingAs($doctor);

        return $doctor;
    }

    private function actingAsNurse(): User
    {
        $nurse = User::factory()->create([
            'role' => User::NURSE_ROLE,
        ]);

        Sanctum::actingAs($nurse);

        return $nurse;
    }

    public function test_admin_can_get_all_users(): void
    {
        $user1 = User::factory()->create(['role' => User::NURSE_ROLE]);
        $user2 = User::factory()->create(['role' => User::DOCTOR_ROLE]);
        $admin = $this->actingAsAdmin();
        
        $response = $this->get('/api/admin/users');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'users' => [
                    '*' => [
                        'id',
                        'name',
                        'email',
                        'role',
                        'last_login_at',
                    ],
                ],
            ])
            ->assertJsonCount(3, 'users');
        
        $responseData = $response->json();
        $userIds = collect($responseData['users'])->pluck('id')->toArray();
        $this->assertContains($user1->id, $userIds);
        $this->assertContains($user2->id, $userIds);
        $this->assertContains($admin->id, $userIds);
    }

    public function test_admin_can_create_a_user()
    {
        $admin = $this->actingAsAdmin();
        
        $response = $this->postJson('/api/admin/users', [
            'name' => 'New Test User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => User::NURSE_ROLE,
        ]);
        
        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                ],
            ]);
        
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'role' => User::NURSE_ROLE,
        ]);
    }

    public function test_admin_can_view_a_user()
    {
        $admin = $this->actingAsAdmin();
        $user = User::factory()->create(['role' => User::DOCTOR_ROLE]);
        
        $response = $this->get('/api/admin/users/' . $user->id);
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'last_login_at',
                ],
            ]);
        
        $responseData = $response->json();
        $this->assertEquals($user->id, $responseData['user']['id']);
        $this->assertEquals($user->email, $responseData['user']['email']);
    }

    public function test_nurse_or_doctor_cannot_create_a_user()
    {
        $nurse = $this->actingAsNurse();
        $doctor = $this->actingAsDoctor();
        
        $responseNurse = $this->postJson('/api/admin/users', [
            'name' => 'New Test User',
            'email' => 'newuser1@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => User::NURSE_ROLE,
        ]);
        
        $responseDoctor = $this->postJson('/api/admin/users', [
            'name' => 'New Test User',
            'email' => 'newuser2@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => User::NURSE_ROLE,
        ]);

        $responseNurse->assertStatus(403);
        $responseDoctor->assertStatus(403);
    }

    public function test_nurse_or_doctor_cannot_view_a_user()
    {
        $nurse = $this->actingAsNurse();
        $doctor = $this->actingAsDoctor();
        $user = User::factory()->create(['role' => User::DOCTOR_ROLE]);
        
        $responseNurse = $this->get('/api/admin/users/' . $user->id);
        $responseDoctor = $this->get('/api/admin/users/' . $user->id);
        
        $responseNurse->assertStatus(403);
        $responseDoctor->assertStatus(403);
    }
}
