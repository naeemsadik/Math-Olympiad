<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteSettingTest extends TestCase
{
    use RefreshDatabase;

    public function test_setting_helper_methods_work(): void
    {
        \App\Models\SiteSetting::put('hero.title', 'Hello World', 'string');
        \App\Models\SiteSetting::put('feature.enabled', true, 'boolean');
        \App\Models\SiteSetting::put('counts', 42, 'integer');
        \App\Models\SiteSetting::put('config', ['nested' => 'value'], 'json');

        $this->assertSame('Hello World', \App\Models\SiteSetting::get('hero.title'));
        $this->assertSame('Hello World', \App\Models\SiteSetting::get('missing', 'Hello World'));
        $this->assertTrue(\App\Models\SiteSetting::get('feature.enabled'));
        $this->assertSame(42, \App\Models\SiteSetting::get('counts'));
        $this->assertSame(['nested' => 'value'], \App\Models\SiteSetting::get('config'));
    }

    public function test_settings_index_endpoint_returns_object(): void
    {
        \App\Models\SiteSetting::put('site.name', 'UIU CMOR', 'string');
        \App\Models\SiteSetting::put('site.tagline', 'Math Olympiad', 'string');

        $response = $this->getJson('/api/v1/settings');
        $response->assertOk();
        $payload = $response->json('data');
        $this->assertSame('UIU CMOR', $payload['site.name']);
        $this->assertSame('Math Olympiad', $payload['site.tagline']);
    }

    public function test_admin_can_update_setting(): void
    {
        $this->seed(\Database\Seeders\RoleAndPermissionSeeder::class);
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->patchJson('/api/v1/admin/settings/site.tagline', [
                'value' => 'New Tagline',
                'type' => 'string',
            ]);

        $response->assertOk();
        $this->assertSame('New Tagline', \App\Models\SiteSetting::get('site.tagline'));
    }
}
