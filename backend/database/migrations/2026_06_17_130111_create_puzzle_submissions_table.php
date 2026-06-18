<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('puzzle_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('puzzle_id')->constrained('puzzles')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('answer');
            $table->timestamp('submitted_at')->useCurrent();
            $table->boolean('auto_correct')->nullable(); // computed on submit
            $table->boolean('is_correct')->nullable(); // null = pending review
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->unique(['puzzle_id', 'user_id']);
            $table->index(['is_correct', 'reviewed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('puzzle_submissions');
    }
};