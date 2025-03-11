import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Funzione temporanea per la ricerca dei defunti
export async function searchDefunti(searchTerm: string) {
  try {
    if (!searchTerm || searchTerm.length < 3) {
      return { data: [], error: null };
    }

    // Cerca direttamente nella tabella Defunto
    const { data, error } = await supabase
      .from('Defunto')
      .select(`
        Id,
        Nominativo,
        DataNascita,
        DataDecesso,
        Sesso,
        IdLoculo
      `)
      .ilike('Nominativo', `%${searchTerm}%`)
      .limit(20);

    if (error) {
      console.error("Errore nella ricerca dei defunti:", error);
      return { data: [], error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("Errore durante la ricerca dei defunti:", err);
    toast.error("Errore durante la ricerca dei defunti");
    return { data: [], error: err.message };
  }
}

// Placeholder per funzionalità future
export const searchDefuntiGlobal = searchDefunti;
