
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
  const tilesLoadedListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const mapInitializedRef = useRef(false);

  useEffect(() => {
    // Only initialize the map once when conditions are met
    if (!isLoaded || !mapRef.current || !window.google?.maps || mapInitializedRef.current) return;
    
    // Cleanup function for event listeners
    const cleanup = () => {
      if (tilesLoadedListenerRef.current) {
        google.maps.event.removeListener(tilesLoadedListenerRef.current);
        tilesLoadedListenerRef.current = null;
      }
    };
    
    try {
      const { Latitudine, Longitudine, Nome } = cemetery;
      
      // Check for valid coordinates
      if (!Latitudine || !Longitudine) {
        onError("Coordinate non disponibili per questo cimitero");
        return cleanup;
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
      
      // Add tiles loaded event listener - use ref to store the listener for cleanup
      if (!mapLoaded) {
        // Use addListener with a one-time check instead of addListenerOnce which isn't available
        tilesLoadedListenerRef.current = google.maps.event.addListener(newMap, 'tilesloaded', function onTilesLoaded() {
          // Remove the listener to ensure it only fires once
          if (tilesLoadedListenerRef.current) {
            google.maps.event.removeListener(tilesLoadedListenerRef.current);
            tilesLoadedListenerRef.current = null;
          }
          setMapLoaded(true);
          toast.success("Mappa caricata con successo", { duration: 2000 });
        });
      }
      
      // Add tilt control - a custom control for toggling 45° view
      const tiltControlDiv = document.createElement('div');
      createTiltControl(tiltControlDiv, newMap);
      
      // Add the custom control to the map
      (newMap as any).controls[google.maps.ControlPosition.TOP_RIGHT].push(tiltControlDiv);
      
      // Save references
      setMap(newMap);
      setMarker(newMarker);
      mapInitializedRef.current = true;
      
      // Add listener for errors
      const errorListener = google.maps.event.addListener(newMap, 'error', () => {
        onError("Errore durante il caricamento della mappa");
      });
      
      return () => {
        // Cleanup listeners on component unmount
        if (errorListener) {
          google.maps.event.removeListener(errorListener);
        }
        cleanup();
      };
    } catch (error) {
      console.error("Errore nell'inizializzazione della mappa:", error);
      onError(error instanceof Error ? error.message : "Errore sconosciuto");
      return cleanup;
    }
  }, [isLoaded, cemetery, forceRefresh, onError, mapLoaded]);

  // Reset the initialization flag when cemetery or forceRefresh changes
  useEffect(() => {
    mapInitializedRef.current = false;
  }, [cemetery, forceRefresh]);

  return { mapRef, mapLoaded, map, marker };
};

export default useMapInitialization;
