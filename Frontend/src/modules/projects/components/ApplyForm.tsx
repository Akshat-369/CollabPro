import React from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { ApplicationFormData } from '../types/application.types';

interface ApplyFormProps {
    formData: ApplicationFormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPreview: () => void;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ formData, handleChange, handleFileChange, onPreview }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPreview();
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="block text-sm font-bold text-mine-shaft-200">Attach Resume <span className="text-red-500">*</span></label>
                <div className="relative w-full">
                    <input 
                        type="file" 
                        id="resume-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="resume-upload" className="flex items-center w-full px-4 py-3.5 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg cursor-pointer hover:bg-mine-shaft-800 transition-colors group">
                        <Paperclip size={20} className="text-mine-shaft-400 mr-3 group-hover:text-bright-sun-400 transition-colors rotate-45" />
                        <span className={`${formData.resume ? 'text-mine-shaft-50' : 'text-mine-shaft-500'} text-base group-hover:text-mine-shaft-300`}>
                            {formData.resume ? formData.resume.name : "Choose file"}
                        </span>
                    </label>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-mine-shaft-200">Cover Letter <span className="text-red-500">*</span></label>
                <textarea 
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Type something about yourself..." 
                    className="w-full px-4 py-3.5 bg-mine-shaft-900 border border-mine-shaft-700 rounded-lg text-mine-shaft-50 placeholder-mine-shaft-500 focus:outline-none focus:border-bright-sun-400 transition-colors resize-none"
                    required
                />
            </div>

            <div className="pt-4 pb-8">
                <Button 
                    type="submit"
                    className="w-full h-12 font-bold text-lg bg-bright-sun-400 text-black hover:bg-bright-sun-500 rounded-lg"
                >
                    Preview
                </Button>
            </div>
        </form>
    );
};

export default ApplyForm;