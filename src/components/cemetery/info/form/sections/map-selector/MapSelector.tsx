
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useGoogleMapsApi } from "@/hooks/useGoogleMapsApi";

interface MapSelectorProps {
  onSelectLocation: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

const MapSelector: React.FC<MapSelectorProps> = ({ 
  onSelectLocation,
  initialLat = 41.9028,
  initialLng = 12.4964
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<any | null>(null);
  const [marker, setMarker] = useState<any | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{lat: number, lng: number} | null>(null);
  const { isLoaded, isError, loadingError } = useGoogleMapsApi();
  const { toast } = useToast();

  // Initialize map once Google Maps API is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;

    try {
      // Create the map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 10,
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

      setGoogleMap(map);

      // Create initial marker if we have initial coordinates
      if (initialLat && initialLng) {
        const initialPosition = { lat: initialLat, lng: initialLng };
        
        // Create marker with custom styling for better visibility
        const newMarker = new window.google.maps.Marker({
          position: initialPosition,
          map: map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
          // Enhanced marker styling
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#8B5CF6", // Vivid purple
            fillOpacity: 0.9,
            strokeColor: "#FFFFFF",
            strokeWeight: 2
          },
          title: "Posizione del cimitero"
        });
        
        setMarker(newMarker);
        setSelectedPosition(initialPosition);
        
        // Add drag event to the marker
        window.google.maps.event.addListener(newMarker, 'dragend', () => {
          const position = newMarker.getPosition();
          if (position) {
            setSelectedPosition({
              lat: position.lat(),
              lng: position.lng()
            });
          }
        });
      }

      // Add click event to the map
      window.google.maps.event.addListener(map, 'click', (event: any) => {
        if (event.latLng) {
          const clickedPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          // Create or move the marker
          if (marker) {
            marker.setPosition(clickedPosition);
          } else {
            // Create marker with custom styling for better visibility
            const newMarker = new window.google.maps.Marker({
              position: clickedPosition,
              map: map,
              draggable: true,
              animation: window.google.maps.Animation.DROP,
              // Enhanced marker styling
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "#8B5CF6", // Vivid purple
                fillOpacity: 0.9,
                strokeColor: "#FFFFFF",
                strokeWeight: 2
              },
              title: "Posizione del cimitero"
            });
            
            // Add drag event to the marker
            window.google.maps.event.addListener(newMarker, 'dragend', () => {
              const position = newMarker.getPosition();
              if (position) {
                setSelectedPosition({
                  lat: position.lat(),
                  lng: position.lng()
                });
              }
            });
            
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
  }, [isLoaded, initialLat, initialLng, toast]);

  // Handle errors
  if (isError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-muted/40 rounded-md p-4">
        <p className="text-center text-sm text-destructive mb-4">
          Si è verificato un errore durante il caricamento dell'API di Google Maps:
          <br />
          {loadingError || "Controlla la chiave API nelle impostazioni."}
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/settings'}
        >
          Vai alle impostazioni
        </Button>
      </div>
    );
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

  // Confirmation button
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

  return (
    <div className="w-full h-full flex flex-col">
      <div ref={mapRef} className="w-full flex-1 rounded-md mb-4" />
      
      {selectedPosition && (
        <div className="text-sm mb-2 text-center">
          <span className="font-medium">Posizione selezionata:</span> {selectedPosition.lat.toFixed(6)}, {selectedPosition.lng.toFixed(6)}
        </div>
      )}
      
      <div className="flex justify-center">
        <Button
          onClick={handleConfirm}
          disabled={!selectedPosition}
          className="px-6"
        >
          Conferma posizione
        </Button>
      </div>
    </div>
  );
};

export default MapSelector;
