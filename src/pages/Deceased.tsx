
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
  const isMobile = useIsMobile();

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
                onFilterChange={handleFilter} 
                onCemeterySelect={handleCemeterySelect} 
              />
            )}
          </div>
          
          {!isMobile && (
            <FilterDropdown 
              filterBy={filterBy} 
              selectedCemetery={selectedCemetery} 
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
        />
      </div>
    </div>
  );
};

export default Deceased;
