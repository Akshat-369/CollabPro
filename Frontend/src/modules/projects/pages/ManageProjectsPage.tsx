import React, { useState, useMemo, useEffect } from 'react';
import Footer from '../../layout/Footer';
import { Activity, Briefcase, SlidersHorizontal, ChevronDown, FileText, Archive } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagerProjectCard from '../components/ManagerProjectCard';
import WorkerProjectCard from '../components/WorkerProjectCard';
import { useUser } from '../../../../context/UserContext';
import { useProject } from '../../../../context/ProjectContext';

const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
const parseTimeAgo = (timeStr: string) => {
  const value = parseInt(timeStr.replace(/[^0-9]/g, '')) || 0;
  if (timeStr.includes('hour')) return value;
  if (timeStr.includes('day')) return value * 24;
  if (timeStr.includes('week')) return value * 24 * 7;
  if (timeStr.includes('month')) return value * 24 * 30;
  return value * 24 * 365;
};

const ManageProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs: contextJobs } = useProject(); // Fetch from context
  const { getJobApplications, currentUserCandidateId, myApplications } = useUser();
  
  // Initialize tab state from location.state if present
  // Initialize state functions to read from localStorage
  const getPersistedState = (key: string, defaultValue: string) => {
    return localStorage.getItem(key) || defaultValue;
  };

  const [activeTab, setActiveTab] = useState(() => {
    // Priority: 1. Navigation State, 2. Local Storage, 3. Default
    if ((location.state as any)?.tab) return (location.state as any).tab;
    return getPersistedState('manage_activeTab', 'my-projects');
  });

  const [statusTab, setStatusTab] = useState<'Active' | 'Draft' | 'Closed'>(() => 
     getPersistedState('manage_statusTab', 'Active') as 'Active' | 'Draft' | 'Closed'
  );

  const [sortOption, setSortOption] = useState(() => getPersistedState('manage_sortOption', 'relevance'));
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Persist state changes
  useEffect(() => {
     localStorage.setItem('manage_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
     localStorage.setItem('manage_statusTab', statusTab);
  }, [statusTab]);

  useEffect(() => {
     localStorage.setItem('manage_sortOption', sortOption);
  }, [sortOption]);

  // Handle location state updates (e.g. redirection after creating project)
  useEffect(() => {
    if ((location.state as any)?.tab) {
        setActiveTab((location.state as any).tab);
    }
  }, [location.state]);

  // Projects posted by the current user
  const MY_JOBS = useMemo(() => contextJobs.filter(job => job.postedByMe), [contextJobs]);

  // Projects where the current user is hired or applied
  const WORKING_JOBS = useMemo(() => {
    return contextJobs.filter(job => {
        const status = myApplications[job.id];
        // Include applicants(Applied), invited, offered, hired
        return status && ['applicants', 'invited', 'offered', 'hired'].includes(status);
    });
  }, [contextJobs, myApplications]);

  const filteredAndSortedJobs = useMemo(() => {
    let jobs = activeTab === 'working' ? WORKING_JOBS : MY_JOBS;
    
    // Filter logic
    jobs = jobs.filter(job => {
      // For "My Projects" main tab, only show ACTIVE projects
      if (activeTab === 'my-projects' && job.status !== 'Active') return false;
      return true;
    });

    switch (sortOption) {
      case 'recent': jobs.sort((a, b) => parseTimeAgo(a.postedAgo) - parseTimeAgo(b.postedAgo)); break;
      case 'price-low': jobs.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case 'price-high': jobs.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      default: jobs.sort((a, b) => parseInt(a.id) - parseInt(b.id)); break;
    }
    return jobs;
  }, [sortOption, MY_JOBS, WORKING_JOBS, activeTab]);

  const statusJobs = useMemo(() => MY_JOBS.filter(job => job.status === statusTab), [MY_JOBS, statusTab]);

  return (
    <main className="flex-grow flex flex-col bg-mine-shaft-950 text-mine-shaft-50 font-sans transition-colors duration-300">
      <div className="w-full border-b border-mine-shaft-800 bg-mine-shaft-950 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-8">
            <button onClick={() => setActiveTab('my-projects')} className={`py-4 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'my-projects' ? 'text-bright-sun-400 border-bright-sun-400' : 'text-mine-shaft-400 border-transparent hover:text-mine-shaft-50'}`}>My Projects</button>
            <button onClick={() => setActiveTab('working')} className={`py-4 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'working' ? 'text-bright-sun-400 border-bright-sun-400' : 'text-mine-shaft-400 border-transparent hover:text-mine-shaft-50'}`}>Working</button>
            <button onClick={() => setActiveTab('status')} className={`py-4 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${activeTab === 'status' ? 'text-bright-sun-400 border-bright-sun-400' : 'text-mine-shaft-400 border-transparent hover:text-mine-shaft-50'}`}>Status</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {(activeTab === 'my-projects' || activeTab === 'working') && (
           <>
            <div className="flex justify-between items-center mb-8 relative z-20">
              <h2 className="text-2xl font-bold text-mine-shaft-50">{activeTab === 'working' ? 'Projects I am Working On' : 'My Posted Projects'}</h2>
              <div className="relative">
                <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2 border border-bright-sun-500/30 rounded-full text-sm text-mine-shaft-50 hover:bg-mine-shaft-900 transition-colors bg-mine-shaft-950">
                  <span className="capitalize">{sortOption.replace('-', ' ')}</span>
                  <SlidersHorizontal size={14} className="text-bright-sun-400" />
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                      {['relevance', 'recent', 'price-low', 'price-high'].map((option) => (
                        <button
                          key={option}
                          onClick={() => { setSortOption(option); setIsSortOpen(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between hover:bg-mine-shaft-800 text-mine-shaft-300 hover:text-mine-shaft-50 capitalize"
                        >
                          {option.replace('-', ' ')}
                          {sortOption === option && <ChevronDown size={14} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedJobs.length > 0 ? (
                filteredAndSortedJobs.map((job) => {
                     const status = activeTab === 'working' ? myApplications[job.id] : undefined;
                     return activeTab === 'working' 
                        ? <WorkerProjectCard key={job.id} job={job} status={status} />
                        : <ManagerProjectCard key={job.id} job={job} />;
                })
              ) : (
                <div className="col-span-full text-center py-20 border border-dashed border-mine-shaft-800 rounded-2xl bg-mine-shaft-900/50">
                   <div className="w-16 h-16 rounded-full bg-mine-shaft-800 flex items-center justify-center mb-4 mx-auto text-bright-sun-400"><Briefcase size={32} /></div>
                   <h2 className="text-xl font-bold text-mine-shaft-50 mb-2">No Projects Found</h2>
                   <p className="text-mine-shaft-400 max-w-md mx-auto">
                        {activeTab === 'working' 
                            ? "You are not currently working on any projects. Apply to projects and get hired!" 
                            : (MY_JOBS.length === 0 ? "You haven't posted any projects yet." : "No projects found.")}
                   </p>
                   {activeTab === 'working' && (
                       <button 
                            onClick={() => navigate('/browse')}
                            className="mt-4 px-6 py-2 bg-bright-sun-400 text-black font-bold rounded-lg hover:bg-bright-sun-500 transition-colors"
                        >
                            Browse Projects
                        </button>
                   )}
                </div>
              )}
            </div>
           </>
        )}

        {activeTab === 'status' && (
          <div className="flex flex-col gap-6">
             <div className="flex gap-2 p-1 bg-mine-shaft-900 rounded-full border border-mine-shaft-800 w-fit">
                {['Active', 'Draft', 'Closed'].map((status) => (
                   <button 
                      key={status}
                      onClick={() => setStatusTab(status as any)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${statusTab === status ? 'bg-bright-sun-400 text-black shadow-lg shadow-bright-sun-400/20' : 'text-mine-shaft-400 hover:text-mine-shaft-50 hover:bg-mine-shaft-800'}`}
                   >
                      {status === 'Active' && <Activity size={18} />}
                      {status === 'Draft' && <FileText size={18} />}
                      {status === 'Closed' && <Archive size={18} />}
                      {status}
                      <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${statusTab === status ? 'bg-black/20 text-black' : 'bg-mine-shaft-800 text-mine-shaft-400'}`}>{MY_JOBS.filter(j => j.status === status).length}</span>
                   </button>
                ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {statusJobs.length > 0 ? (
                     statusJobs.map((job) => <ManagerProjectCard key={job.id} job={job} />)
                 ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-mine-shaft-300 border border-dashed border-mine-shaft-800 rounded-2xl bg-mine-shaft-900/50">
                        <div className="w-16 h-16 rounded-full bg-mine-shaft-800 flex items-center justify-center mb-4 text-bright-sun-400"><Activity size={32} /></div>
                        <h2 className="text-xl font-bold text-mine-shaft-50 mb-2">No {statusTab} Projects</h2>
                        <p className="max-w-md text-center">You don't have any projects in this status.</p>
                     </div>
                 )}
             </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default ManageProjectsPage;