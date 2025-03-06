
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseCustomMapMarkerProps {
  initialMarkerId?: string;
  customMapId: string;
  cemeteryCoordinates?: {
    latitude: number | null;
    longitude: number | null;
  };
  onSelect: (markerId: string) => void;
}

export function useCustomMapMarker({
  initialMarkerId,
  customMapId,
  cemeteryCoordinates,
  onSelect
}: UseCustomMapMarkerProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Reset state when dialog opens
  useEffect(() => {
    setSelectedMarkerId(initialMarkerId || null);
    setMapLoaded(false);
    setMapError(null);
    setShowInstructions(true);
  }, [initialMarkerId]);

  // Build map URL with coordinates if available
  const buildMapUrl = () => {
    if (!customMapId) return null;
    
    let url = `https://www.google.com/maps/d/embed?mid=${customMapId}&ehbc=2E312F`;
    
    // Add cemetery coordinates if available
    if (cemeteryCoordinates?.latitude && cemeteryCoordinates?.longitude) {
      url += `&ll=${cemeteryCoordinates.latitude},${cemeteryCoordinates.longitude}&z=16`;
      console.log("Adding cemetery coordinates to map URL:", cemeteryCoordinates);
    }
    
    return url;
  };

  const mapUrl = buildMapUrl();

  // Handle messages from the map iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "markerSelected" && data.markerId) {
          console.log("Marker selected event received:", data.markerId);
          setSelectedMarkerId(data.markerId);
          toast.success("Marker selezionato con successo!");
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Inject script into iframe after loading
  const injectScript = () => {
    setMapLoaded(true);
    setMapError(null); // Reset error on successful load
    
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        const iframeWindow = iframeRef.current.contentWindow;
        const script = document.createElement('script');
        script.textContent = window.mapInteractionScript; // Using the global script
        iframeWindow.document.body.appendChild(script);
        
        console.log('Script iniettato nell\'iframe della mappa');
      } catch (error) {
        console.error('Errore durante l\'iniezione dello script:', error);
        setMapError("Impossibile interagire con la mappa a causa di restrizioni di sicurezza");
      }
    }
  };

  // Handle iframe loading errors
  const handleIframeError = () => {
    console.error('Errore durante il caricamento della mappa');
    setMapError("Impossibile caricare la mappa. Verifica l'ID della mappa personalizzata.");
    setMapLoaded(true); // Remove loading spinner
  };

  // Confirm marker selection
  const confirmSelection = () => {
    if (selectedMarkerId) {
      onSelect(selectedMarkerId);
      toast.success("ID marker importato con successo");
      return true;
    } else {
      toast.error("Seleziona prima un marker dalla mappa");
      return false;
    }
  };

  // Manual marker ID input (fallback)
  const handleManualInput = () => {
    const userInput = prompt("Inserisci manualmente l'ID del marker:");
    if (userInput && userInput.trim()) {
      setSelectedMarkerId(userInput.trim());
      toast.success("ID marker impostato manualmente");
    }
  };

  return {
    mapLoaded,
    showInstructions,
    selectedMarkerId,
    mapError,
    mapUrl,
    iframeRef,
    setShowInstructions,
    injectScript,
    handleIframeError,
    confirmSelection,
    handleManualInput
  };
}
