'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Calendar,
  Award,
  LogOut,
  Check,
  X,
  Plus,
  Trash2,
  DollarSign,
  LayoutDashboard,
  Receipt,
  UserCheck,
  UserCog,
  LineChart,
  Search,
  Sparkles,
  CalendarDays,
  TrendingUp,
  CreditCard,
  Briefcase,
  Pencil,
  Dumbbell,
  DoorOpen,
  Droplet,
  Sofa,
  Scale,
  ShowerHead,
  Lock,
  Moon,
  CircleParking,
  Bike,
  Layers,
  MoreHorizontal,
  Menu
} from 'lucide-react';

import { PredatorGymLogo } from '@/components/PredatorGymLogo';

interface User {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  created_at: string;
}

interface Trainer {
  id: number;
  name: string;
  specialization: string;
  rating: string;
  reviews: string;
  role?: string;
  description?: string;
  tags?: any;
  user?: User;
}

interface Booking {
  id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  user: User;
  trainer: Trainer;
}

interface Plan {
  id: number;
  name: string;
  price: string;
  duration_months: number;
}

interface Subscription {
  id: number;
  order_id?: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  user: User;
  plan: Plan;
  trainer?: Trainer;
  gross_amount?: string | number;
  trainer_fee?: string | number;
  trainer_subscription_end_date?: string;
  trainer_end_date?: string;
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Navigation tab state: 'dashboard' | 'transactions' | 'members' | 'employees' | 'financials'
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Admin Data States
  const [stats, setStats] = useState<any>({
    total_members: 0,
    pending_bookings: 0,
    approved_bookings: 0,
    total_trainers: 0,
    total_revenue: 0
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Search filters
  const [memberSearch, setMemberSearch] = useState('');
  const [transSearch, setTransSearch] = useState('');
  const [transTab, setTransTab] = useState<'membership' | 'pt'>('membership');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [finTab, setFinTab] = useState<'all' | 'membership' | 'pt'>('all');

  // Add Trainer Form Inputs
  const [trainerForm, setTrainerForm] = useState({
    name: '',
    role: 'trainer',
    specialization: '',
    description: '',
    tags: '',
    email: '',
    password: ''
  });
  const [submittingTrainer, setSubmittingTrainer] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<any>(null);
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState<string>('all');



  // Gym Features States (Fasilitas & Alat)
  const [gymFeatures, setGymFeatures] = useState<any[]>([]);
  const [featureForm, setFeatureForm] = useState({
    name: '',
    description: '',
    icon: 'Dumbbell',
    type: 'facility'
  });
  const [submittingFeature, setSubmittingFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [featureFilter, setFeatureFilter] = useState<'all' | 'facility' | 'equipment'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Walk-in Guest states
  const [walkIns, setWalkIns] = useState<any[]>([]);
  const [walkInForm, setWalkInForm] = useState({
    name: '',
    whatsapp: '',
    visit_date: new Date().toISOString().split('T')[0],
    amount: 15000
  });
  const [submittingWalkIn, setSubmittingWalkIn] = useState(false);

  // Authentication & Main stats loader
  const loadMainStats = async (token: string) => {
    try {
      const statsRes = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/dashboard-stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (statsRes.status === 401) {
        handleLogout();
        return;
      }

      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      const bookingsRes = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData.bookings);
      }

      const trainersRes = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/trainers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (trainersRes.ok) {
        const trainersData = await trainersRes.json();
        setTrainers(trainersData);
      }
    } catch (err) {
      setError('Gagal memuat data utama owner.');
    }
  };

  // Fetch Members
  const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/members', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  // Fetch Transactions/Subscriptions
  const fetchSubscriptions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/subscriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'owner') {
      navigate('/login');
      return;
    }

    const init = async () => {
      setLoading(true);
      await loadMainStats(token);
      setLoading(false);
    };

