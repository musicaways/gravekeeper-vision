
import { useState, useEffect } from "react";
import DesktopSearch from "./search/DesktopSearch";
import MobileSearch from "./search/MobileSearch";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isDesktop ? <DesktopSearch onSearch={onSearch} /> : <MobileSearch onSearch={onSearch} />;
};

export default GlobalSearch;
