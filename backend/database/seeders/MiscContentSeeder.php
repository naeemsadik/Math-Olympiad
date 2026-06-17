<?php

namespace Database\Seeders;

use App\Models\HallOfFameEntry;
use App\Models\Notice;
use App\Models\Puzzle;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MiscContentSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->seedNotices();
            $this->seedPuzzles();
            $this->seedHallOfFame();
        });
    }

    protected function seedNotices(): void
    {
        $adminId = User::where('email', 'admin@uiu.ac.bd')->value('id');
        $notices = [
            ['title' => 'BdMO 2026 Preliminary Registration Open', 'body' => 'Register for Bangladesh Mathematical Olympiad 2026 preliminary round before July 15. UIU CMOR will host training camps for shortlisted candidates.', 'tier' => 'All', 'priority' => 'high', 'audience' => 'all', 'status' => 'published', 'pinned' => true, 'published_at' => now()->subDays(2)],
            ['title' => 'Internal Mock Olympiad — 22nd June', 'body' => 'A 90-minute mock olympiad will be held on 22nd June at the UIU CMOR lab. Top performers get featured in the next Hall of Fame update.', 'tier' => 'All', 'priority' => 'normal', 'audience' => 'students', 'status' => 'published', 'pinned' => true, 'published_at' => now()->subDay()],
            ['title' => 'New Advanced Topic Modules Released', 'body' => 'We have just published fresh lessons in Number Theory, Projective Geometry, and Generating Functions under the Advanced tier. Check the Topics page.', 'tier' => 'Advanced', 'priority' => 'normal', 'audience' => 'students', 'status' => 'published', 'pinned' => false, 'published_at' => now()->subHours(8)],
            ['title' => 'Faculty Review Meeting — Friday 4 PM', 'body' => 'All faculty collaborators invited to the weekly curriculum review meeting at UIU campus, room 402.', 'tier' => 'All', 'priority' => 'normal', 'audience' => 'faculty', 'status' => 'published', 'pinned' => false, 'published_at' => now()->subDays(5)],
            ['title' => 'Platform Maintenance: June 20, 2-4 AM', 'body' => 'Brief maintenance window for database upgrades. No action required from users.', 'tier' => 'All', 'priority' => 'low', 'audience' => 'all', 'status' => 'published', 'pinned' => false, 'published_at' => now()->subDays(7)],
        ];

        foreach ($notices as $n) {
            Notice::updateOrCreate(['title' => $n['title']], array_merge($n, ['author_id' => $adminId]));
        }
    }

    protected function seedPuzzles(): void
    {
        $puzzles = [
            [
                'date' => now()->toDateString(),
                'title' => 'Find the missing number',
                'content' => 'In the sequence 1, 1, 2, 3, 5, 8, ?, 21, what is the missing number?',
                'difficulty' => 'Beginner', 'tier' => 'Beginner', 'topic' => 'Number Patterns',
                'expected_answer' => '13', 'auto_match_normalized' => '13', 'streak_count' => 0,
            ],
            [
                'date' => now()->subDay()->toDateString(),
                'title' => 'Sum of first 100 primes',
                'content' => 'What is the sum of the first 100 prime numbers? Provide just the number.',
                'difficulty' => 'Intermediate', 'tier' => 'Intermediate', 'topic' => 'Number Theory',
                'expected_answer' => '24133', 'auto_match_normalized' => '24133', 'streak_count' => 0,
            ],
            [
                'date' => now()->subDays(2)->toDateString(),
                'title' => 'Tower of Hanoi minimum moves',
                'content' => 'What is the minimum number of moves required to solve the Tower of Hanoi with 8 disks?',
                'difficulty' => 'Intermediate', 'tier' => 'Beginner', 'topic' => 'Recursion',
                'expected_answer' => '255', 'auto_match_normalized' => '255', 'streak_count' => 0,
            ],
            [
                'date' => now()->subDays(3)->toDateString(),
                'title' => 'Five-card trick',
                'content' => 'You have 5 cards numbered 1-5. In how many distinct orders can you arrange them?',
                'difficulty' => 'Beginner', 'tier' => 'Beginner', 'topic' => 'Combinatorics',
                'expected_answer' => '120', 'auto_match_normalized' => '120', 'streak_count' => 0,
            ],
            [
                'date' => now()->subDays(4)->toDateString(),
                'title' => 'Last digit of 7^2026',
                'content' => 'What is the last digit of 7^2026?',
                'difficulty' => 'Advanced', 'tier' => 'Advanced', 'topic' => 'Number Theory',
                'expected_answer' => '9', 'auto_match_normalized' => '9', 'streak_count' => 0,
            ],
        ];

        foreach ($puzzles as $p) {
            Puzzle::updateOrCreate(['title' => $p['title']], $p);
        }
    }

    protected function seedHallOfFame(): void
    {
        $entries = [
            ['name' => 'Tanvir Ahmed', 'year' => 2025, 'achievement' => 'Champion', 'department' => 'CSE', 'tier' => 'gold', 'details' => 'First place at Bangladesh Mathematical Olympiad 2025. Represented Bangladesh at IMO 2025.', 'sort_order' => 1],
            ['name' => 'Mehnaz Tabassum', 'year' => 2025, 'achievement' => 'Finalist', 'department' => 'CSE', 'tier' => 'silver', 'details' => 'Second place at BdMO 2025. First female finalist in UIU CMOR history.', 'sort_order' => 2],
            ['name' => 'Rifat Hassan', 'year' => 2024, 'achievement' => 'Honorable Mention', 'department' => 'EEE', 'tier' => 'bronze', 'details' => 'Honorable mention at BdMO 2024. Lead coach for UIU CMOR advanced cohort.', 'sort_order' => 1],
            ['name' => 'Sadia Karim', 'year' => 2025, 'achievement' => 'Top Performer', 'department' => 'MATH', 'tier' => 'gold', 'details' => 'Top performer in the AMO selection camp.', 'sort_order' => 3],
        ];

        foreach ($entries as $e) {
            HallOfFameEntry::updateOrCreate(['name' => $e['name'], 'year' => $e['year']], $e);
        }
    }
}
