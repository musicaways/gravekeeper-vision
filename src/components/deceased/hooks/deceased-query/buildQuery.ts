
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Build the basic query for deceased data with filters applied
 */
export const buildDeceasedQuery = (
  supabase: SupabaseClient,
  filterBy: string,
  searchQuery: string
) => {
  // Costruisci la query di base
  let query = supabase
    .from('defunti')
    .select(`
      id,
      nominativo,
      data_nascita,
      data_decesso,
      eta,
      sesso,
      annotazioni,
      stato_defunto,
      id_loculo
    `, { count: 'exact' });

  // Applicare filtri
  if (filterBy === 'recent') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.gte('data_decesso', thirtyDaysAgo.toISOString().split('T')[0]);
  } else if (filterBy === 'this-year') {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    query = query.gte('data_decesso', startOfYear);
  }

  // Applicare ricerca per nome, solo se il termine è valido
  if (searchQuery && searchQuery.trim() !== '') {
    query = query.ilike('nominativo', `%${searchQuery}%`);
  }
  
  return query;
};

/**
 * Apply sorting to the query
 */
export const applySorting = (query: any, sortBy: string) => {
  switch (sortBy) {
    case 'name-asc':
      return query.order('nominativo', { ascending: true });
    case 'name-desc':
      return query.order('nominativo', { ascending: false });
    case 'date-desc':
      return query.order('data_decesso', { ascending: false, nullsFirst: false });
    case 'date-asc':
      return query.order('data_decesso', { ascending: true, nullsFirst: false });
    // Gli ordinamenti per cimitero verranno applicati dopo
    default:
      return query.order('nominativo', { ascending: true });
  }
};

/**
 * Apply pagination to the query
 */
export const applyPagination = (query: any, page: number, pageSize: number) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
};
