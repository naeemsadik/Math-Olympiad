<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registration_events', function (Blueprint $table) {
            $table->string('venue')->nullable()->after('location');
            $table->dateTime('start_at')->nullable()->after('date');
            $table->dateTime('end_at')->nullable()->after('start_at');
            $table->dateTime('registration_deadline')->nullable()->after('end_at');
            $table->decimal('fee', 10, 2)->default(0)->after('capacity');
            $table->string('currency', 8)->default('BDT')->after('fee');
            $table->boolean('requires_approval')->default(false)->after('currency');
            $table->string('cover_image')->nullable()->after('requires_approval');
            $table->string('category', 80)->nullable()->after('cover_image');
        });

        // Widen the status enum to cover the full lifecycle the admin UI uses.
        // MySQL needs an explicit MODIFY; SQLite already stores enums as TEXT so
        // no schema change is required there and MODIFY is a syntax error.
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE registration_events MODIFY status ENUM('draft','open','closed','completed','cancelled','upcoming') NOT NULL DEFAULT 'draft'");
        }
    }

    public function down(): void
    {
        Schema::table('registration_events', function (Blueprint $table) {
            $table->dropColumn([
                'venue', 'start_at', 'end_at', 'registration_deadline',
                'fee', 'currency', 'requires_approval', 'cover_image', 'category',
            ]);
        });
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE registration_events MODIFY status ENUM('open','closed','upcoming') NOT NULL");
        }
    }
};