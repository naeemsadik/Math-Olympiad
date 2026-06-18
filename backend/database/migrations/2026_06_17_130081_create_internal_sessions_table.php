<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internal_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('subtitle', 255)->nullable();
            $table->date('date')->nullable();
            $table->time('time')->nullable();
            $table->string('type', 60)->default('MOCK SESSION');
            $table->string('type_color', 30)->default('violet');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internal_sessions');
    }
};