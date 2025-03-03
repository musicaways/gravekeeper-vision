
import DesktopSearch from "./search/DesktopSearch";
import MobileSearch from "./search/MobileSearch";
import { useIsMobile } from "@/hooks/use-mobile";

interface GlobalSearchProps {
  onSearch?: (searchTerm: string) => void;
}

const GlobalSearch = ({ onSearch }: GlobalSearchProps) => {
  const isMobile = useIsMobile();
  
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
