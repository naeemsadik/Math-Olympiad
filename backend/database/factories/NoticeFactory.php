<?php

namespace Database\Factories;

use App\Models\Notice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notice>
 */
class NoticeFactory extends Factory
{
    protected $model = Notice::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(5),
            'body' => fake()->paragraph(),
            'tier' => fake()->randomElement(['All', 'Beginner', 'Intermediate', 'Advanced']),
            'priority' => fake()->randomElement(['low', 'normal', 'high']),
            'audience' => fake()->randomElement(['all', 'students', 'faculty']),
            'status' => 'published',
            'pinned' => fake()->boolean(20),
            'published_at' => now(),
        ];
    }
}
