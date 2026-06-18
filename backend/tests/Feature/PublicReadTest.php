<?php

namespace Tests\Feature;

use App\Models\HallOfFameEntry;
use App\Models\Notice;
use App\Models\Topic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicReadTest extends TestCase
{
    use RefreshDatabase;

    public function test_topics_endpoint_is_public(): void
    {
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);
        Topic::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/topics');
        $response->assertOk()
            ->assertJsonStructure(['data' => [['id', 'slug', 'name', 'tier', 'level']]])
            ->assertJsonCount(3, 'data');
    }

    public function test_notices_endpoint_is_public(): void
    {
        Notice::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/notices');
        $response->assertOk()
            ->assertJsonStructure(['data' => [['id', 'title', 'body', 'priority', 'tier']]]);
    }

    public function test_hall_of_fame_is_public(): void
    {
        HallOfFameEntry::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/hall-of-fame');
        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_leaderboard_returns_top_users(): void
    {
        $response = $this->getJson('/api/v1/leaderboard');
        $response->assertOk()->assertJsonStructure(['data']);
    }

    public function test_settings_endpoint_returns_object(): void
    {
        $response = $this->getJson('/api/v1/settings');
        $response->assertOk()->assertJsonStructure(['data']);
    }
}
