
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export const useApiKeyManagement = () => {
  const [googleMapsKey, setGoogleMapsKey] = useState("");
  const [maskedKey, setMaskedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  
  const { toast } = useToast();

  // Load existing key on component mount
  useEffect(() => {
    const storedKey = localStorage.getItem("googleMapsApiKey");
    if (storedKey) {
      // Create a masked version of the key for display
      const visiblePart = storedKey.substring(0, 4);
      const maskedPart = "•".repeat(Math.max(0, storedKey.length - 8));
      const lastPart = storedKey.substring(storedKey.length - 4);
      
      setMaskedKey(`${visiblePart}${maskedPart}${lastPart}`);
      setGoogleMapsKey(showKey ? storedKey : "");
      setHasExistingKey(true);
    }
  }, [showKey]);

  // Toggle key visibility
  const toggleKeyVisibility = useCallback(() => {
    setShowKey(prev => {
      // If toggling on, load the real key
      if (!prev) {
        const storedKey = localStorage.getItem("googleMapsApiKey");
        if (storedKey) {
          setGoogleMapsKey(storedKey);
        }
      } else {
        // If toggling off, set to empty string (we'll show masked key)
        setGoogleMapsKey("");
      }
      return !prev;
    });
  }, []);

  // Save API key to localStorage
  const handleSaveGoogleMapsKey = useCallback(async () => {
    try {
      if (!googleMapsKey.trim()) {
        toast({
          title: "Errore",
          description: "La chiave API non può essere vuota",
          variant: "destructive"
        });
        return;
      }

      setLoading(true);
      
      // Optional: Validate key format (basic validation)
      if (!googleMapsKey.match(/^AIza[0-9A-Za-z-_]{35}$/)) {
        console.warn("La chiave API di Google Maps potrebbe non essere valida");
      }
      
      // Save to localStorage
      localStorage.setItem("googleMapsApiKey", googleMapsKey);
      
      // Update masked key
      const visiblePart = googleMapsKey.substring(0, 4);
      const maskedPart = "•".repeat(Math.max(0, googleMapsKey.length - 8));
      const lastPart = googleMapsKey.substring(googleMapsKey.length - 4);
      setMaskedKey(`${visiblePart}${maskedPart}${lastPart}`);
      
      setHasExistingKey(true);
      setShowKey(false);
      setGoogleMapsKey(""); // Clear input when saving
      
      toast({
        title: "Chiave API salvata",
        description: "La chiave API di Google Maps è stata salvata con successo"
      });
      
      // Test the key after saving
      await testGoogleMapsApi();
      
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio della chiave API",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [googleMapsKey, toast]);

  // Test if the API key works
  const testGoogleMapsApi = useCallback(async () => {
    try {
      setTestLoading(true);
      setTestSuccess(null);
      
      // Get the key to test
      const keyToTest = showKey ? googleMapsKey : localStorage.getItem("googleMapsApiKey");
      
      if (!keyToTest) {
        toast({
          title: "Errore",
          description: "Nessuna chiave API da testare",
          variant: "destructive"
        });
        setTestSuccess(false);
        return;
      }
      
      // Test the API key with a simple geocoding request
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Roma,Italia&key=${keyToTest}`
      );
      
      const data = await response.json();
      
      // Check if the API returns a valid response
      if (data.status === "OK") {
        setTestSuccess(true);
        toast({
          title: "Test riuscito",
          description: "La chiave API di Google Maps funziona correttamente"
        });
      } else if (data.status === "REQUEST_DENIED" || data.error_message) {
        console.error("API test failed:", data);
        setTestSuccess(false);
        toast({
          title: "Test fallito",
          description: data.error_message || "La chiave API non è valida o non ha i permessi necessari",
          variant: "destructive"
        });
      } else {
        console.warn("Unexpected API response:", data);
        setTestSuccess(false);
        toast({
          title: "Risultato non chiaro",
          description: `Stato API: ${data.status}. Controlla la console per i dettagli.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error testing API key:", error);
      setTestSuccess(false);
      toast({
        title: "Errore di connessione",
        description: "Impossibile testare la chiave API. Controlla la connessione internet.",
        variant: "destructive"
      });
    } finally {
      setTestLoading(false);
    }
  }, [googleMapsKey, showKey, toast]);

  return {
    googleMapsKey,
    setGoogleMapsKey,
    maskedKey,
    showKey,
    loading,
    testLoading,
    hasExistingKey,
    testSuccess,
    handleSaveGoogleMapsKey,
    testGoogleMapsApi,
    toggleKeyVisibility
  };
};
