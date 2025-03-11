
import { supabase } from "@/integrations/supabase/client";
import { Loculo } from "@/components/block/loculi/types";
import { toast } from "sonner";

/**
 * Servizio per la gestione dei loculi
 */

/**
 * Carica i loculi per un blocco specifico
 */
export async function fetchLoculiData(blockId: number) {
  try {
    console.log("Caricamento loculi per il blocco ID:", blockId);

    // Query per caricare i loculi dalla tabella Loculo
    const { data, error } = await supabase
      .from('Loculo')
      .select(`
        id,
        Numero,
        Fila,
        Annotazioni,
        IdBlocco,
        TipoTomba,
        Alias,
        FilaDaAlto,
        NumeroPostiResti,
        NumeroPosti,
        Superficie,
        Concesso
      `)
      .eq('IdBlocco', blockId)
      .order('Fila', { ascending: true })
      .order('Numero', { ascending: true });

    if (error) {
      console.error("Errore nel caricamento dei loculi:", error);
      return { data: [], error: error.message };
    }

    // Ora prendiamo i defunti associati a questi loculi
    const loculiIds = data.map(loculo => loculo.id);
    
    const { data: defunti, error: defuntiError } = await supabase
      .from('Defunto')
      .select('*')
      .in('IdLoculo', loculiIds);
      
    if (defuntiError) {
      console.error("Errore nel caricamento dei defunti:", defuntiError);
    }
    
    // Assegniamo i defunti ai rispettivi loculi
    const processedData = data.map(loculo => {
      const associatedDefunti = defunti?.filter(d => d.IdLoculo === loculo.id) || [];
      return { 
        ...loculo, 
        Defunti: associatedDefunti 
      };
    });

    console.log(`Caricati ${processedData.length} loculi per il blocco ${blockId}`);
    
    if (processedData.length === 0) {
      console.log("Nessun loculo trovato per il blocco", blockId);
    } else {
      console.log("Esempio di loculo:", processedData[0]);
    }

    return { data: processedData, error: null };
  } catch (err: any) {
    console.error("Errore durante il caricamento dei loculi:", err);
    return { data: [], error: err.message };
  }
}

/**
 * Cerca i loculi per nome defunto
 */
export async function searchLoculi(blockId: number, searchTerm: string) {
  try {
    if (!searchTerm) {
      return await fetchLoculiData(blockId);
    }

    console.log(`Ricerca loculi con termine "${searchTerm}" nel blocco ${blockId}`);
    
    // Prima troviamo i loculi per il blocco
    const { data: loculi, error: loculiError } = await supabase
      .from('Loculo')
      .select('*')
      .eq('IdBlocco', blockId);
      
    if (loculiError) {
      throw loculiError;
    }
    
    // Ora cerchiamo i defunti che contengono il termine di ricerca
    const { data: defunti, error: defuntiError } = await supabase
      .from('Defunto')
      .select('*')
      .like('Nominativo', `%${searchTerm}%`);
      
    if (defuntiError) {
      throw defuntiError;
    }
    
    // Filtra i loculi che hanno defunti che corrispondono alla ricerca
    const loculiIds = loculi.map(l => l.id);
    const relevantDefunti = defunti.filter(d => loculiIds.includes(d.IdLoculo));
    const relevantLoculiIds = [...new Set(relevantDefunti.map(d => d.IdLoculo))];
    
    // Associa i defunti ai loculi corrispondenti
    const filteredLoculi = loculi
      .filter(l => relevantLoculiIds.includes(l.id))
      .map(loculo => {
        const associatedDefunti = defunti.filter(d => d.IdLoculo === loculo.id);
        return { ...loculo, Defunti: associatedDefunti };
      });
    
    console.log(`Trovati ${filteredLoculi.length} loculi corrispondenti al termine di ricerca`);
    
    return { data: filteredLoculi, error: null };
  } catch (err: any) {
    console.error("Errore durante la ricerca dei loculi:", err);
    return { data: [], error: err.message };
  }
}

/**
 * Verifica la relazione tra blocco e loculi
 */
export async function checkBloccoRelationship(blockId: number) {
  console.log(`Verifica relazione per il blocco ${blockId}`);
  
  try {
    // Controlla info blocco
    const bloccoResponse = await supabase
      .from('Blocco')
      .select('Id, Nome, Codice, NumeroLoculi')
      .eq('Id', blockId)
      .single();
      
    console.log(`Informazioni blocco:`, bloccoResponse);
    
    // Conta loculi per questo blocco
    const loculiCountResponse = await supabase
      .from('Loculo')
      .select('id', { count: 'exact' })
      .eq('IdBlocco', blockId);
      
    console.log(`Conteggio loculi per blocco ${blockId}:`, {
      count: loculiCountResponse.count,
      error: loculiCountResponse.error
    });
    
    // Recupera un esempio di loculo
    const loculoEsempioResponse = await supabase
      .from('Loculo')
      .select('*')
      .eq('IdBlocco', blockId)
      .limit(1);
      
    console.log(`Esempio loculo per blocco ${blockId}:`, {
      data: loculoEsempioResponse.data,
      error: loculoEsempioResponse.error
    });
    
    return {
      blocco: bloccoResponse.data,
      loculiCount: loculiCountResponse.count,
      loculoEsempio: loculoEsempioResponse.data?.[0]
    };
  } catch (err: any) {
    console.error("Errore durante la verifica della relazione:", err);
    toast.error("Errore durante la verifica della relazione blocco-loculi");
    return { error: err.message };
  }
}

/**
 * Funzione di debug per ottenere informazioni sulle tabelle
 */
export async function getTableInfo(tableName: string) {
  console.log(`Verificando struttura della tabella ${tableName}`);
  
  try {
    // Get table data based on the table name
    let result;
    
    if (tableName === 'Loculo') {
      result = await supabase.from('Loculo').select('*').limit(1);
    } else {
      result = await supabase.from(tableName as any).select('*').limit(1);
    }
    
    if (result.error) {
      console.error(`Errore nel recupero dei metadati per la tabella ${tableName}:`, result.error);
      return { columns: [], error: result.error.message };
    }
    
    if (!result.data || result.data.length === 0) {
      console.log(`Nessun dato trovato nella tabella ${tableName}`);
      return { columns: [], error: null };
    }
    
    // Estrai i nomi delle colonne
    const columns = Object.keys(result.data[0]);
    console.log(`Colonne nella tabella ${tableName}:`, columns);
    
    return { columns, error: null };
  } catch (err: any) {
    console.error(`Errore nel recupero dei metadati per la tabella ${tableName}:`, err);
    return { columns: [], error: err.message };
  }
}
