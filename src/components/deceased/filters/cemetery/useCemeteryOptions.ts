
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CemeteryOption } from "./types";

export const useCemeteryOptions = () => {
  const [cemeteries, setCemeteries] = useState<CemeteryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCemeteries = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('Cimitero')
          .select('Id, Nome')
          .order('Nome');

        if (error) throw error;
        
        const options = data.map(item => ({
          value: item.Nome,
          label: item.Nome || 'Cimitero senza nome',
        }));

        setCemeteries(options);
      } catch (error) {
        console.error("Error fetching cemeteries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteries();
  }, []);

  return { cemeteries, loading };
};
