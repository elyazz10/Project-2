<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@predatorgym.com'],
            [
                'name' => 'Admin Predator Gym',
                'password' => Hash::make('adminsecurepass'),
                'whatsapp' => '08123456789',
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'owner@ultrafitness.com'],
            [
                'name' => 'Owner Predator Gym',
                'password' => Hash::make('ownersecurepass'),
                'whatsapp' => '081222333444',
                'role' => 'owner',
            ]
        );
    }
}
