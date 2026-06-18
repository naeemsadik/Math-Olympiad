<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = config('olympiad.admin.email', 'admin@uiu.ac.bd');
        $password = config('olympiad.admin.password', 'UIUAdmin2024');

        $admin = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => 'UIU Admin',
                'password' => Hash::make($password),
                'role' => 'admin',
                'level' => 'Admin',
                'joined_at' => now(),
                'institute' => 'United International University',
            ]
        );

        // Ensure role is up to date
        $admin->role = 'admin';
        $admin->save();
        $admin->assignRole('admin');
    }
}
