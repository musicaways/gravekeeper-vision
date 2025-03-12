
import { SupabaseClient } from '@supabase/supabase-js';
import { DeceasedRecord } from '../../types/deceased';

/**
 * Process deceased data by fetching loculo information and joining it with deceased data
 */
export const processDeceasedData = async (
  supabase: SupabaseClient,
  defuntiData: any[],
  selectedCemetery: string | null,
  filterBy: string,
  sortBy: string
) => {
  console.log(`processDeceasedData - Starting with ${defuntiData.length} records`, 
              { selectedCemetery, filterBy });
  
  // Se non ci sono dati, termina qui
  if (!defuntiData || defuntiData.length === 0) {
    console.log("processDeceasedData - No input data, returning empty array");
    return [];
  }
  
  // Raccogli tutti gli ID dei loculi per una query in batch
  const loculiIds = defuntiData.map(d => d.id_loculo).filter(Boolean);
  
  // Se non ci sono loculi, saltare la query relativa
  if (loculiIds.length === 0) {
    console.log("processDeceasedData - No loculo IDs found, mapping without loculo data");
    return mapDeceasedWithoutLoculi(defuntiData);
  }
  
  console.log("processDeceasedData - Loculo IDs to process:", loculiIds);
  
  // Convertiamo i loculiIds in numeri quando possibile per la query
  const numericLoculiIds = loculiIds
    .map(id => {
      // Se è già un numero, lo restituiamo com'è
      if (typeof id === 'number') return id;
      
      // Se è una stringa, proviamo a convertirla in numero
      if (typeof id === 'string') {
        const numId = parseInt(id, 10);
        return !isNaN(numId) ? numId : null;
      }
      
      return null;
    })
    .filter(id => id !== null);
  
  // Se non abbiamo ID validi dopo la conversione, restituiamo i dati senza info loculo
  if (numericLoculiIds.length === 0) {
    console.log("processDeceasedData - No valid numeric IDs after conversion, mapping without loculo data");
    return mapDeceasedWithoutLoculi(defuntiData);
  }
  
  try {
    console.log("processDeceasedData - Fetching loculo data for IDs:", numericLoculiIds);
    
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
      .in('id', numericLoculiIds);
    
    if (loculiError) {
      console.error("Error fetching loculi:", loculiError);
      return mapDeceasedWithoutLoculi(defuntiData);
    }
    
    if (loculiData && loculiData.length > 0) {
      console.log(`processDeceasedData - Found ${loculiData.length} loculo records`);
      
      // Debug - Log sample data structure 
      console.log("processDeceasedData - Sample loculo data structure:", JSON.stringify(loculiData[0], null, 2));
    } else {
      console.log("processDeceasedData - No loculi data found for the given IDs");
    }
    
    // Processa i dati con le informazioni dei loculi
    let processedData = processWithLoculi(defuntiData, loculiData, selectedCemetery, filterBy, sortBy);
    
    return processedData;
  } catch (error) {
    console.error("Unexpected error in processDeceasedData:", error);
    return mapDeceasedWithoutLoculi(defuntiData);
  }
};

/**
 * Map deceased data without loculo information
 */
