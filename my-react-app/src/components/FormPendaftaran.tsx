'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Dumbbell, User, Phone, Mail, Calendar, ChevronDown } from 'lucide-react';

const FormPendaftaran: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([
    { name: '3 Bulan', duration_months: 3, price: 1125000, discount: 15 },
    { name: '6 Bulan', duration_months: 6, price: 1950000, discount: 20 },
    { name: '12 Bulan', duration_months: 12, price: 3300000, discount: 32 },
    { name: '18 Bulan', duration_months: 18, price: 4662000, discount: 36 },
    { name: '24 Bulan', duration_months: 24, price: 5827500, discount: 40 }
  ]);

  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    email: '',
    tanggalLahir: '',
    tujuan: 'Penurunan Berat Badan',
    pelatih: '',
    paket: '6bulan'
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/membership-plans')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.plans && data.plans.length > 0) {
          setPlans(data.plans);
        }
      })
      .catch(err => console.error("Error loading dynamic plans in FormPendaftaran:", err));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Save to Laravel Backend API (Supabase)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend validation or processing error:", errorData);
      } else {
        console.log("Registration successfully saved to Supabase via Laravel!");
      }
    } catch (error) {
      // Fallback: If Laravel is offline, log error and proceed with WhatsApp anyway so user is not blocked
      console.warn("Laravel backend is offline or unreachable. Falling back to direct WhatsApp submission.", error);
    }

    const message = `Halo Predator Gym! Saya ingin mendaftar dengan detail berikut:\n\nNama: ${formData.nama}\nWA: ${formData.whatsapp}\nEmail: ${formData.email}\nPaket: ${formData.paket}\nTujuan: ${formData.tujuan}`;
    const waUrl = `https://wa.me/6281310760352?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="bg-[#3A3F4C] p-8 md:p-10 rounded-2xl w-full max-w-4xl mx-auto shadow-2xl font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gym-primary w-14 h-14 rounded-full flex items-center justify-center shrink-0">
          <Dumbbell className="text-white" size={28} />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-wide">
          Formulir <span className="text-gym-primary">Pendaftaran</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Nama Lengkap</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <User size={20} />
              </div>
              <input 
                type="text" 
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama Anda" 
                className="w-full bg-[#4A505F] border border-gray-600 focus:border-gym-primary text-white text-base rounded-lg pl-12 pr-4 py-3 outline-none placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Nomor WhatsApp</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Phone size={20} />
              </div>
              <input 
                type="tel" 
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder="0812-3456-7890" 
                className="w-full bg-[#4A505F] border border-gray-600 focus:border-gym-primary text-white text-base rounded-lg pl-12 pr-4 py-3 outline-none placeholder:text-gray-400"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@contoh.com" 
                className="w-full bg-[#4A505F] border border-gray-600 focus:border-gym-primary text-white text-base rounded-lg pl-12 pr-4 py-3 outline-none placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Tanggal Lahir</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Calendar size={20} />
              </div>
              <input 
                type="date" 
                name="tanggalLahir"
                value={formData.tanggalLahir}
                onChange={handleChange}
                className="w-full bg-[#4A505F] border border-gray-600 focus:border-gym-primary text-white text-base rounded-lg pl-12 pr-4 py-3 outline-none placeholder:text-gray-400 [color-scheme:dark]"
                required
              />
            </div>
          </div>
        </div>

        {/* Tujuan Utama */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Tujuan Utama</label>
          <div className="relative">
            <select 
              name="tujuan"
              value={formData.tujuan}
              onChange={handleChange}
              className="w-full bg-[#4A505F] border border-gray-600 focus:border-gym-primary text-white text-base rounded-lg pl-4 pr-10 py-3 outline-none appearance-none"
            >
              <option value="Penurunan Berat Badan">Penurunan Berat Badan</option>
              <option value="Pembentukan Otot">Pembentukan Otot</option>
              <option value="Kebugaran Umum">Kebugaran Umum</option>
              <option value="Rehabilitasi">Rehabilitasi Cedera</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Preferensi Pelatih */}
        <div>
          <label className="block text-gray-300 mb-2 font-medium">Preferensi Pelatih (Opsional)</label>
          <div className="relative">
            <select 
              name="pelatih"
              value={formData.pelatih}
              onChange={handleChange}
              className="w-full bg-[#4A505F] border border-gray-600 focus:border-gym-primary text-white text-base rounded-lg pl-4 pr-10 py-3 outline-none appearance-none"
            >
              <option value="">-- Pilih Pelatih --</option>
              <option value="Sarah">Sarah (Yoga & Flexibility)</option>
              <option value="Mike">Mike (Weight Training)</option>
              <option value="David">David (CrossFit)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        {/* Pilihan Paket */}
        <div>
          <label className="block text-gray-300 mb-4 font-medium">Pilihan Paket</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {plans.map((plan: any) => {
              const dbKey = `${plan.duration_months}bulan`;
              const refKey = `${plan.duration_months}Ref${plan.duration_months}bulan`;
              const isChecked = formData.paket === dbKey || formData.paket === refKey;
              const originalPrice = parseFloat(plan.price);
              const discount = plan.discount || 0;
              const finalPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
              const priceInK = Math.round(finalPrice / 1000);
              const discountText = discount > 0 ? ` (Diskon ${discount}%)` : '';
              
              return (
                <label key={plan.id || plan.duration_months} className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isChecked ? 'border-gym-primary bg-white/10' : 'border-gray-400 group-hover:border-gym-primary'}`}>
                    {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-gym-primary" />}
                  </div>
                  <input type="radio" name="paket" value={dbKey} checked={isChecked} onChange={handleChange} className="hidden" />
                  <span className="text-gray-200 text-xs uppercase">{plan.name} - Rp {priceInK}K{discountText}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Kirim via WhatsApp
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormPendaftaran;

