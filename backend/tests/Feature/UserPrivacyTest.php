<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserPrivacyTest extends TestCase
{
    public function test_users_list_hides_email()
    {
        $me = User::create([
            'login' => 'me',
            'email' => 'me@example.com',
            'password' => Hash::make('secret'),
            'email_verified_at' => now(),
        ]);

        $other = User::create([
            'login' => 'other',
            'email' => 'other@example.com',
            'password' => Hash::make('secret'),
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($me, 'sanctum')->getJson('/api/users');

        $response->assertOk();
        $this->assertTrue(
            collect($response->json('data'))
                ->every(fn ($user) => !array_key_exists('email', $user) || $user['id'] === $me->id)
        );
        $this->assertFalse(
            collect($response->json('data'))->pluck('email')->filter()->contains($other->email)
        );
    }
}
