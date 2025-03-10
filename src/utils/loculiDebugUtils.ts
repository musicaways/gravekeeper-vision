
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Funzione di debug per verificare lo stato delle tabelle loculi e defunti
 */
export async function checkLoculiMigrationStatus(blockId?: number) {
  try {
    console.log("Verifica dello stato della migrazione dei loculi");
    
    // Controlla la tabella loculi_import
    const { data: importData, error: importError } = await supabase
      .from('loculi_import')
      .select('count(*)')
      .single();
      
    if (importError) {
      console.error("Errore nel controllo della tabella loculi_import:", importError);
    } else {
      console.log(`Tabella loculi_import: ${importData?.count || 0} record`);
    }
    
    // Controlla la tabella loculi
    const { data: loculiData, error: loculiError } = await supabase
      .from('loculi')
      .select('count(*)')
      .single();
      
    if (loculiError) {
      console.error("Errore nel controllo della tabella loculi:", loculiError);
    } else {
      console.log(`Tabella loculi: ${loculiData?.count || 0} record`);
    }
    
    // Se è stato specificato un blockId, controlla i loculi per quel blocco
    if (blockId) {
      const { data: blockLoculi, error: blockError } = await supabase
        .from('loculi')
        .select('count(*)')
        .eq('IdBlocco', blockId)
        .single();
        
      if (blockError) {
        console.error(`Errore nel controllo dei loculi per il blocco ${blockId}:`, blockError);
      } else {
        console.log(`Loculi per il blocco ${blockId}: ${blockLoculi?.count || 0} record`);
        
        if (blockLoculi && blockLoculi.count > 0) {
          // Recupera un esempio di loculo per questo blocco
          const { data: sampleLoculi, error: sampleError } = await supabase
            .from('loculi')
            .select('*')
            .eq('IdBlocco', blockId)
            .limit(1);
            
          if (!sampleError && sampleLoculi && sampleLoculi.length > 0) {
            console.log(`Esempio di loculo per il blocco ${blockId}:`, sampleLoculi[0]);
          }
        }
      }
    }
    
    // Controlla la tabella defunti
    const { data: defuntiData, error: defuntiError } = await supabase
      .from('defunti')
      .select('count(*)')
      .single();
      
    if (defuntiError) {
      console.error("Errore nel controllo della tabella defunti:", defuntiError);
    } else {
      console.log(`Tabella defunti: ${defuntiData?.count || 0} record`);
    }
    
    toast.info(`Verifica completata. Controlla la console per i dettagli.`);
    
    return {
      loculiImport: importData?.count || 0,
      loculi: loculiData?.count || 0,
      defunti: defuntiData?.count || 0
    };
  } catch (err) {
    console.error("Errore durante la verifica dello stato della migrazione:", err);
    toast.error("Errore durante la verifica della migrazione");
    return { loculiImport: 0, loculi: 0, defunti: 0 };
  }
}

/**
 * Funzione per recuperare i metadata di una tabella
 */
export async function getTableMetadata(tableName: string) {
  try {
    // Recupera un record di esempio per vedere le colonne
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
  } catch (err) {
    console.error(`Errore nel recupero dei metadati per la tabella ${tableName}:`, err);
    return { columns: [], error: err.message };
  }
}
