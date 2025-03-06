
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
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{lat: number, lng: number} | null>(null);
  const { isLoaded, isError, loadingError } = useGoogleMapsApi();
  const { toast } = useToast();

  // Initialize map once Google Maps API is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      // Create the map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: initialLat, lng: initialLng },
        zoom: 10,
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        gestureHandling: "greedy", // Enables one-finger pan on mobile
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.RIGHT_TOP,
        },
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
      });

      setGoogleMap(map);

      // Create initial marker if we have initial coordinates
      if (initialLat && initialLng) {
        const initialPosition = { lat: initialLat, lng: initialLng };
        const newMarker = new google.maps.Marker({
          position: initialPosition,
          map: map,
          draggable: true,
          animation: google.maps.Animation.DROP
        });
        
        setMarker(newMarker);
        setSelectedPosition(initialPosition);
        
        // Add drag event to the marker
        newMarker.addListener('dragend', () => {
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
      map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const clickedPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          
          // Create or move the marker
          if (marker) {
            marker.setPosition(clickedPosition);
          } else {
            const newMarker = new google.maps.Marker({
              position: clickedPosition,
              map: map,
              draggable: true,
              animation: google.maps.Animation.DROP
            });
            
            // Add drag event to the marker
            newMarker.addListener('dragend', () => {
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
