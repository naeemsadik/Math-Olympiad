<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);
    }

    public function test_admin_endpoints_require_authentication(): void
    {
        $response = $this->getJson('/api/v1/admin/dashboard/stats');
        $response->assertStatus(401);
    }

    public function test_student_cannot_access_admin_endpoints(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $student->assignRole('student');
        $token = $student->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/admin/dashboard/stats');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_dashboard_stats(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/admin/dashboard/stats');

        $response->assertOk()
            ->assertJsonStructure(['data' => ['totalStudents', 'activeStudents', 'platformAvgScore', 'topicsAvailable']]);
    }

    public function test_admin_can_list_users(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');
        User::factory()->count(3)->create(['role' => 'student'])->each(fn ($u) => $u->assignRole('student'));
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->getJson('/api/v1/admin/users');

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'total']]);
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');
        $token = $admin->createToken('test')->plainTextToken;

        $payload = [
            'name' => 'New Faculty',
            'email' => 'newfaculty@uiu.ac.bd',
            'password' => 'Password123',
            'role' => 'faculty',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/admin/users', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.email', 'newfaculty@uiu.ac.bd')
            ->assertJsonPath('data.role', 'Faculty');

        $this->assertDatabaseHas('users', ['email' => 'newfaculty@uiu.ac.bd']);
    }
}
