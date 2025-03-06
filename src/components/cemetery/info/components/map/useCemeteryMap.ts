
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { handleCustomMapView, buildMapUrl } from "./mapUtils";

export const useCemeteryMap = (cemeteryId: string | number) => {
  const [loading, setLoading] = useState(true);
  const [cemetery, setCemetery] = useState<any>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [useCustomMap, setUseCustomMap] = useState(false);
  
  // ID della mappa personalizzata di Google My Maps
  const customMapId = "1dzlxUTK3bz-7kChq1HASlXEpn6t5uQ8";

  // Fetch API key
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

  // Fetch cemetery data and set up map URL
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
        
        // Handle map URL based on custom map setting
        if (useCustomMap && data.Latitudine && data.Longitudine) {
          handleCustomMapView(data, apiKey, customMapId, setMapUrl, setUseCustomMap);
        } else if (data.Latitudine || data.Indirizzo) {
          setMapUrl(buildMapUrl(
            apiKey, 
            data.Latitudine, 
            data.Longitudine, 
            data.Indirizzo, 
            data.city, 
            data.postal_code, 
            data.state, 
            data.country
          ));
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati del cimitero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryData();
  }, [cemeteryId, apiKey, apiKeyError, useCustomMap]);

  return {
    loading,
    cemetery,
    mapUrl,
    apiKeyError,
    useCustomMap,
    setUseCustomMap,
    customMapId
  };
};
