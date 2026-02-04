import React from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { ApplicationFormData } from '../types/application.types';

interface ApplyPreviewProps {
    formData: ApplicationFormData;
    onEdit: () => void;
    onSubmit: () => void;
}

const ApplyPreview: React.FC<ApplyPreviewProps> = ({ formData, onEdit, onSubmit }) => {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <label className="block text-sm font-bold text-mine-shaft-200">Attach Resume <span className="text-red-500">*</span></label>
                <div className="flex items-center w-full px-4 py-3.5 bg-mine-shaft-900/50 border border-transparent rounded-lg">
                    <Paperclip size={20} className="text-mine-shaft-400 mr-3 rotate-45" />
                    <span className="text-mine-shaft-300 text-base">
                        {formData.resume ? formData.resume.name : "No file selected"}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-bold text-mine-shaft-200">Cover Letter <span className="text-red-500">*</span></label>
                <div className="w-full py-3.5 text-mine-shaft-300 font-medium text-base leading-relaxed whitespace-pre-wrap">
                    {formData.coverLetter}
                </div>
            </div>

            <div className="pt-4 pb-8 flex gap-4">
                <Button 
                    type="button"
                    variant="outline"
                    onClick={onEdit}
                    className="flex-1 h-12 font-bold text-lg border-bright-sun-400 text-bright-sun-400 hover:bg-bright-sun-400 hover:text-black rounded-lg transition-colors"
                >
                    Edit
                </Button>
                <Button 
                    type="button"
                    onClick={onSubmit}
                    className="flex-1 h-12 font-bold text-lg bg-bright-sun-400 text-black hover:bg-bright-sun-500 rounded-lg"
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default ApplyPreview;