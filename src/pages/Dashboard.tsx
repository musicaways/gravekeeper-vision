
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Cemetery } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Grid, Users, Map, FileSpreadsheet, Clock, Calendar, Building, Check, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export default function Dashboard() {
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentWorkOrders, setRecentWorkOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCemeteries: 0,
    totalSections: 0,
    totalPlots: 0,
    totalDeceased: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cemeteries
        const { data: cemeteriesData, error: cemeteriesError } = await supabase
          .from("Cimitero")
          .select("*")
          .limit(5);

        if (cemeteriesError) {
          throw cemeteriesError;
        }

        const mappedCemeteries = cemeteriesData.map((c) => ({
          id: c.Id.toString(),
          name: c.nome || c.Descrizione || "Unnamed Cemetery",
          address: c.Indirizzo || "",
          city: c.city || "",
          state: c.state || "",
          postal_code: c.postal_code || "",
          country: c.country || "Italy",
          established_date: c.established_date || "",
          total_area_sqm: c.total_area_sqm || 0,
          geo_location: {
            lat: c.Latitudine || 0,
            lng: c.Longitudine || 0
          },
          contact_info: {
            phone: typeof c.contact_info === 'object' && c.contact_info && 'phone' in c.contact_info ? String(c.contact_info.phone || '') : '',
            email: typeof c.contact_info === 'object' && c.contact_info && 'email' in c.contact_info ? String(c.contact_info.email || '') : '',
            website: typeof c.contact_info === 'object' && c.contact_info && 'website' in c.contact_info ? String(c.contact_info.website) : undefined
          },
          operating_hours: typeof c.operating_hours === 'object' && c.operating_hours ? 
            (c.operating_hours as Record<string, { open: string; close: string }>) : 
            {},
          active: c.active ?? true,
        }));

        setCemeteries(mappedCemeteries);

        // Fetch stats
        const { data: settoriCount, error: settoriError } = await supabase
          .from("Settore")
          .select("Id", { count: "exact", head: true });

        if (settoriError) throw settoriError;

        const { data: defuntiCount, error: defuntiError } = await supabase
          .from("Defunto")
          .select("Id", { count: "exact", head: true });

        if (defuntiError) throw defuntiError;
        
        // Fetch recent work orders
        const { data: workOrdersData, error: workOrdersError } = await supabase
          .from("work_orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (workOrdersError) {
          console.error("Error fetching work orders:", workOrdersError);
        } else {
          setRecentWorkOrders(workOrdersData || []);
        }

        setStats({
          totalCemeteries: cemeteriesData.length,
          totalSections: settoriCount?.length || 0,
          totalPlots: 0, // To be implemented
          totalDeceased: defuntiCount?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          title: "Error loading dashboard",
          description: "Failed to load dashboard data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Data for pie chart
  const pieData = [
    { name: "Cemeteries", value: stats.totalCemeteries, color: "#8884d8" },
    { name: "Sections", value: stats.totalSections, color: "#82ca9d" },
    { name: "Deceased Records", value: stats.totalDeceased, color: "#ffc658" },
  ];

  // Data for bar chart
  const workOrderStatusData = [
    { name: "Pending", value: recentWorkOrders.filter(wo => wo.status === 'pending').length, color: "#ff8c42" },
    { name: "In Progress", value: recentWorkOrders.filter(wo => wo.status === 'in_progress').length, color: "#4287f5" },
    { name: "Completed", value: recentWorkOrders.filter(wo => wo.status === 'completed').length, color: "#42f584" },
    { name: "Cancelled", value: recentWorkOrders.filter(wo => wo.status === 'cancelled').length, color: "#f54242" },
  ];

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="h-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(), "EEEE d MMMM yyyy", { locale: it })}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Cemeteries"
            value={stats.totalCemeteries}
            icon={<Map className="h-6 w-6" />}
            description="Total cemeteries managed"
          />
          <StatCard
            title="Sections"
            value={stats.totalSections}
            icon={<Grid className="h-6 w-6" />}
            description="Total cemetery sections"
          />
          <StatCard
            title="Plots"
            value={stats.totalPlots}
            icon={<FileSpreadsheet className="h-6 w-6" />}
            description="Available burial plots"
          />
          <StatCard
            title="Records"
            value={stats.totalDeceased}
            icon={<Users className="h-6 w-6" />}
            description="Deceased person records"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Statistics Overview</CardTitle>
              <CardDescription>Distribution of cemetery resources</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Work Order Status</CardTitle>
              <CardDescription>Current status of maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workOrderStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Work Orders">
                    {workOrderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter>
              <Link to="/work-orders" className="w-full">
                <Button variant="outline" className="w-full">View All Work Orders</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Recent Cemeteries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cemeteries.map((cemetery) => (
                <CemeteryCard key={cemetery.id} cemetery={cemetery} />
              ))}
            </div>
            <div className="mt-4">
              <Link to="/cemeteries">
                <Button variant="outline" className="w-full">View All Cemeteries</Button>
              </Link>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentWorkOrders.length > 0 ? (
                    recentWorkOrders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-accent transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`mt-0.5 rounded-full p-1.5 ${getWorkOrderStatusColor(order.status)}`}>
                              {getWorkOrderStatusIcon(order.status)}
                            </div>
                            <div>
                              <p className="font-medium">{getWorkOrderTypeLabel(order.order_type)}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {order.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(order.created_at), "d MMM yyyy")}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={
                              order.priority === 'high' ? "destructive" : 
                              order.priority === 'medium' ? "outline" : 
                              "secondary"
                            }
                          >
                            {order.priority}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No recent activities
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-3">
                <Link to="/work-orders" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Activities
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper functions for work order displays
function getWorkOrderStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-600';
    case 'in_progress': return 'bg-blue-100 text-blue-600';
    case 'completed': return 'bg-green-100 text-green-600';
    case 'cancelled': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getWorkOrderStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'in_progress': return <Workflow className="h-4 w-4" />;
    case 'completed': return <Check className="h-4 w-4" />;
    case 'cancelled': return <Users className="h-4 w-4" />;
    default: return <Building className="h-4 w-4" />;
  }
}

function getWorkOrderTypeLabel(type: string) {
  switch (type) {
    case 'maintenance': return 'Maintenance';
    case 'burial': return 'Burial Service';
    case 'landscaping': return 'Landscaping';
    case 'cleaning': return 'Cleaning';
    case 'construction': return 'Construction';
    default: return 'Other Work';
  }
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function CemeteryCard({ cemetery }: { cemetery: Cemetery }) {
  const hasContactInfo = cemetery.contact_info.phone || cemetery.contact_info.email;
  
  return (
    <Link to={`/cemetery/${cemetery.id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
        <CardHeader className="pb-2">
          <CardTitle>{cemetery.name}</CardTitle>
          <CardDescription>
            {cemetery.city || cemetery.state ? 
              `${cemetery.city}${cemetery.state ? `, ${cemetery.state}` : ''}` : 
              cemetery.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            {cemetery.address && (
              <div className="flex items-start">
                <Map className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <span>{cemetery.address}</span>
              </div>
            )}
            
            {hasContactInfo && (
              <div className="border-t pt-2 mt-2">
                {cemetery.contact_info.phone && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{cemetery.contact_info.phone}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-1 flex items-center justify-between">
              {cemetery.established_date && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Est. {cemetery.established_date}</span>
                </div>
              )}
              
              {cemetery.active ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50">
                  Inactive
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
