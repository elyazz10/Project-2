import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FacilityCardProps {
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  image: string;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ icon: Icon, title, description, image }) => {
  return (
    <div className="relative group rounded-xl overflow-hidden cursor-pointer h-64">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent"></div>
      
      <div className="absolute inset-x-0 bottom-0 p-6 flex items-end">
        <div>
          <div className="bg-gym-primary/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-gym-primary border border-gym-primary/30 group-hover:bg-gym-primary group-hover:text-white">
            <Icon size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FacilityCard;

