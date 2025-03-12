
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loculo } from "@/components/block/loculi/types";

/**
 * Carica i loculi per un blocco specifico
 */
export async function fetchLoculiData(blockId: number) {
  try {
    console.log("Caricamento loculi per il blocco ID:", blockId);

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

    return { data, error: null };
  } catch (err: any) {
    console.error("Errore durante il caricamento dei loculi:", err);
    return { data: [], error: err.message };
  }
}

