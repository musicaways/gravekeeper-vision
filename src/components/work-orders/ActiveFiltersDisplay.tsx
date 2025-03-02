
import React from "react";
import { WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface ActiveFiltersDisplayProps {
  typeFilter: WorkOrderType[];
  statusFilter: WorkOrderStatus[];
  priorityFilter: WorkOrderPriority[];
  removeTypeFilter: (type: WorkOrderType) => void;
  removeStatusFilter: (status: WorkOrderStatus) => void;
  removePriorityFilter: (priority: WorkOrderPriority) => void;
  clearFilters: () => void;
}

export function ActiveFiltersDisplay({
  typeFilter,
  statusFilter,
  priorityFilter,
  removeTypeFilter,
  removeStatusFilter,
  removePriorityFilter,
  clearFilters,
}: ActiveFiltersDisplayProps) {
  const hasActiveFilters = typeFilter.length > 0 || statusFilter.length > 0 || priorityFilter.length > 0;

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {typeFilter.map(type => (
        <Badge key={`type-${type}`} variant="outline" className="flex items-center gap-1 px-2 py-1">
          Type: {type}
          <button 
            onClick={() => removeTypeFilter(type)}
            className="ml-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {statusFilter.map(status => (
        <Badge key={`status-${status}`} variant="outline" className="flex items-center gap-1 px-2 py-1">
          Status: {status.replace('_', ' ')}
          <button 
            onClick={() => removeStatusFilter(status)}
            className="ml-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {priorityFilter.map(priority => (
        <Badge key={`priority-${priority}`} variant="outline" className="flex items-center gap-1 px-2 py-1">
          Priority: {priority}
          <button 
            onClick={() => removePriorityFilter(priority)}
            className="ml-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      
      {hasActiveFilters && (
        <Badge 
          variant="secondary" 
          className="cursor-pointer" 
          onClick={clearFilters}
        >
          Clear all filters
        </Badge>
      )}
    </div>
  );
}
