
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, List, Calendar } from "lucide-react";
import { WorkOrdersKanban } from "./WorkOrdersKanban";
import { WorkOrderList } from "./WorkOrderList";
import { WorkOrderCalendarView } from "./WorkOrderCalendarView";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { WorkOrdersFilter } from "./WorkOrdersToolbar";
import { WorkOrderFilterPanel } from "./WorkOrderFilterPanel";

interface WorkOrderViewTabsProps {
  view: 'kanban' | 'list' | 'calendar';
  setView: (view: 'kanban' | 'list' | 'calendar') => void;
  pendingOrders: WorkOrder[];
  inProgressOrders: WorkOrder[];
  completedOrders: WorkOrder[];
  cancelledOrders: WorkOrder[];
  filteredWorkOrders: WorkOrder[];
  isLoading: boolean;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
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

export function WorkOrderViewTabs({
  view,
  setView,
  pendingOrders,
  inProgressOrders,
  completedOrders,
  cancelledOrders,
  filteredWorkOrders,
  isLoading,
  showFilters,
  setShowFilters,
  typeFilter,
  statusFilter,
  priorityFilter,
  orderTypes,
  orderStatuses,
  orderPriorities,
  toggleTypeFilter,
  toggleStatusFilter,
  togglePriorityFilter,
  clearFilters
}: WorkOrderViewTabsProps) {
  const toggleFilterPanel = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <Tabs defaultValue="kanban" className="w-full" onValueChange={(value) => setView(value as any)}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center">
            <Kanban className="mr-2 h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center">
            <List className="mr-2 h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <WorkOrdersFilter />
      </div>
      
      {/* Common filter panel for all views */}
      <div className="mb-4">
        <WorkOrderFilterPanel
          isOpen={showFilters}
          onToggle={toggleFilterPanel}
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
      </div>
      
      <TabsContent value="kanban" className="mt-0">
        <WorkOrdersKanban
          pendingOrders={pendingOrders}
          inProgressOrders={inProgressOrders}
          completedOrders={completedOrders}
          cancelledOrders={cancelledOrders}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="list">
        <WorkOrderList 
          workOrders={filteredWorkOrders}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        <WorkOrderCalendarView 
          workOrders={filteredWorkOrders}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
}
