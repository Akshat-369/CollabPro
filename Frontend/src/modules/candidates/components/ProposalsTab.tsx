import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import CandidateCard from './CandidateCard';
import ApplicationModal from './ApplicationModal';
import { Candidate } from '../../../../Data/types';
import { useUser } from '../../../../context/UserContext';
import { getCompanyLogo } from '../../../../shared/utils/companyUtils';
import ProjectService from '../../projects/service/project.service';

const DUMMY_PDF = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

const MOCK_CANDIDATES: Candidate[] = [
  { 
      id: 1, 
      name: "Marshal", 
      role: "Product Manager", 
      company: "Google", 
      match: "98%", 
      rate: "$45/hr", 
      status: 'applicants', 
      imageIndex: 1, 
      skills: ["Product Strategy", "Agile", "JIRA", "React", "Angular"], 
      description: "Hi, I am Marshal. I specialize in bridging the gap between technical teams and business goals...", 
      experience: "5 Years", 
      location: "Delhi, India", 
      email: "marshal.dev@collabpro.com", 
      phone: "+91 98765 43210", 
      resume: "Marshal_CV.pdf", 
      resumeUrl: DUMMY_PDF,
      coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
      about: "I am a Product Manager with a background in software engineering. I have successfully led multiple cross-functional teams to deliver high-impact products at Google and Amazon. I am passionate about user-centric design and data-driven decision making.",
      experiences: [
          {
              role: "Product Manager",
              company: "Google",
              location: "Bangalore, India",
              date: "Mar 2022 - Present",
              description: "Leading the development of internal developer tools. Improved team velocity by 20% through streamlined processes.",
              logo: getCompanyLogo('google')
          },
          {
              role: "Senior Product Analyst",
              company: "Amazon",
              location: "Hyderabad, India",
              date: "Jun 2019 - Feb 2022",
              description: "Analyzed customer behavior data to optimize the checkout flow, resulting in a 5% increase in conversion.",
              logo: getCompanyLogo('amazon')
          }
      ],
      certifications: [
          {
              name: "Project Management Professional (PMP)",
              issuer: "PMI",
              issueDate: "Issued Jan 2023",
              id: "ID: 12345678",
              logo: ""
          },
          {
              name: "Google Project Management Certificate",
              issuer: "Google",
              issueDate: "Issued Aug 2021",
              id: "ID: GPM-998877",
              logo: getCompanyLogo('google')
          }
      ]
  },
  { 
      id: 2, 
      name: "Sarah Chen", 
      role: "Senior React Dev", 
      company: "Meta", 
      match: "95%", 
      rate: "$60/hr", 
      status: 'applicants', 
      imageIndex: 2, 
      skills: ["React", "Node.js", "GraphQL", "TypeScript", "Next.js"], 
      description: "Full stack developer with a focus on performant frontend architecture...", 
      experience: "7 Years", 
      location: "San Francisco, CA", 
      email: "sarah.chen@meta.com", 
      phone: "+1 415 555 0123", 
      resume: "Sarah_Resume_2023.pdf", 
      resumeUrl: DUMMY_PDF,
      coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80",
      about: "Senior Frontend Engineer with 7 years of experience building scalable web applications. I love solving complex UI challenges and optimizing performance. Currently working at Meta on the React core team.",
      experiences: [
          {
              role: "Senior Software Engineer",
              company: "Meta",
              location: "Menlo Park, CA",
              date: "Jan 2021 - Present",
              description: "Architecting and building new features for the Facebook Marketplace. Mentoring junior developers.",
              logo: getCompanyLogo('meta')
          },
          {
              role: "Frontend Developer",
              company: "Uber",
              location: "San Francisco, CA",
              date: "May 2017 - Dec 2020",
              description: "Developed the driver onboarding experience. Reduced onboarding time by 40%.",
              logo: getCompanyLogo('uber')
          }
      ],
      certifications: [
          {
              name: "AWS Certified Developer - Associate",
              issuer: "Amazon Web Services",
              issueDate: "Issued Mar 2022",
              id: "ID: AWS-DEC-2022",
              logo: getCompanyLogo('amazon')
          }
      ]
  },
  { 
      id: 6, 
      name: "Jessica Wilson", 
      role: "Frontend Dev", 
      company: "Airbnb", 
      match: "96%", 
      rate: "$50/hr", 
      status: 'invited', 
      imageIndex: 2, 
      skills: ["Vue.js", "Nuxt.js", "Tailwind CSS", "Firebase"], 
      description: "Passionate about creating beautiful and accessible user interfaces...", 
      experience: "5 Years", 
      location: "Austin, TX", 
      interview: { date: "2024-11-12", time: "10:00 AM" }, 
      email: "jessica.w@airbnb.com", 
      phone: "+1 512 555 0199", 
      resume: "JessicaWilson_Portfolio.pdf", 
      resumeUrl: DUMMY_PDF,
      coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
      about: "I am a creative frontend developer who loves Vue.js. I have a strong eye for design and detail, ensuring that every pixel is in its right place. Previously worked at Airbnb and Spotify.",
      experiences: [
          {
              role: "Frontend Engineer",
              company: "Airbnb",
              location: "Austin, TX",
              date: "Aug 2021 - Present",
              description: "Revamping the host dashboard using Vue 3 and TypeScript.",
              logo: getCompanyLogo('airbnb')
          },
          {
              role: "UI Developer",
              company: "Spotify",
              location: "New York, NY",
              date: "Jun 2019 - Jul 2021",
              description: "Worked on the web player interface, focusing on accessibility and responsiveness.",
              logo: getCompanyLogo('spotify')
          }
      ],
      certifications: []
  }
];

interface ProposalsTabProps {
  jobId: string;
}

