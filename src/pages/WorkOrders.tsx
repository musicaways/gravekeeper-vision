
import { useState } from "react";
import { useWorkOrders } from "@/hooks/use-work-orders";
import { WorkOrdersToolbar } from "@/components/work-orders/WorkOrdersToolbar";
import { WorkOrderViewTabs } from "@/components/work-orders/WorkOrderViewTabs";

export default function WorkOrders() {
  const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    filteredWorkOrders,
    isLoading,
    searchQuery,
    setSearchQuery,
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
    pendingOrders,
    inProgressOrders,
    completedOrders,
    cancelledOrders
  } = useWorkOrders();
  
  return (
    <div className="container mx-auto p-4">
      <WorkOrdersToolbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <WorkOrderViewTabs 
        view={view}
        setView={setView}
        pendingOrders={pendingOrders}
        inProgressOrders={inProgressOrders}
        completedOrders={completedOrders}
        cancelledOrders={cancelledOrders}
        filteredWorkOrders={filteredWorkOrders}
        isLoading={isLoading}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
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
  );
}
