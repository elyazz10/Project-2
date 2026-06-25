<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GymFeature;

class GymFeatureSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            // Facilities
            [
                'name' => 'Social & Community Area',
                'description' => 'Tempat asyik buat nongkrong, nyantai, & nyari kenalan baru.',
                'icon' => 'Users',
                'type' => 'facility',
            ],
            [
                'name' => 'Functional Area',
                'description' => 'Area luas pake rumput sintetis, bebas buat workout apa aja.',
                'icon' => 'Dumbbell',
                'type' => 'facility',
            ],
            [
                'name' => 'Bebas Masuk Ruang Kelas',
                'description' => 'Pas lagi gak ada kelas, ruangannya bebas lo pake latihan mandiri.',
                'icon' => 'DoorOpen',
                'type' => 'facility',
            ],
            [
                'name' => 'Free Air Minum Sepuasnya',
                'description' => 'Tinggal bawa botol sendiri, bebas isi ulang air gratis kapan aja.',
                'icon' => 'Droplet',
                'type' => 'facility',
            ],
            [
                'name' => 'Comfortable Lounge',
                'description' => 'Tempat selonjoran paling PW sebelum atau abis kelar latihan.',
                'icon' => 'Sofa',
                'type' => 'facility',
            ],
            [
                'name' => 'Cek Komposisi Tubuh',
                'description' => 'Pantau kadar lemak & massa otot lo biar progress makin kelihatan.',
                'icon' => 'Scale',
                'type' => 'facility',
            ],
            [
                'name' => 'Toilet & Hot Shower',
                'description' => 'Mandi air anget abis workout plus hair dryer biar langsung ganteng/cantik.',
                'icon' => 'ShowerHead',
                'type' => 'facility',
            ],
            [
                'name' => 'Loker Aman & Praktis',
                'description' => 'Simpan barang bawaan lo di loker biar bisa fokus latihan tanpa cemas.',
                'icon' => 'Lock',
                'type' => 'facility',
            ],
            [
                'name' => 'Mushola Nyaman',
                'description' => 'Tetep bisa ibadah dengan tenang, tersedia di beberapa cabang ya.',
                'icon' => 'Moon',
                'type' => 'facility',
            ],
            [
                'name' => 'Parkiran Luas',
                'description' => 'Parkir motor atau mobil gak pake ribet, tempatnya luas dan aman.',
                'icon' => 'CircleParking',
                'type' => 'facility',
            ],

            // Equipments
            [
                'name' => 'Gym Machine',
                'description' => 'Smith Machine, Leg Press, Leg Extension, Leg Curl, Abductor, Adductor, Super Squat, Pec Fly, Pec Deck, Chest Press, Power Rack, Adjusted Pulley, Pulldown, Row, Bicep Curl, dll.',
                'icon' => 'Dumbbell',
                'type' => 'equipment',
            ],
            [
                'name' => 'Free Weight',
                'description' => 'Pilihan beban lengkap banget mulai dari Dumbbell, Barbell, Kettlebell, sampai Plates.',
                'icon' => 'Dumbbell',
                'type' => 'equipment',
            ],
            [
                'name' => 'Cardio Zone',
                'description' => 'Bakar kalori & lemak makin asyik pake Treadmill canggih & Spinning Bike modern.',
                'icon' => 'Bike',
                'type' => 'equipment',
            ],
            [
                'name' => 'Lifting Bar',
                'description' => 'Macem-macem bar khusus latihan beban: ada Olympic Bar, EZ Curl Bar, hingga Hex Bar.',
                'icon' => 'Dumbbell',
                'type' => 'equipment',
            ],
            [
                'name' => 'Mattress',
                'description' => 'Yoga mat premium anti-slip yang nyaman banget buat lo stretching atau core training.',
                'icon' => 'Layers',
                'type' => 'equipment',
            ],
            [
                'name' => 'Lain-lain',
                'description' => 'Biar gak bosen: ada Bosu Ball, Medicine/Slam/Stability Ball, TRX, VIPR, Battle Rope, Resistance Band, & lainnya.',
                'icon' => 'MoreHorizontal',
                'type' => 'equipment',
            ],
        ];

        foreach ($features as $feature) {
            GymFeature::updateOrCreate(
                ['name' => $feature['name'], 'type' => $feature['type']],
                $feature
            );
        }
    }
}
