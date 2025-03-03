
import DesktopSearch from "./search/DesktopSearch";
import MobileSearch from "./search/MobileSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [initialSyncDone, setInitialSyncDone] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  
  // Extract search term from URL to sync the search component state with URL
  useEffect(() => {
    if (!initialSyncDone) {
      const params = new URLSearchParams(location.search);
      const searchParam = params.get('search');
      
      // If there's a search term in the URL and we have a search handler
      if (searchParam) {
        setSearchValue(searchParam);
        if (onSearch) {
          onSearch(searchParam);
        }
      }
      setInitialSyncDone(true);
    }
  }, [location.search, onSearch, initialSyncDone]);
  
  const handleSearch = (term: string) => {
    setSearchValue(term);
    if (onSearch) {
      onSearch(term);
    }
  };
  
  return (
    <div className="flex items-center justify-end">
      {isMobile ? 
        <MobileSearch onSearch={handleSearch} value={searchValue} /> : 
        <DesktopSearch onSearch={handleSearch} value={searchValue} />
      }
    </div>
  );
};

export default GlobalSearch;
