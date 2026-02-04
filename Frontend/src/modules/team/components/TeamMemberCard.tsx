import React from 'react';
import { Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { IMAGES } from '../../../../Data/images';
import { Candidate } from '../../../../Data/types';

interface TeamMemberCardProps {
  member: {
      id: number;
      name: string;
      email: string;
      profileImage?: string;
      // Optional fields that might flow through if we reused Candidate type, ignoring them is fine
      [key: string]: any;
  };
  isNew?: boolean;
  onRemove?: () => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, isNew, onRemove }) => {
  
  const avatarUrl = member.profileImage || IMAGES.currentUser;
  const displayEmail = member.email || 'No email';
  const displayDate = member.joinedAt || member.joinedDate || "Recently";

  return (
    <div className={`p-6 flex items-center justify-between hover:bg-mine-shaft-800/50 transition-colors ${isNew ? 'bg-bright-sun-400/5' : ''}`}>
        <div className="flex items-center gap-4">
            <img 
            src={avatarUrl} 
            alt="Member" 
            className="w-12 h-12 rounded-full object-cover border border-mine-shaft-700" 
            />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
            <div>
                <h4 className="font-bold text-mine-shaft-50 flex items-center gap-2">
                    {member.name}
                    {isNew && <span className="bg-bright-sun-400 text-black text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">New</span>}
                </h4>
            </div>
            <div className="hidden sm:block">
                <p className="text-sm font-medium text-mine-shaft-50">{displayEmail}</p>
                <p className="text-xs text-mine-shaft-400 mt-0.5">Joined: {displayDate}</p>
            </div>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
            {onRemove && (
            <Button 
                variant="ghost" 
                size="icon"
                className="text-red-400 hover:text-red-300 hover:bg-mine-shaft-800"
                onClick={onRemove}
                title="Remove Member"
            >
                <Trash2 size={18} />
            </Button>
            )}
            <Button variant="ghost" size="icon"><MoreHorizontal size={18} className="text-mine-shaft-400"/></Button>
        </div>
    </div>
  );
};

export default TeamMemberCard;