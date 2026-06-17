<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->enum('audience', ['all', 'students', 'faculty'])->default('all')->after('priority');
            $table->enum('status', ['draft', 'published', 'archived'])->default('published')->after('audience');
            $table->boolean('pinned')->default(false)->after('status');
            $table->timestamp('expires_at')->nullable()->after('pinned');
        });
    }

    public function down(): void
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->dropColumn(['audience', 'status', 'pinned', 'expires_at']);
        });
    }
};
