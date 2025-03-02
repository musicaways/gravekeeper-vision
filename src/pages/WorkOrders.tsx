
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkOrder, WorkOrderStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, MoreHorizontal, Calendar, Kanban, List } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

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
    <Layout title="Work Orders" subtitle="Manage and track maintenance tasks">
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Work Orders</h1>
            <p className="text-muted-foreground">Manage and track maintenance tasks</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[250px]"
            />
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Work Order
            </Button>
          </div>
        </div>
        
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>All Orders</DropdownMenuItem>
                <DropdownMenuItem>High Priority</DropdownMenuItem>
                <DropdownMenuItem>Assigned to Me</DropdownMenuItem>
                <DropdownMenuItem>Created Today</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <TabsContent value="kanban" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KanbanColumn 
                  title="Pending" 
                  count={pendingOrders.length} 
                  orders={pendingOrders} 
                  colorClass="bg-yellow-100"
                />
                <KanbanColumn 
                  title="In Progress" 
                  count={inProgressOrders.length} 
                  orders={inProgressOrders} 
                  colorClass="bg-blue-100"
                />
                <KanbanColumn 
                  title="Completed" 
                  count={completedOrders.length} 
                  orders={completedOrders} 
                  colorClass="bg-green-100"
                />
                <KanbanColumn 
                  title="Cancelled" 
                  count={cancelledOrders.length} 
                  orders={cancelledOrders} 
                  colorClass="bg-red-100"
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="grid grid-cols-7 p-4 font-medium border-b">
                  <div className="col-span-2">Description</div>
                  <div>Order #</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div>Priority</div>
                  <div className="text-right">Actions</div>
                </div>
                
                {filteredWorkOrders.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No work orders found matching your search criteria.
                  </div>
                ) : (
                  filteredWorkOrders.map(order => (
                    <div key={order.id} className="grid grid-cols-7 p-4 border-b hover:bg-gray-50">
                      <div className="col-span-2">{order.description}</div>
                      <div>{order.order_number}</div>
                      <div>{formatOrderType(order.order_type)}</div>
                      <div>
                        <WorkOrderStatusBadge status={order.status} />
                      </div>
                      <div>
                        <WorkOrderPriorityBadge priority={order.priority} />
                      </div>
                      <div className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="min-h-[500px] flex items-center justify-center">
              <div className="text-center p-8">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Calendar view is not implemented yet. Check back soon!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function WorkOrderStatusBadge({ status }: { status: WorkOrderStatus }) {
  const getStatusClasses = () => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses()}`}>
      {formatStatus(status)}
    </span>
  );
}

function WorkOrderPriorityBadge({ priority }: { priority: string }) {
  const getPriorityClasses = () => {
    switch(priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityClasses()}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

interface KanbanColumnProps {
  title: string;
  count: number;
  orders: WorkOrder[];
  colorClass: string;
}

function KanbanColumn({ title, count, orders, colorClass }: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className={`px-4 py-3 ${colorClass} rounded-t-lg font-medium flex justify-between items-center`}>
        <span>{title}</span>
        <span className="bg-white px-2 py-1 rounded-full text-xs">{count}</span>
      </div>
      
      <div className="bg-gray-50 rounded-b-lg flex-grow min-h-[500px] p-2">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-4 text-center">
            No work orders in this status
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map(order => (
              <WorkOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkOrderCard({ order }: { order: WorkOrder }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{formatOrderType(order.order_type)}</CardTitle>
          <WorkOrderPriorityBadge priority={order.priority} />
        </div>
        <CardDescription className="text-xs">{order.order_number}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <p className="text-sm line-clamp-2">{order.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        {order.requested_date && 
          <div>Requested: {format(new Date(order.requested_date), 'MMM dd, yyyy')}</div>
        }
      </CardFooter>
    </Card>
  );
}

function formatStatus(status: string): string {
  switch(status) {
    case 'in_progress':
      return 'In Progress';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function formatOrderType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
