
import DesktopSearch from "./search/DesktopSearch";
import MobileSearch from "./search/MobileSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
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
  
  const handleSearch = (term: string, shouldNavigate = false) => {
    setSearchValue(term);
    
    if (shouldNavigate) {
      // Solo quando l'utente preme invio aggiorniamo l'URL e facciamo la ricerca
      const params = new URLSearchParams(location.search);
      
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      
      // Update URL without reloading the page
      const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      navigate(newUrl, { replace: true });
      
      // Avvia la ricerca
      if (onSearch) {
        onSearch(term);
      }
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
