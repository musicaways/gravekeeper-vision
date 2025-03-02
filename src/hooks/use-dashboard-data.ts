
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Cemetery } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalCemeteries: number;
  totalSections: number;
  totalPlots: number;
  totalDeceased: number;
}

interface DashboardData {
  cemeteries: Cemetery[];
  recentWorkOrders: any[];
  stats: DashboardStats;
  pieData: Array<{ name: string; value: number; color: string }>;
  workOrderStatusData: Array<{ name: string; value: number; color: string }>;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    cemeteries: [],
    recentWorkOrders: [],
    stats: {
      totalCemeteries: 0,
      totalSections: 0,
      totalPlots: 0,
      totalDeceased: 0,
    },
    pieData: [],
    workOrderStatusData: []
  });
  const [loading, setLoading] = useState(true);
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
        }

        const stats = {
          totalCemeteries: cemeteriesData.length,
          totalSections: settoriCount?.length || 0,
          totalPlots: 0, // To be implemented
          totalDeceased: defuntiCount?.length || 0,
        };

        // Data for pie chart
        const pieData = [
          { name: "Cemeteries", value: stats.totalCemeteries, color: "#8884d8" },
          { name: "Sections", value: stats.totalSections, color: "#82ca9d" },
          { name: "Deceased Records", value: stats.totalDeceased, color: "#ffc658" },
        ];

        // Data for bar chart
        const workOrderStatusData = [
          { name: "Pending", value: (workOrdersData || []).filter(wo => wo.status === 'pending').length, color: "#ff8c42" },
          { name: "In Progress", value: (workOrdersData || []).filter(wo => wo.status === 'in_progress').length, color: "#4287f5" },
          { name: "Completed", value: (workOrdersData || []).filter(wo => wo.status === 'completed').length, color: "#42f584" },
          { name: "Cancelled", value: (workOrdersData || []).filter(wo => wo.status === 'cancelled').length, color: "#f54242" },
        ];

        setData({
          cemeteries: mappedCemeteries,
          recentWorkOrders: workOrdersData || [],
          stats,
          pieData,
          workOrderStatusData
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

  return { data, loading };
}
