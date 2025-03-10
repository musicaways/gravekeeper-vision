
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches loculi data from the Loculo (uppercase) table
 */
export async function fetchLoculiFromUppercaseTable(blockId: number) {
  console.log(`Tentativo di recupero loculi dalla tabella 'Loculo' con blockId: ${blockId}`);
  
  const { data, error } = await supabase
    .from('Loculo')
    .select(`
      Id, Numero, Fila, Annotazioni, IdBlocco, TipoTomba,
      Defunti:Defunto(Id, Nominativo, DataNascita, DataDecesso, Sesso)
    `)
    .eq('IdBlocco', blockId);
    
  if (error) {
    console.error("Errore nel recupero dalla tabella 'Loculo':", error);
  } else {
    console.log(`Trovati ${data?.length || 0} loculi nella tabella 'Loculo' per blockId ${blockId}`);
    if (data && data.length > 0) {
      console.log("Esempio di loculo trovato (Loculo):", data[0]);
    }
  }
  
  return { data, error };
}

/**
 * Searches for defunti by name in the Defunto (uppercase) table
 */
export async function searchDefuntiInUppercaseTable(blockId: number, searchTerm: string) {
  const { data, error } = await supabase
    .from('Defunto')
    .select(`
      Id, Nominativo, DataNascita, DataDecesso, Sesso,
      Loculo!inner(Id, Numero, Fila, IdBlocco)
    `)
    .eq('Loculo.IdBlocco', blockId)
    .ilike('Nominativo', `%${searchTerm}%`);
    
  return { data, error };
}
