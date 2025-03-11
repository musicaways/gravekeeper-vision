
import { supabase } from "@/integrations/supabase/client";

/**
 * Funzione per recuperare i metadata di una tabella
 */
export async function getTableMetadata(tableName: string) {
  try {
    // Check if it's a valid table name
    const validTableNames = ['Loculo', 'Defunto', 'Blocco', 'Settore', 'Cimitero'];
    
    if (!validTableNames.includes(tableName)) {
      return { columns: [], error: `Nome tabella non supportato: ${tableName}` };
    }
    
    // Usa la query diretta al database
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
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
