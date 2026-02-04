import React from 'react';
import { Clock, CheckCircle2, ChevronRight, Building2 } from 'lucide-react';
import { Job } from '../../../../Data/jobs';
import { useNavigate } from 'react-router-dom';

interface WorkerProjectCardProps {
  job: Job;
  status?: string;
}

const WorkerProjectCard: React.FC<WorkerProjectCardProps> = ({ job, status = 'hired' }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    switch (status) {
      case 'offered':
        return (
          <div className="bg-bright-sun-500/10 text-bright-sun-500 px-2.5 py-1 rounded-full text-[10px] font-bold border border-bright-sun-500/20 flex items-center gap-1 shrink-0">
             <CheckCircle2 size={12} /> Offered
          </div>
        );
      case 'invited':
        return (
          <div className="bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full text-[10px] font-bold border border-blue-500/20 flex items-center gap-1 shrink-0">
             <Clock size={12} /> Interview
          </div>
        );
      case 'applicants':
        return (
           <div className="bg-mine-shaft-700/50 text-mine-shaft-300 px-2.5 py-1 rounded-full text-[10px] font-bold border border-mine-shaft-600 flex items-center gap-1 shrink-0">
             <Clock size={12} /> Applied
           </div>
        );
      case 'hired':
      default:
        return (
          <div className="bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-[10px] font-bold border border-green-500/20 flex items-center gap-1 shrink-0">
              <CheckCircle2 size={12} /> Hired
          </div>
        );
    }
  };

  return (
    <div 
        onClick={() => navigate(`/manage/project/${job.id}`)}
        className="bg-mine-shaft-900 rounded-2xl p-6 border border-mine-shaft-800 flex flex-col h-full hover:border-bright-sun-500/50 hover:shadow-lg hover:shadow-bright-sun-500/10 cursor-pointer transition-all duration-300 group relative overflow-hidden"
    >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bright-sun-400 to-bright-sun-600"></div>

        <div className="flex justify-between items-start mb-2 mt-2">
            <h3 className="text-xl font-bold text-mine-shaft-50 group-hover:text-bright-sun-400 transition-colors line-clamp-1">{job.title}</h3>
            {getStatusBadge()}
        </div>
        
        <div className="flex items-center gap-2 mb-4 text-xs text-mine-shaft-400">
             <Building2 size={14} className="text-mine-shaft-500" />
             <span className="font-medium text-mine-shaft-300">{job.company}</span>
             <span className="text-mine-shaft-600">•</span>
             <span className="text-mine-shaft-400">{job.location}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
             {[job.experience, job.projectType, job.location].filter(Boolean).map((info, idx) => (
            <span key={idx} className="text-[10px] px-2 py-1 rounded-md font-medium text-mine-shaft-300 bg-mine-shaft-800 border border-mine-shaft-700">
                {info}
            </span>
            ))}
        </div>

        <p className="text-sm text-mine-shaft-400 mb-6 leading-relaxed line-clamp-2">
            {job.description}
        </p>

        <div className="mt-auto pt-4 border-t border-mine-shaft-800 flex justify-between items-center">
             <div>
                <div className="flex items-center gap-1 text-[10px] text-mine-shaft-500 mb-0.5">
                    <Clock size={10} /> Posted {job.postedAgo}
                </div>
                <div className="text-base font-bold text-mine-shaft-50">{job.price}</div>
             </div>
             <button className="w-8 h-8 rounded-full bg-mine-shaft-800 flex items-center justify-center text-mine-shaft-400 group-hover:bg-bright-sun-400 group-hover:text-black transition-colors">
                <ChevronRight size={18} />
             </button>
        </div>
    </div>
  );
};

export default WorkerProjectCard;