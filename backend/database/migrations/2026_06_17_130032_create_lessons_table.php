<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->cascadeOnDelete();
            $table->string('title', 200);
            $table->longText('content')->nullable();
            $table->json('key_points')->nullable();
            $table->text('example_problem')->nullable();
            $table->longText('example_solution')->nullable();
            $table->json('resources')->nullable();
            $table->unsignedSmallInteger('estimated_minutes')->default(10);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();

            $table->index(['module_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
