<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title')->default('Untitled Badge');
            $table->string('badge_type')->default('Attendee');
            $table->string('access_level')->default('General');
            $table->string('size_preset')->default('A6');
            $table->string('orientation')->default('portrait');
            $table->float('width')->default(105);
            $table->float('height')->default(148);
            $table->string('unit')->default('mm');
            $table->string('active_side')->default('front');
            $table->json('page_config')->nullable();
            $table->json('front_boxes')->nullable();
            $table->json('back_boxes')->nullable();
            $table->json('layers')->nullable();
            $table->json('settings')->nullable();
            $table->longText('preview_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};

