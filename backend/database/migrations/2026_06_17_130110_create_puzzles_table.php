<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('puzzles', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('title', 200);
            $table->longText('content');
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced', 'Elite'])->default('Beginner');
            $table->enum('tier', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->string('topic', 120)->nullable();
            $table->text('expected_answer')->nullable();
            $table->string('auto_match_normalized', 255)->nullable();
            $table->unsignedInteger('streak_count')->default(0);
            $table->timestamps();

            $table->unique(['date', 'tier']);
            $table->index(['tier', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puzzles');
    }
};