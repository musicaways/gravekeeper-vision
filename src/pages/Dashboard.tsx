
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import NicheMap from '@/components/niche-map/NicheMap';
import { mockNiches, mockCemeteries, mockSections, mockBlocks, mockPlots, mockWorkOrders } from '@/lib/mock-data';
import { WorkOrdersKanban } from '@/components/work-orders/WorkOrdersKanban'; // Fixed import path

import * as Icons from 'lucide-react';

const Dashboard = () => {
  const [selectedCemetery, setSelectedCemetery] = useState(mockCemeteries[0]);
  
  return (
    <Layout title="Dashboard" subtitle="Cemetery Management System">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-enter">
        <StatsCard 
          title="Total Cemeteries" 
          value={mockCemeteries.length.toString()} 
          description="Active cemetery locations"
          icon={<Icons.Building2 className="h-12 w-12 text-blue-500/20" />}
          trend={{ value: "+0%", positive: true }}
        />
        
        <StatsCard 
          title="Total Plots" 
          value={mockPlots.length.toString()} 
          description="Across all cemeteries"
          icon={<Icons.Layers className="h-12 w-12 text-orange-500/20" />}
          trend={{ value: "+2.5%", positive: true }}
        />
        
        <StatsCard 
          title="Available Plots" 
          value={mockPlots.filter(p => p.status === 'available').length.toString()} 
          description="Ready for assignment"
          icon={<Icons.CheckSquare className="h-12 w-12 text-green-500/20" />}
          trend={{ value: "-1%", positive: false }}
        />
        
        <StatsCard 
          title="Pending Work Orders" 
          value={mockWorkOrders.filter(wo => wo.status === 'pending').length.toString()} 
          description="Tasks waiting to be completed"
          icon={<Icons.ClipboardList className="h-12 w-12 text-red-500/20" />}
          trend={{ value: "+1", positive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icons.BarChart3 className="h-5 w-5 text-primary" />
                Work Order Status
              </CardTitle>
              <CardDescription>
                Current work orders by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart would go here in a real implementation
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-sm h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icons.CalendarClock className="h-5 w-5 text-primary" />
                Upcoming Work Orders
              </CardTitle>
              <CardDescription>
                Scheduled for the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockWorkOrders
                  .filter(wo => wo.status === 'pending')
                  .slice(0, 3)
                  .map(wo => (
                    <div key={wo.id} className="flex items-start gap-3 pb-4 border-b">
                      <div className={`h-12 w-1 rounded-full ${wo.priority === 'urgent' ? 'bg-red-500' : wo.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      <div className="flex-1">
                        <div className="font-medium">{wo.order_number}</div>
                        <div className="text-sm text-muted-foreground">{wo.description.substring(0, 40)}...</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Scheduled: {new Date(wo.scheduled_date || wo.requested_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs capitalize px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        {wo.order_type}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mb-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icons.Grid3X3 className="h-5 w-5 text-primary" />
              Niche Visualization
            </CardTitle>
            <CardDescription>
              Interactive map of columbarium niches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NicheMap 
              blockId={mockBlocks[2].block_code}
              rows={6}
              columns={8}
              niches={mockNiches}
              onNicheClick={(nicheId) => console.log(`Clicked niche: ${nicheId}`)}
            />
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Icons.Kanban className="h-5 w-5 text-primary" />
              Work Orders Board
            </CardTitle>
            <CardDescription>
              Manage work orders by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <WorkOrdersKanban 
                workOrders={mockWorkOrders}
                onWorkOrderClick={(workOrder) => console.log('Clicked work order:', workOrder)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon, trend }) => (
  <Card className="shadow-sm overflow-hidden">
    <CardContent className="p-6 relative">
      <div className="absolute top-0 right-0 p-4 opacity-70">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold mt-1 mb-1">{value}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? (
              <Icons.TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <Icons.TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trend.value}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default Dashboard;
