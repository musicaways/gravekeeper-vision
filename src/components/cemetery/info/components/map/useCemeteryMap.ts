
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildMapUrl } from "./mapUtils";
import { toast } from "sonner";

export const useCemeteryMap = (cemeteryId: string | number) => {
  const [loading, setLoading] = useState(true);
  const [cemetery, setCemetery] = useState<any>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  const [useCustomMap, setUseCustomMap] = useState(false);
  
  // Standard Google Maps ID (no longer using customized My Maps)
  const customMapId = "";

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
          
          // Salva la chiave API in localStorage per essere utilizzata da useGoogleMapsApi hook
          localStorage.setItem('googleMapsApiKey', data.googlemaps_key);
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
        if (!cemeteryId) {
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
          .select('Indirizzo, Latitudine, Longitudine, city, postal_code, state, country, custom_map_marker_id, Nome')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        console.log("Cemetery data retrieved:", data);
        setCemetery(data);
        
        // Generiamo l'URL della mappa solo se abbiamo la API key
        // (per retrocompatibilità con la visualizzazione iframe)
        if (apiKey) {
          // Always use satellite view with embedded marker
          if (data.Latitudine && data.Longitudine) {
            const standardMapUrl = buildMapUrl(
              apiKey, 
              data.Latitudine, 
              data.Longitudine, 
              data.Indirizzo, 
              data.city, 
              data.postal_code, 
              data.state, 
              data.country
            );
            
            console.log("Standard map URL with marker:", standardMapUrl);
            setMapUrl(standardMapUrl);
          } else if (data.Indirizzo) {
            // Fallback to address if no coordinates
            const addressMapUrl = buildMapUrl(
              apiKey,
              null,
              null,
              data.Indirizzo,
              data.city,
              data.postal_code,
              data.state,
              data.country
            );
            
            console.log("Address-based map URL:", addressMapUrl);
            setMapUrl(addressMapUrl);
          } else {
            // No location data available
            setMapUrl(null);
          }
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati del cimitero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryData();
  }, [cemeteryId, apiKey]);

  // Simplified as we're no longer using custom maps with marker IDs
  const getCleanMarkerId = () => null;

  return {
    loading,
    cemetery,
    mapUrl,
    apiKeyError,
    useCustomMap: false, // Always use standard map
    setUseCustomMap: () => {}, // No-op as we're not toggling
    customMapId,
    hasCustomMapMarker: false,
    getCleanMarkerId
  };
};
