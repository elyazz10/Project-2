import React from 'react';
import { Award } from 'lucide-react';

// Custom SVG Brand Icons since Lucide v1.x removed brand icons
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TrainerCardProps {
  name: string;
  specialization: string;
  image: string;
  description: string;
  tags: string[];
}

const TrainerCard: React.FC<TrainerCardProps> = ({ name, specialization, image, description, tags }) => {
  return (
    <div className="bg-[#303038] rounded-2xl overflow-hidden border border-gray-700 hover:border-[#F97316] group flex flex-col h-full hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]">
      {/* Image Section */}
      <div className="h-64 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent z-10"></div>
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover scale-100 group-hover:scale-105"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{name}</h3>
        <p className="text-[#F97316] text-[15px] font-medium mb-6">{specialization}</p>
        
        <p className="text-gray-300 leading-relaxed mb-8 flex-grow">
          {description}
        </p>

        {/* Certifications */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
             <Award size={18} className="text-gray-400" />
             <span className="text-sm text-gray-400">Sertifikasi</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span key={index} className="text-xs font-medium bg-[#454552] text-gray-300 px-4 py-1.5 rounded-full whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Social Icons */}
        <div className="flex gap-4 mt-auto">
          <a href="#" className="text-gray-400 hover:text-white p-1 border border-transparent hover:border-gray-500 rounded-md">
            <InstagramIcon />
          </a>
          <a href="#" className="text-gray-400 hover:text-white p-1 border border-transparent hover:border-gray-500 rounded-md">
            <LinkedinIcon />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrainerCard;

