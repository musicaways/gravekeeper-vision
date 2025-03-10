
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches loculi data from the loculi (lowercase) table
 */
export async function fetchLoculiFromLowercaseTable(blockId: number) {
  console.log(`Tentativo di recupero loculi dalla tabella 'loculi' con blockId: ${blockId}`);
  
  // Try with IdBlocco field first
  try {
    // Seleziona esplicitamente i campi per evitare ricorsione nei tipi
    const { data, error } = await supabase
      .from('loculi')
      .select(`
        id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba, FilaDaAlto, 
        NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias,
        defunti (id, nominativo, data_nascita, data_decesso, sesso, annotazioni)
      `)
      .eq('IdBlocco', blockId);
      
    if (error) {
      console.error("Errore nel recupero dalla tabella 'loculi':", error);
      
      // If there's a column name error, try alternative column name
      if (error.message.includes("does not exist")) {
        console.log("Trying alternative column name 'id_blocco'...");
        
        // Seleziona esplicitamente i campi per evitare ricorsione nei tipi
        const { data: altData, error: altError } = await supabase
          .from('loculi')
          .select(`
            id, Numero, Fila, Annotazioni, id_blocco, TipoTomba, FilaDaAlto, 
            NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias,
            defunti (id, nominativo, data_nascita, data_decesso, sesso, annotazioni)
          `)
          .eq('id_blocco', blockId);
        
        return { data: altData || [], error: altError };
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
    
  // Fallback to direct query with no joins
  try {
    console.log("Fallback to simpler query...");
    const { data, error } = await supabase
      .from('loculi')
      .select('id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba')
      .eq('IdBlocco', blockId);
      
    return { data: data || [], error };
  } catch (err) {
    console.error("Error in fallback query:", err);
    return { data: [], error: err };
  }
}

/**
 * Searches for defunti by name in the defunti (lowercase) table
 */
export async function searchDefuntiInLowercaseTable(blockId: number, searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from('defunti')
      .select(`
        id, nominativo, data_nascita, data_decesso, sesso, annotazioni,
        loculi!inner (id, Numero, Fila, IdBlocco)
      `)
      .eq('loculi.IdBlocco', blockId)
      .ilike('nominativo', `%${searchTerm}%`);
      
    // If there's a column name error, try with alternative column name
    if (error && error.message.includes("does not exist")) {
      console.log("Trying alternative column name for search...");
      
      const { data: altData, error: altError } = await supabase
        .from('defunti')
        .select(`
          id, nominativo, data_nascita, data_decesso, sesso, annotazioni,
          loculi!inner (id, Numero, Fila, id_blocco)
        `)
        .eq('loculi.id_blocco', blockId)
        .ilike('nominativo', `%${searchTerm}%`);
        
      return { data: altData || [], error: altError };
    }
      
    return { data: data || [], error };
  } catch (err) {
    console.error("Exception in searchDefuntiInLowercaseTable:", err);
    return { data: [], error: err };
  }
}
