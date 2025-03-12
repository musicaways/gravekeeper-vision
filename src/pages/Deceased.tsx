
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SortDropdown from "@/components/deceased/filters/SortDropdown";
import FilterDropdown from "@/components/deceased/filters/FilterDropdown";
import DeceasedList from "@/components/deceased/DeceasedList";
import { useIsMobile } from "@/hooks/use-mobile";

const Deceased = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || "";
  const [sortBy, setSortBy] = useState("name-asc"); // Default sort
  const [filterBy, setFilterBy] = useState("all"); // Default filter
  const [selectedCemetery, setSelectedCemetery] = useState<string | null>(null);
  const [selectedCemeteryId, setSelectedCemeteryId] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // Listen for search term changes in the URL
  useEffect(() => {
    // This is handled by the global search in Topbar.tsx
    // We just need to read the search parameter
  }, [location.search]);

  const handleSort = (sortType: string) => {
    console.log("Sort changed to:", sortType);
    setSortBy(sortType);
  };

  const handleFilter = (filterType: string) => {
    console.log("Filter type changed to:", filterType);
    setFilterBy(filterType);
    
    // Only reset cemetery selection when changing to a non-cemetery filter
    if (filterType !== 'by-cemetery' && selectedCemetery) {
      console.log("Resetting cemetery selection because filter changed to non-cemetery type");
      setSelectedCemetery(null);
      setSelectedCemeteryId(null);
    }
  };

  const handleCemeterySelect = (cemeteryName: string | null, cemeteryId?: number | null) => {
    console.log("Cemetery selection changed to:", cemeteryName, "ID:", cemeteryId);
    setSelectedCemetery(cemeteryName);
    setSelectedCemeteryId(cemeteryId || null);
    
    // If a cemetery is selected, always use the by-cemetery filter
    if (cemeteryName !== null && filterBy !== 'by-cemetery') {
      console.log("Setting filter to by-cemetery because a cemetery was selected");
      setFilterBy('by-cemetery');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full max-w-none px-1 py-2">
        <div className={`mb-3 ${isMobile ? 'flex flex-col gap-2' : 'flex gap-2'}`}>
          <div className={`${isMobile ? 'flex justify-between' : ''}`}>
            <SortDropdown 
              sortBy={sortBy} 
              onSortChange={handleSort} 
            />
            
            {isMobile && (
              <FilterDropdown 
                filterBy={filterBy} 
                selectedCemetery={selectedCemetery}
                selectedCemeteryId={selectedCemeteryId} 
                onFilterChange={handleFilter} 
                onCemeterySelect={handleCemeterySelect} 
              />
            )}
          </div>
          
          {!isMobile && (
            <FilterDropdown 
              filterBy={filterBy} 
              selectedCemetery={selectedCemetery}
              selectedCemeteryId={selectedCemeteryId} 
              onFilterChange={handleFilter} 
              onCemeterySelect={handleCemeterySelect} 
            />
          )}
        </div>
      </div>
      
      <div className="w-full max-w-none px-1 pb-8">
        <DeceasedList 
          searchTerm={searchTerm} 
          sortBy={sortBy} 
          filterBy={filterBy} 
          selectedCemetery={selectedCemetery}
          selectedCemeteryId={selectedCemeteryId}
        />
      </div>
    </div>
  );
};

export default Deceased;
