'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Activity, Calendar, ShieldCheck, Clock, Plus, LogOut, User, Mail, Phone, Lock, Save, Edit2, AlertCircle, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

interface Trainer {
  id: number;
  name: string;
  specialization: string;
}

interface Booking {
  id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  trainer: Trainer;
  notes?: string;
}

interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  trainer_id?: number | null;
  trainer?: Trainer | null;
  plan: {
    name: string;
    price: number;
  };
}

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Member Data States
  const [profile, setProfile] = useState<any>({
    name: 'Loading...',
    email: '',
    whatsapp: '',
    tanggal_lahir: '',
    status: 'inactive'
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [sisaHari, setSisaHari] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [membershipPlans, setMembershipPlans] = useState<any[]>([
    { name: '3 Bulan', duration_months: 3, price: 1323529, discount: 15 },
    { name: '6 Bulan', duration_months: 6, price: 2437500, discount: 20 },
    { name: '12 Bulan', duration_months: 12, price: 4852941, discount: 32 },
    { name: '18 Bulan', duration_months: 18, price: 7284375, discount: 36 },
    { name: '24 Bulan', duration_months: 24, price: 9712500, discount: 40 },
    { name: 'Basic (1 Bulan)', duration_months: 1, price: 1500000, discount: 0 }
  ]);

  // Form Inputs
  const [bookingForm, setBookingForm] = useState({ trainer_id: '', booking_date: '', booking_time: '' });
  const [paketForm, setPaketForm] = useState('1bulan');
  const [bundleTrainerChecked, setBundleTrainerChecked] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState('6 Bulan PT');
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    tanggal_lahir: '',
    password: ''
  });

  // Action Pending States
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

  const loadDashboardData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/api/member/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setSubscription(data.active_subscription);
        setSisaHari(data.sisa_hari);
        setBookings(data.bookings);
        setProfileForm({
          name: data.user.name || '',
          email: data.user.email || '',
          whatsapp: data.user.whatsapp || '',
          tanggal_lahir: data.user.tanggal_lahir || '',
          password: ''
        });
        if (data.active_subscription && data.active_subscription.trainer_id) {
          setBundleTrainerChecked(true);
          setSelectedTrainerId(data.active_subscription.trainer_id.toString());
        }
      }
    } catch (err) {
      setError('Gagal memuat data dari server.');
    }
  };

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const initLoad = async () => {
      // Parallelize the data loading to make it load much faster
      await Promise.all([
        loadDashboardData(),
        fetch('http://127.0.0.1:8000/api/trainers')
          .then(async (res) => {
            if (res.ok) {
              const trainersData = await res.json();
              setTrainers(trainersData);
              if (trainersData.length > 0) {
                setBookingForm(prev => ({ ...prev, trainer_id: trainersData[0].id.toString() }));
                setSelectedTrainerId(trainersData[0].id.toString());
              }
            }
          })
          .catch((e) => console.error(e)),
        fetch('http://127.0.0.1:8000/api/membership-plans')
          .then(async (res) => {
            if (res.ok) {
              const plansData = await res.json();
              if (plansData.success && plansData.plans && plansData.plans.length > 0) {
                setMembershipPlans(plansData.plans);
              }
            }
          })
          .catch((e) => console.error("Error fetching dynamic plans on member dashboard:", e))
      ]);

      // Pre-fill from pending_subscription chosen on public membership page
      const pending = localStorage.getItem('pending_subscription');
      if (pending) {
        try {
          const parsed = JSON.parse(pending);
          setPaketForm(parsed.paket || '6Ref6bulan');
          if (parsed.withPT && parsed.trainer_id) {
            setBundleTrainerChecked(true);
            setSelectedTrainerId(parsed.trainer_id.toString());
          } else {
            setBundleTrainerChecked(false);
          }
          localStorage.removeItem('pending_subscription');
          showNotification(`Melanjutkan pilihan paket Anda: ${
            parsed.paket === '6Ref6bulan' || parsed.paket === '6bulan' ? '6 Bulan' : 
            parsed.paket === '12Ref12bulan' || parsed.paket === '12bulan' ? '12 Bulan' : 
            parsed.paket === '18Ref18bulan' || parsed.paket === '18bulan' ? '18 Bulan' :
            parsed.paket === '24Ref24bulan' || parsed.paket === '24bulan' ? '24 Bulan' :
            parsed.paket === '1bulan' ? '1 Bulan' : '3 Bulan'
          }`, 'success');
        } catch (e) {
          console.error(e);
        }
      }

      setLoading(false);
    };

    initLoad();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin log out?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      showNotification('Berhasil keluar dari portal.', 'success');
      setTimeout(() => {
        navigate('/login');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 1000);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.booking_date || !bookingForm.booking_time) return;
    setSubmittingBooking(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/member/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'Booking pelatih berhasil dikirim!', 'success');
        setBookings(prev => [data.booking, ...prev]);
        setBookingForm(prev => ({ ...prev, booking_date: '', booking_time: '' }));
        setProfile((prev: any) => ({ ...prev, /* unlimited booking */ }));
      } else {
        showNotification(data.message || 'Gagal memproses pesanan.', 'error');
      }
    } catch (err) {
      showNotification('Koneksi ke backend gagal.', 'error');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan jadwal latihan ini?')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/member/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(data.message || 'Booking berhasil dibatalkan!', 'success');
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        if (data.trainer_subscription_end_date !== undefined) {
          setProfile((prev: any) => ({ ...prev, trainer_subscription_end_date: data.trainer_subscription_end_date }));
        } else {
          setProfile((prev: any) => ({ ...prev, /* unlimited booking */ }));
        }
      } else {
        showNotification(data.message || 'Gagal membatalkan booking.', 'error');
      }
    } catch (err) {
      showNotification('Koneksi ke backend gagal.', 'error');
    }
  };

  // Redirect to Checkout page
  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pending_subscription', JSON.stringify({
      paket: paketForm,
      withPT: bundleTrainerChecked,
      sessions: selectedSessions,
      trainer_id: bundleTrainerChecked ? selectedTrainerId : null
    }));
    navigate('/checkout');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/member/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification('Profil Anda berhasil diperbarui!', 'success');
        setProfile(data.user);
        setProfileForm(prev => ({ ...prev, password: '' }));
      } else {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          showNotification(firstError[0], 'error');
        } else {
          showNotification(data.message || 'Gagal memperbarui profil.', 'error');
        }
      }
    } catch (err) {
      showNotification('Koneksi ke backend gagal.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const formatPriceForSelect = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#0B0F19]"></div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-[#0B0F19] min-h-screen text-white relative">
      {/* Toast Notification */}
      {toast.type && (
        <div className={`fixed top-24 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
          toast.type === 'success'
            ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Subscription payments are now routed through the dedicated /checkout page */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-gym-primary"></div>
          {profile ? (
            <div>
              <span className="text-gym-primary font-bold tracking-widest text-xs uppercase block mb-1">Profil Member Portal</span>
              <h1 className="text-3xl font-black tracking-wide uppercase">Profil Saya, {profile.name}!</h1>
              <p className="text-gray-400 text-sm mt-1">{profile.email} | WA: {profile.whatsapp}</p>
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              <span className="text-gym-primary font-bold tracking-widest text-xs uppercase block mb-1">Profil Member Portal</span>
              <div className="h-8 bg-gray-800 rounded-lg w-64"></div>
              <div className="h-4 bg-gray-800/60 rounded-lg w-48 mt-2"></div>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 border border-gray-700 bg-black/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 rounded-xl px-5 py-3 text-sm font-bold cursor-pointer"
          >
            <LogOut size={16} />
            Keluar Portal
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-sm mb-8">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Membership Status & PT Booking */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Membership Subscription Card */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 border-l-4 border-gym-primary pl-3">
                <h2 className="text-xl font-extrabold text-white tracking-wide">
                  Status Membership Anda
                </h2>
                <Link to="/dashboard/member/history" className="text-xs font-bold text-gym-primary hover:text-orange-400 flex items-center gap-1.5">
                  <Clock size={14} />
                  Lihat Riwayat
                </Link>
              </div>

              {loading ? (
                <div className="animate-pulse space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/40 p-5 rounded-2xl h-24"></div>
                    <div className="bg-gray-800/20 p-5 rounded-2xl h-24"></div>
                    <div className="bg-gray-800/20 p-5 rounded-2xl h-24"></div>
                  </div>
                  <div className="h-16 bg-gray-800/20 rounded-2xl"></div>
                </div>
              ) : subscription ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="bg-gym-primary/10 border border-gym-primary/20 p-5 rounded-2xl text-center md:text-left">
                      <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Paket Aktif</span>
                      <h3 className="text-xl font-extrabold text-white mt-1 uppercase">{subscription.plan.name}</h3>
                    </div>
                    <div className="text-center md:text-left">
                      <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Berlaku Mulai</span>
                      <p className="text-white font-bold mt-1 text-[15px]">
                        {new Date(subscription.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-center md:text-left">
                      <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Sisa Waktu Member</span>
                      <p className="text-gym-primary text-xl font-black mt-1">
                        {sisaHari !== null ? `${Math.round(sisaHari)} Hari` : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Bundled Trainer Info if exists */}
                  {subscription.trainer && (
                    <div className="bg-[#303038]/50 p-5 rounded-2xl border border-gray-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Bundled Personal Trainer</span>
                        <h4 className="font-extrabold text-white mt-0.5 text-base">{subscription.trainer.name}</h4>
                        <p className="text-xs text-gym-primary font-medium mt-0.5">{subscription.trainer.specialization}</p>
                      </div>
                      <span className="text-gym-primary text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-gym-primary/10 border border-gym-primary/20">
                        Active Trainer
                      </span>
                    </div>
                  )}

                  {/* Extend membership form */}
                  <div className="border-t border-gray-800 pt-6 mt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3">Perpanjang Membership Anda</h3>
                    <form onSubmit={handleRenewalSubmit} className="space-y-5 bg-[#303038]/10 p-5 rounded-2xl border border-gray-800/50">
                      <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="w-full sm:w-2/3">
                          <label className="block text-gray-400 mb-1.5 text-xs font-bold uppercase">Pilih Durasi Paket</label>
                          <select 
                            value={paketForm}
                            onChange={(e) => setPaketForm(e.target.value)}
                            className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3.5 outline-none font-medium uppercase"
                          >
                            {membershipPlans.map((plan: any) => {
                              const dbKey = `${plan.duration_months}Ref${plan.duration_months}bulan`;
                              const originalPrice = parseFloat(plan.price);
                              const discount = plan.discount || 0;
                              const finalPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
                              const discountText = discount > 0 ? ` (Hemat ${discount}%)` : '';
                              return (
                                <option key={plan.id || plan.duration_months} value={dbKey}>
                                  Perpanjang {plan.name} - {formatPriceForSelect(finalPrice)} {discountText}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        <button 
                          type="submit"
                          className="w-full sm:w-1/3 btn-primary py-3.5 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl cursor-pointer shadow-lg text-center"
                        >
                          Perpanjang
                        </button>
                      </div>

                      {/* Bundling Checkbox & Dropdown */}
                      <div className="border-t border-gray-800/60 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={bundleTrainerChecked}
                            onChange={(e) => setBundleTrainerChecked(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-700 bg-[#303038] text-gym-primary focus:ring-0 focus:ring-offset-0 accent-orange-500 cursor-pointer"
                          />
                          <span className="text-sm font-semibold text-white">Bundling dengan Personal Trainer</span>
                        </label>

                        {bundleTrainerChecked && (
                          <div className="mt-3.5 space-y-3.5">
                            <div>
                              <label className="block text-gray-400 mb-1.5 text-xs font-bold uppercase">Pilih Paket PT</label>
                              <select 
                                value={selectedSessions}
                                onChange={(e) => setSelectedSessions(e.target.value)}
                                className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3 outline-none font-semibold"
                              >
                                <option value="1 Bulan PT">1 Bulan PT (Rp 500.000)</option>
                                <option value="3 Bulan PT">3 Bulan PT (Rp 1.500.000)</option>
                                <option value="6 Bulan PT">6 Bulan PT (Rp 3.000.000)</option>
                                <option value="12 Bulan PT">12 Bulan PT (Rp 6.000.000)</option>
                                
                                
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-gray-400 mb-1.5 text-xs font-bold uppercase">Pilih Personal Trainer Anda</label>
                              <select 
                                value={selectedTrainerId}
                                onChange={(e) => setSelectedTrainerId(e.target.value)}
                                className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3 outline-none"
                              >
                                {trainers.map(t => (
                                  <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/20 border border-gray-800 p-6 rounded-2xl">
                  <p className="text-gray-400 mb-5 text-sm text-center">Anda belum memiliki paket membership aktif saat ini. Aktifkan paket Anda di bawah:</p>
                  
                  <form onSubmit={handleRenewalSubmit} className="space-y-5 bg-[#303038]/10 p-5 rounded-2xl border border-gray-800/50">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                      <div className="w-full sm:w-2/3 text-left">
                        <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Pilih Paket Membership</label>
                        <select 
                          value={paketForm}
                          onChange={(e) => setPaketForm(e.target.value)}
                          className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3.5 outline-none font-semibold uppercase"
                        >
                          {membershipPlans.map((plan: any) => {
                            const dbKey = `${plan.duration_months}Ref${plan.duration_months}bulan`;
                            const originalPrice = parseFloat(plan.price);
                            const discount = plan.discount || 0;
                            const finalPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
                            const discountText = discount > 0 ? ` (Hemat ${discount}%)` : '';
                            return (
                              <option key={plan.id || plan.duration_months} value={dbKey}>
                                {plan.name} - {formatPriceForSelect(finalPrice)} {discountText}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full sm:w-1/3 btn-primary py-3.5 text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl cursor-pointer"
                      >
                        Aktifkan Paket
                      </button>
                    </div>

                    {/* Bundling Checkbox & Dropdown */}
                    <div className="border-t border-gray-800/60 pt-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={bundleTrainerChecked}
                          onChange={(e) => setBundleTrainerChecked(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-700 bg-[#303038] text-gym-primary focus:ring-0 focus:ring-offset-0 accent-orange-500 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-white">Bundling dengan Personal Trainer</span>
                      </label>

                      {bundleTrainerChecked && (
                        <div className="mt-3.5 space-y-3.5">
                          <div>
                            <label className="block text-gray-400 mb-1.5 text-xs font-bold uppercase">Pilih Paket PT</label>
                            <select 
                              value={selectedSessions}
                              onChange={(e) => setSelectedSessions(e.target.value)}
                              className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3 outline-none font-semibold"
                            >
                              <option value="1 Bulan PT">1 Bulan PT (Rp 500.000)</option>
                              <option value="3 Bulan PT">3 Bulan PT (Rp 1.500.000)</option>
                              <option value="6 Bulan PT">6 Bulan PT (Rp 3.000.000)</option>
                              <option value="12 Bulan PT">12 Bulan PT (Rp 6.000.000)</option>
                              
                              
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-gray-400 mb-1.5 text-xs font-bold uppercase">Pilih Personal Trainer Anda</label>
                            <select 
                              value={selectedTrainerId}
                              onChange={(e) => setSelectedTrainerId(e.target.value)}
                              className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3 outline-none"
                            >
                              {trainers.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Booking Personal Trainer Card */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden mt-8">
              <h2 className="text-xl font-extrabold text-white mb-6 tracking-wide border-l-4 border-gym-primary pl-3">
                Booking Personal Trainer
              </h2>
              
              <div className="bg-[#303038]/50 p-5 rounded-2xl border border-gray-800/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Status Paket PT</span>
                  <div className="flex items-center gap-4 mt-0.5">
                    <h4 className="font-extrabold text-white text-2xl">{profile?.trainer_subscription_end_date ? 'Aktif' : 'Tidak Aktif'}</h4>
                    {profile?.trainer_subscription_end_date && new Date(profile.trainer_subscription_end_date) > new Date() && (
                      <button 
                        onClick={() => navigate('/checkout?type=pt')}
                        className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-500 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        + Beli Paket PT
                      </button>
                    )}
                  </div>
                </div>
                <Activity size={32} className="text-gym-primary opacity-50 hidden sm:block" />
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (profile?.trainer_subscription_end_date && new Date(profile.trainer_subscription_end_date) > new Date()) {
                    handleBookingSubmit(e as any);
                  } else {
                    navigate('/checkout?type=pt');
                  }
                }} 
                className="space-y-5"
              >
                {profile?.trainer_subscription_end_date && new Date(profile.trainer_subscription_end_date) > new Date() ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Pilih Pelatih</label>
                      <select 
                        required
                        value={bookingForm.trainer_id}
                        onChange={(e) => setBookingForm({...bookingForm, trainer_id: e.target.value})}
                        className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3 outline-none"
                      >
                        <option value="">-- Pilih --</option>
                        {trainers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Tanggal Booking</label>
                      <input 
                        type="date"
                        required
                        value={bookingForm.booking_date}
                        onChange={(e) => setBookingForm({...bookingForm, booking_date: e.target.value})}
                        className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3 outline-none [color-scheme:dark]"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Jam Latihan</label>
                      <input 
                        type="time"
                        required
                        value={bookingForm.booking_time}
                        onChange={(e) => setBookingForm({...bookingForm, booking_time: e.target.value})}
                        className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-4 py-3 outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 text-sm text-center font-semibold space-y-2">
                    <div className="text-base font-extrabold uppercase tracking-wide">Paket PT Belum Aktif</div>
                    <div className="text-xs font-medium opacity-80 max-w-md mx-auto">
                      Masa aktif PT Anda telah habis atau belum aktif. Beli paket PT terlebih dahulu untuk melakukan booking jadwal latihan dengan pelatih (Personal Trainer) pilihan Anda.
                    </div>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={submittingBooking || (profile?.trainer_subscription_end_date && new Date(profile.trainer_subscription_end_date) > new Date() && (!bookingForm.trainer_id || !bookingForm.booking_date || !bookingForm.booking_time))}
                  className="w-full btn-primary py-3.5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 border-transparent shadow-none hover:scale-100 flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  {profile?.trainer_subscription_end_date && new Date(profile.trainer_subscription_end_date) > new Date() 
                    ? (submittingBooking ? 'Memproses...' : 'Booking Sekarang')
                    : 'Lanjutkan Pembayaran Paket PT'}
                </button>
              </form>
            </div>

            {/* Jadwal & Catatan Latihan Latihan Card */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden mt-8">
              <h2 className="text-xl font-extrabold text-white mb-6 tracking-wide border-l-4 border-gym-primary pl-3 flex items-center justify-between">
                <span>Jadwal & Catatan Latihan</span>
                <span className="text-[10px] bg-gray-800 text-gray-400 font-black uppercase px-2.5 py-1 rounded-full">{bookings.length} Sesi</span>
              </h2>

              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {bookings.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs font-semibold">
                    Belum ada riwayat jadwal latihan dengan Personal Trainer.
                  </div>
                ) : (
                  bookings.map((booking: any) => (
                    <div 
                      key={booking.id} 
                      className="bg-[#303038]/40 border border-gray-800/80 p-4.5 rounded-2xl space-y-3 transition-all hover:bg-[#303038]/60"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="font-extrabold text-sm text-white block">
                            Coach {booking.trainer?.name || 'Personal Trainer'}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {booking.trainer?.specialization || 'Fitness Coach'}
                          </span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                          booking.status === 'pending' && 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        } ${
                          booking.status === 'approved' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        } ${
                          booking.status === 'completed' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        } ${
                          booking.status === 'cancelled' && 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {booking.status === 'pending' && 'Menunggu'}
                          {booking.status === 'approved' && 'Disetujui'}
                          {booking.status === 'completed' && 'Selesai'}
                          {booking.status === 'cancelled' && 'Batal/Ditolak'}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-800/50 pt-2.5">
                        <div className="flex items-center gap-4 text-[10px] text-gray-300">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-gym-primary" />
                            {new Date(booking.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-gym-primary" />
                            {booking.booking_time}
                          </span>
                        </div>

                        {(booking.status === 'pending' || booking.status === 'approved') && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-[9px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/25 px-2.5 py-1 rounded-lg transition-all cursor-pointer self-start sm:self-auto"
                          >
                            Batalkan
                          </button>
                        )}
                      </div>

                      {/* Display Trainer Workout Notes if Completed and notes exist */}
                      {booking.status === 'completed' && (
                        <div className="mt-3 bg-blue-500/5 border border-blue-500/15 rounded-xl p-3.5 space-y-1.5">
                          <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider block flex items-center gap-1">
                            <FileText size={10} /> Catatan Latihan / Workout Log:
                          </span>
                          <p className="text-[11px] text-gray-300 leading-relaxed italic whitespace-pre-line">
                            {booking.notes || 'Tidak ada catatan latihan spesifik untuk sesi ini.'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
          
          {/* RIGHT COLUMN: Edit Profile Form */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Edit Profil Card */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-extrabold text-white mb-6 tracking-wide border-l-4 border-gym-primary pl-3 flex items-center gap-2">
                <Edit2 size={18} className="text-gym-primary" />
                Edit Profil Saya
              </h2>

              {loading ? (
                <div className="animate-pulse space-y-5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-800/40 rounded w-24"></div>
                      <div className="h-11 bg-gray-800/20 rounded-xl w-full"></div>
                    </div>
                  ))}
                  <div className="h-12 bg-gray-800/30 rounded-xl w-full mt-6"></div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Nama Lengkap */}
                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <User size={16} />
                    </div>
                    <input 
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Mail size={16} />
                    </div>
                    <input 
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Nomor WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Phone size={16} />
                    </div>
                    <input 
                      type="tel"
                      value={profileForm.whatsapp}
                      onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                      className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none"
                      placeholder="0812XXXXXXXX"
                    />
                  </div>
                </div>

                {/* Tanggal Lahir */}
                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Tanggal Lahir</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Calendar size={16} />
                    </div>
                    <input 
                      type="date"
                      value={profileForm.tanggal_lahir}
                      onChange={(e) => setProfileForm({ ...profileForm, tanggal_lahir: e.target.value })}
                      className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Password Baru */}
                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Password Baru (Opsional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Lock size={16} />
                    </div>
                    <input 
                      type="password"
                      value={profileForm.password}
                      onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                      className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none"
                      placeholder="Kosongkan jika tidak diubah"
                      minLength={6}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={updatingProfile}
                  className="w-full btn-primary py-3.5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 border-transparent shadow-none hover:scale-100 flex items-center justify-center gap-2 rounded-xl cursor-pointer"
                >
                  <Save size={16} />
                  {updatingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}




