<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('date');
            $table->string('time');
            $table->string('location');
            $table->string('type'); // "Upcoming" or "Past"
            $table->timestamps();
        });

        // Insert initial dummy events
        DB::table('events')->insert([
            [
                'title' => 'Test Event',
                'date' => '2026-02-24',
                'time' => '13:00',
                'location' => 'Bintaro',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Funtastic Build — Open House English Everywhere',
                'date' => '2026-01-15',
                'time' => '19:00',
                'location' => 'Bintaro',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'English Playdate: Cooking with Friends',
                'date' => '2026-01-15',
                'time' => '19:00',
                'location' => 'Ciputat',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Holiday Prep: Christmas Carol Karaoke',
                'date' => '2026-01-15',
                'time' => '19:00',
                'location' => 'Bintaro',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Speaking Club: New Year Resolutions',
                'date' => '2026-01-15',
                'time' => '19:00',
                'location' => 'Pamulang',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Grammar Masterclass: Present Tense',
                'date' => '2026-01-10',
                'time' => '10:00',
                'location' => 'Bintaro',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Reading Club: Fantastic Beasts',
                'date' => '2026-01-05',
                'time' => '14:00',
                'location' => 'Ciputat',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Vocabulary Booster: Everyday Objects',
                'date' => '2025-12-20',
                'time' => '09:00',
                'location' => 'Pamulang',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Pronunciation Clinic: Accent Training',
                'date' => '2025-12-15',
                'time' => '13:00',
                'location' => 'Bintaro',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'English for Business: Pitching Ideas',
                'date' => '2025-12-10',
                'time' => '16:00',
                'location' => 'Ciputat',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Writing workshop: Creative Essays',
                'date' => '2025-12-01',
                'time' => '11:00',
                'location' => 'Pamulang',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Debate Club: Technology & Society',
                'date' => '2025-11-25',
                'time' => '15:00',
                'location' => 'Bintaro',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Listening practice: Movie Session',
                'date' => '2025-11-18',
                'time' => '18:30',
                'location' => 'Ciputat',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'English Fun Day 2025',
                'date' => '2025-08-15',
                'time' => '09:00',
                'location' => 'Pamulang',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'title' => 'Summer Camp 2025 Completion Ceremony',
                'date' => '2025-08-10',
                'time' => '10:00',
                'location' => 'Bintaro',
                'type' => 'Past',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
