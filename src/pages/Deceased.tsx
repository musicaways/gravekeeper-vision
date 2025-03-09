
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeceasedList from "@/components/deceased/DeceasedList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpAZ, ArrowDownAZ, Calendar, MapPin } from "lucide-react";

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

  // Helper function to get the active sort option label
  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc':
        return 'Nome (A-Z)';
      case 'name-desc':
        return 'Nome (Z-A)';
      case 'date':
        return 'Data decesso';
      case 'cemetery':
        return 'Cimitero';
      default:
        return 'Ordina per';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-none px-1 py-2">
        <div className="mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs font-normal px-3 border-muted-foreground/20 text-muted-foreground hover:text-foreground"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                {getSortLabel()}
                <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-background border-muted-foreground/20 w-48">
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'name-asc' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('name-asc')}
              >
                <ArrowUpAZ className="h-3.5 w-3.5 mr-2" />
                Nome (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'name-desc' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('name-desc')}
              >
                <ArrowDownAZ className="h-3.5 w-3.5 mr-2" />
                Nome (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'date' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('date')}
              >
                <Calendar className="h-3.5 w-3.5 mr-2" />
                Data decesso
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'cemetery' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('cemetery')}
              >
                <MapPin className="h-3.5 w-3.5 mr-2" />
                Cimitero
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="w-full max-w-none px-1 pb-8">
        <DeceasedList searchTerm={searchTerm} sortBy={sortBy} />
      </div>
    </div>
  );
};

export default Deceased;
