import React from 'react';
import { FileText, Monitor, CheckCircle } from 'lucide-react';
import { Step } from '../../../../Data/types';
import { IMAGES } from '../../../../Data/images';
import WorkingImage from "../../images/Girl.png";

const steps: Step[] = [
  { id: '1', title: 'Build Your Resume', description: 'Create a standout resume with your skills.', icon: FileText },
  { id: '2', title: 'Apply for project', description: 'Find and apply for projects that match your skills.', icon: Monitor },
  { id: '3', title: 'Get Hired', description: 'Connect with clients and start your new project.', icon: CheckCircle },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-mine-shaft-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-mine-shaft-50 mb-3">
            How it <span className="text-bright-sun-400">Works</span>
          </h2>
          <p className="text-mine-shaft-300">
            Effortlessly navigate through the process and land your dream project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-mine-shaft-700/30 rounded-full blur-3xl"></div>
             
             <div className="absolute top-20 right-10 z-20 bg-mine-shaft-800 border border-mine-shaft-600 p-4 rounded-xl shadow-xl w-40 text-center animate-pulse">
                <div className="w-12 h-12 rounded-full bg-pink-400 mx-auto mb-2 overflow-hidden">
                     <img src={IMAGES.profileComplete} alt="Profile" className="w-full h-full object-cover"/>
                </div>
                <p className="text-mine-shaft-50 text-xs font-bold mb-1">Complete your profile</p>
                <div className="w-full bg-mine-shaft-950 h-1.5 rounded-full overflow-hidden">
                    <div className="w-[70%] h-full bg-bright-sun-400"></div>
                </div>
                <p className="text-[10px] text-mine-shaft-400 mt-1">70% completed</p>
             </div>

             <img 
               src={WorkingImage} 
               alt="Working" 
               className="relative z-10 w-3/4 md:w-2/3 lg:w-3/4 rounded-3xl shadow-2xl object-cover mask-image-gradient"
               style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
             />
          </div>

          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-bright-sun-400 flex items-center justify-center text-black group-hover:bg-mine-shaft-50 transition-colors duration-300">
                  <step.icon size={32} />
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-mine-shaft-50 mb-2">{step.title}</h3>
                  <p className="text-mine-shaft-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;