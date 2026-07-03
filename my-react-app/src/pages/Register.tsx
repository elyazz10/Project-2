'use client';

import React, { useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, Lock, Calendar, UserPlus, AlertCircle } from 'lucide-react';

function RegisterContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    whatsapp: '',
    tanggal_lahir: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user && user.role) {
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/membership');
      }
    }
  }, [navigate]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        let errMsg = 'Pendaftaran gagal.';
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          errMsg = firstError[0];
        } else {
          errMsg = data.message || 'Pendaftaran gagal.';
        }
        setError(errMsg);
        showNotification(errMsg, 'error');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showNotification('Pendaftaran sukses! Selamat bergabung di Predator Gym...', 'success');

        setTimeout(() => {
          navigate(redirect || '/dashboard/member');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }, 1500);
      }
    } catch (err) {
      const errMsg = 'Koneksi ke server backend gagal. Pastikan Laravel berjalan.';
      setError(errMsg);
      showNotification(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-[#0B0F19] min-h-screen flex flex-col relative overflow-hidden">
      {/* Toast Notification */}
      {toast.type && (
        <div className={`fixed top-24 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
          toast.type === 'success'
            ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
            : 'bg-[#EF4444]/15 border-[#EF4444]/30 text-[#EF4444]'
        }`}>
          <AlertCircle size={18} className={toast.type === 'success' ? 'text-[#10B981]' : 'text-[#EF4444]'} />
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-[#1e1e24] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-[#FF9000]"></div>
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-wide">
              Daftar Member <span className="text-gym-primary">Predator Gym</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Dapatkan akses penuh ke fasilitas premium dan program latihan kami
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-500 text-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nama Anda"
                    className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Nomor WhatsApp */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm">Nomor WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    placeholder="0812XXXXXXXX"
                    className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@contoh.com"
                    className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm">Tanggal Lahir</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    name="tanggal_lahir"
                    value={formData.tanggal_lahir}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 font-medium text-sm">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="•••••••• (Minimal 6 karakter)"
                    className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 border-transparent shadow-none hover:scale-100 flex items-center justify-center gap-2 cursor-pointer rounded-xl"
              >
                <UserPlus size={18} />
                {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-400 pt-2 border-t border-gray-800">
              Sudah punya akun?{' '}
              <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="text-gym-primary font-bold hover:underline">
                Login ke Portal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="text-xl font-bold tracking-widest text-gym-primary uppercase">Memuat Halaman Pendaftaran...</div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}

