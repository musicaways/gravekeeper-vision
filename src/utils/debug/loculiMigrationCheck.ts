
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getTableMetadata } from "./tableMetadataService";

type LoculoRecord = {
  id: string;
  Numero: number;
  Fila: number;
  IdBlocco: number;
  TipoTomba?: number;
};

type MigrationCheckResult = {
  loculiImport: number;
  loculi: number;
  blockLoculi: number;
  defunti: number;
};

/**
 * Funzione di debug per verificare lo stato delle tabelle loculi e defunti
 */
export async function checkLoculiMigrationStatus(blockId?: number): Promise<MigrationCheckResult> {
  try {
    console.log("Verifica dello stato della migrazione dei loculi");
    
    // Controlla la tabella loculi_import
    const importResponse = await supabase
      .from('loculi_import')
      .select('id, Numero, Fila, IdBlocco')
      .limit(50);
      
    if (importResponse.error) {
      console.error("Errore nel controllo della tabella loculi_import:", importResponse.error);
    }
    
    // Controlla la tabella loculi
    const loculiResponse = await supabase
      .from('loculi')
      .select('id, Numero, Fila, IdBlocco')
      .limit(50);
      
    if (loculiResponse.error) {
      console.error("Errore nel controllo della tabella loculi:", loculiResponse.error);
    }
    
    let blockCount = 0;
    if (blockId) {
      blockCount = await checkBlockLoculi(blockId);
    }
    
    // Controlla la tabella defunti
    const defuntiResponse = await supabase
      .from('defunti')
      .select('id, nominativo, data_nascita, data_decesso')
      .limit(50);
      
    if (defuntiResponse.error) {
      console.error("Errore nel controllo della tabella defunti:", defuntiResponse.error);
    }
    
    toast.info(`Verifica completata. Controlla la console per i dettagli.`);
    
    // Check legacy tables if needed
    await checkLegacyTables();
    
    // Check block relationship if blockId provided
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
    const response = await supabase
      .from('loculi')
      .select('id, Numero, Fila, IdBlocco, TipoTomba')
      .eq('IdBlocco', blockId);
      
    if (response.error) {
      console.error(`Errore nel controllo dei loculi per il blocco ${blockId}:`, response.error);
      return 0;
    } 
    
    const count = response.data?.length || 0;
    console.log(`Loculi per il blocco ${blockId}: ${count} record`);
    
    if (count > 0) {
      console.log(`Esempio di loculo per il blocco ${blockId}:`, response.data[0]);
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
  const loculoOldResponse = await supabase
    .from('Loculo')
    .select('Id, Numero, Fila, IdBlocco')
    .limit(5);
  
  const defuntoOldResponse = await supabase
    .from('Defunto')
    .select('Id, Nominativo, DataNascita, DataDecesso')
    .limit(5);
    
  console.log(`Tabella Loculo (vecchia): risultati`, loculoOldResponse);
  console.log(`Tabella Defunto (vecchia): risultati`, defuntoOldResponse);
}

/**
 * Verifica la relazione tra blocco e loculi
 */
async function checkBloccoRelationship(blockId: number) {
  const bloccoResponse = await supabase
    .from('Blocco')
    .select('Id, Nome, Codice, NumeroLoculi')
    .eq('Id', blockId)
    .single();
    
  console.log(`Blocco con ID ${blockId}:`, bloccoResponse);
  
  // Verifica colonne nella tabella loculi
  const tableInfo = await getTableMetadata('loculi');
  console.log("Metadati tabella loculi:", tableInfo);
}
