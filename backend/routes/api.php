<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\FilmController;
use App\Http\Controllers\FilmInteractionController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return ['status' => 'ok'];
});

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('reset-password', [ResetPasswordController::class, 'reset']);

    Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware(['signed'])
        ->name('verification.verify');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('email/resend', [EmailVerificationController::class, 'resend']);
    });
});

Route::middleware(['auth:sanctum', 'verified.api'])->group(function () {
    Route::get('/films', [FilmController::class, 'index']);
    Route::get('/films/{film}', [FilmController::class, 'show']);

    Route::put('/films/{film}/rating', [FilmInteractionController::class, 'rate']);
    Route::delete('/films/{film}/rating', [FilmInteractionController::class, 'removeRate']);
    Route::post('/films/{film}/favorite', [FilmInteractionController::class, 'favorite']);
    Route::delete('/films/{film}/favorite', [FilmInteractionController::class, 'unfavorite']);
    Route::post('/films/{film}/watch-later', [FilmInteractionController::class, 'watchLater']);
    Route::delete('/films/{film}/watch-later', [FilmInteractionController::class, 'removeWatchLater']);
});
