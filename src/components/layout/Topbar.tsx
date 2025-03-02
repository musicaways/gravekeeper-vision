
import { Bell, Menu, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

const Topbar = ({ title, subtitle, onMenuClick }: TopbarProps) => {
  return (
    <header className="sticky top-0 z-10 border-b bg-card h-16 px-4 flex items-center justify-between shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-4">
        {/* Only show the menu button when onMenuClick is provided */}
        {onMenuClick && (
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
