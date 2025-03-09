
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUpAZ, ArrowDownAZ, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeceasedList from "@/components/deceased/DeceasedList";

const Deceased = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || "";
  const [sortBy, setSortBy] = useState("name-asc"); // Default sort

  // Listen for search term changes in the URL
  useEffect(() => {
    // This is handled by the global search in Topbar.tsx
    // We just need to read the search parameter
  }, [location.search]);

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-none px-1 py-2">
        <div className="flex items-center space-x-1 text-muted-foreground mb-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 ${sortBy === 'name-asc' ? 'text-primary' : ''}`} 
            onClick={() => handleSort('name-asc')}
          >
            <ArrowUpAZ className="h-4 w-4 mr-1" />
            <span className="text-xs">Nome</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 ${sortBy === 'name-desc' ? 'text-primary' : ''}`} 
            onClick={() => handleSort('name-desc')}
          >
            <ArrowDownAZ className="h-4 w-4 mr-1" />
            <span className="text-xs">Nome</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 ${sortBy === 'date' ? 'text-primary' : ''}`} 
            onClick={() => handleSort('date')}
          >
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs">Data</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`px-2 ${sortBy === 'cemetery' ? 'text-primary' : ''}`} 
            onClick={() => handleSort('cemetery')}
          >
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-xs">Cimitero</span>
          </Button>
        </div>
      </div>
      
      <div className="w-full max-w-none px-1 pb-8">
        <DeceasedList searchTerm={searchTerm} sortBy={sortBy} />
      </div>
    </div>
  );
};

export default Deceased;
