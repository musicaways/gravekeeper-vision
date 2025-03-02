
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const CemeteryMapTab = () => {
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMapPlaceholder, setShowMapPlaceholder] = useState(false);

  useEffect(() => {
    const fetchCemeteryMap = async () => {
      try {
        // Ottieni l'id del cimitero dall'URL
        const cemeteryIdStr = window.location.pathname.split('/').pop();
        
        if (!cemeteryIdStr) {
          throw new Error("ID cimitero non trovato nell'URL");
        }

        // Convert the string ID to a number
        const cemeteryId = parseInt(cemeteryIdStr, 10);
        
        if (isNaN(cemeteryId)) {
          throw new Error("ID cimitero non valido");
        }

        const { data, error } = await supabase
          .from('CimiteroMappe')
          .select('Url')
          .eq('IdCimitero', cemeteryId)
          .order('DataInserimento', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMapUrl(data[0].Url);
        } else {
          // Se non c'è una mappa, otteniamo le coordinate del cimitero per mostrare una mappa generica
          const { data: cemeteryData, error: cemeteryError } = await supabase
            .from('Cimitero')
            .select('Latitudine, Longitudine')
            .eq('Id', cemeteryId)
            .single();
          
          if (cemeteryError) throw cemeteryError;
          
          if (cemeteryData && cemeteryData.Latitudine && cemeteryData.Longitudine) {
            // Mostra mappa base con le coordinate
            setShowMapPlaceholder(true);
          } else {
            // Nessuna mappa e nessuna coordinata
            setShowMapPlaceholder(true);
          }
        }
      } catch (err) {
        console.error("Errore nel caricamento della mappa:", err);
        setError(err instanceof Error ? err.message : "Errore nel caricamento della mappa");
        setShowMapPlaceholder(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryMap();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Mappa del cimitero
        </CardTitle>
        <CardDescription>
          Visualizza la mappa interattiva del cimitero
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Caricamento mappa...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : mapUrl ? (
          <div className="rounded-md overflow-hidden border border-border h-[500px]">
            <img 
              src={mapUrl} 
              alt="Mappa del cimitero" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : showMapPlaceholder ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">Mappa non disponibile per questo cimitero</p>
            <div className="bg-muted rounded-md h-[300px] flex items-center justify-center mb-4">
              <Map className="h-16 w-16 text-muted-foreground opacity-20" />
            </div>
            <Button variant="outline">
              Carica una mappa
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
