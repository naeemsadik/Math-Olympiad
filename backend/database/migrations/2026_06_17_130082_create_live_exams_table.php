<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('live_exams', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->enum('tier', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->timestamp('scheduled_at');
            $table->unsignedSmallInteger('duration')->default(60); // minutes
            $table->foreignId('topic_id')->nullable()->constrained('topics')->nullOnDelete();
            $table->foreignId('test_id')->nullable()->constrained('tests')->nullOnDelete();
            $table->unsignedInteger('question_count')->default(0);
            $table->enum('status', ['upcoming', 'live', 'ended'])->default('upcoming');
            $table->timestamps();

            $table->index(['tier', 'scheduled_at']);
            $table->index(['status', 'scheduled_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('live_exams');
    }
};