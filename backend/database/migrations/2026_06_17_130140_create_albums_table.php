<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->date('date')->nullable();
            $table->enum('category', ['Competition', 'Training', 'Workshop', 'Seminar', 'Other'])->default('Other');
            $table->string('color', 20)->default('blue');
            $table->string('icon', 60)->default('image');
            $table->string('cover_gradient', 255)->nullable();
            $table->text('description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('albums');
    }
};