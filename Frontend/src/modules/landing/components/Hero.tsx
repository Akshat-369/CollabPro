import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../shared/ui/Button';
import { IMAGES } from '../../../../Data/images';
import BoyIcon from "../../images/Boy.png";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-6 pb-20 md:pt-12 md:pb-32 overflow-hidden bg-mine-shaft-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="z-10 lg:mt-20">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mine-shaft-50 leading-tight mb-6">
              Find your <span className="text-bright-sun-400">dream project</span> with us
            </h1>
            <p className="text-mine-shaft-300 text-lg mb-10 max-w-lg">
              Good career begins with good projects. Start exploring thousands of projects in one place.
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-bright-sun-500/20 rounded-full blur-[100px]">
            </div>

            <div className="absolute top-0 left-0 md:left-10 z-20 bg-mine-shaft-800/90 backdrop-blur border border-mine-shaft-700 p-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 rounded-lg bg-mine-shaft-700 flex items-center justify-center text-xl">⚓</div>
              <div>
                <p className="text-mine-shaft-50 text-sm font-semibold">CollabPro Project</p>
                <div className="flex items-center gap-2 text-[10px] text-mine-shaft-400">
                  <span>1 day ago</span>
                  <span>120 Applicants</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 right-0 md:right-10 z-20 bg-mine-shaft-800/90 backdrop-blur border border-mine-shaft-700 p-3 rounded-xl shadow-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="flex items-center gap-3 mb-2">
                   <p className="text-xs text-mine-shaft-300">10k+ got projects</p>
                </div>
                <div className="flex -space-x-2">
                   {IMAGES.applicants.map((src, i) => (
                     <img key={i} src={src} className="w-8 h-8 rounded-full border-2 border-mine-shaft-800 object-cover" alt="user"/>
                   ))}
                   <div className="w-8 h-8 rounded-full bg-bright-sun-500 border-2 border-mine-shaft-800 flex items-center justify-center text-[10px] font-bold text-white">+9k</div>
                </div>
            </div>

            <div className="relative z-10 w-[80%] md:w-[70%] lg:w-[90%] max-w-md mr-20">
                 <img 
                    src={BoyIcon} 
                    alt="Creative Developer" 
                    className="w-full h-auto drop-shadow-2xl object-contain"
                 />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;