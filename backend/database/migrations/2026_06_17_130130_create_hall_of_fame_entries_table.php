<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hall_of_fame_entries', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160);
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('achievement', 200);
            $table->string('department', 120)->nullable();
            $table->text('details')->nullable();
            $table->enum('tier', ['gold', 'silver', 'bronze'])->default('gold');
            $table->string('image_path', 255)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hall_of_fame_entries');
    }
};