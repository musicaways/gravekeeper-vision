
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Import only what we need
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
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
      <DashboardStats stats={data.stats} />
      <div className="grid grid-cols-1 mt-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
          <RecentActivities workOrders={data.recentWorkOrders} />
        </div>
      </div>
    </div>
  );
}
