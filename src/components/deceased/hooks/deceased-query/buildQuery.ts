
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Build the basic query for deceased data with filters applied
 */
export const buildDeceasedQuery = (
  supabase: SupabaseClient,
  filterBy: string,
  searchQuery: string,
  cemeteryId?: number | null
) => {
  // Log per debugging
  console.log("Building query with filter:", filterBy, cemeteryId ? `and cemetery ID: ${cemeteryId}` : '');
  
  // Costruisci la query di base con join su loculo per ottenere anche i dati del cimitero
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
      id_loculo,
      loculo:id_loculo(
        id,
        Numero,
        Fila,
        Blocco:IdBlocco(
          Id, 
          Nome,
          Settore:IdSettore(
            Id,
            Nome,
            Cimitero:IdCimitero(
              Id,
              Nome
            )
          )
        )
      )
    `, { count: 'exact' });

  // Applicare filtri temporali
  if (filterBy === 'recent') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dateString = thirtyDaysAgo.toISOString().split('T')[0];
    console.log("Applying recent filter, date:", dateString);
    query = query.gte('data_decesso', dateString);
  } else if (filterBy === 'this-year') {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    console.log("Applying this-year filter, date:", startOfYear);
    query = query.gte('data_decesso', startOfYear);
  } else if (filterBy === 'by-cemetery' && cemeteryId) {
    // Filtro diretto per cimitero utilizzando la foreign key path
    console.log("Applying direct cemetery filter by ID:", cemeteryId);
    query = query.eq('loculo.Blocco.Settore.Cimitero.Id', cemeteryId);
  }
  
  // Applicare ricerca per nome, solo se il termine è valido
  if (searchQuery && searchQuery.trim() !== '') {
    console.log("Applying search filter:", searchQuery);
    query = query.ilike('nominativo', `%${searchQuery}%`);
  }
  
  return query;
};

/**
 * Apply sorting to the query
 */
export const applySorting = (query: any, sortBy: string) => {
  console.log("Applying sorting:", sortBy);
  
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
  console.log(`Applying pagination: page ${page}, size ${pageSize}, range ${from}-${to}`);
  return query.range(from, to);
};
