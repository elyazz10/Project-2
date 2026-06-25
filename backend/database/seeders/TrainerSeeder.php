<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Trainer;

class TrainerSeeder extends Seeder
{
    public function run(): void
    {
        $trainers = [
            [
                'name' => 'Bima Perkasa',
                'specialization' => 'Head Coach / Bodybuilding',
                'image' => 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
                'description' => 'Mantan atlet binaraga nasional dengan pengalaman lebih dari 12 tahun. Spesialis dalam program hipertrofi otot dan pembentukan postur ideal.',
                'rating' => '4.9',
                'reviews' => '184',
                'tags' => ['IFBB Pro', 'ACE-CPT', 'Nutritionist']
            ],
            [
                'name' => 'Nadhira Ayu',
                'specialization' => 'Pilates & Core Wellness',
                'image' => 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=800&auto=format&fit=crop',
                'description' => 'Menggabungkan teknik Pilates modern untuk membantu pemulihan cedera serta memperkuat daya tahan otot inti (core) secara bertahap.',
                'rating' => '4.8',
                'reviews' => '142',
                'tags' => ['Pilates Alliance', 'FMS L2', 'Yoga RYT']
            ],
            [
                'name' => 'Kevin Kusuma',
                'specialization' => 'Agility & Functional',
                'image' => 'https://images.unsplash.com/photo-1567598508481-65985588e295?q=80&w=800&auto=format&fit=crop',
                'description' => 'Ahli metodologi pelatihan fungsional yang berfokus pada kekuatan dinamis untuk menunjang aktivitas berat dan peningkatan stamina kardiovaskular.',
                'rating' => '4.9',
                'reviews' => '156',
                'tags' => ['CrossFit L3', 'ACSM', 'TRX Master']
            ],
            [
                'name' => 'Dr. Clara Safira',
                'specialization' => 'Fat Loss & Nutritionist',
                'image' => 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop',
                'description' => 'Dokter klinis olahraga yang akan mendampingi program penurunan berat badan Anda menggunakan pendekatan medis dan defisit kalori alami.',
                'rating' => '5.0',
                'reviews' => '210',
                'tags' => ['Klinis Sp.KO', 'Dietitian', 'ISSA']
            ]
        ];

        foreach ($trainers as $trainerData) {
            $trainer = Trainer::updateOrCreate(
                ['name' => $trainerData['name']],
                $trainerData
            );

            // Automatically create / link corresponding User account for trainer login
            $email = strtolower(explode(' ', $trainer->name)[0]) . '@predatorgym.com';
            \App\Models\User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => $trainer->name,
                    'password' => \Illuminate\Support\Facades\Hash::make('password'),
                    'role' => 'trainer',
                    'trainer_id' => $trainer->id
                ]
            );
        }
    }
}
