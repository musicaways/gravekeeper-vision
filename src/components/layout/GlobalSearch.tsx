
import DesktopSearch from "./search/DesktopSearch";
import MobileSearch from "./search/MobileSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Extract search term from URL to sync the search component state with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    // If there's a search term in the URL and we have a search handler
    if (searchParam && onSearch) {
      onSearch(searchParam);
    }
  }, [location.search, onSearch]);
  
  return (
    <div className="flex items-center justify-end">
      {isMobile ? 
        <MobileSearch onSearch={onSearch} /> : 
        <DesktopSearch onSearch={onSearch} />
      }
    </div>
  );
};

export default GlobalSearch;
