
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  
  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: <Icons.LayoutDashboard className="h-5 w-5" /> },
    { name: 'Cemeteries', path: '/cemeteries', icon: <Icons.LandPlot className="h-5 w-5" /> },
    { name: 'Sections', path: '/sections', icon: <Icons.Map className="h-5 w-5" /> },
    { name: 'Blocks', path: '/blocks', icon: <Icons.SquareStack className="h-5 w-5" /> },
    { name: 'Plots', path: '/plots', icon: <Icons.Layers className="h-5 w-5" /> },
    { name: 'Deceased', path: '/deceased', icon: <Icons.User className="h-5 w-5" /> },
    { name: 'Work Orders', path: '/work-orders', icon: <Icons.Clipboard className="h-5 w-5" /> },
    { name: 'Crews', path: '/crews', icon: <Icons.Users className="h-5 w-5" /> },
    { name: 'Inventory', path: '/inventory', icon: <Icons.Package className="h-5 w-5" /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <Icons.Sparkles className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <Icons.BarChart3 className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Icons.Settings className="h-5 w-5" /> },
  ];
  
  return (
    <div 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo and collapse button */}
      <div className="h-16 border-b border-sidebar-border flex items-center justify-between px-4 sticky top-0 z-10">
        {!collapsed && (
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <Icons.Building2 className="h-6 w-6 text-primary" />
            <span className="font-semibold">CemeteryPro</span>
          </div>
        )}
        
        {collapsed && (
          <Icons.Building2 className="h-6 w-6 mx-auto text-primary animate-pulse-gentle" />
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn(
            "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "ml-auto mr-auto"
          )}
        >
          {collapsed ? (
            <Icons.ChevronRight className="h-5 w-5" />
          ) : (
            <Icons.ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-2 py-2 rounded-md transition-colors duration-200",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <div className={collapsed ? "mx-auto" : ""}>
                {item.icon}
              </div>
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* User section */}
      <div className="p-3 border-t border-sidebar-border flex items-center">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
          AU
        </div>
        
        {!collapsed && (
          <div className="ml-3 flex-1 min-w-0">
            <div className="text-sm font-medium text-sidebar-foreground truncate">Admin User</div>
            <div className="text-xs text-sidebar-foreground/70 truncate">admin@example.com</div>
          </div>
        )}
        
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ml-auto"
          >
            <Icons.LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
