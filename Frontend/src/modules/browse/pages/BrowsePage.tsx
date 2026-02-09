import React, { useState, useMemo } from 'react';
import Footer from '../../layout/Footer';
import { SlidersHorizontal, ChevronDown, Bookmark, Send, Gift, Loader2 } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import { useUser } from '../../../../context/UserContext';
import { useProject } from '../../../../context/ProjectContext';
import { useNavigate } from 'react-router-dom';

const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
const parseTimeAgo = (timeStr: string) => {
  const value = parseInt(timeStr.replace(/[^0-9]/g, '')) || 0;
  if (timeStr.includes('hour')) return value;
  if (timeStr.includes('day')) return value * 24;
  if (timeStr.includes('week')) return value * 24 * 7;
  if (timeStr.includes('month')) return value * 24 * 30;
  return value * 24 * 365;
};

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'recent', label: 'Recent' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'price-high', label: 'Price (High to Low)' },
];

const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const { jobs: contextJobs, refreshAllProjects } = useProject(); // Fetch from context
  // Initialize state functions to read from localStorage
  const getPersistedState = (key: string, defaultValue: string) => {
    return localStorage.getItem(key) || defaultValue;
  };

  React.useEffect(() => {
    refreshAllProjects();
  }, [refreshAllProjects]);

  const [activeTab, setActiveTab] = useState(() => getPersistedState('browse_activeTab', 'find-projects'));
  const [historyTab, setHistoryTab] = useState<'Applied' | 'In Progress' | 'Saved' | 'Offered'>(() => 
     getPersistedState('browse_historyTab', 'Applied') as 'Applied' | 'In Progress' | 'Saved' | 'Offered'
  );
  
  const { appliedJobs, savedJobs, toggleSaveJob, getJobApplications, currentUserCandidateId, updateCandidateStatus, myApplications, myApplicationsData, respondToOffer } = useUser();
  
  // Sorting
  const [sortOption, setSortOption] = useState(() => getPersistedState('browse_sortOption', 'relevance'));
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Persist state changes
  React.useEffect(() => {
     localStorage.setItem('browse_activeTab', activeTab);
  }, [activeTab]);

  React.useEffect(() => {
     localStorage.setItem('browse_historyTab', historyTab);
  }, [historyTab]);

  React.useEffect(() => {
     localStorage.setItem('browse_sortOption', sortOption);
  }, [sortOption]);

  const filteredAndSortedJobs = useMemo(() => {
    // Only show Active projects in Browse
    let jobs = contextJobs.filter(job => {
      // Ensure only Active jobs are shown (or jobs with no status set, assuming legacy/default is active)
      if (job.status && job.status !== 'Active') return false;
      return true;
    });

    switch (sortOption) {
      case 'recent': jobs.sort((a, b) => parseTimeAgo(a.postedAgo) - parseTimeAgo(b.postedAgo)); break;
      case 'price-low': jobs.sort((a, b) => parsePrice(a.price) - parsePrice(b.price)); break;
      case 'price-high': jobs.sort((a, b) => parsePrice(b.price) - parsePrice(a.price)); break;
      default: jobs.sort((a, b) => parseInt(a.id) - parseInt(b.id)); break;
    }
    return jobs;
  }, [contextJobs, sortOption]);

  // Data for history sections based on context
  const historyData = useMemo(() => {
    // Helper to get status from myApplications (single source of truth for freelancer)
    const getStatus = (jobId: string) => {
        return myApplications[jobId];
    };

    // Applied: Status is 'applicants'
    const applied = contextJobs.filter(job => {
        if (!appliedJobs.includes(job.id)) return false;
        const status = getStatus(job.id);
        return !status || status === 'applicants'; 
    });

    // In Progress: Status is 'invited'
    const inProgress = contextJobs.filter(job => {
        if (!appliedJobs.includes(job.id)) return false;
        const status = getStatus(job.id);
        return status === 'invited';
    });

    // Saved: In saved list
    const saved = contextJobs.filter(job => savedJobs.includes(job.id));
    
     // Offered: Status is 'offered'
    const offered = contextJobs.filter(job => {
         if (!appliedJobs.includes(job.id)) return false;
         const status = getStatus(job.id);
         return status === 'offered';
    });

    return {
      'Applied': applied,
      'In Progress': inProgress,
      'Saved': saved,
      'Offered': offered,
    };
  }, [contextJobs, appliedJobs, savedJobs, myApplications]);

  const activeHistoryJobs = historyData[historyTab];

  // Helper to get interview info for specific job
  const getInterviewInfo = (jobId: string) => {
      if (historyTab !== 'In Progress') return undefined;
      const appData = myApplicationsData[jobId];
      return appData?.interview;
  };

  const handleOfferResponse = async (jobId: string, accepted: boolean) => {
       try {
           await respondToOffer(jobId, accepted);
           if (accepted) {
               // Show success feedback
               // alert("Congratulations! You have joined the project team.");
               navigate('/manage', { state: { tab: 'working' } });
           } else {
               // alert('Offer Rejected');
           }
       } catch (e: any) {
           alert(e.message || "Failed to respond to offer");
       }
  };

  return (
    <main className="flex-grow flex flex-col bg-mine-shaft-950 text-mine-shaft-50 font-sans transition-colors duration-300">
      <div className="w-full border-b border-mine-shaft-800 bg-mine-shaft-950 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex gap-8">
            {['find-projects', 'history'].map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-medium transition-colors border-b-2 -mb-[1px] capitalize ${activeTab === tab ? 'text-bright-sun-400 border-bright-sun-400' : 'text-mine-shaft-400 border-transparent hover:text-mine-shaft-50'}`}
                >
                    {tab.replace('-', ' ')}
                </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 py-8">
        {activeTab === 'find-projects' && (
          <>
            <div className="flex justify-between items-center mb-8 relative z-20">
              <h2 className="text-2xl font-bold text-mine-shaft-50">Recommended Projects</h2>
              <div className="relative">
                <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2 border border-bright-sun-500/30 rounded-full text-sm text-mine-shaft-50 hover:bg-mine-shaft-900 transition-colors bg-mine-shaft-950">
                  <span>{sortOptions.find(opt => opt.value === sortOption)?.label}</span>
                  <SlidersHorizontal size={14} className="text-bright-sun-400" />
                </button>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSortOption(option.value); setIsSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${sortOption === option.value ? 'bg-bright-sun-400/10 text-bright-sun-400' : 'text-mine-shaft-300 hover:bg-mine-shaft-800 hover:text-mine-shaft-50'}`}
                        >
                          {option.label}
                          {sortOption === option.value && <ChevronDown size={14} />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedJobs.length > 0 ? (
                filteredAndSortedJobs.map((job) => (
                    <ProjectCard 
                        key={job.id} 
                        job={job} 
                        isSaved={savedJobs.includes(job.id)}
                        onToggleSaved={() => toggleSaveJob(job.id)}
                    />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-mine-shaft-400">
                  <p>No projects found.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'history' && (
           <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-mine-shaft-50">Project History</h2>
                <div className="flex flex-wrap gap-2 p-1 bg-mine-shaft-900 rounded-full border border-mine-shaft-800 w-fit">
                    {(['Applied', 'In Progress', 'Saved', 'Offered'] as const).map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setHistoryTab(tab)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${historyTab === tab ? 'bg-bright-sun-400 text-black shadow-lg shadow-bright-sun-400/20' : 'text-mine-shaft-400 hover:text-mine-shaft-50 hover:bg-mine-shaft-800'}`}
                        >
                            {tab === 'Applied' && <Send size={16} />}
                            {tab === 'In Progress' && <Loader2 size={16} className={historyTab === tab ? "animate-spin" : ""} />}
                            {tab === 'Saved' && <Bookmark size={16} />}
                            {tab === 'Offered' && <Gift size={16} />}
                            {tab}
                            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${historyTab === tab ? 'bg-black/20 text-black' : 'bg-mine-shaft-800 text-mine-shaft-400'}`}>
                                {historyData[tab].length}
                            </span>
                        </button>
                    ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {activeHistoryJobs.length > 0 ? (
                     activeHistoryJobs.map((job) => (
                        <ProjectCard 
                            key={job.id} 
                            job={job} 
                            isSaved={savedJobs.includes(job.id)}
                            onToggleSaved={() => toggleSaveJob(job.id)}
                            interviewDetails={getInterviewInfo(job.id)}
                            isOffered={historyTab === 'Offered'}
                            onAcceptOffer={() => handleOfferResponse(job.id, true)}
                            onRejectOffer={() => handleOfferResponse(job.id, false)}
                        />
                     ))
                 ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-mine-shaft-300 border border-dashed border-mine-shaft-800 rounded-2xl bg-mine-shaft-900/50">
                        <div className="w-16 h-16 rounded-full bg-mine-shaft-800 flex items-center justify-center mb-4 text-bright-sun-400">
                            {historyTab === 'Applied' && <Send size={32} />}
                            {historyTab === 'In Progress' && <Loader2 size={32} />}
                            {historyTab === 'Saved' && <Bookmark size={32} />}
                            {historyTab === 'Offered' && <Gift size={32} />}
                        </div>
                        <h2 className="text-xl font-bold text-mine-shaft-50 mb-2">No {historyTab} Projects</h2>
                        <p className="max-w-md text-center">You haven't {historyTab === 'Offered' ? 'received any offers' : `had any ${historyTab.toLowerCase()} projects`} yet.</p>
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

export default BrowsePage;