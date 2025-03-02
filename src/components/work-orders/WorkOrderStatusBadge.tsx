
import React from "react";
import { WorkOrderStatus } from "@/types";
import { getWorkOrderStatusBadgeClass, formatStatus } from "@/lib/work-order-utils";

interface WorkOrderStatusBadgeProps {
  status: WorkOrderStatus;
}

export function WorkOrderStatusBadge({ status }: WorkOrderStatusBadgeProps) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkOrderStatusBadgeClass(status)}`}>
      {formatStatus(status)}
    </span>
  );
}
