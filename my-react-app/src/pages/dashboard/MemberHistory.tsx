'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ShieldCheck, User, Mail, AlertCircle, CheckCircle2, ChevronRight, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Plan {
  id: number;
  name: string;
  price: number;
  duration_months: number;
}

interface Trainer {
  id: number;
  name: string;
  specialization: string;
}

interface Subscription {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  plan: Plan;
  trainer?: Trainer | null;
  gross_amount?: number | string;
  trainer_fee?: number | string;
}

export default function MembershipHistory() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const loadHistoryData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Load user profile
      const userRes = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/member/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (userRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const userData = await userRes.json();
      if (userData.success) {
        setProfile(userData.user);
      }

      // Load all subscriptions (history)
      const subRes = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/member/subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      const subData = await subRes.json();
      if (subData.success) {
        // Filter out pending subscriptions so only active/expired/cancelled ones are shown in Member History
        const filtered = subData.subscriptions.filter(
          (sub: Subscription) => sub.status.toLowerCase() !== 'pending'
        );
        setSubscriptions(filtered);
      } else {
        setError('Gagal mengambil data riwayat membership.');
      }
    } catch (err) {
      setError('Koneksi ke backend gagal. Pastikan server Laravel berjalan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadHistoryData();
  }, [navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute left-3"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Aktif
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs font-bold uppercase tracking-wider">
            Expired
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-600/10 text-gray-400 text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-[#0B0F19]"></div>;
  }

  return (
    <div className="pt-28 pb-24 bg-[#0B0F19] min-h-screen text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-[-10%] w-[350px] h-[350px] bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              to="/dashboard/member" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F97316] font-semibold text-sm mb-3 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1" />
              Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase flex items-center gap-3">
              Riwayat <span className="text-[#F97316]">Membership</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Lihat dan lacak seluruh riwayat transaksi keanggotaan Predator Gym Anda.</p>
          </div>

          {profile && (
            <div className="bg-[#1e1e24]/60 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-gray-800 flex items-center gap-4.5">
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[#F97316]">
                <User size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{profile.name}</h4>
                <span className="text-xs text-gray-400">{profile.email}</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-red-400 text-sm mb-8">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Membership History Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#1e1e24]/40 h-28 w-full rounded-2xl border border-gray-800/60"></div>
            ))}
          </div>
        ) : subscriptions.length > 0 ? (
          <div className="space-y-6">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-800/80 bg-[#1e1e24]/40 backdrop-blur-md shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 bg-[#151922]/60 text-gray-400 text-xs font-black uppercase tracking-wider">
                    <th className="px-6 py-5">Paket Layanan</th>
                    <th className="px-6 py-5">Durasi</th>
                    <th className="px-6 py-5">Masa Aktif</th>
                    <th className="px-6 py-5">Harga & Pelatih</th>
                    <th className="px-6 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-800/20 group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-orange-600 flex items-center justify-center text-white font-extrabold text-sm shadow-[0_4px_12px_rgba(249,115,22,0.2)]">
                            {sub.plan.duration_months}M
                          </div>
                          <div>
                            <span className="font-extrabold text-white group-hover:text-[#F97316] uppercase tracking-wider block">
                              {sub.plan.name}
                            </span>
                            <span className="text-gray-500 text-xs mt-0.5 block">ID Transaksi: #MS-{sub.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-gray-300 font-bold text-sm">{sub.plan.duration_months} Bulan</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <span className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                            <Calendar size={13} className="text-gray-500" />
                            {new Date(sub.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-gray-500 block pl-5">
                            sampai {new Date(sub.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <span className="text-[#F97316] font-extrabold text-[15px]">
                            {formatPrice(sub.gross_amount && parseFloat(sub.gross_amount as string) > 0 ? parseFloat(sub.gross_amount as string) : sub.plan.price)}
                          </span>
                          {sub.trainer ? (
                            <div className="space-y-0.5">
                              <span className="text-xs text-gray-400 block font-medium">
                                Pelatih: {sub.trainer.name}
                              </span>
                              {sub.trainer_fee && parseFloat(sub.trainer_fee as string) > 0 && (
                                <span className="text-[10px] text-gray-500 block font-bold">
                                  (Inc. PT: {formatPrice(parseFloat(sub.trainer_fee as string))})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 block">Tanpa Personal Trainer</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        {getStatusBadge(sub.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List Card View */}
            <div className="md:hidden space-y-4">
              {subscriptions.map((sub) => (
                <div 
                  key={sub.id} 
                  className="bg-[#1e1e24]/60 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 shadow-lg space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F97316] to-orange-600 flex items-center justify-center text-white font-extrabold text-sm">
                        {sub.plan.duration_months}M
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">{sub.plan.name}</h3>
                        <span className="text-gray-500 text-xs">#MS-{sub.id}</span>
                      </div>
                    </div>
                    {getStatusBadge(sub.status)}
                  </div>

                  <div className="border-t border-gray-800/60 pt-3.5 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 font-bold block mb-1">DURASI</span>
                      <span className="text-gray-300 font-bold">{sub.plan.duration_months} Bulan</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block mb-1">TOTAL HARGA</span>
                      <span className="text-[#F97316] font-black block">
                        {formatPrice(sub.gross_amount && parseFloat(sub.gross_amount as string) > 0 ? parseFloat(sub.gross_amount as string) : sub.plan.price)}
                      </span>
                      {sub.trainer_fee && parseFloat(sub.trainer_fee as string) > 0 && (
                        <span className="text-[9px] text-gray-500 font-bold block mt-0.5">
                          (Inc. PT: {formatPrice(parseFloat(sub.trainer_fee as string))})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#151922]/50 p-3 rounded-xl border border-gray-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mulai:</span>
                      <span className="text-gray-300 font-semibold">
                        {new Date(sub.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Selesai:</span>
                      <span className="text-gray-300 font-semibold">
                        {new Date(sub.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-800/40 pt-1.5">
                      <span className="text-gray-500">Pelatih:</span>
                      <span className="text-gray-400 font-semibold">
                        {sub.trainer ? sub.trainer.name : 'Tanpa Personal Trainer'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#1e1e24]/40 border border-gray-800/80 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center text-[#F97316] mx-auto mb-6">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-white uppercase tracking-wider mb-2">Belum Ada Riwayat Membership</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
              Anda belum pernah mendaftar atau melakukan transaksi program keanggotaan di Predator Gym. Dapatkan akses penuh ke gym premium sekarang juga!
            </p>
            <Link 
              to="/membership" 
              className="inline-flex items-center gap-2 bg-[#F97316] text-white font-bold py-3.5 px-8 rounded-xl hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] cursor-pointer text-sm"
            >
              <Sparkles size={16} />
              Beli Paket Membership
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

