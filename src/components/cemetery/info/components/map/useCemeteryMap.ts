
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
          .select('Indirizzo, Latitudine, Longitudine, city, postal_code, state, country, custom_map_marker_id')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        console.log("Cemetery data retrieved:", data);
        setCemetery(data);
        
        // Handle map URL based on custom map setting
        if (useCustomMap) {
          console.log("Using custom map view, generating URL...");
          
          // Extract the clean marker ID by removing any URL parameters
          let cleanMarkerId = null;
          if (data.custom_map_marker_id) {
            // Extract just the marker ID without any URL parameters
            cleanMarkerId = data.custom_map_marker_id.split(/[&?]/)[0];
            console.log("Clean marker ID extracted:", cleanMarkerId);
          }
          
          // Verifica se è stato configurato un ID di marker personalizzato
          if (cleanMarkerId) {
            console.log("Custom marker ID found:", cleanMarkerId);
            
            // Costruisci l'URL con l'ID del marker come parametro msid
            // Aggiunto parametro z=18 per impostare uno zoom più elevato sul marker
            const customEmbedUrl = `https://www.google.com/maps/d/embed?mid=${customMapId}&ehbc=2E312F&msid=${cleanMarkerId}&z=18`;
            console.log("Custom map URL with marker ID:", customEmbedUrl);
            setMapUrl(customEmbedUrl);
            
            toast.success(
              "Marker personalizzato associato trovato e visualizzato nella mappa",
              { duration: 3000 }
            );
          } else if (data.Latitudine && data.Longitudine) {
            // Se non c'è un ID marker, ma ci sono le coordinate, centra solo la mappa
            const customEmbedUrl = `https://www.google.com/maps/d/embed?mid=${customMapId}&ll=${data.Latitudine},${data.Longitudine}&z=16`;
            console.log("Custom map URL with coordinates (no marker):", customEmbedUrl);
            setMapUrl(customEmbedUrl);
            
            toast.info(
              "La mappa personalizzata è centrata sulla posizione del cimitero. Per visualizzare il marker, aggiungi l'ID del marker nelle impostazioni del cimitero.",
              { duration: 5000 }
            );
          } else {
            // Non ci sono né ID marker né coordinate
            const customEmbedUrl = `https://www.google.com/maps/d/embed?mid=${customMapId}`;
            console.log("Custom map URL without coordinates or marker ID:", customEmbedUrl);
            setMapUrl(customEmbedUrl);
          }
        } else if (data.Latitudine || data.Indirizzo) {
          console.log("Using standard map view, generating URL...");
          // Standard Google Maps view with marker
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
          console.log("Standard map URL:", standardMapUrl);
          setMapUrl(standardMapUrl);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei dati del cimitero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryData();
  }, [cemeteryId, apiKey, apiKeyError, useCustomMap]);

  // Function to extract a clean marker ID
  const getCleanMarkerId = () => {
    if (!cemetery?.custom_map_marker_id) return null;
    return cemetery.custom_map_marker_id.split(/[&?]/)[0];
  };

  return {
    loading,
    cemetery,
    mapUrl,
    apiKeyError,
    useCustomMap,
    setUseCustomMap,
    customMapId,
    hasCustomMapMarker: !!cemetery?.custom_map_marker_id,
    getCleanMarkerId
  };
};
