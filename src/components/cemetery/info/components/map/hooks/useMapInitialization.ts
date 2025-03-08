
import { useRef, useState, useEffect, RefObject } from "react";
import { cemeteryMapStyles, getMapOptions } from "../utils/mapStyles";
import { createCemeteryMarker } from "../utils/markerUtils";

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInitializedRef = useRef(false);

  // Reset when cemetery or forceRefresh changes
  useEffect(() => {
    mapInitializedRef.current = false;
    setMapLoaded(false);
    setMap(null);
  }, [cemetery, forceRefresh]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !cemetery || mapInitializedRef.current) {
      return;
    }

    try {
      // Check for valid coordinates
      const lat = parseFloat(cemetery.Latitudine);
      const lng = parseFloat(cemetery.Longitudine);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Coordinate non valide per questo cimitero");
      }

      console.log("Initializing map with coordinates:", lat, lng);
      
      // Initialize map with custom options
      const mapOptions = getMapOptions({ lat, lng });
      
      const newMap = new window.google.maps.Map(mapRef.current, {
        ...mapOptions,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]
        }
      });
      
      // Hide the standard google maps copyright and terms text
      const styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.innerHTML = `
        .gmnoprint a, .gmnoprint span, .gm-style-cc {
          display: none;
        }
        .gmnoprint div {
          background: none !important;
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleElement);
      
      // Create cemetery marker
      createCemeteryMarker(newMap, cemetery);
      
      // Add custom controls
      const mapLoadedListener = google.maps.event.addListener(newMap, 'idle', () => {
        console.log("Map fully loaded");
        setMapLoaded(true);
      });
      
      mapInitializedRef.current = true;
      setMap(newMap);
      
      return () => {
        google.maps.event.removeListener(mapLoadedListener);
        // Clean up the style element when component unmounts
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      onError(error instanceof Error ? error.message : "Errore sconosciuto durante l'inizializzazione della mappa");
    }
  }, [isLoaded, cemetery, onError]);

  return { mapRef, map, mapLoaded };
};

export default useMapInitialization;
