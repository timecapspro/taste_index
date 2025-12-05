<?php

namespace Tests\Feature;

use App\Models\Film;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class WatchedFlagTest extends TestCase
{
    public function test_watched_flag_reflected_in_film_show()
    {
        $user = User::create([
            'login' => 'demo',
            'email' => 'demo@example.com',
            'password' => Hash::make('secret'),
            'email_verified_at' => now(),
        ]);

        $film = Film::create([
            'title' => 'Test film',
            'year' => 2024,
            'status' => 'published',
        ]);

        $this->actingAs($user, 'sanctum')->postJson("/api/films/{$film->id}/watched")->assertOk();

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/films/{$film->id}");
        $response->assertOk();
        $response->assertJsonPath('is_watched', true);
    }
}
