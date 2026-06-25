import React from 'react';

interface PredatorGymLogoProps {
  className?: string;
  size?: number;
}

export const PredatorGymLogo: React.FC<PredatorGymLogoProps> = React.memo(({ className = '', size = 40 }) => {
  return (
    <div 
      className={`relative shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/images/logo.png"
        alt="Predator Gym Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
});

PredatorGymLogo.displayName = 'PredatorGymLogo';
