
import React from "react";
import { WorkOrder } from "@/types";
import { format } from "date-fns";
import { formatOrderType } from "@/lib/work-order-utils";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";
import { WorkOrderPriorityBadge } from "./WorkOrderPriorityBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface WorkOrderDetailDialogProps {
  workOrder: WorkOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkOrderDetailDialog({
  workOrder,
  open,
  onOpenChange
}: WorkOrderDetailDialogProps) {
  if (!workOrder) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Work Order Details</DialogTitle>
          <DialogDescription>
            {workOrder.order_number}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{formatOrderType(workOrder.order_type)}</h3>
            <WorkOrderStatusBadge status={workOrder.status} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Priority:</span>
              <WorkOrderPriorityBadge priority={workOrder.priority} />
            </div>
            
            {workOrder.requested_date && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Requested:</span>
                <span>{format(new Date(workOrder.requested_date), 'MMMM d, yyyy h:mm a')}</span>
              </div>
            )}
            
            {workOrder.scheduled_date && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Scheduled:</span>
                <span>{format(new Date(workOrder.scheduled_date), 'MMMM d, yyyy h:mm a')}</span>
              </div>
            )}
            
            {workOrder.assigned_crew_id && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Assigned Crew:</span>
                <span>#{workOrder.assigned_crew_id}</span>
              </div>
            )}
            
            {workOrder.related_entity_id && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span>{workOrder.related_entity_type}: {workOrder.related_entity_id}</span>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">Description:</h4>
            <p className="text-sm whitespace-pre-wrap p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              {workOrder.description}
            </p>
          </div>
          
          {workOrder.materials_required && workOrder.materials_required.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Materials Required:</h4>
              <ul className="text-sm list-disc pl-5">
                {workOrder.materials_required.map((material, index) => (
                  <li key={index}>
                    Material #{material.material_id}: {material.quantity} units
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
