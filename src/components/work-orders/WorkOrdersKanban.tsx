
import React from 'react';
import { WorkOrder } from '@/types';
import WorkOrderCard from './WorkOrderCard';

interface WorkOrdersKanbanProps {
  workOrders: WorkOrder[];
  onWorkOrderClick: (workOrder: WorkOrder) => void;
}

const WorkOrdersKanban: React.FC<WorkOrdersKanbanProps> = ({ 
  workOrders, 
  onWorkOrderClick 
}) => {
  // Group work orders by status
  const pendingOrders = workOrders.filter(wo => wo.status === 'pending');
  const inProgressOrders = workOrders.filter(wo => wo.status === 'in_progress');
  const completedOrders = workOrders.filter(wo => wo.status === 'completed');
  const cancelledOrders = workOrders.filter(wo => wo.status === 'cancelled');
  
  const renderColumn = (
    title: string, 
    orders: WorkOrder[], 
    bgColor: string,
    icon: React.ReactNode
  ) => (
    <div className="flex flex-col h-full">
      <div className={`p-3 ${bgColor} rounded-t-md flex items-center gap-2`}>
        {icon}
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className="ml-auto bg-white bg-opacity-30 rounded-full h-5 min-w-5 px-1 flex items-center justify-center text-xs">
          {orders.length}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-2 space-y-3 bg-gray-50/50 dark:bg-gray-800/20 rounded-b-md">
        {orders.length === 0 ? (
          <div className="h-20 flex items-center justify-center text-sm text-gray-500 italic bg-white/80 dark:bg-gray-800/50 rounded border border-dashed">
            No work orders
          </div>
        ) : (
          orders.map(order => (
            <WorkOrderCard 
              key={order.id}
              workOrder={order} 
              onClick={() => onWorkOrderClick(order)}
            />
          ))
        )}
      </div>
    </div>
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)] animate-fade-in">
      {renderColumn(
        "Pending", 
        pendingOrders, 
        "bg-yellow-500 text-white",
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      )}
      
      {renderColumn(
        "In Progress", 
        inProgressOrders, 
        "bg-blue-500 text-white",
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      )}
      
      {renderColumn(
        "Completed", 
        completedOrders, 
        "bg-green-500 text-white",
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      )}
      
      {renderColumn(
        "Cancelled", 
        cancelledOrders, 
        "bg-red-500 text-white",
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      )}
    </div>
  );
};

export default WorkOrdersKanban;
