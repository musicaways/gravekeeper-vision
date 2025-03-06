
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
    
    // If we have a selected marker ID and we're re-opening the dialog, include it and set zoom to 18
    if (initialMarkerId) {
      url += `&msid=${initialMarkerId}&z=18`;
      console.log("Including initial marker ID in URL with high zoom:", initialMarkerId);
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
      onSelect(selectedMarkerId);
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
      setSelectedMarkerId(userInput.trim());
      toast.success("ID marker impostato manualmente");
    }
  };

  // Handle URL input for marker extraction
  const handleUrlInput = () => {
    const userInput = prompt("Incolla l'URL completo del marker:");
    if (userInput && userInput.trim()) {
      // Try to extract marker ID from URL
      const msidMatch = userInput.match(/[?&]msid=([^&#]*)/);
      if (msidMatch && msidMatch[1]) {
        setSelectedMarkerId(msidMatch[1]);
        toast.success("ID marker estratto con successo dall'URL");
      } else {
        toast.error("Impossibile trovare l'ID del marker nell'URL fornito");
      }
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
    handleIframeLoad,
    handleIframeError,
    confirmSelection,
    handleManualInput,
    handleUrlInput,
    setSelectedMarkerId
  };
}
