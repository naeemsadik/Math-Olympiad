<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            AdminSeeder::class,
            // Heavy content seeders (uncomment as they're implemented):
            // TopicModuleLessonSeeder::class,
            // QuestionAndTestSeeder::class,
            // MiscContentSeeder::class,
            // UserSeeder::class,
            // CmsSeeder::class,
            // SiteSettingsSeeder::class,
        ]);
    }
}
