import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../layout/Footer';
import { Button } from '../../../../shared/ui/Button';
import { ArrowLeft, X, Plus } from 'lucide-react';
import RichTextEditor from '../../../../shared/components/RichTextEditor';
import { useProject } from '../../../../context/ProjectContext';
import { useUser } from '../../../../context/UserContext';
import { Job } from '../../../../Data/jobs';

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID from URL if editing
  const { addJob, updateJob, getJob, refreshJob } = useProject();
  const { userProfile } = useUser();
  
  const [formData, setFormData] = useState({
    title: '', location: '', price: '', experience: '', projectType: '', status: 'Active', aboutProject: '',
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  
  // Load existing data if editing
  useEffect(() => {
    if (id) {
        const jobToEdit = getJob(id);
        if (jobToEdit) {
            setFormData({
                title: jobToEdit.title,
                location: jobToEdit.location,
                price: jobToEdit.price.replace(/[^0-9]/g, ''), // Strip non-numeric for input
                experience: jobToEdit.experience,
                projectType: jobToEdit.projectType,
                status: jobToEdit.status || 'Active',
                aboutProject: jobToEdit.longDescription,
            });
            setSkills(jobToEdit.tags);
            setResponsibilities(jobToEdit.requirements.length > 0 ? jobToEdit.requirements : ['']);
        } else {
            refreshJob(id);
        }
    }
  }, [id, getJob, refreshJob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
        setFormData(prev => ({ ...prev, price: parseInt(value, 10).toLocaleString() }));
    } else {
        setFormData(prev => ({ ...prev, price: '' }));
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(currentSkill.trim())) setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill));

  const updateList = (list: string[], setList: (l: string[]) => void, index: number, value: string) => {
    const newList = [...list]; newList[index] = value; setList(newList);
  };
  const addToList = (list: string[], setList: (l: string[]) => void) => setList([...list, '']);
  const removeFromList = (list: string[], setList: (l: string[]) => void, index: number) => setList(list.filter((_, i) => i !== index));

  const createJobObject = (statusOverride?: string): Job => {
    return {
        id: id || Date.now().toString(), // Use existing ID if editing, else new
        title: formData.title,
        applicants: id ? getJob(id)?.applicants || 0 : 0, // Preserve applicants count if editing
        tags: skills,
        // Create a simple text description from rich text (stripping HTML tags for preview)
        description: formData.aboutProject.replace(/<[^>]*>?/gm, '').substring(0, 150) + (formData.aboutProject.length > 150 ? '...' : ''),
        longDescription: formData.aboutProject,
        requirements: responsibilities.filter(r => r.trim() !== ''),
        price: formData.price ? `₹${formData.price}` : '₹0',
        postedAgo: id ? getJob(id)?.postedAgo || 'Just now' : 'Just now',
        location: formData.location || 'Remote',
        experience: formData.experience || 'Entry Level',
        projectType: formData.projectType || 'Full-Stack',
        company: userProfile.name || 'User', // Use dynamic user name
        postedByMe: true,
        status: (statusOverride || formData.status) as 'Active' | 'Draft' | 'Closed',
        companyLogo: undefined // Default
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = createJobObject();
    
    try {
        if (id) {
            await updateJob(jobData);
            // alert('Project updated successfully!'); 
        } else {
            await addJob(jobData);
            // alert('Project created successfully!');
        }
        navigate('/manage');
    } catch (error) {
        console.error(error);
        alert('Failed to save project. Please try again.');
    }
  };

  const handleSaveDraft = async () => {
      if (!formData.title) {
          alert("Please enter a project title to save as draft.");
          return;
      }
      const jobData = createJobObject('Draft');
      
      try {
        if (id) {
            await updateJob(jobData);
        } else {
            await addJob(jobData);
        }
        navigate('/manage', { state: { tab: 'status' } });
      } catch (error) {
         console.error(error);
         alert('Failed to save draft.');
      }
  };

  return (
    <main className="flex-grow flex flex-col bg-mine-shaft-950 text-mine-shaft-50 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-mine-shaft-900 border border-mine-shaft-800 flex items-center justify-center text-mine-shaft-300 hover:text-mine-shaft-50 hover:border-bright-sun-400 transition-all"><ArrowLeft size={20} /></button>
          <h1 className="text-3xl font-bold text-mine-shaft-50">{id ? 'Edit Project' : 'Post a Project'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Project Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter Project Title" className="w-full h-12 px-4 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-all" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Project Type <span className="text-red-500">*</span></label>
                    <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full h-12 px-4 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-all appearance-none" required>
                      <option value="" disabled>Enter Project Type</option>
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Experience <span className="text-red-500">*</span></label>
                    <select name="experience" value={formData.experience} onChange={handleChange} className="w-full h-12 px-4 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-all appearance-none" required>
                      <option value="" disabled>Enter Experience Level</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                </div>
                <div>
                      <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Location <span className="text-red-500">*</span></label>
                      <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter Project Location" className="w-full h-12 px-4 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-all" required />
                </div>
                <div>
                      <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Price <span className="text-red-500">*</span></label>
                      <input type="text" name="price" value={formData.price} onChange={handlePriceChange} placeholder="Enter Price" className="w-full h-12 px-4 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-all" required />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Skills <span className="text-red-500">*</span></label>
                <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg p-2 focus-within:border-bright-sun-400 transition-all">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {skills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-mine-shaft-800 rounded-md border border-mine-shaft-700 text-sm text-bright-sun-400">
                            <span>{skill}</span>
                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-mine-shaft-50"><X size={14}/></button>
                        </div>
                        ))}
                    </div>
                    <input type="text" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} onKeyDown={handleAddSkill} placeholder="Enter Skills (Press Enter)" className="w-full h-8 px-2 bg-transparent border-none outline-none text-mine-shaft-50 placeholder-mine-shaft-500" />
                </div>
            </div>

            <div>
                 <h3 className="text-lg font-bold text-mine-shaft-100 mb-2">About The Project</h3>
                 <RichTextEditor value={formData.aboutProject} onChange={(html) => setFormData(prev => ({...prev, aboutProject: html}))} />
            </div>

            <div>
                <h3 className="text-lg font-bold text-mine-shaft-100 mb-2">Responsibilities</h3>
                <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg p-6 space-y-3">
                    {responsibilities.map((res, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-bright-sun-400 shrink-0"></div>
                            <input type="text" value={res} onChange={(e) => updateList(responsibilities, setResponsibilities, index, e.target.value)} placeholder="Add responsibilities here..." className="flex-grow h-10 px-3 bg-mine-shaft-950 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-all text-sm" />
                            <button type="button" onClick={() => removeFromList(responsibilities, setResponsibilities, index)} className="p-2 text-mine-shaft-400 hover:text-red-500 transition-colors" disabled={responsibilities.length === 1}><X size={16} /></button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addToList(responsibilities, setResponsibilities)} className="flex items-center gap-2 text-sm text-bright-sun-400 font-medium mt-2 pl-2"><Plus size={16} /> Add another responsibility</button>
                </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-mine-shaft-50 mb-4">{id ? 'Update Project' : 'Publish Project'}</h3>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Status</label>
                     <select name="status" value={formData.status} onChange={handleChange} className="w-full h-11 px-4 bg-mine-shaft-950 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-all appearance-none text-sm">
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Closed">Closed</option>
                        </select>
                </div>
                <Button type="submit" className="w-full font-bold mb-3">{id ? 'Save Changes' : 'Publish Project'}</Button>
                <Button type="button" variant="outline" className="w-full" onClick={handleSaveDraft}>Save as Draft</Button>
             </div>
          </div>
        </form>
      </div>
      <Footer />
    </main>
  );
};

export default CreateProjectPage;