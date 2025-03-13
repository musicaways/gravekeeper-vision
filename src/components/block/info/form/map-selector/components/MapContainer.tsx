
import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";
import { ErrorDisplay } from ".";

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  initialLat: number;
  initialLng: number;
  initializeMarker: (map: any, position: {lat: number, lng: number}) => any;
  setMarker: (marker: any) => void;
  setSelectedPosition: (position: {lat: number, lng: number} | null) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapRef,
  initialLat,
  initialLng,
  initializeMarker,
  setMarker,
  setSelectedPosition
}) => {
  const { isLoaded, isError, loadingError } = useGoogleMapsApi();
  const { toast } = useToast();
  const mapInitializedRef = useRef(false);

  // Initialize map once Google Maps API is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;
    
    // Use ref to prevent reinitializing the map and causing infinite loops
    if (mapInitializedRef.current) return;
    mapInitializedRef.current = true;

    try {
      // Create the map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 18,
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeId: window.google.maps.MapTypeId.HYBRID,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_RIGHT,
        },
        gestureHandling: "greedy", // Enables one-finger pan on mobile
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
      });

      // Create initial marker if we have initial coordinates
      if (initialLat && initialLng) {
        const initialPosition = { lat: initialLat, lng: initialLng };
        const newMarker = initializeMarker(map, initialPosition);
        setMarker(newMarker);
        setSelectedPosition(initialPosition);
      }

      // Add click event to the map
      window.google.maps.event.addListener(map, 'click', (event: any) => {
        if (event.latLng) {
          const clickedPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          map.panTo(clickedPosition);
          
          // Create or move the marker
          if (map.markers && map.markers[0]) {
            map.markers[0].setPosition(clickedPosition);
          } else {
            const newMarker = initializeMarker(map, clickedPosition);
            setMarker(newMarker);
          }
          
          setSelectedPosition(clickedPosition);
        }
      });

    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Si è verificato un errore durante l'inizializzazione della mappa."
      });
    }
  }, [isLoaded, initialLat, initialLng, mapRef, setMarker, setSelectedPosition, initializeMarker, toast]);

  // Handle errors
  if (isError) {
    return <ErrorDisplay errorMessage={loadingError} />;
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/40 rounded-md">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-sm">Caricamento mappa in corso...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full rounded-md" />;
};

export default MapContainer;
