
import { supabase } from "@/integrations/supabase/client";
import { 
  Loculo, 
  LoculoDatabaseLowercase, 
  convertDatabaseToLoculo 
} from "@/components/block/loculi/types";

/**
 * Fetches loculi data from the Loculo (uppercase) table
 */
export async function fetchLoculiFromUppercaseTable(blockId: number) {
  console.log(`Tentativo di recupero loculi dalla tabella 'Loculo' con blockId: ${blockId}`);
  
  const { data, error } = await supabase
    .from('Loculo')
    .select(`
      Id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba,
      Defunti:Defunto(Id, Nominativo, DataNascita, DataDecesso, Sesso)
    `)
    .eq('IdBlocco', blockId);
    
  if (error) {
    console.error("Errore nel recupero dalla tabella 'Loculo':", error);
  } else {
    console.log(`Trovati ${data?.length || 0} loculi nella tabella 'Loculo' per blockId ${blockId}`);
    if (data && data.length > 0) {
      console.log("Esempio di loculo trovato (Loculo):", data[0]);
    }
  }
  
  return { data, error };
}

/**
 * Fetches loculi data from the loculi (lowercase) table
 */
export async function fetchLoculiFromLowercaseTable(blockId: number) {
  console.log(`Tentativo di recupero loculi dalla tabella 'loculi' con blockId: ${blockId}`);
  
  // Prova prima con il campo in maiuscolo (come dovrebbe essere dopo la migrazione)
  const { data, error } = await supabase
    .from('loculi')
    .select(`
      id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba, FilaDaAlto, 
      NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias,
      defunti(id, nominativo, data_nascita, data_decesso, sesso, annotazioni)
    `)
    .eq('IdBlocco', blockId);
  
  if (error) {
    console.error("Errore nel recupero dalla tabella 'loculi':", error);
  } else {
    console.log(`Trovati ${data?.length || 0} loculi nella tabella 'loculi' per blockId ${blockId}`);
    if (data && data.length > 0) {
      console.log("Esempio di loculo trovato (loculi):", data[0]);
    }
  }
    
  return { data, error };
}

/**
 * Searches for defunti by name in the Defunto (uppercase) table
 */
export async function searchDefuntiInUppercaseTable(blockId: number, searchTerm: string) {
  const { data, error } = await supabase
    .from('Defunto')
    .select(`
      Id, Nominativo, DataNascita, DataDecesso, Sesso,
      Loculo!inner(Id, Numero, Fila, IdBlocco)
    `)
    .eq('Loculo.IdBlocco', blockId)
    .ilike('Nominativo', `%${searchTerm}%`);
    
  return { data, error };
}

/**
 * Searches for defunti by name in the defunti (lowercase) table
 */
export async function searchDefuntiInLowercaseTable(blockId: number, searchTerm: string) {
  const { data, error } = await supabase
    .from('defunti')
    .select(`
      id, nominativo, data_nascita, data_decesso, sesso, annotazioni,
      loculi!inner(id, Numero, Fila, IdBlocco)
    `)
    .eq('loculi.IdBlocco', blockId)
    .ilike('nominativo', `%${searchTerm}%`);
    
  return { data, error };
}

/**
 * Filters unique loculi that don't already exist in the current results
 */
export function filterUniqueLoculi(newLoculi: any[], currentLoculi: Loculo[]): any[] {
  return newLoculi.filter(
    newLoculo => !currentLoculi.some(existingLoculo => {
      // Handle both uppercase and lowercase ID fields
      const existingId = typeof existingLoculo.Id === 'number' 
        ? existingLoculo.Id 
        : typeof existingLoculo.Id === 'string'
          ? parseInt(existingLoculo.Id)
          : -1;
        
      const newId = typeof newLoculo.Id === 'number' 
        ? newLoculo.Id 
        : typeof newLoculo.Id === 'string'
          ? parseInt(newLoculo.Id)
          : typeof newLoculo.id === 'number'
            ? newLoculo.id
            : typeof newLoculo.id === 'string'
              ? parseInt(newLoculo.id)
              : -2;
        
      return existingId === newId;
    })
  );
}

/**
 * Funzione di debug per ottenere informazioni sulle tabelle
 */
export async function getTableInfo(tableName: string) {
  console.log(`Verificando struttura della tabella ${tableName}`);
  
  try {
    // Per utilizzare un nome di tabella dinamico, dobbiamo verificare prima
    const validTableNames = ['loculi', 'Loculo', 'defunti', 'Defunto'];
    
    if (!validTableNames.includes(tableName)) {
      console.error(`Nome tabella non supportato: ${tableName}`);
      return { columns: [], error: `Nome tabella non supportato: ${tableName}` };
    }
    
    // Esegui una query per ottenere un singolo record
    let data, error;
    
    if (tableName === 'loculi') {
      const result = await supabase.from('loculi').select('id, Numero, Fila, IdBlocco').limit(1);
      data = result.data;
      error = result.error;
    } else if (tableName === 'Loculo') {
      const result = await supabase.from('Loculo').select('Id, Numero, Fila, IdBlocco').limit(1);
      data = result.data;
      error = result.error;
    } else if (tableName === 'defunti') {
      const result = await supabase.from('defunti').select('id, nominativo, data_nascita, data_decesso, sesso').limit(1);
      data = result.data;
      error = result.error;
    } else if (tableName === 'Defunto') {
      const result = await supabase.from('Defunto').select('Id, Nominativo, DataNascita, DataDecesso, Sesso').limit(1);
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error(`Errore nella lettura della tabella ${tableName}:`, error);
      return { columns: [], error: error.message };
    }
    
    if (!data || data.length === 0) {
      console.log(`Nessun dato trovato nella tabella ${tableName}`);
      return { columns: [], error: null };
    }
    
    // Ottieni le colonne dal primo record
    const columns = Object.keys(data[0]);
    console.log(`Colonne nella tabella ${tableName}:`, columns);
    
    return { columns, error: null };
  } catch (err: any) {
    console.error(`Eccezione nel verificare la tabella ${tableName}:`, err);
    return { columns: [], error: err.message };
  }
}
