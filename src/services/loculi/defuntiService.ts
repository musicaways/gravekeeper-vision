
import { supabase } from "@/integrations/supabase/client";
import { DefuntoType } from "@/components/block/loculi/types";

/**
 * Carica i defunti per un insieme di loculi
 */
export async function fetchDefuntiForLoculi(loculiIds: (string | number)[]) {
  try {
    // Convert all IDs to numbers for the first query
    const numericLoculiIds = loculiIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
    
    // Step 1: Recupera vecchi defunti dalla tabella 'Defunto'
    const { data: defunti, error: defuntiError } = await supabase
      .from('Defunto')
      .select('*')
      .in('IdLoculo', numericLoculiIds);
      
    if (defuntiError) {
      console.error("Errore nel caricamento dei defunti:", defuntiError);
    }
    
    // Step 2: Recupera nuovi defunti dalla tabella 'defunti'
    // For the new table we need string IDs
    const loculiIdsAsStrings = loculiIds.map(id => id.toString());
    const { data: newDefunti, error: newDefuntiError } = await supabase
      .from('defunti')
      .select('*')
      .in('id_loculo', loculiIdsAsStrings);
    
    if (newDefuntiError) {
      console.error("Errore nel caricamento dei nuovi defunti:", newDefuntiError);
    }

    // Combina i risultati
    const allDefunti = [
      ...(defunti || []),
      ...(newDefunti || [])
    ];

    return { data: allDefunti, error: null };
  } catch (err: any) {
    console.error("Errore durante il recupero dei defunti:", err);
    return { data: [], error: err.message };
  }
}

