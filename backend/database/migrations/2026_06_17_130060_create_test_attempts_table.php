<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('test_id')->constrained('tests')->cascadeOnDelete();
            $table->string('test_title', 200)->nullable();
            $table->json('question_ids')->nullable();
            $table->unsignedInteger('current_index')->default(0);
            $table->timestamp('current_question_started_at')->nullable();
            $table->timestamp('current_question_deadline')->nullable();
            $table->json('answers')->nullable();
            $table->enum('status', ['in-progress', 'submitted', 'expired', 'abandoned'])->default('in-progress');
            $table->decimal('score', 6, 2)->nullable();
            $table->decimal('total_marks', 6, 2)->nullable();
            $table->decimal('accuracy', 5, 2)->nullable();
            $table->unsignedInteger('time_spent_seconds')->nullable();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['test_id']);
            $table->index(['user_id', 'submitted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_attempts');
    }
};