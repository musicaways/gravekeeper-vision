
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlockMapDisplayProps {
  block: any;
}

const BlockMapDisplay: React.FC<BlockMapDisplayProps> = ({ block }) => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlockMap = async () => {
      try {
        if (!block || !block.Id) return;

        // Query the CimiteroMappe table for the related cemetery map
        const { data, error } = await supabase
          .from('CimiteroMappe')
          .select('Url')
          .eq('IdCimitero', block.Settore?.IdCimitero || null)
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

    fetchBlockMap();
  }, [block]);

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="px-4 md:px-6 py-4 md:py-6">
        <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
          <Map className="h-5 w-5" />
          Mappa del blocco
        </h3>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="ml-2">Caricamento mappa...</span>
          </div>
        ) : mapUrl ? (
          <div className="rounded-md overflow-hidden border border-border h-[400px] mt-4">
            <img 
              src={mapUrl} 
              alt="Mappa del blocco" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="text-center py-6 bg-muted/30 rounded-md">
            <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground mb-2">Mappa non disponibile per questo blocco</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockMapDisplay;
