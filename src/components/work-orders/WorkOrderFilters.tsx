
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { WorkOrderStatus, WorkOrderType } from "@/types";

interface WorkOrderFiltersProps {
  typeFilter: WorkOrderType[];
  statusFilter: WorkOrderStatus[];
  orderTypes: WorkOrderType[];
  orderStatuses: WorkOrderStatus[];
  toggleTypeFilter: (type: WorkOrderType) => void;
  toggleStatusFilter: (status: WorkOrderStatus) => void;
  clearFilters: () => void;
}

export function WorkOrderFilters({
  typeFilter,
  statusFilter,
  orderTypes,
  orderStatuses,
  toggleTypeFilter,
  toggleStatusFilter,
  clearFilters,
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
              {status.charAt(0).toUpperCase() + status.replace("_", " ").slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {(typeFilter.length > 0 || statusFilter.length > 0) && (
        <div>
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground flex items-center hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" /> Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
