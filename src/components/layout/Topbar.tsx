
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import GlobalSearch from "./GlobalSearch";
import NavigationButtons from "./topbar/NavigationButtons";
import UserControlButtons from "./topbar/UserControlButtons";

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
      <NavigationButtons 
        onMenuClick={onMenuClick}
        showBackButton={showBackButton}
        onBackClick={handleBack}
      />
      
      <div className="flex items-center gap-1 mr-2">
        <GlobalSearch onSearch={handleSearch} />
        <UserControlButtons />
      </div>
    </header>
  );
};

export default Topbar;
