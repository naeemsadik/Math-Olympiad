<?php

namespace Database\Factories;

use App\Models\HallOfFameEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HallOfFameEntry>
 */
class HallOfFameEntryFactory extends Factory
{
    protected $model = HallOfFameEntry::class;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'year' => fake()->numberBetween(2020, 2026),
            'achievement' => fake()->randomElement(['Champion', 'Finalist', 'Honorable Mention', 'Top Performer']),
            'department' => fake()->randomElement(['CSE', 'EEE', 'MATH', 'BBA']),
            'tier' => fake()->randomElement(['gold', 'silver', 'bronze']),
            'details' => fake()->paragraph(),
            'sort_order' => fake()->numberBetween(1, 10),
        ];
    }
}
