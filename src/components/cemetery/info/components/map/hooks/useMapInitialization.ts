
import { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getMapOptions } from '../utils/mapStyles';
import { createCemeteryMarker, createInfoWindow } from '../utils/markerUtils';
import createTiltControl from '../components/TiltControl';

interface UseMapInitializationProps {
  isLoaded: boolean;
  cemetery: any;
  forceRefresh: number;
  onError: (error: string) => void;
}

const useMapInitialization = ({
  isLoaded,
  cemetery,
  forceRefresh,
  onError
}: UseMapInitializationProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return;
    
    try {
      const { Latitudine, Longitudine, Nome } = cemetery;
      
      // Check for valid coordinates
      if (!Latitudine || !Longitudine) {
        onError("Coordinate non disponibili per questo cimitero");
        return;
      }
      
      const mapPosition = { 
        lat: parseFloat(Latitudine), 
        lng: parseFloat(Longitudine) 
      };
      
      // Get map options
      const mapOptions = getMapOptions(mapPosition);
      
      // Initialize the map
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      
      // Set the tilt to 0 after map initialization to ensure a flat view by default
      (newMap as any).setTilt(0);
      
      // Create marker
      const newMarker = createCemeteryMarker(mapPosition, newMap, Nome);
      
      // Create info window
      createInfoWindow(newMarker, newMap, cemetery);
      
      // Add tiles loaded event listener
      google.maps.event.addListener(newMap, 'tilesloaded', () => {
        if (!mapLoaded) {
          setMapLoaded(true);
          toast.success("Mappa caricata con successo", { duration: 2000 });
        }
      });
      
      // Add tilt control - a custom control for toggling 45° view
      const tiltControlDiv = document.createElement('div');
      createTiltControl(tiltControlDiv, newMap);
      
      // Add the custom control to the map
      (newMap as any).controls[google.maps.ControlPosition.TOP_RIGHT].push(tiltControlDiv);
      
      // Save references
      setMap(newMap);
      setMarker(newMarker);
      
      // Add listener for errors
      const errorListener = google.maps.event.addListener(newMap, 'error', () => {
        onError("Errore durante il caricamento della mappa");
      });
      
      return () => {
        // Cleanup listeners on component unmount
        if (errorListener) {
          google.maps.event.removeListener(errorListener);
        }
      };
    } catch (error) {
      console.error("Errore nell'inizializzazione della mappa:", error);
      onError(error instanceof Error ? error.message : "Errore sconosciuto");
    }
  }, [isLoaded, cemetery, forceRefresh, onError, mapLoaded]);

  return { mapRef, mapLoaded, map, marker };
};

export default useMapInitialization;
