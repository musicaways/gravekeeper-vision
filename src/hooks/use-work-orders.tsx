
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";

export function useWorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<WorkOrderType[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority[]>([]);
  const { toast } = useToast();
  
  // Fetch work orders from Supabase
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('work_orders')
          .select('*');
          
        if (error) throw error;
        
        const mappedWorkOrders: WorkOrder[] = data.map(order => ({
          id: order.id,
          cemetery_id: order.cemetery_id ? order.cemetery_id.toString() : '',
          order_number: order.order_number,
          order_type: order.order_type,
          status: order.status as WorkOrderStatus,
          priority: order.priority,
          related_entity_type: order.related_entity_type as "plot" | "section" | "block" | "cemetery",
          related_entity_id: order.related_entity_id,
          description: order.description,
          requested_date: order.requested_date,
          scheduled_date: order.scheduled_date,
          assigned_crew_id: order.assigned_crew_id,
          materials_required: Array.isArray(order.materials_required) ? 
            order.materials_required as { material_id: string; quantity: number }[] : 
            []
        }));
        
        setWorkOrders(mappedWorkOrders);
      } catch (error) {
        console.error('Error fetching work orders:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load work orders. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkOrders();
  }, [toast]);
  
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
  
  // Filter work orders based on search query and filters
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(order => {
      const matchesSearch = 
        order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter.length === 0 || typeFilter.includes(order.order_type);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(order.priority);
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [workOrders, searchQuery, typeFilter, statusFilter, priorityFilter]);
  
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
  
  // Get work orders by status
  const pendingOrders = filteredWorkOrders.filter(order => order.status === "pending");
  const inProgressOrders = filteredWorkOrders.filter(order => order.status === "in_progress");
  const completedOrders = filteredWorkOrders.filter(order => order.status === "completed");
  const cancelledOrders = filteredWorkOrders.filter(order => order.status === "cancelled");
  
  return {
    workOrders,
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
  };
}
