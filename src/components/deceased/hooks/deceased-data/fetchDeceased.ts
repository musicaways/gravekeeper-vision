
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
    
    // Se c'è un filtro per cimitero attivo, dobbiamo fare una query separata per i loculi
    if (selectedCemetery && selectedCemetery.trim() !== '' && processedData.length > 0) {
      console.log("Fetching cemetery data for selected cemetery:", selectedCemetery);
      
      // Ottieni tutti i loculi necessari
      const loculiIds = processedData
        .map(d => d.id_loculo)
        .filter(Boolean);
      
      if (loculiIds.length > 0) {
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
          
          // Filter by cemetery if selected
          if (selectedCemetery) {
            const lowerCaseCemetery = selectedCemetery.toLowerCase().trim();
            
            // Apply case-insensitive cemetery filter
            const beforeFilterCount = processedData.length;
            processedData = processedData.filter(defunto => {
              if (!defunto.cimitero_nome) return false;
              
              const defuntoCemetery = defunto.cimitero_nome.toLowerCase().trim();
              const match = defuntoCemetery.includes(lowerCaseCemetery) || 
                             lowerCaseCemetery.includes(defuntoCemetery);
              
              // Debug each record
              console.log(`Checking cemetery match for "${defunto.nominativo}": "${defuntoCemetery}" with "${lowerCaseCemetery}" => ${match}`);
              
              return match;
            });
            
            console.log(`After cemetery filter: ${processedData.length}/${beforeFilterCount} records remain`);
          }
        }
      }
    }
    
    console.log(`Final set: ${processedData.length} deceased records to display`);
    
    return {
      deceased: processedData,
      totalCount: count !== null ? count : 0
    };
  } catch (error) {
    console.error("Failed to fetch deceased:", error);
    return { deceased: [], totalCount: 0 };
  }
};
