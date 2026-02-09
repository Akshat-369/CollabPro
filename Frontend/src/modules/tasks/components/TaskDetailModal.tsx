import React, { useRef, useState } from 'react';
import { X, Pencil, Paperclip, Smile, AtSign, IndianRupee, Calendar, Trash2, File, FileText, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { IMAGES } from '../../../../Data/images';
import { Task } from '../../../../Data/types';

interface TaskDetailModalProps {
  task: Task;
  newComment: string;
  isManager?: boolean;
  onClose: () => void;
  onEdit?: (status: string, task: Task) => void;
  onDelete?: (taskId: string) => void;
  onCommentChange: (val: string) => void;
  onAddComment: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentUser?: string;
  onDeleteAttachment?: (attachmentId: string) => void;
  membersData?: any[];
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ 
  task, newComment, isManager, onClose, onEdit, onDelete, onCommentChange, onAddComment, onFileChange, currentUser, onDeleteAttachment, membersData
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState<string | null>(null);

  const handleAddAttachmentClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  const getFileIcon = (type: string) => {
      switch(type) {
          case 'pdf': return <FileText size={20} className="text-red-400" />;
          case 'image': return <ImageIcon size={20} className="text-blue-400" />;
          default: return <File size={20} className="text-gray-400" />;
      }
  };

  const getUserImage = (name?: string) => {
      if (!name) return IMAGES.currentUser;
      const member = membersData?.find((m: any) => m.name === name);
      if (member?.profileImage) return member.profileImage;

      if (name?.includes('Shivam')) return IMAGES.testimonials.user1;
      if (name?.includes('Abhishek')) return IMAGES.testimonials.user2;
      if (name?.includes('Swapnil')) return IMAGES.testimonials.user3;
      if (name?.includes('Pavan')) return IMAGES.testimonials.user4;
      return IMAGES.currentUser;
  };

  const confirmDeleteAttachment = () => {
      if (attachmentToDelete && onDeleteAttachment) {
          onDeleteAttachment(attachmentToDelete);
          setAttachmentToDelete(null);
      }
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
        ></div>

        <div className="relative bg-mine-shaft-950 border border-mine-shaft-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Left Panel */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-mine-shaft-950">
                <div className="flex justify-between items-start mb-6">
                        <div>
                        <span className="bg-mine-shaft-800 text-bright-sun-400 text-xs px-2 py-1 rounded font-medium border border-mine-shaft-700 mb-2 inline-block">
                            {task.status}
                        </span>
                        <h2 className="text-2xl font-bold text-mine-shaft-50 leading-tight">{task.title}</h2>
                        </div>
                        <div className="flex gap-2">
                        {isManager && onEdit && (
                            <button 
                                onClick={() => onEdit(task.status, task)}
                                className="p-2 text-mine-shaft-400 hover:text-bright-sun-400 hover:bg-mine-shaft-900 rounded-lg transition-colors" 
                                title="Edit Task"
                            >
                                <Pencil size={18} />
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="p-2 text-mine-shaft-400 hover:text-red-400 hover:bg-mine-shaft-900 rounded-lg transition-colors md:hidden"
                        >
                            <X size={20} />
                        </button>
                        </div>
                </div>

                <div className="prose prose-invert max-w-none mb-8">
                    <h3 className="text-sm uppercase tracking-wider text-mine-shaft-400 font-bold mb-2">Description</h3>
                    <p className="text-mine-shaft-100 text-sm leading-relaxed">
                        {task.description || "No description provided."}
                    </p>
                </div>

                {/* Attachments */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm uppercase tracking-wider text-mine-shaft-400 font-bold flex items-center gap-2">
                            <Paperclip size={16} /> Attachments
                        </h3>
                        <button onClick={handleAddAttachmentClick} className="text-xs text-bright-sun-400 hover:underline">
                            + Add File
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={onFileChange}
                        />
                    </div>
                    
                    {task.attachments && task.attachments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {task.attachments.map((file) => (
                                <div key={file.id} className="group relative">
                                <a href={file.url.startsWith('http') ? file.url : `http://localhost:8080${file.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl hover:border-mine-shaft-600 cursor-pointer group">
                                    <div className="w-10 h-10 rounded-lg bg-mine-shaft-800 flex items-center justify-center shrink-0">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-mine-shaft-50 truncate group-hover:text-bright-sun-400 transition-colors">{file.name}</p>
                                        <p className="text-xs text-mine-shaft-400">{file.size}</p>
                                    </div>
                                </a>
                                {file.uploadedBy === currentUser && (
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (onDeleteAttachment) setAttachmentToDelete(file.id);
                                        }}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                        title="Delete File"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-mine-shaft-500 italic">No attachments yet.</div>
                    )}
                </div>

                {/* Comments */}
                <div>
                    <h3 className="text-sm uppercase tracking-wider text-mine-shaft-400 font-bold mb-4">Activity & Comments</h3>
                    
                    <div className="space-y-6 mb-6">
                        {task.comments && task.comments.length > 0 ? (
                            task.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4">
                                    <img src={comment.avatar} alt={comment.user} className="w-8 h-8 rounded-full object-cover shrink-0 border border-mine-shaft-700"/>
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-sm font-bold text-mine-shaft-50">{comment.user}</span>
                                            <span className="text-xs text-mine-shaft-500">{comment.time}</span>
                                        </div>
                                        <p className="text-sm text-mine-shaft-200 bg-mine-shaft-900 p-3 rounded-r-xl rounded-bl-xl inline-block border border-mine-shaft-800">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-mine-shaft-500 italic">No comments yet.</div>
                        )}
                    </div>

                    <div className="flex gap-3 items-start">
                        <img src={IMAGES.currentUser} className="w-8 h-8 rounded-full border border-mine-shaft-700" alt="You"/>
                        <div className="flex-1">
                            <div className="relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => onCommentChange(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows={2}
                                    className="w-full bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl p-3 text-sm text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 resize-none pr-20"
                                />
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                    <button className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded-lg hover:bg-mine-shaft-800 transition-colors">
                                        <Smile size={16} />
                                    </button>
                                    <button className="p-1.5 text-mine-shaft-400 hover:text-bright-sun-400 rounded-lg hover:bg-mine-shaft-800 transition-colors">
                                        <AtSign size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Button size="sm" onClick={onAddComment} disabled={!newComment.trim()}>
                                    Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full md:w-80 bg-mine-shaft-900 border-l border-mine-shaft-800 p-6 flex flex-col gap-6 overflow-y-auto">
                <div className="hidden md:flex justify-end">
                    <button onClick={onClose} className="text-mine-shaft-400 hover:text-mine-shaft-50 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div>
                    <label className="text-xs uppercase tracking-wider text-mine-shaft-500 font-bold mb-2 block">Assigned To</label>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-mine-shaft-800 transition-colors cursor-pointer border border-transparent hover:border-mine-shaft-700">
                        <img src={getUserImage(task.assignedTo)} className="w-8 h-8 rounded-full object-cover" alt="User"/>
                        <span className="text-sm font-medium text-mine-shaft-50">{task.assignedTo || "Unassigned"}</span>
                    </div>
                </div>

                <div>
                    <label className="text-xs uppercase tracking-wider text-mine-shaft-500 font-bold mb-2 block">Due Date</label>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-mine-shaft-800 transition-colors cursor-pointer border border-transparent hover:border-mine-shaft-700">
                        <div className="w-8 h-8 rounded-lg bg-mine-shaft-800 flex items-center justify-center text-bright-sun-400">
                            <Calendar size={16} />
                        </div>
                        <span className="text-sm font-medium text-mine-shaft-50">{task.date}</span>
                    </div>
                </div>

                <div>
                    <label className="text-xs uppercase tracking-wider text-mine-shaft-500 font-bold mb-2 block">Amount</label>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-mine-shaft-800 transition-colors cursor-pointer border border-transparent hover:border-mine-shaft-700">
                        <div className="w-8 h-8 rounded-lg bg-mine-shaft-800 flex items-center justify-center text-bright-sun-400">
                            <IndianRupee size={16} />
                        </div>
                        <span className="text-sm font-bold text-mine-shaft-50">₹{task.amount}</span>
                    </div>
                </div>

                {isManager && onDelete && (
                    <div className="mt-auto pt-6 border-t border-mine-shaft-800">
                        <button 
                            onClick={() => onDelete(task.id)}
                            className="w-full py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-red-500/20"
                        >
                            <Trash2 size={16} /> Delete Task
                        </button>
                    </div>
                )}
            </div>

        </div>
    </div>

    {attachmentToDelete && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAttachmentToDelete(null)}></div>
            <div className="relative bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
                 <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20"><AlertTriangle size={24} /></div>
                    <div>
                        <h3 className="text-xl font-bold text-mine-shaft-50">Delete attachment?</h3>
                        <p className="text-sm text-mine-shaft-400 mt-2">Are you sure you want to delete this attachment?</p>
                    </div>
                    <div className="flex gap-3 w-full mt-4">
                        <Button variant="secondary" className="flex-1" onClick={() => setAttachmentToDelete(null)}>Cancel</Button>
                        <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={confirmDeleteAttachment}>Delete</Button>
                    </div>
                 </div>
            </div>
         </div>
    )}
    </>
  );
};

export default TaskDetailModal;