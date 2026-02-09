import React, { useMemo } from 'react';
import { Task } from '../../../../Data/types';
import { ChevronDown, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import ProjectService from '../../projects/service/project.service';

interface WorkerPaymentTabProps {
  tasks: Task[];
  onRefresh?: () => void;
  membersData?: any[];
}

const WorkerPaymentTab: React.FC<WorkerPaymentTabProps> = ({ tasks, onRefresh }) => {
  // Calculate stats based on paymentStatus
  const stats = useMemo(() => {
    let totalReceived = 0;
    let pendingAmount = 0;

    tasks.forEach(task => {
        const amount = parseInt(task.amount.replace(/[^0-9]/g, '')) || 0;
        if (task.paymentStatus === 'Done' || task.paymentStatus === 'Received') {
            totalReceived += amount;
        } else {
            pendingAmount += amount;
        }
    });

    return { totalReceived, pendingAmount };
  }, [tasks]);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
      if (newStatus === 'Received') {
          try {
              await ProjectService.markPaymentReceived(taskId);
              // alert("Payment Receipt Confirmed!");
              if (onRefresh) onRefresh();
          } catch (e: any) {
              alert("Error: " + e.message);
          }
      }
  };

  const getStatusColorClass = (status?: string) => {
      switch (status) {
          case 'Received':
          case 'Done':
            return 'bg-green-500/10 text-green-500 border-green-500/20';
          case 'Paid':
            return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-black">
          <p className="text-xs font-bold opacity-70 mb-1 uppercase tracking-wider">Total Received</p>
          <h3 className="text-3xl font-bold">₹{stats.totalReceived.toLocaleString()}</h3>
        </div>
        <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-6">
          <p className="text-xs font-bold text-mine-shaft-400 mb-1 uppercase tracking-wider">Pending Amount</p>
          <h3 className="text-3xl font-bold text-mine-shaft-50">₹{stats.pendingAmount.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-mine-shaft-800">
          <h3 className="text-lg font-bold text-mine-shaft-50">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-mine-shaft-300">
            <thead className="bg-mine-shaft-800/50 text-mine-shaft-100 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Task Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                <th className="px-6 py-4 font-bold tracking-wider">Transaction Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mine-shaft-800">
              {tasks.map((task) => {
                  const isReceived = task.paymentStatus === 'Done' || task.paymentStatus === 'Received';
                  const isPaid = task.paymentStatus === 'Paid';
                  
                  return (
                    <tr key={task.id} className="hover:bg-mine-shaft-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white max-w-xs truncate" title={task.title}>{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.date}</td>
                      <td className="px-6 py-4 font-bold text-mine-shaft-50">₹{task.amount}</td>
                      <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${getStatusColorClass(task.paymentStatus)}`}>
                              {isReceived ? (
                                  <><ShieldCheck size={14} /> Received</>
                              ) : isPaid ? (
                                  <><CheckCircle2 size={14} /> Paid by Manager</>
                              ) : (
                                  <><Clock size={14} /> Pending Approval/Payment</>
                              )}
                          </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block w-40">
                           <select
                              value={isReceived ? 'Received' : (isPaid ? 'ActionRequired' : 'Pending')}
                              onChange={(e) => handleStatusChange(task.id, e.target.value)}
                              disabled={isReceived || !isPaid}
                              className={`w-full px-3 py-2 rounded-lg text-xs font-bold border outline-none appearance-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-mine-shaft-950 focus:ring-bright-sun-400 cursor-pointer ${isReceived || !isPaid ? 'opacity-50 cursor-not-allowed' : ''} ${isReceived ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-mine-shaft-800 text-mine-shaft-300 border-mine-shaft-700'}`}
                           >
                              {!isPaid && !isReceived && <option value="Pending">Waiting...</option>}
                              {isPaid && !isReceived && <option value="ActionRequired">Confirm Receipt?</option>}
                              <option value="Received" disabled={!isPaid}>Received</option>
                           </select>
                           {!isReceived && isPaid && <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />}
                        </div>
                      </td>
                    </tr>
                  );
              })}
              {tasks.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-mine-shaft-500 italic">No payment records found</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerPaymentTab;