<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('olympiad_events', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->enum('type', ['IMO', 'BdMO', 'AMC', 'INTERNAL']);
            $table->date('date')->nullable();
            $table->time('time')->nullable();
            $table->string('location', 190)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_internal')->default(false);
            $table->string('official_link', 255)->nullable();
            $table->string('registration_link', 255)->nullable();
            $table->timestamps();

            $table->index(['type', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('olympiad_events');
    }
};