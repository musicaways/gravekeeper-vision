
import React from "react";
import { WorkOrderPriority } from "@/types";
import { getWorkOrderPriorityBadgeClass } from "@/lib/work-order-utils";

interface WorkOrderPriorityBadgeProps {
  priority: WorkOrderPriority;
}

export function WorkOrderPriorityBadge({ priority }: WorkOrderPriorityBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkOrderPriorityBadgeClass(priority)}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
