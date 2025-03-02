
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Cemetery } from "@/types";
import { Button } from "@/components/ui/button";

// Import our components
import { StatCard } from "@/components/dashboard/StatCard";
import { CemeteryCard } from "@/components/dashboard/CemeteryCard";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { WorkOrderStatusChart } from "@/components/dashboard/WorkOrderStatusChart";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentCemeteries } from "@/components/dashboard/RecentCemeteries";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function Dashboard() {
  const { data, loading } = useDashboardData();
  
  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      <DashboardHeader />
      <DashboardStats stats={data.stats} />
      <DashboardCharts 
        pieData={data.pieData} 
        workOrderStatusData={data.workOrderStatusData} 
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentCemeteries cemeteries={data.cemeteries} />
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
          <RecentActivities workOrders={data.recentWorkOrders} />
        </div>
      </div>
    </div>
  );
}
