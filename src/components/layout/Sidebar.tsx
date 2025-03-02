
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Landmark, 
  ClipboardList, 
  Users, 
  Boxes, 
  Settings, 
  Map, 
  Activity,
  Bot
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export default function Sidebar({ className }: SidebarNavProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              <Link to="/">
                <Button
                  variant={isActive("/") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/cemeteries">
                <Button
                  variant={isActive("/cemeteries") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Landmark className="mr-2 h-4 w-4" />
                  Cemeteries
                </Button>
              </Link>
              <Link to="/work-orders">
                <Button
                  variant={isActive("/work-orders") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Work Orders
                </Button>
              </Link>
              <Link to="/deceased">
                <Button
                  variant={isActive("/deceased") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Deceased Records
                </Button>
              </Link>
              <Link to="/inventory">
                <Button
                  variant={isActive("/inventory") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Boxes className="mr-2 h-4 w-4" />
                  Inventory
                </Button>
              </Link>
              <Link to="/crews">
                <Button
                  variant={isActive("/crews") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Work Crews
                </Button>
              </Link>
              <Link to="/maps">
                <Button
                  variant={isActive("/maps") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Map className="mr-2 h-4 w-4" />
                  Cemetery Maps
                </Button>
              </Link>
              <Link to="/ai-assistant">
                <Button
                  variant={isActive("/ai-assistant") ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Bot className="mr-2 h-4 w-4" />
                  AI Assistant
                </Button>
              </Link>
            </div>

            <div className="mt-6">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Settings
              </h2>
              <div className="space-y-1">
                <Link to="/profile">
                  <Button
                    variant={isActive("/profile") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button
                    variant={isActive("/settings") ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
