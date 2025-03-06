
import React, { useState, useEffect } from "react";
import { Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CemeteryMapSectionProps {
  cemeteryId: string | number;
}

const CemeteryMapSection = ({ cemeteryId }: CemeteryMapSectionProps) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCemeteryMap = async () => {
      try {
        if (!cemeteryId) return;

        // Convert cemeteryId to number if it's a string
        const numericId = typeof cemeteryId === 'string' ? parseInt(cemeteryId, 10) : cemeteryId;
        
        // Check if the conversion resulted in a valid number
        if (isNaN(numericId)) {
          console.error("Invalid cemetery ID format:", cemeteryId);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('CimiteroMappe')
          .select('Url')
          .eq('IdCimitero', numericId)
          .order('DataInserimento', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMapUrl(data[0].Url);
        }
      } catch (err) {
        console.error("Errore nel caricamento della mappa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryMap();
  }, [cemeteryId]);

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <Map className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">Mappa del cimitero</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="ml-2">Caricamento mappa...</span>
        </div>
      ) : mapUrl ? (
        <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2">
          <img 
            src={mapUrl} 
            alt="Mappa del cimitero" 
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="text-center py-6 bg-muted/30 rounded-md">
          <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground mb-2">Mappa non disponibile per questo cimitero</p>
        </div>
      )}
    </div>
  );
};

export default CemeteryMapSection;
