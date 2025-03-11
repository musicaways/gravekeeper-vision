
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getTableMetadata } from "./tableMetadataService";

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
      await checkBlockLoculi(blockId);
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
    
    // Prova anche a interrogare le vecchie tabelle
    await checkLegacyTables();
    
    // Controlla se c'è un problema con la relazione tra blocchi e loculi
    if (blockId) {
      await checkBloccoRelationship(blockId);
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
 * Verifica i loculi associati a un blocco specifico
 */
async function checkBlockLoculi(blockId: number): Promise<number> {
  try {
    // Try with IdBlocco first
    const blockResponse = await supabase
      .from('loculi')
      .select('id, Numero, Fila, IdBlocco, TipoTomba')
      .eq('IdBlocco', blockId);
      
    if (blockResponse.error) {
      console.error(`Errore nel controllo dei loculi per il blocco ${blockId}:`, blockResponse.error);
      
      // If error, try with id_blocco instead (just for troubleshooting)
      if (blockResponse.error.message.includes("does not exist")) {
        console.log("Trying with 'id_blocco' column instead of 'IdBlocco'");
        
        // Use explicit type assertion to avoid type errors
        const altResponse = await supabase
          .from('loculi')
          .select('id, Numero, Fila')
          .eq('id_blocco', blockId);
        
        if (!altResponse.error && altResponse.data) {
          const count = altResponse.data.length;
          console.log(`Loculi per il blocco ${blockId} (using id_blocco): ${count} record`);
          
          if (count > 0) {
            console.log(`Esempio di loculo per il blocco ${blockId}:`, altResponse.data[0]);
          }
          return count;
        }
      }
      return 0;
    } 
    
    const count = blockResponse.data?.length || 0;
    console.log(`Loculi per il blocco ${blockId}: ${count} record`);
    
    if (count > 0) {
      // Recupera un esempio di loculo per questo blocco
      const sampleLoculi = blockResponse.data;
      if (sampleLoculi && sampleLoculi.length > 0) {
        console.log(`Esempio di loculo per il blocco ${blockId}:`, sampleLoculi[0]);
      }
    }
    return count;
  } catch (err) {
    console.error("Error querying loculi by block:", err);
    return 0;
  }
}

/**
 * Verifica le tabelle legacy
 */
async function checkLegacyTables() {
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
}

/**
 * Verifica la relazione tra blocco e loculi
 */
async function checkBloccoRelationship(blockId: number) {
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
