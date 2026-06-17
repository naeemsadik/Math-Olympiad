<?php

namespace Tests\Feature;

use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);
    }

    public function test_topic_show_includes_modules(): void
    {
        $topic = Topic::factory()->create(['slug' => 'algebra']);
        $topic->modules()->createMany([
            ['name' => 'Module 1', 'description' => 'Desc 1', 'difficulty' => 'Beginner', 'order' => 1, 'lesson_count' => 3],
            ['name' => 'Module 2', 'description' => 'Desc 2', 'difficulty' => 'Intermediate', 'order' => 2, 'lesson_count' => 4],
        ]);

        $response = $this->getJson('/api/v1/topics/algebra');
        $response->assertOk()
            ->assertJsonPath('data.slug', 'algebra')
            ->assertJsonCount(2, 'data.modules');
    }

    public function test_topic_404_when_missing(): void
    {
        $response = $this->getJson('/api/v1/topics/does-not-exist');
        $response->assertStatus(404);
    }

    public function test_admin_can_create_topic(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');
        $token = $admin->createToken('test')->plainTextToken;

        $payload = [
            'slug' => 'new-topic',
            'name' => 'New Topic',
            'description' => 'A new topic for testing',
            'tier' => 'Beginner',
            'level' => 'Beginner',
            'lesson_count' => 5,
            'problem_count' => 30,
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/v1/admin/topics', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.slug', 'new-topic');

        $this->assertDatabaseHas('topics', ['slug' => 'new-topic']);
    }

    public function test_admin_can_create_module_under_topic(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');
        $token = $admin->createToken('test')->plainTextToken;
        $topic = Topic::factory()->create(['slug' => 'algebra']);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson("/api/v1/admin/topics/{$topic->id}/modules", [
                'name' => 'Brand new module',
                'description' => 'Test module',
                'difficulty' => 'Beginner',
                'order' => 1,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'Brand new module');

        $this->assertDatabaseHas('modules', ['topic_id' => $topic->id, 'name' => 'Brand new module']);
    }
}
