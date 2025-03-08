
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Landmark, 
  ClipboardList, 
  Users, 
  Boxes, 
  Settings, 
  Activity,
  Bot,
  ChevronLeft,
  X,
  LucideIcon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export default function Sidebar({ open, onToggle, isMobile }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // For mobile: fixed position, full screen with overlay effect when open
  // For desktop: always visible, can be collapsed to narrow width
  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-50 flex flex-col h-screen bg-background border-r transition-all duration-300",
    isMobile 
      ? open ? "translate-x-0 shadow-xl" : "-translate-x-full" 
      : open ? "w-64 translate-x-0" : "w-20 translate-x-0"
  );

  const handleNavigate = (href: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(href);
    if (isMobile && open) {
      onToggle();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
      
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b">
          {(!isMobile || (isMobile && open)) && (
            <span className={cn("font-semibold truncate", !open && !isMobile && "hidden")}>
              CemeteryPro
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={onToggle} className="ml-auto">
            {isMobile ? <X size={18} /> : <ChevronLeft size={18} className={!open ? "rotate-180" : ""} />}
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="px-3 py-4">
            {(open || isMobile) && (
              <h2 className="mb-2 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Navigazione
              </h2>
            )}
            
            <nav className="space-y-1">
              <NavItem href="/dashboard" icon={Activity} label="Dashboard" isActive={isActive("/dashboard")} showLabel={open || isMobile} onClick={handleNavigate} />
              <NavItem href="/" icon={Landmark} label="Cimiteri" isActive={isActive("/")} showLabel={open || isMobile} onClick={handleNavigate} />
              <NavItem href="/work-orders" icon={ClipboardList} label="Ordini di lavoro" isActive={isActive("/work-orders")} showLabel={open || isMobile} onClick={handleNavigate} />
              <NavItem href="/deceased" icon={Users} label="Registri defunti" isActive={isActive("/deceased")} showLabel={open || isMobile} onClick={handleNavigate} />
              <NavItem href="/inventory" icon={Boxes} label="Inventario" isActive={isActive("/inventory")} showLabel={open || isMobile} onClick={handleNavigate} />
              <NavItem href="/crews" icon={Activity} label="Squadre di lavoro" isActive={isActive("/crews")} showLabel={open || isMobile} onClick={handleNavigate} />
              <NavItem href="/ai-assistant" icon={Bot} label="Assistente AI" isActive={isActive("/ai-assistant")} showLabel={open || isMobile} onClick={handleNavigate} />
            </nav>
            
            {(open || isMobile) && (
              <div className="mt-8">
                <h2 className="mb-2 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Impostazioni
                </h2>
                <nav className="space-y-1">
                  <NavItem href="/profile" icon={Users} label="Profilo" isActive={isActive("/profile")} showLabel={true} onClick={handleNavigate} />
                  <NavItem href="/settings" icon={Settings} label="Impostazioni" isActive={isActive("/settings")} showLabel={true} onClick={handleNavigate} />
                </nav>
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  showLabel: boolean;
  onClick: (href: string, event: React.MouseEvent) => void;
}

function NavItem({ href, icon: Icon, label, isActive, showLabel, onClick }: NavItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-start",
        !showLabel && "justify-center px-0"
      )}
      onClick={(e) => onClick(href, e)}
    >
      <div className="flex items-center">
        <Icon className={cn("h-5 w-5", showLabel ? "mr-2" : "")} />
        {showLabel && <span>{label}</span>}
      </div>
    </Button>
  );
}
