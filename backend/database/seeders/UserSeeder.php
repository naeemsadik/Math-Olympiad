<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $samples = [
                [
                    'name' => 'Tanvir Ahmed', 'email' => 'tanvir@uiu.ac.bd', 'password' => 'Password123',
                    'role' => 'student', 'tier' => 'Advanced', 'institute' => 'United International University',
                    'department' => 'CSE', 'university' => 'UIU', 'class_year' => '4th Year',
                    'level' => 'Mathematician', 'xp' => 1500, 'streak' => 12,
                    'placement_done' => true, 'diagnostic_ability_level' => 'Expert',
                    'diagnostic_score' => 86, 'diagnostic_completed_at' => now()->subMonths(2),
                ],
                [
                    'name' => 'Mehnaz Tabassum', 'email' => 'mehnaz@uiu.ac.bd', 'password' => 'Password123',
                    'role' => 'student', 'tier' => 'Advanced', 'institute' => 'United International University',
                    'department' => 'CSE', 'university' => 'UIU', 'class_year' => '3rd Year',
                    'level' => 'Mathematician', 'xp' => 1800, 'streak' => 20,
                    'placement_done' => true, 'diagnostic_ability_level' => 'Expert',
                    'diagnostic_score' => 91, 'diagnostic_completed_at' => now()->subMonths(2),
                ],
                [
                    'name' => 'Rifat Hassan', 'email' => 'rifat@uiu.ac.bd', 'password' => 'Password123',
                    'role' => 'student', 'tier' => 'Intermediate', 'institute' => 'United International University',
                    'department' => 'EEE', 'university' => 'UIU', 'class_year' => '2nd Year',
                    'level' => 'Intermediate', 'xp' => 850, 'streak' => 5,
                    'placement_done' => true, 'diagnostic_ability_level' => 'Advanced',
                    'diagnostic_score' => 64, 'diagnostic_completed_at' => now()->subMonths(1),
                ],
                [
                    'name' => 'Sadia Karim', 'email' => 'sadia@uiu.ac.bd', 'password' => 'Password123',
                    'role' => 'student', 'tier' => 'Beginner', 'institute' => 'United International University',
                    'department' => 'MATH', 'university' => 'UIU', 'class_year' => '1st Year',
                    'level' => 'Newcomer', 'xp' => 220, 'streak' => 3,
                    'placement_done' => true, 'diagnostic_ability_level' => 'Beginner',
                    'diagnostic_score' => 35, 'diagnostic_completed_at' => now()->subWeeks(2),
                ],
                [
                    'name' => 'Tahmid Rahman', 'email' => 'tahmid@uiu.ac.bd', 'password' => 'Password123',
                    'role' => 'faculty', 'tier' => null, 'institute' => 'United International University',
                    'department' => 'MATH', 'university' => 'UIU', 'class_year' => null,
                    'level' => 'Faculty', 'xp' => 0, 'streak' => 0, 'placement_done' => false,
                ],
            ];

            foreach ($samples as $s) {
                $user = User::updateOrCreate(
                    ['email' => $s['email']],
                    array_merge($s, [
                        'password' => Hash::make($s['password']),
                        'email_verified_at' => now(),
                        'status' => 'active',
                        'joined_at' => now()->subMonths(rand(1, 6)),
                    ])
                );
                if (! $user->hasRole($s['role'])) {
                    $user->assignRole($s['role']);
                }
            }
        });
    }
}
