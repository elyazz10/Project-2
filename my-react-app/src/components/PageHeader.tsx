import React from 'react';

interface PageHeaderProps {
  title1: string;
  title2: string;
  subtitle: string;
  bgImage: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title1, title2, subtitle, bgImage }) => {
  return (
    <div className="relative w-full h-[320px] md:h-[380px] bg-[#111111] overflow-hidden flex items-center border-b border-[#222]">
      {/* Background Image on the right */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <div className="relative w-full md:w-3/5 h-full">
          <img 
            src={bgImage} 
            alt="Header Background" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-lighten"
          />
          {/* Gradients to fade the image horizontally and vertically */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-30"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white mb-4 tracking-tight leading-tight">
            {title1} <span className="text-[#F97316] font-medium">{title2}</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl font-light">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
