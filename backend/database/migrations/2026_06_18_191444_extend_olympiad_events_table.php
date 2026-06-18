<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('olympiad_events', function (Blueprint $table) {
            $table->string('status', 40)->default('upcoming')->after('description');
            $table->string('venue')->nullable()->after('location');
            $table->string('city', 100)->nullable()->after('venue');
            $table->string('country', 100)->nullable()->after('city');
            $table->date('start_date')->nullable()->after('date');
            $table->date('end_date')->nullable()->after('start_date');
            $table->date('registration_deadline')->nullable()->after('end_date');
            $table->string('registration_url')->nullable()->after('registration_link');
            $table->string('level', 40)->nullable()->after('status');
            $table->boolean('is_featured')->default(false)->after('level');
            $table->string('image_path')->nullable()->after('is_featured');
            $table->json('tags')->nullable()->after('image_path');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE olympiad_events MODIFY status ENUM('upcoming','open','closed','completed') NOT NULL DEFAULT 'upcoming'");
        }
    }

    public function down(): void
    {
        Schema::table('olympiad_events', function (Blueprint $table) {
            $table->dropColumn([
                'status', 'venue', 'city', 'country', 'start_date', 'end_date',
                'registration_deadline', 'registration_url', 'level',
                'is_featured', 'image_path', 'tags',
            ]);
        });
    }
};