<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_widgets', function (Blueprint $table) {
            $table->id();
            $table->string('page_slug', 60);
            $table->string('widget_type', 60); // milestone, team_member, activity_card, resource_link, stat_block
            $table->unsignedInteger('position')->default(0);
            $table->json('data');
            $table->timestamps();

            $table->index(['page_slug', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_widgets');
    }
};