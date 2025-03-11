
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Funzione di debug per verificare lo stato delle tabelle
 */
export async function checkLoculiMigrationStatus(blockId?: number) {
  try {
    console.log("Verifica delle tabelle del database");
    
    // Controlla la tabella Loculo (ex loculi_import)
    const loculoResponse = await supabase
      .from('Loculo')
      .select('id, Numero, Fila, IdBlocco')
      .limit(10);
      
    if (loculoResponse.error) {
      console.error("Errore nel controllo della tabella Loculo:", loculoResponse.error);
    }
    
    let blockCount = 0;
    if (blockId) {
      // Controlla i loculi per questo blocco specifico
      const blockLoculi = await supabase
        .from('Loculo')
        .select('id')
        .eq('IdBlocco', blockId);
        
      blockCount = blockLoculi.data?.length || 0;
      console.log(`Loculi per il blocco ${blockId}: ${blockCount}`);
    }
    
    // Controlla la tabella defunti
    const defuntiResponse = await supabase
      .from('Defunto')
      .select('Id, Nominativo, DataNascita, DataDecesso')
      .limit(10);
      
    if (defuntiResponse.error) {
      console.error("Errore nel controllo della tabella Defunto:", defuntiResponse.error);
    }
    
    // Controlla relazioni
    if (blockId) {
      await checkBloccoRelationship(blockId);
    }
    
    return {
      loculo: loculoResponse.data?.length || 0,
      blockLoculi: blockCount,
      defunti: defuntiResponse.data?.length || 0
    };
  } catch (err: any) {
    console.error("Errore durante la verifica delle tabelle:", err);
    toast.error("Errore durante la verifica delle tabelle");
    return { error: err.message };
  }
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
  
  // Conta quanti loculi sono associati a questo blocco
  const loculiCount = await supabase
    .from('Loculo')
    .select('id', { count: 'exact' })
    .eq('IdBlocco', blockId);
    
  console.log(`Conteggio loculi per blocco ${blockId}:`, {
    count: loculiCount.count,
    error: loculiCount.error
  });
}
