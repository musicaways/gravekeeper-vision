
import React, { useState, useEffect, useRef } from "react";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";
import { Loader2 } from "lucide-react";
import BlockMapEmpty from "./components/BlockMapEmpty";

interface BlockMapDisplayProps {
  block: any;
}

const BlockMapDisplay: React.FC<BlockMapDisplayProps> = ({ block }) => {
  const { isLoaded, isError } = useGoogleMapsApi();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showError, setShowError] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !block.Latitudine || !block.Longitudine) return;
    
    try {
      // Inizializza la mappa
      const mapOptions: google.maps.MapOptions = {
        center: { lat: parseFloat(block.Latitudine), lng: parseFloat(block.Longitudine) },
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        streetViewControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        gestureHandling: "greedy", // Per consentire lo zoom con un dito su mobile
      };
      
      mapInstance.current = new google.maps.Map(mapRef.current, mapOptions);
      
      // Aggiungi il marker
      markerRef.current = new google.maps.Marker({
        position: { 
          lat: parseFloat(block.Latitudine), 
          lng: parseFloat(block.Longitudine) 
        },
        map: mapInstance.current,
        title: block.Nome || "Blocco",
        animation: google.maps.Animation.DROP,
      });
      
      setMapLoaded(true);
    } catch (error) {
      console.error("Error initializing map:", error);
      setShowError(true);
    }
  }, [isLoaded, block.Latitudine, block.Longitudine, block.Nome]);
  
  if (isError || showError || !block.Latitudine || !block.Longitudine) {
    return <BlockMapEmpty />;
  }
  
  return (
    <div className="rounded-md overflow-hidden border border-border bg-gradient-to-b from-sky-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 h-[400px] relative">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ touchAction: 'pan-x pan-y', willChange: 'transform' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default BlockMapDisplay;
