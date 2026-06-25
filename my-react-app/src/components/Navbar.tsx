import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PredatorGymLogo } from '@/components/PredatorGymLogo';

const Navbar: React.FC = () => {
  console.log("NAVBAR RENDER");
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const [authState, setAuthState] = useState<{ loggedIn: boolean; dashboardUrl: string; isAdmin: boolean }>({
    loggedIn: false,
    dashboardUrl: '/login',
    isAdmin: false
  });

  // Chat Widget States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user) {
      let dashboardUrl = '/dashboard/member';
      if (user.role === 'admin') {
        dashboardUrl = '/dashboard/admin';
      } else if (user.role === 'owner') {
        dashboardUrl = '/dashboard/owner';
      }
      setAuthState({
        loggedIn: true,
        dashboardUrl,
        isAdmin: user.role === 'admin' || user.role === 'owner'
      });
    } else {
      setAuthState({
        loggedIn: false,
        dashboardUrl: '/login',
        isAdmin: false
      });
    }
  }, [pathname]);

  // Chat Polling
  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/member/chats?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMessages(prev => {
            const newMsgs = data.messages || [];
            if (prev.length > newMsgs.length) {
              return prev; // Preserve optimistic messages
            }
            return newMsgs;
          });
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          // count unread from admin/owner
          const unreads = (data.messages || []).filter((m: any) => m.sender_id !== user.id && !m.is_read).length;
          setUnreadCount(unreads);
          setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
        }
      }
    } catch (e) {
      console.error("Error fetching chats:", e);
    }
  }, []);

  useEffect(() => {
    if (authState.loggedIn && !authState.isAdmin) {
      fetchMessages();
      
      const channel = supabase
        .channel('member-chat-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
          fetchMessages();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [authState.loggedIn, authState.isAdmin, fetchMessages]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    const msgText = newMessage;
    setNewMessage('');
    
    // Optimistic Update
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const tempMsg = {
      id: Date.now(),
      sender_id: user.id,
      receiver_id: null,
      message: msgText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/member/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: msgText })
      });
      if (res.ok) {
        await fetchMessages();
      }
    } catch (e) {
      console.error("Error sending message:", e);
    }
  }, [newMessage, fetchMessages]);

  if (pathname && (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/dashboard/owner') || pathname.startsWith('/dashboard/trainer'))) {
    return null;
  }

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Membership', path: '/membership' },
    ...(authState.loggedIn && !authState.isAdmin ? [{ name: 'Riwayat', path: '/dashboard/member/history' }] : []),
    { name: 'Personal Trainer', path: '/personal-trainer' },
    { name: 'Lokasi', path: '/lokasi' },
    { name: 'BMI Checker', path: '/bmi-checker' },
    { name: 'Tentang Kami', path: '/tentang' },
  ];

  const isActive = (path: string) => pathname === path;

  // Format message time
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0B0F19] border-b border-gray-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 w-36 lg:w-48">
            <Link to="/" className="flex items-center gap-2 group">
              <PredatorGymLogo size={36} />
              <span className="text-lg lg:text-[22px] font-extrabold tracking-wide text-[#F97316] whitespace-nowrap">Predator Gym</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-3 lg:gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs lg:text-sm xl:text-[15px] font-semibold hover:text-[#F97316] tracking-wide whitespace-nowrap ${
                  isActive(link.path) ? 'text-[#F97316]' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex flex-shrink-0 w-auto justify-end items-center gap-2 lg:gap-3">
            {authState.loggedIn ? (
              <>
                {!authState.isAdmin && (
                  <button 
                    onClick={() => {
                      setIsChatOpen(!isChatOpen);
                      if (!isChatOpen) fetchMessages();
                    }}
                    className={`relative p-2.5 rounded-xl border cursor-pointer flex items-center justify-center ${
                      isChatOpen 
                        ? 'bg-gym-primary text-black border-gym-primary shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                        : 'bg-gray-800/80 text-gray-300 border-gray-700 hover:text-white hover:border-gray-600'
                    }`}
                    title="Chat Admin"
                  >
                    <MessageSquare size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}
                <Link to={authState.dashboardUrl} className="bg-gym-primary text-white font-bold py-2.5 px-6 rounded-xl hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] text-center text-sm">
                  {authState.isAdmin ? 'Dashboard' : 'Profile'}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-bold py-2.5 px-4 text-sm flex items-center justify-center">
                  Login
                </Link>
                <Link to="/register" className="bg-gym-primary text-white font-bold py-2.5 px-5 rounded-xl hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] text-center text-sm">
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#111827] border-b border-gray-800">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-gray-800 text-gym-primary'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-6 px-3 space-y-2">
              {authState.loggedIn ? (
                <div className="flex flex-col gap-2">
                  {!authState.isAdmin && (
                    <button 
                      onClick={() => {
                        setIsChatOpen(true);
                        setIsOpen(false);
                        fetchMessages();
                      }} 
                      className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white border border-gray-700 font-bold py-2.5 px-4 rounded-xl hover:bg-gray-700 text-sm cursor-pointer"
                    >
                      <MessageSquare size={18} />
                      Chat Admin {unreadCount > 0 && `(${unreadCount})`}
                    </button>
                  )}
                  <Link to={authState.dashboardUrl} onClick={() => setIsOpen(false)} className="btn-primary w-full text-center block text-sm">
                    {authState.isAdmin ? 'Dashboard' : 'Profile'}
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center block text-gray-300 hover:text-white py-2 text-sm font-bold">
                    Login Portal
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full text-center block text-sm">
                    Daftar Member Baru
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Widget (Member Only) */}
      {isChatOpen && authState.loggedIn && !authState.isAdmin && (
        <div className="fixed bottom-6 right-6 w-[340px] sm:w-[380px] h-[450px] bg-[#111827] border border-gray-800 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#1e293b] p-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full bg-gym-primary flex items-center justify-center text-black font-black text-xs">
                AD
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">CS Predator Gym</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[9px] text-gray-400 font-medium">Online</span>
                  </div>
                  {lastSyncTime && (
                    <span className="text-[8px] text-gray-500">Sync: {lastSyncTime}</span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)} 
              className="p-1.5 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0F19]/90 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-gym-primary/10 flex items-center justify-center text-gym-primary mb-2">
                  <MessageSquare size={24} />
                </div>
                <h5 className="font-extrabold text-sm text-white">Ada yang bisa dibantu?</h5>
                <p className="text-xs text-gray-400 max-w-[200px]">Kirim pesan di bawah untuk menghubungi customer service kami.</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender_id !== null && msg.sender_id !== undefined && msg.receiver_id === null;
                return (
                  <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMe 
                        ? 'bg-gym-primary text-black rounded-tr-none font-medium' 
                        : 'bg-gray-800 text-white rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed break-words">{msg.message}</p>
                      <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-black/60' : 'text-gray-400'}`}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#1e293b] border-t border-gray-800 flex gap-2">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tulis pesan Anda..."
              className="flex-1 bg-gray-900 border border-gray-800 focus:border-gym-primary text-white text-xs rounded-xl px-4 py-3 outline-none"
            />
            <button 
              type="submit" 
              className="w-10 h-10 bg-gym-primary hover:bg-orange-600 text-black flex items-center justify-center rounded-xl cursor-pointer shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
