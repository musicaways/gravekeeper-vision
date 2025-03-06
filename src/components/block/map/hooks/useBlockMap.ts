
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBlockMap = (block: any) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockMap = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!block || !block.Id) {
          setError("Dati del blocco non disponibili");
          return;
        }

        console.log("Fetching map for block:", block.Id);

        // Query the CimiteroMappe table for the related cemetery map
        const { data, error } = await supabase
          .from('CimiteroMappe')
          .select('Url')
          .eq('IdCimitero', block.Settore?.IdCimitero || null)
          .order('DataInserimento', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error("Error fetching cemetery map:", error);
          setError(`Errore nel caricamento della mappa: ${error.message}`);
          throw error;
        }
        
        console.log("Map data result:", data);
        
        if (data && data.length > 0) {
          setMapUrl(data[0].Url);
        } else {
          console.log("No map found for cemetery ID:", block.Settore?.IdCimitero);
        }
      } catch (err: any) {
        console.error("Error loading map:", err);
        setError(`Errore nel caricamento della mappa: ${err.message || "Errore sconosciuto"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockMap();
  }, [block]);

  return { mapUrl, loading, error };
};
