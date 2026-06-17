<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);
    }

    public function test_user_can_register(): void
    {
        $payload = [
            'name' => 'Test Student',
            'email' => 'newstudent@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'institute' => 'UIU',
            'institutionType' => 'University',
            'classYear' => '2nd Year',
        ];

        $response = $this->postJson('/api/v1/auth/register', $payload);
        $response->assertStatus(201)
            ->assertJsonPath('user.email', 'newstudent@example.com')
            ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role', 'level']]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('Password123'),
            'role' => 'student',
        ])->assignRole('student');

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'login@example.com',
            'password' => 'Password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user' => ['id', 'email']]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('Password123'),
            'role' => 'student',
        ])->assignRole('student');

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'login@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
    }

    public function test_user_can_get_me_when_authenticated(): void
    {
        $user = User::factory()->create(['role' => 'student']);
        $user->assignRole('student');
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/auth/me');

        $response->assertOk()
            ->assertJsonPath('user.email', $user->email);
    }

    public function test_me_requires_authentication(): void
    {
        $response = $this->getJson('/api/v1/auth/me');
        $response->assertStatus(401);
    }
}
