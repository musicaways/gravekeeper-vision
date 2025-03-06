
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCemeteryMap = (cemeteryId: string | number) => {
  const [loading, setLoading] = useState(true);
  const [cemetery, setCemetery] = useState<any>(null);
  const [apiKeyError, setApiKeyError] = useState(false);
  
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
          
          // Save the API key in localStorage for useGoogleMapsApi hook
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

  // Fetch cemetery data
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
          .select('Indirizzo, Latitudine, Longitudine, city, postal_code, state, country, Nome')
          .eq('Id', numericId)
          .single();
        
        if (error) throw error;
        
        console.log("Cemetery data retrieved:", data);
        setCemetery(data);
      } catch (err) {
        console.error("Errore nel caricamento dei dati del cimitero:", err);
        toast.error("Impossibile caricare i dati del cimitero");
      } finally {
        setLoading(false);
      }
    };

    fetchCemeteryData();
  }, [cemeteryId]);

  return {
    loading,
    cemetery,
    apiKeyError,
    customMapId
  };
};
