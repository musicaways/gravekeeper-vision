
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface WorkOrderStatusChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function WorkOrderStatusChart({ data }: WorkOrderStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Work Order Status</CardTitle>
        <CardDescription>Current status of maintenance tasks</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Work Orders">
              {data.map((entry, index) => (
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
  );
}
