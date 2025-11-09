<?php

namespace Tests\Unit;

use App\Models\User;
use App\Services\auth\AuthServices;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected AuthServices $authServices;

    protected function setUp(): void
    {
        parent::setUp();

        $this->authServices = $this->app->make(AuthServices::class);
    }

    public function test_login_returns_user_and_token_for_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'nurse@example.com',
            'password' => 'secret123',
            'role' => User::NURSE_ROLE,
        ]);

        $response = $this->authServices->login(
            [
                'email' => 'nurse@example.com',
                'password' => 'secret123',
            ]
        );

        $this->assertEquals(200, $response->getStatusCode());
        $responseData = $response->getData(true);
        
        $this->assertArrayHasKey('token', $responseData);
        $this->assertArrayHasKey('user', $responseData);
        $this->assertIsArray($responseData['user']);
        $this->assertEquals('nurse@example.com', $responseData['user']['email']);
        
        $user->refresh();
        $this->assertGreaterThan(0, $user->tokens()->count());
        $this->assertNotNull($user->last_login_at);
    }

    public function test_login_returns_401_for_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'nurse@example.com',
            'password' => 'secret123',
            'role' => User::NURSE_ROLE,
        ]);

        $response = $this->authServices->login(
            [
                'email' => 'wrong-email@example.com',
                'password' => 'wrong-password',
            ]
        );

        $this->assertEquals(401, $response->getStatusCode());
        $responseData = $response->getData(true);
        $this->assertArrayHasKey('message', $responseData);
        $this->assertEquals('Invalid credentials', $responseData['message']);
    }

    public function test_logout_revokes_current_access_token(): void
    {
        $user = User::factory()->create([
            'password' => 'secret123',
            'role' => User::NURSE_ROLE,
        ]);

        $user->createToken('api-token');
        Sanctum::actingAs($user);
        $this->assertEquals(1, $user->tokens()->count());
        $this->authServices->logout($user);
        $this->assertEquals(0, $user->tokens()->count());
    }
}
