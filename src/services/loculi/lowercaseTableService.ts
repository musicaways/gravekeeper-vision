
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches loculi data from the loculi (lowercase) table
 */
export async function fetchLoculiFromLowercaseTable(blockId: number) {
  console.log(`Tentativo di recupero loculi dalla tabella 'loculi' con blockId: ${blockId}`);
  
  // Try with IdBlocco field
  const { data, error } = await supabase
    .from('loculi')
    .select(`
      id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba, FilaDaAlto, 
      NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias,
      defunti(id, nominativo, data_nascita, data_decesso, sesso, annotazioni)
    `)
    .eq('IdBlocco', blockId);
  
  if (error) {
    console.error("Errore nel recupero dalla tabella 'loculi':", error);
    // Try alternative column name if the first attempt failed
    if (error.message.includes("does not exist")) {
      console.log("Trying alternative column name 'id_blocco'...");
      const altResponse = await supabase
        .from('loculi')
        .select(`
          id, Numero, Fila, Annotazioni, id_blocco, TipoTomba, FilaDaAlto, 
          NumeroPostiResti, NumeroPosti, Superficie, Concesso, Alias,
          defunti(id, nominativo, data_nascita, data_decesso, sesso, annotazioni)
        `)
        .eq('id_blocco', blockId);
      
      return altResponse;
    }
  } else {
    console.log(`Trovati ${data?.length || 0} loculi nella tabella 'loculi' per blockId ${blockId}`);
    if (data && data.length > 0) {
      console.log("Esempio di loculo trovato (loculi):", data[0]);
    }
  }
    
  return { data, error };
}

/**
 * Searches for defunti by name in the defunti (lowercase) table
 */
export async function searchDefuntiInLowercaseTable(blockId: number, searchTerm: string) {
  const { data, error } = await supabase
    .from('defunti')
    .select(`
      id, nominativo, data_nascita, data_decesso, sesso, annotazioni,
      loculi!inner(id, Numero, Fila, IdBlocco)
    `)
    .eq('loculi.IdBlocco', blockId)
    .ilike('nominativo', `%${searchTerm}%`);
    
  // If there's a column name error, try with alternative column name
  if (error && error.message.includes("does not exist")) {
    console.log("Trying alternative column name for search...");
    const altResponse = await supabase
      .from('defunti')
      .select(`
        id, nominativo, data_nascita, data_decesso, sesso, annotazioni,
        loculi!inner(id, Numero, Fila, id_blocco)
      `)
      .eq('loculi.id_blocco', blockId)
      .ilike('nominativo', `%${searchTerm}%`);
      
    return altResponse;
  }
    
  return { data, error };
}
