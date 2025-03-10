
import { supabase } from "@/integrations/supabase/client";
import { Loculo } from "@/components/block/loculi/types";

/**
 * Fetches loculi data from the Loculo (uppercase) table
 */
export async function fetchLoculiFromUppercaseTable(blockId: number) {
  const { data, error } = await supabase
    .from('Loculo')
    .select(`
      *,
      Defunti:Defunto(*)
    `)
    .eq('IdBlocco', blockId);
    
  return { data, error };
}

/**
 * Fetches loculi data from the loculi (lowercase) table
 */
export async function fetchLoculiFromLowercaseTable(blockId: number) {
  const { data, error } = await supabase
    .from('loculi')
    .select(`
      *,
      defunti(*)
    `)
    .eq('IdBlocco', blockId);
    
  return { data, error };
}

/**
 * Searches for defunti by name in the Defunto (uppercase) table
 */
export async function searchDefuntiInUppercaseTable(blockId: number, searchTerm: string) {
  const { data, error } = await supabase
    .from('Defunto')
    .select(`
      *,
      Loculo!inner(*)
    `)
    .eq('Loculo.IdBlocco', blockId)
    .ilike('Nominativo', `%${searchTerm}%`);
    
  return { data, error };
}

/**
 * Searches for defunti by name in the defunti (lowercase) table
 */
export async function searchDefuntiInLowercaseTable(blockId: number, searchTerm: string) {
  const { data, error } = await supabase
    .from('defunti')
    .select(`
      *,
      loculi!inner(*)
    `)
    .eq('loculi.IdBlocco', blockId)
    .ilike('nominativo', `%${searchTerm}%`);
    
  return { data, error };
}

/**
 * Filters unique loculi that don't already exist in the current results
 */
export function filterUniqueLoculi(newLoculi: any[], currentLoculi: Loculo[]): Loculo[] {
  return newLoculi.filter(
    newLoculo => !currentLoculi.some(existingLoculo => {
      return existingLoculo.Id === newLoculo.Id;
    })
  );
}
