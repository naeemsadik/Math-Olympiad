<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Spatie's default morphs() makes subject_id/causer_id bigint, but several of
        // our models (Certificate, Page, HallOfFameEntry, etc.) use string PKs.
        // Widen those columns so polymorphic logging works for every subject type.
        //
        // We use raw SQL on MySQL (the only prod driver) because doctrine/dbal is
        // not in our composer deps. SQLite is test-only — the failing string-PK
        // models aren't exercised through activity_log in the test suite, so a
        // no-op there is safe.
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE activity_log MODIFY subject_id VARCHAR(64) NULL');
            DB::statement('ALTER TABLE activity_log MODIFY causer_id  VARCHAR(64) NULL');
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE activity_log MODIFY subject_id BIGINT UNSIGNED NULL');
            DB::statement('ALTER TABLE activity_log MODIFY causer_id  BIGINT UNSIGNED NULL');
        }
    }
};