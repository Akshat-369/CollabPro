import React from 'react';
import { MapPin, Briefcase, IndianRupee, RotateCcw } from 'lucide-react';
import { Job } from '../../../../Data/jobs';

interface OverviewTabProps {
  job: Job;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ job }) => {
  return (
    <div className="flex flex-col gap-10">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
               { icon: MapPin, label: 'Location', value: job.location },
               { icon: Briefcase, label: 'Experience', value: job.experience },
               { icon: IndianRupee, label: 'Price', value: job.price.replace('₹', '') },
               { icon: RotateCcw, label: 'Project Type', value: job.projectType }
           ].map((item, i) => (
                <div key={i} className="bg-mine-shaft-900 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:border-bright-sun-500/30 border border-mine-shaft-800 transition-all py-6 group">
                    <div className="w-12 h-12 rounded-full bg-mine-shaft-800 flex items-center justify-center text-bright-sun-400 group-hover:scale-110 transition-transform"><item.icon size={24} /></div>
                    <div><div className="text-xs text-mine-shaft-400 mb-1">{item.label}</div><div className="font-bold text-mine-shaft-50 text-lg">{item.value}</div></div>
                </div>
           ))}
       </div>

       <div className="space-y-10 max-w-5xl">
           <section>
               <h2 className="text-2xl font-bold text-mine-shaft-50 mb-4">Required Skills</h2>
               <div className="flex flex-wrap gap-3">
                   {job.tags.map((tag, i) => (
                       <span key={i} className="bg-mine-shaft-900 text-bright-sun-400 border border-mine-shaft-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-bright-sun-400 hover:text-black transition-colors cursor-pointer">{tag}</span>
                   ))}
               </div>
           </section>
           
           <section>
               <h2 className="text-2xl font-bold text-mine-shaft-50 mb-4">About The Project</h2>
               <div 
                  className="text-mine-shaft-300 leading-relaxed text-base prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.longDescription }}
               />
           </section>
           
           <section>
               <h2 className="text-2xl font-bold text-mine-shaft-50 mb-4">Responsibilities</h2>
               {job.requirements && job.requirements.length > 0 ? (
                   <ul className="space-y-3 list-disc pl-5 text-mine-shaft-300 text-base">
                       {job.requirements.map((req, index) => (
                           <li key={index}>{req}</li>
                       ))}
                   </ul>
               ) : (
                   <p className="text-mine-shaft-400 italic">No specific responsibilities listed.</p>
               )}
           </section>
       </div>
    </div>
  );
};

export default OverviewTab;