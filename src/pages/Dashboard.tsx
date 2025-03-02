
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cemetery } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Grid, Users, Map, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [loading, setLoading] = useState(true);
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
            phone: typeof c.contact_info === 'object' && c.contact_info ? String(c.contact_info.phone || '') : '',
            email: typeof c.contact_info === 'object' && c.contact_info ? String(c.contact_info.email || '') : '',
            website: typeof c.contact_info === 'object' && c.contact_info && c.contact_info.website ? String(c.contact_info.website) : undefined
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
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

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

        <h2 className="text-2xl font-bold mb-4">Recent Cemeteries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cemeteries.map((cemetery) => (
            <CemeteryCard key={cemetery.id} cemetery={cemetery} />
          ))}
        </div>
      </div>
    </Layout>
  );
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
  return (
    <Link to={`/cemetery/${cemetery.id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle>{cemetery.name}</CardTitle>
          <CardDescription>
            {cemetery.city}, {cemetery.state}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <p>{cemetery.address}</p>
            {cemetery.active ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                Inactive
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
