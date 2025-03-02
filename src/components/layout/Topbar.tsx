
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CemeteryProLogo } from "@/components/CemeteryProLogo";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, LogOut, Bell, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    if (path === "/") return "Dashboard";
    if (path === "/cemeteries") return "Gestione Cimiteri";
    if (path.startsWith("/cemetery/")) return "Dettaglio Cimitero";
    if (path === "/work-orders") return "Ordini di Lavoro";
    if (path === "/profile") return "Profilo Utente";
    if (path === "/settings") return "Impostazioni";
    
    return "CemeteryPro";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="h-16 border-b px-4 flex items-center justify-between sticky top-0 bg-background z-10">
      <div className="flex items-center">
        <Link to="/" className="flex items-center mr-6">
          <CemeteryProLogo />
        </Link>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1">3</Badge>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profilo</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Impostazioni</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Disconnetti</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
