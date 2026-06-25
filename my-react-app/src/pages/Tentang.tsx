import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import { Target, Users, Heart, Dumbbell, Activity, Star, Coffee, Wifi, ShieldCheck, Check, DollarSign } from 'lucide-react';

export default function TentangPage() {
  const values = [
    { title: "Komunitas", description: "Membangun lingkungan kebugaran yang inklusif, ramah, dan saling mendukung bagi semua kalangan.", icon: Users },
    { title: "Fasilitas Lengkap", description: "Menyediakan peralatan free weights, mesin latihan beban, WiFi, loker, AC, hingga kopi/teh gratis.", icon: Dumbbell },
    { title: "Trainer Profesional", description: "Bimbingan terarah dari Personal Trainer (PT) berpengalaman untuk membantu mencapai fitness goal Anda secara aman.", icon: Target },
    { title: "Kenyamanan", description: "Mengutamakan kebersihan dan kenyamanan latihan dengan ketersediaan kamar mandi, air minum gratis, serta area parkir luas.", icon: ShieldCheck }
  ];

  const facilitiesList = [
    { name: "Peralatan Gym & Free Weights", desc: "Mesin beban modern, dumbbell set, barbell, & functional training area." },
    { name: "Personal Trainer (PT)", desc: "Pendampingan latihan privat dan program terpersonalisasi sesuai kebutuhan fisik." },
    { name: "Air Minum & Air Mineral Gratis", desc: "Akses hidrasi gratis untuk menjaga energi latihan Anda." },
    { name: "Kopi & Teh Hangat Gratis", desc: "Penyegar energi sebelum latihan atau bersantai sesudah workout." },
    { name: "AC & Kamar Mandi Nyaman", desc: "Fasilitas kebersihan lengkap untuk menyegarkan badan setelah beraktivitas." },
    { name: "Loker & WiFi Gratis", desc: "Simpan barang bawaan dengan aman dan tetap terhubung dengan internet cepat." }
  ];

  return (
    <div className="pt-24 bg-[#0B0F19] min-h-screen text-white relative">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <span className="text-[#F97316] font-bold tracking-widest text-xs uppercase block mb-1">PROFIL GYM</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-wide uppercase">Tentang Predator Gym</h1>
        <p className="text-gray-400 text-sm mt-2 max-w-3xl leading-relaxed">
          Predator Gym merupakan pusat kebugaran terpercaya yang berlokasi di Jl. Pasir Randu, Kecamatan Curug, Kabupaten Tangerang, Banten. 
          Kami berdedikasi menyediakan sarana olahraga berkualitas tinggi dengan biaya keanggotaan terjangkau untuk membantu masyarakat memulai dan menjaga gaya hidup aktif sehat.
        </p>
      </div>

      {/* Visi Misi */}
      <section className="py-20 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Image Side */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=80&w=1470&auto=format&fit=crop" 
                alt="Predator Gym Fitness Area" 
                className="rounded-3xl shadow-2xl object-cover w-full h-[450px] border border-gray-800"
              />
              <div className="absolute -bottom-6 -right-6 bg-gym-primary/10 backdrop-blur-md border border-gym-primary/20 p-6 rounded-2xl hidden sm:block">
                <span className="text-xs font-bold text-gym-primary uppercase tracking-wider block">Harga Membership</span>
                <span className="text-3xl font-extrabold text-white">Rp 100k<span className="text-sm font-semibold text-gray-400">/Bulan</span></span>
              </div>
            </div>
            
            {/* Right Content */}
            <div>
              <h2 className="text-4xl font-extrabold mb-8">
                <span className="text-gym-primary">Visi & Misi</span> <span className="text-white">Kami</span>
              </h2>
              
              <div className="space-y-8">
                {/* Visi */}
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gym-primary/10 border border-gym-primary/20 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      <Dumbbell className="text-gym-primary" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Visi Kami</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Menjadi wadah olahraga terbaik di kawasan Tangerang yang ramah, bersih, dan suportif demi menyehatkan masyarakat dari semua kelompok kebugaran.
                  </p>
                </div>

                {/* Misi */}
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-gym-primary/10 border border-gym-primary/20 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                      <Activity className="text-gym-primary" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white">Misi Kami</h3>
                  </div>
                  <ul className="text-gray-300 text-sm space-y-3">
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-gym-primary shrink-0 mt-2"></span>
                      <span>Menyediakan alat kebugaran yang terawat serta area latihan yang bersih dan aman.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-gym-primary shrink-0 mt-2"></span>
                      <span>Menghadirkan layanan olahraga berkualitas standar tinggi dengan biaya pendaftaran & bulanan yang ramah di kantong.</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-gym-primary shrink-0 mt-2"></span>
                      <span>Memfasilitasi member dengan Personal Trainer yang ramah, informatif, dan edukatif.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-[#0E1322] border-y border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#111827]/60 p-6 rounded-2xl border border-gray-800 hover:border-gym-primary/30 transition-all group">
              <span className="text-3xl md:text-4xl font-extrabold text-gym-primary block mb-1 group-hover:scale-105 transition-transform">4.4 / 5</span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Rating Google Maps</span>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border border-gray-800 hover:border-gym-primary/30 transition-all group">
              <span className="text-3xl md:text-4xl font-extrabold text-gym-primary block mb-1 group-hover:scale-105 transition-transform">106+</span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ulasan Google</span>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border border-gray-800 hover:border-gym-primary/30 transition-all group">
              <span className="text-3xl md:text-4xl font-extrabold text-gym-primary block mb-1 group-hover:scale-105 transition-transform">Rp 100k</span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Membership Bulanan</span>
            </div>
            <div className="bg-[#111827]/60 p-6 rounded-2xl border border-gray-800 hover:border-gym-primary/30 transition-all group">
              <span className="text-3xl md:text-4xl font-extrabold text-gym-primary block mb-1 group-hover:scale-105 transition-transform">Rp 15k</span>
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tiket Harian (Insidental)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="Nilai-Nilai Utama" subtitle="CORE VALUES" centered={true} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="group bg-[#111827]/30 p-6 rounded-2xl border border-gray-800/60 hover:border-gym-primary/30 hover:bg-[#111827]/50 transition-all">
                  <div className="mx-auto bg-gym-primary/10 border border-gym-primary/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="text-gym-primary" size={28} />
                  </div>
                  <h4 className="text-lg font-bold text-white mt-5 mb-2">{v.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities & Services Grid */}
      <section className="py-20 bg-[#0E1322] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTitle title="Fasilitas & Layanan Kami" subtitle="FACILITIES" centered={true} />
            <p className="text-gray-400 text-sm mt-2 max-w-2xl mx-auto">Predator Gym melengkapi sesi latihan Anda dengan fasilitas terintegrasi demi kenyamanan penuh selama berolahraga.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilitiesList.map((f, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-[#111827]/50 border border-gray-800/80 hover:border-gray-700 transition-colors">
                <div className="bg-gym-primary/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-gym-primary/20">
                  <Check className="text-gym-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">{f.name}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tautan Lokasi & Jam Operasional Ringkas */}
      <section className="py-20 bg-[#0B0F19] border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-[#111827] to-[#0D121F] p-8 md:p-12 rounded-3xl border border-gray-800">
          <h3 className="text-2xl font-extrabold text-white mb-4">Mulai Perjalanan Kebugaran Anda Sekarang</h3>
          <p className="text-gray-300 text-sm mb-6 max-w-xl mx-auto leading-relaxed">
            Kunjungi lokasi kami di Jl. Pasir Randu No.10, Kadu, Kec. Curug, Kab. Tangerang, Banten atau daftar keanggotaan langsung secara online untuk menikmati harga Rp 100.000/bulan!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="https://wa.me/087771736705"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.2)] text-sm"
            >
              Hubungi via WhatsApp
            </a>
            <a 
              href="/membership"
              className="bg-gym-primary hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(249,115,22,0.25)] text-sm"
            >
              Lihat Paket Member
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