const ProposalsTab: React.FC<ProposalsTabProps> = ({ jobId }) => {
  const { getJobApplications, updateCandidateStatus } = useUser();
  const [activeSection, setActiveSection] = useState<'applicants' | 'invited' | 'offered'>('applicants');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [viewApplicationCandidate, setViewApplicationCandidate] = useState<Candidate | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [realCandidates, setRealCandidates] = useState<Candidate[]>([]);

  const fetchCandidates = React.useCallback(async () => {
    if (!jobId) return;
    try {
        const data = await ProjectService.getProjectCandidates(jobId);
        setRealCandidates(data);
    } catch (e) {
        console.error("Failed to load candidates", e);
    }
  }, [jobId]);

  React.useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Merge static mocks with dynamic applications from API
  const candidates = useMemo(() => {
      // Prioritize API candidates
      return [...realCandidates, ...MOCK_CANDIDATES];
  }, [realCandidates]);

  const openScheduleModal = (id: number) => { setSelectedCandidateId(id); setScheduleDate(''); setScheduleTime(''); setIsScheduleOpen(true); };
  const closeScheduleModal = () => { setIsScheduleOpen(false); setSelectedCandidateId(null); };
  
  const handleScheduleSubmit = async () => {
    if (selectedCandidateId && scheduleDate && scheduleTime) {
        // Update via Context so it reflects in Browse Page History
        const isMock = MOCK_CANDIDATES.some(m => m.id === selectedCandidateId);
        
        if (isMock) {
             console.log("Scheduling mock candidate - visual update only in this tab not supported without deeper state migration");
        } else {
            await updateCandidateStatus(jobId, selectedCandidateId, 'invited', { date: scheduleDate, time: scheduleTime });
            await fetchCandidates(); // Refetch to update UI
        }
        
        closeScheduleModal();
    }
  };

  const handleAcceptCandidate = async (candidateId: number) => {
      const isMock = MOCK_CANDIDATES.some(m => m.id === candidateId);
      if (isMock) {
           console.log("Accepting mock candidate");
      } else {
           const candidate = candidates.find(c => c.id === candidateId);
           await updateCandidateStatus(jobId, candidateId, 'offered', candidate?.interview);
           await fetchCandidates(); // Refetch to update UI
      }
  };

  const handleRejectCandidate = async (candidateId: number) => {
      const isMock = MOCK_CANDIDATES.some(m => m.id === candidateId);
      if (isMock) {
           console.log("Rejecting mock candidate");
      } else {
           await updateCandidateStatus(jobId, candidateId, 'rejected');
           await fetchCandidates(); // Refetch to update UI
      }
  };

  const filteredCandidates = candidates.filter(c => c.status === activeSection);
  const formatDateDisplay = (dateStr: string) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const formatTimeDisplay = (timeStr: string) => {
      if (!timeStr) return '';
      const [hours, minutes] = timeStr.split(':');
      const h = parseInt(hours, 10);
      return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-mine-shaft-50">Proposals</h2>
            <select className="bg-mine-shaft-900 border border-mine-shaft-700 text-mine-shaft-300 text-sm rounded-lg px-3 py-2 outline-none"><option>Recent</option></select>
         </div>
         <div className="border-b border-mine-shaft-800">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
               {['applicants', 'invited', 'offered'].map(sec => (
                   <button key={sec} onClick={() => setActiveSection(sec as any)} className={`pb-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap capitalize ${activeSection === sec ? 'border-bright-sun-400 text-bright-sun-400' : 'border-transparent text-mine-shaft-400 hover:text-mine-shaft-50'}`}>
                      {sec} <span className="ml-1 text-xs bg-mine-shaft-800 px-2 py-0.5 rounded-full text-mine-shaft-300">{candidates.filter(c => c.status === sec).length}</span>
                   </button>
               ))}
            </div>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCandidates.length > 0 ? filteredCandidates.map((candidate) => (
                <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    onSchedule={() => openScheduleModal(candidate.id)} 
                    onAccept={() => handleAcceptCandidate(candidate.id)}
                    onReject={() => handleRejectCandidate(candidate.id)}
                    onViewApplication={() => setViewApplicationCandidate(candidate)}
                    formatDateDisplay={formatDateDisplay} 
                    formatTimeDisplay={formatTimeDisplay} 
                />
            )) : <div className="col-span-full py-12 text-center text-mine-shaft-400 italic">No candidates in this section.</div>}
      </div>

      {isScheduleOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={closeScheduleModal}></div>
             <div className="relative bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-mine-shaft-50">Schedule Interview</h3><button onClick={closeScheduleModal} className="text-mine-shaft-400 hover:text-mine-shaft-50"><X size={24} /></button></div>
                <div className="space-y-5">
                    <div className="space-y-2"><label className="text-sm font-medium text-mine-shaft-50">Date</label><input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-4 py-3 bg-mine-shaft-800 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 [color-scheme:dark]" /></div>
                    <div className="space-y-2"><label className="text-sm font-medium text-mine-shaft-50">Time</label><input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-4 py-3 bg-mine-shaft-800 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 [color-scheme:dark]" /></div>
                    <button onClick={handleScheduleSubmit} disabled={!scheduleDate || !scheduleTime} className="w-full py-3 mt-2 bg-mine-shaft-800 border border-mine-shaft-700 text-bright-sun-400 font-bold rounded-lg hover:bg-bright-sun-400 hover:text-black transition-colors disabled:opacity-50">Schedule</button>
                </div>
             </div>
        </div>
      )}

      {viewApplicationCandidate && (
          <ApplicationModal 
              candidate={viewApplicationCandidate}
              onClose={() => setViewApplicationCandidate(null)}
          />
      )}
    </div>
  );
};

export default ProposalsTab;