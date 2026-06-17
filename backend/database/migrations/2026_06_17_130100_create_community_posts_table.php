<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->longText('body')->nullable();
            $table->enum('category', ['Algebra', 'Combinatorics', 'Number Theory', 'Geometry', 'General'])->default('General');
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('author_institute', 190)->nullable();
            $table->enum('tier', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('likes')->default(0);
            $table->boolean('pinned')->default(false);
            $table->json('tags')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['tier', 'category', 'pinned']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_posts');
    }
};