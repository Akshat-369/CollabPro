import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../../layout/Footer';
import { Button } from '../../../../shared/ui/Button';
import { ArrowLeft, Clock, FileText, Users, LayoutDashboard, ListTodo, CreditCard, UserCheck } from 'lucide-react';
import OverviewTab from '../components/OverviewTab';
import ProposalsTab from '../../candidates/components/ProposalsTab';
import DashboardTab from '../../dashboard/components/DashboardTab';
import TaskBoard from '../../tasks/TaskBoard'; 
import MyTasksTab from '../../tasks/components/MyTasksTab';
import MembersTab from '../../team/components/MembersTab';
import PaymentTab from '../../payments/components/PaymentTab';
import WorkerPaymentTab from '../../payments/components/WorkerPaymentTab';
import { Task } from '../../../../Data/types';
import { useProject } from '../../../../context/ProjectContext';
import { useUser } from '../../../../context/UserContext';

const ProjectDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Fetch from context instead of static constant to see updates immediately
  const { getJob, refreshJob, getProjectTasks, refreshTasks, addTask, updateTask, deleteTask } = useProject();
  const { userProfile } = useUser();
  const job = id ? getJob(id) : undefined;
  
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch Tasks Dynamically
  const tasks = id ? getProjectTasks(id) : [];

  React.useEffect(() => {
    if (id) {
        refreshTasks(id);
        refreshJob(id);
    }
  }, [id, refreshTasks, refreshJob]);

  const handleTaskAdd = (task: Task) => {
      if (id) addTask(id, task);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
      if (id) updateTask(id, taskId, updates);
  };

  const handleTaskDelete = (taskId: string) => {
      if (id) deleteTask(id, taskId);
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
      if (id) updateTask(id, taskId, { status: newStatus });
  };

  const handlePayment = (taskId: string) => {
      if (id) updateTask(id, taskId, { paymentStatus: 'Paid' });
  };

  const handleWorkerPaymentStatusChange = (taskId: string, newStatus: 'Pending' | 'Received') => {
      if (id) updateTask(id, taskId, { paymentStatus: newStatus === 'Received' ? 'Done' : 'Pending' });
  };

  if (!job) return (
      <main className="flex-grow flex flex-col bg-mine-shaft-950 text-mine-shaft-50 font-sans min-h-screen">
        <div className="container mx-auto px-4 md:px-6 py-20 text-center"><h2 className="text-2xl font-bold mb-4">Project not found</h2><Button onClick={() => navigate('/manage')}>Back to Manage</Button></div>
        <Footer />
      </main>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'proposals', label: 'Proposals', icon: Users, hidden: !job.postedByMe },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'task', label: 'Task', icon: ListTodo },
    { id: 'my-task', label: 'My Task', icon: UserCheck, hidden: job.postedByMe }, // Hidden if I am the manager
    { id: 'members', label: 'Members', icon: Users },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ].filter(tab => !tab.hidden);

  return (
    <main className="flex-grow flex flex-col bg-mine-shaft-950 text-mine-shaft-50 font-sans transition-colors duration-300">
      <div className="bg-mine-shaft-900 border-b border-mine-shaft-800 pt-8 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
             <div className="flex items-center gap-4">
                <button onClick={() => navigate('/manage')} className="w-10 h-10 rounded-full bg-mine-shaft-900 border border-mine-shaft-700 flex items-center justify-center text-mine-shaft-300 hover:text-mine-shaft-50 hover:border-bright-sun-400 transition-all"><ArrowLeft size={20} /></button>
                <div>
                   <h1 className="text-2xl md:text-3xl font-bold text-mine-shaft-50">{job.title}</h1>
                   <div className="flex items-center gap-3 text-sm text-mine-shaft-400 mt-1">
                      <span className="flex items-center gap-1"><Clock size={14}/> Posted {job.postedAgo}</span>
                      <span className="w-1 h-1 rounded-full bg-mine-shaft-600"></span>
                      <span className={`font-medium px-2 py-0.5 rounded-full border text-xs ${job.status === 'Active' ? 'text-green-500 bg-green-500/10 border-green-500/20' : job.status === 'Closed' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-mine-shaft-300 bg-mine-shaft-700 border-mine-shaft-600'}`}>{job.status || 'Active'}</span>
                   </div>
                </div>
             </div>
             {job.postedByMe && (
                 <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/edit-project/${job.id}`)}>Edit Project</Button>
                 </div>
             )}
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
               <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.id ? 'border-bright-sun-400 text-bright-sun-400 bg-gradient-to-t from-bright-sun-400/10 to-transparent' : 'border-transparent text-mine-shaft-400 hover:text-mine-shaft-50 hover:bg-mine-shaft-800/50'}`}><tab.icon size={18} />{tab.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {activeTab === 'overview' && <OverviewTab job={job} />}
        {activeTab === 'proposals' && <ProposalsTab jobId={job.id} />}
        {activeTab === 'dashboard' && <DashboardTab job={job} tasks={tasks} />}
        {activeTab === 'task' && (
            <TaskBoard 
                initialTasks={tasks} 
                jobId={job.id} 
                onAddTask={handleTaskAdd}
                onUpdateTask={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
                isManager={job.postedByMe}
            />
        )}
        {activeTab === 'my-task' && (
            <MyTasksTab 
                activeProjectId={id}
                tasks={tasks} 
                currentUser={userProfile.name || "Marshal"} 
                currentUserEmail={userProfile.email}
                onUpdateTask={handleTaskUpdate}
            />
        )}
        {activeTab === 'members' && <MembersTab jobId={job.id} isManager={job.postedByMe} />}
        {activeTab === 'payment' && (
            job.postedByMe 
            ? <PaymentTab tasks={tasks} onStatusChange={handleStatusChange} onRefresh={() => id && refreshTasks(id)} />
            : <WorkerPaymentTab tasks={tasks} onRefresh={() => id && refreshTasks(id)} />
        )}
      </div>
      <Footer />
    </main>
  );
};

export default ProjectDashboardPage;