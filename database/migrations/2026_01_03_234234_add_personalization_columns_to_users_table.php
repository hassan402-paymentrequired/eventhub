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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'preferred_location')) {
                $table->string('preferred_location')->nullable();
            }
            if (!Schema::hasColumn('users', 'event_preference')) {
                $table->string('event_preference')->default('both');
            }
            if (!Schema::hasColumn('users', 'is_organizer')) {
                $table->boolean('is_organizer')->default(false);
            }
            if (!Schema::hasColumn('users', 'onboarding_completed')) {
                $table->boolean('onboarding_completed')->default(false);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
};
