<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->string('id', 40)->primary(); // e.g. UIU-CMOR-2025-001
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('student_name', 160);
            $table->string('student_id_str', 60)->nullable();
            $table->string('dept', 120)->nullable();
            $table->string('institute', 190)->nullable();
            $table->string('achievement', 200);
            $table->string('event', 200)->nullable();
            $table->string('event_type', 60)->nullable();
            $table->text('description')->nullable();
            $table->date('issued_at')->nullable();
            $table->enum('tier', ['gold', 'silver', 'bronze'])->default('gold');
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('signatory_name', 160)->nullable();
            $table->string('signatory_title', 160)->nullable();
            $table->enum('status', ['valid', 'revoked'])->default('valid');
            $table->timestamps();

            $table->index(['user_id']);
            $table->index(['status', 'issued_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};