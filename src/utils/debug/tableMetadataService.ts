
import { supabase } from "@/integrations/supabase/client";

/**
 * Funzione per recuperare i metadata di una tabella
 */
export async function getTableMetadata(tableName: string) {
  try {
    // Check if it's a valid table name
    const validTableNames = ['loculi', 'Loculo', 'defunti', 'Defunto'];
    
    if (!validTableNames.includes(tableName)) {
      return { columns: [], error: `Nome tabella non supportato: ${tableName}` };
    }
    
    // Get table data based on the table name
    let result;
    
    if (tableName === 'loculi') {
      result = await supabase.from('loculi').select('id, Numero, Fila, IdBlocco').limit(1);
    } else if (tableName === 'Loculo') {
      result = await supabase.from('Loculo').select('Id, Numero, Fila, IdBlocco').limit(1);
    } else if (tableName === 'defunti') {
      result = await supabase.from('defunti').select('id, nominativo, data_nascita, data_decesso').limit(1);
    } else if (tableName === 'Defunto') {
      result = await supabase.from('Defunto').select('Id, Nominativo, DataNascita, DataDecesso').limit(1);
    }
    
    if (!result) {
      return { columns: [], error: `Errore query tabella ${tableName}` };
    }
    
    const { data, error } = result;
        
    if (error) {
      console.error(`Errore nel recupero dei metadati per la tabella ${tableName}:`, error);
      return { columns: [], error: error.message };
    }
    
    if (!data || data.length === 0) {
      console.log(`Nessun dato trovato nella tabella ${tableName}`);
      return { columns: [], error: null };
    }
    
    // Estrai i nomi delle colonne
    const columns = Object.keys(data[0]);
    console.log(`Colonne nella tabella ${tableName}:`, columns);
    
    return { columns, error: null };
  } catch (err: any) {
    console.error(`Errore nel recupero dei metadati per la tabella ${tableName}:`, err);
    return { columns: [], error: err.message };
  }
}
