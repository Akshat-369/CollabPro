import React from 'react';
import { Clock, CheckCircle2, Archive, FileText } from 'lucide-react';
import { Job } from '../../../../Data/jobs';
import { useNavigate } from 'react-router-dom';

interface ManagerProjectCardProps {
  job: Job;
}

const ManagerProjectCard: React.FC<ManagerProjectCardProps> = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div 
        onClick={() => navigate(`/manage/project/${job.id}`)}
        className="bg-mine-shaft-900 rounded-2xl p-6 border border-mine-shaft-800 flex flex-col h-full hover:border-bright-sun-500/50 hover:shadow-lg hover:shadow-bright-sun-500/10 cursor-pointer transition-all duration-300 group relative overflow-hidden"
    >
        <div className={`absolute top-0 left-0 w-full h-1 ${job.status === 'Active' ? 'bg-green-500' : job.status === 'Closed' ? 'bg-red-500' : 'bg-mine-shaft-500'}`}></div>

        <div className="flex justify-between items-start mb-2 mt-2">
            <h3 className="text-2xl font-bold text-mine-shaft-50 group-hover:text-bright-sun-400 transition-colors">{job.title}</h3>
            {job.status === 'Active' && <CheckCircle2 size={20} className="text-green-500" />}
            {job.status === 'Closed' && <Archive size={20} className="text-red-500" />}
            {job.status === 'Draft' && <FileText size={20} className="text-mine-shaft-400" />}
        </div>
        
        <div className="flex justify-between items-center mb-4">
            <p className="text-xs text-mine-shaft-400">{job.applicants} Applicants</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${job.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : job.status === 'Closed' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-mine-shaft-700 text-mine-shaft-300 border-mine-shaft-600'}`}>
                {job.status || 'Active'}
            </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {[job.experience, job.projectType, job.location].filter(Boolean).map((info, idx) => (
            <span key={idx} className="text-[10px] px-3 py-1.5 rounded-lg font-medium text-bright-sun-400 bg-mine-shaft-800">
                {info}
            </span>
            ))}
        </div>

        <p className="text-sm text-mine-shaft-400 mb-6 leading-relaxed line-clamp-3">
            {job.description}
        </p>

        <div className="mt-auto">
            <div className="flex justify-between items-end">
            <span className="text-xl font-bold text-mine-shaft-50">{job.price}</span>
            <div className="flex items-center gap-1 text-xs text-mine-shaft-400">
                <Clock size={12} />
                <span>{job.postedAgo}</span>
            </div>
            </div>
        </div>
    </div>
  );
};

export default ManagerProjectCard;