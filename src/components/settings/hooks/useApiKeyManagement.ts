
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useApiKeyManagement() {
  const [googleMapsKey, setGoogleMapsKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  // Fetch existing API key on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log("Fetching API key from database...");
        const { data, error } = await supabase
          .from('api_keys')
          .select('id, googlemaps_key')
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching API keys:", error);
          toast.error("Errore nel recuperare l'API key: " + error.message);
          throw error;
        }
        
        console.log("API key fetch result:", data ? "Key found" : "No key found");
        
        if (data) {
          setKeyId(data.id);
          if (data.googlemaps_key) {
            setHasExistingKey(true);
            // Create masked version of the key (showing only last 4 characters)
            const keyLength = data.googlemaps_key.length;
            if (keyLength > 4) {
              const masked = '•'.repeat(keyLength - 4) + data.googlemaps_key.slice(-4);
              setMaskedKey(masked);
            } else {
              setMaskedKey('•'.repeat(keyLength));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
        toast.error("Errore nel recuperare l'API key");
      }
    };

    fetchApiKey();
  }, []);

  const handleSaveGoogleMapsKey = async () => {
    if (!googleMapsKey.trim()) return;
    
    try {
      setLoading(true);
      console.log("Saving Google Maps API key to database...");
      
      // If we have an existing key ID, update it, otherwise insert a new record
      const { error, data } = await supabase
        .from('api_keys')
        .upsert({ 
          id: keyId || undefined, // Let Supabase generate a UUID if none exists
          googlemaps_key: googleMapsKey,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Error saving API key:", error);
        toast.error("Errore nel salvare l'API key: " + error.message);
        throw error;
      }

      console.log("API key saved successfully:", data);
      
      // Show toast notification
      toast.success("API key salvata con successo");
      
      // Update UI state
      setHasExistingKey(true);
      const keyLength = googleMapsKey.length;
      if (keyLength > 4) {
        const masked = '•'.repeat(keyLength - 4) + googleMapsKey.slice(-4);
        setMaskedKey(masked);
      } else {
        setMaskedKey('•'.repeat(keyLength));
      }
      
      setGoogleMapsKey("");
      setShowKey(false);
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Errore nel salvare l'API key");
    } finally {
      setLoading(false);
    }
  };

  const testGoogleMapsApi = async () => {
    try {
      setTestLoading(true);
      console.log("Testing Google Maps API...");
      
      // First get the API key from the database or use the one being entered
      let keyToTest = googleMapsKey.trim();
      
      if (!keyToTest) {
        const { data, error } = await supabase
          .from('api_keys')
          .select('googlemaps_key')
          .single();
        
        if (error) {
          console.error("Error fetching API key for testing:", error);
          toast.error("Errore nel recuperare l'API key per il test: " + error.message);
          throw error;
        }
        
        if (!data?.googlemaps_key) {
          console.warn("No API key found for testing");
          toast.error("Nessuna API key di Google Maps trovata");
          return;
        }
        
        keyToTest = data.googlemaps_key;
      }
      
      // Test the Google Maps API with a simple geocoding request
      const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Roma,Italia&key=${keyToTest}`;
      console.log("Making test request to Google Maps API...");
      const response = await fetch(testUrl);
      const result = await response.json();
      
      console.log("Google Maps API test result:", result);
      
      if (result.status === "OK") {
        toast.success("Test dell'API di Google Maps completato con successo");
      } else if (result.error_message) {
        console.error("Google Maps API test failed:", result.error_message);
        toast.error(`Errore nel test dell'API: ${result.error_message}`);
      } else {
        console.error("Google Maps API test failed:", result.status);
        toast.error(`Errore nel test dell'API: ${result.status}`);
      }
    } catch (error: any) {
      console.error("Error testing API key:", error);
      toast.error("Errore durante il test dell'API key: " + (error?.message || "Errore sconosciuto"));
    } finally {
      setTestLoading(false);
    }
  };

  const toggleKeyVisibility = () => {
    setShowKey(!showKey);
  };

  return {
    googleMapsKey,
    setGoogleMapsKey,
    maskedKey,
    showKey,
    loading,
    testLoading,
    hasExistingKey,
    handleSaveGoogleMapsKey,
    testGoogleMapsApi,
    toggleKeyVisibility
  };
}
