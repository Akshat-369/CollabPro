import React, { useMemo } from 'react';
import { Task } from '../../../../Data/types';
import { IMAGES } from '../../../../Data/images';
import { CheckCircle2, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { Button } from '../../../../shared/ui/Button';
import ProjectService from '../../projects/service/project.service';

interface PaymentTabProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: string) => void;
  onRefresh?: () => void;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ tasks, onStatusChange, onRefresh }) => {
  // Calculate stats based on paymentStatus
  const stats = useMemo(() => {
    let totalPaid = 0;
    let pendingAmount = 0;

    tasks.forEach(task => {
        const amount = parseInt(task.amount.replace(/[^0-9]/g, '')) || 0;
        if (task.paymentStatus === 'Paid' || task.paymentStatus === 'Received' || task.paymentStatus === 'Done') {
            totalPaid += amount;
        } else {
            pendingAmount += amount;
        }
    });

    return { totalPaid, pendingAmount };
  }, [tasks]);

  const handleRazorpayPayment = async (task: Task) => {
      try {
          const orderData = await ProjectService.createPaymentOrder(task.id);
          
          const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID,
              amount: orderData.amount,
              currency: orderData.currency,
              name: "CollabPro",
              description: `Payment for task: ${task.title}`,
              order_id: orderData.orderId,
              
              method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true
              },

              upi: {
                flow: "qr"
              },

              handler: async (response: any) => {
                  try {
                      await ProjectService.verifyPayment({
                          razorpay_order_id: response.razorpay_order_id,
                          razorpay_payment_id: response.razorpay_payment_id,
                          razorpay_signature: response.razorpay_signature
                      });
                      // alert("Payment Successful!");
                      if (onRefresh) onRefresh();
                  } catch (e: any) {
                      alert("Verification failed: " + e.message);
                  }
              },
              prefill: {
                  name: "Project Manager",
                  email: "manager@collabpro.com",
              },
              theme: {
                  color: "#ffbd20",
              },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
      } catch (e: any) {
          alert("Error: " + e.message);
      }
  };

  const getUserImage = (name?: string) => {
      if (name?.includes('Shivam')) return IMAGES.testimonials.user1;
      if (name?.includes('Abhishek')) return IMAGES.testimonials.user2;
      if (name?.includes('Swapnil')) return IMAGES.testimonials.user3;
      if (name?.includes('Pavan')) return IMAGES.testimonials.user4;
      return IMAGES.currentUser;
  };

  const getStatusColorClass = (status: string) => {
      switch (status) {
          case 'Approved': return 'bg-green-500/10 text-green-500 border-green-500/20';
          default: return 'bg-mine-shaft-800 text-mine-shaft-300 border-mine-shaft-700';
      }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-bright-sun-400 to-bright-sun-600 rounded-2xl p-6 text-black">
          <p className="text-xs font-bold opacity-70 mb-1 uppercase tracking-wider">Total Paid</p>
          <h3 className="text-3xl font-bold">₹{stats.totalPaid.toLocaleString()}</h3>
        </div>
        <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl p-6">
          <p className="text-xs font-bold text-mine-shaft-400 mb-1 uppercase tracking-wider">Pending Amount</p>
          <h3 className="text-3xl font-bold text-mine-shaft-50">₹{stats.pendingAmount.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-mine-shaft-900 border border-mine-shaft-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-mine-shaft-800">
          <h3 className="text-lg font-bold text-mine-shaft-50">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-mine-shaft-300">
            <thead className="bg-mine-shaft-800/50 text-mine-shaft-100 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Task Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold tracking-wider">Assignee</th>
                <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mine-shaft-800">
              {tasks.map((task) => {
                  const isApproved = task.status === 'Approved';
                  const isPaid = task.paymentStatus === 'Paid';
                  const isReceived = task.paymentStatus === 'Received' || task.paymentStatus === 'Done';
                  
                  return (
                    <tr key={task.id} className="hover:bg-mine-shaft-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white max-w-xs truncate" title={task.title}>{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.date}</td>
                      <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                                <img src={getUserImage(task.assignedTo)} alt={task.assignedTo} className="w-6 h-6 rounded-full object-cover border border-mine-shaft-700"/>
                                <span className="truncate max-w-[120px]" title={task.assignedTo}>{task.assignedTo || 'Unassigned'}</span>
                          </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-mine-shaft-50">₹{task.amount}</td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block w-32">
                           <select
                               value={isApproved ? task.status : ''}
                               onChange={(e) => onStatusChange(task.id, e.target.value)}
                               disabled={isPaid || isReceived}
                               className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold border outline-none appearance-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-mine-shaft-950 focus:ring-bright-sun-400 ${(isPaid || isReceived) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} ${getStatusColorClass(task.status)}`}
                           >
                               {!isApproved && <option value="" disabled className="bg-mine-shaft-900 text-mine-shaft-400">{task.status}</option>}
                               <option value="Approved" className="bg-mine-shaft-900 text-green-500">Approved</option>
                           </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                          {isReceived ? (
                            <div className="flex items-center gap-1.5 text-green-400 font-bold text-xs bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20 w-fit">
                                <ShieldCheck size={14} /> Completed
                            </div>
                          ) : isPaid ? (
                            <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs bg-blue-400/10 px-2.5 py-1 rounded-full border border-blue-400/20 w-fit">
                                <CheckCircle2 size={14} /> Paid
                            </div>
                          ) : task.status === 'Approved' ? (
                            <Button 
                                size="sm" 
                                onClick={() => handleRazorpayPayment(task)}
                                className="h-7 px-3 text-xs bg-bright-sun-400 hover:bg-bright-sun-500 text-black font-bold gap-1.5"
                            >
                                <CreditCard size={12} /> Pay Now
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-mine-shaft-400 font-medium text-xs bg-mine-shaft-800 px-2.5 py-1 rounded-full border border-mine-shaft-700 w-fit">
                                <Clock size={14} /> Pending
                            </div>
                          )}
                      </td>
                    </tr>
                  );
              })}
              {tasks.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-mine-shaft-500 italic">No transactions found</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentTab;