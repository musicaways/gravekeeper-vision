
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { WorkOrderFilters } from "./WorkOrderFilters";
import { WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { Badge } from "@/components/ui/badge";

interface WorkOrderFilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
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

export function WorkOrderFilterPanel({
  isOpen,
  onToggle,
  typeFilter,
  statusFilter,
  priorityFilter,
  orderTypes,
  orderStatuses,
  orderPriorities,
  toggleTypeFilter,
  toggleStatusFilter,
  togglePriorityFilter,
  clearFilters,
}: WorkOrderFilterPanelProps) {
  // Calculate total active filters
  const totalActiveFilters = typeFilter.length + statusFilter.length + priorityFilter.length;
  
  return (
    <div className="mb-6">
      <Button
        variant="outline"
        size="sm"
        className="mb-2 relative"
        onClick={onToggle}
      >
        <Filter className="mr-2 h-4 w-4" />
        {isOpen ? "Hide Filters" : "Show Filters"}
        {totalActiveFilters > 0 && (
          <Badge className="ml-2 bg-primary text-primary-foreground" variant="secondary">
            {totalActiveFilters}
          </Badge>
        )}
      </Button>
      
      {isOpen && (
        <Card className="animate-in fade-in-50 slide-in-from-top-2 duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Filter Work Orders</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters} 
                className="h-8 px-2"
                disabled={totalActiveFilters === 0}
              >
                <X className="h-4 w-4 mr-1" /> Clear all
              </Button>
            </div>
            {totalActiveFilters > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {totalActiveFilters} active filter{totalActiveFilters !== 1 ? 's' : ''}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <WorkOrderFilters
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              orderTypes={orderTypes}
              orderStatuses={orderStatuses}
              orderPriorities={orderPriorities}
              toggleTypeFilter={toggleTypeFilter}
              toggleStatusFilter={toggleStatusFilter}
              togglePriorityFilter={togglePriorityFilter}
              clearFilters={clearFilters}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
