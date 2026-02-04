import React from 'react';
import { Users, FileText, AlertCircle } from 'lucide-react';
import { Job } from '../../../../Data/jobs';
import { Task } from '../../../../Data/types';
import { useUser } from '../../../../context/UserContext';

interface DashboardTabProps {
  job: Job;
  tasks: Task[];
}

const DashboardTab: React.FC<DashboardTabProps> = ({ job, tasks }) => {
  const { getJobApplications } = useUser();
  
  const totalTasks = tasks.filter(t => t.paymentStatus !== 'Received').length;
  const totalApplicants = job.applicants;
  const totalMembers = job.membersCount || 0;
  // Calculate incomplete tasks from current tasks array for real-time updates
  const incompleteTasks = tasks.filter(t => t.status !== 'Approved').length;

  const stats = [
    { label: 'Total Task', value: totalTasks, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Applicants', value: totalApplicants, icon: Users, color: 'text-bright-sun-400', bg: 'bg-bright-sun-400/10' },
    { label: 'Total Members', value: totalMembers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Incomplete Task', value: incompleteTasks, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  const statusCounts = {
    'To Do': tasks.filter(t => t.status === 'To Do').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    'Done': tasks.filter(t => t.status === 'Done').length,
    'Approved': tasks.filter(t => t.status === 'Approved').length,
  };

  const statuses = ['To Do', 'In Progress', 'Done', 'Approved'];
  const maxCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-6 hover:border-bright-sun-500/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h4 className="text-3xl font-bold text-mine-shaft-50 mb-1">{stat.value}</h4>
            <p className="text-sm text-mine-shaft-400">{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-mine-shaft-50 mb-8">Task by Status</h3>
        <div className="h-64 flex items-end justify-between gap-6 md:px-10">
          {statuses.map((status) => {
             const count = statusCounts[status as keyof typeof statusCounts];
             const heightPercent = (count / maxCount) * 100;
             return (
               <div key={status} className="flex flex-col items-center gap-3 w-full h-full justify-end group">
                  <div className="w-full bg-mine-shaft-800/50 rounded-t-lg relative h-full flex items-end overflow-hidden">
                     <div 
                        className="w-full bg-bright-sun-400/80 group-hover:bg-bright-sun-400 transition-all duration-500 rounded-t-lg flex items-end justify-center relative"
                        style={{ height: `${heightPercent}%` }}
                     >
                     </div>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-mine-shaft-50 mb-1">{count}</span>
                    <span className="text-xs font-medium text-mine-shaft-400">{status}</span>
                  </div>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;