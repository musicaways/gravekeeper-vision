
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Funzione di debug per verificare lo stato delle tabelle loculi e defunti
 */
export async function checkLoculiMigrationStatus(blockId?: number) {
  try {
    console.log("Verifica dello stato della migrazione dei loculi");
    
    // Controlla la tabella loculi_import
    const importResponse = await supabase
      .from('loculi_import')
      .select('*');
      
    if (importResponse.error) {
      console.error("Errore nel controllo della tabella loculi_import:", importResponse.error);
    } else {
      const importCount = importResponse.data?.length || 0;
      console.log(`Tabella loculi_import: ${importCount} record`);
    }
    
    // Controlla la tabella loculi
    const loculiResponse = await supabase
      .from('loculi')
      .select('*');
      
    if (loculiResponse.error) {
      console.error("Errore nel controllo della tabella loculi:", loculiResponse.error);
    } else {
      const loculiCount = loculiResponse.data?.length || 0;
      console.log(`Tabella loculi: ${loculiCount} record`);
    }
    
    // Se è stato specificato un blockId, controlla i loculi per quel blocco
    let blockCount = 0;
    if (blockId) {
      const blockResponse = await supabase
        .from('loculi')
        .select('*')
        .eq('IdBlocco', blockId);
        
      if (blockResponse.error) {
        console.error(`Errore nel controllo dei loculi per il blocco ${blockId}:`, blockResponse.error);
      } else {
        blockCount = blockResponse.data?.length || 0;
        console.log(`Loculi per il blocco ${blockId}: ${blockCount} record`);
        
        if (blockCount > 0) {
          // Recupera un esempio di loculo per questo blocco
          const sampleLoculi = blockResponse.data;
          if (sampleLoculi && sampleLoculi.length > 0) {
            console.log(`Esempio di loculo per il blocco ${blockId}:`, sampleLoculi[0]);
          }
        }
      }
    }
    
    // Controlla la tabella defunti
    const defuntiResponse = await supabase
      .from('defunti')
      .select('*');
      
    if (defuntiResponse.error) {
      console.error("Errore nel controllo della tabella defunti:", defuntiResponse.error);
    } else {
      const defuntiCount = defuntiResponse.data?.length || 0;
      console.log(`Tabella defunti: ${defuntiCount} record`);
    }
    
    toast.info(`Verifica completata. Controlla la console per i dettagli.`);
    
    return {
      loculiImport: importResponse.data?.length || 0,
      loculi: loculiResponse.data?.length || 0,
      blockLoculi: blockCount,
      defunti: defuntiResponse.data?.length || 0
    };
  } catch (err: any) {
    console.error("Errore durante la verifica dello stato della migrazione:", err);
    toast.error("Errore durante la verifica della migrazione");
    return { loculiImport: 0, loculi: 0, blockLoculi: 0, defunti: 0 };
  }
}

/**
 * Funzione per recuperare i metadata di una tabella
 */
export async function getTableMetadata(tableName: string) {
  try {
    // Recupera un record di esempio per vedere le colonne
    if (tableName === 'loculi' || tableName === 'Loculo' || tableName === 'defunti' || tableName === 'Defunto') {
      const { data, error } = await supabase
        .from(tableName as any)
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
    } else {
      return { columns: [], error: `Nome tabella non supportato: ${tableName}` };
    }
  } catch (err: any) {
    console.error(`Errore nel recupero dei metadati per la tabella ${tableName}:`, err);
    return { columns: [], error: err.message };
  }
}
