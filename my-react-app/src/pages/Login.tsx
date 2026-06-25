'use client';

import React, { useState, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

function LoginContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user && user.role) {
      if (user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (user.role === 'owner') {
        navigate('/dashboard/owner');
      } else if (user.role === 'trainer') {
        navigate('/dashboard/trainer');
      } else {
        navigate('/membership');
      }
    }
  }, [navigate]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errMsg = data.message || 'Login gagal. Periksa kembali email dan password.';
        setError(errMsg);
        showNotification(errMsg, 'error');
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        showNotification('Login berhasil! Mengalihkan ke portal Anda...', 'success');

        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate('/dashboard/admin');
          } else if (data.user.role === 'owner') {
            navigate('/dashboard/owner');
          } else if (data.user.role === 'trainer') {
            navigate('/dashboard/trainer');
          } else {
            navigate(redirect || '/dashboard/member');
          }
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
      {/* Dynamic Toast Notification */}
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
        <div className="max-w-md w-full space-y-8 bg-[#1e1e24] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-[#FF9000]"></div>
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-wide">
              Masuk ke <span className="text-gym-primary">Akun Anda</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Kelola program latihan dan membership Anda
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-500 text-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm">Email Address</label>
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
                    className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none placeholder:text-gray-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium text-sm">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl pl-12 pr-12 py-3.5 outline-none placeholder:text-gray-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-[#F97316] hover:text-orange-400 font-semibold hover:underline">
                Lupa Password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 border-transparent shadow-none hover:scale-100 flex items-center justify-center gap-2 cursor-pointer rounded-xl"
              >
                <LogIn size={18} />
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-400 pt-2 border-t border-gray-800">
              Belum punya akun?{' '}
              <Link to={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="text-gym-primary font-bold hover:underline">
                Daftar Member Baru
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="text-xl font-bold tracking-widest text-gym-primary uppercase">Memuat Halaman Login...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

