
import { supabase } from "@/integrations/supabase/client";

/**
 * Funzione per recuperare i metadata di una tabella
 */
export async function getTableMetadata(tableName: string) {
  try {
    // Check if it's a valid table name
    const validTableNames = ['Loculo', 'Defunto', 'defunti', 'Blocco', 'Settore', 'Cimitero'];
    
    if (!validTableNames.includes(tableName)) {
      return { columns: [], error: `Nome tabella non supportato: ${tableName}` };
    }
    
    // Usa la query diretta alla tabella specifica
    let result;
    
    if (tableName === 'Loculo') {
      result = await supabase.from('Loculo').select('*').limit(1);
    } else if (tableName === 'defunti') { 
      // Aggiunto supporto per la nuova tabella defunti
      result = await supabase.from('defunti').select('*').limit(1);
    } else {
      result = await supabase.from(tableName as any).select('*').limit(1);
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
