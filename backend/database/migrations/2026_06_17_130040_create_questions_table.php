<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->foreignId('topic_id')->nullable()->constrained('topics')->nullOnDelete();
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced', 'Elite'])->default('Beginner');
            $table->enum('tier', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->enum('format', ['text-to-text', 'text-to-image', 'image-to-text', 'image-to-image'])->default('text-to-text');
            $table->enum('prompt_kind', ['text', 'image'])->default('text');
            $table->text('prompt_value')->nullable();
            $table->string('prompt_alt', 255)->nullable();
            $table->enum('ability_level', ['Beginner', 'Advanced', 'Expert'])->nullable();
            $table->string('target_class_year', 60)->nullable();
            $table->decimal('marks', 5, 2)->default(1.00);
            $table->unsignedSmallInteger('time_limit_seconds')->default(90);
            $table->json('subtopic_tags')->nullable();
            $table->string('source', 190)->nullable();
            $table->longText('explanation')->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->boolean('is_diagnostic_eligible')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index(['topic_id', 'status']);
            $table->index(['tier', 'ability_level']);
            $table->index(['target_class_year']);
            $table->fullText(['content', 'explanation']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};