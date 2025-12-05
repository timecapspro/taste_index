<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('film_id');
            $table->tinyInteger('rating');
            $table->timestamps();
            $table->unique(['user_id', 'film_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('film_id')->references('id')->on('films')->cascadeOnDelete();
        });

        Schema::create('favorites', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('film_id');
            $table->primary(['user_id', 'film_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('film_id')->references('id')->on('films')->cascadeOnDelete();
        });

        Schema::create('watch_later', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('film_id');
            $table->primary(['user_id', 'film_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('film_id')->references('id')->on('films')->cascadeOnDelete();
        });

        Schema::create('film_notes', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('film_id');
            $table->text('note');
            $table->timestamps();
            $table->primary(['user_id', 'film_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('film_id')->references('id')->on('films')->cascadeOnDelete();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('title');
            $table->text('text');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('film_notes');
        Schema::dropIfExists('watch_later');
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('ratings');
    }
};
