
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
  
  // Extract initial search term from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);
  
  // Handle search based on current route
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    console.log("Search term in Topbar:", term);
    
    // Add search term to query params
    if (location.pathname === "/" || location.pathname === "/cemeteries") {
      // Add search term to URL query params
      const params = new URLSearchParams(location.search);
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      
      // Update URL without reloading the page
      const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      navigate(newUrl, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);
  
  // Reset search only when the main route path changes
  useEffect(() => {
    const currentMainPath = location.pathname.split('/')[1];
    return () => {
      const newMainPath = window.location.pathname.split('/')[1];
      if (currentMainPath !== newMainPath) {
        setSearchTerm("");
      }
    };
  }, [location.pathname]);
  
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
