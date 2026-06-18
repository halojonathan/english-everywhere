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
        Schema::create('appointment_schedules', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('time'); // e.g. "10.00", "13.00"
            $table->integer('quota')->default(1);
            $table->integer('booked')->default(0);
            $table->timestamps();

            // Enforce unique combinations of date and time
            $table->unique(['date', 'time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_schedules');
    }
};
