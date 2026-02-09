import React from 'react';
import { Clock, Bookmark, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Job } from '../../../../Data/jobs';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProjectCardProps {
  job: Job;
  isSaved?: boolean;
  onToggleSaved?: () => void;
  interviewDetails?: {
      date: string;
      time: string;
  };
  isOffered?: boolean;
  onAcceptOffer?: () => void;
  onRejectOffer?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ job, isSaved = false, onToggleSaved, interviewDetails, isOffered, onAcceptOffer, onRejectOffer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    navigate(`/project/${job.id}`, { state: { historyStack: [location.pathname] } });
  };

  const formatDateDisplay = (dateStr: string) => {
      if (!dateStr) return '';
      // Format like: "August 21, 2024" to match CandidateCard
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTimeDisplay = (timeStr: string) => {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div 
        onClick={handleNavigate}
        className={`bg-mine-shaft-900 rounded-2xl p-5 border flex flex-col h-full transition-all duration-300 cursor-pointer group relative overflow-hidden
        ${isOffered ? 'border-bright-sun-400/50 shadow-lg shadow-bright-sun-400/5' : 'border-mine-shaft-800 hover:border-bright-sun-500/30'}`}
    >
        {/* Header: Title & Bookmark */}
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-bold text-mine-shaft-50 line-clamp-1 group-hover:text-bright-sun-400 transition-colors">{job.title}</h3>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleSaved) onToggleSaved();
                }}
                className={`transition-all duration-300 ${isSaved ? 'text-bright-sun-400' : 'text-mine-shaft-400 hover:text-mine-shaft-50'}`}
                title={isSaved ? "Remove from Saved" : "Save Project"}
            >
                <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
            </button>
        </div>

        {/* Applicants */}
        <p className="text-sm text-mine-shaft-400 mb-4">{job.applicants} Applicants</p>
        
        {/* Chips: Experience, Project Type, Location */}
        <div className="flex flex-wrap gap-2 mb-4">
            {[job.experience, job.projectType, job.location].filter(Boolean).map((info, idx) => (
            <span key={idx} className="text-[11px] px-3 py-1.5 rounded-lg font-medium text-bright-sun-400 bg-mine-shaft-800 border border-mine-shaft-700/50">
                {info}
            </span>
            ))}
        </div>

        {/* Description */}
        <p className="text-sm text-mine-shaft-300 mb-5 leading-relaxed line-clamp-2">
            {job.description}
        </p>

        {/* Divider */}
        <div className="h-px bg-mine-shaft-800 w-full mb-4"></div>

        {/* Footer: Price & Time */}
        <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold text-mine-shaft-50">
                {job.price} 
            </span>
            <div className="flex items-center gap-1.5 text-xs text-mine-shaft-400">
                <Clock size={14} />
                <span>Posted {job.postedAgo}</span>
            </div>
        </div>

        {/* Status Actions */}
        {isOffered ? (
             <div className="mt-4 flex gap-3">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onAcceptOffer && onAcceptOffer(); }}
                    className="flex-1 py-2.5 rounded-xl bg-bright-sun-400 text-black text-sm font-bold hover:bg-bright-sun-500 transition-all shadow-lg shadow-bright-sun-400/20 flex items-center justify-center gap-2"
                 >
                    <CheckCircle2 size={16} /> Accept
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onRejectOffer && onRejectOffer(); }}
                    className="flex-1 py-2.5 rounded-xl bg-mine-shaft-800 border border-mine-shaft-700 text-mine-shaft-300 text-sm font-bold hover:bg-mine-shaft-700 hover:text-white transition-all flex items-center justify-center gap-2"
                 >
                    <XCircle size={16} /> Reject
                 </button>
             </div>
        ) : interviewDetails ? (
            <div className="mt-3">
                <div className="flex items-center gap-2 text-xs text-mine-shaft-100 bg-mine-shaft-800/30 p-2 rounded-lg border-l-2 border-bright-sun-400">
                    <Calendar size={14} className="text-mine-shaft-400" />
                    <span>
                        Interview: <span className="text-mine-shaft-50">{formatDateDisplay(interviewDetails.date)}</span> at <span className="text-bright-sun-400 font-bold">{formatTimeDisplay(interviewDetails.time)}</span>
                    </span>
                </div>
            </div>
        ) : (
             <div className="mt-auto pt-2">
                <button className="w-full py-2.5 rounded-xl bg-mine-shaft-800 text-bright-sun-400 text-sm font-semibold hover:bg-bright-sun-400 hover:text-black transition-all duration-300">
                    View Project
                </button>
             </div>
        )}
    </div>
  );
};

export default ProjectCard;