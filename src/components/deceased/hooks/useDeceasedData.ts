
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DeceasedRecord } from "../types/deceased";
import { debounce } from "@/lib/utils";
import { 
  buildDeceasedQuery, 
  applySorting, 
  applyPagination,
  processDeceasedData 
} from "./deceased-query";

interface UseDeceasedDataProps {
  searchTerm: string;
  sortBy: string;
  filterBy: string;
  selectedCemetery: string | null;
  selectedCemeteryId?: number | null;
  page?: number;
  pageSize?: number;
}

export const useDeceasedData = ({ 
  searchTerm, 
  sortBy, 
  filterBy,
  selectedCemetery,
  selectedCemeteryId = null,
  page = 1,
  pageSize = 20
}: UseDeceasedDataProps) => {
  const [loading, setLoading] = useState(true);
  const [deceased, setDeceased] = useState<DeceasedRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeSearch, setActiveSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Funzione ottimizzata per il caricamento dei defunti
  const fetchDeceased = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching deceased with params:", { 
        searchQuery, sortBy, filterBy, selectedCemetery, selectedCemeteryId, page, pageSize 
      });
      
      // Handle direct cemetery filtering if an ID is provided
      let query;
      if (filterBy === 'by-cemetery' && selectedCemeteryId) {
        // Filtering will be done directly in the query if we have a cemetery ID
        query = buildDeceasedQuery(supabase, filterBy, searchQuery, selectedCemeteryId);
      } else {
        // Regular query without direct cemetery filtering
        query = buildDeceasedQuery(supabase, filterBy, searchQuery);
      }
      
      // Applica ordinamento
      query = applySorting(query, sortBy);
      
      // Applica paginazione
      query = applyPagination(query, page, pageSize);
      
      // Esegui la query
      const { data: defuntiData, error: defuntiError, count } = await query;

      if (defuntiError) {
        console.error("Error fetching deceased data:", defuntiError);
        setError("Errore nel recupero dei dati: " + defuntiError.message);
        setDeceased([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      // Salva il conteggio totale
      if (count !== null) {
        setTotalCount(count);
      }

      // Debug: controlla i dati grezzi dei defunti
      console.log(`Recovered ${defuntiData?.length || 0} deceased records from database`);
      
      if (!defuntiData || defuntiData.length === 0) {
        setDeceased([]);
        setLoading(false);
        return;
      }
      
      // Processa i dati e associa le informazioni del loculo
      const processedData = await processDeceasedData(
        supabase,
        defuntiData || [],
        selectedCemetery,
        selectedCemeteryId,
        filterBy,
        sortBy
      );
      
      console.log(`After processing: ${processedData.length} deceased records to display`);
      
      setDeceased(processedData);
    } catch (error) {
      console.error("Failed to fetch deceased:", error);
      setError("Errore imprevisto: " + (error instanceof Error ? error.message : String(error)));
      setDeceased([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, filterBy, selectedCemetery, selectedCemeteryId]);

  // Usare un termine di ricerca con debounce per evitare troppe chiamate
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setActiveSearch(term);
      fetchDeceased(term);
    }, 500),
    [fetchDeceased]
  );

  // Effetto per avviare la ricerca quando cambiano i parametri
  useEffect(() => {
    console.log("Parameters changed in useDeceasedData", { 
      searchTerm, sortBy, filterBy, selectedCemetery, selectedCemeteryId 
    });
    
    // Avvia una nuova ricerca solo se il termine è cambiato
    if (searchTerm !== activeSearch) {
      debouncedSearch(searchTerm);
    } else {
      // Ricarica i dati quando cambiano altri parametri
      fetchDeceased(searchTerm);
    }
  }, [searchTerm, sortBy, filterBy, selectedCemetery, selectedCemeteryId, page, pageSize, fetchDeceased, debouncedSearch, activeSearch]);

  return {
    loading,
    filteredDeceased: deceased,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
    error
  };
};
