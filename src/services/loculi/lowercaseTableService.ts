
import { supabase } from "@/integrations/supabase/client";
import { Loculo, Defunto } from "@/components/block/loculi/types";

/**
 * Fetches loculi data from the loculi (lowercase) table
 */
export async function fetchLoculiFromLowercaseTable(blockId: number) {
  console.log(`Tentativo di recupero loculi dalla tabella 'loculi' con blockId: ${blockId}`);
  
  // Try with IdBlocco field first
  try {
    // Use explicit type casting to break the recursive type reference
    const { data, error } = await supabase
      .from('loculi')
      .select(`
        id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba, FilaDaAlto, 
        NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias
      `)
      .eq('IdBlocco', blockId);
      
    // Fetch defunti separately to avoid type recursion
    if (data && data.length > 0) {
      for (const loculo of data) {
        const { data: defuntiData } = await supabase
          .from('defunti')
          .select('id, nominativo, data_nascita, data_decesso, sesso, annotazioni')
          .eq('id_loculo', loculo.id);
        
        // Attach defunti data to the loculo using type assertion
        (loculo as any).defunti = defuntiData || [];
      }
    }
      
    if (error) {
      console.error("Errore nel recupero dalla tabella 'loculi':", error);
      
      // If there's a column name error, try alternative column name
      if (error.message && error.message.includes("does not exist")) {
        console.log("Trying alternative column name 'id_blocco'...");
        
        // Use explicit field selection to avoid nested types
        const altResponse = await supabase
          .from('loculi')
          .select(`
            id, Numero, Fila, Annotazioni, id_blocco, TipoTomba, FilaDaAlto, 
            NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias
          `)
          .eq('id_blocco', blockId);
        
        const altData = altResponse.data;
        const altError = altResponse.error;
        
        // Fetch defunti separately
        if (altData && altData.length > 0) {
          for (const loculo of altData) {
            const { data: defuntiData } = await supabase
              .from('defunti')
              .select('id, nominativo, data_nascita, data_decesso, sesso, annotazioni')
              .eq('id_loculo', loculo.id);
            
            // Attach defunti data using type assertion
            (loculo as any).defunti = defuntiData || [];
          }
        }
        
        // Check if altError exists before trying to access properties
        if (altError) {
          return { data: [], error: altError };
        }
        
        return { data: altData || [], error: null };
      }
      
      return { data: [], error };
    }
    
    console.log(`Trovati ${data?.length || 0} loculi nella tabella 'loculi' per blockId ${blockId}`);
    if (data && data.length > 0) {
      console.log("Esempio di loculo trovato (loculi):", data[0]);
    }
    return { data: data || [], error };
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
    const loculiResponse = await supabase
      .from('loculi')
      .select(`
        id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba, FilaDaAlto, 
        NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias
      `)
      .eq('IdBlocco', blockId)
      .in('id', loculoIds);
    
    const loculiData = loculiResponse.data;
    const loculiError = loculiResponse.error;
      
    if (loculiError) {
      return { data: [], error: loculiError };
    }
    
    // Map defunti to their respective loculi using type assertion
    if (loculiData && loculiData.length > 0) {
      for (const loculo of loculiData) {
        // Use type assertion to assign defunti property
        (loculo as any).defunti = defuntiData.filter(d => d.id_loculo === loculo.id);
      }
    }
    
    return { data: loculiData || [], error: null };
  } catch (err) {
    console.error("Exception in searchDefuntiInLowercaseTable:", err);
    return { data: [], error: err };
  }
}
