
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
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ className, collapsed = false, onToggle }: SidebarNavProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={cn(
      "h-screen border-r pb-12 transition-all duration-300 bg-background shadow-lg", 
      collapsed ? "w-[70px]" : "w-[240px]", 
      className
    )}>
      <div className="flex justify-between p-2 items-center">
        {!collapsed && <span className="font-semibold px-2">CemeteryPro</span>}
        <Button variant="ghost" size="sm" onClick={onToggle} className="ml-auto">
          {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          {!collapsed && (
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Navigation
            </h2>
          )}
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1">
              <Link to="/">
                <Button
                  variant={isActive("/") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <Home className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "Dashboard"}
                </Button>
              </Link>
              <Link to="/cemeteries">
                <Button
                  variant={isActive("/cemeteries") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <Landmark className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "Cemeteries"}
                </Button>
              </Link>
              <Link to="/work-orders">
                <Button
                  variant={isActive("/work-orders") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <ClipboardList className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "Work Orders"}
                </Button>
              </Link>
              <Link to="/deceased">
                <Button
                  variant={isActive("/deceased") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <Users className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "Deceased Records"}
                </Button>
              </Link>
              <Link to="/inventory">
                <Button
                  variant={isActive("/inventory") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <Boxes className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "Inventory"}
                </Button>
              </Link>
              <Link to="/crews">
                <Button
                  variant={isActive("/crews") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <Activity className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "Work Crews"}
                </Button>
              </Link>
              <Link to="/maps">
                <Button
                  variant={isActive("/maps") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <Map className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "Cemetery Maps"}
                </Button>
              </Link>
              <Link to="/ai-assistant">
                <Button
                  variant={isActive("/ai-assistant") ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "justify-center px-2")}
                >
                  <Bot className={cn("h-4 w-4", collapsed ? "mx-0" : "mr-2")} />
                  {!collapsed && "AI Assistant"}
                </Button>
              </Link>
            </div>

            {!collapsed && (
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
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
