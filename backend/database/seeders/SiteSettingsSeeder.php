<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            ['key' => 'site.name', 'value' => 'UIU CMOR', 'type' => 'string'],
            ['key' => 'site.tagline', 'value' => 'United International University — Center for Mathematical Olympiad Research', 'type' => 'string'],
            ['key' => 'site.support_email', 'value' => 'support@cmor.uiu.ac.bd', 'type' => 'string'],
            ['key' => 'site.contact_phone', 'value' => '+880-2-9013167', 'type' => 'string'],
            ['key' => 'site.address', 'value' => 'United International University, Dhaka 1212, Bangladesh', 'type' => 'string'],

            ['key' => 'social.facebook', 'value' => 'https://facebook.com/uiucmor', 'type' => 'string'],
            ['key' => 'social.youtube', 'value' => 'https://youtube.com/@uiucmor', 'type' => 'string'],
            ['key' => 'social.linkedin', 'value' => 'https://linkedin.com/company/uiucmor', 'type' => 'string'],

            ['key' => 'home.hero.title', 'value' => 'Become an Olympiad Champion', 'type' => 'string'],
            ['key' => 'home.hero.subtitle', 'value' => 'UIU CMOR helps students excel in BdMO, IMO, and beyond.', 'type' => 'string'],
            ['key' => 'home.hero.cta_label', 'value' => 'Start your journey', 'type' => 'string'],
            ['key' => 'home.hero.cta_url', 'value' => '/topics', 'type' => 'string'],

            ['key' => 'leaderboard.window_days', 'value' => '30', 'type' => 'integer'],
            ['key' => 'leaderboard.max_entries', 'value' => '50', 'type' => 'integer'],

            ['key' => 'diagnostic.advanced_threshold', 'value' => '50', 'type' => 'integer'],
            ['key' => 'diagnostic.expert_threshold', 'value' => '80', 'type' => 'integer'],
            ['key' => 'diagnostic.question_count', 'value' => '12', 'type' => 'integer'],

            ['key' => 'features.daily_puzzle', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'features.community_enabled', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'features.certificates_enabled', 'value' => '1', 'type' => 'boolean'],

            ['key' => 'admin.contact_email', 'value' => 'admin@uiu.ac.bd', 'type' => 'string'],
            ['key' => 'admin.dashboard_refresh_seconds', 'value' => '60', 'type' => 'integer'],
        ];

        DB::transaction(function () use ($settings) {
            foreach ($settings as $s) {
                SiteSetting::updateOrCreate(['key' => $s['key']], $s);
            }
        });
    }
}
