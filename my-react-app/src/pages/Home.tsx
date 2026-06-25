import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, TrendingUp } from 'lucide-react';
import Button from '@/components/Button';
import SectionTitle from '@/components/SectionTitle';

export default function Home() {
  return (
    <div className="pt-20">
      <section className="relative min-h-[90vh] flex items-center bg-[#0B0F19] overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 flex justify-end pointer-events-none">
          <div className="w-full md:w-3/5 h-full relative">
            <img 
              src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" 
              alt="Predator Gym Hero" 
              className="w-full h-full object-cover object-right opacity-80"
            />
            {/* Gradient fade from left to right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
          <div className="max-w-2xl relative">
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-bold text-white leading-[1.1] tracking-tight mb-8 uppercase">
              <span className="text-[#F97316]">BUILD</span> YOUR BODY<br />
              <span className="text-[#F97316]">TRANSFORM</span> YOUR LIFE
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed mb-10 font-medium">
              Temukan program latihan terbaik yang dirancang oleh pelatih profesional untuk membantu Anda mencapai target kebugaran. Mulai perjalanan fitnes Anda hari ini!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Link to="/login?redirect=/membership" className="w-full sm:w-auto">
                <Button variant="primary" className="rounded-md border-transparent hover:scale-100 px-6 py-3 font-medium bg-gradient-to-r from-[#ff4d4d] to-[#ff4b2b] hover:from-[#e04040] hover:to-[#e03a20] shadow-none w-full text-[15px]">
                  Mulai Sekarang - Gratis 1 Hari
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
      {/* Quick Value Prop */}
      <section className="py-20 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Mengapa Memilih Predator Gym?" 
            subtitle="Nilai Lebih Kami" 
            centered={true}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center group">
              <div className="w-16 h-16 mx-auto bg-gym-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gym-primary/20">
                <ShieldCheck className="text-gym-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Peralatan Premium</h3>
              <p className="text-gray-400">Kami menggunakan perangkat kebugaran berstandar internasional untuk memaksimalkan hasil latihan Anda.</p>
            </div>
            <div className="glass-card p-8 text-center group">
              <div className="w-16 h-16 mx-auto bg-gym-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gym-primary/20">
                <Activity className="text-gym-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lingkungan Nyaman</h3>
              <p className="text-gray-400">Suasana latihan yang terfokus, bersih, dan mendukung untuk semua tingkat kebugaran dari pemula hingga pro.</p>
            </div>
            <div className="glass-card p-8 text-center group">
              <div className="w-16 h-16 mx-auto bg-gym-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-gym-primary/20">
                <TrendingUp className="text-gym-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Hasil Terukur</h3>
              <p className="text-gray-400">Program dirancang dengan metrik yang jelas, memastikan setiap keringat yang keluar membuahkan hasil nyata.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

