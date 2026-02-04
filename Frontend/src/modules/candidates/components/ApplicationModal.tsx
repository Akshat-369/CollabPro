import React from 'react';
import { X, FileText } from 'lucide-react';
import { Candidate } from '../../../../Data/types';

interface ApplicationModalProps {
    candidate: Candidate;
    onClose: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({ candidate, onClose }) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            ></div>

            <div className="relative bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-mine-shaft-50">Application</h3>
                    <button 
                        onClick={onClose} 
                        className="text-mine-shaft-400 hover:text-mine-shaft-50 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Resume Section */}
                    <div>
                        <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Resume</label>
                        {candidate.resume ? (
                            <a 
                                href={candidate.resumeUrl || "#"} 
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={async (e) => {
                                    if (!candidate.resumeUrl) {
                                        e.preventDefault();
                                        return;
                                    }
                                    
                                    // If it is our internal API, we must fetch with Auth header
                                    if (candidate.resumeUrl.startsWith('/api/')) {
                                        e.preventDefault();
                                        try {
                                            const token = localStorage.getItem('token');
                                            const finalUrl = `http://localhost:8080${candidate.resumeUrl}`;
                                            const response = await fetch(finalUrl, {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`
                                                }
                                            });
                                            
                                            if (response.ok) {
                                                const blob = await response.blob();
                                                const blobUrl = window.URL.createObjectURL(blob);
                                                window.open(blobUrl, '_blank');
                                            } else {
                                                console.error("Failed to download resume", response.status);
                                                alert("Failed to access resume. You may not have permission.");
                                            }
                                        } catch (err) {
                                            console.error("Error downloading resume", err);
                                        }
                                    }
                                }}
                                className="flex items-center gap-2 text-bright-sun-400 hover:underline w-fit"
                            >
                                <FileText size={18} />
                                <span className="font-medium">{candidate.resume}</span>
                            </a>
                        ) : (
                            <p className="text-sm text-mine-shaft-500 italic">No resume attached.</p>
                        )}
                    </div>

                    {/* Cover Letter Section */}
                    <div>
                        <label className="block text-sm font-medium text-mine-shaft-300 mb-2">Cover Letter</label>
                        <div className="w-full bg-mine-shaft-950 border border-mine-shaft-800 rounded-xl p-4 text-sm text-mine-shaft-100 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                            {candidate.description || "No cover letter provided."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;