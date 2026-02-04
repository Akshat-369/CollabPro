import React from 'react';
import { Heart, Calendar, Clock } from 'lucide-react';
import { IMAGES } from '../../../../Data/images';
import { Candidate } from '../../../../Data/types';

import { useNavigate } from 'react-router-dom';

interface CandidateCardProps {
    candidate: Candidate;
    onSchedule?: () => void;
    onAccept?: () => void;
    onReject?: () => void;
    onViewApplication?: () => void;
    formatDateDisplay: (d: string) => string;
    formatTimeDisplay: (t: string) => string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onSchedule, onAccept, onReject, onViewApplication, formatDateDisplay, formatTimeDisplay }) => {
    const navigate = useNavigate();
    const isInvited = candidate.status === 'invited';
    const isOffered = candidate.status === 'offered';
    const isHired = candidate.status === 'hired';

    // Helper to get image based on index or default to current user if 0
    const getImage = (index: number) => {
        if (candidate.profileImage) return candidate.profileImage;
        if (index === 0) return IMAGES.currentUser;
        return IMAGES.testimonials[`user${(index % 4) + 1}` as keyof typeof IMAGES.testimonials] || IMAGES.currentUser;
    };

    return (
        <div className={`bg-mine-shaft-900 border rounded-xl p-4 transition-all duration-300 w-full group flex flex-col justify-between
            ${(isInvited || isOffered || isHired) ? 'border-bright-sun-400/30 shadow-lg shadow-bright-sun-400/5' : 'border-mine-shaft-800 hover:border-bright-sun-400 hover:shadow-lg hover:shadow-bright-sun-400/10'}
        `}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full border border-mine-shaft-700 overflow-hidden relative shrink-0">
                        <img 
                            src={getImage(candidate.imageIndex)} 
                            alt={candidate.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-mine-shaft-50 text-sm">{candidate.name}</h4>
                        <div className="text-[10px] text-mine-shaft-300 flex flex-col">
                             <span>{candidate.email || 'marshal.dev@collabpro.com'}</span>
                             <span>{candidate.phone || '+1 555 123-4567'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-[11px] text-mine-shaft-300 leading-relaxed line-clamp-3 mb-4">
                {candidate.description}
            </p>

            {(isInvited || isOffered || isHired) && candidate.interview && (
                <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs text-mine-shaft-100 bg-mine-shaft-800/30 p-2 rounded-lg border-l-2 border-bright-sun-400">
                        <Calendar size={14} className="text-mine-shaft-400" />
                        <span>
                            Interview: <span className="text-mine-shaft-50">{formatDateDisplay(candidate.interview.date)}</span> at <span className="text-bright-sun-400 font-bold">{formatTimeDisplay(candidate.interview.time)}</span>
                        </span>
                    </div>
                </div>
            )}

            <div className="mt-auto">
                {isInvited ? (
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                             <button 
                                onClick={onAccept}
                                className="flex-1 py-1.5 rounded-lg border border-bright-sun-400 text-bright-sun-400 text-xs font-bold hover:bg-bright-sun-400 hover:text-black transition-colors"
                             >
                                Accept
                            </button>
                            <button 
                                onClick={onReject}
                                className="flex-1 py-1.5 rounded-lg border border-mine-shaft-700 bg-mine-shaft-800 text-mine-shaft-300 text-xs font-bold hover:bg-mine-shaft-700 hover:text-white transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                        <button 
                            onClick={onViewApplication}
                            className="w-full py-2 rounded-lg bg-bright-sun-400 text-black text-xs font-bold hover:bg-bright-sun-500 transition-colors"
                        >
                            View Application
                        </button>
                    </div>
                ) : isOffered ? (
                     <div className="w-full py-2.5 rounded-lg bg-mine-shaft-800 border border-mine-shaft-700 text-mine-shaft-300 text-xs flex items-center justify-center gap-2">
                        <Clock size={14} className="animate-pulse text-bright-sun-400"/>
                        <span>Waiting for applicant to accept...</span>
                     </div>
                ) : isHired ? (
                    <div className="w-full py-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold flex items-center justify-center gap-2">
                       Hired
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => navigate(`/applicants/profile/${candidate.userId}`)}
                                className="flex-1 py-1.5 rounded-lg border border-bright-sun-400 text-bright-sun-400 text-xs font-bold hover:bg-bright-sun-400 hover:text-black transition-colors"
                            >
                                Profile
                            </button>
                            <button 
                                onClick={onSchedule}
                                className="flex-1 py-1.5 rounded-lg border border-bright-sun-400 text-bright-sun-400 text-xs font-bold hover:bg-bright-sun-400 hover:text-black transition-colors flex items-center justify-center gap-1"
                            >
                                Schedule <Calendar size={12} />
                            </button>
                        </div>
                        
                        <button 
                            onClick={onViewApplication}
                            className="w-full py-2 rounded-lg bg-bright-sun-400 text-black text-xs font-bold hover:bg-bright-sun-500 transition-colors"
                        >
                            View Application
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateCard;