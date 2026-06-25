import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import TrainerCard from '@/components/TrainerCard';
import FeatureItem from '@/components/FeatureItem';
import PageHeader from '@/components/PageHeader';

export default function PelatihPage() {
  const trainers = [
    {
      name: "Bima Perkasa",
      specialization: "Head Coach / Bodybuilding",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
      description: "Mantan atlet binaraga nasional dengan pengalaman lebih dari 12 tahun. Spesialis dalam program hipertrofi otot dan pembentukan postur ideal.",
      tags: ["IFBB Pro", "ACE-CPT", "Nutritionist"]
    },
    {
      name: "Nadhira Ayu",
      specialization: "Pilates & Core Wellness",
      image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=800&auto=format&fit=crop", 
      description: "Menggabungkan teknik Pilates modern untuk membantu pemulihan cedera serta memperkuat daya tahan otot inti (core) secara bertahap.",
      tags: ["Pilates Alliance", "FMS L2", "Yoga RYT"]
    },
    {
      name: "Kevin Kusuma",
      specialization: "Agility & Functional",
      image: "https://images.unsplash.com/photo-1567598508481-65985588e295?q=80&w=800&auto=format&fit=crop", 
      description: "Ahli metodologi pelatihan fungsional yang berfokus pada kekuatan dinamis untuk menunjang aktivitas berat dan peningkatan stamina kardiovaskular.",
      tags: ["CrossFit L3", "ACSM", "TRX Master"]
    },
    {
      name: "Dr. Clara Safira",
      specialization: "Fat Loss & Nutritionist",
      image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop",
      description: "Dokter klinis olahraga yang akan mendampingi program penurunan berat badan Anda menggunakan pendekatan medis dan defisit kalori alami.",
      tags: ["Klinis Sp.KO", "Dietitian", "ISSA"]
    }
  ];

  const features = [
    { title: "Sertifikasi Internasional", description: "Semua pelatih kami wajib memiliki sertifikasi organisasi kebugaran internasional yang diakui." },
    { title: "Pendekatan Ilmiah", description: "Tidak ada metode asal-asalan. Semua program didasarkan pada riset fisiologi dan biomekanika terbaru." },
    { title: "Dukungan Psikologis", description: "Kami mengerti kendala mental dalam konsisten berlatih. Pelatih kami dilatih untuk memotivasi dengan empati." },
    { title: "Edukasi Berkelanjutan", description: "Tujuan akhir kami adalah membuat Anda mandiri. Kami mengedukasi cara berlatih yang aman dan efektif." }
  ];

  return (
    <div className="pt-20 bg-[#0B0F19]">
      <PageHeader 
        title1="Pelatih" 
        title2="Profesional Kami" 
        subtitle="EXPERT TEAM - Setiap pelatih memiliki spesialisasi unik untuk membantu Anda mencapai hasil optimal"
        bgImage="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Trainer Cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainers.map((trainer, idx) => (
              <TrainerCard key={idx} {...trainer} />
            ))}
          </div>
        </div>
      </section>

      {/* Filosofi Section */}
      <section className="py-24 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
              <div className="absolute inset-0 bg-gym-primary/20 blur-3xl rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                alt="Coaching session" 
                className="relative z-10 rounded-2xl border border-gray-800 shadow-2xl skew-y-2 hover:skew-y-0"
              />
            </div>

            <div className="space-y-8">
              <SectionTitle title="Filosofi Kepelatihan Kami" subtitle="NILAI INTI KAMI" />
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Bagi kami, menjadi pelatih bukan sekadar menghitung repetisi atau meneriakkan semangat. Ini tentang merancang peta jalan kesuksesan spesifik untuk setiap individu.
              </p>
              
              <div className="space-y-6">
                {features.map((item, idx) => (
                  <FeatureItem key={idx} {...item} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

