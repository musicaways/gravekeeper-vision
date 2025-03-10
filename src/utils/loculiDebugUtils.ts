
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getTableInfo } from "@/services/loculiService";

/**
 * Funzione di debug per verificare lo stato delle tabelle loculi e defunti
 */
export async function checkLoculiMigrationStatus(blockId?: number) {
  try {
    console.log("Verifica dello stato della migrazione dei loculi");
    
    // Controlla la tabella loculi_import
    const importResponse = await supabase
      .from('loculi_import')
      .select('id, Numero, Fila, IdBlocco')
      .limit(50);
      
    if (importResponse.error) {
      console.error("Errore nel controllo della tabella loculi_import:", importResponse.error);
    } else {
      const importCount = importResponse.data?.length || 0;
      console.log(`Tabella loculi_import: ${importCount} record`);
    }
    
    // Controlla la tabella loculi
    const loculiResponse = await supabase
      .from('loculi')
      .select('id, Numero, Fila, IdBlocco')
      .limit(50);
      
    if (loculiResponse.error) {
      console.error("Errore nel controllo della tabella loculi:", loculiResponse.error);
    } else {
      const loculiCount = loculiResponse.data?.length || 0;
      console.log(`Tabella loculi: ${loculiCount} record`);
      
      // Try to determine which columns are actually available
      if (loculiCount > 0) {
        const firstRecord = loculiResponse.data[0];
        console.log("Available columns in loculi:", Object.keys(firstRecord));
      }
    }
    
    // Se è stato specificato un blockId, controlla i loculi per quel blocco
    let blockCount = 0;
    if (blockId) {
      // Try with IdBlocco first
      try {
        const blockResponse = await supabase
          .from('loculi')
          .select('id, Numero, Fila, IdBlocco, TipoTomba')
          .eq('IdBlocco', blockId);
          
        if (blockResponse.error) {
          console.error(`Errore nel controllo dei loculi per il blocco ${blockId}:`, blockResponse.error);
          
          // If error, try with id_blocco instead
          if (blockResponse.error.message.includes("does not exist")) {
            console.log("Trying with 'id_blocco' column instead of 'IdBlocco'");
            
            // Use explicit type assertion to avoid type errors
            const altResponse = await supabase
              .from('loculi')
              .select('id, Numero, Fila, id_blocco, TipoTomba')
              .eq('id_blocco', blockId);
            
            if (!altResponse.error && altResponse.data) {
              blockCount = altResponse.data.length;
              console.log(`Loculi per il blocco ${blockId} (using id_blocco): ${blockCount} record`);
              
              if (blockCount > 0) {
                console.log(`Esempio di loculo per il blocco ${blockId}:`, altResponse.data[0]);
              }
            }
          }
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
      } catch (err) {
        console.error("Error querying loculi by block:", err);
      }
    }
    
    // Controlla la tabella defunti
    const defuntiResponse = await supabase
      .from('defunti')
      .select('id, nominativo, data_nascita, data_decesso')
      .limit(50);
      
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
      .select('Id, Numero, Fila, IdBlocco')
      .limit(5);
    
    console.log(`Tabella Loculo (vecchia): risultati`, loculoOldResponse);
    
    const defuntoOldResponse = await supabase
      .from('Defunto')
      .select('Id, Nominativo, DataNascita, DataDecesso')
      .limit(5);
    
    console.log(`Tabella Defunto (vecchia): risultati`, defuntoOldResponse);
    
    // Controlla se c'è un problema con la relazione tra blocchi e loculi
    if (blockId) {
      // Verifica blocco
      const bloccoResponse = await supabase
        .from('Blocco')
        .select('Id, Nome, Codice, NumeroLoculi')
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
