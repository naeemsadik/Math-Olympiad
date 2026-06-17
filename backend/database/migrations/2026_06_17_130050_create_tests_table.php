<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('duration')->default(30); // minutes
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced', 'Elite'])->default('Beginner');
            $table->enum('tier', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->foreignId('topic_id')->nullable()->constrained('topics')->nullOnDelete();
            $table->unsignedInteger('question_count')->default(0);
            $table->boolean('is_public')->default(true);
            $table->string('source', 190)->nullable();
            $table->json('tags')->nullable();
            $table->enum('test_type', ['practice', 'diagnostic'])->default('practice');
            $table->string('target_class_year', 60)->nullable();
            $table->enum('ability_level', ['Beginner', 'Advanced', 'Expert'])->nullable();
            $table->unsignedInteger('random_question_count')->nullable();
            $table->unsignedTinyInteger('advanced_threshold')->nullable();
            $table->unsignedTinyInteger('expert_threshold')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['test_type', 'is_public']);
            $table->index(['tier', 'ability_level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};