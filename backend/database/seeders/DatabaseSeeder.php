<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'English Teacher',
            'email' => 'teacher',
            'password' => \Illuminate\Support\Facades\Hash::make('guru123'),
            'role' => 'teacher',
        ]);

        User::factory()->create([
            'name' => 'Active Student',
            'email' => 'student',
            'password' => \Illuminate\Support\Facades\Hash::make('murid123'),
            'role' => 'student',
        ]);
    }
}
