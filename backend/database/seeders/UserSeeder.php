<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->count(4)->create();

        User::updateOrCreate(
            ['email' => 'demo@example.com'],
            [
                'login' => 'demo',
                'password' => Hash::make('demo12345'),
                'birth_date' => now()->subYears(25)->toDateString(),
                'language' => 'ru',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]
        );
    }
}
