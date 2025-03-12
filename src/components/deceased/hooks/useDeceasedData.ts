
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DeceasedRecord } from "../types/deceased";
import { debounce } from "@/lib/utils";

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
      // Calcola l'offset per la paginazione
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Costruisci la query di base
      let query = supabase
        .from('defunti')
        .select(`
          id,
          nominativo,
          data_nascita,
          data_decesso,
          eta,
          sesso,
          annotazioni,
          stato_defunto,
          id_loculo
        `, { count: 'exact' });

      // Applicare filtri
      if (filterBy === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('data_decesso', thirtyDaysAgo.toISOString().split('T')[0]);
      } else if (filterBy === 'this-year') {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
        query = query.gte('data_decesso', startOfYear);
      }

      // Applicare ricerca per nome, solo se il termine è valido
      if (searchQuery && searchQuery.trim() !== '') {
        query = query.ilike('nominativo', `%${searchQuery}%`);
      }
      
      // Applica ordinamento
      switch (sortBy) {
        case 'name-asc':
          query = query.order('nominativo', { ascending: true });
          break;
        case 'name-desc':
          query = query.order('nominativo', { ascending: false });
          break;
        case 'date-desc':
          query = query.order('data_decesso', { ascending: false, nullsFirst: false });
          break;
        case 'date-asc':
          query = query.order('data_decesso', { ascending: true, nullsFirst: false });
          break;
        // Gli ordinamenti per cimitero verranno applicati dopo
        default:
          query = query.order('nominativo', { ascending: true });
      }
      
      // Applica paginazione
      query = query.range(from, to);
      
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

      // Se non ci sono dati, termina qui
      if (!defuntiData || defuntiData.length === 0) {
        setDeceased([]);
        setLoading(false);
        return;
      }
      
      // Raccogli tutti gli ID dei loculi per una query in batch
      const loculiIds = defuntiData.map(d => d.id_loculo).filter(Boolean);
      
      // Se non ci sono loculi, saltare la query relativa
      if (loculiIds.length === 0) {
        const processedData = defuntiData.map(defunto => ({
          id: defunto.id,
          nominativo: defunto.nominativo,
          data_nascita: defunto.data_nascita,
          data_decesso: defunto.data_decesso,
          eta: defunto.eta,
          sesso: defunto.sesso,
          annotazioni: defunto.annotazioni,
          stato_defunto: defunto.stato_defunto,
          id_loculo: defunto.id_loculo,
          loculo_numero: null,
          loculo_fila: null,
          cimitero_nome: null,
          settore_nome: null,
          blocco_nome: null,
          loculi: null
        })) as DeceasedRecord[];
        
        setDeceased(processedData);
        setLoading(false);
        return;
      }
      
      // Query in batch per i loculi
      const { data: loculiData, error: loculiError } = await supabase
        .from('Loculo')
        .select(`
          id,
          Numero,
          Fila,
          Blocco:IdBlocco(
            Id,
            Nome,
            Settore:IdSettore(
              Id,
              Nome,
              Cimitero:IdCimitero(
                Id,
                Nome
              )
            )
          )
        `)
        .in('id', loculiIds);
      
      if (loculiError) {
        console.error("Error fetching loculi:", loculiError);
      }
      
      // Crea un map per un accesso rapido ai dati del loculo
      const loculiMap = new Map();
      if (loculiData) {
        loculiData.forEach(loculo => {
          loculiMap.set(loculo.id.toString(), loculo);
        });
      }
      
      // Associa i dati del loculo ai defunti
      let processedData = defuntiData.map(defunto => {
        const loculoId = defunto.id_loculo;
        const loculo = loculoId ? loculiMap.get(loculoId.toString()) : null;
        
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
          cimitero_nome: loculo?.Blocco?.Settore?.Cimitero?.Nome || null,
          settore_nome: loculo?.Blocco?.Settore?.Nome || null,
          blocco_nome: loculo?.Blocco?.Nome || null,
          loculi: loculo // Aggiungiamo l'oggetto loculo completo
        } as DeceasedRecord;
      });
      
      // Filtra per cimitero se richiesto
      if (selectedCemetery && filterBy === 'by-cemetery') {
        processedData = processedData.filter(defunto => 
          defunto.cimitero_nome === selectedCemetery
        );
      }
      
      // Ordinamento per cimitero dopo aver recuperato i dati completi
      if (sortBy === 'cemetery-asc') {
        processedData.sort((a, b) => {
          return (a.cimitero_nome || '').localeCompare(b.cimitero_nome || '');
        });
      } else if (sortBy === 'cemetery-desc') {
        processedData.sort((a, b) => {
          return (b.cimitero_nome || '').localeCompare(a.cimitero_nome || '');
        });
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
