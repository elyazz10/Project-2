'use client';

import React, { useState, useEffect } from 'react';
import SectionTitle from '@/components/SectionTitle';
import { Star, Award, Calendar, ShieldCheck } from 'lucide-react';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';

interface Trainer {
  id?: number;
  name: string;
  specialization: string;
  image: string;
  description: string;
  rating: string;
  reviews: string;
  tags: string[];
}

const DEFAULT_TRAINERS: Trainer[] = [
  {
    name: "Bima Perkasa",
    specialization: "Head Coach / Bodybuilding",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    description: "Mantan atlet binaraga nasional dengan pengalaman lebih dari 12 tahun. Spesialis dalam program hipertrofi otot dan pembentukan postur ideal.",
    rating: "4.9",
    reviews: "184",
    tags: ["IFBB Pro", "ACE-CPT", "Nutritionist"]
  },
  {
    name: "Nadhira Ayu",
    specialization: "Pilates & Core Wellness",
    image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=800&auto=format&fit=crop", 
    description: "Menggabungkan teknik Pilates modern untuk membantu pemulihan cedera serta memperkuat daya tahan otot inti (core) secara bertahap.",
    rating: "4.8",
    reviews: "142",
    tags: ["Pilates Alliance", "FMS L2", "Yoga RYT"]
  },
  {
    name: "Kevin Kusuma",
    specialization: "Agility & Functional",
    image: "https://images.unsplash.com/photo-1567598508481-65985588e295?q=80&w=800&auto=format&fit=crop", 
    description: "Ahli metodologi pelatihan fungsional yang berfokus pada kekuatan dinamis untuk menunjang aktivitas berat dan peningkatan stamina kardiovaskular.",
    rating: "4.9",
    reviews: "156",
    tags: ["CrossFit L3", "ACSM", "TRX Master"]
  },
  {
    name: "Dr. Clara Safira",
    specialization: "Fat Loss & Nutritionist",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800&auto=format&fit=crop",
    description: "Dokter klinis olahraga yang akan mendampingi program penurunan berat badan Anda menggunakan pendekatan medis dan defisit kalori alami.",
    rating: "5.0",
    reviews: "210",
    tags: ["Klinis Sp.KO", "Dietitian", "ISSA"]
  }
];

export default function PersonalTrainerPage() {
  const [trainers, setTrainers] = useState<Trainer[]>(DEFAULT_TRAINERS);
  const [ptPackages, setPtPackages] = useState<any[]>([
    { duration_months: 1, name: '1 Bulan PT', price: 500000, original_price: 500000 },
    { duration_months: 3, name: '3 Bulan PT', price: 1500000, original_price: 1500000 },
    { duration_months: 6, name: '6 Bulan PT', price: 3000000, original_price: 3000000 },
    { duration_months: 12, name: '12 Bulan PT', price: 6000000, original_price: 6000000 },
    
    
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
      .format(value)
      .replace(/\s?/g, ''); // remove spacing
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const fetchTrainers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/trainers');
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map((t: any) => ({
            ...t,
            tags: typeof t.tags === 'string' ? JSON.parse(t.tags) : t.tags
          }));
          if (formattedData && formattedData.length > 0) {
            setTrainers(formattedData);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch trainers from Laravel backend, using default static list.", error);
      }
    };

    const fetchPtPackages = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/pt-packages');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.packages && data.packages.length > 0) {
            setPtPackages(data.packages);
          }
        }
      } catch (error) {
        console.warn("Failed to fetch PT Packages.", error);
      }
    };

    fetchTrainers();
    fetchPtPackages();
  }, []);

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white flex flex-col items-center overflow-hidden relative">
      
      {/* Why PT Section (Now at the very top of the page) */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-24 w-full relative z-10">
        {/* Glow highlight behind */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="relative">
              <div className="absolute inset-0 bg-[#F97316]/20 blur-3xl rounded-full"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                alt="Coaching session benefits" 
                className="relative z-10 rounded-2xl border border-gray-800 shadow-2xl skew-y-2 hover:skew-y-0"
              />
            </div>

            <div className="space-y-8">
              <SectionTitle title="Mengapa Menggunakan Personal Trainer?" subtitle="HASIL LEBIH CEPAT & AMAN" />
              <p className="text-gray-400 text-lg leading-relaxed">
                Raih target kebugaran Anda secara presisi dengan bimbingan personal profesional.
              </p>
              
              <div className="space-y-6 pt-4">
                {[
                  { title: "Evaluasi Fisik Berkala", desc: "Instruktur mengukur persentase lemak tubuh, massa otot, serta postur fisik secara objektif tiap bulan." },
                  { title: "Gerakan Sempurna & Form Aman", desc: "Pelatih memastikan setiap repetisi Anda memiliki form sempurna untuk mencegah cedera tulang dan otot." },
                  { title: "Penyusunan Jadwal & Target Kustom", desc: "Tidak ada program yang asal sama. Rencana dirancang berdasarkan kekuatan tubuh unik Anda." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-[#1e1e24]/60 p-5 rounded-xl border border-gray-800 hover:border-[#F97316]/30">
                    <div className="w-10 h-10 rounded-lg bg-[#F97316]/10 flex items-center justify-center shrink-0 text-[#F97316]">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white mb-1.5">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Expert Coaching Team / Trainers Grid (Now below the intro section) */}
      <section className="py-24 bg-[#0B0F19] w-full relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-[#F97316] font-bold tracking-widest text-xs md:text-sm uppercase block mb-3">Expert Coaching Team</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase leading-tight tracking-wide">
              Pelatih <span className="text-[#F97316]">Profesional Kami</span>
            </h2>
          </div>

          {/* Trainer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {trainers.map((trainer, idx) => (
              <div 
                key={idx} 
                className="bg-[#1e1e24]/80 rounded-2xl overflow-hidden border border-gray-850 hover:border-[#F97316] group flex flex-col h-full hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]"
              >
                {/* Image Section */}
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent z-10"></div>
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-full h-full object-cover scale-100 group-hover:scale-105"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg z-20 flex items-center gap-1.5 border border-gray-700">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="text-white text-sm font-bold">{trainer.rating}</span>
                    <span className="text-gray-400 text-xs">({trainer.reviews})</span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{trainer.name}</h3>
                    <p className="text-[#F97316] text-[15px] font-semibold mb-4">{trainer.specialization}</p>
                    
                    <p className="text-gray-300 text-[14px] leading-relaxed mb-6">
                      {trainer.description}
                    </p>

                    {/* Certifications */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                         <Award size={18} className="text-gray-400" />
                         <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Sertifikasi</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {trainer.tags.map((tag, index) => (
                          <span key={index} className="text-[11px] font-bold bg-[#303038] text-gray-300 px-3 py-1 rounded-full whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Booking Button */}
                  <div className="pt-2 border-t border-gray-800">
                    <Link 
                      to={isLoggedIn ? `/checkout?type=pt&trainer_id=${trainer.id || ''}` : `/login?redirect=${encodeURIComponent('/checkout?type=pt&trainer_id=' + (trainer.id || ''))}`} 
                      className="w-full block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full py-3.5 text-xs font-extrabold tracking-widest uppercase border-gray-700 text-white hover:bg-[#F97316] hover:text-white hover:border-[#F97316] hover:scale-100 flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} />
                        Booking Session
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
