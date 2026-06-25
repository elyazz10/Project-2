import React from 'react';
import SectionTitle from '@/components/SectionTitle';
import { MapPin, Phone, Mail, Clock, Calendar, Compass, ExternalLink } from 'lucide-react';
import Button from '@/components/Button';

export default function LokasiPage() {
  const operasional = [
    { hari: "Senin - Jumat", jam: "08:00 - 22:00" },
    { hari: "Sabtu", jam: "08:00 - 11:00" },
    { hari: "Minggu", jam: "08:00 - 22:00" }
  ];

  const infoHubungi = [
    { icon: MapPin, title: "Alamat Gym", value: "Jalan Pasir Randu No.10 RT 002/003, Jl. Pasir Randu No.10, RT.7/RW.2, Kadu, Kec. Curug, Kabupaten Tangerang, Banten 15810" },
    { icon: Phone, title: "Nomor Telepon / WhatsApp", value: "087771736705" },
    { icon: Mail, title: "Email Resmi", value: "anomrizki74@gmail.com" }
  ];

  return (
    <div className="pt-24 bg-[#0B0F19] min-h-screen text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <span className="text-[#F97316] font-bold tracking-widest text-xs uppercase block mb-1">Lokasi Kami</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-wide uppercase">Lokasi & Hubungi Kami</h1>
        <p className="text-gray-400 text-sm mt-1">TEMUKAN KAMI DI PUSAT KOTA DENGAN AKSES STRATEGIS DAN PARKIR LUAS</p>
      </div>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Alamat & Operasional */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-8">
              <SectionTitle title="Hubungi Kami" subtitle="INFORMASI GYM" />
              
              <div className="space-y-6">
                {infoHubungi.map((info, idx) => {
                  const Icon = info.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start bg-[#1e1e24] p-5 rounded-xl border border-gray-800 hover:border-gym-primary/30">
                      <div className="w-12 h-12 rounded-xl bg-gym-primary/10 flex items-center justify-center shrink-0 text-gym-primary">
                        <Icon size={22} />
                      </div>
                      <div>
                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{info.title}</h4>
                        <p className="text-white text-[15px] font-semibold leading-relaxed">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#1e1e24] p-6 md:p-8 rounded-2xl border border-gray-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <Clock className="text-gym-primary" size={24} />
                <h3 className="text-xl font-bold text-white tracking-wide">Jam Operasional</h3>
              </div>
              <ul className="space-y-4">
                {operasional.map((op, idx) => (
                  <li key={idx} className="flex justify-between items-center text-[15px] leading-relaxed">
                    <span className="text-gray-300 font-medium">{op.hari}</span>
                    <span className="text-gym-primary font-bold">{op.jam}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Map Embed / Google Maps Iframe */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="bg-[#1e1e24] border border-gray-800 rounded-3xl p-2 h-[450px] relative overflow-hidden group hover:border-[#F97316] shadow-xl">
              <iframe
                title="Lokasi Predator Gym"
                src="https://maps.google.com/maps?q=Predator%20Gym%20Jalan%20Pasir%20Randu%20No.10%20Kadu%20Curug%20Kabupaten%20Tangerang&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full rounded-2xl border-0 pointer-events-none"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Predator+Gym+Jalan+Pasir+Randu+No.10+Kadu+Curug+Kabupaten+Tangerang+Banten+15810"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-30 cursor-pointer flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors"
                title="Klik untuk membuka petunjuk arah di Google Maps"
              >
                <div className="bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#F97316] text-white text-xs font-bold tracking-wide shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <span>📍 Buka Petunjuk Arah di Google Maps</span>
                  <ExternalLink size={12} className="text-[#F97316]" />
                </div>
              </a>
            </div>
            
            <div className="flex justify-end">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Predator+Gym+Jalan+Pasir+Randu+No.10+Kadu+Curug+Kabupaten+Tangerang+Banten+15810" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  variant="primary" 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 border-transparent shadow-none hover:scale-105 text-xs font-bold tracking-wider uppercase flex items-center gap-2 px-5 py-3 rounded-xl cursor-pointer"
                >
                  Buka di Google Maps
                  <ExternalLink size={14} />
                </Button>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

