import React from 'react';
import { MapPin, Phone, Mail, Dumbbell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PredatorGymLogo } from '@/components/PredatorGymLogo';

// Custom SVG Brand Icons since Lucide v1.x removed brand icons
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Footer: React.FC = () => {
  const { pathname } = useLocation();
  if (pathname && (pathname.startsWith('/dashboard/admin') || pathname.startsWith('/dashboard/owner') || pathname.startsWith('/dashboard/trainer'))) {
    return null;
  }

  return (
    <footer className="bg-[#0B0F19] border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand & Desc */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <PredatorGymLogo size={42} />
              <span className="text-2xl font-extrabold text-white tracking-tight">Predator<span className="text-gym-primary">Gym</span></span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">Transformasikan bentuk tubuhmu dan capai target kebugaran maksimal dengan fasilitas premium dan pelatih profesional kelas dunia.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gym-primary hover:text-white">
                <FacebookIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gym-primary hover:text-white">
                <TwitterIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gym-primary hover:text-white">
                <InstagramIcon />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gym-primary hover:text-white">
                <YoutubeIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Tautan Cepat</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-400 hover:text-gym-primary">Beranda</Link></li>
              <li><Link to="/membership" className="text-gray-400 hover:text-gym-primary">Membership</Link></li>
              <li><Link to="/personal-trainer" className="text-gray-400 hover:text-gym-primary">Personal Trainer</Link></li>
              <li><Link to="/lokasi" className="text-gray-400 hover:text-gym-primary">Lokasi</Link></li>
              <li><Link to="/bmi-checker" className="text-gray-400 hover:text-gym-primary">BMI Checker</Link></li>
              <li><Link to="/tentang" className="text-gray-400 hover:text-gym-primary">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-gym-primary flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-400">Jalan Pasir Randu No.10 RT 002/003, Jl. Pasir Randu No.10, RT.7/RW.2, Kadu, Kec. Curug, Kabupaten Tangerang, Banten 15810</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-gym-primary flex-shrink-0" size={20} />
                <span className="text-gray-400">087771736705</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-gym-primary flex-shrink-0" size={20} />
                <span className="text-gray-400">anomrizki74@gmail.com</span>
              </li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Predator Gym Premium Fitness. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>Powered by React & Vite & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
