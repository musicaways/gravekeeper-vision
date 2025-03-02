import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Cemetery } from "@/types";
import { Map, Grid, Users, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import our new components
import { StatCard } from "@/components/dashboard/StatCard";
import { CemeteryCard } from "@/components/dashboard/CemeteryCard";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { WorkOrderStatusChart } from "@/components/dashboard/WorkOrderStatusChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

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
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader />

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
        <StatisticsChart data={pieData} />
        <WorkOrderStatusChart data={workOrderStatusData} />
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
          <RecentActivities workOrders={recentWorkOrders} />
        </div>
      </div>
    </div>
  );
}
