
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DeceasedRecord } from "../types/deceased";
import { debounce } from "@/lib/utils";
import { 
  buildDeceasedQuery, 
  applySorting, 
  applyPagination
} from "./deceased-query";

interface UseDeceasedDataProps {
  searchTerm: string;
  sortBy: string;
  filterBy: string;
  selectedCemetery: string | null;
  page?: number;
  pageSize?: number;
}

export const useDeceasedData = ({ 
  searchTerm, 
  sortBy, 
  filterBy,
  selectedCemetery,
  page = 1,
  pageSize = 20
}: UseDeceasedDataProps) => {
  const [loading, setLoading] = useState(true);
  const [deceased, setDeceased] = useState<DeceasedRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeSearch, setActiveSearch] = useState("");

  // Funzione ottimizzata per il caricamento dei defunti
  const fetchDeceased = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      console.log("Fetching deceased with params:", { 
        searchQuery, sortBy, filterBy, selectedCemetery, page, pageSize 
      });
      
      // Costruisci la query con i filtri necessari
      let query = buildDeceasedQuery(supabase, filterBy, searchQuery, selectedCemetery);
      
      // Applica ordinamento
      query = applySorting(query, sortBy);
      
      // Applica paginazione
      query = applyPagination(query, page, pageSize);
      
      // Esegui la query
      const { data: defuntiData, error: defuntiError, count } = await query;

      if (defuntiError) {
        console.error("Error fetching deceased data:", defuntiError);
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
      
      // Converte i dati nel formato DeceasedRecord
      const processedData = defuntiData ? defuntiData.map((defunto: any) => {
        const loculo = defunto.loculo;
        const blocco = loculo?.Blocco;
        const settore = blocco?.Settore;
        const cimitero = settore?.Cimitero;
        
        return {
          id: defunto.id,
          nominativo: defunto.nominativo,
          data_nascita: defunto.data_nascita,
          data_decesso: defunto.data_decesso,
          eta: defunto.eta,
          sesso: defunto.sesso,
          annotazioni: defunto.annotazioni,
          stato_defunto: defunto.stato_defunto,
          id_loculo: defunto.id_loculo,
          loculo_numero: loculo?.Numero || null,
          loculo_fila: loculo?.Fila || null,
          cimitero_nome: cimitero?.Nome || null,
          settore_nome: settore?.Nome || null,
          blocco_nome: blocco?.Nome || null,
          loculi: loculo
        } as DeceasedRecord;
      }) : [];
      
      console.log(`After processing: ${processedData.length} deceased records to display`);
      if (selectedCemetery) {
        console.log("Cemetery filter results:", processedData.map(d => d.cimitero_nome));
      }
      
      setDeceased(processedData);
    } catch (error) {
      console.error("Failed to fetch deceased:", error);
      setDeceased([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, filterBy, selectedCemetery]);

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
      searchTerm, sortBy, filterBy, selectedCemetery 
    });
    
    // Avvia una nuova ricerca solo se il termine è cambiato
    if (searchTerm !== activeSearch) {
      debouncedSearch(searchTerm);
    } else {
      // Ricarica i dati quando cambiano altri parametri
      fetchDeceased(searchTerm);
    }
  }, [searchTerm, sortBy, filterBy, selectedCemetery, page, pageSize, fetchDeceased, debouncedSearch, activeSearch]);

  return {
    loading,
    filteredDeceased: deceased,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize)
  };
};
