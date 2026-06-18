<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_events', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('type', 60)->nullable();
            $table->string('type_color', 30)->default('blue');
            $table->date('date')->nullable();
            $table->string('location', 190)->nullable();
            $table->unsignedInteger('capacity')->default(100);
            $table->enum('status', ['open', 'closed', 'upcoming'])->default('open');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_events');
    }
};