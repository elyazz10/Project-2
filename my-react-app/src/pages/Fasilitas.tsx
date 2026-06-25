import React from 'react';
import FacilityCard from '@/components/FacilityCard';
import PageHeader from '@/components/PageHeader';
import { Dumbbell, Server, Music, Coffee, Wifi, Car, Bath, Shield } from 'lucide-react';

export default function FasilitasPage() {
  const areas = [
    { title: "Free Weight Area", description: "Area angkat beban bebas standar kompetisi", icon: Dumbbell, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" },
    { title: "Cardio Zone", description: "Puluhan mesin kardio dengan layar sentuh", icon: Server, image: "https://images.unsplash.com/photo-1596357395217-80de13130e92?q=80&w=2071&auto=format&fit=crop" },
    { title: "Studio Kelas", description: "Studio luas kedap suara dengan tata cahaya dinamis", icon: Music, image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1974&auto=format&fit=crop" },
    { title: "CrossFit Box", description: "Area fungsional dengan rig, box, dan tali", icon: Server, image: "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?q=80&w=1974&auto=format&fit=crop" }
  ];

  const supports = [
    { title: "Locker Digital", description: "Loker pintar aman dengan akses gelang RFID", icon: Shield, image: "/images/locker_digital.png" },
    { title: "Premium Showers", description: "Kamar mandi VIP lengkap dengan air panas", icon: Bath, image: "/images/premium_showers.png" },
    { title: "Sauna Room", description: "Ruang uap kering untuk pemulihan otot", icon: Coffee, image: "/images/sauna_room.png" },
    { title: "Nutrition Bar", description: "Protein shake dan camilan sehat pasca latihan", icon: Coffee, image: "/images/nutrition_bar.png" }
  ];

  const comforts = [
    { title: "Parkir Luas", description: "Area parkir gratis dan aman", icon: Car, image: "/images/parkir.jpg" },
    { title: "WiFi Cepat", description: "Koneksi internet tanpa batas", icon: Wifi, image: "/images/wifi.jpg" },
    { title: "Area Santai", description: "Lounge nyaman untuk bersosialisasi", icon: Coffee, image: "/images/santai.jpg" },
    { title: "Klinik Fisioterapi", description: "Konsultasi cedera olahraga di tempat", icon: Shield, image: "/images/klinik.jpg" }
  ];

  return (
    <div className="pt-20 bg-[#0B0F19]">
      <PageHeader 
        title1="Fasilitas" 
        title2="Premium Kami" 
        subtitle="INFRASTRUKTUR KELAS DUNIA"
        bgImage="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Area Latihan */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-gym-primary pl-4">Area Latihan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {areas.map((item, idx) => (
              <FacilityCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Fasilitas Pendukung */}
      <section className="py-16 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-gym-primary pl-4">Fasilitas Pendukung</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supports.map((item, idx) => (
              <FacilityCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Kenyamanan */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-gym-primary pl-4">Kenyamanan & Ekstra</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {comforts.map((item, idx) => (
              <FacilityCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-20 bg-[#111827] border-t border-gray-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h4 className="text-gray-400 font-semibold mb-10 tracking-widest text-sm uppercase">Didukung Oleh Merek Peralatan Terbaik</h4>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0">
             <span className="text-2xl font-bold text-white">TechnoGym</span>
             <span className="text-2xl font-bold text-white">LifeFitness</span>
             <span className="text-2xl font-bold text-white">Rogue</span>
             <span className="text-2xl font-bold text-white">Eleiko</span>
             <span className="text-2xl font-bold text-white">Cybex</span>
          </div>
        </div>
      </section>

    </div>
  );
}

