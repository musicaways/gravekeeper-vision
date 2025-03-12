
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Fetch loculo data for deceased records
 */
export const fetchLoculiData = async (
  supabase: SupabaseClient,
  loculiIds: number[]
) => {
  if (loculiIds.length === 0) {
    return { data: [], error: null };
  }
  
  return await supabase
    .from('Loculo')
    .select(`
      id,
      Numero,
      Fila,
      IdBlocco
    `)
    .in('id', loculiIds);
};

/**
 * Fetch block data for loculi
 */
export const fetchBlockData = async (
  supabase: SupabaseClient,
  blockIds: number[]
) => {
  if (blockIds.length === 0) {
    return { data: [], error: null };
  }
  
  return await supabase
    .from('Blocco')
    .select(`
      Id,
      Nome,
      IdSettore
    `)
    .in('Id', blockIds);
};

/**
 * Fetch sector data for blocks
 */
export const fetchSectorData = async (
  supabase: SupabaseClient,
  sectorIds: number[]
) => {
  if (sectorIds.length === 0) {
    return { data: [], error: null };
  }
  
  return await supabase
    .from('Settore')
    .select(`
      Id,
      Nome,
      IdCimitero
    `)
    .in('Id', sectorIds);
};

/**
 * Fetch cemetery data for sectors
 */
export const fetchCemeteryData = async (
  supabase: SupabaseClient,
  cemeteryIds: number[]
) => {
  if (cemeteryIds.length === 0) {
    return { data: [], error: null };
  }
  
  return await supabase
    .from('Cimitero')
    .select(`
      Id,
      Nome
    `)
    .in('Id', cemeteryIds);
};
