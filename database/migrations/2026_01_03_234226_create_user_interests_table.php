<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('user_interests')) {
            Schema::create('user_interests', function (Blueprint $table) {
                // $table->ulid('id')->primary();
                $table->foreignUlid('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignUlid('event_category_id')->constrained('event_categories')->cascadeOnDelete();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_interests');
    }
};