    init();
  }, [navigate]);

  // Load contextual data when tabs change
  useEffect(() => {
    setIsSidebarOpen(false);
    if (activeTab === 'members') {
      fetchMembers();
    } else if (activeTab === 'transactions' || activeTab === 'financials' || activeTab === 'walk-ins') {
      fetchSubscriptions();
      fetchWalkIns();

    }
  }, [activeTab]);

  // Fetch Walk-In Logs
  const fetchWalkIns = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/walk-in-logs', {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWalkIns(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch walk-in logs', err);
    }
  };

  // Submit Walk-In Guest Log
  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInForm.name || !walkInForm.visit_date) return;
    setSubmittingWalkIn(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/walk-in-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(walkInForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setWalkIns(prev => [data.log, ...prev]);
        setWalkInForm({
          name: '',
          whatsapp: '',
          visit_date: new Date().toISOString().split('T')[0],
          amount: 15000
        });
        // Update stats
        if (stats) {
          setStats((prev: any) => ({
            ...prev,
            total_revenue: prev.total_revenue + parseFloat(data.log.amount),
            walk_in_revenue: (prev.walk_in_revenue || 0) + parseFloat(data.log.amount)
          }));
        }
        alert('Kunjungan walk-in berhasil dicatat!');
      } else {
        alert(data.message || 'Gagal menyimpan data.');
      }
    } catch (err) {
      alert('Koneksi server gagal.');
    } finally {
      setSubmittingWalkIn(false);
    }
  };

  // Delete Walk-In Guest Log
  const handleWalkInDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!confirm('Apakah Anda yakin ingin menghapus log kunjungan ini?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/admin/walk-in-logs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const deleted = walkIns.find(w => w.id === id);
        setWalkIns(prev => prev.filter(w => w.id !== id));
        if (deleted && stats) {
          setStats((prev: any) => ({
            ...prev,
            total_revenue: Math.max(0, prev.total_revenue - parseFloat(deleted.amount)),
            walk_in_revenue: Math.max(0, (prev.walk_in_revenue || 0) - parseFloat(deleted.amount))
          }));
        }
        alert('Log kunjungan berhasil dihapus!');
      } else {
        alert(data.message || 'Gagal menghapus log.');
      }
    } catch (err) {
      alert('Koneksi server gagal.');
    }
  };

  // Fetch Gym Features
  const fetchGymFeatures = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/gym-features', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGymFeatures(data.features || []);
      }
    } catch (err) {
      console.error('Error fetching gym features:', err);
    }
  };

  const handleSaveFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureForm.name || !featureForm.type) {
      alert('Nama dan Tipe wajib diisi!');
      return;
    }

    setSubmittingFeature(true);
    const token = localStorage.getItem('token');

    const url = editingFeature
      ? `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/admin/gym-features/${editingFeature.id}`
      : (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/gym-features';

    const method = editingFeature ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(featureForm)
      });

      const data = await res.json();
      if (res.ok) {
        alert(editingFeature ? 'Item berhasil diperbarui!' : 'Item berhasil ditambahkan!');
        setFeatureForm({ name: '', description: '', icon: 'Dumbbell', type: 'facility' });
        setEditingFeature(null);
        fetchGymFeatures();
      } else {
        alert(data.message || 'Gagal menyimpan item.');
      }
    } catch (err) {
      alert('Koneksi ke backend gagal.');
    } finally {
      setSubmittingFeature(false);
    }
  };

  const handleDeleteFeature = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/admin/gym-features/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('Item berhasil dihapus!');
        fetchGymFeatures();
      } else {
        alert('Gagal menghapus item.');
      }
    } catch (err) {
      alert('Koneksi ke backend gagal.');
    }
  };

  const startEditFeature = (feature: any) => {
    setEditingFeature(feature);
    setFeatureForm({
      name: feature.name,
      description: feature.description || '',
      icon: feature.icon || 'Dumbbell',
      type: feature.type
    });
  };

  const cancelEditFeature = () => {
    setEditingFeature(null);
    setFeatureForm({ name: '', description: '', icon: 'Dumbbell', type: 'facility' });
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

  // Update Booking Status (Approve/Reject Session)
  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(prev => prev.map(b => b.id === bookingId ? data.booking : b));

        // Update local stats
        if (status === 'approved') {
          setStats((prev: any) => ({
            ...prev,
            pending_bookings: Math.max(0, prev.pending_bookings - 1),
            approved_bookings: prev.approved_bookings + 1
          }));
        } else if (status === 'cancelled') {
          setStats((prev: any) => ({
            ...prev,
            pending_bookings: Math.max(0, prev.pending_bookings - 1)
          }));
        }
        alert(`Pesanan berhasil di-${status === 'approved' ? 'setujui' : 'batalkan'}!`);
      } else {
        alert('Gagal memperbarui status booking.');
      }
    } catch (err) {
      alert('Koneksi ke backend gagal.');
    }
  };

  // Manual Subscription Status Update (Approve/Cancel Transactions)
  const handleUpdateSubscriptionStatus = async (subId: number, status: string) => {
    const token = localStorage.getItem('token');
    if (!confirm(`Apakah Anda yakin ingin menandai transaksi ini sebagai ${status === 'active' ? 'AKTIF (LUNAS)' : 'BATAL'}?`)) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/admin/subscriptions/${subId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const data = await res.json();
        setSubscriptions(prev => prev.map(s => s.id === subId ? data.subscription : s));

        // Reload main stats for updated revenue
        if (token) loadMainStats(token);
        alert('Status transaksi berhasil diperbarui!');
      } else {
        alert('Gagal memperbarui status transaksi.');
      }
    } catch (err) {
      alert('Koneksi gagal.');
    }
  };

  // Trainer CRUD - Create
  const handleAddTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerForm.name || !trainerForm.specialization || !trainerForm.description) return;
    setSubmittingTrainer(true);
    const token = localStorage.getItem('token');

    const tagsArray = trainerForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    try {
      const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000') + '/api/admin/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...trainerForm,
          tags: tagsArray,
          email: trainerForm.role === 'trainer' && trainerForm.email ? trainerForm.email : undefined,
          password: trainerForm.role === 'trainer' && trainerForm.password ? trainerForm.password : undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Data Karyawan baru berhasil ditambahkan!');
        setTrainers(prev => [...prev, data.trainer]);
        setTrainerForm({ name: '', role: 'trainer', specialization: '', description: '', tags: '', email: '', password: '' });
        setStats((prev: any) => ({ ...prev, total_trainers: prev.total_trainers + 1 }));
        setActiveTab('dashboard');
      } else {
        alert(data.message || 'Gagal menambahkan karyawan.');
      }
    } catch (err) {
      alert('Koneksi ke backend gagal.');
    } finally {
      setSubmittingTrainer(false);
    }
  };

  // Trainer CRUD - Update
  const handleUpdateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrainer) return;
    if (!trainerForm.name || !trainerForm.specialization || !trainerForm.description) return;

    setSubmittingTrainer(true);
    const token = localStorage.getItem('token');
    const tagsArray = trainerForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/admin/trainers/${editingTrainer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...trainerForm,
          tags: tagsArray,
          email: trainerForm.role === 'trainer' && trainerForm.email ? trainerForm.email : undefined,
          password: trainerForm.role === 'trainer' && trainerForm.password ? trainerForm.password : undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Data Karyawan berhasil diperbarui!');
        setTrainers(prev => prev.map(t => t.id === editingTrainer.id ? data.trainer : t));
        cancelEditTrainer();
      } else {
        alert(data.message || 'Gagal memperbarui data karyawan.');
      }
    } catch (err) {
      alert('Koneksi ke backend gagal.');
    } finally {
      setSubmittingTrainer(false);
    }
  };

  const startEditTrainer = (trainer: any) => {
    setEditingTrainer(trainer);
    setTrainerForm({
      name: trainer.name,
      role: trainer.role || 'trainer',
      specialization: trainer.specialization,
      description: trainer.description || '',
      tags: Array.isArray(trainer.tags) ? trainer.tags.join(', ') : (trainer.tags || ''),
      email: trainer.user?.email || '',
      password: ''
    });
  };

  const cancelEditTrainer = () => {
    setEditingTrainer(null);
    setTrainerForm({
      name: '',
      role: 'trainer',
      specialization: '',
      description: '',
      tags: '',
      email: '',
      password: ''
    });
  };

  // Trainer CRUD - Delete
  const handleDeleteTrainer = async (trainerId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus trainer ini?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/admin/trainers/${trainerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('Trainer berhasil dihapus!');
        setTrainers(prev => prev.filter(t => t.id !== trainerId));
        setStats((prev: any) => ({ ...prev, total_trainers: Math.max(0, prev.total_trainers - 1) }));
      } else {
        alert('Gagal menghapus trainer.');
      }
    } catch (err) {
      alert('Koneksi ke backend gagal.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <div className="text-xl font-bold tracking-widest text-yellow-500 uppercase">MEMUAT PORTAL OWNER...</div>
        </div>
      </div>
    );
  }

  // Filtered lists
  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredSubscriptions = subscriptions.filter(s => {
    const isPtOnly = new Date(s.end_date).getTime() - new Date(s.start_date).getTime() < 5 * 24 * 60 * 60 * 1000;
    if (transTab === 'membership' && isPtOnly) return false;
    if (transTab === 'pt' && !isPtOnly) return false;

    // 1. Text search filter
    const matchesText = s.user.name.toLowerCase().includes(transSearch.toLowerCase()) ||
      (s.order_id && s.order_id.toLowerCase().includes(transSearch.toLowerCase()));

    if (!matchesText) return false;

    // 2. Date range filter
    const createdAtDate = new Date(s.created_at);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (createdAtDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (createdAtDate > end) return false;
    }

    return true;
  });

  const filteredTrainers = trainers.filter(t => {
    if (employeeRoleFilter === 'all') return true;
    return (t.role || 'trainer') === employeeRoleFilter;
  });

  const filteredGymFeatures = gymFeatures.filter(f => {
    if (featureFilter === 'all') return true;
    return f.type === featureFilter;
  });

  // Financial calculations
  const filteredFinancialSubscriptions = subscriptions.filter(s => {
    const isPtOnly = new Date(s.end_date).getTime() - new Date(s.start_date).getTime() < 5 * 24 * 60 * 60 * 1000;
    if (finTab === 'membership' && isPtOnly) return false;
    if (finTab === 'pt' && !isPtOnly) return false;

    const createdAtDate = new Date(s.created_at);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (createdAtDate < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (createdAtDate > end) return false;
    }

    return true;
  });

  const totalWalkInRevenue = walkIns.reduce((sum, w) => sum + parseFloat(w.amount || '0'), 0);

  const totalFinancialRevenue = (filteredFinancialSubscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (parseFloat(s.gross_amount as any) > 0 ? parseFloat(s.gross_amount as any) : parseFloat(s.plan.price)), 0)) + totalWalkInRevenue;

  const pendingRevenue = filteredFinancialSubscriptions
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + (parseFloat(s.gross_amount as any) > 0 ? parseFloat(s.gross_amount as any) : parseFloat(s.plan.price)), 0);

  // Combine subscription transactions with walk-in guest logs
  const financialJournalList = [
    ...filteredFinancialSubscriptions.filter(s => s.status === 'active').map(s => {
      const isPtOnly = new Date(s.end_date).getTime() - new Date(s.start_date).getTime() < 5 * 24 * 60 * 60 * 1000;
      return {
        id: `sub-${s.id}`,
        date: new Date(s.created_at),
        clientName: s.user.name,
        clientPhone: s.user.whatsapp || '-',
        packageName: isPtOnly ? 'Paket PT' : `${s.plan.name}${s.trainer_end_date ? ` (+ PT Aktif hingga )` : ''}`,
        type: isPtOnly ? 'pt' : 'membership',
        method: s.order_id && s.order_id.includes('mock') ? 'Simulator' : 'Midtrans Gate',
        amount: parseFloat(s.gross_amount as any) > 0 ? parseFloat(s.gross_amount as any) : parseFloat(s.plan.price)
      };
    }),
    ...walkIns.map(w => ({
      id: `walk-${w.id}`,
      date: new Date(w.visit_date),
      clientName: w.name,
      clientPhone: w.whatsapp || '-',
      packageName: 'Kunjungan Harian (Walk-In)',
      type: 'walk-in',
      method: 'Manual/Cash',
      amount: parseFloat(w.amount || '0')
    }))
  ];

  // Apply search/filtering or sorting
  const sortedJournalList = financialJournalList.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const filteredJournalList = sortedJournalList.filter(item => {
    if (finTab === 'all') return true;
    return item.type === finTab;
  });

  const exportToCSV = () => {
    const headers = ['Tanggal Jurnal', 'Nama Member/Tamu', 'WhatsApp', 'Jenis Paket', 'Metode Verifikasi', 'Nominal Masuk'];
    const rows = filteredJournalList.map(item => {
      const tanggal = item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      return [`"${tanggal}"`, `"${item.clientName}"`, `"${item.clientPhone}"`, `"${item.packageName}"`, `"${item.method}"`, item.amount];
    });
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Keuangan_PredatorGym_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const tableRows = filteredJournalList.map(item => {
      const tanggal = item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      return `
        <tr>
          <td>${tanggal}</td>
          <td>${item.clientName}<br/><small style="color: #666;">WA: ${item.clientPhone}</small></td>
          <td>${item.packageName}</td>
          <td>${item.method}</td>
          <td style="text-align: right; font-weight: bold; color: #16a34a;">Rp ${item.amount.toLocaleString('id-ID')}</td>
        </tr>
      `;
    }).join('');

    const filterInfo = `
      <div style="margin-bottom: 20px; font-size: 14px; color: #444; border-bottom: 2px solid #ccc; padding-bottom: 10px;">
        <strong>Kriteria Filter:</strong><br/>
        Tipe Paket: ${finTab === 'all' ? 'Semua Paket' : finTab === 'membership' ? 'Membership Only' : finTab === 'pt' ? 'Personal Trainer Only' : finTab === 'walk-in' ? 'Walk-In Guest Only' : finTab}<br/>
        Periode: ${startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Semua'} s/d ${endDate ? new Date(endDate).toLocaleDateString('id-ID') : 'Hari Ini'}
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Keuangan - Predator Gym</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #333; }
            h1 { text-transform: uppercase; margin-bottom: 5px; font-weight: 800; letter-spacing: 1px; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; color: #eab308; text-transform: uppercase; }
            .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            .card span { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .card h3 { margin: 5px 0 0 0; font-size: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #1e293b; color: white; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            tr:nth-child(even) { background: #f8fafc; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>Laporan Keuangan</h1>
              <div style="font-size: 14px; color: #666;">Predator Gym Portal</div>
            </div>
            <div class="logo">Predator Gym</div>
          </div>
          
          ${filterInfo}
          
          <div class="summary-cards">
            <div class="card">
              <span>Total Omzet Bersih</span>
              <h3 style="color: #16a34a;">Rp ${totalFinancialRevenue.toLocaleString('id-ID')}</h3>
            </div>
            <div class="card">
              <span>Pendapatan Tertunda</span>
              <h3 style="color: #eab308;">Rp ${pendingRevenue.toLocaleString('id-ID')}</h3>
            </div>
            <div class="card">
              <span>Transaksi Lunas</span>
              <h3>${filteredJournalList.length}</h3>
            </div>
          </div>

          <h3>Jurnal Arus Kas Masuk (Lunas)</h3>
          <table>
            <thead>
              <tr>
                <th>Tanggal Jurnal</th>
                <th>Klien / Member</th>
                <th>Jenis Paket</th>
                <th>Metode</th>
                <th style="text-align: right;">Nominal Masuk</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="5" style="text-align: center; color: #999;">Tidak ada data transaksi lunas.</td></tr>'}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white flex flex-col md:flex-row relative overflow-x-hidden">

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden bg-[#111625] border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <PredatorGymLogo size={36} />
          <div>
            <h2 className="font-black text-sm tracking-wider uppercase leading-none">PREDATOR GYM</h2>
            <span className="text-[8px] text-yellow-500 font-bold tracking-widest uppercase">Owner Portal</span>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-400 hover:text-white cursor-pointer"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed md:sticky top-0 bottom-0 left-0 w-64 bg-[#111625]/95 border-r border-gray-800 p-6 flex flex-col justify-between shrink-0 h-screen z-50 md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 mb-10 pt-2">
            <PredatorGymLogo size={44} />
            <div>
              <h2 className="font-black text-lg tracking-wider uppercase leading-none">PREDATOR GYM</h2>
              <span className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase">Owner Portal</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer ${activeTab === 'dashboard'
                  ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.25)]'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
            >
              <LayoutDashboard size={18} />
              Dashboard Owner
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer ${activeTab === 'transactions'
                  ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.25)]'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
            >
              <Receipt size={18} />
              Transaksi
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer ${activeTab === 'members'
                  ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.25)]'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
            >
              <UserCheck size={18} />
              Data Member
            </button>

            <button
              onClick={() => setActiveTab('employees')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer ${activeTab === 'employees'
                  ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.25)]'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
            >
              <UserCog size={18} />
              Data Karyawan
            </button>

            <button
              onClick={() => setActiveTab('walk-ins')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer ${activeTab === 'walk-ins'
                  ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.25)]'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
            >
              <DoorOpen size={18} />
              Kunjungan Harian (Walk-In)
            </button>



            <button
              onClick={() => setActiveTab('gym-features')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer ${activeTab === 'gym-features'
                  ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.25)]'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
            >
              <Dumbbell size={18} />
              Fasilitas & Alat Gym
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold cursor-pointer ${activeTab === 'financials'
                  ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.25)]'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
                }`}
            >
              <LineChart size={18} />
              Laporan Keuangan
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-gray-800 mt-6 md:mt-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl cursor-pointer"
          >
            <LogOut size={18} />
            Keluar Portal
          </button>
        </div>
      </aside>

      {/* MAIN MAIN CONTENT CONTAINER */}
      <main className="flex-grow p-4 sm:p-8 md:p-10 overflow-y-auto h-[calc(100vh-72px)] md:h-screen">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-[#1e1e24]/60 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-yellow-500"></div>
          <div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-yellow-500" />
              <span className="text-yellow-500 font-bold tracking-widest text-[10px] uppercase">
                {activeTab === 'dashboard' && 'Owner Overview'}
                {activeTab === 'transactions' && 'Billing & Membership Logs'}
                {activeTab === 'members' && 'Client Relationship Records'}
                {activeTab === 'employees' && 'Personal Trainers & Staff Management'}
                {activeTab === 'financials' && 'Financial Audits & Revenue Charts'}
                {activeTab === 'gym-features' && 'Gym Facilities & Equipments Management'}
                {activeTab === 'walk-ins' && 'Walk-In Daily Visitor Records'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide mt-1">
              {activeTab === 'dashboard' && 'Dashboard Owner'}
              {activeTab === 'transactions' && 'Manajemen Transaksi'}
              {activeTab === 'members' && 'Database Member'}
              {activeTab === 'employees' && 'Karyawan & Trainer'}
              {activeTab === 'financials' && 'Laporan Keuangan'}
              {activeTab === 'gym-features' && 'Fasilitas & Alat Gym'}
              {activeTab === 'walk-ins' && 'Kunjungan Harian (Walk-In)'}
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5">
              {activeTab === 'dashboard' && 'Kelola statistik gym, dan ringkasan aktivitas terbaru Anda.'}
              {activeTab === 'transactions' && 'Validasi, cek, dan perbarui status pembayaran membership secara manual.'}
              {activeTab === 'members' && 'Pantau seluruh data member aktif, informasi kontak, dan riwayat paket mereka.'}
              {activeTab === 'employees' && 'Tambahkan dan moderasi profil pelatih personal trainer (Karyawan) yang bertugas.'}
              {activeTab === 'financials' && 'Pantau analisis laba, pendapatan tertunda, serta laporan rincian paket.'}
              {activeTab === 'gym-features' && 'Kelola daftar fasilitas tempat gym dan peralatan kebugaran untuk publik.'}
              {activeTab === 'walk-ins' && 'Catat tamu harian non-member dan pantau total omzet masuk dari tiket masuk.'}
            </p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Sparkles className="text-yellow-500" size={18} />
            <div className="text-right">
              <span className="text-[10px] text-gray-400 block font-bold">System Status</span>
              <span className="text-xs font-black text-yellow-500 uppercase">Sandbox Online</span>
            </div>
          </div>
        </div>

        {/* -------------------- TAB CONTENT: DASHBOARD -------------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            {/* Quick Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Member</span>
                    <Users className="text-yellow-500" size={20} />
                  </div>
                  <h3 className="text-3xl font-black text-white mt-4">{stats.total_members}</h3>
                </div>

                <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Trainer</span>
                    <Award className="text-yellow-500" size={20} />
                  </div>
                  <h3 className="text-3xl font-black text-white mt-4">{stats.total_trainers}</h3>
                </div>

                <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pending Booking</span>
                    <Calendar className="text-yellow-500" size={20} />
                  </div>
                  <h3 className="text-3xl font-black text-yellow-500 mt-4">{stats.pending_bookings}</h3>
                </div>

                <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Booking Selesai</span>
                    <Check className="text-green-500" size={20} />
                  </div>
                  <h3 className="text-3xl font-black text-green-500 mt-4">{stats.approved_bookings}</h3>
                </div>

                <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Pendapatan</span>
                    <DollarSign className="text-green-500" size={20} />
                  </div>
                  <h3 className="text-2xl font-black text-green-400 mt-4">
                    Rp {stats.total_revenue.toLocaleString('id-ID')}
                  </h3>
                </div>
              </div>
            )}

            {/* Main Bookings Panel */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-extrabold text-white mb-6 tracking-wide border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                <CalendarDays size={20} className="text-yellow-500" />
                Permintaan Latihan Trainer Masuk
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-4">Pelatih</th>
                      <th className="py-3 px-4">Tanggal Booking</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40 text-sm">
                    {bookings.length > 0 ? (
                      bookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-800/20">
                          <td className="py-4 px-4 font-medium">
                            <div className="text-white font-bold">{b.user.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">WhatsApp: {b.user.whatsapp}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-300 font-medium">{b.trainer.name}</td>
                          <td className="py-4 px-4 text-gray-400">
                            {new Date(b.booking_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} <br/>
                            <span className="text-gray-400 text-xs font-normal">Pukul {b.booking_time ? b.booking_time.slice(0, 5) : '-'}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full ${b.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                b.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              }`}>
                              {b.status === 'approved' ? 'Disetujui' : b.status === 'cancelled' ? 'Dibatalkan' : 'Menunggu'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {b.status === 'pending' ? (
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'approved')}
                                  className="w-8 h-8 rounded-lg bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white flex items-center justify-center cursor-pointer border border-green-500/20"
                                  title="Setujui Booking"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center cursor-pointer border border-red-500/20"
                                  title="Batalkan Booking"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500 italic">Selesai diproses</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">Belum ada pesanan latihan yang terdaftar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: TRANSAKSI -------------------- */}
        {activeTab === 'transactions' && (
          <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">

            {/* Filter Tools */}
            <div className="bg-[#303038]/20 p-5 rounded-2xl border border-gray-800/60 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h2 className="text-lg font-extrabold text-white tracking-wide border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                  <Receipt size={18} className="text-yellow-500" />
                  Catatan & Verifikasi Transaksi {transTab === 'membership' ? 'Membership' : 'Personal Trainer'}
                </h2>

                {/* Reset button if filters active */}
                {(transSearch || startDate || endDate) && (
                  <button
                    onClick={() => {
                      setTransSearch('');
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="text-xs text-yellow-500 hover:underline font-bold flex items-center gap-1.5 cursor-pointer ml-auto lg:ml-0"
                  >
                    <X size={14} />
                    Bersihkan Filter
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Text */}
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cari Order ID atau nama member..."
                    value={transSearch}
                    onChange={(e) => setTransSearch(e.target.value)}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs rounded-xl pl-11 pr-4 py-3 outline-none"
                  />
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-2 bg-[#303038]/50 border border-gray-800 rounded-xl px-4 py-1.5 focus-within:border-yellow-500">
                  <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">Dari:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent text-white text-xs outline-none w-full cursor-pointer invert-[0.8] sepia-[0.3] hue-rotate-[180deg]"
                  />
                </div>

                {/* End Date */}
                <div className="flex items-center gap-2 bg-[#303038]/50 border border-gray-800 rounded-xl px-4 py-1.5 focus-within:border-yellow-500">
                  <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">Sampai:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-transparent text-white text-xs outline-none w-full cursor-pointer invert-[0.8] sepia-[0.3] hue-rotate-[180deg]"
                  />
                </div>
              </div>
            </div>

            {/* Nested Tabs for Transactions */}
            <div className="flex gap-2 border-b border-gray-800 pb-2">
              <button
                onClick={() => setTransTab('membership')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${transTab === 'membership' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'}`}
              >
                Membership
              </button>
              <button
                onClick={() => setTransTab('pt')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${transTab === 'pt' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'}`}
              >
                Personal Trainer
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Paket & Durasi</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Verifikasi Manual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40 text-sm">
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map(s => (
                      <tr key={s.id} className="hover:bg-gray-800/20">
                        <td className="py-4 px-4 text-gray-400 text-xs font-medium">
                          {new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 font-mono text-xs text-yellow-500 font-bold">
                          {s.order_id || `SUB-${s.id}`}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-white">{s.user.name}</div>
                          <div className="text-xs text-gray-500">Email: {s.user.email}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {new Date(s.end_date).getTime() - new Date(s.start_date).getTime() < 5 * 24 * 60 * 60 * 1000 ? (
                            <div className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">Paket PT</div>
                          ) : (
                            <>
                              <div className="font-medium">{s.plan.name}</div>
                              <div className="text-xs text-gray-500">{s.plan.duration_months} Bulan</div>
                            </>
                          )}
                          {s.trainer_end_date && (
                            <div className="text-xs text-orange-400 font-bold mt-0.5">
                              + PT Aktif: {new Date(s.trainer_end_date).toLocaleDateString('id-ID')}
                            </div>
                          )}
                          {s.trainer && (
                            <div className="text-xs text-yellow-500 mt-1 font-semibold flex items-center gap-1">
                              <span>👩‍🏫 PT:</span>
                              <span>{s.trainer.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-bold">
                            Rp {(parseFloat((s.gross_amount ?? '0') as string) > 0 ? parseFloat((s.gross_amount ?? '0') as string) : parseFloat(s.plan.price)).toLocaleString('id-ID')}
                          </div>
                          {parseFloat((s.trainer_fee ?? '0') as string) > 0 && (
                            <div className="text-[10px] text-gray-500 font-bold mt-0.5">
                              (Inc. PT: Rp {parseFloat((s.trainer_fee ?? '0') as string).toLocaleString('id-ID')})
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block text-[10px] uppercase font-black px-2.5 py-1 rounded-full ${s.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              s.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                s.status === 'expired' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                                  'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {s.status === 'active' ? 'Aktif (Lunas)' : s.status === 'pending' ? 'Pending' : s.status === 'expired' ? 'Expired' : 'Batal'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {s.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdateSubscriptionStatus(s.id, 'active')}
                                className="px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500 border border-green-500/20 text-green-500 hover:text-black font-extrabold text-xs cursor-pointer"
                              >
                                Tandai Lunas
                              </button>
                              <button
                                onClick={() => handleUpdateSubscriptionStatus(s.id, 'cancelled')}
                                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white font-extrabold text-xs cursor-pointer"
                              >
                                Batalkan
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500 italic">Terverifikasi</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        {transSearch || startDate || endDate ? 'Tidak ada transaksi yang cocok.' : 'Belum ada transaksi membership.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: DATA MEMBER -------------------- */}
        {activeTab === 'members' && (
          <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">

            {/* Top Row and Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-extrabold text-white tracking-wide border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                <Users size={20} className="text-yellow-500" />
                Daftar Member Terdaftar
              </h2>
              <div className="relative w-full sm:w-80">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Cari nama atau email member..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl pl-12 pr-4 py-3 outline-none"
                />
              </div>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Lengkap</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">WhatsApp</th>
                    <th className="py-3 px-4">Bergabung Pada</th>
                    <th className="py-3 px-4 text-center">Status Membership</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40 text-sm">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map(m => {
                      const activeSub = m.subscriptions?.find((s: any) => s.status === 'active' && (new Date(s.end_date).getTime() - new Date(s.start_date).getTime() >= 5 * 24 * 60 * 60 * 1000));
                      return (
                        <tr key={m.id} className="hover:bg-gray-800/20">
                          <td className="py-4 px-4 font-bold text-white">{m.name}</td>
                          <td className="py-4 px-4 text-gray-300">{m.email}</td>
                          <td className="py-4 px-4 font-mono text-gray-400">
                            {m.whatsapp || '-'}
                          </td>
                          <td className="py-4 px-4 text-gray-400">
                            {new Date(m.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4 text-center">
                            {activeSub ? (
                              <span className="inline-block text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                Aktif ({activeSub.plan?.name})
                              </span>
                            ) : (
                              <span className="inline-block text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                Non-Aktif
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">
                        {memberSearch ? 'Tidak ada member yang cocok.' : 'Belum ada member yang terdaftar.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: EMPLOYEES (TRAINERS) -------------------- */}
        {activeTab === 'employees' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Form Tambah / Edit Karyawan */}
            <div className="lg:col-span-4 bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-extrabold text-white mb-6 tracking-wide border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                <Plus size={20} className="text-yellow-500" />
                {editingTrainer ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
              </h2>

              <form onSubmit={editingTrainer ? handleUpdateTrainer : handleAddTrainer} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Coach Budi"
                    value={trainerForm.name}
                    onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
                    className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl px-4 py-3.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Jabatan / Peran</label>
                  <select
                    value={trainerForm.role}
                    onChange={(e) => setTrainerForm({ ...trainerForm, role: e.target.value })}
                    className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl px-4 py-3.5 outline-none cursor-pointer"
                  >
                    <option value="trainer">Trainer (Instruktur Fitness)</option>
                    <option value="kasir">Kasir (Cashier)</option>
                    <option value="admin">Staff Admin</option>
                    <option value="other">Lainnya (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">
                    {trainerForm.role === 'trainer' ? 'Spesialisasi / Keahlian' : 'Shift / Bagian Tugas'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={trainerForm.role === 'trainer' ? 'Contoh: Yoga / CrossFit / Weightlifting' : 'Contoh: Shift Pagi / Kasir Utama / CS'}
                    value={trainerForm.specialization}
                    onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })}
                    className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl px-4 py-3.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">
                    {trainerForm.role === 'trainer' ? 'Deskripsi Profil & Kualifikasi' : 'Catatan / Keterangan Karyawan'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={trainerForm.role === 'trainer' ? 'Tulis deskripsi singkat mengenai lisensi & latar belakang pelatih...' : 'Tulis catatan tugas, riwayat singkat, atau keterangan penting lainnya...'}
                    value={trainerForm.description}
                    onChange={(e) => setTrainerForm({ ...trainerForm, description: e.target.value })}
                    className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl px-4 py-3.5 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">
                    {trainerForm.role === 'trainer' ? 'Sertifikasi / Tags (Pisahkan dengan koma)' : 'Keahlian Utama / Tool Kerja (Pisahkan dengan koma)'}
                  </label>
                  <input
                    type="text"
                    placeholder={trainerForm.role === 'trainer' ? 'Contoh: ACE-CPT, APKI, Nutrition' : 'Contoh: Excel, POS System, Komunikasi, Bahasa Inggris'}
                    value={trainerForm.tags}
                    onChange={(e) => setTrainerForm({ ...trainerForm, tags: e.target.value })}
                    className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl px-4 py-3.5 outline-none"
                  />
                </div>

                {/* Akun Login Trainer (hanya tampil jika role = trainer) */}
                {trainerForm.role === 'trainer' && (
                  <div className="border-t border-gray-800/60 pt-4 mt-1 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                      <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Akun Login Trainer</span>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Email Login</label>
                      <input
                        type="email"
                        placeholder="Contoh: budi@predatorgym.com (kosongkan untuk auto-generate)"
                        value={trainerForm.email}
                        onChange={(e) => setTrainerForm({ ...trainerForm, email: e.target.value })}
                        className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl px-4 py-3.5 outline-none"
                      />
                      <p className="text-[10px] text-gray-500 mt-1.5">Jika dikosongkan, email akan di-generate otomatis dari nama.</p>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2 text-xs font-bold uppercase">Password Login</label>
                      <input
                        type="password"
                        placeholder={editingTrainer ? 'Kosongkan jika tidak ingin mengubah password' : 'Kosongkan untuk default: password'}
                        value={trainerForm.password}
                        onChange={(e) => setTrainerForm({ ...trainerForm, password: e.target.value })}
                        className="w-full bg-[#303038]/60 border border-gray-800 focus:border-yellow-500 text-white text-sm rounded-xl px-4 py-3.5 outline-none"
                      />
                      <p className="text-[10px] text-gray-500 mt-1.5">{editingTrainer ? 'Isi hanya jika ingin mengganti password saat ini.' : 'Default password: password'}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingTrainer}
                    className="flex-grow btn-primary py-3.5 text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-yellow-500 to-amber-500 border-transparent shadow-none hover:scale-100 rounded-xl cursor-pointer"
                  >
                    {submittingTrainer ? 'Menyimpan...' : editingTrainer ? 'Simpan Perubahan' : 'Simpan Karyawan'}
                  </button>

                  {editingTrainer && (
                    <button
                      type="button"
                      onClick={cancelEditTrainer}
                      className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Daftar Karyawan & Filter */}
            <div className="lg:col-span-8 bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-5">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                  <Briefcase size={18} className="text-yellow-500" />
                  Database Karyawan Predator Gym
                </h3>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Semua Karyawan' },
                    { key: 'trainer', label: 'Trainer' },
                    { key: 'kasir', label: 'Kasir' },
                    { key: 'admin', label: 'Admin' },
                    { key: 'other', label: 'Lainnya' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setEmployeeRoleFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${employeeRoleFilter === tab.key
                          ? 'bg-yellow-500 text-black'
                          : 'bg-[#303038]/50 text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTrainers.length > 0 ? (
                  filteredTrainers.map(t => (
                    <div key={t.id} className="bg-[#303038]/30 p-4 rounded-xl border border-gray-800 flex justify-between items-center hover:bg-[#303038]/50 relative overflow-hidden">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">{t.name}</h4>
                          <span className={`inline-block text-[9px] uppercase font-black px-2 py-0.5 rounded-md ${t.role === 'trainer' || !t.role ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              t.role === 'kasir' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                t.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                  'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                            }`}>
                            {t.role === 'trainer' || !t.role ? 'Trainer' : t.role === 'kasir' ? 'Kasir' : t.role === 'admin' ? 'Admin' : 'Lainnya'}
                          </span>
                        </div>
                        <p className="text-xs text-yellow-500 font-semibold">
                          {t.role === 'trainer' || !t.role ? 'Spesialisasi: ' : 'Tugas/Shift: '}
                          {t.specialization}
                        </p>
                        <p className="text-[11px] text-gray-400 line-clamp-2 pr-8">{t.description || 'Tidak ada deskripsi profil.'}</p>

                        {(t.role === 'trainer' || !t.role) && (
                          <div className="flex items-center gap-2 pt-1.5">
                            <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full font-bold">⭐ {t.rating}</span>
                            <span className="text-[10px] text-gray-500 font-bold">{t.reviews} Reviews</span>
                          </div>
                        )}

                        {t.user?.email && (
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[10px] text-gray-500 font-bold">Login:</span>
                            <span className="text-[10px] text-cyan-400 font-semibold">{t.user.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons (Edit & Delete) */}
                      <div className="flex flex-col gap-2 shrink-0 ml-4">
                        <button
                          onClick={() => startEditTrainer(t)}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white flex items-center justify-center cursor-pointer border border-blue-500/20"
                          title="Edit Karyawan"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTrainer(t.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center cursor-pointer border border-red-500/20"
                          title="Hapus Karyawan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center text-gray-500">Tidak ada karyawan yang terdaftar untuk jabatan ini.</div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* -------------------- TAB CONTENT: FINANCIALS -------------------- */}
        {activeTab === 'financials' && (
          <div className="space-y-8">

            {/* Filter Tools */}
            <div className="bg-[#1e1e24] p-6 rounded-3xl border border-gray-800 shadow-xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                  <TrendingUp size={18} className="text-yellow-500" />
                  Filter Laporan Keuangan
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {(startDate || endDate || finTab !== 'all') && (
                    <button
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setFinTab('all');
                      }}
                      className="text-xs text-yellow-500 hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <X size={14} />
                      Bersihkan Filter
                    </button>
                  )}
                  <button
                    onClick={exportToCSV}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    CSV
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    PDF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filter Tipe Paket */}
                <div className="flex items-center gap-2 bg-[#303038]/50 border border-gray-800 rounded-xl px-4 py-1.5 focus-within:border-yellow-500">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider shrink-0">Tipe:</span>
                  <select
                    value={finTab}
                    onChange={(e) => setFinTab(e.target.value as any)}
                    className="bg-transparent text-white text-xs outline-none w-full cursor-pointer font-bold"
                  >
                    <option value="all" className="bg-[#1e1e24] text-white">Semua Transaksi</option>
                    <option value="membership" className="bg-[#1e1e24] text-white">Membership Only</option>
                    <option value="pt" className="bg-[#1e1e24] text-white">Personal Trainer Only</option>
                    <option value="walk-in" className="bg-[#1e1e24] text-white">Kunjungan Tamu (Walk-In)</option>
                  </select>
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-2 bg-[#303038]/50 border border-gray-800 rounded-xl px-4 py-1.5 focus-within:border-yellow-500">
                  <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">Dari:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-transparent text-white text-xs outline-none w-full cursor-pointer invert-[0.8] sepia-[0.3] hue-rotate-[180deg]"
                  />
                </div>

                {/* End Date */}
                <div className="flex items-center gap-2 bg-[#303038]/50 border border-gray-800 rounded-xl px-4 py-1.5 focus-within:border-yellow-500">
                  <span className="text-[10px] text-gray-400 font-bold uppercase shrink-0">Sampai:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-transparent text-white text-xs outline-none w-full cursor-pointer invert-[0.8] sepia-[0.3] hue-rotate-[180deg]"
                  />
                </div>
              </div>
            </div>

            {/* Metric Banner Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Omzet Bersih</span>
                <h3 className="text-3xl font-black text-green-400 mt-2">
                  Rp {totalFinancialRevenue.toLocaleString('id-ID')}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Akumulasi seluruh transaksi lunas.</p>
              </div>

              <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pendapatan Tertunda (Pending)</span>
                <h3 className="text-3xl font-black text-yellow-500 mt-2">
                  Rp {pendingRevenue.toLocaleString('id-ID')}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Dana pendaftaran belum tervalidasi.</p>
              </div>

              <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 shadow-md">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Transaksi Lunas</span>
                <h3 className="text-3xl font-black text-white mt-2">
                  {filteredJournalList.length}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Jumlah kupon aktif lunas terjual.</p>
              </div>
            </div>

            {/* Income Statement Table */}
            <div className="bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                <TrendingUp size={18} className="text-yellow-500" />
                Jurnal Arus Kas Masuk (Lunas)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Tanggal Jurnal</th>
                      <th className="py-3 px-4">Klien / Member / Tamu</th>
                      <th className="py-3 px-4">Jenis Paket</th>
                      <th className="py-3 px-4">Metode Verifikasi</th>
                      <th className="py-3 px-4 text-right">Nominal Masuk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40 text-sm">
                    {filteredJournalList.length > 0 ? (
                      filteredJournalList.map(item => (
                        <tr key={item.id} className="hover:bg-gray-800/20">
                          <td className="py-4 px-4 text-gray-400">
                            {item.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-white uppercase tracking-wider">{item.clientName}</div>
                            <div className="text-xs text-gray-500">WA: {item.clientPhone}</div>
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {item.type === 'pt' ? (
                              <div className="font-bold text-orange-400 uppercase tracking-wider text-[10px]">Paket PT</div>
                            ) : item.type === 'walk-in' ? (
                              <div className="font-bold text-green-400 uppercase tracking-wider text-[10px]">Kunjungan Walk-In</div>
                            ) : (
                              <div className="font-medium">{item.packageName}</div>
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-400 flex items-center gap-2">
                            <CreditCard size={14} className={item.type === 'walk-in' ? 'text-green-400' : 'text-yellow-500'} />
                            {item.method}
                          </td>
                          <td className="py-4 px-4 text-right text-green-400 font-extrabold">
                            + Rp {item.amount.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">Belum ada dana masuk yang tercatat lunas.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}





        {/* -------------------- TAB CONTENT: GYM FEATURES (FASILITAS & ALAT) -------------------- */}
        {activeTab === 'gym-features' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Form Pendaftaran/Edit Item (Col 4) */}
            <div className="lg:col-span-4 bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3">
                {editingFeature ? 'Edit Item Fasilitas/Alat' : 'Tambah Item Baru'}
              </h3>

              <form onSubmit={handleSaveFeature} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Nama Item</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Mushola Nyaman, Treadmill, dll."
                    value={featureForm.name}
                    onChange={(e) => setFeatureForm({ ...featureForm, name: e.target.value })}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Tipe Manajemen</label>
                  <select
                    value={featureForm.type}
                    onChange={(e) => setFeatureForm({ ...featureForm, type: e.target.value })}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none cursor-pointer"
                  >
                    <option value="facility">Fasilitas (Ruangan / Kenyamanan)</option>
                    <option value="equipment">Alat Gym (Peralatan Kebugaran)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Pilih Icon Representasi</label>
                  <select
                    value={featureForm.icon}
                    onChange={(e) => setFeatureForm({ ...featureForm, icon: e.target.value })}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none cursor-pointer"
                  >
                    <option value="Dumbbell">🏋️ Dumbbell (Alat Beban)</option>
                    <option value="Users">👥 Users (Area Sosial/Grup)</option>
                    <option value="DoorOpen">🚪 DoorOpen (Ruang Kelas/Pintu)</option>
                    <option value="Droplet">💧 Droplet (Air Minum/Basah)</option>
                    <option value="Sofa">🛋️ Sofa (Comfort Lounge)</option>
                    <option value="Scale">⚖️ Scale (Timbangan Komposisi)</option>
                    <option value="ShowerHead">🚿 ShowerHead (Kamar Mandi/Shower)</option>
                    <option value="Lock">🔒 Lock (Loker/Aman)</option>
                    <option value="Moon">🌙 Moon (Mushola/Ibadah)</option>
                    <option value="CircleParking">🅿️ Parking (Parkiran Luas)</option>
                    <option value="Bike">🚲 Bike (Cardio/Sepeda)</option>
                    <option value="Layers">🥞 Layers (Matras/Mat)</option>
                    <option value="MoreHorizontal">💬 More (Lain-lain)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Deskripsi / Keterangan</label>
                  <textarea
                    placeholder="Tulis deskripsi detail fasilitas atau daftar spesifikasi alat..."
                    rows={4}
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submittingFeature}
                    className="flex-grow btn-primary py-3.5 text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-yellow-500 to-amber-500 border-transparent shadow-none hover:scale-100 rounded-xl cursor-pointer"
                  >
                    {submittingFeature ? 'Menyimpan...' : editingFeature ? 'Simpan Perubahan' : 'Simpan Item'}
                  </button>

                  {editingFeature && (
                    <button
                      type="button"
                      onClick={cancelEditFeature}
                      className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Item Fasilitas & Alat (Col 8) */}
            <div className="lg:col-span-8 bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3 flex items-center gap-2">
                  <Dumbbell size={18} className="text-yellow-500" />
                  Daftar Fasilitas & Alat Gym
                </h3>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'Semua Item' },
                    { key: 'facility', label: 'Fasilitas' },
                    { key: 'equipment', label: 'Alat Gym' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFeatureFilter(tab.key as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${featureFilter === tab.key
                          ? 'bg-yellow-500 text-black'
                          : 'bg-[#303038]/50 text-gray-400 hover:text-white border border-gray-800'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 px-4 w-12 text-center">Icon</th>
                      <th className="py-3 px-4">Nama Item</th>
                      <th className="py-3 px-4">Tipe</th>
                      <th className="py-3 px-4">Deskripsi</th>
                      <th className="py-3 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40 text-sm">
                    {filteredGymFeatures.length > 0 ? (
                      filteredGymFeatures.map((item) => {
                        return (
                          <tr key={item.id} className="hover:bg-gray-800/20">
                            <td className="py-4 px-4 text-center text-yellow-500">
                              <span className="inline-block p-2.5 rounded-lg bg-[#303038]/50 border border-gray-800">
                                {item.icon === 'Users' && <Users size={16} />}
                                {item.icon === 'Dumbbell' && <Dumbbell size={16} />}
                                {item.icon === 'DoorOpen' && <DoorOpen size={16} />}
                                {item.icon === 'Droplet' && <Droplet size={16} />}
                                {item.icon === 'Sofa' && <Sofa size={16} />}
                                {item.icon === 'Scale' && <Scale size={16} />}
                                {item.icon === 'ShowerHead' && <ShowerHead size={16} />}
                                {item.icon === 'Lock' && <Lock size={16} />}
                                {item.icon === 'Moon' && <Moon size={16} />}
                                {item.icon === 'CircleParking' && <CircleParking size={16} />}
                                {item.icon === 'Bike' && <Bike size={16} />}
                                {item.icon === 'Layers' && <Layers size={16} />}
                                {item.icon === 'MoreHorizontal' && <MoreHorizontal size={16} />}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bold text-white uppercase tracking-wider">
                              {item.name}
                            </td>
                            <td className="py-4 px-4 font-semibold">
                              <span className={`inline-block text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${item.type === 'facility'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                  : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                }`}>
                                {item.type === 'facility' ? 'Fasilitas' : 'Alat Gym'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-300 font-medium max-w-xs truncate">
                              {item.description || '-'}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => startEditFeature(item)}
                                  className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white flex items-center justify-center cursor-pointer border border-[#3b82f6]/20"
                                  title="Edit Item"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteFeature(item.id)}
                                  className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center cursor-pointer border border-red-500/20"
                                  title="Hapus Item"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">Belum ada item terdaftar. Tambahkan satu di sebelah kiri.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: WALK-INS (KUNJUNGAN HARIAN) -------------------- */}
        {activeTab === 'walk-ins' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Catat Kunjungan (Col 4) */}
            <div className="lg:col-span-4 bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3">
                Catat Kunjungan Baru
              </h3>

              <form onSubmit={handleWalkInSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso"
                    value={walkInForm.name}
                    onChange={(e) => setWalkInForm({ ...walkInForm, name: e.target.value })}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Nomor WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={walkInForm.whatsapp}
                    onChange={(e) => setWalkInForm({ ...walkInForm, whatsapp: e.target.value })}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    required
                    value={walkInForm.visit_date}
                    onChange={(e) => setWalkInForm({ ...walkInForm, visit_date: e.target.value })}
                    className="w-full bg-[#303038]/50 border border-gray-800 focus:border-yellow-500 text-white text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Biaya Kunjungan</label>
                  <input
                    type="text"
                    disabled
                    value="Rp 15.000 (Default)"
                    className="w-full bg-[#303038]/30 border border-gray-800 text-gray-500 text-xs md:text-sm rounded-xl px-4 py-3.5 outline-none cursor-not-allowed font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingWalkIn}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submittingWalkIn ? 'Menyimpan...' : 'Catat Kunjungan'}
                </button>
              </form>
            </div>

            {/* List Kunjungan Harian (Col 8) */}
            <div className="lg:col-span-8 bg-[#1e1e24] p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3">
                  Riwayat Tamu Harian (Walk-In)
                </h3>
                <div className="bg-[#303038]/50 border border-gray-800 px-4 py-2 rounded-2xl flex items-center gap-4.5">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-400 block leading-tight">Total Pendapatan Walk-In</span>
                    <span className="text-green-400 font-black text-sm">
                      Rp {(walkIns.reduce((sum, w) => sum + parseFloat(w.amount), 0)).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-wider">
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Nama Tamu</th>
                      <th className="py-3 px-4">No. WhatsApp</th>
                      <th className="py-3 px-4">Biaya Masuk</th>
                      <th className="py-3 px-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/40 text-sm">
                    {walkIns.length > 0 ? (
                      walkIns.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-800/20">
                          <td className="py-4 px-4 text-gray-400">
                            {new Date(item.visit_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-4 px-4 font-bold text-white uppercase tracking-wider">
                            {item.name}
                          </td>
                          <td className="py-4 px-4 text-gray-300 font-mono">
                            {item.whatsapp || '-'}
                          </td>
                          <td className="py-4 px-4 font-semibold text-green-400">
                            Rp {parseFloat(item.amount).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleWalkInDelete(item.id)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center cursor-pointer border border-red-500/20 transition-all"
                              title="Hapus Log"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">Belum ada kunjungan walk-in terdaftar.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}



