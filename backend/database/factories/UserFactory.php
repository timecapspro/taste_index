<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'login' => $this->faker->unique()->userName(),
            'password' => Hash::make('password'),
            'birth_date' => $this->faker->dateTimeBetween('-35 years', '-16 years')->format('Y-m-d'),
            'language' => 'ru',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }
}
