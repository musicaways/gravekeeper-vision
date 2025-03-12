
import { supabase } from "@/integrations/supabase/client";
import { DeceasedRecord } from "../../types/deceased";
import { 
  buildDeceasedQuery, 
  applySorting, 
  applyPagination
} from "../deceased-query";

interface FetchDeceasedParams {
  searchQuery: string;
  sortBy: string;
  filterBy: string;
  selectedCemetery: string | null;
  page: number;
  pageSize: number;
}

interface FetchDeceasedResult {
  deceased: DeceasedRecord[];
  totalCount: number;
}

export const fetchDeceased = async ({
  searchQuery,
  sortBy,
  filterBy,
  selectedCemetery,
  page,
  pageSize
}: FetchDeceasedParams): Promise<FetchDeceasedResult> => {
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
      return { deceased: [], totalCount: 0 };
    }

    // Debug: controlla i dati grezzi dei defunti
    console.log(`Recovered ${defuntiData?.length || 0} deceased records from database`);
    
    // Inizializza i dati processati
    let processedData = defuntiData ? defuntiData.map((defunto: any) => {
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
        loculo_numero: null,
        loculo_fila: null,
        cimitero_nome: null,
        settore_nome: null,
        blocco_nome: null,
        loculi: null
      } as DeceasedRecord;
    }) : [];
    
    console.log("Initial processed data:", processedData.slice(0, 2));
    
    // Se ci sono defunti con id_loculo, dobbiamo fare una query separata per i loculi
    const loculiIds = processedData
      .map(d => d.id_loculo)
      .filter(Boolean);
    
    console.log("Loculo IDs found:", loculiIds.length);
    
    if (loculiIds.length > 0) {
      console.log("Fetching loculo data for ids:", loculiIds.slice(0, 5));
      
      // Ottieni informazioni sui cimiteri attraverso la gerarchia loculo -> blocco -> settore -> cimitero
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
        `);
        
      if (loculiError) {
        console.error("Error fetching loculi data:", loculiError);
      } else if (loculiData) {
        console.log(`Found ${loculiData.length} loculi records`);
        
        // Create a map for quick lookup
        const loculiMap = new Map();
        loculiData.forEach(loculo => {
          loculiMap.set(String(loculo.id), loculo);
        });
        
        // For debugging: log all the cemetery names found in the data
        const cemeteries = new Set();
        loculiData.forEach(loculo => {
          const cemeteryName = loculo?.Blocco?.Settore?.Cimitero?.Nome;
          if (cemeteryName) cemeteries.add(cemeteryName);
        });
        console.log("Available cemeteries in data:", Array.from(cemeteries));
        
        // Enhance deceased data with loculo information
        processedData = processedData.map(defunto => {
          if (!defunto.id_loculo) return defunto;
          
          const loculo = loculiMap.get(String(defunto.id_loculo));
          if (loculo) {
            const cemeteryName = loculo?.Blocco?.Settore?.Cimitero?.Nome;
            
            return {
              ...defunto,
              loculo_numero: loculo.Numero,
              loculo_fila: loculo.Fila,
              cimitero_nome: cemeteryName,
              settore_nome: loculo?.Blocco?.Settore?.Nome,
              blocco_nome: loculo?.Blocco?.Nome,
              loculi: loculo
            };
          }
          return defunto;
        });
        
        console.log("Enhanced data sample:", processedData.slice(0, 2));
      }
    }
    
    // Filtra per cimitero se selezionato
    if (selectedCemetery && selectedCemetery.trim() !== '') {
      console.log("Filtering by cemetery:", selectedCemetery);
      
      const lowerCaseCemetery = selectedCemetery.toLowerCase().trim();
      
      // Apply case-insensitive cemetery filter
      const beforeFilterCount = processedData.length;
      processedData = processedData.filter(defunto => {
        if (!defunto.cimitero_nome) return false;
        
        const defuntoCemetery = defunto.cimitero_nome.toLowerCase().trim();
        const match = defuntoCemetery.includes(lowerCaseCemetery) || 
                       lowerCaseCemetery.includes(defuntoCemetery);
        
        return match;
      });
      
      console.log(`After cemetery filter: ${processedData.length}/${beforeFilterCount} records remain`);
    }
    
    console.log(`Final set: ${processedData.length} deceased records to display`);
    
    return {
      deceased: processedData,
      totalCount: count !== null ? count : processedData.length
    };
  } catch (error) {
    console.error("Failed to fetch deceased:", error);
    return { deceased: [], totalCount: 0 };
  }
};
