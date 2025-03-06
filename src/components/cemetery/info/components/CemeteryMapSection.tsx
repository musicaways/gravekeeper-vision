import React, { useState, useEffect } from "react";
import { Map, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CemeteryMapSectionProps {
  cemeteryId: string | number;
}

const CemeteryMapSection = ({ cemeteryId }: CemeteryMapSectionProps) => {
  const [loading, setLoading] = useState(true);
  const [cemetery, setCemetery] = useState<any>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [useCustomMap, setUseCustomMap] = useState(false);
  
  // ID della mappa personalizzata di Google My Maps
  const customMapId = "1dzlxUTK3bz-7kChq1HASlXEpn6t5uQ8";

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log("Fetching Google Maps API key...");
        const { data, error } = await supabase
          .from('api_keys')
          .select('googlemaps_key')
          .single();
        
        if (!error && data?.googlemaps_key) {
          console.log("API key retrieved successfully");
          setApiKey(data.googlemaps_key);
        } else {
          console.error("API key not found or error:", error);
          setApiKeyError(true);
        }
      } catch (err) {
        console.error("Error fetching API key:", err);
        setApiKeyError(true);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    const fetchCemeteryData = async () => {
      try {
        if (!cemeteryId || !apiKey) {
          if (!apiKey && !apiKeyError) {
            // Still loading the API key, don't show error yet
            return;
          }
          setLoading(false);
          return;
        }

        // Convert cemeteryId to number if it's a string
        const numericId = typeof cemeteryId === 'string' ? parseInt(cemeteryId, 10) : cemeteryId;
        
        if (isNaN(numericId)) {
          console.error("Invalid cemetery ID format:", cemeteryId);
          setLoading(false);
          return;
        }

        console.log("Fetching cemetery data for ID:", numericId);
        const { data, error } = await supabase
          .from('Cimitero')
          .select('Indirizzo, Latitudine, Longitudine, city, postal_code, state, country')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        console.log("Cemetery data retrieved:", data);
        setCemetery(data);
        
        // Se useCustomMap è true, utilizziamo la mappa personalizzata ma includiamo il marker della posizione
        if (useCustomMap && data.Latitudine && data.Longitudine) {
          // Utilizziamo l'embed di Google Maps standard ma centrato sulla posizione del cimitero
          // aggiungendo anche il riferimento alla mappa personalizzata come strato aggiuntivo
          const embeddedCustomMapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${data.Latitudine},${data.Longitudine}&zoom=16&maptype=satellite`;
          setMapUrl(embeddedCustomMapUrl);
          console.log("Custom map URL set with coordinates for marker");
          
          // Notifica all'utente che il marker verrà visualizzato solo nella vista standard
          toast.info("Il marker della posizione è visibile solo nella vista standard. Per vedere la mappa personalizzata, aprila in Google Maps.", {
            duration: 5000
          });
          
          // Modifichiamo il comportamento per aprire la mappa personalizzata in Google Maps
          setTimeout(() => {
            const customMapUrl = `https://www.google.com/maps/d/viewer?mid=${customMapId}`;
            window.open(customMapUrl, '_blank');
            // Torniamo alla vista standard dopo aver aperto la mappa personalizzata
            setUseCustomMap(false);
          }, 500);
        } else if (data.Latitudine && data.Longitudine) {
          // Altrimenti utilizziamo la visualizzazione satellitare normale
          setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${data.Latitudine},${data.Longitudine}&zoom=16&maptype=satellite`);
          console.log("Map URL set with coordinates and satellite view");
        } else if (data.Indirizzo) {
          const address = [
            data.Indirizzo,
            data.city,
            data.postal_code,
            data.state,
            data.country
          ].filter(Boolean).join(', ');
          
          setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&zoom=16&maptype=satellite`);
          console.log("Map URL set with address and satellite view");
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati del cimitero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryData();
  }, [cemeteryId, apiKey, apiKeyError, useCustomMap]);

  const handleOpenMapInNewTab = () => {
    if (!cemetery) return;
    
    if (useCustomMap) {
      // Apri la mappa personalizzata in una nuova scheda e centra sulla posizione del cimitero
      let url = `https://www.google.com/maps/d/viewer?mid=${customMapId}`;
      if (cemetery.Latitudine && cemetery.Longitudine) {
        url += `&ll=${cemetery.Latitudine},${cemetery.Longitudine}&z=16`;
      }
      window.open(url, '_blank');
      return;
    }
    
    let url = "";
    if (cemetery.Latitudine && cemetery.Longitudine) {
      // Per Google Maps in una nuova scheda, usiamo t=k (satellite view) per il parametro della visualizzazione satellitare
      url = `https://www.google.com/maps/search/?api=1&query=${cemetery.Latitudine},${cemetery.Longitudine}&t=k`;
      console.log("Opening external map with coordinates and satellite view");
    } else if (cemetery.Indirizzo) {
      const address = [
        cemetery.Indirizzo,
        cemetery.city,
        cemetery.postal_code,
        cemetery.state,
        cemetery.country
      ].filter(Boolean).join(', ');
      
      // Per Google Maps in una nuova scheda, usiamo t=k (satellite view) per il parametro della visualizzazione satellitare
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}&t=k`;
      console.log("Opening external map with address and satellite view");
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  const toggleMapType = () => {
    setUseCustomMap(!useCustomMap);
    console.log(`Switched to ${!useCustomMap ? 'custom' : 'standard'} map view`);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Map className="h-5 w-5 text-primary mr-2.5" />
          <h3 className="text-base font-medium text-foreground">Mappa del cimitero</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMapType}
          className="text-xs"
        >
          {useCustomMap ? "Visualizza mappa standard" : "Visualizza mappa personalizzata"}
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="ml-2">Caricamento mappa...</span>
        </div>
      ) : apiKeyError && !useCustomMap ? (
        <div className="text-center py-6 bg-muted/30 rounded-md">
          <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground mb-2">API key di Google Maps non configurata correttamente</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/settings'}
            className="text-xs"
          >
            Configura nelle impostazioni
          </Button>
        </div>
      ) : mapUrl ? (
        <div className="space-y-2">
          <div className="rounded-md overflow-hidden border border-border h-[400px] mt-2">
            <iframe 
              src={mapUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa del cimitero"
              onError={() => {
                if (!useCustomMap) {
                  setApiKeyError(true);
                  toast.error("Errore nel caricamento della mappa: API key non valida");
                } else {
                  toast.error("Errore nel caricamento della mappa personalizzata");
                  setUseCustomMap(false);
                }
              }}
            ></iframe>
          </div>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenMapInNewTab}
              className="flex items-center gap-1 text-xs"
            >
              <Navigation className="h-3.5 w-3.5" />
              Apri in Google Maps
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-muted/30 rounded-md">
          <Map className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-muted-foreground mb-2">Posizione non disponibile per questo cimitero</p>
        </div>
      )}
    </div>
  );
};

export default CemeteryMapSection;
