
import { supabase } from "@/integrations/supabase/client";
import { fetchLoculiData } from "./loculiBaseService";
import { fetchDefuntiForLoculi } from "./defuntiService";

export async function searchLoculi(blockId: number, searchTerm: string) {
  try {
    if (!searchTerm) {
      return await fetchLoculiData(blockId);
    }

    console.log(`Ricerca loculi con termine "${searchTerm}" nel blocco ${blockId}`);
    
    // Trova i loculi per il blocco
    const { data: loculi, error: loculiError } = await supabase
      .from('Loculo')
      .select('*')
      .eq('IdBlocco', blockId);
      
    if (loculiError) {
      throw loculiError;
    }
    
    // Cerca i defunti che contengono il termine di ricerca
    const { data: defunti, error: defuntiError } = await supabase
      .from('Defunto')
      .select('*')
      .like('Nominativo', `%${searchTerm}%`);
      
    if (defuntiError) {
      throw defuntiError;
    }
    
    // Filtra i loculi che hanno defunti corrispondenti
    const loculiIds = loculi.map(l => l.id);
    const relevantDefunti = defunti.filter(d => loculiIds.includes(d.IdLoculo));
    const relevantLoculiIds = [...new Set(relevantDefunti.map(d => d.IdLoculo))];
    
    // Associa i defunti ai loculi corrispondenti
    const filteredLoculi = loculi
      .filter(l => relevantLoculiIds.includes(l.id))
      .map(loculo => ({
        ...loculo,
        Defunti: defunti.filter(d => d.IdLoculo === loculo.id)
      }));
    
    return { data: filteredLoculi, error: null };
  } catch (err: any) {
    console.error("Errore durante la ricerca dei loculi:", err);
    return { data: [], error: err.message };
  }
}

