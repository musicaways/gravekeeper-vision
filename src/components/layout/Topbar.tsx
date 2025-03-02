
import { Bell, ChevronLeft, Menu, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useNavigate, useLocation } from "react-router-dom";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
  showBackButton?: boolean;
}

const Topbar = ({ title, subtitle, onMenuClick, showBackButton = false }: TopbarProps) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-card h-16 px-4 flex items-center justify-between shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-4">
        {showBackButton ? (
          <Button onClick={handleBack} variant="ghost" size="icon" aria-label="Torna indietro">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : onMenuClick && (
          <Button onClick={onMenuClick} variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <User2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
