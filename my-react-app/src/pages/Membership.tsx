'use client';

import React, { useState, useEffect, useRef } from 'react';
import Button from '@/components/Button';
import { ChevronLeft, ChevronRight, Sparkles, Zap, User, Snowflake, Activity, Clipboard, Users, Home, ShieldCheck, Key, Coffee, Flame, Heart, Award, Dumbbell, DoorOpen, Droplet, Sofa, Scale, ShowerHead, Lock, Moon, CircleParking, Bike, Layers, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Trainer {
  id: number;
  name: string;
  specialization: string;
}

export default function MembershipPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasActiveSub, setHasActiveSub] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'membership' | 'fasilitas' | 'alat'>('membership');
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [isFirstTime, setIsFirstTime] = useState(true);
  interface BenefitItem {
    icon: React.ComponentType<any>;
    title: string;
    desc: string;
    badge?: string;
  }

  const tabBenefits: Record<'membership' | 'fasilitas' | 'alat', BenefitItem[]> = {
    membership: [
      { icon: Zap, title: "Member Hemat Mulai 100K*", desc: "Harga terjangkau untuk latihan kebugaran Anda!" },
      { icon: User, title: "Akses PT Fleksibel", desc: "Tersedia layanan pendampingan dari pelatih profesional kami." },
      { icon: Snowflake, title: "Fasilitas Premium", desc: "Nikmati area latihan dengan peralatan modern berkualitas." },
      { icon: Activity, title: "Personal Trainer Handal", desc: "Tersedia pelatih bersertifikat untuk program terarah Anda." },
      { icon: ShieldCheck, title: "Member Fleksibel", desc: "Berbagai pilihan durasi paket membership mulai dari 1 bulan." }
    ],
    fasilitas: [
      { icon: Users, title: "Gym Area Nyaman & AC", desc: "Latihan lebih fokus dengan ruangan ber-AC yang nyaman." },
      { icon: Dumbbell, title: "Functional Area", desc: "Area luas bebas untuk workout dan latihan fungsional." },
      { icon: DoorOpen, title: "Air Mineral Gratis", desc: "Tersedia air mineral gratis sepuasnya untuk hidrasi latihan Anda." },
      { icon: Droplet, title: "Kopi & Teh Gratis", desc: "Nikmati kopi atau teh hangat gratis sebelum atau setelah latihan." },
      { icon: Scale, title: "Cek Komposisi Tubuh", desc: "Pantau kadar lemak & massa otot Anda secara berkala." },
      { icon: ShowerHead, title: "Kamar Mandi Bersih", desc: "Fasilitas kamar mandi yang bersih dan nyaman." },
      { icon: Lock, title: "Loker Aman & Praktis", desc: "Simpan barang bawaan Anda di loker yang disediakan selama latihan." },
      { icon: Moon, title: "Mushola Nyaman", desc: "Tetap bisa ibadah dengan tenang di mushola yang tersedia." },
      { icon: CircleParking, title: "Parkiran Luas", desc: "Parkir motor atau mobil yang luas, aman, dan mudah." }
    ],
    alat: [
      { icon: Dumbbell, title: "Gym Machine", desc: "Smith Machine, Leg Press, Leg Extension, Leg Curl, Abductor, Adductor, Super Squat, Pec Fly, Pec Deck, Chest Press, Power Rack, Adjusted Pulley, Pulldown, Row, Bicep Curl, dll." },
      { icon: Dumbbell, title: "Free Weight", desc: "Pilihan beban lengkap banget mulai dari Dumbbell, Barbell, Kettlebell, sampai Plates." },
      { icon: Bike, title: "Cardio Zone", desc: "Bakar kalori & lemak makin asyik pake Treadmill canggih & Spinning Bike modern." },
      { icon: Dumbbell, title: "Lifting Bar", desc: "Macem-macem bar khusus latihan beban: ada Olympic Bar, EZ Curl Bar, hingga Hex Bar." },
      { icon: Layers, title: "Mattress", desc: "Yoga mat premium anti-slip yang nyaman banget buat lo stretching atau core training." },
      { icon: MoreHorizontal, title: "Lain-lain", desc: "Biar gak bosen: ada Bosu Ball, Medicine/Slam/Stability Ball, TRX, VIPR, Battle Rope, Resistance Band, & lainnya." }
    ]
  };

  const iconMap: Record<string, React.ComponentType<any>> = {
    Zap, User, Snowflake, Activity, ShieldCheck, Users, Dumbbell, DoorOpen,
    Droplet, Sofa, Scale, ShowerHead, Lock, Moon, CircleParking, Bike, Layers,
    MoreHorizontal
  };

  const [dynamicFasilitas, setDynamicFasilitas] = useState<BenefitItem[]>(tabBenefits.fasilitas);
  const [dynamicAlat, setDynamicAlat] = useState<BenefitItem[]>(tabBenefits.alat);

  const defaultPlans = [
    {
      name: "1 bulan",
      dbKey: "1bulan",
      pricePerMonth: 100000,
      originalTotal: 100000,
      promoTotal: 100000,
      discount: 0,
      popular: false,
      bonus: "Latihan Mandiri Lengkap"
    },
    {
      name: "3 bulan",
      dbKey: "3bulan",
      pricePerMonth: 100000,
      originalTotal: 300000,
      promoTotal: 300000,
      discount: 0,
      popular: false,
      bonus: "Latihan Mandiri Lengkap"
    },
    {
      name: "6 bulan",
      dbKey: "6bulan",
      pricePerMonth: 100000,
      originalTotal: 600000,
      promoTotal: 600000,
      discount: 0,
      popular: false,
      bonus: "Latihan Mandiri Lengkap"
    },
    {
      name: "12 bulan",
      dbKey: "12bulan",
      pricePerMonth: 100000,
      originalTotal: 1200000,
      promoTotal: 1200000,
      discount: 0,
      popular: true,
      bonus: "Latihan Mandiri Lengkap"
    },
    {
      name: "18 bulan",
      dbKey: "18bulan",
      pricePerMonth: 100000,
      originalTotal: 1800000,
      promoTotal: 1800000,
      discount: 0,
      popular: false,
      bonus: "Latihan Mandiri Lengkap"
    },
    {
      name: "24 bulan",
      dbKey: "24bulan",
      pricePerMonth: 100000,
      originalTotal: 2400000,
      promoTotal: 2400000,
      discount: 0,
      popular: false,
      bonus: "Latihan Mandiri Lengkap"
    }
  ];

  const [plans, setPlans] = useState<any[]>(defaultPlans);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      fetch('http://127.0.0.1:8000/api/member/checkout-data', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsFirstTime(data.is_first_time_member);
          if (data.active_subscription) {
            setHasActiveSub(true);
          }
        }
      })
      .catch(err => console.error(err));
    }

    // Fetch dynamic membership plans
    fetch('http://127.0.0.1:8000/api/membership-plans')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.plans && data.plans.length > 0) {
          const mappedPlans = data.plans.map((plan: any) => {
            const originalTotal = parseFloat(plan.price);
            const discount = plan.discount || 0;
            const promoTotal = discount > 0 ? Math.round(originalTotal * (1 - discount / 100)) : originalTotal;
            
            return {
              id: plan.id,
              name: plan.name.toLowerCase().includes('bulan') ? plan.name : `${plan.name} (${plan.duration_months} bulan)`,
              dbKey: `${plan.duration_months}bulan`,
              pricePerMonth: Math.round(promoTotal / plan.duration_months),
              originalTotal: originalTotal,
              promoTotal: promoTotal,
              discount: discount,
              popular: plan.duration_months === 12,
              bonus: plan.description || "Latihan Mandiri Lengkap"
            };
          });
          setPlans(mappedPlans);
        }
      })
      .catch(err => console.error("Error fetching dynamic plans:", err));

    // Fetch dynamic gym features
    fetch('http://127.0.0.1:8000/api/gym-features')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.features && data.features.length > 0) {
          const facilities = data.features
            .filter((f: any) => f.type === 'facility')
            .map((f: any) => ({
              icon: iconMap[f.icon] || Dumbbell,
              title: f.name,
              desc: f.description || '',
              badge: f.badge || undefined
            }));
          const equipments = data.features
            .filter((f: any) => f.type === 'equipment')
            .map((f: any) => ({
              icon: iconMap[f.icon] || Dumbbell,
              title: f.name,
              desc: f.description || '',
              badge: f.badge || undefined
            }));
          if (facilities.length > 0) setDynamicFasilitas(facilities);
          if (equipments.length > 0) setDynamicAlat(equipments);
        }
      })
      .catch(err => console.error("Error fetching gym features:", err));
  }, []);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })
      .format(value)
      .replace(/\s?/g, ''); // remove spacing for exact match
  };

  const handleSelectPlan = (planDbKey: string) => {
    localStorage.setItem('pending_subscription', JSON.stringify({
      paket: planDbKey,
      withPT: false,
      trainer_id: null
    }));
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -339, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 339, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-28 pb-20 md:pt-40 md:pb-28 bg-[#0B0F19] min-h-screen text-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Glow highlight behind slider */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10 flex flex-col items-center">
        
        {/* Interactive Membership Duration Selector */}
        <div className="w-full max-w-[650px] bg-[#0E1322]/90 border border-gray-800/80 rounded-[32px] p-6 md:p-8 backdrop-blur-md relative z-10 shadow-2xl space-y-6 flex flex-col items-center">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-xs font-black text-[#F97316] uppercase tracking-wider">
              <Sparkles size={14} />
              Pilih Durasi Membership Anda
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white">Predator Gym Membership</h2>
            <p className="text-gray-400 text-xs md:text-sm max-w-md mx-auto">
              Latihan kapan saja secara unlimited. Biaya berlangganan normal adalah <span className="text-white font-bold">Rp 100.000 / bulan</span>.
            </p>
          </div>

          {/* Interactive Counter Control */}
          <div className="w-full bg-[#070A13]/95 p-6 rounded-2xl border border-gray-800/80 flex flex-col items-center space-y-4">
            <span className="text-xs text-gray-500 uppercase font-black tracking-widest">Durasi Latihan</span>
            
            <div className="flex items-center gap-6">
              {/* Decrease Button */}
              <button 
                type="button"
                onClick={() => setSelectedMonths(prev => Math.max(1, prev - 1))}
                className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 flex items-center justify-center text-xl font-bold cursor-pointer transition-all active:scale-90"
              >
                -
              </button>
              
              {/* Display Number of Months */}
              <div className="text-center w-24 select-none">
                <span className="text-4xl font-black text-white block tracking-tight">{selectedMonths}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mt-1">Bulan</span>
              </div>
              
              {/* Increase Button */}
              <button 
                type="button"
                onClick={() => setSelectedMonths(prev => Math.min(24, prev + 1))}
                className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 flex items-center justify-center text-xl font-bold cursor-pointer transition-all active:scale-90"
              >
                +
              </button>
            </div>

          </div>

          {/* Pricing Summary Receipt */}
          <div className="w-full space-y-4 border-t border-gray-800/80 pt-6">
            <div className="flex justify-between text-xs md:text-sm text-gray-400">
              <span>Biaya Keanggotaan ({selectedMonths} Bulan):</span>
              <span className="font-bold text-white font-mono">{formatPrice(selectedMonths * 100000)}</span>
            </div>
            
            {isFirstTime ? (
              <div className="flex justify-between text-xs md:text-sm text-orange-400">
                <div className="flex items-center gap-1.5">
                  <span>Biaya Pendaftaran (Awal Saja):</span>
                  <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                    Baru
                  </span>
                </div>
                <span className="font-bold font-mono">{formatPrice(20000)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-xs md:text-sm text-gray-500">
                <span>Biaya Pendaftaran:</span>
                <span className="font-mono">Rp 0 (Bukan Member Baru)</span>
              </div>
            )}

            {/* Dynamic Bonus PT Badge */}
            <div className="bg-gray-900/50 border border-gray-800/80 p-4 rounded-2xl flex items-center justify-between text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#F97316]" />
                <div>
                  <span className="text-[9px] text-[#F97316] uppercase font-black block tracking-wider">Bonus Hak Istimewa</span>
                  <span className="font-bold text-white">
                    {"Akses Latihan Mandiri Lengkap"}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="flex justify-between items-baseline border-t border-gray-800/80 pt-5">
              <span className="text-sm font-bold text-white uppercase tracking-wider">Total Tagihan:</span>
              <span className="text-2xl md:text-3xl font-black text-[#F97316] tracking-tight font-mono">
                {formatPrice((selectedMonths * 100000) + (isFirstTime ? 20000 : 0))}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="w-full pt-2">
            {hasActiveSub ? (
              <Link to="/dashboard/member" className="w-full block">
                <Button 
                  variant="primary"
                  className="w-full py-4 text-sm md:text-base font-black uppercase tracking-wider rounded-2xl cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_4px_25px_rgba(249,115,22,0.25)] hover:scale-100 hover:opacity-95 text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Perpanjang Melalui Dashboard
                </Button>
              </Link>
            ) : (
              <Link 
                to={isLoggedIn ? "/checkout" : "/login?redirect=/checkout"} 
                className="w-full block" 
                onClick={() => handleSelectPlan(`${selectedMonths}bulan`)}
              >
                <Button 
                  variant="primary"
                  className="w-full py-4 text-sm md:text-base font-black uppercase tracking-wider rounded-2xl cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 shadow-[0_4px_25px_rgba(249,115,22,0.25)] hover:scale-100 hover:opacity-95 text-white flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  Daftar Membership Sekarang
                </Button>
              </Link>
            )}
            {isFirstTime && (
              <span className="text-[10px] text-gray-500 italic block text-center mt-2.5">
                * Biaya tambahan Rp 20.000 hanya dikenakan untuk pendaftaran awal member baru.
              </span>
            )}
          </div>

        </div>

        {/* Our Gym Benefits Title */}
        <div className="text-center mt-20 mb-8 relative z-10 w-full max-w-[1240px]">
          <h2 
            className="text-[22px] leading-[28px] tracking-[-0.4px] text-white uppercase block text-center"
            style={{ fontWeight: 650, fontFamily: 'var(--font-sans)' }}
          >
            Our Gym Benefits
          </h2>
        </div>

        {/* Outer Tab & Content Wrapper */}
        <div className="w-full max-w-[1240px] bg-[#0E1322]/90 border border-gray-800/80 rounded-[24px] p-6 backdrop-blur-md relative z-10 mb-10 flex flex-col items-center shadow-2xl">
          
          {/* Navigation Tab Bar */}
          <div className="flex flex-wrap justify-center items-center gap-1 bg-[#070A13]/95 p-1 rounded-xl border border-gray-800/80 mb-6 w-fit mx-auto">
            <button
              onClick={() => setActiveTab('membership')}
              className={`font-bold py-2 px-5 rounded-lg text-xs md:text-sm cursor-pointer ${
                activeTab === 'membership'
                  ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/20'
              }`}
            >
              Membership
            </button>
            <button
              onClick={() => setActiveTab('fasilitas')}
              className={`font-bold py-2 px-5 rounded-lg text-xs md:text-sm cursor-pointer ${
                activeTab === 'fasilitas'
                  ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/20'
              }`}
            >
              Fasilitas
            </button>
            <button
              onClick={() => setActiveTab('alat')}
              className={`font-bold py-2 px-5 rounded-lg text-xs md:text-sm cursor-pointer ${
                activeTab === 'alat'
                  ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/20'
              }`}
            >
              Alat Gym
            </button>
          </div>

          {/* Benefit Grid Items - Unified Gapless Border Layout */}
          <div className={`w-full bg-gray-850/80 gap-[1px] grid grid-cols-1 sm:grid-cols-2 ${
            activeTab === 'alat' ? 'lg:grid-cols-3' : 'lg:grid-cols-5'
          } rounded-[16px] overflow-hidden border border-gray-800/80 shadow-lg`}>
            {(activeTab === 'membership' 
              ? tabBenefits.membership 
              : activeTab === 'fasilitas' 
              ? dynamicFasilitas 
              : dynamicAlat
            ).map((item, index) => {
              const BenefitIcon = item.icon;
              return (
                <div 
                  key={index} 
                  className="bg-[#0f1624] p-5 flex flex-col justify-start hover:bg-[#141d30] group min-h-[145px] h-full"
                >
                  {/* Icon & Badge Row */}
                  <div className="flex justify-between items-center w-full mb-3.5">
                    <BenefitIcon className="text-[#F97316] group-hover:scale-105" size={18} />
                    {item.badge && (
                      <span className="bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Text Container */}
                  <div className="flex flex-col flex-grow">
                    {/* Title */}
                    <h4 
                      className="text-[14px] md:text-[15px] mb-1 text-white leading-snug tracking-wide text-left group-hover:text-[#F97316]"
                      style={{ fontWeight: 650 }}
                    >
                      {item.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-[11px] md:text-[12px] text-gray-400 leading-normal font-medium text-left">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer policy text */}
          <div className="w-full border-t border-gray-855 mt-6 pt-3">
            <span className="text-[10px] text-gray-500 italic block text-left">
              {activeTab === 'membership' 
                ? "* Mengikuti kebijakan dan proses review yang berlaku di Predator Gym" 
                : activeTab === 'fasilitas'
                ? "* Ketersediaan bervariasi sesuai kapasitas gym"
                : "* Spesifikasi alat dapat bervariasi di Predator Gym"}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}


