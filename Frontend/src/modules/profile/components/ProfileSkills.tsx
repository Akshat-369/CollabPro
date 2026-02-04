import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface ProfileSkillsProps {
    skills: string[];
    onSave: (skills: string[]) => void;
}

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ skills, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [skillList, setSkillList] = useState(skills);
    const [newSkill, setNewSkill] = useState('');

    const handleSave = () => {
        onSave(skillList);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setSkillList(skills);
        setIsEditing(false);
    };

    const removeSkill = (skillToRemove: string) => {
        setSkillList(skillList.filter(s => s !== skillToRemove));
    };

    const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newSkill.trim()) {
            if (!skillList.includes(newSkill.trim())) {
                setSkillList([...skillList, newSkill.trim()]);
            }
            setNewSkill('');
        }
    };

    return (
        <section className="mb-10 px-2 md:px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-mine-shaft-50">Skills</h2>
                {isEditing ? (
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="p-2 text-green-500 hover:bg-mine-shaft-900 rounded-full transition-colors"><Check size={24}/></button>
                        <button onClick={handleCancel} className="p-2 text-red-500 hover:bg-mine-shaft-900 rounded-full transition-colors"><X size={24}/></button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="p-2 text-bright-sun-400 hover:bg-mine-shaft-900 rounded-full transition-colors">
                        <Pencil size={20} />
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-4">
                     <div className="flex flex-wrap gap-3 mb-4">
                        {skillList.map((skill, index) => (
                            <span key={index} className="flex items-center gap-2 px-3 py-1.5 bg-mine-shaft-800 border border-mine-shaft-600 text-mine-shaft-200 rounded-full text-sm font-medium">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                    <input 
                        type="text" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={addSkill}
                        placeholder="Add skills (Press Enter)" 
                        className="w-full bg-transparent border-none outline-none text-mine-shaft-50 placeholder-mine-shaft-500"
                    />
                </div>
            ) : (
                <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                        <span key={index} className="px-4 py-1.5 bg-mine-shaft-900/80 border border-mine-shaft-800 text-bright-sun-400 rounded-full text-sm font-medium hover:bg-mine-shaft-800 transition-colors cursor-default">
                            {skill}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProfileSkills;