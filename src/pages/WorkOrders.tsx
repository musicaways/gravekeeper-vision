
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, List, Calendar } from "lucide-react";
import { WorkOrdersToolbar, WorkOrdersFilter } from "@/components/work-orders/WorkOrdersToolbar";
import { WorkOrdersKanban } from "@/components/work-orders/WorkOrdersKanban";
import { WorkOrderList } from "@/components/work-orders/WorkOrderList";
import { WorkOrderCalendarView } from "@/components/work-orders/WorkOrderCalendarView";
import { WorkOrderFilterPanel } from "@/components/work-orders/WorkOrderFilterPanel";

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<WorkOrderType[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  
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
  
  // Toggle filter panel visibility
  const toggleFilterPanel = () => {
    setShowFilters(prev => !prev);
  };
  
  const pendingOrders = filteredWorkOrders.filter(order => order.status === "pending");
  const inProgressOrders = filteredWorkOrders.filter(order => order.status === "in_progress");
  const completedOrders = filteredWorkOrders.filter(order => order.status === "completed");
  const cancelledOrders = filteredWorkOrders.filter(order => order.status === "cancelled");
  
  return (
    <div className="container mx-auto p-4">
      <WorkOrdersToolbar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
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
    </div>
  );
}
