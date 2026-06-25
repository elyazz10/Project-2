import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefits: string[];
  image: string;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ icon: Icon, title, description, benefits, image }) => {
  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 z-10"></div>
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-gym-primary p-2 rounded-lg z-20">
          <Icon className="text-white" size={24} />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
        
        <ul className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-center text-sm text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-gym-primary mr-2"></span>
              {benefit}
            </li>
          ))}
        </ul>
        
        <Button variant="outline" className="w-full">Pilih Program</Button>
      </div>
    </div>
  );
};

export default ProgramCard;

