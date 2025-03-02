
import { useState, useMemo } from "react";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";

export function useWorkOrderFilters(workOrders: WorkOrder[] = []) {
  // Filter states
  const [typeFilter, setTypeFilter] = useState<WorkOrderType[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority[]>([]);

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
  
  // Remove a single type filter
  const removeTypeFilter = (type: WorkOrderType) => {
    setTypeFilter(prev => prev.filter(t => t !== type));
  };
  
  // Remove a single status filter
  const removeStatusFilter = (status: WorkOrderStatus) => {
    setStatusFilter(prev => prev.filter(s => s !== status));
  };
  
  // Remove a single priority filter
  const removePriorityFilter = (priority: WorkOrderPriority) => {
    setPriorityFilter(prev => prev.filter(p => p !== priority));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setTypeFilter([]);
    setStatusFilter([]);
    setPriorityFilter([]);
  };

  // Filter work orders based on selected filters
  const filterWorkOrders = (orders: WorkOrder[]) => {
    return orders.filter(order => {
      const matchesType = typeFilter.length === 0 || typeFilter.includes(order.order_type);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(order.priority);
      return matchesType && matchesStatus && matchesPriority;
    });
  };

  // Get filtered work orders
  const filteredWorkOrders = useMemo(() => {
    return filterWorkOrders(workOrders);
  }, [workOrders, typeFilter, statusFilter, priorityFilter]);

  return {
    // Filter states
    typeFilter,
    statusFilter,
    priorityFilter,
    
    // Available options
    orderTypes,
    orderStatuses,
    orderPriorities,
    
    // Filter actions
    toggleTypeFilter,
    toggleStatusFilter,
    togglePriorityFilter,
    removeTypeFilter,
    removeStatusFilter,
    removePriorityFilter,
    clearFilters,
    
    // Filter results
    filteredWorkOrders,
    filterWorkOrders
  };
}
