
import React, { useState, useEffect } from "react";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";
import BlockMapImage from "./components/BlockMapImage";
import BlockMapEmpty from "./components/BlockMapEmpty";

interface BlockMapDisplayProps {
  block: any;
}

const BlockMapDisplay: React.FC<BlockMapDisplayProps> = ({ block }) => {
  const { isLoaded, loadError } = useGoogleMapsApi();
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);
  
  useEffect(() => {
    if (isLoaded && block.Latitudine && block.Longitudine) {
      const zoom = 18;
      const size = "600x400";
      const scale = 2; // Retina display
      const lat = block.Latitudine;
      const lng = block.Longitudine;
      
      // Create Google Maps Static API URL with marker
      const googleMapsApiKey = localStorage.getItem('googleMapsApiKey') || process.env.VITE_GOOGLE_MAPS_API_KEY;
      setMapUrl(`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=${scale}&markers=color:blue%7C${lat},${lng}&key=${googleMapsApiKey}`);
    }
  }, [isLoaded, block]);
  
  const handleMapError = () => {
    console.error("Failed to load Google Maps image");
    setShowFallback(true);
  };
  
  if (loadError || showFallback || !block.Latitudine || !block.Longitudine) {
    return <BlockMapEmpty />;
  }
  
  if (!mapUrl) {
    return <div className="h-[400px] flex items-center justify-center">Caricamento della mappa...</div>;
  }
  
  return <BlockMapImage mapUrl={mapUrl} onError={handleMapError} />;
};

export default BlockMapDisplay;
