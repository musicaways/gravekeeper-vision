
import React from "react";
import { Badge } from "@/components/ui/badge";
import { WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { formatStatus } from "@/lib/work-order-utils";

interface WorkOrderFiltersProps {
  typeFilter: WorkOrderType[];
  statusFilter: WorkOrderStatus[];
  priorityFilter: WorkOrderPriority[];
  orderTypes: WorkOrderType[];
  orderStatuses: WorkOrderStatus[];
  orderPriorities: WorkOrderPriority[];
  toggleTypeFilter: (type: WorkOrderType) => void;
  toggleStatusFilter: (status: WorkOrderStatus) => void;
  togglePriorityFilter: (priority: WorkOrderPriority) => void;
  clearFilters: () => void;
}

export function WorkOrderFilters({
  typeFilter,
  statusFilter,
  priorityFilter,
  orderTypes,
  orderStatuses,
  orderPriorities,
  toggleTypeFilter,
  toggleStatusFilter,
  togglePriorityFilter,
}: WorkOrderFiltersProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Filter by Type:</h3>
        <div className="flex flex-wrap gap-2">
          {orderTypes.map((type) => (
            <Badge
              key={type}
              variant={typeFilter.includes(type) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTypeFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Filter by Status:</h3>
        <div className="flex flex-wrap gap-2">
          {orderStatuses.map((status) => (
            <Badge
              key={status}
              variant={statusFilter.includes(status) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleStatusFilter(status)}
            >
              {formatStatus(status)}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Filter by Priority:</h3>
        <div className="flex flex-wrap gap-2">
          {orderPriorities.map((priority) => (
            <Badge
              key={priority}
              variant={priorityFilter.includes(priority) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => togglePriorityFilter(priority)}
            >
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
