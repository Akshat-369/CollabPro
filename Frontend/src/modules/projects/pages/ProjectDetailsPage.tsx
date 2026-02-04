import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../layout/Footer';
import { MapPin, Briefcase, IndianRupee, RotateCcw, Bookmark, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { IMAGES } from '../../../../Data/images';
import { useUser } from '../../../../context/UserContext';
import { useProject } from '../../../../context/ProjectContext';
import RecommendedProjectCard from '../components/RecommendedProjectCard';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasApplied, isSaved, toggleSaveJob, getJobApplications, currentUserCandidateId } = useUser();
  const { getJob, jobs } = useProject();
  
  const job = id ? getJob(id) : undefined;
  const similarJobs = jobs.filter(j => j.id !== id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!job) return <div className="min-h-screen flex items-center justify-center text-mine-shaft-50 bg-mine-shaft-950">Project not found</div>;

  const applications = id ? getJobApplications(id) : [];
  const myApplication = applications.find(app => app.id === currentUserCandidateId);
  // User requested to remove "Applied" status if they are a member (hired), and show Apply button again.
  const isHired = myApplication?.status === 'hired';
  
  const isApplied = id ? hasApplied(id) : false;
  // Show "Applied" button only if applied AND not hired. If hired, we fall back to "Apply" button as requested.
  const showAppliedStatus = isApplied && !isHired;
  
  const isJobSaved = id ? isSaved(id) : false;

  const historyStack = (location.state as { historyStack?: string[] })?.historyStack || [];

  const handleBack = () => {
      if (historyStack.length > 0) {
          const prevPath = historyStack[historyStack.length - 1];
          const newStack = historyStack.slice(0, -1);
          navigate(prevPath, { state: { historyStack: newStack } });
      } else {
          navigate('/browse');
      }
  };

  return (
    <div className="min-h-screen bg-mine-shaft-950 px-4 md:px-20 py-10 transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-20">
              <div className="lg:col-span-3">
                   <div className="mb-6">
                      <button onClick={handleBack} className="flex items-center gap-2 text-bright-sun-400 bg-mine-shaft-900 border border-mine-shaft-800 px-4 py-2 rounded-xl hover:bg-mine-shaft-800 transition-colors font-medium">
                          <ArrowLeft size={20} /> Back
                      </button>
                   </div>

                   <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                       <div>
                           <h1 className="text-3xl font-bold text-mine-shaft-50 mb-2">{job.title}</h1>
                           <div className="text-mine-shaft-300 text-sm font-medium">
                               {job.postedAgo} • {job.applicants} Applicants
                           </div>
                       </div>
                       <div className="flex gap-3 w-full md:w-auto">
                           {showAppliedStatus ? (
                               <button 
                                    disabled
                                    className="flex-1 md:flex-none bg-mine-shaft-800 text-green-500 border border-green-500/30 px-8 py-3 rounded-xl font-bold cursor-default flex items-center justify-center gap-2"
                               >
                                    <CheckCircle2 size={20} /> Applied
                               </button>
                           ) : (
                               <button 
                                    onClick={() => navigate(`/apply/${job.id}`)}
                                    className="flex-1 md:flex-none bg-mine-shaft-800 text-bright-sun-400 px-8 py-3 rounded-xl font-bold hover:bg-bright-sun-400 hover:text-black transition-colors border border-mine-shaft-700"
                               >
                                    Apply
                               </button>
                           )}
                           
                           <button 
                                onClick={() => id && toggleSaveJob(id)}
                                className={`p-3 rounded-xl transition-colors border ${isJobSaved ? 'bg-bright-sun-400 text-black border-bright-sun-400' : 'bg-mine-shaft-800 text-bright-sun-400 hover:bg-mine-shaft-700 border-mine-shaft-700'}`}
                            >
                                <Bookmark size={24} className={isJobSaved ? "fill-current" : ""} />
                           </button>
                       </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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

                   <div className="space-y-10">
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

              <div className="lg:col-span-1">
                  <h2 className="text-xl font-bold text-mine-shaft-50 mb-6">Recommended Project</h2>
                  <div className="flex flex-col gap-5">
                      {similarJobs.map((sJob) => (
                          <RecommendedProjectCard 
                              key={sJob.id}
                              job={sJob}
                              isSaved={isSaved(sJob.id)}
                              onToggleSave={() => toggleSaveJob(sJob.id)}
                              historyStack={historyStack}
                          />
                      ))}
                  </div>
              </div>
          </div>
          <Footer />
    </div>
  );
};

export default ProjectDetailsPage;