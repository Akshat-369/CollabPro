import React, { useState } from 'react';
import { Pencil, Plus, X, Building2 } from 'lucide-react';
import ExperienceForm from './ExperienceForm';
import { Experience } from '../../../../Data/types';

interface ProfileExperienceProps {
    experiences: Experience[];
    onUpdate?: (experiences: Experience[]) => void;
}

const ProfileExperience: React.FC<ProfileExperienceProps> = ({ experiences, onUpdate }) => {
    const [isManageMode, setIsManageMode] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = (data: Experience) => {
        if (!onUpdate) return;
        
        let updatedList = [...experiences];
        if (editingIndex !== null) {
            updatedList[editingIndex] = data;
        } else if (isAdding) {
            updatedList = [data, ...updatedList];
        }
        
        onUpdate(updatedList);
        setEditingIndex(null);
        setIsAdding(false);
    };

    const handleDelete = (index: number) => {
        if (!onUpdate) return;
        const updatedList = experiences.filter((_, i) => i !== index);
        onUpdate(updatedList);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setIsAdding(false);
    };

    return (
        <section className="mb-10 px-2 md:px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-mine-shaft-50">Experience</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => { setIsAdding(true); setEditingIndex(null); }}
                        className="p-2 text-bright-sun-400 hover:bg-mine-shaft-900 rounded-full transition-colors"
                        title="Add Experience"
                    >
                        <Plus size={24} />
                    </button>
                    {isManageMode ? (
                        <button onClick={() => { setIsManageMode(false); setEditingIndex(null); setIsAdding(false); }} className="p-2 text-red-500 hover:bg-mine-shaft-900 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                    ) : (
                        <button onClick={() => setIsManageMode(true)} className="p-2 text-bright-sun-400 hover:bg-mine-shaft-900 rounded-full transition-colors">
                            <Pencil size={20} />
                        </button>
                    )}
                </div>
            </div>
            
            <div className="space-y-6">
                {isAdding && (
                    <div className="mb-8 border-b border-mine-shaft-800 pb-8">
                         <ExperienceForm 
                            onSave={handleSave}
                            onCancel={handleCancel}
                         />
                    </div>
                )}

                {experiences.map((exp, index) => (
                    <div key={index}>
                        {editingIndex === index ? (
                            <ExperienceForm 
                                initialData={exp}
                                onSave={handleSave}
                                onCancel={handleCancel}
                            />
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-lg bg-white p-2 flex items-center justify-center shrink-0 shadow-sm border border-mine-shaft-700/30 overflow-hidden">
                                        {exp.logo ? (
                                            <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                                        ) : (
                                            <Building2 className="text-gray-400" size={24} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                                            <div>
                                                <h3 className="text-lg font-bold text-mine-shaft-50">{exp.role}</h3>
                                                <p className="text-sm text-mine-shaft-300">{exp.company} • {exp.location}</p>
                                            </div>
                                            <span className="text-sm text-mine-shaft-400 font-medium mt-1 md:mt-0">{exp.date}</span>
                                        </div>
                                        <p className="text-mine-shaft-400 text-sm mt-2 leading-relaxed">
                                            {exp.description}
                                        </p>

                                        {isManageMode && (
                                            <div className="flex gap-3 mt-4">
                                                <button 
                                                    onClick={() => { setEditingIndex(index); setIsAdding(false); }}
                                                    className="px-6 py-2 rounded-lg border border-bright-sun-400 text-bright-sun-400 text-sm font-bold hover:bg-bright-sun-400 hover:text-black transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(index)}
                                                    className="px-6 py-2 rounded-lg bg-mine-shaft-800 border border-mine-shaft-700 text-red-400 text-sm font-bold hover:bg-mine-shaft-700 hover:text-red-300 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProfileExperience;
