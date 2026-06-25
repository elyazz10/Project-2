import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';

// Static Pages (Loaded immediately for fast landing experience)
import Home from '@/pages/Home';
import Membership from '@/pages/Membership';
import PersonalTrainer from '@/pages/PersonalTrainer';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Lazy Loaded Pages (Split into smaller chunks)
const Lokasi = lazy(() => import('@/pages/Lokasi'));
const BMIChecker = lazy(() => import('@/pages/BMIChecker'));
const Tentang = lazy(() => import('@/pages/Tentang'));
const Fasilitas = lazy(() => import('@/pages/Fasilitas'));
const Program = lazy(() => import('@/pages/Program'));
const Pelatih = lazy(() => import('@/pages/Pelatih'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Daftar = lazy(() => import('@/pages/Daftar'));

// Lazy Loaded Dashboard Pages (Heavy/Authenticated routes)
const MemberDashboard = lazy(() => import('@/pages/dashboard/MemberDashboard'));
const TrainerDashboard = lazy(() => import('@/pages/dashboard/TrainerDashboard'));
const OwnerDashboard = lazy(() => import('@/pages/dashboard/OwnerDashboard'));
const AdminDashboard = lazy(() => import('@/pages/dashboard/AdminDashboard'));
const MemberHistory = lazy(() => import('@/pages/dashboard/MemberHistory'));

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-gym-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  console.log("APP RENDER");
  return (
    <HelmetProvider>
      <Helmet>
        <title>Predator Gym - Premium Fitness Gym & Wellness Center</title>
        <meta name="description" content="Transformasi bentuk tubuhmu dan capai target kebugaran maksimal dengan fasilitas premium dan pelatih profesional kelas dunia." />
      </Helmet>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/personal-trainer" element={<PersonalTrainer />} />
              <Route path="/lokasi" element={<Lokasi />} />
              <Route path="/bmi-checker" element={<BMIChecker />} />
              <Route path="/tentang" element={<Tentang />} />
              <Route path="/fasilitas" element={<Fasilitas />} />
              <Route path="/program" element={<Program />} />
              <Route path="/pelatih" element={<Pelatih />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/daftar" element={<Daftar />} />

              {/* Member Dashboard Routes */}
              <Route path="/dashboard/member" element={<MemberDashboard />} />
              <Route path="/dashboard/member/history" element={<MemberHistory />} />
            </Route>

            {/* Admin, Owner, and Trainer dashboards (No general Navbar/Footer) */}
            <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
            <Route path="/dashboard/owner" element={<OwnerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
};

export default App;
