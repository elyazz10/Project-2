'use client';

import React, { useState, useEffect, useLayoutEffect, Suspense, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Copy, Check, QrCode, AlertCircle, CheckCircle2, ChevronRight, Dumbbell, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface Trainer {
  id: number;
  name: string;
  specialization: string;
}

const DEFAULT_PT_SESSIONS_MAP: Record<string, { name: string; price: number; duration_months: number }> = {
  '1 Bulan PT': { name: '1 Bulan PT', price: 500000, duration_months: 1 },
  '3 Bulan PT': { name: '3 Bulan PT', price: 1500000, duration_months: 3 },
  '6 Bulan PT': { name: '6 Bulan PT', price: 3000000, duration_months: 6 },
  '12 Bulan PT': { name: '12 Bulan PT', price: 6000000, duration_months: 12 },
  
  
};

const DEFAULT_PLAN_MAP: Record<string, { name: string; price: number; months: number; freeSessions: number; icon: any }> = {
  '3Ref3bulan': { name: '3 Bulan', price: 300000, months: 3, freeSessions: 1, icon: Award },
  '3bulan': { name: '3 Bulan', price: 300000, months: 3, freeSessions: 1, icon: Award },
  '6Ref6bulan': { name: '6 Bulan', price: 600000, months: 6, freeSessions: 1, icon: Dumbbell },
  '6bulan': { name: '6 Bulan', price: 600000, months: 6, freeSessions: 1, icon: Dumbbell },
  '12Ref12bulan': { name: '12 Bulan', price: 1200000, months: 12, freeSessions: 2, icon: Award },
  '12bulan': { name: '12 Bulan', price: 1200000, months: 12, freeSessions: 2, icon: Award },
  '18Ref18bulan': { name: '18 Bulan', price: 1800000, months: 18, freeSessions: 2, icon: ShieldAlert },
  '18bulan': { name: '18 Bulan', price: 1800000, months: 18, freeSessions: 2, icon: ShieldAlert },
  '24Ref24bulan': { name: '24 Bulan', price: 2400000, months: 24, freeSessions: 3, icon: ShieldAlert },
  '24bulan': { name: '24 Bulan', price: 2400000, months: 24, freeSessions: 3, icon: ShieldAlert },
  '1bulan': { name: 'Basic (1 Bulan)', price: 100000, months: 1, freeSessions: 0, icon: Dumbbell }
};

function CheckoutContent() {
  console.log("CHECKOUT RENDER");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Precise instrumentation timers
  const mountTime = useRef(performance.now());
  const timerStarted = useRef(false);
  const hasFetched = useRef(false);

  if (!timerStarted.current) {
    console.log(`waktu mount: 0.00 ms`);
    timerStarted.current = true;
  }

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockSubscriptionId, setMockSubscriptionId] = useState<number | null>(null);
  
  // Checkout Parameters
  const [paket, setPaket] = useState('1bulan');
  const initialIsPtOnly = searchParams.get('type') === 'pt';
  const urlTrainerId = searchParams.get('trainer_id');
  const [withPT, setWithPT] = useState(initialIsPtOnly);
  const [onlyPT, setOnlyPT] = useState(initialIsPtOnly);
  const [selectedSessions, setSelectedSessions] = useState('6 Bulan PT');
  const [selectedTrainerId, setSelectedTrainerId] = useState(urlTrainerId || '');
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('bca');
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [isFirstTimeMember, setIsFirstTimeMember] = useState(false);
  const [paketMonths, setPaketMonths] = useState(1);
  const [ptSessionsCount, setPtSessionsCount] = useState(1);
  const [ptSessionsMap, setPtSessionsMap] = useState<Record<string, { name: string; price: number; duration_months: number }>>(DEFAULT_PT_SESSIONS_MAP);
  const [planMap, setPlanMap] = useState<Record<string, any>>(DEFAULT_PLAN_MAP);
  
  // Toast notifications
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

  // Log skeleton hide & checkout visibility after loading state changes and browser paints
  useLayoutEffect(() => {
    if (!loading) {
      const now = performance.now();
      console.log(`waktu skeleton hilang: ${(now - mountTime.current).toFixed(2)} ms`);
      console.log(`waktu komponen checkout benar-benar terlihat: ${(now - mountTime.current).toFixed(2)} ms`);
    }
  }, [loading]);

  useEffect(() => {
    console.log("CHECKOUT EFFECT");
    if (hasFetched.current) return;
    hasFetched.current = true;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login?redirect=/checkout');
      return;
    }

    // Load Midtrans Snap JS dynamically for Sandbox
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = 'SB-Mid-client-ToCmhhUk3VT7zUiReO5v9D1W';
    const script = document.querySelector(`script[src="${midtransScriptUrl}"]`) as HTMLScriptElement | null;
    if (!script) {
      const newScript = document.createElement('script');
      newScript.src = midtransScriptUrl;
      newScript.setAttribute('data-client-key', clientKey);
      newScript.async = true;
      document.body.appendChild(newScript);
    }

    const initLoad = async () => {
      console.log(`waktu fetch mulai: ${(performance.now() - mountTime.current).toFixed(2)} ms`);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/member/checkout-data', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });

        console.log(`waktu fetch selesai: ${(performance.now() - mountTime.current).toFixed(2)} ms`);

        if (!response.ok) {
          throw new Error('Gagal memuat data checkout');
        }

        const data = await response.json();
        console.log(`waktu response.json selesai: ${(performance.now() - mountTime.current).toFixed(2)} ms`);
        console.log('=== BACKEND PROFILING DATA ===', data.profiling);

        let trainersData: Trainer[] = [];

        if (data.success) {
          if (data.trainers) {
            trainersData = data.trainers;
            setTrainers(trainersData);
          }

          if (data.plans && data.plans.length > 0) {
            console.log("Checkout data received:", data);
            const newPlanMap = { ...DEFAULT_PLAN_MAP };
            data.plans.forEach((plan: any) => {
              const dbKey = `${plan.duration_months}bulan`;
              const refKey = `${plan.duration_months}Ref${plan.duration_months}bulan`;
              const discount = plan.discount || 0;
              const originalPrice = parseFloat(plan.price);
              const finalPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
              
              const mappedPlan = {
                name: plan.name,
                price: finalPrice,
                months: plan.duration_months,
                freeSessions: plan.duration_months >= 24 ? 3 : (plan.duration_months >= 12 ? 2 : 1),
                icon: plan.duration_months >= 12 ? Award : Dumbbell
              };
              newPlanMap[dbKey] = mappedPlan;
              newPlanMap[refKey] = mappedPlan;
            });
            setPlanMap(newPlanMap);
          }

          if (data.active_subscription) {
            setActiveSubscription(data.active_subscription);
          }

          if (data.pt_packages && data.pt_packages.length > 0) {
            const newPtMap: Record<string, { name: string; price: number; duration_months: number }> = {};
            data.pt_packages.forEach((pkg: any) => {
              newPtMap[`${pkg.duration_months} Bulan PT`] = {
                name: `${pkg.duration_months} Bulan PT`,
                price: parseFloat(pkg.price),
                duration_months: pkg.duration_months
              };
            });
            setPtSessionsMap(newPtMap);
          }

          setIsFirstTimeMember(data.is_first_time_member);
        }

        const isPtOnly = searchParams.get('type') === 'pt';
        const urlTrainerId = searchParams.get('trainer_id');
        
        if (isPtOnly) {
          setOnlyPT(true);
          setWithPT(true);
        } else {
          setOnlyPT(false);
          setWithPT(false);
        }
        
        // Pre-fill parameters from pending_subscription in localStorage
        const pending = localStorage.getItem('pending_subscription');
        if (pending) {
          try {
            const parsed = JSON.parse(pending);
            if (!isPtOnly && parsed.withPT !== undefined) setWithPT(parsed.withPT);
            if (!isPtOnly && parsed.onlyPT !== undefined) setOnlyPT(parsed.onlyPT);
            if (parsed.paket) {
              setPaket(parsed.paket);
              const match = parsed.paket.match(/(\d+)/);
              if (match) {
                setPaketMonths(parseInt(match[1]));
              }
            }
            if (parsed.sessions) {
              setSelectedSessions(parsed.sessions);
              const matchSesi = parsed.pt_duration_months ? parsed.pt_duration_months.toString().match(/(\d+)/) : null;
              if (matchSesi) {
                setPtSessionsCount(parseInt(matchSesi[1]));
              }
            }
            
            if (urlTrainerId) {
              setSelectedTrainerId(urlTrainerId);
            } else if (parsed.trainer_id) {
              setSelectedTrainerId(parsed.trainer_id.toString());
            } else if (trainersData.length > 0) {
              setSelectedTrainerId(trainersData[0].id.toString());
            }
          } catch (e) {
            console.error('Failed to parse pending subscription:', e);
            if (urlTrainerId) setSelectedTrainerId(urlTrainerId);
          }
        } else {
          if (urlTrainerId) {
            setSelectedTrainerId(urlTrainerId);
          } else if (trainersData.length > 0) {
            setSelectedTrainerId(trainersData[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Failed to load init data:', err);
      } finally {
        setLoading(false);
        console.log(`waktu setLoading(false): ${(performance.now() - mountTime.current).toFixed(2)} ms`);
      }
    };

    initLoad();
  }, []);

  const handleCopyVA = () => {
    navigator.clipboard.writeText('88019081234567890');
    setIsCopied(true);
    showNotification('Nomor Virtual Account disalin ke clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const verifyPaymentOnBackend = async (subscriptionId: number) => {
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/member/subscribe/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          subscription_id: subscriptionId,
          status: 'success'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentSuccess(true);
        localStorage.removeItem('pending_subscription');
        showNotification('Pembayaran terverifikasi! Mengalihkan ke dasbor...', 'success');
        setTimeout(() => {
          navigate('/dashboard/member');
        }, 2200);
      } else {
        setError(data.message || 'Gagal memverifikasi pembayaran.');
        showNotification('Gagal memverifikasi.', 'error');
      }
    } catch (err) {
      setError('Koneksi terputus saat verifikasi pembayaran.');
      showNotification('Koneksi terputus.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async () => {
    setSubmitting(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/member/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          paket: onlyPT ? '1bulan' : `${paketMonths}bulan`,
          trainer_id: (withPT || (freeSessions > 0 && !onlyPT)) ? selectedTrainerId : null,
          only_pt: onlyPT,
          sessions: withPT ? ptSessionsCount.toString() : '0',
          pt_duration_months: withPT ? ptSessionsCount : 0,
          gross_amount: totalPrice
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.is_mock) {
          console.error('Midtrans Error Debug Status:', data.debug_status);
          console.error('Midtrans Error Debug Body:', data.debug_body);
          setMockSubscriptionId(data.subscription.id);
          setShowMockModal(true);
          setSubmitting(false);
          if (data.debug_body) {
            showNotification(`Midtrans Response: ${data.debug_body.substring(0, 100)}...`, 'error');
          } else {
            showNotification('Menggunakan Mode Demo (Server Key belum terpasang)', 'success');
          }
        } else if (data.snap_token) {
          // Dynamically load/switch Snap script based on the production/sandbox state from backend
          const scriptUrl = data.is_production 
            ? 'https://app.midtrans.com/snap/snap.js' 
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
            
          const loadAndPay = () => {
            if ((window as any).snap) {
              (window as any).snap.pay(data.snap_token, {
                onSuccess: async function(result: any) {
                  showNotification('Pembayaran sukses! Memverifikasi transaksi...', 'success');
                  await verifyPaymentOnBackend(data.subscription.id);
                },
                onPending: function(result: any) {
                  showNotification('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.', 'error');
                  setSubmitting(false);
                },
                onError: function(result: any) {
                  showNotification('Pembayaran gagal! Silakan coba lagi.', 'error');
                  setSubmitting(false);
                },
                onClose: function() {
                  showNotification('Anda menutup popup pembayaran sebelum menyelesaikan transaksi.', 'error');
                  setSubmitting(false);
                }
              });
            } else {
              // Fallback to Midtrans Snap Redirect URL
              if (data.redirect_url) {
                window.location.href = data.redirect_url;
              } else {
                setError('Metode pembayaran Midtrans tidak siap.');
                setSubmitting(false);
              }
            }
          };

          if (!(window as any).snap || !document.querySelector(`script[src="${scriptUrl}"]`)) {
            // Remove previous snap scripts to avoid conflict
            document.querySelectorAll('script[src*="midtrans.com/snap"]').forEach(el => el.remove());
            
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.async = true;
            script.onload = loadAndPay;
            script.onerror = () => {
              if (data.redirect_url) {
                window.location.href = data.redirect_url;
              } else {
                setError('Gagal memuat library pembayaran Midtrans.');
                setSubmitting(false);
              }
            };
            document.body.appendChild(script);
          } else {
            loadAndPay();
          }
        } else {
          setError('Response format error from payment gateway.');
          setSubmitting(false);
        }
      } else {
        const errMsg = data.message || 'Gagal memproses transaksi.';
        setError(errMsg);
        showNotification(errMsg, 'error');
        setSubmitting(false);
      }
    } catch (err) {
      setError('Koneksi ke backend terputus. Pastikan server Laravel aktif.');
      showNotification('Koneksi gagal.', 'error');
      setSubmitting(false);
    }
  };



  // Price calculations
  const basePrice = useMemo(() => onlyPT ? 0 : (paketMonths * 100000), [onlyPT, paketMonths]);
  const registrationFee = useMemo(() => (!onlyPT && isFirstTimeMember) ? 20000 : 0, [onlyPT, isFirstTimeMember]);
  const ptPrice = useMemo(() => {
    if (!withPT) return 0;
    const pkg = ptSessionsMap[`${ptSessionsCount} Bulan PT`];
    if (pkg) return pkg.price;
    return ptSessionsCount * 500000;
  }, [withPT, ptSessionsCount, ptSessionsMap]);
  const totalPrice = useMemo(() => basePrice + ptPrice + registrationFee, [basePrice, ptPrice, registrationFee]);
  const freeSessions = 0; // Disabled free PT as requested
  const trainer = useMemo(() => trainers.find(t => t.id.toString() === selectedTrainerId), [trainers, selectedTrainerId]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };


  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center px-4">
        <div className="bg-[#1e1e24] p-8 md:p-12 rounded-3xl border border-gray-800 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-green-400"></div>
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
            <CheckCircle2 size={48} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white">Pembayaran Sukses!</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Program keanggotaan Anda telah aktif secara instan. Selamat bergabung di Predator Gym!
            </p>
          </div>
          <div className="bg-black/30 border border-gray-800/80 p-4 rounded-2xl text-left space-y-2">
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-gray-500">Paket Keanggotaan:</span>
              <span className="font-bold text-white">
                {onlyPT ? 'Aktif (Tidak Dikenakan Biaya)' : `${paketMonths} Bulan`}
              </span>
            </div>
            {freeSessions > 0 && (
              <div className="flex justify-between text-xs md:text-sm border-t border-gray-800/40 pt-2 text-[#10B981] font-semibold">
                <span className="text-gray-500">Bonus PT:</span>
                <span>+{freeSessions} Bulan (Gratis)</span>
              </div>
            )}
            {withPT && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                <span className="text-gray-400">Total Durasi PT:</span>
                <span className="font-bold text-white">{ptSessionsCount} Bulan</span>
              </div>
            )}
            {(withPT || (freeSessions > 0 && !onlyPT)) && trainer && (
              <div className="flex justify-between text-xs md:text-sm border-t border-gray-800/40 pt-2">
                <span className="text-gray-500">Trainer:</span>
                <span className="font-bold text-gym-primary">{trainer.name}</span>
              </div>
            )}
            <div className="flex justify-between text-xs md:text-sm border-t border-gray-800/40 pt-2">
              <span className="text-gray-500">Total Dibayar:</span>
              <span className="font-extrabold text-gym-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <Sparkles size={12} />
            Mengarahkan Anda ke dasbor profil...
          </div>
        </div>
      </div>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to={onlyPT ? "/dashboard/member" : "/membership"} className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-semibold group">
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1" />
            {onlyPT ? "Kembali ke Dashboard" : "Kembali ke Paket Membership"}
          </Link>
        </div>

        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-gym-primary font-bold tracking-widest text-xs uppercase block mb-1">Secure Checkout</span>
          <h1 className="text-3xl md:text-4.5xl font-black tracking-wide uppercase">
            {onlyPT ? "Pembayaran Personal Trainer" : "Pembayaran Membership"}
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {activeSubscription 
              ? "Selesaikan pembayaran untuk mengaktifkan langganan Personal Trainer Anda." 
              : "Selesaikan pembayaran untuk menambahkan member Anda."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-sm mb-8">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          
          <div className="space-y-6">
            
            {/* Order Summary Card */}
            <div className="bg-[#1e1e24] p-6 md:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide border-l-4 border-gym-primary pl-3">
                Ringkasan Pesanan
              </h2>

              {loading ? (
                <div className="animate-pulse space-y-5">
                  <div className="h-28 bg-gray-800/40 rounded-2xl w-full"></div>
                  <div className="space-y-3.5 border-t border-gray-855 pt-5">
                    <div className="h-4 bg-gray-800/20 rounded w-full"></div>
                    <div className="h-4 bg-gray-800/20 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-800/30 rounded w-full mt-4"></div>
                  </div>
                  <div className="h-14 bg-gray-800/40 rounded-xl w-full mt-4"></div>
                </div>
              ) : (
                <>
                  {/* Editable Package Configuration directly in Checkout as a Fallback/Customizer */}
                  <div className="space-y-4 bg-black/20 p-4.5 rounded-2xl border border-gray-800/80">
                {onlyPT ? (
                  <div className="bg-[#303038]/30 border border-gray-800/80 p-3 rounded-xl text-xs text-gray-300">
                    <span className="text-[9px] text-gray-500 uppercase font-black block">Status Keanggotaan Anda</span>
                    <span className="font-semibold text-white">
                      {activeSubscription ? `Member Aktif (${activeSubscription?.plan?.name || ''})` : 'Membeli Paket PT'}
                    </span>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5">Durasi Membership (Bulan)</label>
                    <div className="flex gap-3 items-center">
                      <input 
                        type="number"
                        min="1"
                        max="36"
                        value={paketMonths}
                        onChange={(e) => {
                          const val = Math.max(1, parseInt(e.target.value) || 1);
                          setPaketMonths(val);
                          setPaket(`${val}bulan`);
                        }}
                        className="w-24 bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-3 py-2.5 outline-none font-bold text-center"
                      />
                      <span className="text-xs md:text-sm text-gray-400 font-semibold">Bulan (Rp 100.000 / Bulan)</span>
                    </div>
                    {freeSessions > 0 && (
                      <div className="mt-2 text-[11px] text-[#10B981] flex items-center gap-1.5 font-bold">
                        <Sparkles size={12} className="shrink-0" />
                        <span>Bonus Keanggotaan: Gratis {freeSessions} Bulan PT!</span>
                      </div>
                    )}
                    {activeSubscription && (
                      <div className="mt-2.5 text-[11px] text-orange-400 font-semibold bg-orange-500/5 border border-orange-500/20 px-3 py-2 rounded-xl">
                        ⚠️ Transaksi ini akan memperpanjang masa aktif membership Anda ({activeSubscription.plan.name}).
                      </div>
                    )}
                  </div>
                )}

                {withPT && (
                  <div className="border-t border-gray-800/60 pt-3 space-y-3">
                    <div>
                      <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5">Durasi Paket PT</label>
                      <div className="flex gap-3 items-center">
                        <input 
                          type="number"
                          min="1"
                          max="200"
                          value={ptSessionsCount}
                          onChange={(e) => {
                            const val = Math.max(1, parseInt(e.target.value) || 1);
                            setPtSessionsCount(val);
                          }}
                          className="w-24 bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-sm rounded-xl px-3 py-2.5 outline-none font-bold text-center"
                        />
                        <span className="text-xs md:text-sm text-gray-400 font-semibold">Bulan</span>
                      </div>
                    </div>

                    {trainers.length > 0 && (
                      <div className="border-t border-gray-800/60 pt-3">
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5">Pilih Personal Trainer</label>
                        <select 
                          value={selectedTrainerId}
                          onChange={(e) => setSelectedTrainerId(e.target.value)}
                          className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-xs md:text-sm rounded-xl px-3 py-2.5 outline-none"
                        >
                          <option value="">Pilih Personal Trainer (Bisa Kosong)</option>
                          {trainers.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {freeSessions > 0 && (
                      <div className="bg-[#10B981]/10 border border-[#10B981]/25 p-3 rounded-xl flex items-center justify-between text-[11px] text-emerald-400 mt-2">
                        <div>
                          <span className="text-[9px] text-[#10B981] uppercase font-black block">Total Durasi PT</span>
                          <span className="text-sm font-bold text-white block">
                            {ptSessionsCount + freeSessions} Bulan
                          </span>
                        </div>
                        <span className="text-[10px] italic">({ptSessionsCount} Berbayar + {freeSessions} Bonus)</span>
                      </div>
                    )}
                  </div>
                )}

                {!withPT && freeSessions > 0 && !onlyPT && trainers.length > 0 && (
                  <div className="border-t border-gray-800/60 pt-3">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1.5">Pilih Personal Trainer</label>
                    <select 
                      value={selectedTrainerId}
                      onChange={(e) => setSelectedTrainerId(e.target.value)}
                      className="w-full bg-[#303038] border border-gray-700 focus:border-gym-primary text-white text-xs md:text-sm rounded-xl px-3 py-2.5 outline-none"
                    >
                      <option value="">Pilih Personal Trainer (Bisa Kosong)</option>
                      {trainers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Bill Details */}
              <div className="space-y-3.5 border-t border-gray-855 pt-5">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-gray-400">Harga Paket Membership ({paketMonths} Bulan):</span>
                  <span className="font-semibold text-white">
                    {onlyPT ? 'Rp 0 (Sudah Aktif)' : formatPrice(basePrice)}
                  </span>
                </div>
                {registrationFee > 0 && (
                  <div className="flex justify-between text-xs md:text-sm text-orange-400 font-semibold">
                    <span className="text-gray-400">Biaya Pendaftaran (Member Baru):</span>
                    <span>{formatPrice(registrationFee)}</span>
                  </div>
                )}
                {freeSessions > 0 && (
                  <div className="flex justify-between text-xs md:text-sm text-[#10B981] font-semibold">
                    <span className="text-gray-500">Bonus PT:</span>
                    <span>{freeSessions} Bulan (Gratis)</span>
                  </div>
                )}
                {withPT && (
                  <div className="flex justify-between text-xs md:text-sm">
                    <span className="text-gray-400">Biaya Trainer ({ptSessionsCount} Bulan):</span>
                    <span className="font-semibold text-white">{formatPrice(ptPrice)}</span>
                  </div>
                )}
                {(withPT || (freeSessions > 0 && !onlyPT)) && trainer && (
                  <div className="bg-[#303038]/30 border border-gray-800/60 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-black block">Trainer Ditugaskan</span>
                      <span className="font-bold text-gym-primary">{trainer.name}</span>
                    </div>
                    <span className="text-gray-400 italic text-[10px]">{trainer.specialization}</span>
                  </div>
                )}
                <div className="border-t border-gray-800 pt-4 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Tagihan:</span>
                  <span className="text-xl md:text-2xl font-black text-gym-primary tracking-tight">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>

              {/* Action Submit Button */}
              <button 
                onClick={handleConfirmPayment}
                disabled={submitting}
                className="w-full btn-primary py-4 text-xs md:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl cursor-pointer hover:scale-100 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                {submitting ? 'Memproses Transaksi...' : 'Konfirmasi & Selesai Bayar'}
                <ChevronRight size={18} />
              </button>

              <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                Dengan menekan tombol di atas, Anda menyatakan bahwa data tagihan di atas sudah benar dan Anda setuju untuk mengaktifkan paket keanggotaan ini.
              </p>
            </>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Mock Payment Simulator Modal (Fallback Demo Mode) */}
      {showMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e1e24] border border-gray-800 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
            
            <div className="flex items-center gap-3 text-orange-500">
              <Sparkles size={24} className="animate-spin" />
              <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white">Predator Gym - Midtrans Demo</h3>
            </div>
            
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Kami mendeteksi <strong>Access Keys Midtrans Sandbox</strong> belum terpasang di file <code>.env</code> backend Laravel Anda. 
            </p>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Agar pengujian fitur pendaftaran dan perpanjangan membership Anda tetap berjalan lancar dan aman, sistem secara otomatis mengalihkan Anda ke **Mode Demo Simulator**.
            </p>

            <div className="bg-[#0B0F19] p-4 rounded-xl border border-gray-850 text-xs space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Pembayaran:</span>
                <span className="font-bold text-orange-500">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-800/40 pt-2">
                <span className="text-gray-500">Mode Sistem:</span>
                <span className="font-semibold text-yellow-400">Sandbox Simulator Demo</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={async () => {
                  setShowMockModal(false);
                  if (mockSubscriptionId) {
                    await verifyPaymentOnBackend(mockSubscriptionId);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs md:text-sm uppercase tracking-wider cursor-pointer active:scale-95 text-center"
              >
                Simulasikan Bayar Sukses
              </button>
              <button
                onClick={() => {
                  setShowMockModal(false);
                  setSubmitting(false);
                }}
                className="bg-[#303038] hover:bg-gray-800 text-gray-300 border border-gray-700 font-bold py-3 px-4 rounded-xl text-xs md:text-sm uppercase tracking-wider cursor-pointer active:scale-95 text-center"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  console.log("CHECKOUT PAGE RENDER");
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gym-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}



