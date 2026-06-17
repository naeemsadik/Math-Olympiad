<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->string('name', 160);
            $table->text('description')->nullable();
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced', 'Elite'])->default('Beginner');
            $table->unsignedInteger('order')->default(0);
            $table->unsignedInteger('lesson_count')->default(0);
            $table->timestamps();

            $table->index(['topic_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('modules');
    }
};
