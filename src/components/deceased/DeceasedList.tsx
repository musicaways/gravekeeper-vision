
import React from "react";
import { useDeceasedData } from "./hooks/useDeceasedData";
import DeceasedListItem from "./DeceasedListItem";
import DeceasedEmptyState from "./DeceasedEmptyState";
import DeceasedLoadingSkeleton from "./DeceasedLoadingSkeleton";
import { DeceasedListProps } from "./types/deceased";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

const DeceasedList: React.FC<DeceasedListProps> = ({ 
  searchTerm, 
  sortBy, 
  filterBy,
  selectedCemetery = null,
  selectedCemeteryId = null
}) => {
  const [page, setPage] = React.useState(1);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const pageSize = isMobile ? 10 : 20; // Smaller page size on mobile
  
  const { loading, filteredDeceased, totalCount, totalPages, error } = useDeceasedData({
    searchTerm,
    sortBy,
    filterBy,
    selectedCemetery,
    selectedCemeteryId,
    page,
    pageSize
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show toast for filtering errors
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Errore",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Reset to page 1 when filter/sort options change
  React.useEffect(() => {
    setPage(1);
  }, [sortBy, filterBy, selectedCemetery, selectedCemeteryId, searchTerm]);

  if (loading && page === 1) {
    return <DeceasedLoadingSkeleton />;
  }

  if ((filteredDeceased.length === 0 && !loading) || error) {
    return (
      <DeceasedEmptyState 
        searchTerm={searchTerm} 
        cemeteryName={selectedCemetery}
        error={error}
        onClear={() => {}} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className={`grid gap-4 w-full px-1 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredDeceased.map((deceased) => (
          <DeceasedListItem key={deceased.id} deceased={deceased} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 pb-8">
          <Pagination>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || loading}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-sm mx-2">
              {isMobile ? (
                <>{page}/{totalPages}</>
              ) : (
                <>Pagina {page} di {totalPages} ({totalCount} risultati)</>
              )}
            </span>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              className="ml-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Pagination>
        </div>
      )}
      
      {loading && page > 1 && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-pulse text-muted-foreground">Caricamento...</div>
        </div>
      )}
    </div>
  );
};

export default DeceasedList;
