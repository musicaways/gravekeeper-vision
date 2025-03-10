
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeceasedList from "@/components/deceased/DeceasedList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ArrowUpAZ, ArrowDownAZ, Calendar, MapPin, CalendarClock } from "lucide-react";

const Deceased = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || "";
  const [sortBy, setSortBy] = useState("name-asc"); // Default sort
  const [filterBy, setFilterBy] = useState("all"); // Default filter
  const [selectedCemetery, setSelectedCemetery] = useState<string | null>(null);

  // Listen for search term changes in the URL
  useEffect(() => {
    // This is handled by the global search in Topbar.tsx
    // We just need to read the search parameter
  }, [location.search]);

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
  };

  const handleFilter = (filterType: string) => {
    // Reset cemetery selection when changing to a different filter type
    if (filterType !== 'by-cemetery') {
      setSelectedCemetery(null);
    }
    setFilterBy(filterType);
  };

  const handleCemeterySelect = (cemeteryName: string) => {
    setSelectedCemetery(cemeteryName);
    setFilterBy('by-cemetery');
  };

  // Helper function to get the active sort option label
  const getSortLabel = () => {
    switch (sortBy) {
      case 'name-asc':
        return 'Nome (A-Z)';
      case 'name-desc':
        return 'Nome (Z-A)';
      case 'date-desc':
        return 'Data decesso (Recente)';
      case 'date-asc':
        return 'Data decesso (Meno recente)';
      case 'cemetery-asc':
        return 'Cimitero (A-Z)';
      case 'cemetery-desc':
        return 'Cimitero (Z-A)';
      default:
        return 'Ordina per';
    }
  };

  // Helper function to get the active filter option label
  const getFilterLabel = () => {
    if (filterBy === 'by-cemetery' && selectedCemetery) {
      return `Cimitero: ${selectedCemetery}`;
    }

    switch (filterBy) {
      case 'all':
        return 'Tutti';
      case 'recent':
        return 'Recenti (30 giorni)';
      case 'this-year':
        return 'Quest\'anno';
      case 'by-cemetery':
        return 'Seleziona cimitero';
      default:
        return 'Filtra';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-none px-1 py-2">
        <div className="mb-3 flex gap-2">
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
            <DropdownMenuContent align="start" className="bg-background border-muted-foreground/20 w-56">
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
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'date-desc' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('date-desc')}
              >
                <Calendar className="h-3.5 w-3.5 mr-2" />
                Data decesso (Più recente)
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'date-asc' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('date-asc')}
              >
                <CalendarClock className="h-3.5 w-3.5 mr-2" />
                Data decesso (Meno recente)
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'cemetery-asc' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('cemetery-asc')}
              >
                <MapPin className="h-3.5 w-3.5 mr-2" />
                Cimitero (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`text-xs ${sortBy === 'cemetery-desc' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleSort('cemetery-desc')}
              >
                <MapPin className="h-3.5 w-3.5 mr-2" />
                Cimitero (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs font-normal px-3 border-muted-foreground/20 text-muted-foreground hover:text-foreground"
              >
                <Filter className="h-3.5 w-3.5 mr-1" />
                {getFilterLabel()}
                <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-background border-muted-foreground/20 w-48">
              <DropdownMenuItem 
                className={`text-xs ${filterBy === 'all' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleFilter('all')}
              >
                Tutti
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`text-xs ${filterBy === 'recent' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleFilter('recent')}
              >
                Recenti (30 giorni)
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={`text-xs ${filterBy === 'this-year' ? 'bg-muted text-primary' : ''}`}
                onClick={() => handleFilter('this-year')}
              >
                Quest'anno
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger 
                  className={`text-xs ${filterBy === 'by-cemetery' ? 'bg-muted text-primary' : ''}`}
                >
                  <MapPin className="h-3.5 w-3.5 mr-2" />
                  Filtra per cimitero
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="bg-background border-muted-foreground/20 text-xs">
                    <DeceasedCemeteryOptions onCemeterySelect={handleCemeterySelect} selectedCemetery={selectedCemetery} />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="w-full max-w-none px-1 pb-8">
        <DeceasedList 
          searchTerm={searchTerm} 
          sortBy={sortBy} 
          filterBy={filterBy} 
          selectedCemetery={selectedCemetery} 
        />
      </div>
    </div>
  );
};

// This component loads and displays available cemeteries for filtering
const DeceasedCemeteryOptions = ({ 
  onCemeterySelect, 
  selectedCemetery 
}: { 
  onCemeterySelect: (name: string) => void,
  selectedCemetery: string | null 
}) => {
  const [cemeteries, setCemeteries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract unique cemetery names from the deceased list
    const fetchCemeteries = async () => {
      try {
        const { data, error } = await supabase
          .from('defunti')
          .select(`
            loculi (
              Blocco (
                Settore (
                  Cimitero (
                    Nome
                  )
                )
              )
            )
          `);

        if (error) {
          console.error("Error fetching cemeteries:", error);
          return;
        }

        // Extract and deduplicate cemetery names
        const cemeterySet = new Set<string>();
        
        data?.forEach(item => {
          const cemeteryName = item.loculi?.Blocco?.Settore?.Cimitero?.Nome;
          if (cemeteryName) {
            cemeterySet.add(cemeteryName);
          }
        });

        const uniqueCemeteries = Array.from(cemeterySet).sort();
        setCemeteries(uniqueCemeteries);
      } catch (error) {
        console.error("Error processing cemeteries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteries();
  }, []);

  if (loading) {
    return <DropdownMenuItem disabled>Caricamento cimiteri...</DropdownMenuItem>;
  }

  if (cemeteries.length === 0) {
    return <DropdownMenuItem disabled>Nessun cimitero disponibile</DropdownMenuItem>;
  }

  return (
    <>
      {cemeteries.map((cemetery) => (
        <DropdownMenuItem
          key={cemetery}
          className={selectedCemetery === cemetery ? 'bg-muted text-primary' : ''}
          onClick={() => onCemeterySelect(cemetery)}
        >
          {cemetery}
        </DropdownMenuItem>
      ))}
    </>
  );
};

export default Deceased;
