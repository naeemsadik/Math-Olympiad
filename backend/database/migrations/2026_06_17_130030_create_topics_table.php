<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('topics', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 120)->unique();
            $table->string('name', 160);
            $table->text('description')->nullable();
            $table->enum('tier', ['Beginner', 'Intermediate', 'Advanced']);
            $table->enum('level', ['Beginner', 'Intermediate', 'Advanced', 'Elite']);
            $table->string('color', 20)->nullable();
            $table->string('image_path', 255)->nullable();
            $table->unsignedInteger('lesson_count')->default(0);
            $table->unsignedInteger('problem_count')->default(0);
            $table->timestamps();

            $table->index(['tier', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('topics');
    }
};
