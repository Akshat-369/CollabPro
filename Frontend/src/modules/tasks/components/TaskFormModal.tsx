import React from 'react';
import { X, IndianRupee, Trash2 } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import { Task } from '../../../../Data/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  formTask: Partial<Task>;
  members: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSave: (e: React.FormEvent) => void;
  onDeleteRequest?: (taskId: string) => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ 
  isOpen, onClose, isEditing, formTask, members, onChange, onSave, onDeleteRequest 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
        ></div>

        <div className="relative bg-mine-shaft-900 border border-mine-shaft-700 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-mine-shaft-800 shrink-0">
                <h2 className="text-xl font-bold text-mine-shaft-50">{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
                <button 
                    onClick={onClose}
                    className="text-mine-shaft-400 hover:text-mine-shaft-50 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <form id="task-form" onSubmit={onSave} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-mine-shaft-300">Task Title <span className="text-red-500">*</span></label>
                        <input 
                            type="text"
                            name="title"
                            value={formTask.title}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-mine-shaft-950 border border-mine-shaft-700 rounded-xl text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-colors"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-mine-shaft-300">Description</label>
                        <textarea 
                            name="description"
                            value={formTask.description}
                            onChange={onChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-mine-shaft-950 border border-mine-shaft-700 rounded-xl text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-mine-shaft-300">Amount (₹) <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-mine-shaft-400" />
                                <input 
                                    type="number"
                                    name="amount"
                                    value={formTask.amount}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-3 bg-mine-shaft-950 border border-mine-shaft-700 rounded-xl text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-colors"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-mine-shaft-300">Due Date <span className="text-red-500">*</span></label>
                            <input 
                                type="date"
                                name="date"
                                value={formTask.date}
                                onChange={onChange}
                                className="w-full px-4 py-3 bg-mine-shaft-950 border border-mine-shaft-700 rounded-xl text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-colors [color-scheme:dark]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-mine-shaft-300">Assign To</label>
                        <select 
                            name="assignedTo"
                            value={formTask.assignedTo}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-mine-shaft-950 border border-mine-shaft-700 rounded-xl text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-colors appearance-none"
                        >
                            <option value="">Select Member</option>
                            {members.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-mine-shaft-300">Status</label>
                        <select 
                            name="status"
                            value={formTask.status}
                            onChange={onChange}
                            className="w-full px-4 py-3 bg-mine-shaft-950 border border-mine-shaft-700 rounded-xl text-mine-shaft-50 focus:outline-none focus:border-bright-sun-400 transition-colors appearance-none"
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>
                </form>
            </div>

            <div className="p-6 border-t border-mine-shaft-800 flex gap-3 shrink-0 bg-mine-shaft-900 rounded-b-2xl">
                {isEditing && onDeleteRequest && formTask.id && (
                    <button
                        type="button"
                        onClick={() => onDeleteRequest(formTask.id!)}
                        className="p-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
                <Button 
                    type="button" 
                    variant="secondary" 
                    className="flex-1"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    form="task-form"
                    className="flex-1 font-bold"
                >
                    {isEditing ? 'Save Changes' : 'Create Task'}
                </Button>
            </div>
        </div>
    </div>
  );
};

export default TaskFormModal;