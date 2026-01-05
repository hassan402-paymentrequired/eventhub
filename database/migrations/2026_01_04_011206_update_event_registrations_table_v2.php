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
        Schema::table('event_registerations', function (Blueprint $table) {
            $table->foreignUlid('ticket_id')->nullable()->constrained('event_tickets')->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->decimal('total_price', 10, 2)->default(0);
            $table->json('attendee_details')->nullable();

            // Modify constraints
            // $table->dropUnique(['event_id', 'user_id']); // Leaving this commented for safety in case of index name mismatch, blindly dropping might fail without checking.
            // But we know it was created as $table->unique(['event_id', 'user_id']);
            // If we want to allow multiple registrations for different tickets, we MUST drop this.
            // Let's try dropping by array syntax which resolves to default name.
            $table->dropUnique(['event_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registerations', function (Blueprint $table) {
            //
        });
    }
};
