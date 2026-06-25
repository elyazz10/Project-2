import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import ProgramCard from '@/components/ProgramCard';
import Button from '@/components/Button';
import { Dumbbell, Activity, Heart, Trophy, Flame, Zap, CheckCircle2 } from 'lucide-react';

export default function ProgramPage() {
  const programs = [
    {
      id: 1,
      title: "Weight Training",
      description: "Fokus pada pembentukan otot dan peningkatan kekuatan secara keseluruhan dengan peralatan free-weight premium.",
      icon: Dumbbell,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      benefits: ["Meningkatkan masa otot", "Memperkuat tulang", "Meningkatkan postur tubuh"]
    },
    {
      id: 2,
      title: "Cardio Kickboxing",
      description: "Kombinasi seni bela diri dan cardio berintensitas tinggi untuk membakar kalori maksimal.",
      icon: Flame,
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=2070&auto=format&fit=crop",
      benefits: ["Membakar 600+ kalori", "Melatih refleks", "Menurunkan stress"]
    },
    {
      id: 3,
      title: "HIIT Workout",
      description: "Latihan interval intensitas tinggi untuk mengoptimalkan metabolisme tubuh dalam waktu singkat.",
      icon: Zap,
      image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=1925&auto=format&fit=crop",
      benefits: ["Efisiensi waktu", "After-burn effect", "Peningkatan stamina"]
    },
    {
      id: 4,
      title: "Yoga & Flexibility",
      description: "Program yang dirancang khusus untuk meningkatkan kelenturan, keseimbangan, dan ketenangan pikiran.",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
      benefits: ["Meningkatkan fleksibilitas", "Relaksasi otot", "Pernafasan lebih baik"]
    },
    {
      id: 5,
      title: "Functional Training",
      description: "Melatih otot-otot tubuh agar bisa bekerja sama untuk mengoptimalkan aktivitas sehari-hari.",
      icon: Activity,
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop",
      benefits: ["Mencegah cedera", "Mobilitas tinggi", "Core strength"]
    },
    {
      id: 6,
      title: "CrossFit Elite",
      description: "Program intensif yang menggabungkan angkat beban olympic, senam, dan latihan kardiovaskular.",
      icon: Trophy,
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
      benefits: ["Kekuatan absolut", "Ketahanan kardio", "Komunitas solid"]
    }
  ];

  return (
    <div className="pt-20">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-b from-[#111827] to-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            title="Program Unggulan Kami"
            subtitle="PILIH JALANMU"
            centered={true}
          />
          <p className="text-gray-400 max-w-2xl mx-auto text-lg pt-4">
            Kami menyediakan berbagai program yang dirancang khusus oleh para ahli untuk membantu Anda mencapai target kebugaran individu, apapun bentuk tubuh dan tingkat pengalaman Anda.
          </p>
        </div>
      </section>

      {/* Program Grid */}
      <section className="py-12 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((prog) => (
              <ProgramCard key={prog.id} {...prog} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommendation Section */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative rounded-2xl overflow-hidden h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
                alt="Personal Training"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111827] to-transparent opacity-80 md:hidden"></div>
            </div>

            {/* Right Info */}
            <div>
              <SectionTitle title="Butuh Rekomendasi?" subtitle="KONSULTASI GRATIS" />
              <p className="text-gray-400 mb-8 leading-relaxed">
                Tidak yakin program mana yang cocok untuk Anda? Para instruktur kami siap membantu merancang rencana latihan yang disesuaikan dengan gaya hidup dan tujuan akhir Anda.
              </p>

              <div className="space-y-6">
                {[
                  "Assessment fisik komprehensif 30 menit",
                  "Analisis komposisi tubuh (Body Fat & Muscle Mass)",
                  "Custom meal plan guidelines"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center bg-[#0B0F19] p-4 rounded-xl border border-gray-800">
                    <CheckCircle2 className="text-gym-primary flex-shrink-0" size={24} />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gym-primary/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-black/80 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop"
            alt="CTA Background"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Siap Memulaiasi Anda Hari Ini?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Dapatkan diskon 20% untuk pendaftaran member tahunan bulan ini.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="primary" className="text-lg px-8 py-4">Bergabung Sekarang</Button>
            <Button variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gym-primary">
              Hubungi CS
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

