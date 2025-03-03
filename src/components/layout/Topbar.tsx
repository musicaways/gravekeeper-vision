
import { Bell, ChevronLeft, Menu, User2 } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import { useState, useEffect } from "react";

interface TopbarProps {
  onMenuClick?: () => void;
  showBackButton?: boolean;
}

const Topbar = ({ onMenuClick, showBackButton = false }: TopbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Handle search based on current route
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    console.log("Search term in Topbar:", term);
    // Add any global search behavior here
    // We'll let each page component handle the actual filtering
  };
  
  // Reset search when route changes
  useEffect(() => {
    setSearchTerm("");
  }, [location.pathname]);
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-card h-12 md:h-14 flex items-center justify-between shadow-sm transition-colors duration-200">
      <div className="flex items-center">
        {onMenuClick && (
          <Button onClick={onMenuClick} variant="ghost" size="icon" className="ml-1" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {showBackButton && (
          <Button onClick={handleBack} variant="ghost" size="icon" aria-label="Torna indietro">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-1 mr-1">
        <GlobalSearch onSearch={handleSearch} />
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
