import React, { useState } from 'react';

const brands = [
  { name: 'Netflix', color: 'text-red-600' },
  { name: 'Meta', color: 'text-blue-500' },
  { name: 'Microsoft', color: 'text-gray-200' },
  { name: 'Pinterest', color: 'text-red-500' },
  { name: 'Slack', color: 'text-mine-shaft-50' },
  { name: 'Spotify', color: 'text-green-500' },
  { name: 'Oracle', color: 'text-red-700' },
];

const allBrands = [...brands, ...brands, ...brands, ...brands];

const TrustedBy: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-10 bg-mine-shaft-950 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-mine-shaft-50">
            Trusted by <span className="text-bright-sun-400">1000+</span> companies
          </h2>
        </div>
        
        <div 
          className="relative w-full overflow-hidden"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div 
            className="flex gap-16 w-max"
            style={{
              transform: 'translateX(-50%)',
              animation: `marquee 40s linear infinite ${isPaused ? 'paused' : 'running'}`,
            }}
          >
            {allBrands.map((brand, index) => (
              <div 
                key={`${brand.name}-${index}`} 
                className={`text-2xl font-bold ${brand.color} flex items-center gap-2 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer select-none`}
              >
                <div className="w-6 h-6 rounded bg-current opacity-20"></div>
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </section>
  );
};

export default TrustedBy;