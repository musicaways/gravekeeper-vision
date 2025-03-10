
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
    
    // Prova anche a interrogare la tabella Loculo e Defunto (vecchie tabelle)
    const loculoOldResponse = await supabase
      .from('Loculo')
      .select('*').limit(5);
    
    console.log(`Tabella Loculo (vecchia): risultati`, loculoOldResponse);
    
    const defuntoOldResponse = await supabase
      .from('Defunto')
      .select('*').limit(5);
    
    console.log(`Tabella Defunto (vecchia): risultati`, defuntoOldResponse);
    
    // Controlla se c'è un problema con la relazione tra blocchi e loculi
    if (blockId) {
      // Verifica blocco
      const bloccoResponse = await supabase
        .from('Blocco')
        .select('*')
        .eq('Id', blockId);
        
      console.log(`Blocco con ID ${blockId}:`, bloccoResponse);
      
      // Verifica colonne nella tabella loculi
      const tableInfo = await getTableMetadata('loculi');
      console.log("Metadati tabella loculi:", tableInfo);
    }
    
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
    // Check if it's a valid table name
    const validTableNames = ['loculi', 'Loculo', 'defunti', 'Defunto'];
    
    if (!validTableNames.includes(tableName)) {
      return { columns: [], error: `Nome tabella non supportato: ${tableName}` };
    }
    
    // Get table data based on the table name
    let result;
    
    if (tableName === 'loculi') {
      result = await supabase.from('loculi').select('*').limit(1);
    } else if (tableName === 'Loculo') {
      result = await supabase.from('Loculo').select('*').limit(1);
    } else if (tableName === 'defunti') {
      result = await supabase.from('defunti').select('*').limit(1);
    } else if (tableName === 'Defunto') {
      result = await supabase.from('Defunto').select('*').limit(1);
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
