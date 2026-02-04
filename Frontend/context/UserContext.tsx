import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Candidate, UserProfile } from '../Data/types';
import AuthService from '../src/modules/auth/service/auth.service';
import ProjectService from '../src/modules/projects/service/project.service';
import ProfileService from '../src/modules/profile/service/profile.service';

interface UserContextType {
  appliedJobs: string[];
  savedJobs: string[];
  jobApplications: Record<string, Candidate[]>;
  currentUserCandidateId: number;
  userProfile: UserProfile;
  applyForJob: (jobId: string, applicationData?: any) => Promise<void>;
  toggleSaveJob: (jobId: string) => Promise<void>;
  hasApplied: (jobId: string) => boolean;
  isSaved: (jobId: string) => boolean;
  getJobApplications: (jobId: string) => Candidate[];
  myApplications: Record<string, string>;
  myApplicationIds: Record<string, number>;
  updateCandidateStatus: (jobId: string, candidateId: number, status: 'applicants' | 'invited' | 'offered' | 'hired' | 'rejected', interview?: { date: string; time: string }) => Promise<void>;
  respondToOffer: (projectId: string, accepted: boolean) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Constant ID to track the logged-in user's application across the app
const CURRENT_USER_ID = 1001;

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with dummy data where the user is already hired for Project ID '2'
  const [appliedJobs, setAppliedJobs] = useState<string[]>(['2']);
  const [savedJobs, setSavedJobs] = useState<string[]>(['3']); 
  const [myApplications, setMyApplications] = useState<Record<string, string>>({}); 
  const [myApplicationIds, setMyApplicationIds] = useState<Record<string, number>>({});
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "+1 (555) 123-4567",
    coverImage: "https://images.unsplash.com/photo-1533130061792-649d45df4c72?auto=format&fit=crop&w=1200&q=80", 
    profileImage: "", // Initial empty state to prevent flicker
    about: "As a Software Engineer at Google, I specialize in building scalable and high-performance applications. My expertise lies in integrating front-end and back-end technologies to deliver seamless user experiences.",
    skills: ["React", "SpringBoot", "MongoDB", "HTML", "CSS", "JavaScript", "Node.js", "MySQL", "Docker", "AWS"],
    experiences: [
      {
        role: "Software Engineer III",
        company: "Google",
        location: "New York, United States",
        date: "Mar 2022 - Present",
        description: "Working on scalable backend systems and cloud-native applications.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
      },
      {
        role: "Software Engineer",
        company: "Microsoft",
        location: "Seattle, United States",
        date: "Jun 2018 - Mar 2022",
        description: "Developed and optimized cloud-based enterprise applications.",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
      }
    ],
    certifications: [
      {
        name: "Google Professional Cloud Architect",
        issuer: "Google",
        issueDate: "Issued Aug 2023",
        id: "ID: CB72982GG",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
      },
      {
        name: "Microsoft Certified: Azure Solutions Architect Expert",
        issuer: "Microsoft",
        issueDate: "Issued May 2022",
        id: "ID: MS12345AZ",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
      }
    ]
  });

  const [jobApplications, setJobApplications] = useState<Record<string, Candidate[]>>({
    '2': [{
        id: CURRENT_USER_ID,
        name: userProfile.name,
        role: "Frontend Developer",
        company: "Freelancer",
        match: "100%",
        rate: "$40/hr",
        status: 'hired',
        imageIndex: 0,
        skills: ["React", "TypeScript", "Tailwind CSS"],
        description: "Joined the team as Frontend Developer.",
        experience: "4 Years",
        location: "New York",
        email: userProfile.email,
        phone: userProfile.phone,
        resume: "Marshal_Resume.pdf",
        resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
        joinedDate: "Oct 24, 2023 10:00 AM"
    }]
  });

  /* import ProfileService from '../src/modules/profile/service/profile.service'; */

  const updateUserProfile = useCallback(async (updates: Partial<UserProfile>) => {
      try {
          // 1. Send update to backend
          const updatedProfile = await ProfileService.updateMyProfile(updates);
          
          // 2. Update local state with response (Source of Truth)
          setUserProfile(updatedProfile);
          
          // 3. Notification Center only (No alert)
          // Ideally fetch notifications or assume backend created one
      } catch (e: any) {
          console.error("Failed to update profile", e);
          alert(e.message || "Failed to update profile");
      }
  }, []);

  const applyForJob = useCallback(async (jobId: string, applicationData?: any) => {
    try {
        await ProjectService.applyForProject(jobId, applicationData);
        setAppliedJobs((prev) => {
          if (!prev.includes(jobId)) return [...prev, jobId];
          return prev;
        });
        // alert('Application submitted successfully!');
    } catch (e) {
         console.error("Failed to apply", e);
         alert("Failed to submit application.");
    }
  }, []);

  const updateCandidateStatus = useCallback(async (jobId: string, candidateId: number, status: 'applicants' | 'invited' | 'offered' | 'hired' | 'rejected', interview?: { date: string; time: string }) => {
      try {
          await ProjectService.updateApplicationStatus(jobId, candidateId, status, interview);
          setJobApplications(prev => {
              const currentList = prev[jobId] || [];
              const updatedList = currentList.map(candidate => {
                  if (candidate.id === candidateId) {
                      const updates: any = { status, interview };
                      if (status === 'hired' && !candidate.joinedDate) {
                          updates.joinedDate = new Date().toLocaleString('en-US', { 
                              month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true 
                          });
                      }
                      return { ...candidate, ...updates };
                  }
                  return candidate;
              });
              return { ...prev, [jobId]: updatedList };
          });
      } catch (e: any) {
          console.error("Failed to update status", e);
          alert(e.message || "Failed to update status");
      }
  }, []);

  const respondToOffer = useCallback(async (projectId: string, accepted: boolean) => {
      const appId = myApplicationIds[projectId];
      if (!appId) throw new Error("Application ID not found");
      try {
          if (accepted) {
              await ProjectService.acceptOffer(projectId, appId);
              setMyApplications(prev => ({ ...prev, [projectId]: 'hired' }));
          } else {
              await ProjectService.rejectOffer(projectId, appId);
               setMyApplications(prev => ({ ...prev, [projectId]: 'rejected' }));
          }
      } catch (e) {
          console.error("Failed to respond to offer", e);
          throw e;
      }
  }, [myApplicationIds]);

  const toggleSaveJob = useCallback(async (jobId: string) => {
    try {
        if (savedJobs.includes(jobId)) {
            await ProjectService.unsaveProject(jobId);
            setSavedJobs(prev => prev.filter(id => id !== jobId));
        } else {
            await ProjectService.saveProject(jobId);
            setSavedJobs(prev => [...prev, jobId]);
        }
    } catch (e) {
        console.error("Failed to toggle save", e);
    }
  }, [savedJobs]);

  const hasApplied = useCallback((jobId: string) => {
      const status = myApplications[jobId];
      if (status === 'hired' || status === 'rejected' || status === 'removed') return false;
      return appliedJobs.includes(jobId);
  }, [appliedJobs, myApplications]);

  const isSaved = useCallback((jobId: string) => savedJobs.includes(jobId), [savedJobs]);
  
  const getJobApplications = useCallback((jobId: string) => {
      return jobApplications[jobId] || [];
  }, [jobApplications]);

  const refreshUser = useCallback(async () => {
    try {
        // Fetch User Basics
        const user = await AuthService.getCurrentUser();
        
        // Fetch User Profile (New Logic)
        try {
            const profile = await ProfileService.getMyProfile();
            setUserProfile(profile);
        } catch (error) {
            console.error("Failed to load profile", error);
            // Don't nuke everything if profile fails, but it shouldn't fail with auto-migrate
        }

        try {
            const saved = await ProjectService.getSavedProjects();
            setSavedJobs(saved.map(j => j.id));
        } catch (e) {}
        try {
            const apps = await ProjectService.getAppliedApplications();
            setAppliedJobs(apps.map(a => a.projectId.toString()));
            setMyApplications(apps.reduce((acc, curr) => ({ ...acc, [curr.projectId]: curr.status }), {}));
            setMyApplicationIds(apps.reduce((acc, curr: any) => ({ ...acc, [curr.projectId]: curr.applicationId }), {}));
        } catch (e) {}
    } catch (error) {
        console.error("Failed to refresh user", error);
    }
  }, []);

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
        refreshUser();
    }
  }, [refreshUser]);

  const value = useMemo(() => ({ 
      appliedJobs, savedJobs, jobApplications, currentUserCandidateId: CURRENT_USER_ID,
      userProfile, applyForJob, toggleSaveJob, hasApplied, isSaved, getJobApplications,
      myApplications, myApplicationIds, updateCandidateStatus, respondToOffer, updateUserProfile, refreshUser
  }), [appliedJobs, savedJobs, jobApplications, userProfile, applyForJob, toggleSaveJob, hasApplied, isSaved, 
       getJobApplications, myApplications, myApplicationIds, updateCandidateStatus, respondToOffer, updateUserProfile, refreshUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};