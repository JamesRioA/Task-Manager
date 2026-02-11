<?php

namespace Database\Seeders;

use App\Models\User;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        foreach (range(1, 5) as $index) {
            User::create([
                'name' => "Employee $index",
                'email' => "employee$index@example.com",
                'password' => Hash::make('password'),
                'role' => 'employee',
            ]);
        }
    }
}
