
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
    
    const beforeFilterCount = processedData.length;
    
    // IMPROVED: Approccio più flessibile per il matching dei nomi dei cimiteri
    processedData = processedData.filter(defunto => {
      if (!defunto.cimitero_nome) return false;
      
      // 1. Normalizza i nomi (lowercase, trim)
      const selectedCemeteryNormalized = selectedCemetery.toLowerCase().trim();
      const cemeteryNameNormalized = defunto.cimitero_nome.toLowerCase().trim();
      
      // Log per debug
      console.log(`Cemetery comparison: [${cemeteryNameNormalized}] vs [${selectedCemeteryNormalized}]`);
      
      // 2. Prova diversi tipi di corrispondenza
      
      // A. Corrispondenza esatta (case-insensitive)
      if (cemeteryNameNormalized === selectedCemeteryNormalized) {
        console.log(`Exact match found for ${defunto.id}: ${defunto.cimitero_nome}`);
        return true;
      }
      
      // B. Corrispondenza in entrambe le direzioni (uno è contenuto nell'altro)
      if (cemeteryNameNormalized.includes(selectedCemeteryNormalized) || 
          selectedCemeteryNormalized.includes(cemeteryNameNormalized)) {
        console.log(`Partial match found for ${defunto.id}: ${defunto.cimitero_nome}`);
        return true;
      }
      
      // C. Confronto semplificato (rimuovi spazi e caratteri speciali)
      const simplifiedSelected = selectedCemeteryNormalized.replace(/[^a-z0-9]/gi, '');
      const simplifiedName = cemeteryNameNormalized.replace(/[^a-z0-9]/gi, '');
      
      if (simplifiedName.includes(simplifiedSelected) || simplifiedSelected.includes(simplifiedName)) {
        console.log(`Simplified match found for ${defunto.id}: ${defunto.cimitero_nome}`);
        return true;
      }
      
      // D. Verifica per ID del cimitero (se disponibile)
      if (defunto.cimitero_id && selectedCemetery.includes(String(defunto.cimitero_id))) {
        console.log(`ID match found for ${defunto.id}: ${defunto.cimitero_id}`);
        return true;
      }
      
      return false;
    });
    
    console.log(`processWithLoculi - Records after cemetery filter: ${processedData.length}/${beforeFilterCount}`);
    
    // Se non abbiamo trovato corrispondenze, proviamo una ricerca per parole
    if (processedData.length === 0 && recordsWithCemeteryInfo.length > 0) {
      console.log(`No matches found with strict filtering, trying word-by-word search`);
      
      // Dividi il nome del cimitero in parole e cerca corrispondenze parziali
      const words = selectedCemetery.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      
      if (words.length > 0) {
        console.log(`Trying word-by-word matching with: ${words.join(', ')}`);
        
        processedData = recordsWithCemeteryInfo.filter(defunto => {
          const cemeteryNameLower = defunto.cimitero_nome!.toLowerCase();
          
          // Cerca corrispondenze per qualsiasi parola
          for (const word of words) {
            if (cemeteryNameLower.includes(word)) {
              console.log(`Word match found for ${defunto.id}: word "${word}" in "${defunto.cimitero_nome}"`);
              return true;
            }
          }
          
          return false;
        });
        
        console.log(`Found ${processedData.length} records with word-by-word search`);
      }
    }
    
    // Ultima risorsa: confronto con Levenshtein distance o algoritmo simile
    if (processedData.length === 0 && recordsWithCemeteryInfo.length > 0 && selectedCemetery.length > 3) {
      console.log(`Still no matches, attempting to use similarity matching`);
      
      // Implementazione semplice di un confronto di similarità
      processedData = recordsWithCemeteryInfo.filter(defunto => {
        const cemeteryName = defunto.cimitero_nome!;
        
        // Verifica se le prime 3 lettere corrispondono
        if (cemeteryName.substring(0, 3).toLowerCase() === selectedCemetery.substring(0, 3).toLowerCase()) {
          console.log(`Prefix match found for ${defunto.id}: ${defunto.cimitero_nome}`);
          return true;
        }
        
        return false;
      });
      
      console.log(`Found ${processedData.length} records with similarity matching`);
    }
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

