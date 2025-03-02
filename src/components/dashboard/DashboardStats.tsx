
import React from "react";
import { Map, Grid, Users, FileSpreadsheet } from "lucide-react";
import { StatCard } from "./StatCard";

interface DashboardStatsProps {
  stats: {
    totalCemeteries: number;
    totalSections: number;
    totalPlots: number;
    totalDeceased: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
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
  );
}
