import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Clock } from 'lucide-react';
import { Job } from '../../../../Data/jobs';

interface RecommendedProjectCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: () => void;
  historyStack: string[];
}

const RecommendedProjectCard: React.FC<RecommendedProjectCardProps> = ({ job, isSaved, onToggleSave, historyStack }) => {
  const location = useLocation();

  return (
    <Link 
      to={`/project/${job.id}`} 
      state={{ historyStack: [...historyStack, location.pathname] }}
      className="bg-mine-shaft-900 p-5 rounded-2xl border border-mine-shaft-800 hover:border-bright-sun-400 hover:shadow-lg hover:shadow-bright-sun-400/5 transition-all cursor-pointer group block"
    >
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="font-bold text-mine-shaft-50 text-base group-hover:text-bright-sun-400 transition-colors">{job.title}</h3>
                <div className="text-xs text-mine-shaft-400 mt-1">{job.applicants} Applicants</div>
            </div>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleSave();
                }}
                className="p-1 -mr-1 text-mine-shaft-400 hover:text-bright-sun-400 transition-colors rounded-full hover:bg-mine-shaft-800"
                title={isSaved ? "Unsave Project" : "Save Project"}
            >
                <Bookmark size={18} className={isSaved ? "fill-bright-sun-400 text-bright-sun-400" : ""} />
            </button>
        </div>
        <div className="flex flex-wrap gap-2 my-4">
             {[job.experience, job.projectType, job.location].filter(Boolean).map((info, i) => (
                <span key={i} className="bg-mine-shaft-800 text-bright-sun-400 px-2 py-1 rounded-lg text-[10px] font-medium border border-mine-shaft-700">{info}</span>
            ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-mine-shaft-800">
            <div className="font-bold text-mine-shaft-50 text-base">{job.price}</div>
            <div className="flex items-center gap-1.5 text-[10px] text-mine-shaft-400">
                <Clock size={12} />{job.postedAgo}
            </div>
        </div>
    </Link>
  );
};

export default RecommendedProjectCard;