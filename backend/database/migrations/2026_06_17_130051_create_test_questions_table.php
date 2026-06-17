<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_questions', function (Blueprint $table) {
            $table->foreignId('test_id')->constrained('tests')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('questions')->restrictOnDelete();
            $table->unsignedInteger('order')->default(0);

            $table->primary(['test_id', 'question_id']);
            $table->index(['test_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_questions');
    }
};