
import { supabase } from "@/integrations/supabase/client";
import { Loculo, Defunto } from "@/components/block/loculi/types";

/**
 * Fetches loculi data from the loculi (lowercase) table
 */
export async function fetchLoculiFromLowercaseTable(blockId: number) {
  console.log(`Tentativo di recupero loculi dalla tabella 'loculi' con blockId: ${blockId}`);
  
  try {
    // Use the correct field name "IdBlocco" instead of "id_blocco"
    const { data, error } = await supabase
      .from('loculi')
      .select(`
        id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba, FilaDaAlto, 
        NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias
      `)
      .eq('IdBlocco', blockId);
      
    // Handle error case
    if (error) {
      console.error("Errore nel recupero dalla tabella 'loculi':", error);
      return { data: [], error };
    }
    
    // If we have data, fetch defunti separately for each loculo
    const enrichedData = [];
    if (data && data.length > 0) {
      for (const loculo of data) {
        const loculoWithDefunti = { ...loculo, defunti: [] };
        
        // Fetch defunti for this loculo
        const { data: defuntiData, error: defuntiError } = await supabase
          .from('defunti')
          .select('id, nominativo, data_nascita, data_decesso, sesso, annotazioni')
          .eq('id_loculo', loculo.id);
        
        if (!defuntiError && defuntiData) {
          loculoWithDefunti.defunti = defuntiData;
        }
        
        enrichedData.push(loculoWithDefunti);
      }
    }
      
    console.log(`Trovati ${enrichedData.length || 0} loculi nella tabella 'loculi' per blockId ${blockId}`);
    if (enrichedData.length > 0) {
      console.log("Esempio di loculo trovato (loculi):", enrichedData[0]);
    }
    
    return { data: enrichedData, error: null };
  } catch (err) {
    console.error("Exception in fetchLoculiFromLowercaseTable:", err);
    return { data: [], error: err };
  }
}

/**
 * Searches for defunti by name in the defunti (lowercase) table
 */
export async function searchDefuntiInLowercaseTable(blockId: number, searchTerm: string) {
  try {
    // First fetch defunti that match the search term
    const { data: defuntiData, error: defuntiError } = await supabase
      .from('defunti')
      .select(`
        id, nominativo, data_nascita, data_decesso, sesso, annotazioni, id_loculo
      `)
      .ilike('nominativo', `%${searchTerm}%`);
      
    if (defuntiError) {
      return { data: [], error: defuntiError };
    }
    
    if (!defuntiData || defuntiData.length === 0) {
      return { data: [], error: null };
    }
    
    // Extract loculo IDs from defunti
    const loculoIds = defuntiData
      .filter(d => d.id_loculo)
      .map(d => d.id_loculo);
      
    if (loculoIds.length === 0) {
      return { data: [], error: null };
    }
    
    // Fetch the loculi with these IDs that also belong to the specified block
    // Use the correct field name "IdBlocco" 
    const { data: loculiData, error: loculiError } = await supabase
      .from('loculi')
      .select(`
        id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba, FilaDaAlto, 
        NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias
      `)
      .eq('IdBlocco', blockId)
      .in('id', loculoIds);
      
    if (loculiError) {
      return { data: [], error: loculiError };
    }
    
    // Map defunti to their respective loculi
    const enrichedLoculi = [];
    if (loculiData && loculiData.length > 0) {
      for (const loculo of loculiData) {
        const matchingDefunti = defuntiData.filter(d => d.id_loculo === loculo.id);
        enrichedLoculi.push({
          ...loculo,
          defunti: matchingDefunti
        });
      }
    }
    
    return { data: enrichedLoculi, error: null };
  } catch (err) {
    console.error("Exception in searchDefuntiInLowercaseTable:", err);
    return { data: [], error: err };
  }
}
