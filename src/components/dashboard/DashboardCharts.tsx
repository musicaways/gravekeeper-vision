
import React from "react";
import { StatisticsChart } from "./StatisticsChart";
import { WorkOrderStatusChart } from "./WorkOrderStatusChart";

interface DashboardChartsProps {
  pieData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  workOrderStatusData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function DashboardCharts({ pieData, workOrderStatusData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <StatisticsChart data={pieData} />
      <WorkOrderStatusChart data={workOrderStatusData} />
    </div>
  );
}
