<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attempt_topic_breakdown', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_attempt_id')->constrained('test_attempts')->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
            $table->unsignedInteger('correct')->default(0);
            $table->unsignedInteger('total')->default(0);
            $table->decimal('accuracy', 5, 2)->default(0);

            $table->unique(['test_attempt_id', 'topic_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attempt_topic_breakdown');
    }
};