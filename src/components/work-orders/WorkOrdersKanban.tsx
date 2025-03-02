
import React from "react";
import { WorkOrder } from "@/types";
import { WorkOrderCard } from "./WorkOrderCard";

interface WorkOrdersKanbanProps {
  pendingOrders: WorkOrder[];
  inProgressOrders: WorkOrder[];
  completedOrders: WorkOrder[];
  cancelledOrders: WorkOrder[];
  isLoading: boolean;
}

export function WorkOrdersKanban({ 
  pendingOrders, 
  inProgressOrders, 
  completedOrders, 
  cancelledOrders,
  isLoading 
}: WorkOrdersKanbanProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KanbanColumn 
        title="Pending" 
        count={pendingOrders.length} 
        orders={pendingOrders} 
        colorClass="bg-yellow-100"
      />
      <KanbanColumn 
        title="In Progress" 
        count={inProgressOrders.length} 
        orders={inProgressOrders} 
        colorClass="bg-blue-100"
      />
      <KanbanColumn 
        title="Completed" 
        count={completedOrders.length} 
        orders={completedOrders} 
        colorClass="bg-green-100"
      />
      <KanbanColumn 
        title="Cancelled" 
        count={cancelledOrders.length} 
        orders={cancelledOrders} 
        colorClass="bg-red-100"
      />
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  count: number;
  orders: WorkOrder[];
  colorClass: string;
}

function KanbanColumn({ title, count, orders, colorClass }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className={`px-4 py-3 ${colorClass} rounded-t-lg font-medium flex justify-between items-center`}>
        <span>{title}</span>
        <span className="bg-white px-2 py-1 rounded-full text-xs">{count}</span>
      </div>
      
      <div className="bg-gray-50 rounded-b-lg flex-grow min-h-[500px] p-2">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4 text-center">
            No work orders in this status
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map(order => (
              <WorkOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
