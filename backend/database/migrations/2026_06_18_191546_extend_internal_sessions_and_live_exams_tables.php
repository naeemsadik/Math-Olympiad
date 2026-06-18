<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('internal_sessions', function (Blueprint $table) {
            $table->string('topic')->nullable()->after('title');
            $table->string('speaker')->nullable()->after('topic');
            $table->dateTime('scheduled_at')->nullable()->after('time');
            $table->integer('duration_minutes')->nullable()->after('scheduled_at');
            $table->string('meeting_url')->nullable()->after('duration_minutes');
            $table->integer('capacity')->nullable()->after('meeting_url');
            $table->integer('registered_count')->default(0)->after('capacity');
            $table->string('status', 40)->default('scheduled')->after('registered_count');
            $table->text('description')->nullable()->after('status');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE internal_sessions MODIFY status ENUM('scheduled','live','completed','cancelled') NOT NULL DEFAULT 'scheduled'");
        }

        Schema::table('live_exams', function (Blueprint $table) {
            $table->integer('duration_minutes')->nullable()->after('duration');
            $table->string('meeting_url')->nullable()->after('duration_minutes');
            $table->integer('capacity')->nullable()->after('meeting_url');
            $table->integer('time_limit_seconds')->nullable()->after('capacity');
            $table->dateTime('starts_at')->nullable()->after('time_limit_seconds');
            $table->dateTime('ends_at')->nullable()->after('starts_at');
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE live_exams MODIFY status ENUM('scheduled','live','ended','completed','cancelled','upcoming') NOT NULL DEFAULT 'upcoming'");
        }
    }

    public function down(): void
    {
        Schema::table('internal_sessions', function (Blueprint $table) {
            $table->dropColumn([
                'topic', 'speaker', 'scheduled_at', 'duration_minutes',
                'meeting_url', 'capacity', 'registered_count', 'status', 'description',
            ]);
        });

        Schema::table('live_exams', function (Blueprint $table) {
            $table->dropColumn([
                'duration_minutes', 'meeting_url', 'capacity',
                'time_limit_seconds', 'starts_at', 'ends_at',
            ]);
        });
    }
};