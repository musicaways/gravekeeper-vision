
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder, WorkOrderStatus } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Kanban, List, Calendar } from "lucide-react";
import { WorkOrdersToolbar, WorkOrdersFilter } from "@/components/work-orders/WorkOrdersToolbar";
import { WorkOrdersKanban } from "@/components/work-orders/WorkOrdersKanban";
import { WorkOrderList } from "@/components/work-orders/WorkOrderList";
import { WorkOrderCalendarView } from "@/components/work-orders/WorkOrderCalendarView";

export default function WorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState("");
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
  
  const filteredWorkOrders = workOrders.filter(order => 
    order.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
