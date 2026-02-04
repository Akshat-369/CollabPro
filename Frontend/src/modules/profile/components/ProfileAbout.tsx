import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface ProfileAboutProps {
    about: string;
    onSave: (text: string) => void;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ about, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(about);

    const handleSave = () => {
        onSave(text);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setText(about);
        setIsEditing(false);
    };

    return (
        <section className="mb-10 px-2 md:px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-mine-shaft-50">About</h2>
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
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={5}
                    className="w-full bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-4 text-mine-shaft-200 leading-relaxed outline-none focus:border-bright-sun-400 transition-colors resize-none"
                />
            ) : (
                <p className="text-mine-shaft-200 leading-relaxed text-base">
                    {about}
                </p>
            )}
        </section>
    );
};

export default ProfileAbout;