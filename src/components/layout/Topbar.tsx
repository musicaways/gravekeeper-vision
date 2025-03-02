
import { BellIcon, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void; // Added for mobile menu toggle
}

const Topbar = ({ title, subtitle, onMenuClick }: TopbarProps) => {
  return (
    <header className="border-b bg-card h-16 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
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
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <BellIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <User2 className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
