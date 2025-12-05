<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('films', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('original_title')->nullable();
            $table->integer('year');
            $table->integer('duration_min')->nullable();
            $table->string('director')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_18_plus')->default(false);
            $table->string('poster_path')->nullable();
            $table->string('poster_original_path')->nullable();
            $table->json('poster_crop_json')->nullable();
            $table->unsignedBigInteger('created_by_user_id')->nullable();
            $table->enum('status', ['published', 'pending', 'rejected'])->default('pending');
            $table->text('reject_reason')->nullable();
            $table->date('premiere_at')->nullable();
            $table->string('producer')->nullable();
            $table->string('cinematographer')->nullable();
            $table->string('composer')->nullable();
            $table->string('budget')->nullable();
            $table->timestamps();
            $table->unique(['title', 'year']);
            $table->foreign('created_by_user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('films');
    }
};
