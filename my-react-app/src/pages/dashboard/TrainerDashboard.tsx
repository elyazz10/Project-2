'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, CheckCircle2, Clock, Check, X, FileText, 
  MessageSquare, User as UserIcon, LogOut, Award, Star, BookOpen, Send
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  whatsapp?: string;
  trainer_subscription_end_date?: string;
}

interface Booking {
  id: number;
  user_id: number;
  trainer_id: number;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  notes?: string;
  user: User;
  created_at: string;
}

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState<any>(null);
  const [stats, setStats] = useState({
    total_members: 0,
    pending_bookings: 0,
    approved_bookings: 0,
    completed_bookings: 0
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'members'>('overview');
  
  // Modal State for Completing Booking with Workout Notes
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    const userObj = JSON.parse(storedUser);
    if (userObj.role !== 'trainer') {
      navigate('/login');
      return;
    }

    setTrainer(userObj);
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token: string) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/trainer/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
        setBookings(data.bookings || []);
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Failed to load trainer dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: number, status: 'approved' | 'cancelled' | 'completed', notes?: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/trainer/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Refresh local dashboard data
        fetchDashboardData(token);
        
        // Reset states
        setSelectedBooking(null);
        setWorkoutNotes('');
      }
    } catch (err) {
      console.error('Failed to update booking status', err);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin log out?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#111625] border-r border-gray-800 flex flex-col justify-between shrink-0 p-5">
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg">
              P
            </div>
            <div>
              <h2 className="font-black text-sm tracking-wider uppercase leading-none">PREDATOR GYM</h2>
              <span className="text-[9px] text-orange-500 font-bold tracking-widest uppercase">Trainer Portal</span>
            </div>
          </div>

          {/* User profile brief */}
          {trainer && (
            <div className="bg-black/20 p-4.5 rounded-2xl border border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 text-orange-400 rounded-full flex items-center justify-center border border-orange-500/20">
                <UserIcon size={20} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs text-white truncate">{trainer.name}</h4>
                <p className="text-[10px] text-gray-500 truncate">{trainer.email}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/10' 
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
              }`}
            >
              <Award size={16} />
              <span>Ringkasan</span>
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'sessions' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/10' 
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
              }`}
            >
              <Calendar size={16} />
              <span>Jadwal Sesi</span>
              {stats.pending_bookings > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                  {stats.pending_bookings}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'members' 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/10' 
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>Daftar Member</span>
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/5 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Keluar Aplikasi</span>
        </button>
      </aside>

      {/* MAIN MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-gym-primary font-black uppercase tracking-widest animate-pulse">Memuat Data Portal...</div>
          </div>
        ) : (
          <>
            {/* Page Title & Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-wide">
                  {activeTab === 'overview' && 'Ringkasan Trainer'}
                  {activeTab === 'sessions' && 'Jadwal Sesi Latihan'}
                  {activeTab === 'members' && 'Daftar Klien Latihan'}
                </h1>
                <p className="text-gray-400 text-xs mt-1">
                  Halo Coach {trainer?.name || ''}, siap melatih hari ini? Tetap bugar dan berikan pelayanan terbaik!
                </p>
              </div>
            </div>

            {/* Quick Statistics Overview Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111625] border border-gray-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl"></div>
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 mb-3">
                  <Users size={20} />
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">Total Klien</span>
                <h3 className="text-2xl font-black text-white mt-1">{stats.total_members} Member</h3>
              </div>

              <div className="bg-[#111625] border border-gray-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl"></div>
                <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20 mb-3">
                  <Clock size={20} />
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">Menunggu Persetujuan</span>
                <h3 className="text-2xl font-black text-white mt-1">{stats.pending_bookings} Sesi</h3>
              </div>

              <div className="bg-[#111625] border border-gray-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 mb-3">
                  <Calendar size={20} />
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">Sesi Terjadwal</span>
                <h3 className="text-2xl font-black text-white mt-1">{stats.approved_bookings} Aktif</h3>
              </div>

              <div className="bg-[#111625] border border-gray-800 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 mb-3">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">Selesai Dilatih</span>
                <h3 className="text-2xl font-black text-white mt-1">{stats.completed_bookings} Latihan</h3>
              </div>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left side: Pending approvals & Upcoming Sessions */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-[#111625] border border-gray-800 rounded-3xl p-5 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Clock size={16} className="text-yellow-500" />
                      Permintaan Jadwal Sesi Terbaru
                    </h3>
                    <div className="divide-y divide-gray-800/60">
                      {bookings.filter(b => b.status === 'pending').length === 0 ? (
                        <p className="text-gray-400 text-xs py-4">Tidak ada permintaan sesi latihan yang tertunda.</p>
                      ) : (
                        bookings.filter(b => b.status === 'pending').slice(0, 3).map(b => (
                          <div key={b.id} className="py-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <span className="font-bold text-sm text-white block">{b.user.name}</span>
                              <span className="text-[10px] text-gray-400">
                                {formatDate(b.booking_date)} pukul <strong className="text-white">{b.booking_time}</strong>
                              </span>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'approved')}
                                className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check size={12} /> Terima
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                className="flex-1 sm:flex-initial bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <X size={12} /> Tolak
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-[#111625] border border-gray-800 rounded-3xl p-5 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Calendar size={16} className="text-gym-primary" />
                      Jadwal Sesi Terdekat
                    </h3>
                    <div className="divide-y divide-gray-800/60">
                      {bookings.filter(b => b.status === 'approved').length === 0 ? (
                        <p className="text-gray-400 text-xs py-4">Tidak ada sesi latihan terdekat.</p>
                      ) : (
                        bookings.filter(b => b.status === 'approved').slice(0, 5).map(b => (
                          <div key={b.id} className="py-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                              <span className="font-bold text-sm text-white block">{b.user.name}</span>
                              <span className="text-[10px] text-gray-400">
                                {formatDate(b.booking_date)} pukul <strong className="text-white">{b.booking_time}</strong>
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedBooking(b);
                                setWorkoutNotes('');
                              }}
                              className="w-full sm:w-auto bg-gym-primary hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 size={12} /> Selesaikan Latihan
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Member summaries */}
                <div className="space-y-6">
                  <div className="bg-[#111625] border border-gray-800 rounded-3xl p-5 space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Users size={16} className="text-orange-500" />
                      Member Aktif Terakhir
                    </h3>
                    <div className="space-y-3">
                      {members.length === 0 ? (
                        <p className="text-gray-400 text-xs">Belum ada member yang berlatih dengan Anda.</p>
                      ) : (
                        members.slice(0, 4).map(m => (
                          <div key={m.id} className="bg-black/25 p-3 rounded-2xl border border-gray-800/60 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-xs text-white block">{m.name}</span>
                              <span className="text-[9px] text-gray-500">PT Aktif: {m.trainer_subscription_end_date ? new Date(m.trainer_subscription_end_date).toLocaleDateString('id-ID') : '-'} </span>
                            </div>
                            {m.whatsapp && (
                              <a
                                href={`https://wa.me/${m.whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] flex items-center justify-center hover:bg-[#10B981]/20 transition-all"
                              >
                                <MessageSquare size={14} />
                              </a>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SESSIONS (FULL MANAGEMENT) */}
            {activeTab === 'sessions' && (
              <div className="bg-[#111625] border border-gray-800 rounded-3xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-800/60 pb-3">
                  <h2 className="text-base font-black uppercase tracking-wider">Histori & List Jadwal Sesi Latihan</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 uppercase font-black text-[9px] tracking-wider">
                        <th className="py-3 px-4">Nama Member</th>
                        <th className="py-3 px-4">Tanggal Sesi</th>
                        <th className="py-3 px-4">Jam Sesi</th>
                        <th className="py-3 px-4">Catatan Latihan / Notes</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {bookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">Belum ada riwayat booking sesi latihan.</td>
                        </tr>
                      ) : (
                        bookings.map(b => (
                          <tr key={b.id} className="hover:bg-gray-800/10">
                            <td className="py-3 px-4 font-bold text-white">{b.user?.name || 'Unknown User'}</td>
                            <td className="py-3 px-4 text-gray-300">{formatDate(b.booking_date)}</td>
                            <td className="py-3 px-4 text-gray-300 font-semibold">{b.booking_time}</td>
                            <td className="py-3 px-4 max-w-xs truncate text-gray-400 italic">
                              {b.notes || '-'}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                b.status === 'pending' && 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              } ${
                                b.status === 'approved' && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              } ${
                                b.status === 'completed' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              } ${
                                b.status === 'cancelled' && 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {b.status === 'pending' && (
                                <div className="flex gap-1.5 justify-end">
                                  <button
                                    onClick={() => handleUpdateStatus(b.id, 'approved')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-1.5 rounded-lg flex items-center justify-center cursor-pointer"
                                    title="Terima Sesi"
                                  >
                                    <Check size={12} />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 p-1.5 rounded-lg flex items-center justify-center cursor-pointer"
                                    title="Tolak Sesi"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}
                              {b.status === 'approved' && (
                                <div className="flex gap-1.5 justify-end">
                                  <button
                                    onClick={() => {
                                      setSelectedBooking(b);
                                      setWorkoutNotes('');
                                    }}
                                    className="bg-gym-primary hover:bg-orange-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                                  >
                                    <CheckCircle2 size={10} /> Selesaikan
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                    className="bg-red-500/10 hover:bg-red-500/25 text-red-400 p-1.5 rounded-lg flex items-center justify-center border border-red-500/20 cursor-pointer"
                                    title="Batalkan Sesi"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              )}
                              {b.status === 'completed' && <span className="text-gray-500 text-[10px] italic">Latihan Selesai</span>}
                              {b.status === 'cancelled' && <span className="text-gray-500 text-[10px] italic">Dibatalkan</span>}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: MEMBERS */}
            {activeTab === 'members' && (
              <div className="bg-[#111625] border border-gray-800 rounded-3xl p-5 space-y-4">
                <h2 className="text-base font-black uppercase tracking-wider border-b border-gray-800/60 pb-3">Daftar Klien / Member yang Aktif Dilatih</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.length === 0 ? (
                    <p className="text-gray-400 text-xs col-span-3 text-center py-8">Belum ada klien yang terdaftar di akun pelatih Anda.</p>
                  ) : (
                    members.map(m => (
                      <div key={m.id} className="bg-black/20 p-5 rounded-2xl border border-gray-800 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-sm text-white">{m.name}</h3>
                              <p className="text-[10px] text-gray-500">{m.email}</p>
                            </div>
                            <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-xl text-[9px] font-black uppercase">
                              Hingga: {m.trainer_subscription_end_date ? new Date(m.trainer_subscription_end_date).toLocaleDateString('id-ID') : '-'}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {m.whatsapp ? (
                            <a
                              href={`https://wa.me/${m.whatsapp}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 bg-[#10B981]/10 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/20 text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                            >
                              <MessageSquare size={12} /> Chat WhatsApp
                            </a>
                          ) : (
                            <span className="flex-1 text-center text-[10px] text-gray-500 bg-gray-900/30 py-2.5 rounded-xl">WhatsApp Kosong</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL FOR COMPLETING BOOKING WITH WORKOUT NOTES */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e24] border border-gray-850 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase tracking-wide text-white">Selesaikan Sesi Latihan</h3>
              <p className="text-gray-400 text-xs">
                Sesi untuk member <strong className="text-white">{selectedBooking.user?.name}</strong> pada tanggal {formatDate(selectedBooking.booking_date)} pukul {selectedBooking.booking_time}.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Detail Catatan Latihan / Gerakan</label>
              <textarea
                rows={4}
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="Contoh: Latihan Dada & Trisep. Bench press 4x10, Incline Dumbbell 3x12, Pushdown Trisep 3x15. Member dalam kondisi prima."
                className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-xs rounded-xl p-3.5 outline-none placeholder:text-gray-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs font-bold uppercase tracking-wider py-3 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setCompleting(true);
                  handleUpdateStatus(selectedBooking.id, 'completed', workoutNotes);
                }}
                className="flex-1 bg-gym-primary hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check size={14} /> Simpan & Selesai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

