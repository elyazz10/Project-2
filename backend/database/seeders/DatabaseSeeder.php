<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            TrainerSeeder::class,
            MembershipPlanSeeder::class,
            AdminUserSeeder::class,
            GymFeatureSeeder::class,
            PtPackageSeeder::class,
        ]);
    }
}
