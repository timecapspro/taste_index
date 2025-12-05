<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('watched', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('film_id');
            $table->timestamp('watched_at')->nullable();
            $table->primary(['user_id', 'film_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('film_id')->references('id')->on('films')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('watched');
    }
};
