<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('email', 190)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // Math-Olympiad custom fields
            $table->enum('role', ['student', 'admin', 'faculty'])->default('student');
            $table->enum('tier', ['Beginner', 'Intermediate', 'Advanced'])->nullable();
            $table->string('level', 60)->nullable();
            $table->unsignedInteger('xp')->default(0);
            $table->unsignedInteger('streak')->default(0);
            $table->date('last_active_at')->nullable();

            $table->string('institute', 190)->nullable();
            $table->string('university', 190)->nullable();
            $table->string('department', 120)->nullable();
            $table->enum('institution_type', ['School', 'College', 'University', 'Graduate'])->nullable();
            $table->string('class_year', 60)->nullable();

            $table->string('gender', 30)->nullable();
            $table->date('dob')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('whatsapp', 30)->nullable();
            $table->string('address', 255)->nullable();
            $table->text('about')->nullable();
            $table->string('avatar_path', 255)->nullable();

            $table->timestamp('joined_at')->useCurrent();
            $table->enum('status', ['active', 'suspended'])->default('active');
            $table->boolean('placement_done')->default(false);

            $table->enum('diagnostic_ability_level', ['Beginner', 'Advanced', 'Expert'])->nullable();
            $table->unsignedTinyInteger('diagnostic_score')->nullable();
            $table->timestamp('diagnostic_completed_at')->nullable();
            $table->unsignedBigInteger('diagnostic_attempt_id')->nullable();

            $table->rememberToken();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['role', 'tier']);
            $table->index(['institution_type', 'class_year']);
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
