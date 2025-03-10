
import { supabase } from "@/integrations/supabase/client";

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
