import React, { useState, useMemo } from 'react';
import { Task, Comment, Attachment } from '../../../../Data/types';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import { IMAGES } from '../../../../Data/images';
import { ListTodo } from 'lucide-react';
import ProjectService from '../../projects/service/project.service';

interface MyTasksTabProps {
  tasks: Task[];
  currentUser: string;
  currentUserEmail?: string;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  activeProjectId?: string;
}

const MyTasksTab: React.FC<MyTasksTabProps> = ({ tasks, currentUser, currentUserEmail, onUpdateTask, activeProjectId }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');

  // Filter tasks assigned to the current user
  const myTasks = useMemo(() => {
    return tasks.filter(task => 
        task.assignedTo?.toLowerCase().includes(currentUser.toLowerCase()) &&
        task.paymentStatus !== 'Received' && task.paymentStatus !== 'Done'
    );
  }, [tasks, currentUser]);

  // Handlers for the Detail Modal
  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        user: 'You',
        avatar: IMAGES.currentUser,
        text: newComment,
        time: 'Just now'
    };
    
    const updatedComments = [...(selectedTask.comments || []), comment];
    onUpdateTask(selectedTask.id, { comments: updatedComments });
    setSelectedTask({ ...selectedTask, comments: updatedComments });
    setNewComment('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTask) return;

    try {
        let att: Attachment;
        
        if (activeProjectId) {
            // Upload to server
            const uploaded = await ProjectService.uploadTaskAttachment(activeProjectId, selectedTask.id, file);
            att = {
                id: uploaded.id || Date.now().toString(),
                name: uploaded.name,
                size: uploaded.size,
                type: uploaded.type,
                url: uploaded.url, // Store relative URL
                uploadedBy: uploaded.uploadedBy
            };
        } else {
             // Fallback if no projectId (should not happen in real flow)
             console.warn("No activeProjectId, using local blob");
             const url = URL.createObjectURL(file);
             att = {
                id: Date.now().toString(),
                name: file.name,
                size: `${(file.size/1024).toFixed(0)} KB`,
                type: file.type.includes('image') ? 'image' : 'file',
                url
            };
        }

        const updatedAttachments = [...(selectedTask.attachments || []), att];
        onUpdateTask(selectedTask.id, { attachments: updatedAttachments });
        setSelectedTask({ ...selectedTask, attachments: updatedAttachments });
    } catch (err) {
        console.error("Failed to upload file", err);
        alert("Failed to upload file");
    }
    
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
        {myTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myTasks.map(task => (
                    <TaskCard 
                        key={task.id}
                        task={task}
                        isDragged={false} // No drag in this view
                        onDragStart={() => {}} 
                        onClick={setSelectedTask}
                    />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-mine-shaft-400 border border-dashed border-mine-shaft-800 rounded-2xl bg-mine-shaft-900/30">
                <div className="w-16 h-16 bg-mine-shaft-800 rounded-full flex items-center justify-center mb-4">
                    <ListTodo size={32} className="opacity-50" />
                </div>
                <p>No tasks assigned to you yet.</p>
            </div>
        )}

        {selectedTask && (
            <TaskDetailModal 
                task={selectedTask}
                newComment={newComment}
                isManager={false}
                onClose={() => setSelectedTask(null)}
                onCommentChange={setNewComment}
                onAddComment={handleAddComment}
                onFileChange={handleFileChange}
                // My Tasks view usually doesn't allow editing task details/deleting directly from the board view
                // but if needed, we can pass those handlers. 
                // Currently just enabling comments/files.
                currentUser={currentUserEmail}
                onDeleteAttachment={async (attachmentId) => {
                    if (!activeProjectId || !selectedTask) return;
                    try {
                        await ProjectService.deleteTaskAttachment(activeProjectId, selectedTask.id, attachmentId);
                        const updatedAttachments = selectedTask.attachments?.filter(a => a.id !== attachmentId) || [];
                        onUpdateTask(selectedTask.id, { attachments: updatedAttachments });
                        setSelectedTask({ ...selectedTask, attachments: updatedAttachments });
                    } catch (e) {
                         console.error("Failed to delete attachment", e);
                         alert("Failed to delete attachment");
                    }
                }}
            />
        )}
    </div>
  );
};

export default MyTasksTab;