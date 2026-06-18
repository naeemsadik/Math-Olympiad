<?php

namespace Database\Seeders;

use App\Models\ContentPage;
use App\Models\ContentWidget;
use App\Models\HomeSection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->seedPages();
            $this->seedHomeSections();
        });
    }

    protected function seedPages(): void
    {
        $pages = [
            [
                'slug' => 'about',
                'title' => 'About UIU CMOR',
                'intro' => 'United International University Center for Mathematical Olympiad Research.',
                'body' => "UIU CMOR is the premier platform for mathematical olympiad preparation in Bangladesh.\n\nWe offer curated learning tracks, timed tests, daily puzzles, and live events for students of all tiers.\n\nFounded in 2024, our mission is to nurture the next generation of olympiad champions.",
                'meta' => ['keywords' => 'olympiad, math, bdmo, imo, uiu'],
                'published_at' => now(),
            ],
            [
                'slug' => 'team',
                'title' => 'Our Team',
                'intro' => 'Meet the faculty, mentors, and developers behind UIU CMOR.',
                'body' => 'Our team includes UIU faculty members, former olympiad winners, and dedicated engineers.',
                'meta' => null,
                'published_at' => now(),
            ],
            [
                'slug' => 'resources',
                'title' => 'Resources',
                'intro' => 'Books, problem sets, and articles curated for olympiad students.',
                'body' => 'A growing library of free resources for self-study.',
                'meta' => null,
                'published_at' => now(),
            ],
        ];

        foreach ($pages as $p) {
            $page = ContentPage::updateOrCreate(['slug' => $p['slug']], $p);

            // Wipe any prior widgets for this page
            ContentWidget::where('page_slug', $page->slug)->delete();

            $widgets = match ($page->slug) {
                'about' => [
                    ['widget_type' => 'stat_block', 'data' => ['label' => 'Active students', 'value' => '1200+'], 'position' => 0],
                    ['widget_type' => 'stat_block', 'data' => ['label' => 'BdMO finalists', 'value' => '24'], 'position' => 1],
                    ['widget_type' => 'milestone', 'data' => ['title' => 'Founded', 'year' => '2024'], 'position' => 2],
                ],
                'team' => [
                    ['widget_type' => 'team_member', 'data' => ['name' => 'Dr. Rashed Khan', 'role' => 'Director', 'department' => 'CSE'], 'position' => 0],
                    ['widget_type' => 'team_member', 'data' => ['name' => 'Tahmid Rahman', 'role' => 'Lead Coach', 'department' => 'MATH'], 'position' => 1],
                ],
                'resources' => [
                    ['widget_type' => 'resource_link', 'data' => ['title' => 'AoPS', 'url' => 'https://artofproblemsolving.com', 'type' => 'website'], 'position' => 0],
                    ['widget_type' => 'resource_link', 'data' => ['title' => 'EGMO', 'url' => 'https://yufeizhao.com/egmo/', 'type' => 'pdf'], 'position' => 1],
                ],
                default => [],
            };
            foreach ($widgets as $w) {
                ContentWidget::create([
                    'page_slug' => $page->slug,
                    'widget_type' => $w['widget_type'],
                    'data' => $w['data'],
                    'position' => $w['position'],
                ]);
            }
        }
    }

    protected function seedHomeSections(): void
    {
        $sections = [
            ['section_key' => 'hero', 'title' => 'Welcome to UIU CMOR', 'subtitle' => 'Your journey to mathematical olympiad excellence starts here.', 'data' => ['headline' => 'Become an Olympiad Champion', 'subhead' => 'UIU CMOR helps students excel in BdMO, IMO, and beyond.'], 'sort_order' => 0, 'published' => true],
            ['section_key' => 'stats', 'title' => 'Why choose us', 'subtitle' => 'Numbers that speak for themselves', 'data' => ['items' => [['label' => 'Active students', 'value' => '1200+'], ['label' => 'Practice tests', 'value' => '500+'], ['label' => 'BdMO finalists', 'value' => '24']]], 'sort_order' => 1, 'published' => true],
            ['section_key' => 'features', 'title' => 'Features', 'subtitle' => 'Everything you need', 'data' => ['items' => [['label' => 'Adaptive diagnostic', 'icon' => 'Sparkles'], ['label' => 'Daily puzzles', 'icon' => 'Puzzle'], ['label' => 'Live events', 'icon' => 'Calendar']]], 'sort_order' => 2, 'published' => true],
            ['section_key' => 'announcements', 'title' => 'Latest announcements', 'subtitle' => null, 'data' => ['limit' => 5], 'sort_order' => 3, 'published' => true],
        ];

        foreach ($sections as $s) {
            HomeSection::updateOrCreate(['section_key' => $s['section_key']], $s);
        }
    }
}
