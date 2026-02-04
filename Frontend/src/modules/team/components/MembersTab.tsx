import React, { useState, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { useUser } from '../../../../context/UserContext';
import TeamMemberCard from './TeamMemberCard';
import { Candidate } from '../../../../Data/types';
import ProjectService from '../../projects/service/project.service';

interface MembersTabProps {
  jobId?: string;
  isManager?: boolean;
}

import { getCompanyLogo } from '../../../../shared/utils/companyUtils';


const MembersTab: React.FC<MembersTabProps> = ({ jobId, isManager }) => {
  const { updateCandidateStatus } = useUser();
  const [members, setMembers] = useState<any[]>([]);
  
  const fetchMembers = React.useCallback(async () => {
      if (!jobId) return;
      try {
          const membersData = await ProjectService.getProjectMembers(jobId);
          setMembers(membersData);
      } catch (e) {
          console.error("Failed to load members", e);
      }
  }, [jobId]);

  React.useEffect(() => {
      fetchMembers();
  }, [fetchMembers]);

  // Data is already filtered/hired from backend
  const hiredMembers = members;

  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [memberToRemoveId, setMemberToRemoveId] = useState<number | null>(null);

  const requestRemove = (id: number) => {
    setMemberToRemoveId(id);
    setIsRemoveConfirmOpen(true);
  };

  const confirmRemove = async () => {
    if (memberToRemoveId && jobId) {
        try {
            await ProjectService.removeMember(jobId, memberToRemoveId);
            fetchMembers();
        } catch (e) {
            console.error("Failed to remove member", e);
        }
    }
    setIsRemoveConfirmOpen(false);
    setMemberToRemoveId(null);
  };

  return (
    <>
      <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-mine-shaft-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-mine-shaft-50">Team Members</h3>
            <span className="bg-mine-shaft-800 text-mine-shaft-300 text-xs px-2 py-0.5 rounded-full">{hiredMembers.length}</span>
          </div>
        </div>
        <div className="divide-y divide-mine-shaft-800">
          {hiredMembers.length > 0 ? (
            hiredMembers.map((member) => (
               <TeamMemberCard 
                  key={member.id}
                  member={member}
                  isNew={false} 
                  onRemove={isManager ? () => requestRemove(member.id) : undefined}
               />
            ))
          ) : (
            <div className="p-12 text-center text-mine-shaft-400 italic flex flex-col items-center gap-2">
                <span className="text-3xl">👥</span>
                <p>No members in this project yet.</p>
                <p className="text-xs text-mine-shaft-500">Hire applicants from the Proposals tab to see them here.</p>
            </div>
          )}
        </div>
      </div>

       {isRemoveConfirmOpen && (
             <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsRemoveConfirmOpen(false)}
                ></div>

                <div className="relative bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
                     <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-mine-shaft-50">Remove Member?</h3>
                            <p className="text-sm text-mine-shaft-400 mt-2">
                                Are you sure you want to remove this member from the project? They will be moved back to the applicants list.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full mt-4">
                            <Button 
                                variant="secondary" 
                                className="flex-1"
                                onClick={() => setIsRemoveConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white hover:text-white"
                                onClick={confirmRemove}
                            >
                                Remove
                            </Button>
                        </div>
                     </div>
                </div>
             </div>
        )}
    </>
  );
};

export default MembersTab;