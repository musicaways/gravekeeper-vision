
import { useState, useEffect, useCallback } from "react";
import { DeceasedRecord } from "../../types/deceased";
import { fetchDeceased } from "./fetchDeceased";
import { createDebouncedSearch } from "./searchUtils";
import { UseDeceasedDataProps, UseDeceasedDataResult } from "./types";

export const useDeceasedData = ({ 
  searchTerm, 
  sortBy, 
  filterBy,
  selectedCemetery,
  page = 1,
  pageSize = 20
}: UseDeceasedDataProps): UseDeceasedDataResult => {
  const [loading, setLoading] = useState(true);
  const [deceased, setDeceased] = useState<DeceasedRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeSearch, setActiveSearch] = useState("");

  // Funzione ottimizzata per il caricamento dei defunti
  const loadDeceasedData = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const result = await fetchDeceased({
        searchQuery,
        sortBy,
        filterBy,
        selectedCemetery,
        page,
        pageSize
      });
      
      setDeceased(result.deceased);
      setTotalCount(result.totalCount);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, filterBy, selectedCemetery]);

  // Usare un termine di ricerca con debounce per evitare troppe chiamate
  const debouncedSearch = useCallback(
    createDebouncedSearch((term: string) => {
      setActiveSearch(term);
      loadDeceasedData(term);
    }),
    [loadDeceasedData]
  );

  // Effetto per avviare la ricerca quando cambiano i parametri
  useEffect(() => {
    console.log("Parameters changed in useDeceasedData", { 
      searchTerm, sortBy, filterBy, selectedCemetery 
    });
    
    // Avvia una nuova ricerca solo se il termine è cambiato
    if (searchTerm !== activeSearch) {
      debouncedSearch(searchTerm);
    } else {
      // Ricarica i dati quando cambiano altri parametri
      loadDeceasedData(searchTerm);
    }
  }, [searchTerm, sortBy, filterBy, selectedCemetery, page, pageSize, loadDeceasedData, debouncedSearch, activeSearch]);

  return {
    loading,
    filteredDeceased: deceased,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize)
  };
};
