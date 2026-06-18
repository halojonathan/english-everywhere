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
        Schema::create('appointment_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('appointment_schedules')->cascadeOnDelete();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('gender')->nullable();
            $table->string('program')->nullable(); // Original requested program (if any)
            $table->string('assigned_program')->nullable(); // Program assigned by admin on accept
            $table->string('status')->default('pending'); // e.g. "pending", "accepted"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_bookings');
    }
};
