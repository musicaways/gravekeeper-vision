
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
    // Extract just the basic marker ID if it contains additional URL params
    let cleanMarkerId = initialMarkerId;
    if (initialMarkerId && (initialMarkerId.includes('&') || initialMarkerId.includes('?'))) {
      // Try to extract just the ID part before any parameters
      const parts = initialMarkerId.split(/[&?]/);
      cleanMarkerId = parts[0];
      console.log("Cleaned marker ID from:", initialMarkerId, "to:", cleanMarkerId);
    }
    
    setSelectedMarkerId(cleanMarkerId || null);
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
    
    // If we have a selected marker ID and we're re-opening the dialog
    // Important: Use proper msid parameter and ensure high zoom
    if (selectedMarkerId) {
      // Make sure we're using just the marker ID without extra URL parameters
      const cleanId = selectedMarkerId.split(/[&?]/)[0];
      url += `&msid=${cleanId}&z=18`;
      console.log("Including marker ID in URL with high zoom:", cleanId);
    }
    
    return url;
  };

  const mapUrl = buildMapUrl();

  // Simple iframe loading handler - no script injection
  const handleIframeLoad = () => {
    setMapLoaded(true);
    setMapError(null);
    console.log("Mappa caricata correttamente");
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
      // Clean marker ID if it contains URL parameters
      const cleanId = selectedMarkerId.split(/[&?]/)[0];
      onSelect(cleanId);
      toast.success("ID marker importato con successo");
      return true;
    } else {
      toast.error("Seleziona prima un marker dalla mappa");
      return false;
    }
  };

  // Manual marker ID input (primary method due to security restrictions)
  const handleManualInput = () => {
    const userInput = prompt("Inserisci manualmente l'ID del marker:");
    if (userInput && userInput.trim()) {
      // Clean any URL parameters if they were accidentally included
      const cleanId = userInput.trim().split(/[&?]/)[0];
      setSelectedMarkerId(cleanId);
      toast.success("ID marker impostato manualmente");
    }
  };

  // Handle URL input for marker extraction
  const handleUrlInput = () => {
    const userInput = prompt("Incolla l'URL completo del marker:");
    if (userInput && userInput.trim()) {
      // Try to extract marker ID from URL using different methods
      
      // Method 1: Look for msid parameter
      const msidMatch = userInput.match(/[?&]msid=([^&#]*)/);
      if (msidMatch && msidMatch[1]) {
        const cleanId = msidMatch[1].split(/[&?]/)[0];
        setSelectedMarkerId(cleanId);
        toast.success("ID marker estratto con successo dall'URL");
        return;
      }
      
      // Method 2: Look for any alphanumeric ID in the URL
      const idMatch = userInput.match(/([a-zA-Z0-9_-]{10,})/);
      if (idMatch && idMatch[1]) {
        const possibleId = idMatch[1];
        setSelectedMarkerId(possibleId);
        toast.success("Possibile ID marker estratto dall'URL. Verifica che sia corretto.");
        return;
      }
      
      toast.error("Impossibile trovare l'ID del marker nell'URL fornito");
    }
  };

  // Add listener for marker selection messages from Google Maps iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security check to ensure message is coming from Google
      if (!event.origin.includes('google.com')) return;
      
      try {
        // Attempt to parse marker selection data
        if (typeof event.data === 'string' && event.data.includes('marker')) {
          const data = JSON.parse(event.data);
          if (data.markerId) {
            console.log("Marker selected from map:", data.markerId);
            setSelectedMarkerId(data.markerId);
            toast.success("Marker selezionato dalla mappa");
          }
        }
      } catch (e) {
        console.error("Error processing message from map:", e);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return {
    mapLoaded,
    showInstructions,
    selectedMarkerId,
    mapError,
    mapUrl,
    iframeRef,
    setShowInstructions,
    handleIframeLoad,
    handleIframeError,
    confirmSelection,
    handleManualInput,
    handleUrlInput,
    setSelectedMarkerId
  };
}
