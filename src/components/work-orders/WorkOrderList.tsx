
import React from "react";
import { WorkOrder } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatOrderType, formatStatus } from "@/lib/work-order-utils";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";
import { WorkOrderPriorityBadge } from "./WorkOrderPriorityBadge";

interface WorkOrderListProps {
  workOrders: WorkOrder[];
  isLoading: boolean;
}

export function WorkOrderList({ workOrders, isLoading }: WorkOrderListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-7 p-4 font-medium border-b">
        <div className="col-span-2">Description</div>
        <div>Order #</div>
        <div>Type</div>
        <div>Status</div>
        <div>Priority</div>
        <div className="text-right">Actions</div>
      </div>
      
      {workOrders.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No work orders found matching your search criteria.
        </div>
      ) : (
        workOrders.map(order => (
          <div key={order.id} className="grid grid-cols-7 p-4 border-b hover:bg-gray-50">
            <div className="col-span-2">{order.description}</div>
            <div>{order.order_number}</div>
            <div>{formatOrderType(order.order_type)}</div>
            <div>
              <WorkOrderStatusBadge status={order.status} />
            </div>
            <div>
              <WorkOrderPriorityBadge priority={order.priority} />
            </div>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Change Status</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
