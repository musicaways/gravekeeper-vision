
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

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .select('googlemaps_key')
          .single();
        
        if (!error && data?.googlemaps_key) {
          setApiKey(data.googlemaps_key);
        } else {
          setApiKeyError(true);
          console.error("API key not found or error:", error);
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

        const { data, error } = await supabase
          .from('Cimitero')
          .select('Indirizzo, Latitudine, Longitudine, city, postal_code, state, country')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        setCemetery(data);
        
        if (data.Latitudine && data.Longitudine) {
          setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${data.Latitudine},${data.Longitudine}&zoom=16`);
        } else if (data.Indirizzo) {
          const address = [
            data.Indirizzo,
            data.city,
            data.postal_code,
            data.state,
            data.country
          ].filter(Boolean).join(', ');
          
          setMapUrl(`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(address)}&zoom=16`);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati del cimitero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryData();
  }, [cemeteryId, apiKey, apiKeyError]);

  const handleOpenMapInNewTab = () => {
    if (!cemetery) return;
    
    let url = "";
    if (cemetery.Latitudine && cemetery.Longitudine) {
      url = `https://www.google.com/maps/search/?api=1&query=${cemetery.Latitudine},${cemetery.Longitudine}`;
    } else if (cemetery.Indirizzo) {
      const address = [
        cemetery.Indirizzo,
        cemetery.city,
        cemetery.postal_code,
        cemetery.state,
        cemetery.country
      ].filter(Boolean).join(', ');
      
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

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
      ) : apiKeyError ? (
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
                setApiKeyError(true);
                toast.error("Errore nel caricamento della mappa: API key non valida");
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