const mapDeceasedWithoutLoculi = (defuntiData: any[]): DeceasedRecord[] => {
  return defuntiData.map(defunto => ({
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
};

/**
 * Process deceased data with loculo information
 */
const processWithLoculi = (
  defuntiData: any[],
  loculiData: any[],
  selectedCemetery: string | null,
  filterBy: string,
  sortBy: string
): DeceasedRecord[] => {
  // Crea un map per un accesso rapido ai dati del loculo
  const loculiMap = new Map();
  if (loculiData) {
    loculiData.forEach(loculo => {
      // Ensure ID is always a string for consistent lookups
      loculiMap.set(String(loculo.id), loculo);
    });
  }
  
  console.log("processWithLoculi - Loculi map size:", loculiMap.size);

  // Log the cemeteries present in the data for debugging
  const cemeteries = new Set();
  loculiData.forEach(loculo => {
    const cemeteryName = loculo?.Blocco?.Settore?.Cimitero?.Nome;
    if (cemeteryName) cemeteries.add(cemeteryName);
  });
  console.log("processWithLoculi - Cemeteries found in data:", Array.from(cemeteries));
  
  if (selectedCemetery) {
    console.log(`processWithLoculi - Looking for cemetery: "${selectedCemetery}"`);
  }
  
  // Associa i dati del loculo ai defunti e crea i record completi
  let processedData = defuntiData.map(defunto => {
    const loculoId = defunto.id_loculo;
    let loculo = null;
    
    // Tenta di trovare il loculo con diverse strategie
    if (loculoId) {
      // Try as string first
      loculo = loculiMap.get(String(loculoId));
      
      if (!loculo) {
        console.log(`No loculo found for ID: ${loculoId} (${typeof loculoId}), trying alternate methods`);
        
        // Try with parsed integer
        if (typeof loculoId === 'string') {
          const numId = parseInt(loculoId, 10);
          if (!isNaN(numId)) {
            loculo = loculiMap.get(String(numId));
            if (loculo) {
              console.log(`Found loculo with numeric conversion: ${numId}`);
            }
          }
        }
      }
    }
    
    // Estrai il nome del cimitero se disponibile
    const cemeteryName = loculo?.Blocco?.Settore?.Cimitero?.Nome || null;
    const cemeteryId = loculo?.Blocco?.Settore?.Cimitero?.Id || null;
    
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
      cimitero_nome: cemeteryName,
      cimitero_id: cemeteryId,
      settore_nome: loculo?.Blocco?.Settore?.Nome || null,
      blocco_nome: loculo?.Blocco?.Nome || null,
      loculi: loculo // Aggiungiamo l'oggetto loculo completo
    } as DeceasedRecord;
  });
  
  // Per debugging: controlla quanti record hanno un cimitero associato
  const recordsWithCemeteryInfo = processedData.filter(d => d.cimitero_nome !== null);
  console.log(`processWithLoculi - Records with cemetery info: ${recordsWithCemeteryInfo.length}/${processedData.length}`);
  
  // Per debugging: controlla i cimiteri unici che abbiamo nei dati
  const uniqueCemeteries = new Set(processedData.map(d => d.cimitero_nome).filter(Boolean));
  console.log(`processWithLoculi - Unique cemeteries in processed data:`, Array.from(uniqueCemeteries));
  
  // Applica filtro per cimitero selezionato
  if (selectedCemetery) {
    console.log(`processWithLoculi - Applying cemetery filter for "${selectedCemetery}"`);
    
    // Miglioramento: supporto per corrispondenza parziale del nome del cimitero
    const beforeFilterCount = processedData.length;
    processedData = processedData.filter(defunto => {
      if (!defunto.cimitero_nome) return false;
      
      // Case insensitive e supporto per corrispondenza parziale
      const cemeteryNameLower = defunto.cimitero_nome.toLowerCase();
      const selectedCemeteryLower = selectedCemetery.toLowerCase();
      
      // Verifica se il nome selezionato è contenuto nel nome del cimitero o viceversa
      const isPartialMatch = 
        cemeteryNameLower.includes(selectedCemeteryLower) || 
        selectedCemeteryLower.includes(cemeteryNameLower);
      
      // Verifica corrispondenza esatta (case-insensitive)
      const isExactMatch = cemeteryNameLower === selectedCemeteryLower;
      
      // Utilizziamo sia la corrispondenza esatta che parziale
      const matches = isExactMatch || isPartialMatch;
      
      console.log(`Cemetery match check for '${defunto.cimitero_nome}' vs '${selectedCemetery}': ${matches} (${defunto.id})`);
      
      return matches;
    });
    
    console.log(`processWithLoculi - Records after cemetery filter: ${processedData.length}/${beforeFilterCount}`);
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
  
  return processedData;
};
