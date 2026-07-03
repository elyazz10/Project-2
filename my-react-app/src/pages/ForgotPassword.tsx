'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Mail, Phone, Lock, KeyRound, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

type Step = 'verify' | 'reset' | 'done';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('verify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Verification
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Step 2: Reset
  const [resetToken, setResetToken] = useState('');
  const [userName, setUserName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: null }), 4500);
  };

  // Step 1: Verify email + whatsapp
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, whatsapp })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResetToken(data.reset_token);
        setUserName(data.user_name);
        setStep('reset');
        showNotification(data.message, 'success');
      } else {
        const msg = data.message || 'Verifikasi gagal.';
        setError(msg);
        showNotification(msg, 'error');
      }
    } catch (err) {
      const msg = 'Koneksi ke server gagal. Pastikan backend berjalan.';
      setError(msg);
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          reset_token: resetToken,
          password: newPassword,
          password_confirmation: confirmPassword
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep('done');
        showNotification(data.message, 'success');
      } else {
        const msg = data.message || 'Gagal mereset password.';
        setError(msg);
        showNotification(msg, 'error');
      }
    } catch (err) {
      const msg = 'Koneksi ke server gagal.';
      setError(msg);
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-[#0B0F19] min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-[-15%] w-[400px] h-[400px] bg-[#F97316]/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Toast */}
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

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-[#1e1e24] p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-[#FF9000]"></div>

          {/* Back to Login */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F97316] font-semibold text-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Login
          </Link>

          {/* =============== STEP 1: VERIFY =============== */}
          {step === 'verify' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                  <KeyRound size={28} className="text-[#F97316]" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-wide">
                  Lupa <span className="text-[#F97316]">Password?</span>
                </h2>
                <p className="mt-2 text-sm text-gray-400 max-w-xs mx-auto">
                  Masukkan email dan nomor WhatsApp Anda yang terdaftar untuk verifikasi identitas.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-500 text-sm">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium text-sm">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      className="w-full bg-[#303038] border border-gray-700 focus:border-[#F97316] text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none placeholder:text-gray-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium text-sm">Nomor WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full bg-[#303038] border border-gray-700 focus:border-[#F97316] text-white text-sm rounded-xl pl-12 pr-4 py-3.5 outline-none placeholder:text-gray-500 font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5">Nomor WhatsApp harus sama dengan yang terdaftar di akun Anda.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <ShieldCheck size={18} />
                  {loading ? 'Memverifikasi...' : 'Verifikasi Identitas'}
                </button>
              </form>
            </>
          )}

          {/* =============== STEP 2: RESET PASSWORD =============== */}
          {step === 'reset' && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Lock size={28} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-wide">
                  Atur Password <span className="text-emerald-400">Baru</span>
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Halo <span className="text-white font-bold">{userName}</span>, silakan masukkan password baru Anda.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-500 text-sm">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium text-sm">Password Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full bg-[#303038] border border-gray-700 focus:border-emerald-500 text-white text-sm rounded-xl pl-12 pr-12 py-3.5 outline-none placeholder:text-gray-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium text-sm">Konfirmasi Password Baru</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      className="w-full bg-[#303038] border border-gray-700 focus:border-emerald-500 text-white text-sm rounded-xl pl-12 pr-12 py-3.5 outline-none placeholder:text-gray-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password match indicator */}
                {newPassword && confirmPassword && (
                  <div className={`flex items-center gap-2 text-xs font-semibold ${
                    newPassword === confirmPassword ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {newPassword === confirmPassword ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {newPassword === confirmPassword ? 'Password cocok!' : 'Password tidak cocok'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="w-full py-3.5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Lock size={18} />
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>
            </>
          )}

          {/* =============== STEP 3: SUCCESS =============== */}
          {step === 'done' && (
            <div className="text-center space-y-6 py-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-wide mb-2">
                  Password Berhasil <span className="text-emerald-400">Direset!</span>
                </h2>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                  Password Anda telah diperbarui. Silakan login dengan password baru Anda.
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <ArrowLeft size={18} />
                Kembali ke Halaman Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
