
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
  // Se non ci sono dati, termina qui
  if (!defuntiData || defuntiData.length === 0) {
    return [];
  }
  
  // Raccogli tutti gli ID dei loculi per una query in batch
  const loculiIds = defuntiData.map(d => d.id_loculo).filter(Boolean);
  
  // Se non ci sono loculi, saltare la query relativa
  if (loculiIds.length === 0) {
    return mapDeceasedWithoutLoculi(defuntiData);
  }
  
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
    return mapDeceasedWithoutLoculi(defuntiData);
  }
  
  try {
    console.log("Fetching loculo data for IDs:", numericLoculiIds);
    
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
      console.log("Found loculi data:", loculiData.length, "records");
      console.log("Sample loculo data:", loculiData[0]);
    } else {
      console.log("No loculi data found for the given IDs");
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
      // Assicuriamoci che l'ID sia sempre una stringa per la coerenza nelle ricerche
      loculiMap.set(loculo.id.toString(), loculo);
    });
  }
  
  // Log the entire loculiMap to debug
  console.log("Loculi map size:", loculiMap.size);
  
  // Associa i dati del loculo ai defunti e crea i record completi
  let processedData = defuntiData.map(defunto => {
    const loculoId = defunto.id_loculo;
    let loculo = null;
    
    // Tenta di trovare il loculo con diverse strategie
    if (loculoId) {
      // Prima prova come stringa
      const loculoIdStr = loculoId.toString();
      loculo = loculiMap.get(loculoIdStr);
      
      // Se non trovato, prova a convertire in numero
      if (!loculo && typeof loculoId === 'string') {
        const numId = parseInt(loculoId, 10);
        if (!isNaN(numId)) {
          loculo = loculiMap.get(numId.toString());
        }
      }
      
      // Log per debugging
      if (!loculo) {
        console.log(`No loculo found for ID: ${loculoId} (${typeof loculoId})`);
      }
    }
    
    // Estrai il nome del cimitero se disponibile
    const cemeteryName = loculo?.Blocco?.Settore?.Cimitero?.Nome || null;
    
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
      settore_nome: loculo?.Blocco?.Settore?.Nome || null,
      blocco_nome: loculo?.Blocco?.Nome || null,
      loculi: loculo // Aggiungiamo l'oggetto loculo completo
    } as DeceasedRecord;
  });
  
  // Aggiungiamo log dettagliati per debugging
  const beforeFilterCount = processedData.length;
  console.log("Numero totale defunti prima del filtro cimitero:", beforeFilterCount);
  console.log("Filtro cimitero selezionato:", selectedCemetery);
  console.log("Tipo filtro:", filterBy);
  
  if (selectedCemetery && (filterBy === 'by-cemetery' || filterBy === 'all')) {
    // Logging per debugging: controlla quanti record hanno questo cimitero
    const recordsWithCemetery = processedData.filter(d => d.cimitero_nome === selectedCemetery);
    console.log(`Trovati ${recordsWithCemetery.length} defunti nel cimitero ${selectedCemetery}`);
    
    // Applica il filtro per cimitero
    console.log("Applicazione filtro per cimitero:", selectedCemetery);
    processedData = processedData.filter(defunto => {
      const matches = defunto.cimitero_nome === selectedCemetery;
      // Per debugging di ogni record
      if (defunto.cimitero_nome) {
        console.log(`Record ${defunto.id}: cimitero '${defunto.cimitero_nome}' matches '${selectedCemetery}'? ${matches}`);
      }
      return matches;
    });
    
    console.log("Numero defunti dopo filtro cimitero:", processedData.length);
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
