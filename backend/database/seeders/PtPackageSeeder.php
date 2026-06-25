<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PtPackage;

class PtPackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'name' => '1 Bulan PT',
                'duration_months' => 1,
                'price' => 500000.00,
                'original_price' => 500000.00,
                'is_active' => true,
            ],
            [
                'name' => '3 Bulan PT',
                'duration_months' => 3,
                'price' => 1500000.00,
                'original_price' => 1500000.00,
                'is_active' => true,
            ],
            [
                'name' => '6 Bulan PT',
                'duration_months' => 6,
                'price' => 3000000.00,
                'original_price' => 3000000.00,
                'is_active' => true,
            ],
            [
                'name' => '12 Bulan PT',
                'duration_months' => 12,
                'price' => 6000000.00,
                'original_price' => 6000000.00,
                'is_active' => true,
            ],
        ];

        foreach ($packages as $pkg) {
            PtPackage::updateOrCreate(
                ['duration_months' => $pkg['duration_months']],
                $pkg
            );
        }
    }
}

