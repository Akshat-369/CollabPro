import React from 'react';
import { Paperclip, IndianRupee } from 'lucide-react';
import { Task } from '../../../../Data/types';
import { IMAGES } from '../../../../Data/images';

interface TaskCardProps {
  task: Task;
  isDragged: boolean;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onClick: (task: Task) => void;
  membersData?: any[];
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragged, onDragStart, onClick, membersData }) => {
  // Helper to get user image from membersData or mock
  const getUserImage = (name?: string) => {
      if (!name) return IMAGES.currentUser;
      const member = membersData?.find((m: any) => m.name === name);
      if (member?.profileImage) return member.profileImage;

      // Fallback to mocks if no member found (legacy behavior)
      if (name?.includes('Shivam')) return IMAGES.testimonials.user1;
      if (name?.includes('Abhishek')) return IMAGES.testimonials.user2;
      if (name?.includes('Swapnil')) return IMAGES.testimonials.user3;
      if (name?.includes('Pavan')) return IMAGES.testimonials.user4;
      return IMAGES.currentUser;
  };

  return (
    <div 
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        onClick={() => onClick(task)}
        className={`bg-mine-shaft-800 p-4 rounded-xl border border-mine-shaft-700 cursor-grab hover:border-bright-sun-500/50 hover:shadow-lg hover:shadow-bright-sun-500/5 transition-all group ${
            isDragged ? 'opacity-50 scale-95' : 'opacity-100'
        }`}
    >
        <div className="flex justify-between items-start mb-1">
            <h4 className="text-sm font-bold text-mine-shaft-50 group-hover:text-bright-sun-400 transition-colors">{task.title}</h4>
            {task.attachments && task.attachments.length > 0 && <Paperclip size={12} className="text-mine-shaft-500"/>}
        </div>
        <p className="text-[10px] text-mine-shaft-400 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-mine-shaft-800 overflow-hidden" title={task.assignedTo || "Unassigned"}>
                    <img src={getUserImage(task.assignedTo)} className="w-full h-full object-cover" alt={task.assignedTo || "User"}/>
                </div>
                {task.assignedTo && <span className="text-[10px] text-mine-shaft-300">{task.assignedTo.split(' ')[0]}</span>}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-bright-sun-400 flex items-center">
                    <IndianRupee size={10} /> {task.amount}
                </span>
                <span className="text-[10px] text-mine-shaft-400 bg-mine-shaft-900 px-2 py-1 rounded">{task.date}</span>
            </div>
        </div>
    </div>
  );
};

export default TaskCard;