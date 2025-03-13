
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseMapSelectorProps {
  initialLat?: number | string;
  initialLng?: number | string;
  onSelectLocation: (lat: number, lng: number) => void;
}

export function useMapSelector({ 
  initialLat = 41.9028, 
  initialLng = 12.4964,
  onSelectLocation
}: UseMapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{lat: number, lng: number} | null>(
    initialLat !== undefined && initialLng !== undefined 
      ? { 
          lat: typeof initialLat === 'string' ? parseFloat(initialLat) : initialLat, 
          lng: typeof initialLng === 'string' ? parseFloat(initialLng) : initialLng 
        } 
      : null
  );
  const { toast } = useToast();

  const handleConfirm = () => {
    if (selectedPosition) {
      onSelectLocation(selectedPosition.lat, selectedPosition.lng);
    } else {
      toast({
        variant: "default",
        title: "Nessuna posizione selezionata",
        description: "Fai clic sulla mappa per selezionare una posizione."
      });
    }
  };

  // Initialize marker on the map
  const initializeMarker = (map: any, position: {lat: number, lng: number}) => {
    // Create marker with custom styling for better visibility
    const newMarker = new window.google.maps.Marker({
      position: position,
      map: map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        scaledSize: new window.google.maps.Size(32, 32),
      },
      title: "Posizione del cimitero"
    });
    
    // Add drag event to the marker
    window.google.maps.event.addListener(newMarker, 'dragend', () => {
      const markerPosition = newMarker.getPosition();
      if (markerPosition) {
        setSelectedPosition({
          lat: markerPosition.lat(),
          lng: markerPosition.lng()
        });
      }
    });
    
    // Store marker in the map object to easily access it later
    if (!map.markers) {
      map.markers = [];
    }
    map.markers.push(newMarker);
    
    return newMarker;
  };

  return {
    mapRef,
    selectedPosition,
    handleConfirm,
    initializeMarker,
    setMarker,
    setSelectedPosition
  };
}
