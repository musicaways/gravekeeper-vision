
import React, { useState, useMemo } from "react";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { format, isSameDay, parseISO, startOfMonth } from "date-fns";
import { WorkOrderDetailDialog } from "./WorkOrderDetailDialog";
import { WorkOrderFilterPanel } from "./WorkOrderFilterPanel";
import { CalendarSection } from "./CalendarSection";
import { OrdersDisplaySection } from "./OrdersDisplaySection";

interface WorkOrderCalendarViewProps {
  workOrders?: WorkOrder[];
  isLoading?: boolean;
}

export function WorkOrderCalendarView({ workOrders = [], isLoading = false }: WorkOrderCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [typeFilter, setTypeFilter] = useState<WorkOrderType[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get all unique work order types
  const orderTypes = useMemo(() => {
    const types = new Set<WorkOrderType>();
    workOrders.forEach(order => types.add(order.order_type));
    return Array.from(types);
  }, [workOrders]);
  
  // Get all unique work order statuses
  const orderStatuses = useMemo(() => {
    const statuses = new Set<WorkOrderStatus>();
    workOrders.forEach(order => statuses.add(order.status));
    return Array.from(statuses);
  }, [workOrders]);
  
  // Get all unique work order priorities
  const orderPriorities = useMemo(() => {
    const priorities = new Set<WorkOrderPriority>();
    workOrders.forEach(order => priorities.add(order.priority));
    return Array.from(priorities);
  }, [workOrders]);
  
  // Filter work orders based on selected filters
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(order => {
      const matchesType = typeFilter.length === 0 || typeFilter.includes(order.order_type);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(order.priority);
      return matchesType && matchesStatus && matchesPriority;
    });
  }, [workOrders, typeFilter, statusFilter, priorityFilter]);
  
  // Get all dates that have work orders
  const workOrderDates = useMemo(() => {
    return filteredWorkOrders.reduce((dates: Date[], order) => {
      if (order.requested_date) {
        const date = new Date(order.requested_date);
        if (!dates.some(d => isSameDay(d, date))) {
          dates.push(date);
        }
      }
      
      if (order.scheduled_date) {
        const date = new Date(order.scheduled_date);
        if (!dates.some(d => isSameDay(d, date))) {
          dates.push(date);
        }
      }
      
      return dates;
    }, []);
  }, [filteredWorkOrders]);
  
  // Get work orders for the selected date
  const ordersForSelectedDate = useMemo(() => {
    return selectedDate 
      ? filteredWorkOrders.filter(order => 
          (order.requested_date && isSameDay(new Date(order.requested_date), selectedDate)) || 
          (order.scheduled_date && isSameDay(new Date(order.scheduled_date), selectedDate))
        )
      : [];
  }, [selectedDate, filteredWorkOrders]);
  
  // Toggle type filter
  const toggleTypeFilter = (type: WorkOrderType) => {
    setTypeFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  // Toggle status filter
  const toggleStatusFilter = (status: WorkOrderStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };
  
  // Toggle priority filter
  const togglePriorityFilter = (priority: WorkOrderPriority) => {
    setPriorityFilter(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority) 
        : [...prev, priority]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setTypeFilter([]);
    setStatusFilter([]);
    setPriorityFilter([]);
  };
  
  // Toggle filter panel visibility
  const toggleFilterPanel = () => {
    setShowFilters(prev => !prev);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading work orders...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filter Panel */}
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CalendarSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          workOrderDates={workOrderDates}
          filteredWorkOrders={filteredWorkOrders}
          setCurrentMonth={setCurrentMonth}
        />
        
        <OrdersDisplaySection
          selectedDate={selectedDate}
          ordersForSelectedDate={ordersForSelectedDate}
          onOrderClick={setSelectedOrder}
        />

        <WorkOrderDetailDialog 
          workOrder={selectedOrder} 
          open={selectedOrder !== null} 
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      </div>
    </div>
  );
}
