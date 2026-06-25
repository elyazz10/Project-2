<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MembershipPlan;

class MembershipPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => '1 Bulan',
                'duration_months' => 1,
                'price' => 100000.00,                'description' => 'Paket latihan selama 1 bulan.',
            ],
            [
                'name' => '3 Bulan',
                'duration_months' => 3,
                'price' => 300000.00,                'description' => 'Paket latihan selama 3 bulan.',
            ],
            [
                'name' => '6 Bulan',
                'duration_months' => 6,
                'price' => 600000.00,                'description' => 'Paket latihan selama 6 bulan.',
            ],
            [
                'name' => '12 Bulan',
                'duration_months' => 12,
                'price' => 1200000.00,                'description' => 'Paket latihan selama 12 bulan.',
            ],
            [
                'name' => '18 Bulan',
                'duration_months' => 18,
                'price' => 1800000.00,                'description' => 'Paket latihan selama 18 bulan.',
            ],
            [
                'name' => '24 Bulan',
                'duration_months' => 24,
                'price' => 2400000.00,                'description' => 'Paket latihan selama 24 bulan.',
            ]
        ];

        foreach ($plans as $plan) {
            MembershipPlan::updateOrCreate(
                ['duration_months' => $plan['duration_months']],
                $plan
            );
        }
    }
}

