<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diagnostic_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('test_id')->nullable()->constrained('tests')->nullOnDelete();
            $table->string('test_title', 200)->nullable();
            $table->json('question_ids')->nullable();
            $table->json('answers')->nullable();
            $table->unsignedInteger('correct_count')->nullable();
            $table->unsignedTinyInteger('score')->nullable(); // 0-100
            $table->enum('ability_level', ['Beginner', 'Advanced', 'Expert'])->nullable();
            $table->enum('status', ['in-progress', 'submitted', 'abandoned'])->default('in-progress');
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('submitted_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diagnostic_attempts');
    }
};