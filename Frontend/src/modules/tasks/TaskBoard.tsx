import React, { useState, useMemo } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Task, Attachment, Comment } from '../../../Data/types';
import TaskCard from './components/TaskCard';
import TaskFormModal from './components/TaskFormModal';
import TaskDetailModal from './components/TaskDetailModal';
import { Button } from '../../../shared/ui/Button';
import { IMAGES } from '../../../Data/images';
import { useUser } from '../../../context/UserContext';
import ProjectService from '../projects/service/project.service';

interface TaskBoardProps {
  initialTasks: Task[]; // Note: We use this as the source of truth passed from parent
  jobId?: string;
  onAddTask: (task: Task) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  isManager?: boolean;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ initialTasks, jobId, onAddTask, onUpdateTask, onDeleteTask, isManager }) => {
  const { userProfile } = useUser();
  const { getJobApplications } = useUser();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  
  // Form State
  const [formTask, setFormTask] = useState<Partial<Task>>({
    title: '', description: '', amount: '', date: '', status: 'To Do', assignedTo: ''
  });
  
  // Detail State
  const [newComment, setNewComment] = useState('');

  // Dynamic members list (Hired members from backend)
  const [members, setMembers] = useState<string[]>([]);
  
  React.useEffect(() => {
     if (!jobId) return;
     const fetchMembers = async () => {
         try {
             const candidates = await ProjectService.getProjectCandidates(jobId);
             const hired = candidates.filter((c: any) => c.status === 'hired').map((c: any) => c.name);
             
             // Optionally add self (manager) if needed, but 'getProjectCandidates' doesn't return manager.
             // We can assume the manager is 'You' or fetched from user profile? 
             // Ideally we should fetch Project details to get the creator name.
             // For now, let's stick to hired members as "Assignable".
             // If manager needs to assign to themselves, they should be in the "Members" or we can append explicitly if we knew their name.
             // Let's invoke `getJob` from context or passed props if available?
             // TaskBoard doesn't receive `job` object, only `jobId`.
             // But we can use `ProjectService.getProject(jobId)` to get owner name.
             
             try {
                const project: any = await ProjectService.getProject(jobId);
                const ownerName = project.client?.name;
                if (ownerName && !hired.includes(ownerName)) {
                    hired.push(ownerName);
                }
             } catch (err) {
                 // ignore if fails to get project details
             }
             
             setMembers(hired);
         } catch (e) {
             console.error("Failed to load project members", e);
         }
     };
     fetchMembers();
  }, [jobId]);

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = (e: React.DragEvent, status: string) => {
     e.preventDefault();
     if (!draggedTaskId) return;

     // RULE: Only managers or assigned users can update status
     if (!isManager) {
         const task = initialTasks.find(t => t.id === draggedTaskId);
         if (task?.assignedTo !== userProfile.name) {
             setDraggedTaskId(null);
             return;
         }
     }

     onUpdateTask(draggedTaskId, { status });
     setDraggedTaskId(null);
  };

  // Form Logic
  const openFormModal = (defaultStatus: string = 'To Do', taskToEdit?: Task) => {
    if (taskToEdit) {
        setEditingTaskId(taskToEdit.id);
        setFormTask({ ...taskToEdit });
    } else {
        setEditingTaskId(null);
        setFormTask({
            title: '', description: '', amount: '', 
            date: new Date().toISOString().split('T')[0],
            status: defaultStatus, assignedTo: ''
        });
    }
    setIsFormModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTask.title || !formTask.amount || !formTask.date) return;

    if (editingTaskId) {
        onUpdateTask(editingTaskId, formTask);
        // Update selected task view if it's the one being edited
        if (selectedTask?.id === editingTaskId) {
            setSelectedTask(prev => prev ? ({ ...prev, ...formTask } as Task) : null);
        }
    } else {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title: formTask.title!,
            description: formTask.description || '',
            amount: formTask.amount!,
            status: formTask.status || 'To Do',
            date: formTask.date!,
            assignedTo: formTask.assignedTo,
            comments: [],
            attachments: [],
            paymentStatus: 'Pending'
        };
        onAddTask(newTask);
    }
    setIsFormModalOpen(false);
    setEditingTaskId(null);
  };

  // Delete Logic
  const requestDelete = (taskId: string) => {
    setTaskToDeleteId(taskId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDeleteId) {
        onDeleteTask(taskToDeleteId);
        if (selectedTask?.id === taskToDeleteId) setSelectedTask(null);
        if (editingTaskId === taskToDeleteId) setIsFormModalOpen(false);
    }
    setIsDeleteConfirmOpen(false);
    setTaskToDeleteId(null);
  };

  // Comments & Files
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
        if (jobId) {
            const uploaded = await ProjectService.uploadTaskAttachment(jobId, selectedTask.id, file);
            att = {
                id: uploaded.id || Date.now().toString(),
                name: uploaded.name,
                size: uploaded.size,
                type: uploaded.type,
                url: uploaded.url
            };
        } else {
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

  const handleDeleteAttachment = async (attachmentId: string) => {
      if (!selectedTask || !jobId) return;
      try {
          await ProjectService.deleteTaskAttachment(jobId, selectedTask.id, attachmentId);
          // Update UI state
          const updatedAttachments = selectedTask.attachments?.filter(a => a.id !== attachmentId) || [];
          // Update task in parent state
          onUpdateTask(selectedTask.id, { attachments: updatedAttachments });
          // Update local modal state
          setSelectedTask({ ...selectedTask, attachments: updatedAttachments });
      } catch (e) {
          console.error("Failed to delete attachment", e);
          alert("Failed to delete attachment");
      }
  };

  return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-[600px]">
        {['To Do', 'In Progress', 'Done', 'Approved'].map((status) => {
            const columnTasks = initialTasks.filter(t => t.status === status && t.paymentStatus !== 'Received' && t.paymentStatus !== 'Done');
            return (
            <div key={status} 
                className={`bg-mine-shaft-900 border rounded-2xl p-4 flex flex-col transition-colors ${
                draggedTaskId ? 'border-dashed border-mine-shaft-700 bg-mine-shaft-900/50' : 'border-mine-shaft-800'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-mine-shaft-50">{status}</h3>
                    <span className="bg-mine-shaft-800 text-xs px-2 py-1 rounded text-mine-shaft-400">{columnTasks.length}</span>
                </div>
                
                <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                {columnTasks.map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        isDragged={draggedTaskId === task.id}
                        onDragStart={handleDragStart}
                        onClick={setSelectedTask}
                    />
                ))}
                {columnTasks.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-mine-shaft-800 rounded-xl flex items-center justify-center text-mine-shaft-500 text-sm">
                        Drop items here
                    </div>
                )}
                </div>
                
                
                {isManager && (
                    <button 
                        onClick={() => openFormModal(status)}
                        className="w-full py-3 mt-4 border border-dashed border-mine-shaft-700 rounded-xl text-mine-shaft-400 text-sm hover:text-bright-sun-400 hover:border-bright-sun-400 transition-colors flex items-center justify-center gap-2"
                    >
                    <Plus size={16} /> Add Task
                    </button>
                )}
            </div>
        )})}
        </div>

        <TaskFormModal 
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            isEditing={!!editingTaskId}
            formTask={formTask}
            members={members}
            onChange={(e) => setFormTask(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            onSave={handleSaveTask}
            onDeleteRequest={requestDelete}
        />

        {selectedTask && !isFormModalOpen && (
            <TaskDetailModal 
                task={selectedTask}
                newComment={newComment}
                isManager={isManager}
                onClose={() => setSelectedTask(null)}
                onEdit={openFormModal}
                onDelete={requestDelete}
                onCommentChange={setNewComment}
                onAddComment={handleAddComment}
                onFileChange={handleFileChange}
                currentUser={userProfile.email}
                onDeleteAttachment={handleDeleteAttachment}
            />
        )}

        {isDeleteConfirmOpen && (
             <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)}></div>
                <div className="relative bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl shadow-2xl w-full max-w-sm p-6">
                     <div className="flex flex-col items-center text-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"><AlertTriangle size={24} /></div>
                        <div>
                            <h3 className="text-xl font-bold text-mine-shaft-50">Delete Task?</h3>
                            <p className="text-sm text-mine-shaft-400 mt-2">Permanently delete this task?</p>
                        </div>
                        <div className="flex gap-3 w-full mt-4">
                            <Button variant="secondary" className="flex-1" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                            <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={confirmDelete}>Delete</Button>
                        </div>
                     </div>
                </div>
             </div>
        )}
    </>
  );
};

export default TaskBoard;