import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../../layout/Footer';
import ApplyForm from '../components/ApplyForm';
import ApplyPreview from '../components/ApplyPreview';
import { ApplicationFormData } from '../types/application.types';
import { useUser } from '../../../../context/UserContext';
import { useProject } from '../../../../context/ProjectContext';

const ApplyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applyForJob } = useUser();
  const { getJob, refreshJob } = useProject();
  
  const job = id ? getJob(id) : undefined;

  const [formData, setFormData] = useState<ApplicationFormData>({
    coverLetter: '',
    resume: null
  });

  const [isPreview, setIsPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handlePreview = () => {
      setIsPreview(true);
      window.scrollTo(0, 0);
  };

  const handleEdit = () => {
      setIsPreview(false);
      window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
      console.log("Submitting Application:", formData);
      if (id) {
          await applyForJob(id, formData);
          await refreshJob(id);
      }
      navigate('/browse');
  };

  if (!job) return <div className="min-h-screen flex items-center justify-center text-mine-shaft-50 bg-mine-shaft-950">Project not found</div>;

  return (
    <main className="flex-grow flex flex-col bg-mine-shaft-950 text-mine-shaft-50 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-20 py-10">
        <div className="mb-8">
            <button 
                onClick={() => isPreview ? handleEdit() : navigate(-1)} 
                className="flex items-center gap-2 bg-mine-shaft-900 border border-mine-shaft-800 text-bright-sun-400 px-4 py-2 rounded-lg hover:bg-mine-shaft-800 transition-colors font-medium text-sm"
            >
                <ArrowLeft size={16} /> Back
            </button>
        </div>

        <div className="mb-10 border-b border-mine-shaft-800 pb-8">
            <h1 className="text-3xl font-bold text-mine-shaft-50 mb-3">{job.title}</h1>
            <div className="text-mine-shaft-300 font-medium text-base flex items-center gap-2">
                <span>{job.postedAgo}</span>
                <span className="w-1.5 h-1.5 bg-mine-shaft-500 rounded-full"></span>
                <span>{job.applicants} Applicants</span>
            </div>
        </div>

        <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-mine-shaft-50 mb-8 capitalize">
                {isPreview ? 'Review Application' : 'Submit your Application'}
            </h2>
            
            {isPreview ? (
                <ApplyPreview 
                    formData={formData} 
                    onEdit={handleEdit} 
                    onSubmit={handleSubmit} 
                />
            ) : (
                <ApplyForm 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleFileChange={handleFileChange} 
                    onPreview={handlePreview} 
                />
            )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default ApplyPage;



