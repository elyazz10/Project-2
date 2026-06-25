import React from 'react';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative container mx-auto px-4 py-8">
      {/* Vertical line - hidden on mobile, visible on md and up */}
      <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gray-800 hidden md:block"></div>
      
      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Content box */}
            <div className="w-full md:w-1/2 mb-8 md:mb-0 relative px-4">
              <div className={`glass-card p-6 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </div>

            {/* Center dot/badge */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gym-bg border-4 border-gray-800 items-center justify-center z-10 text-gym-primary font-bold shadow-lg shadow-gym-primary/20">
              {item.year}
            </div>

            {/* Mobile year badge */}
            <div className="md:hidden inline-block px-4 py-1 rounded-full bg-gym-primary/20 text-gym-primary font-bold text-sm mb-4 border border-gym-primary/30">
              {item.year}
            </div>

            {/* Empty space for alternating layout */}
            <div className="hidden md:block w-1/2 px-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;

