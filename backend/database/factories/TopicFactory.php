<?php

namespace Database\Factories;

use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Topic>
 */
class TopicFactory extends Factory
{
    protected $model = Topic::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);
        $tier = fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']);
        return [
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 1000),
            'name' => ucwords($name),
            'description' => fake()->sentence(),
            'tier' => $tier,
            'level' => $tier,
            'color' => fake()->hexColor(),
            'lesson_count' => fake()->numberBetween(5, 15),
            'problem_count' => fake()->numberBetween(30, 120),
        ];
    }
}
