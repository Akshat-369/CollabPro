import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Job } from '../Data/jobs';
import ProjectService from '../src/modules/projects/service/project.service';
import { Task } from '../Data/types';
import { IMAGES } from '../Data/images';
import { useUser } from './UserContext';

// Initial Sample Tasks Data
const INITIAL_TASKS: Record<string, Task[]> = {};

interface ProjectContextType {
  jobs: Job[];
  addJob: (job: Job) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  getJob: (id: string) => Job | undefined;
  refreshJob: (id: string) => Promise<void>;
  refreshAllProjects: () => Promise<void>;
  // Task Management
  getProjectTasks: (jobId: string) => Task[];
  refreshTasks: (jobId: string) => Promise<void>;
  addTask: (jobId: string, task: Task) => Promise<void>;
  updateTask: (jobId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (jobId: string, taskId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [projectTasks, setProjectTasks] = useState<Record<string, Task[]>>(INITIAL_TASKS);

  // Load jobs on mount and when user profile changes (e.g. login)
  const { userProfile } = useUser();
  
  const refreshAllProjects = useCallback(async () => {
    try {
        const fetchedJobs = await ProjectService.getAllProjects();
        setJobs(fetchedJobs);
    } catch (error) {
        console.error("Failed to load projects", error);
    }
  }, []);

  useEffect(() => {
    refreshAllProjects();
  }, [userProfile, refreshAllProjects]); // Refresh when user changes or refreshAllProjects changes

  // Job Functions
  const addJob = useCallback(async (newJob: Job) => {
    try {
        const created = await ProjectService.createProject(newJob);
        setJobs((prev) => [created, ...prev]);
    } catch (error) {
        console.error("Failed to add job", error);
        throw error;
    }
  }, []);

  const updateJob = useCallback(async (updatedJob: Job) => {
     try {
        const updated = await ProjectService.updateProject(updatedJob);
        setJobs((prev) => prev.map((job) => (job.id === updated.id ? updated : job)));
     } catch (error) {
        console.error("Failed to update job", error);
        throw error;
     }
  }, []);
  
  const refreshJob = useCallback(async (id: string) => {
      try {
          const job = await ProjectService.getProject(id);
          setJobs(prev => {
              const exists = prev.find(j => j.id === id);
              if (exists) return prev.map(j => j.id === id ? job : j);
              return [...prev, job];
          });
      } catch (error) {
          console.error("Failed to refresh job", error);
      }
  }, []);
  
  const getJob = useCallback((id: string) => {
      return jobs.find(j => j.id === id);
  }, [jobs]);

  // Task Functions
  const getProjectTasks = useCallback((jobId: string) => {
      return projectTasks[jobId] || [];
  }, [projectTasks]);

  const refreshTasks = useCallback(async (jobId: string) => {
      try {
          const tasks = await ProjectService.getTasks(jobId);
          setProjectTasks(prev => ({
              ...prev,
              [jobId]: tasks
          }));
      } catch (e) {
          console.error("Failed to refresh tasks", e);
      }
  }, []);

  const addTask = useCallback(async (jobId: string, task: Task) => {
      try {
        const created = await ProjectService.createTask(jobId, task);
        setProjectTasks(prev => ({
            ...prev,
            [jobId]: [...(prev[jobId] || []), created]
        }));
      } catch (e) {
          console.error("Failed to add task", e);
      }
  }, []);

  const updateTask = useCallback(async (jobId: string, taskId: string, updates: Partial<Task>) => {
      try {
          // Optimistic update
          setProjectTasks(prev => ({
              ...prev,
              [jobId]: (prev[jobId] || []).map(t => t.id === taskId ? { ...t, ...updates } : t)
          }));
          
          await ProjectService.updateTask(jobId, taskId, updates);
      } catch (e) {
          console.error("Failed to update task", e);
          alert("Failed to update task"); 
      }
  }, []);

  const deleteTask = useCallback(async (jobId: string, taskId: string) => {
      try {
          await ProjectService.deleteTask(jobId, taskId);
          setProjectTasks(prev => ({
              ...prev,
              [jobId]: (prev[jobId] || []).filter(t => t.id !== taskId)
          }));
      } catch (e) {
          console.error("Failed to delete task", e);
          alert("Failed to delete task");
      }
  }, []);


  const contextValue = React.useMemo(() => ({ 
      jobs, addJob, updateJob, getJob, refreshJob, refreshAllProjects,
      getProjectTasks, refreshTasks, addTask, updateTask, deleteTask
  }), [jobs, addJob, updateJob, getJob, refreshJob, refreshAllProjects,
       getProjectTasks, refreshTasks, addTask, updateTask, deleteTask]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};