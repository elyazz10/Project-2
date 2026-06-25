'use client';

import React, { useState, FormEvent } from 'react';
import { User, Scale, Ruler, CheckCircle, ArrowLeft, Info, HelpCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';

export default function BMICheckerPage() {
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [genderError, setGenderError] = useState<boolean>(false);
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  
  // Calculation states
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<'Kurus' | 'Ideal' | 'Berlebih' | 'Obesitas' | ''>('');
  const [minWeight, setMinWeight] = useState<number>(0);
  const [maxWeight, setMaxWeight] = useState<number>(0);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gender validation
    if (!gender) {
      setGenderError(true);
      return;
    }
    
    const hVal = parseFloat(height);
    const wVal = parseFloat(weight);

    if (hVal > 0 && wVal > 0) {
      const hMeter = hVal < 3 ? hVal : hVal / 100;
      const calculatedBmi = wVal / (hMeter * hMeter);
      const roundedBmi = Math.round(calculatedBmi * 10) / 10;
      setBmi(roundedBmi);

      // Ideal range calculation
      const minW = Math.round(18.5 * hMeter * hMeter * 10) / 10;
      const maxW = Math.round(25.0 * hMeter * hMeter * 10) / 10;
      setMinWeight(minW);
      setMaxWeight(maxW);

      if (roundedBmi < 18.5) {
        setStatus("Kurus");
      } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
        setStatus("Ideal");
      } else if (roundedBmi >= 25 && roundedBmi < 30) {
        setStatus("Berlebih");
      } else {
        setStatus("Obesitas");
      }
    }
  };

  const resetForm = () => {
    setGender(null);
    setGenderError(false);
    setHeight('');
    setWeight('');
    setBmi(null);
    setStatus('');
  };

  // Status mapping for visual styles
  const getStatusDetails = () => {
    switch (status) {
      case 'Kurus':
        return {
          colorClass: 'bg-blue-500 text-white',
          desc: 'Berat badan Anda berada di bawah batas normal. Tingkatkan asupan kalori sehat dan diskusikan program surplus otot dengan pelatih kami.',
          position: '12.5%',
          bannerGradient: 'from-blue-600 to-blue-500'
        };
      case 'Ideal':
        return {
          colorClass: 'bg-green-500 text-white',
          desc: 'Hebat! Berat badan Anda berada dalam kategori sangat ideal. Teruskan pola makan sehat Anda dan pertahaman massa otot dengan olahraga teratur.',
          position: '37.5%',
          bannerGradient: 'from-green-600 to-green-500'
        };
      case 'Berlebih':
        return {
          colorClass: 'bg-orange-500 text-white',
          desc: 'Berat badan Anda sedikit melebihi batas ideal. Lakukan latihan defisit kalori dan olahraga kardio teratur untuk mencapai berat badan ideal kembali.',
          position: '62.5%',
          bannerGradient: 'from-orange-600 to-orange-500'
        };
      case 'Obesitas':
        return {
          colorClass: 'bg-red-500 text-white',
          desc: 'Berat badan Anda berada di tingkat obesitas yang meningkatkan risiko kesehatan. Segera konsultasikan program pemulihan lemak Anda dengan ahli kami.',
          position: '87.5%',
          bannerGradient: 'from-red-600 to-red-500'
        };
      default:
        return {
          colorClass: '',
          desc: '',
          position: '0%',
          bannerGradient: ''
        };
    }
  };

  const getRecommendationText = () => {
    if (status === 'Ideal') {
      return (
        <>
          Pertahankan berat badan Anda di rentang ideal <strong className="text-white font-bold">{minWeight} – {maxWeight} kg</strong> dengan rutin berolahraga dan mengontrol porsi makan.
        </>
      );
    } else if (status === 'Kurus') {
      return (
        <>
          Tingkatkan berat badan Anda hingga mencapai rentang ideal <strong className="text-white font-bold">{minWeight} – {maxWeight} kg</strong> melalui surplus kalori sehat dan program latihan beban.
        </>
      );
    } else {
      return (
        <>
          Targetkan untuk menurunkan berat badan Anda hingga mencapai rentang ideal <strong className="text-white font-bold">{minWeight} – {maxWeight} kg</strong> dengan latihan defisit kalori dan olahraga teratur.
        </>
      );
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <div className="pt-24 bg-[#0B0F19] min-h-screen text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <span className="text-[#F97316] font-bold tracking-widest text-xs uppercase block mb-1">Kalkulator</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-wide uppercase">BMI Checker</h1>
        <p className="text-gray-400 text-sm mt-1">ANALISIS DAN ESTIMASI KADAR BERAT BADAN IDEAL SECARA INSTAN DAN DINAMIS</p>
      </div>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT COLUMN: Tentang BMI */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#111827] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden group">
            {/* Background absolute gym image overlay (Extremely lightweight quality=30 w=500 for fast load) */}
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-15 pointer-events-none">
              <img 
                src="https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?q=30&w=500&auto=format&fit=crop" 
                alt="Gym Background"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl font-extrabold text-white tracking-wide border-l-4 border-gym-primary pl-4">
                Tentang BMI
              </h2>
              
              <p className="text-gray-300 text-[16px] leading-relaxed">
                <strong className="text-gym-primary">Body Mass Index (BMI)</strong> membantu menentukan apakah berat badan kamu ideal sesuai dengan tinggi badan.
              </p>

              <p className="text-gray-400 text-sm leading-relaxed">
                Hasilnya, dapat memberikan gambaran awal tentang kondisi tubuhmu dan menjadi dasar untuk mulai menjaga atau memperbaiki pola hidup sehat serta memperpanjang umur produktif kamu.
              </p>

              <div className="pt-4">
                <Link to="/program" className="inline-flex items-center gap-2 text-gym-primary font-bold text-sm hover:underline">
                  Lihat Selengkapnya Program Latihan
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            <div className="relative z-10 mt-12 bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-gym-primary/10 rounded-xl flex items-center justify-center shrink-0 text-gym-primary">
                <Info size={22} />
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Penting untuk dipahami bahwa BMI hanyalah alat ukur dasar dan tidak menghitung komposisi lemak internal, kepadatan tulang, atau volume air dalam otot Anda secara klinis.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Kalkulator BMI (Interactive Form / Result states) */}
          <div className="lg:col-span-7">
            <div className="bg-[#1e1e24] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col">
              
              {/* FORM STATE */}
              {bmi === null ? (
                <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-extrabold text-white tracking-wide mb-2">Kalkulator BMI</h3>
                    <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
                      Ingin tahu apakah berat badan kamu sudah ideal? Yuk, hitung BMI kamu sekarang!
                    </p>

                    <form onSubmit={calculateBMI} className="space-y-8">
                      {/* Gender Selector */}
                      <div>
                        <label className="block text-gray-300 mb-3 font-semibold text-[14px] uppercase tracking-wider">
                          * Pilih Gender
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                           {/* Laki-laki */}
                          <button 
                            type="button"
                            onClick={() => {
                              setGender('male');
                              setGenderError(false);
                            }}
                            className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer focus:outline-none w-full text-left ${
                              gender === 'male' 
                                ? 'border-gym-primary bg-gym-primary/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                                : 'border-gray-800 bg-[#303038]/50 hover:border-gray-700'
                            }`}
                          >
                            {/* Absolute Select Dot */}
                            <div className="absolute top-3 right-3">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                gender === 'male' ? 'border-gym-primary bg-gym-primary/20' : 'border-gray-500'
                              }`}>
                                {gender === 'male' && <div className="w-2 h-2 rounded-full bg-gym-primary"></div>}
                              </div>
                            </div>

                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center mb-3">
                              {/* Male avatar representation SVG */}
                              <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
                              </svg>
                            </div>
                            <span className="text-white text-sm font-bold block text-center w-full">Laki-laki</span>
                          </button>

                          {/* Perempuan */}
                          <button 
                            type="button"
                            onClick={() => {
                              setGender('female');
                              setGenderError(false);
                            }}
                            className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer focus:outline-none w-full text-left ${
                              gender === 'female' 
                                ? 'border-gym-primary bg-gym-primary/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                                : 'border-gray-800 bg-[#303038]/50 hover:border-gray-700'
                            }`}
                          >
                            {/* Absolute Select Dot */}
                            <div className="absolute top-3 right-3">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                gender === 'female' ? 'border-gym-primary bg-gym-primary/20' : 'border-gray-500'
                              }`}>
                                {gender === 'female' && <div className="w-2 h-2 rounded-full bg-gym-primary"></div>}
                              </div>
                            </div>

                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center mb-3">
                              {/* Female avatar representation SVG */}
                              <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
                              </svg>
                              <div className="absolute bottom-1 w-8 h-1 bg-gym-primary rounded-full"></div>
                            </div>
                            <span className="text-white text-sm font-bold block text-center w-full">Perempuan</span>
                          </button>
                        </div>
                        {genderError && (
                          <p className="text-red-500 text-xs mt-2 font-semibold">
                            * Silakan pilih gender terlebih dahulu
                          </p>
                        )}
                      </div>

                      {/* Tinggi Badan */}
                      <div>
                        <label className="block text-gray-300 mb-2 font-semibold text-[14px] uppercase tracking-wider">
                          * Tinggi Badan
                        </label>
                        <div className="relative">
                          <input 
                            type="number" 
                            step="any"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Contoh: 170" 
                            className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-base rounded-xl pl-5 pr-12 py-4 outline-none placeholder:text-gray-500 font-medium"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                            cm
                          </div>
                        </div>
                      </div>

                      {/* Berat Badan */}
                      <div>
                        <label className="block text-gray-300 mb-2 font-semibold text-[14px] uppercase tracking-wider">
                          * Berat Badan
                        </label>
                        <div className="relative">
                          <input 
                            type="number" 
                            step="any"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Contoh: 65" 
                            className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-base rounded-xl pl-5 pr-12 py-4 outline-none placeholder:text-gray-500 font-medium"
                            required
                          />
                          <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                            kg
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          type="submit" 
                          className="w-full btn-primary py-4.5 text-base font-extrabold border-transparent shadow-none hover:scale-100 cursor-pointer text-center block rounded-xl tracking-wider uppercase bg-gradient-to-r from-orange-500 to-orange-600"
                        >
                          Hitung BMI
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                
                /* RESULT STATE */
                <div className="p-8 md:p-10 flex-grow flex flex-col justify-between space-y-8">
                  <div>
                    {/* Header with reset */}
                    <div className="flex justify-between items-center border-b border-gray-800 pb-4 mb-6">
                      <h3 className="text-xl font-bold text-white tracking-wide">Kalkulator BMI</h3>
                      <button 
                        onClick={resetForm}
                        className="flex items-center gap-2 border border-gray-700 bg-[#303038] hover:bg-gray-800 text-white rounded-xl px-4 py-2 text-xs font-bold cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Cek Ulang
                      </button>
                    </div>

                    {/* Summary row */}
                    <div className="flex flex-wrap gap-6 text-gray-400 text-sm font-semibold mb-8 bg-[#303038]/30 px-5 py-3.5 rounded-xl border border-gray-800/50 justify-between items-center">
                      <span className="flex items-center gap-2 text-white">
                        <User className="text-gym-primary" size={18} />
                        {gender === 'male' ? 'Laki-Laki' : gender === 'female' ? 'Perempuan' : 'Gender'}
                      </span>
                      <span className="flex items-center gap-2 text-white">
                        <Ruler className="text-gym-primary" size={18} />
                        {height} cm
                      </span>
                      <span className="flex items-center gap-2 text-white">
                        <Scale className="text-gym-primary" size={18} />
                        {weight} kg
                      </span>
                    </div>

                    {/* Category Banner with fit body avatar placeholder */}
                    <div className={`relative rounded-3xl p-8 overflow-hidden bg-gradient-to-r border border-gray-800 flex justify-between items-center mb-8 shadow-xl ${statusDetails.bannerGradient}`}>
                      <div className="relative z-10 max-w-xs space-y-1">
                        <span className="text-white/80 text-xs uppercase tracking-wider font-extrabold">Berat Badan di Kategori</span>
                        <h4 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">{status}</h4>
                      </div>
                      
                      {/* Body outline SVG illustration overlay on the right */}
                      <div className="absolute right-0 bottom-0 top-0 opacity-20 pointer-events-none flex items-center pr-6">
                        <svg className="w-32 h-32 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-2 5a2 2 0 0 0-2 2v6h1.5v6h5v-6H16V9a2 2 0 0 0-2-2h-4z" />
                        </svg>
                      </div>
                    </div>

                    {/* Slider Color Bar */}
                    <div className="space-y-6 mb-8 relative">
                      <div className="flex w-full h-8 rounded-full overflow-hidden border border-gray-800 text-[10px] md:text-xs font-black uppercase text-center text-white/90">
                        <div className="w-[25%] bg-blue-500 flex items-center justify-center">Kurus</div>
                        <div className="w-[25%] bg-green-500 flex items-center justify-center">Ideal</div>
                        <div className="w-[25%] bg-orange-500 flex items-center justify-center">Berlebih</div>
                        <div className="w-[25%] bg-red-500 flex items-center justify-center">Obesitas</div>
                      </div>

                      {/* Score marker pointing under the bar */}
                      <div className="relative w-full h-10">
                        <div 
                          className="absolute flex flex-col items-center -translate-x-1/2"
                          style={{ left: statusDetails.position }}
                        >
                          {/* Triangle pointer */}
                          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gym-primary"></div>
                          {/* Value tag */}
                          <div className="bg-gym-primary text-white text-xs font-black px-3 py-1.5 rounded-lg border border-orange-400 shadow-xl mt-1 tracking-wide">
                            {bmi}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Result recommendations Box */}
                    <div className="bg-[#303038]/50 p-6 rounded-2xl border border-gray-800 space-y-4">
                      <div className="flex gap-3 items-start">
                        <CheckCircle className="text-gym-primary shrink-0 mt-1" size={20} />
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {getRecommendationText()}
                        </p>
                      </div>

                      <div className="flex gap-3 items-start border-t border-gray-800/50 pt-4">
                        <HelpCircle className="text-gym-primary shrink-0 mt-1" size={20} />
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Pastikan jumlah kadar lemak dan massa otot badan Anda ideal. Ketidakseimbangan dapat memicu penurunan metabolisme dan cedera fisik. Cek detail nutrisi Anda sekarang!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consultation / Free Trial Button */}
                  <div className="pt-6 border-t border-gray-800">
                    <Link to="/register" className="w-full block">
                      <Button variant="primary" className="w-full py-4 text-base font-extrabold uppercase tracking-widest bg-gradient-to-r from-orange-500 to-orange-600 border-transparent shadow-none hover:scale-100 flex items-center justify-center gap-2">
                        Konsultasi Gratis Sekarang
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

