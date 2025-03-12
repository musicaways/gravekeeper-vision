
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
  
  // Query in batch per i loculi
  // Convertiamo i loculiIds in numeri quando possibile
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
    
    return processWithLoculi(defuntiData, loculiData, selectedCemetery, filterBy, sortBy);
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
      loculiMap.set(loculo.id.toString(), loculo);
    });
  }
  
  // Associa i dati del loculo ai defunti
  let processedData = defuntiData.map(defunto => {
    const loculoId = defunto.id_loculo;
    let loculo = null;
    
    // Tenta di trovare il loculo con diverse strategie
    if (loculoId) {
      // Prova prima come stringa
      loculo = loculiMap.get(loculoId.toString());
      
      // Se non trovato, prova a convertire in numero
      if (!loculo && typeof loculoId === 'string') {
        const numId = parseInt(loculoId, 10);
        if (!isNaN(numId)) {
          loculo = loculiMap.get(numId.toString());
        }
      }
    }
    
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
  
  // Aggiungiamo log per debugging
  console.log("Numero totale defunti prima del filtro:", processedData.length);
  console.log("Filtro cimitero selezionato:", selectedCemetery);
  console.log("Tipo filtro:", filterBy);
  
  // Filtra per cimitero se richiesto
  if (selectedCemetery && filterBy === 'by-cemetery') {
    console.log("Applicazione filtro per cimitero:", selectedCemetery);
    
    const filteredData = processedData.filter(defunto => 
      defunto.cimitero_nome === selectedCemetery
    );
    
    console.log("Numero defunti dopo filtro cimitero:", filteredData.length);
    processedData = filteredData;
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

